// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { time } from "console";
import myglobal from "../mygolbal.js"
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')
cc.Class({
    extends: cc.Component,

    properties: {
        winbg:cc.Sprite,
        winsp:cc.Sprite,
        myWinBg:cc.Sprite,
        winOrlostLab:cc.Label,
        myheadSp:cc.Sprite,
        mynameLab:cc.Label,
        myscoreLab:cc.Label,
        myscoreNumLab:cc.Label,
        mycoinLab:cc.Label,
        scoreNode:cc.Node,
        myCoinSp:cc.Sprite,
        otherResultNode:cc.Node,
        continueBtn:cc.Button,
        continueLab:cc.Label,
        scoretItem:cc.Prefab,
        playerItem:cc.Prefab,
        guangSp: {
            type: cc.SpriteFrame,
            default: []
          },
        winOrLostSp: {
            type: cc.SpriteFrame,
            default: []
        },
        bgsp:{
            type:cc.SpriteFrame,
            default:[]
        },
        coinsp:{
            type:cc.SpriteFrame,
            default:[]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },
    initData(palyerData){
        let self = this;
        if (palyerData[myglobal.playerData.userId]) {
            //我自己的信息
            console.log('palyerData--',palyerData[myglobal.playerData.userId]);
        }
        let playerGetScore = [];
        let allScore = 0;
    
        let baseScore = myglobal.playerData.bottom;
        console.log('youxidifen',baseScore);
        //首先计算下每个玩家的得分
        for (let index = 0; index < palyerData.players.length; index++) {
            playerGetScore.push(palyerData[palyerData.players[index]].score);
            allScore += palyerData[palyerData.players[index]].score;
        }
        //自己的信息处理
        let dsf = palyerData[parseInt(myglobal.playerData.userId)];

        let myGetScore = 4 * (palyerData[parseInt(myglobal.playerData.userId)].score) - allScore;
        //显示我的结算信息
        self.mynameLab.string = 'guest_' + myglobal.playerData.userId;
        self.myscoreNumLab.string = '' + myGetScore;
        if (myGetScore > 0) {
            self.mycoinLab.node.color = cc.color().fromHEX("#17ff38");//得分字体
            self.myWinBg.spriteFrame = self.bgsp[0];//得分大背景
            self.winbg.spriteFrame = self.guangSp[0];//太阳光
            self.winsp.spriteFrame = self.winOrLostSp[0];//输赢的图标
            self.myscoreLab.node.color = cc.color().fromHEX("#a865e1");//score颜色
            self.myCoinSp.spriteFrame = self.coinsp[0];
            self.winOrlostLab.string = 'Winner';
            self.mycoinLab.string = '+' + (myGetScore  * baseScore) ;
            self.mynameLab.node.color = cc.color().fromHEX("#dd81f4");
        } else {
            self.mycoinLab.node.color = cc.color().fromHEX("#e81c26");
            self.myWinBg.spriteFrame = self.bgsp[1];//得分大背景
            self.winbg.spriteFrame = self.guangSp[1];//太阳光
            self.winsp.spriteFrame = self.winOrLostSp[1];//输赢的图标
            self.myscoreLab.node.color = cc.color().fromHEX("#6dcce8");//score颜色
            self.myCoinSp.spriteFrame = self.coinsp[1];
            self.winOrlostLab.string = 'Loser';
            self.mycoinLab.string = '' + (myGetScore  * baseScore) ;
            self.mynameLab.node.color = cc.color().fromHEX("#cdfaff");
        }
        //发送给服务器处理自己的得分
        
        self.updateMyCoin(myGetScore * baseScore);
        //自己的得分列表
        for (let index = 0; index <  palyerData[parseInt(myglobal.playerData.userId)].scoreArray.length; index++) {
            const element = palyerData[parseInt(myglobal.playerData.userId)].scoreArray[index];
            let myresultItem = cc.instantiate(self.scoretItem);
            myresultItem.parent = self.scoreNode;
            myresultItem.scale = 0.91;
            myresultItem.getComponent('scoreFace').initdata(element);
        }
        //光圈转动
        self.winbg.node.runAction(cc.repeatForever(cc.rotateBy(4, 360)));
       
        //其他人信息
        for (let index = 0; index < palyerData.players.length; index++) {
            if (myglobal.playerData.userId != palyerData.players[index]) {
                  //初始化其他玩家的战绩
                  let playerItem = cc.instantiate(self.playerItem);
                  playerItem.parent = self.otherResultNode;
                  playerItem.getComponent('gameResultItem').initData(palyerData[palyerData.players[index]],allScore);
            }
        }
        //设置一个定时器
        let times = 6;
        this.schedule(function(){
            times = times - 1;
            self.continueLab.string = 'One more round (' + times + ')';
            if (times == 0) {
                self.onclickGameState();
            }
        },1 , 5 ,1)

    },
    onclickGameState(){
        let self  = this;
        ddzData.gameState = ddzConstants.gameState.GAMESTART;
        self.node.active = false;
        self.node.removeFromParent();
        self.node.destroy();
        
    },
    updateMyCoin(dataNum){
        console.log('传输的值',dataNum);
        var data = "point="+dataNum;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            console.log(this.responseText);
            let temp = parseInt( myglobal.playerData.goldcount)
            temp+= parseInt(dataNum);
            myglobal.playerData.goldcount = temp;
            console.log('sdfsdfsdf',myglobal.playerData.goldcount);
            //刷新下自己的分数
            cc.director.emit('UPDATEMYPOINT',myglobal.playerData.userId);
        }
        });
        xhr.open("POST", "https://d21.huoshanyouxi.com/v1/users/" + myglobal.playerData.userId + "/point");
        let token_type = cc.sys.localStorage.getItem('token_type')
        let token = cc.sys.localStorage.getItem('token')
        xhr.setRequestHeader("Authorization", token_type + ' ' + token);
        // xhr.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODE5NjEwNjQsImlzcyI6InBoYWxjb24tand0LWF1dGgiLCJpZCI6IjEwMDAzIiwiaWF0IjoxNjUwNDI1MDY0fQ.EI8W2DenYzBdN_-PDHKrA0taKB5fXBbLqw5ZALVw1Fg");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    // update (dt) {},
});
