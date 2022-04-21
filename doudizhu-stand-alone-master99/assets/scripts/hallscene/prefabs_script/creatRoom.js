import myglobal from "../../mygolbal.js"

cc.Class({
  extends: cc.Component,

  properties: {
    chooseRole_prefabs: cc.Prefab,
    myCoinLab:cc.Label,
    tipsLabel:cc.Label,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    let self = this;
    cc.director.emit('UPDATAPOINT');
    // setTimeout(() =>{  this.myCoinLab.string = ''+ myglobal.playerData.goldcount  },1*1000); 
    self.scheduleOnce(function(){
      this.myCoinLab.string = ''+ myglobal.playerData.goldcount;
    },0.2)
   
  },

  start() {
  },

  // update (dt) {},
  onBtnClose() {
    this.node.destroy()

  },
  // 进入游戏房间
  onButtonClick(event, value) {

    //判断是否符合条件
    let roomMix = [5,50,250,500];
    if ( myglobal.playerData.goldcount < roomMix[parseInt(value)-1]) {
      this.tipsLabel.string = "Current amount is less than the minimum admission requirement!"
      setTimeout(function () {
        this.tipsLabel.string = ""
      }.bind(this), 2000);
      return;
    }
    const { bottom, rate } = defines.jdRoomConfig['rate_' + value]
    const roomId = `${rate}_${bottom}_${Math.floor(Math.random() * 1000)}`
    myglobal.playerData.bottom = bottom
    myglobal.playerData.rate = rate
    myglobal.playerData.roomId = roomId
    cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
    // cc.director.loadScene("gameScene")
    // this.node.destroy()
    //先进入选择角色

    var choose_Role = cc.instantiate(this.chooseRole_prefabs)
    choose_Role.parent = this.node
    choose_Role.zIndex = 100

  }

});
