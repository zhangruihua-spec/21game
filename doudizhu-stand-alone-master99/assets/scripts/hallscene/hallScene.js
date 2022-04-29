import myglobal from "../mygolbal.js"
import callnative from "../common/CallNative"

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

    bonusBigNode:cc.Node,
    bounsSmallNode:cc.Node,
    //领取奖励节点
    bonusBigPre: cc.Prefab,
    bonusSmallPre: cc.Prefab,
    //领取的point
    bonusPointLab:cc.Label,
    bgAudio: {
      type: cc.AudioClip,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    let self = this;

    //定义原生调用的方法
    // callnative.getDeviceInfo();

  //   this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
  //     if (cc.sys.isNative&&cc.sys.os==cc.sys.OS_IOS) {
  //     let ret = jsb.reflection.callStaticMethod("AdMaster","showAd:title:","有志者事竟成","淡定");
  //     }
  //  }, this);

  //  jsb.reflection.callStaticMethod("AdMaster","showAd:title:","有志者事竟成","淡定");
    
  // window.callOCMethod = (str)=>{
  // }
    // this.bgAudioId = common.audio.PlayEffect(this.bgAudio)
    self.getIMEI = '';
    if (cc.sys.isNative&&cc.sys.os==cc.sys.OS_IOS) {
      let ret = jsb.reflection.callStaticMethod("AdMaster","showAd:title:","teste","dandng");
      self.getIMEI = ''+ret;
      self.scheduleOnce(function(){
        let url = "https://d21.huoshanyouxi.com/v1/auth/register/";
        self.requstDataNEW2(url,'POST',1,function(responseJson){
          let useid = '';
          useid = responseJson.data['id'];
          let count = useid;
          let userName = `guest_${count}`
          myglobal.playerData.userId = `${count}`
          myglobal.playerData.userName = userName
          cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
          //存一下token_type token
          cc.sys.localStorage.setItem('token', responseJson.data['token'])
          cc.sys.localStorage.setItem('token_type', responseJson.data['token_type'])
          //刷新下用户的id
          self.nickname_label.string = myglobal.playerData.userName;
          cc.director.preloadScene("gameScene")
        })

      },1);
    }
  },

  onEnable(){
    let self = this;
    cc.director.on('UPDATAPOINT', self.updataPoint, self);
  },
  onDisable() {
    cc.director.off('UPDATAPOINT');
  },
  updataPoint(){
    let self = this;
    //先获取下
    let url = "http://d21.huoshanyouxi.com/v1/users/"+ myglobal.playerData.userId;
    self.requstDataNEW2(url,'GET',2,function(responseJson){
      let point = responseJson["point"];
      //刷新先显示
      self.bonusPointLab.string = point;
      myglobal.playerData.goldcount = point;
      
    })
  },

  requstDataNEW2(urldata,msgType,msgData,callback){
    let self = this;
    var data = "";

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {

        var responseJson = JSON.parse(this.responseText);
        if (callback) {
          callback(responseJson);
        }
      }
    });

    // xhr.open("POST", "https://d21.huoshanyouxi.com/v1/auth/register/");
    xhr.open(msgType, urldata);
    // xhr.setRequestHeader("IMEI", "werwrerrdwerwertt");
    if (msgData == 1) {
      xhr.setRequestHeader("IMEI", self.getIMEI);
    }else if(msgData == 2){
      let token_type = cc.sys.localStorage.getItem('token_type')
      let token = cc.sys.localStorage.getItem('token')
      xhr.setRequestHeader("Authorization", token_type + ' ' + token);
    }
    xhr.send(data);


    //--------------------------------------------------------------------
    // var data = '';
    // var xhr = new XMLHttpRequest();
    // // xhr.withCredentials = false;
    // xhr.addEventListener("readystatechange", function() {
    //   if(this.readyState === 4) {
    //     var response = xhr.responseText;
    //     var responseJson = JSON.parse(response);
    //     if (callback) {
    //       callback(responseJson);
    //     }
    //   }
    // });
  
    // xhr.open(msgType, urldata);
    // if (msgData == 1) {
    //   xhr.setRequestHeader("IMEI", "werwdrerrdwerwer");
    // }else if(msgData == 2){
    //   let token_type = cc.sys.localStorage.getItem('token_type')
    //   let token = cc.sys.localStorage.getItem('token')
    //   xhr.setRequestHeader("Authorization", token_type + ' ' + token);
    // }
    // xhr.send(data);
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
    let creator_Room = cc.instantiate(this.creatroom_prefabs)
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
    let url = "https://d21.huoshanyouxi.com/v1/users/"+ myglobal.playerData.userId;
    self.requstDataNEW2(url,'GET',2,function(responseJson){
      let awardData = responseJson["award_list"];
      let point = responseJson["point"];
      //刷新先显示
      self.bonusPointLab.string = ''+point;
      //显示自己本来的金额
      myglobal.playerData.goldcount = point;

      //刷新先显示
      self.bonusBigNode.removeAllChildren()
      self.bounsSmallNode.removeAllChildren()
      for (let index = 0; index < awardData.length; index++) {
        if (index < 3) {
          let bonusBigPre =cc.instantiate(self.bonusBigPre);
          bonusBigPre.parent = self.bonusBigNode;
          bonusBigPre.getComponent('bonusItem').initData(awardData[index])
        } else {
          let bonusSmallPre =cc.instantiate(self.bonusSmallPre);
          bonusSmallPre.parent = self.bounsSmallNode;
          bonusSmallPre.getComponent('bonusItem').initData(awardData[index])
        }
      }
      
    })
    
  }

});
