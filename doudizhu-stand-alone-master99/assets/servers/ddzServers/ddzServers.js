const mygolbal = require('mygolbal')
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')
const carder = require("carder")
const AILogic = require("AILogic")
const ddzServers = {
  playersData: {}, // 玩家信息，包括机器人
  // three_cards: [], // 扑克牌列表 [玩家, 机器1, 机器2, 底牌]
  landlordIndex: 0, // 谁先开始抢地主
  landlordNum: 0, // 抢地主次数
  robplayer: [], // 复制一份房间内player,做抢地主操作
  landlordId: '', // 当前地主id
  /*
    * 当前桌面牌信息
    *  roundWinId 本轮当前赢牌的玩家userId
    *  winCards 牌型信息
    */
  roundWinId: '',
  winCards: null,
  initServer() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this)
      // $socket.on('canrob_state_notify', this.canrobStateNotify, this) // 抢地主消息
      $socket.on('playAHandNotify', this.playAHandNotify, this) // 出牌消息
      $socket.on('nextPlayerNotify', this.nextPlayerNotify, this) // 出牌消息
    }
  },
  gameStateHandler(value) {
    const states = ddzConstants.gameState
    switch (value) {
      case states.INVALID: // 无效
        break
      case states.WAITREADY: // 进入房间，等待游戏
        this.roundWinId = ''
        this.winCards = null
        break
      case states.GAMESTART: // 开始游戏
        // 初始化玩家信息及牌组
        this.playersData = this.initPlayerList()
        setTimeout(() => { this.setGameState(states.PUSHCARD) }, 0)
        break
      case states.PUSHCARD: // 发牌
        window.$socket.emit('pushcard_notify', this.playersData[mygolbal.playerData.userId].cardList)
        setTimeout(() => { this.setGameState(states.PLAYING) }, 0)
        break
      case states.PLAYING: // 出牌阶段
        this.landlordId = parseInt(this.playersData.players[0])//随机一个开始出牌
        this.playCard(this.playersData[this.landlordId])
        break
      case states.GAMEEND: // 游戏结束
        const userId = mygolbal.playerData.userId
        const winPlayer = this.playersData[this.roundWinId]
        const nextPlayer1 = winPlayer.nextPlayer
        const nextPlayer2 = nextPlayer1.nextPlayer
        let isWin = this.roundWinId === userId || winPlayer.isLandlord === this.playersData[userId].isLandlord
        window.$socket.emit('gameEndNotify', {
          isWin, // 是否胜利
          otherPlayerCards: { // 其他玩家剩余手牌
            [nextPlayer1.userId]: nextPlayer1.cardList,
            [nextPlayer2.userId]: nextPlayer2.cardList
          }
        })
        break
    }
  },
  // 设置游戏状态
  setGameState(state) {
    ddzData.gameState = state
  },
  // 初始化玩家列表，包括机器人
  initPlayerList() {
    const { userId, rootList } = mygolbal.playerData
    const rightPlayerId = rootList[0].userId
    const leftPlayerId = rootList[1].userId
    const thirdPlayerId = rootList[2].userId
    const cardList = carder.splitThreeCards() // 生成新牌
    console.log('新牌', cardList)
    const playersData = {
      players: [userId, rightPlayerId, leftPlayerId,, thirdPlayerId], // 当前房间玩家id集合
      cards: cardList[3], // 底牌
      // 玩家
      [userId]: {
        isLandlord: false,
        userId,
        cardList: cardList[0],
      },
      // 右边机器人
      [rightPlayerId]: {
        isLandlord: false,
        userId: rightPlayerId,
        cardList: cardList[1],
      },
      // 左边机器人
      [leftPlayerId]: {
        isLandlord: false,
        userId: leftPlayerId,
        cardList: cardList[2],
      },
      // 第三机器人
      [thirdPlayerId]: {
        isLandlord: false,
        userId: thirdPlayerId,
        cardList: cardList[3],
      }
    }
    // 指定玩家顺序
    playersData[userId].nextPlayer = playersData[rightPlayerId]
    playersData[rightPlayerId].nextPlayer = playersData[leftPlayerId]
    playersData[leftPlayerId].nextPlayer = playersData[thirdPlayerId]
    playersData[thirdPlayerId].nextPlayer = playersData[userId]

    return playersData
  },
 
  // 下一位玩家出牌
  nextPlayerNotify(userId) {
    this.playCard(this.playersData[userId].nextPlayer)
  },
  // 发布出牌通知
  playCard(player) {
    console.log('出牌', player)
    const isOver = this.roundWinId && !this.playersData[this.roundWinId].cardList.length
    if (isOver) {
      // 游戏结束
      this.setGameState(ddzConstants.gameState.GAMEEND)
      return
    }
    const ai = new AILogic(player)
    if (player.userId === mygolbal.playerData.userId) {
      // 准备要提示的牌
      // const winc = this.roundWinId && this.roundWinId !== player.userId ? this.winCards : null
      // console.log(winc ? '玩家跟牌' : '玩家出牌')
      // const promptList = ai.prompt(winc);
      // 自己出牌
      window.$socket.emit('selfPlayAHandNotify')
    } else {
      // 机器出牌
      let result = null
      if (!this.roundWinId || this.roundWinId === player.userId) {
        // 如果本轮出牌赢牌是自己：出牌
        result = ai.play(this.playersData[this.landlordId].cardList.length)
        console.log(player.userId, 'AI出牌', result)
      } else {
        // 跟牌，根据上一轮赢家的牌型、是不是地主、还剩几张牌
        const playerData = this.playersData[this.roundWinId]
        const isLandlord = playerData.userId === this.landlordId
        result = ai.follow(this.winCards, isLandlord, playerData.cardList.length);
        console.log(player.userId, 'AI跟牌', result)
      }
      window.$socket.emit('rootPlayAHandNotify', {
        userId: player.userId,
        cards: result ? result.cardList : []
      })
      if (result) {
        // 将牌显示到出牌区域上
        for (let i = 0; i < result.cardList.length; i++) {
          // var c = self.game.add.clone(self.cardPrefab, area);
          // c.getScript('qc.engine.CardUI').show(result.cardList[i], false);
          // c.interactive = false;
          // 删除手牌信息
          for (var j = 0; j < player.cardList.length; j++) {
            if (player.cardList[j].val === result.cardList[i].val
              && player.cardList[j].shape === result.cardList[i].shape) {
              player.cardList.splice(j, 1)
              break
            }
          }
        }
  
        this.roundWinId = player.userId
        delete result.cardList;
        this.winCards = result
        // window.playUI.reDraw();
      }
    }
  },
  // 玩家自己出牌消息
  playAHandNotify({ userId, cards }, callback) {
    console.log(cards)
    const type = this.getReadyCardsKind(cards)
    console.log(type)
    // 校验出牌是否合格
    if (!type) {
      callback && callback({
        state: 0
      })
      return
    }
  
    this.winCards = type;
    this.roundWinId = userId
    callback && callback({
      state: 1
    })
    // 删除玩家出的牌
    const selfCards = this.playersData[userId].cardList
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < selfCards.length; j++) {
        cards[i].val === selfCards[j].val && cards[i].shape === selfCards[j].shape && selfCards.splice(j, 1)
      }
    }
    this.nextPlayerNotify(userId)
  },
  /**
  * @description 判断玩家选中的牌是否是正确牌型，出牌需要符合规则，跟牌需要牌型可以大过上家
  * @method getReadyCardsKind
  * @param {List} cardList 要检查的牌型列表
  * @return {Boolean}       [description]
  */
  getReadyCardsKind(cardList = []) {
    if (!cardList.length) return null;
    const type = G.gameRule.typeJudge(cardList);
    return type;
  },
}
export default ddzServers
