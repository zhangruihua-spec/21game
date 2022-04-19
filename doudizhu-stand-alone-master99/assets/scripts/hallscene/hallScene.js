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
    //领取金币
    bonusNode: cc.Node,


  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    let self = this;
    let url = " https://d21.huoshanyouxi.com/v1/auth/register/";
    self.requstData(url,function(responseJson){
      let useid = '';
      useid = responseJson.data['id'];
      console.log('sdfsdf',responseJson.data['id']);
      const count = useid
      const userName = `guest_${count}`
      myglobal.playerData.userId = `${count}`
      myglobal.playerData.userName = userName
      cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
      //刷新下用户的id
      self.nickname_label.string = myglobal.playerData.userName
    })
    this.nickname_label.string = myglobal.playerData.userName
    cc.director.preloadScene("gameScene")

  },

  requstData(urldata,callback){
    let url = urldata
    let xhr = new XMLHttpRequest();
    let useid = '';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            // console.log(response);
            var responseJson = JSON.parse(response);
            // console.log('ssss',responseJson.data)
            // useid = responseJson.data['id'];
            // console.log('sdfsdf',responseJson.data['id']);
            if (callback) {
              callback(responseJson);
            }
        }
    };
    xhr.onerror = function(evt){
        console.log(evt);
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("IMEI=asdfsdgegeg");
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
      case "openBonusSence":
        this.bonusNode.active = true;
        //显示奖励界面
        this.showBonusView();
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
  onCloseBonus(){
    this.bonusNode.active = false;
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

  },
  showBonusView(){
    let self = this;
    //先获取下
    let url = " https://d21.huoshanyouxi.com/v1/users/"+ myglobal.playerData.userId;
    self.requstData(url,function(responseJson){
      console.log('qiandaoxinxi',responseJson);
    })
    
  }

});
