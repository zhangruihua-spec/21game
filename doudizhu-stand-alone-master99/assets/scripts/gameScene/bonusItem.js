// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dayLable:cc.Label,
        addCoin:cc.Label,

        receiveLable:cc.Label,
        getNode:cc.Node,
        gotNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initData(data){
       let self = this;
       self.dayLable.string = 'Day '+data.day;
       self.addCoin.string = '+'+data.award;
       //0 待领取  1 已经领取  2 未来领取
       self.receiveLable.node.active = false;
       self.getNode.active = false;
       self.gotNode.active = false;
       
       if (data.status ==0) {
            self.getNode.active = true;
        } else if(data.status ==1){
            self.receiveLable.node.active = true;
        }else if(data.status ==2){
            self.gotNode.active = true;
        }
    },
    getCoin(){
        let self = this;
        self.getNet();
        self.receiveLable.node.active = true;
        self.getNode.active = false;
        self.gotNode.active = false;
    },
    getNet(){
        var data = "";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            console.log(this.responseText);
            //给自己加金币

            cc.director.emit('UPDATAPOINT');
        }
        });
        let geturl = "https://d21.huoshanyouxi.com/v1/users/"+myglobal.playerData.userId+'/sign';

        xhr.open("POST", geturl);

        let token_type = cc.sys.localStorage.getItem('token_type')
        let token = cc.sys.localStorage.getItem('token')
        xhr.setRequestHeader("Authorization", token_type + ' ' + token);


        // xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODE5NjEwNjQsImlzcyI6InBoYWxjb24tand0LWF1dGgiLCJpZCI6IjEwMDAzIiwiaWF0IjoxNjUwNDI1MDY0fQ.EI8W2DenYzBdN_-PDHKrA0taKB5fXBbLqw5ZALVw1Fg");

        xhr.send(data);
    },
    

    // update (dt) {},
});
