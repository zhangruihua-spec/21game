import myglobal from "../mygolbal.js"
cc.Class({
  extends: cc.Component,

  properties: {
    btn_ready: cc.Node, // 准备
    // btn_gamestart: cc.Node, // 开始
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {

    // this.btn_gamestart.active = false

    //监听本地的发送的消息
    // this.node.on("init", function () {
    //   if (myglobal.playerData.housemanageid == myglobal.playerData.userId) {
    //     //自己就是房主
    //     this.btn_gamestart.active = true
    //     this.btn_ready.active = false
    //   } else {
    //     this.btn_gamestart.active = false
    //     this.btn_ready.active = true
    //   }
    // }.bind(this))

    //监听服务器发送来的消息
    // myglobal.socket.onGameStart(function(){
    //     this.node.active = false
    // }.bind(this))

    // myglobal.socket.onChangeHouseManage(function (data) {
    //   myglobal.playerData.housemanageid = data
    //   if (myglobal.playerData.housemanageid == myglobal.playerData.userId) {
    //     //自己就是房主
    //     this.btn_gamestart.active = true
    //     this.btn_ready.active = false
    //   } else {
    //     this.btn_gamestart.active = false
    //     this.btn_ready.active = true
    //   }

    // }.bind(this))
  },

  start() {

  },

  // update (dt) {},

  onButtonClick(event, customData) {
    switch (customData) {
      case "btn_ready":
        // myglobal.socket.requestReady()
        this.btn_ready.active = false
        break
      case "btn_start":
        // if(isopen_sound){
        //    cc.audioEngine.play(cc.url.raw("resources/sound/start_a.ogg")) 
        //  }
        myglobal.socket.requestStart(function (err, data) {
          if (err != 0) {
          } else {

          }
        })
        break
      default:
        break
    }
  }
});
