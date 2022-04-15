import myglobal from "../mygolbal.js"

cc.Class({
  extends: cc.Component,

  properties: {
    nickname_label: cc.Label,
    headimage: cc.Sprite,
    gobal_count: cc.Label,
    creatroom_prefabs: cc.Prefab,
    joinroom_prefabs: cc.Prefab,
    ruleNode: cc.Node,
    closeRuleBtN:cc.Button,

    closeRankBtn:cc.Button,
    // 排行榜
    rankNode: cc.Node,
    todayScorll:cc.ScrollView,
    monthScroll:cc.ScrollView,

    dayBtn:cc.Button,
    monthBtn:cc.Button,

    dayLab:cc.Node,
    monthLab:cc.Node,


  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.nickname_label.string = myglobal.playerData.userName
    cc.director.preloadScene("gameScene")
  },

  start() {

  },

  // update (dt) {},

  onButtonClick(event, customData) {
    switch (customData) {
      case "create_room":
        var creator_Room = cc.instantiate(this.creatroom_prefabs)
        creator_Room.parent = this.node
        creator_Room.zIndex = 100
        break
      case "join_room":
        var join_Room = cc.instantiate(this.joinroom_prefabs)
        join_Room.parent = this.node
        join_Room.zIndex = 100
        break
      case "openRuleSence":
        this.ruleNode.active = true;
        break
      case "openRankSence":
        this.rankNode.active = true;
        break
      default:
        break
    }
  },
  onBtnJingdian() {
    const creator_Room = cc.instantiate(this.creatroom_prefabs)
    creator_Room.parent = this.node
    creator_Room.zIndex = 100
  },
  onBtnLaizi() {
    alert('暂未开放')
  },
  onCloseRule(){
    this.ruleNode.active = false;
  },
  onCloseRank(){
    this.rankNode.active = false;
  },
  onshowRank(event, customData){
    let self = this;
    switch (customData) {
      case "day":
        //显示每天
        self.dayBtn.node.active = true;
        self.monthBtn.node.active  =false;
        self.todayScorll.node.active = true;
        self.monthScroll.node.active = false;
        self.dayLab.active = false;
        self.monthLab.active = true;
        break;
      case "month":
        //显示每个月
        self.dayBtn.node.active = false;
        self.monthBtn.node.active  =true;
        self.todayScorll.node.active = false;
        self.monthScroll.node.active = true;
        self.dayLab.active = true;
        self.monthLab.active = false;
        break;
      default:
        break;
    }

  }

});
