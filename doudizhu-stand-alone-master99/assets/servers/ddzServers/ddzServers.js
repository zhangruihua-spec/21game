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
  handCardOther: [], // 发完手牌之后剩余的牌
  bTurnOrder:0,//正常是顺时针出牌
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
      $socket.on('getCardNotify', this.getCardNotify, this) // 摸牌消息
      $socket.on('rootgetCardNotify', this.nextPlayegetCard, this) // 摸牌消息
      $socket.on('playAHandNotify', this.playAHandNotify, this) // 出牌消息
      $socket.on('playSkipNotify', this.playSkipNotify, this) // 跳过技能2  -- 不摸牌也不出牌
      $socket.on('ChangePlayingOrder', this.ChangePlayingOrder, this) // 反转技能  4
      $socket.on('randomThreeCard', this.randomThreeCard, this) // 3 随机给一张牌，技能
      $socket.on('nextPlayerNotify', this.nextPlayerNotify, this) 
      $socket.on('updateUserScore', this.updateUserScore, this) 
      $socket.on('threeSelectedCard', this.threeSelectedCard, this)  // 3  随机选牌中，选中的一张

      $socket.on('exchangeCard', this.exchangeCard, this)  // 1  改变下手牌的值，和暗牌堆交换

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
        setTimeout(() => { this.setGameState(states.GETCARD) }, 0)
        break
      case states.GETCARD: // 摸牌阶段
        //随机通知一个摸牌
        this.landlordId = parseInt(this.playersData.players[0]);
        this.getCard(this.playersData[this.landlordId])
        break
      case states.PLAYING: // 出牌阶段
        this.landlordId = parseInt(this.playersData.players[0])//随机一个开始出牌
        this.playCard(this.playersData[this.landlordId])
        break
      case states.GAMEEND: // 游戏结束
        // const userId = mygolbal.playerData.userId
        // const winPlayer = this.playersData[this.roundWinId]
        // const nextPlayer1 = winPlayer.nextPlayer
        // const nextPlayer2 = nextPlayer1.nextPlayer
        // let isWin = this.roundWinId === userId || winPlayer.isLandlord === this.playersData[userId].isLandlord
        window.$socket.emit('gameEndNotify', 
          this.playersData
        )
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
    const handcardList = cardList[4] // 剩余桌上的牌
    this.handCardOther = handcardList;
    console.log('sssc',this.handCardOther);
    console.log('新牌', cardList)
    const playersData = {
      players: [userId, rightPlayerId, leftPlayerId, thirdPlayerId], // 当前房间玩家id集合
      cards: cardList[3], // 底牌
      // 玩家
      [userId]: {
        isLandlord: false,
        userId,
        cardList: cardList[0],
        score:0,
        scoreArray:[],
      },
      // 右边机器人
      [rightPlayerId]: {
        isLandlord: false,
        userId: rightPlayerId,
        cardList: cardList[1],
        score:0,
        scoreArray:[],
      },
      // 右上机器人
      [leftPlayerId]: {
        isLandlord: false,
        userId: leftPlayerId,
        cardList: cardList[2],
        score:0,
        scoreArray:[],
      },
      // 第三机器人
      [thirdPlayerId]: {
        isLandlord: false,
        userId: thirdPlayerId,
        cardList: cardList[3],
        score:0,
        scoreArray:[],
      }
    }
    // 指定玩家顺序（顺时针）
    // playersData[userId].nextPlayer = playersData[rightPlayerId]
    // playersData[rightPlayerId].nextPlayer = playersData[leftPlayerId]
    // playersData[leftPlayerId].nextPlayer = playersData[thirdPlayerId]
    // playersData[thirdPlayerId].nextPlayer = playersData[userId]

    playersData[userId].nextPlayer = playersData[thirdPlayerId]
    playersData[thirdPlayerId].nextPlayer = playersData[leftPlayerId]
    playersData[leftPlayerId].nextPlayer = playersData[rightPlayerId]
    playersData[rightPlayerId].nextPlayer = playersData[userId]

    return playersData
  },
  //更改为逆时针方向
  ChangePlayingOrder(){
    let self = this;
    const { userId, rootList } = mygolbal.playerData
    const rightPlayerId = rootList[0].userId
    const leftPlayerId = rootList[1].userId
    const thirdPlayerId = rootList[2].userId
    if (self.bTurnOrder == 0) {
      self.bTurnOrder = 1;
      this.playersData[userId].nextPlayer = this.playersData[rightPlayerId]
      this.playersData[rightPlayerId].nextPlayer = this.playersData[leftPlayerId]
      this.playersData[leftPlayerId].nextPlayer = this.playersData[thirdPlayerId]
      this.playersData[thirdPlayerId].nextPlayer = this.playersData[userId]
    } else {
      self.bTurnOrder = 0;
      this.playersData[userId].nextPlayer =  this.playersData[thirdPlayerId]
      this.playersData[thirdPlayerId].nextPlayer =  this.playersData[leftPlayerId]
      this.playersData[leftPlayerId].nextPlayer =  this.playersData[rightPlayerId]
      this.playersData[rightPlayerId].nextPlayer =  this.playersData[userId]
    }
  },
 
  // 当前玩家出牌
  nextPlayerNotify(userId) {
    this.setGameState(ddzConstants.gameState.PLAYING)
    this.playCard(this.playersData[userId])
  },
   // 下一位玩家出牌
   nextPlayerNotifypro(userId) {
    this.setGameState(ddzConstants.gameState.PLAYING)
    this.playCard(this.playersData[userId])
  },
  // 下一位玩家摸牌
  nextPlayegetCard(userId) {
    this.setGameState(ddzConstants.gameState.GETCARD)
    //机器人摸牌
    this.getCard(this.playersData[userId].nextPlayer);
    //机器人出牌
    if (this.playersData[userId].nextPlayer.userId != mygolbal.playerData.userId) {
      this.playCard(this.playersData[userId].nextPlayer);
    }
    
  },
  //更新每个玩家的分数
  updateUserScore(userID,score){
    if (userID == mygolbal.playerData.userId ) {
      this.playersData[userID].scoreArray.push(score);
    }
    let userScore = this.playersData[userID].score;
    this.playersData[userID].score = userScore + score;
  },

  //通知摸牌
  getCard(player) {
    let self = this;
    console.log('摸牌', player);
    const ai = new AILogic(player)
    if (player.userId === mygolbal.playerData.userId) {
      //自己摸牌
        window.$socket.emit('selfGetAHandNotify');
        console.log('剩余桌面牌', self.handCardOther.length);
    } else {
      // 机器摸牌
      let restNum = self.handCardOther.length;
      self.handCardOther[restNum - 1]
      window.$socket.emit('rootGetAHandNotify', {
        userId: player.userId,
        cards:self.handCardOther[restNum - 1]
      })
      self.handCardOther.pop();
      console.log('剩余桌面牌', self.handCardOther.length);
      
    }
  },
  //技能1 随机换几张牌
  exchangeCard({ userId, cards }, callback){
    let self = this;
    // 1，判断暗牌堆里面确实足够数量的可以换
    if (self.handCardOther.length < cards.length) {
      return;
    }
     // 2，删除玩家出的牌
     const selfCards = this.playersData[userId].cardList
     for (let i = 0; i < cards.length; i++) {
       for (let j = 0; j < selfCards.length; j++) {
         cards[i].val === selfCards[j].val && cards[i].shape === selfCards[j].shape && selfCards.splice(j, 1)
       }
     }
     // 3，在暗牌中找出数量一样的牌交换
   
     let userNum = cards.length;
     let handcard = [];
     for (let index = 0; index < userNum; index++) {
        handcard.push(self.handCardOther[index]);
        window.$socket.emit('refreshHandCard',self.handCardOther[index]);
     }
    //  console.log('hhhdd--000',forChangeCardData)
     console.log('hhhdd--1111',self.handCardOther)
     self.handCardOther.splice(0,userNum,[cards])
     console.log('hhhdd--2222',self.handCardOther)

     console.log('hhhdd-333',handcard)

     callback && callback({
      state: 1
    })

     
    //  this.nextPlayegetCard(userId);

  },
  //随机出来三张牌给玩家选择一张
  randomThreeCard(player){
    let self = this;
    if (self.handCardOther.length < 3) {
      return;
    }
    console.log('dedaoindextoodll', self.handCardOther);
    let handlenght = self.handCardOther.length;
    let handIndex =  Math.round(Math.random()*handlenght);
    let threeCard =[]
    let handIndex2  = handIndex+1 < handlenght - 1 ? handIndex + 1: (handIndex+1)%(handIndex-1)
    let handIndex3  = handIndex+2 < handlenght - 1 ? handIndex + 2: (handIndex+2)%(handIndex-1)
    console.log('dedaoindex',handIndex)
    console.log('dedaoindex',handIndex2)
    console.log('dedaoindex',handIndex3)
    threeCard.push(self.handCardOther[handIndex])
    threeCard.push(self.handCardOther[handIndex2])
    threeCard.push(self.handCardOther[handIndex3])
    console.log('dedaoindexss',threeCard)
    //发送给客户端
    window.$socket.emit('chooseFromThreeCard',threeCard);
  },
  //通知服务器我选中的牌
  threeSelectedCard(data){
    let self = this;
      //1,先从牌堆删除
      console.log('yyrr-d1',self.handCardOther)
      console.log('yyrr-d2',data)
      for (let j = 0; j < self.handCardOther.length; j++) {
        const element = self.handCardOther[j];
        if ( self.handCardOther[j].index == data.index ) {
          self.handCardOther.splice(j,1);
        }
      }
      console.log('yyrr-d3',self.handCardOther)
      //2,添加到我自己的手牌上
      self.playersData[mygolbal.playerData.userId].cardList.push(data);
      window.$socket.emit('refreshHandCard',data);
      
      //3,通知我自己出牌
      self.playCard(mygolbal.playerData);
  },


  // 发布出牌通知
  playCard(player) {
    console.log('出牌-----', player)
    // const isOver = this.roundWinId && !this.playersData[this.roundWinId].cardList.length
    //最后一个玩家出完所有牌，或者所有暗牌被摸完
    // if ( player.cardList.length == 0) {
    //   // 游戏结束
    //   this.setGameState(ddzConstants.gameState.GAMEEND)
    //   return
    // }
    let self = this;
    // const ai = new AILogic(player)
    if (player.userId === mygolbal.playerData.userId) {
      // 准备要提示的牌
      // const winc = this.roundWinId && this.roundWinId !== player.userId ? this.winCards : null
      // console.log(winc ? '玩家跟牌' : '玩家出牌')
      // const promptList = ai.prompt(winc);
      // 自己先摸一张牌，再丢一张牌到牌堆
      window.$socket.emit('selfPlayAHandNotify');
    } else {
      const ai = new AILogic(player)
      // 机器出牌
      let result = null
      // if (!this.roundWinId || this.roundWinId === player.userId) {
      //   // 如果本轮出牌赢牌是自己：出牌
      //   result = ai.play(this.playersData[this.landlordId].cardList.length)
      //   console.log(player.userId, 'AI出牌', result)
      // } else {
      //   // 跟牌，根据上一轮赢家的牌型、是不是地主、还剩几张牌
      //   const playerData = this.playersData[this.roundWinId]
      //   const isLandlord = playerData.userId === this.landlordId
      //   result = ai.follow(this.winCards, isLandlord, playerData.cardList.length);
      //   console.log(player.userId, 'AI跟牌', result)
      // }
      // console.log('roundWinId',this.roundWinId);
      const playerData = this.playersData[player.userId]
      result = ai.follow(this.winCards, playerData.cardList.length);

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
  
        this.roundWinId = player.userId // 当前出牌玩家id
        delete result.cardList;
        this.winCards = result
        // window.playUI.reDraw();
      }
    }

    if (self.handCardOther.length == 0) {
      // 游戏结束
      console.log('jialeliangcddi?');
      this.setGameState(ddzConstants.gameState.GAMEEND)
      return
    }
  },
  // 玩家抓取一张牌
  getCardNotify({ userId }, callback) {

    // 增加一张的手牌
    let self = this;
    let restNum = self.handCardOther.length;
    let handData = self.handCardOther[restNum - 1]
    self.playersData[userId].cardList.push(handData);
    self.handCardOther.pop();    

    callback && callback({
      carddata: handData
    });

    //刷新下手牌显示


    // for (let i = 0; i < cards.length; i++) {
    //   for (let j = 0; j < selfCards.length; j++) {
    //     cards[i].val === selfCards[j].val && cards[i].shape === selfCards[j].shape && selfCards.splice(j, 1)
    //   }
    // }
    // this.nextPlayerNotify(userId)


    //提示出牌
  },
  //跳过出牌
  playSkipNotify(userId){
    this.nextPlayegetCard(userId);
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
    
    this.nextPlayegetCard(userId);
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
