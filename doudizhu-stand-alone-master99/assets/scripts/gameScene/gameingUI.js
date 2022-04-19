import myglobal from "../mygolbal.js"
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')


cc.Class({
  extends: cc.Component,

  properties: {
    gameingUI: cc.Node,
    card_prefab: cc.Prefab,
    // robUI: cc.Node, // 抢地主按钮节点
    // timeLabel: cc.Label, // 计时器节点
    cardsNode: cc.Node, // 扑克节点
    bottom_card_pos_node: cc.Node, // 底牌节点
    playingUI_node: cc.Node, // 出牌提示节点
    tipsLabel: cc.Label, //玩家出牌不合法的tips
    loseNode: cc.Node, // 失败特效节点
    winNode: cc.Node, // 胜利特效节点
    scoreNumLabel: cc.Label, // 桌子上面 牌的总点数
    score_prefab: cc.Prefab, // 得分节点
    result_prefab: cc.Prefab, // 结算

    chooseThree_prefab: cc.Prefab, // 特殊技能，三张中选一张

    skillNode: cc.Node, // 跳过 node
    skillSp: cc.Sprite, // 跳过 bg
    skillLab: cc.Label, // 跳过 txt

    scoreFaceNode: {
      type: cc.Node,
      default: []
    },
    //剩余次数颜色
    timesBg: {
      type: cc.SpriteFrame,
      default: []
    },
    fapaiAudio: {
      type: cc.AudioClip,
      default: null
    },
    jiaodizhuAudio: {
      type: cc.AudioClip,
      default: null
    },
    buqiangAudio: {
      type: cc.AudioClip,
      default: null
    },
    cardsAudio: {
      type: cc.AudioClip,
      default: null
    },
    buyaoAudio: {
      type: cc.AudioClip,
      default: []
    },
    chupaiAudio: {
      type: cc.AudioClip,
      default: null
    },
    outCard_prefab: cc.Prefab,

  },

  onLoad() {
    //自己牌列表 
    this.cards_node = []
    this.card_width = 0
    this.skipTimes = 0
    this.reverseTimes = 0
    this.randomTimes = 0
    this.exchangeTimes =0
    //当前可以抢地主的accountid
    // this.rob_player_accountid = 0
    //发牌动画是否结束
    // this.fapai_end = false
    //底牌数组
    this.bottom_card = []
    //底牌的json对象数据
    this.bottom_card_data = []
    this.choose_card_data = []
    this.outcar_zone = []

    this.push_card_tmp = []
    // 提示牌型
    this.promptCount = 0
  

    //注册监听一个选择牌消息 
    this.node.on("choose_card_event", function (cardData) {
      this.choose_card_data.push(cardData)
    }.bind(this))

    this.node.on("unchoose_card_event", function (cardId) {
      for (let i = 0; i < this.choose_card_data.length; i++) {
        if (this.choose_card_data[i].index === cardId) {
          this.choose_card_data.splice(i, 1)
        }
      }
    }.bind(this));
    if ( cc.sys.localStorage.getItem('roleData') == 2) {
      this.skipTimes = 3;
    }else if(cc.sys.localStorage.getItem('roleData') == 4 ){
      this.reverseTimes = 2;
    }else if(cc.sys.localStorage.getItem('roleData') == 3 ){
      this.randomTimes = 3;
    }else if(cc.sys.localStorage.getItem('roleData') == 1 ){
      this.exchangeTimes = 2;
    }
  },
  start() {
    var self = this;
    // 监听游戏状态
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this)
    }
    window.$socket.on('_refreshDeskScore', this._refreshDeskScore, this) // 刷新桌面分数
    window.$socket.on('_chooseCard', this._chooseCardNotify, this) // 选牌
    window.$socket.on('_unchooseCard', this._unchooseCardNotify, this) // 取消选牌
    window.$socket.on('pushcard_notify', this.pushCardNotify, this) // 发牌

    window.$socket.on('selfPlayAHandNotify', this.selfPlayAHandNotify, this) // 出牌
    window.$socket.on('rootPlayAHandNotify', this.rootPlayAHandNotify, this) // 机器出牌

    window.$socket.on('selfGetAHandNotify', this.selfGetAHandNotify, this) // 摸牌
    window.$socket.on('rootGetAHandNotify', this.rootGetAHandNotify, this) // 机器摸牌

    window.$socket.on('chooseFromThreeCard', this.chooseFromThreeCard, this) // 特殊 三张选一张
    window.$socket.on('refreshHandCard', this.refreshHandCard, this) // 刷新下自己的手牌
    
    window.$socket.on('gameEndNotify', this.gameEndNotify, this) // 游戏结束
   
    //添加一个出牌队列
    self.outcardnode = cc.instantiate(this.outCard_prefab);
    self.outcardnode.getComponent('gameOutCardUI').initdata();
    self.outcardnode.parent = this.node;
   
  },
  onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this)
    }
    window.$socket.remove('_chooseCard', this)
    window.$socket.remove('_unchooseCard', this)
    window.$socket.remove('pushcard_notify', this)
    // window.$socket.remove('canrob_notify', this)
    window.$socket.remove('selfPlayAHandNotify', this)
    window.$socket.remove('rootPlayAHandNotify', this)

    window.$socket.remove('selfGetAHandNotify', this)
    window.$socket.remove('rootGetAHandNotify', this)

    window.$socket.remove('_refreshDeskScore', this)
    window.$socket.remove('refreshHandCard', this)
    window.$socket.remove('gameEndNotify', this)
  },

  _refreshDeskScore(data){
    let self = this;
    if (data) {
      if (self.scoreNumLabel) {
        self.scoreNumLabel.string =''+ data;
      }
    }
  },
  chooseFromThreeCard(data){
    console.log('kehuduande',data);
    let self = this;
    if (data) {
      let chooseNode = cc.instantiate(self.chooseThree_prefab)
      chooseNode.parent = this.node;
      chooseNode.getComponent('chooseCard').initCardData(data);
    }
  },
  _chooseCardNotify(cardData) {
    this.choose_card_data.push(cardData)
  },
  _unchooseCardNotify(cardId) {
    for (let i = 0; i < this.choose_card_data.length; i++) {
      if (this.choose_card_data[i].index === cardId) {
        this.choose_card_data.splice(i, 1)
      }
    }
  },
  gameStateHandler(state) {
    // 开始游戏 - 已准备
    if (state === ddzConstants.gameState.GAMESTART) {
      // 关闭胜利或失败效果
      this.winNode.active = false
      this.loseNode.active = false
      // 清楚桌面上所有的牌
      this.cards_node = []
      this.bottom_card = []
      this.push_card_tmp = []
      this.cardsNode.removeAllChildren()
      this.bottom_card_pos_node.removeAllChildren()
    }
  },
  pushCardNotify(data) {
    this.card_data = data
    this.cur_index_card = data.length - 1
    this.pushCard(data)
    //左边移动定时器
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
    this.node.parent.emit("pushcard_other_event")
  },
  //处理发牌的效果
  _runactive_pushcard() {
    if (this.cur_index_card < 0) {
      // console.log("pushcard end")
      //发牌动画完成，显示抢地主按钮
      // this.fapai_end = true
      // if (this.rob_player_accountid === myglobal.playerData.userId) {
      //   this.robUI.active = true
      //   this.customSchedulerOnce()
      // }
      // if (isopen_sound) {
      //   cc.audioEngine.stop(this.fapai_audioID)
      // }
      //通知gamescene节点，倒计时
      // var sendevent = this.rob_player_accountid
      // this.node.parent.emit("canrob_event", sendevent)
      return
    }
    //原有逻辑  
    // var move_node = this.cards_node[this.cur_index_card]
    // move_node.active = true
    // var newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
    // var action = cc.moveTo(0.1, cc.v2(newx, -250));
    // move_node.runAction(action)
    // this.cur_index_card--
    // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)

    var move_node = this.cards_node[this.cards_node.length - this.cur_index_card - 1]
    move_node.active = true
    this.push_card_tmp.push(move_node)
    this.fapai_audioID = common.audio.PlayEffect(this.fapaiAudio)
    for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
      var move_node = this.push_card_tmp[i]
      var newx = move_node.x - (this.card_width * 0.4)
      var action = cc.moveTo(0.1, cc.v2(newx, -250));
      move_node.runAction(action)
    }

    this.cur_index_card--
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
  },

  //开启一个定时器
  // customSchedulerOnce() {
  //   this.count = 10;
  //   const callback = function () {
  //     if (!this.robUI.active) return
  //     if (!this.count) {
  //       // 在第六次执行回调时取消这个计时器
  //       this.robUI.active = false
  //       this.unschedule(callback)
  //       window.$socket.emit('canrob_state_notify', {
  //         userId: myglobal.playerData.userId,
  //         state: qian_state.buqiang,
  //       })
  //       common.audio.PlayEffect(this.buqiangAudio)
  //     }
  //     this.timeLabel.string = --this.count
  //   }
  //   this.schedule(callback, 1, 10)
  // },
  /**
   * @description 出牌
   */
  selfPlayAHandNotify() {
    console.log('玩家出牌提示')
   
    this.promptCount = 0
    // this.promptList = promptList
    // 先清理出牌区域
    // this.clearOutZone(myglobal.playerData.userId)
    // 显示可以出牌的UI
    this.playingUI_node.active = true;//展示出牌按钮
    this.playingUI_node.getChildByName('btn_chupai').active = true;
    this.playingUI_node.getChildByName('btn_mopai').active = false;
    //通知下一个玩家摸牌
  },

  /**
   * @description 自己摸牌
   */
   selfGetAHandNotify() {
    // this.promptList = promptList
    // 先清理出牌区域
    // 显示可以出牌的UI
    let self = this;
    this.playingUI_node.active = true;//展示摸牌按钮
    this.playingUI_node.getChildByName('btn_mopai').active = true;
    this.playingUI_node.getChildByName('btn_chupai').active = false;
   
    self.showSkillNode(2,self.skipTimes);
    self.showSkillNode(3,self.randomTimes);
    self.showSkillNode(4,self.reverseTimes);
    
  },

  showSkillNode(roleindex,skillNum){
    let bslillShow = JSON.parse(cc.sys.localStorage.getItem('roleData'))  ==  roleindex;
    let btnName = '';
    let tipsName = ''
    switch (roleindex) {
      case 1:
          btnName = 'btn_exchange';
          tipsName = 'Exchange times'
          break;
      case 2:
          btnName = 'btn_skip';
          tipsName = 'Skip times'
          break;
      case 3:
          btnName = 'btn_random';
          tipsName = 'Random times'
          break;
      case 4:
          btnName = 'btn_reverse';
          tipsName = 'Reverse times';
          break;
      default:
        break;
    }
    if (bslillShow && skillNum > 0) {
      this.playingUI_node.getChildByName(btnName).active = bslillShow; 
      this.skillLab.node.color = cc.color().fromHEX("#905a0e");
      this.skillSp.spriteFrame = this.timesBg[0];
      this.skillLab.string = tipsName+' ('+skillNum+')';
    }
    if (bslillShow) {
      this.skillNode.active =  true;
    }
  },

   /**
   * @description 机器人摸牌
   */
    rootGetAHandNotify({ userId, cards }) {
      var gameScene_script = this.node.parent.getComponent("gameScene")
      const playerNode = gameScene_script.getUserNodeByAccount(userId)
      this.playingUI_node.active = false;
      //牌面上的数字加一
      playerNode.subtractCards(-1)
      ;
      this.playingUI_node.getChildByName('btn_skip').active = false;
      this.playingUI_node.getChildByName('btn_reverse').active = false;
      this.playingUI_node.getChildByName('btn_random').active = false;
      this.playingUI_node.getChildByName('btn_exchange').active = false;
      this.skillSp.spriteFrame = this.timesBg[1];
      this.skillLab.node.color = cc.color().fromHEX("#414347");
    },
  

  // 机器出牌
  rootPlayAHandNotify({ userId, cards }) {
    var gameScene_script = this.node.parent.getComponent("gameScene")
    //获取出牌区域节点
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    // if (!outCard_node) return
    // outCard_node.removeAllChildren(true);

    // var node_cards = []
    // for (var i = 0; i < cards.length; i++) {
    //   var card = cc.instantiate(this.card_prefab)
    //   card.getComponent("card").showCards(cards[i], userId)
    //   node_cards.push(card)
    // }
    const delay = common.random(0, 5)//随机时间
    const playerNode = gameScene_script.getUserNodeByAccount(userId)
    if (!playerNode) return
    playerNode.schedulerOnce(() => {
      this.appendOtherCardsToOutZone(outCard_node, cards[0], userId)
      playerNode.subtractCards(cards.length)
      // 通知服务，下一家出牌
      window.$socket.emit('rootgetCardNotify', userId)
    }, delay)
  },
  // 游戏结束
  gameEndNotify(PlayerData ) {
    console.log('jialeliangci5555?');
    var self = this;
    console.log(PlayerData )
    ddzData.gameState = ddzConstants.gameState.WAITREADY
    self.outcardnode.getComponent('gameOutCardUI').resetData();
    //显示结算界面
    let resultSence = cc.instantiate(self.result_prefab)
    resultSence.parent = self.node;
    resultSence.getComponent('gameResult').initData(PlayerData);
    //清空每个玩家的笑脸
    for (let index = 0; index < self.scoreFaceNode.length; index++) {
        const element = self.scoreFaceNode[index];
        element.removeAllChildren();
    }
    
  },
  //对牌排序
  sortCard() {
    this.cards_node.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }
      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }
      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }
      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    })
    //这里使用固定坐标，因为取this.cards_node[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时
    var x = this.cards_node[0].x;
    var timeout = 1000
    setTimeout(function () {
      //var x = -417.6 
      console.log("sort x:" + x)
      for (let i = 0; i < this.cards_node.length; i++) {
        var card = this.cards_node[i];
        card.zIndex = i; //设置牌的叠加次序,zindex越大显示在上面
        card.x = x + card.width * 0.4 * i;
      }
    }.bind(this), timeout);
  },
  //增加牌的时候，更新下手牌
  refreshHandCard(data){
    this.playingUI_node.getChildByName('btn_random').active = false;
    this.pushOneCard(data);
  },
  pushCard(data) {
    if (data) {
      data.sort(function (a, b) {
        if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
          return b.value - a.value;
        }
        if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
          return -1;
        }
        if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return 1;
        }
        if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return b.king - a.king;
        }
      });
    }
    //创建card预制体
    this.cards_node = []
    for (var i = 0; i < 7; i++) {

      var card = cc.instantiate(this.card_prefab)
      card.scale = 0.8
      // card.parent = this.node.parent
      card.parent = this.cardsNode
      card.x = card.width * 0.4 * (-0.5) * (-6) + card.width * 0.4 * 0;
      console.log('xddddd', card.x );
      //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动
      card.y = -250
      card.active = false

      card.getComponent("card").showCards(data[i], myglobal.playerData.userId)
      //存储牌的信息,用于后面发牌效果
      this.cards_node.push(card)
      this.card_width = card.width
    }
    
  },
  
  //自己手牌添加一张牌
  pushOneCard(carddata){
    var card = cc.instantiate(this.card_prefab)
    card.scale = 0.8
    // card.parent = this.node.parent
    card.parent = this.cardsNode
    var last_card_x = this.cards_node[this.cards_node.length - 1].x

    card.x = last_card_x + ((0 + 1) * this.card_width * 0.4)
    card.y = -250  //先把底盘放在-230，在设置个定时器下移到-250的位置

    //console.log("pushThreeCard x:"+card.x)
    card.getComponent("card").showCards(carddata, myglobal.playerData.userId)
    card.active = true
    this.cards_node.push(card)
    //提示出牌
    window.$socket.emit('nextPlayerNotify', myglobal.playerData.userId)
  },

  destoryCard(userId, choose_card,skill = 0) {
    if (!choose_card.length) return
    if (skill != 1) {
      if (choose_card.length > 1) return
    }
   
    /*出牌逻辑
      1. 将选中的牌 从父节点中移除
      2. 从this.cards_node 数组中，删除 选中的牌 
      3. 将 “选中的牌” 添加到出牌区域
          3.1 清空出牌区域
          3.2 添加子节点
          3.3 设置scale
          3.4 设置position
      4.  重新设置手中的牌的位置  this.updateCards();
    */
    //1/2步骤删除自己手上的card节点 
    var destroy_card = []
    for (var i = 0; i < choose_card.length; i++) {
      for (var j = 0; j < this.cards_node.length; j++) {
        var caardIndex = this.cards_node[j].getComponent("card").caardIndex
        if (caardIndex == choose_card[i].index) {
          //this.cards_node[j].destroy()
          this.cards_node[j].removeFromParent(true);
          destroy_card.push(this.cards_node[j])
          this.cards_node.splice(j, 1)
        }
      }
    }
    if (skill != 1) {
      this.appendCardsToOutZone(userId, choose_card[0])
    }
    
    this.updateCards()
  },

  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone(userId) {
    var gameScene_script = this.node.parent.getComponent("gameScene")
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    var children = outCard_node.children;
    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy()
    }
    outCard_node.removeAllChildren(true);
  },
  //对出的牌做排序
  pushCardSort(cards) {
    if (cards.length == 1) {
      return
    }
    cards.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }
      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }
      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }
      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    })
  },
  /**
   * @description 桌面添加新牌
   * @param {cc.Node} outCard_node 玩家出牌区域节点
   * @param {List} cards 牌型节点集合
   *
   */
  appendOtherCardsToOutZone(outCard_node, carddata, userID) {
    var self = this;

    common.audio.PlayEffect(this.chupaiAudio)
 
    //添加到出牌堆里面
    self.outcardnode.getComponent('gameOutCardUI').updateData(carddata);
    //计算得分,处理牌数据
    var gameScene_script = this.node.parent.getComponent("gameScene");
    var userindex = gameScene_script.getUserIndexNodeByAccount(userID);
    var scorePrefab = cc.instantiate(self.score_prefab) 
    scorePrefab.parent = self.scoreFaceNode[userindex]
    var scoreBool = self.outcardnode.getComponent('gameOutCardUI').calcDeskScore();
    let scoreNum = 12;
    if (scoreBool == true) {
      //给当前玩家加分
      scorePrefab.getComponent('scoreFace').initdata(scoreNum);
    }else if(scoreBool == false){
      scorePrefab.getComponent('scoreFace').initdata(scoreNum*(-1));
      scoreNum= (-1)* scoreNum;
    }
    //发服务器记录每个玩家的分数
    window.$socket.emit('updateUserScore',userID,scoreNum)

    
  },
  //将 “选中的牌” 添加到出牌区域
  //destroy_card是玩家本次出的牌
  appendCardsToOutZone(userId, destroy_card) {
    //if (!destroy_card.length) return
    //先给本次出的牌做一个排序
    // this.pushCardSort(destroy_card)
    var gameScene_script = this.node.parent.getComponent("gameScene")
    //获取出牌区域节点
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    this.appendOtherCardsToOutZone(outCard_node, destroy_card, userId)
    //sconsole.log("OutZone:"+outCard_node.name)
  },

  //重新排序手上的牌,并移动
  updateCards() {
    var zeroPoint = this.cards_node.length / 2;
    //var last_card_x = this.cards_node[this.cards_node.length-1].x
    for (var i = 0; i < this.cards_node.length; i++) {
      var cardNode = this.cards_node[i]
      var x = (i - zeroPoint) * (this.card_width * 0.4) + 50;
      cardNode.setPosition(x, -250);
    }
  },

  playPushCardSound(card_name) {
    console.log("playPushCardSound:" + card_name)
    if (card_name == "") return
    switch (card_name) {
      case CardsValue.one.name:
        break
      case CardsValue.double.name:
        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3"))
        }
        break
    }
  },
  // update (dt) {},
  onButtonClick(event, customData) {
    let self = this;
    switch (customData) {
      case "nopushcard":  // 不出牌
        // myglobal.socket.request_buchu_card([], null)
        window.$socket.emit('nextPlayerNotify', myglobal.playerData.userId)
        const index = common.random(0, 3)
        common.audio.PlayEffect(this.buyaoAudio[index])
        this.choose_card_data = []
        this.cards_node.map(node => node.emit("reset_card_flag"))
        this.playingUI_node.active = false
        break
      case "getcard"://摸一张牌上来
          window.$socket.emit('getCardNotify', {
            userId: myglobal.playerData.userId,
          }, ({carddata}) => {
            if (carddata) {
              // this.destoryCard(myglobal.playerData.userId, this.choose_card_data)
              this.playingUI_node.active = false;
              //显示当前牌
              self.pushOneCard(carddata);
              self.showSkillNode(1,self.exchangeTimes);
              var gameScene_script = this.node.parent.getComponent("gameScene")
              const playerNode = gameScene_script.getUserNodeByAccount(myglobal.playerData.userId)
              //牌面上的数字加一
              playerNode.subtractCards(-1)
            } else {
              //出牌失败，把选择的牌归位
              // this.cards_node.map(node => node.emit("reset_card_flag"))
              // for (let i = 0; i < this.cards_node.length; i++) {
              //   this.cards_node[i].emit("reset_card_flag")
              // }
            }
            // this.choose_card_data = []
          })
          this.playingUI_node.getChildByName('btn_skip').active = false; 
          this.playingUI_node.getChildByName('btn_reverse').active = false; 
          break
      case "pushcard":   // 出牌
        //先获取本次出牌数据
        if (this.choose_card_data.length == 0) {
          this.tipsLabel.string = "Please select the card to play!"
          setTimeout(function () {
            this.tipsLabel.string = ""
          }.bind(this), 2000);
        }
        window.$socket.emit('playAHandNotify', {
          userId: myglobal.playerData.userId,
          cards: this.choose_card_data,
        }, ({state}) => {
          if (state === 1) {
            this.destoryCard(myglobal.playerData.userId, this.choose_card_data)
            this.playingUI_node.active = false;
            //处理牌面数字
            var gameScene_script = this.node.parent.getComponent("gameScene")
            const playerNode = gameScene_script.getUserNodeByAccount(myglobal.playerData.userId)
            playerNode.subtractCards(1);
          } else {
            //出牌失败，把选择的牌归位
            this.cards_node.map(node => node.emit("reset_card_flag"))
            // for (let i = 0; i < this.cards_node.length; i++) {
            //   this.cards_node[i].emit("reset_card_flag")
            // }
          }
          this.choose_card_data = []
        })
        break
      case "skip":   //跳过  == 技能2
          window.$socket.emit('playSkipNotify',myglobal.playerData.userId);
          this.skipTimes -= 1;
          //设置当前的次数 颜色  (置灰)
          this.setSkillState(this.skipTimes);
          // this.skillLab.string = 'Skip times ('+this.skipTimes+')';
          // this.skillLab.node.color = cc.color().fromHEX("#414347");
          // this.skillSp.spriteFrame = this.timesBg[1];
          // this.skillNode.active =  true;
          break;
      case "randomCard":   //随机从牌堆的三张中选一张出来s
          this.randomTimes -= 1;
          window.$socket.emit('randomThreeCard',myglobal.playerData.userId);
          this.setSkillState( this.randomTimes);
          break;
      case "reverse":   //反转出牌顺序  == 技能4
          //先跳过自己出牌
          window.$socket.emit('ChangePlayingOrder');
          window.$socket.emit('playSkipNotify',myglobal.playerData.userId);
          this.reverseTimes -= 1;
          this.setSkillState( this.reverseTimes);
          //再反转
          break;
      case "exchange":   //交换手牌和暗牌堆里面的  == 技能1
          if (this.choose_card_data.length == 0) {
            this.tipsLabel.string = "Please select the card to play!"
            setTimeout(function () {
              this.tipsLabel.string = ""
            }.bind(this), 2000);
          }

          window.$socket.emit('exchangeCard', {
            userId: myglobal.playerData.userId,
            cards: this.choose_card_data,
          }, ({state}) => {
            if (state === 1) {
              let skill = 1;
              this.destoryCard(myglobal.playerData.userId, this.choose_card_data,skill)
              // this.playingUI_node.active = ;
            } else {
              //出牌失败，把选择的牌归位
              this.cards_node.map(node => node.emit("reset_card_flag"))
            }
            this.choose_card_data = []
          })

          //先跳过自己出牌
          // this.playingUI_node.active = false;
          this.exchangeTimes -= 1;
          this.setSkillState( this.exchangeTimes);
          this.playingUI_node.getChildByName('btn_exchange').active = false;
          //再反转
          break;
      default:
        break
    }
  },

  //
  setSkillState(count){
    let roleindex =JSON.parse(cc.sys.localStorage.getItem('roleData')) ;
    let tipsName = ''
    switch (roleindex) {
      case 1:
          tipsName = 'Exchange times'
          break;
      case 2:
          tipsName = 'Skip times'
          break;
      case 3:
          tipsName = 'Random times'
          break;
      case 4:
          tipsName = 'Reverse times';
          break;
      default:
        break;
    }
    this.skillLab.string = tipsName+' ('+count+')';
    this.skillLab.node.color = cc.color().fromHEX("#414347");
    this.skillSp.spriteFrame = this.timesBg[1];
    this.skillNode.active =  true;
  }
});
