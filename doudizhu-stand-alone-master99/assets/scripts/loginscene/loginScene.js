import myglobal from "../mygolbal.js"
cc.Class({
  extends: cc.Component,

  properties: {
    wait_node: cc.Node
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    cc.director.preloadScene("hallScene")
    // this.onButtonCilck(22,'guest_login');
  },

  start() {},
  onButtonCilck(event, customData) {
    switch (customData) {
      case "wx_login":
        console.log("wx_login request")

        //this.wait_node.active = true

        myglobal.socket.request_wxLogin({
          uniqueID: myglobal.playerData.uniqueID,
          // userId: myglobal.playerData.userId,
          userName: myglobal.playerData.userName,
          avatarUrl: myglobal.playerData.avatarUrl,
        }, function (err, result) {
          //请求返回
          //先隐藏等待UI
          //this.wait_node.active = false
          if (err != 0) {
            console.log("err:" + err)
            return
          }

          console.log("login sucess" + JSON.stringify(result))
          myglobal.playerData.gobal_count = result.goldcount
          cc.director.loadScene("hallScene")
        }.bind(this))
        break
      case 'guest_login':
        // https://d21.huoshanyouxi.com/v1/auth/register

        let url = " https://d21.huoshanyouxi.com/v1/auth/register/";
        let xhr = new XMLHttpRequest();
        let useid = '';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var responseJson = JSON.parse(response);
                console.log('ssss',responseJson.data)
                useid = responseJson.data['id'];
                console.log('sdfsdf',responseJson.data['id']);
            }
        };
        xhr.onerror = function(evt){
            console.log(evt);
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("IMEI=asdfsdgegeg");


        // this.wait_node.active = true
        let count = parseInt(useid)//Math.floor(Math.random() * 100000)
        let userName = `guest_${count}`
        myglobal.playerData.userId = `${count}`
        myglobal.playerData.userName = userName
        cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
        cc.director.loadScene("hallScene")
      default:
        break
    }
  }
  // update (dt) {},


});
