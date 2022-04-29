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
        WinBg:cc.Sprite,//输赢背景
        winOrlostLab:cc.Label,//右上角熟悉数字
        headSp:cc.Sprite,//玩家头像
        nameLab:cc.Label,// 玩家名字
        scoreLab:cc.Label,//玩家得分
        scoreLabLeft:cc.Label,//玩家Score颜色
        coinLab:cc.Label,//玩家金币 
        coinspLeft:cc.Sprite,//金币颜色
        //背景
        bgsp:{
            type:cc.SpriteFrame,
            default:[]
        },
        //金币背景
        coinsp:{
            type:cc.SpriteFrame,
            default:[]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initData(data,allScore){
        let self = this;
        //计算自己的得分
        let base =  myglobal.playerData.bottom;;
        let userGetScore = 4 * data.score  - allScore;
        self.nameLab.string = 'guest_' + data.userId;
        self.scoreLab.string = '' + userGetScore;
        //设置玩家的数据
        if (userGetScore > 0) {
            self.WinBg.spriteFrame = self.bgsp[0];
            self.winOrlostLab.string = 'Winner';
            self.scoreLabLeft.node.color = cc.color().fromHEX("#a865e1");//score颜色
            self.coinLab.string = '+' + userGetScore * base;
            self.coinLab.node.color = cc.color().fromHEX("#17ff38");
            self.coinspLeft.spriteFrame= self.coinsp[0];
        } else {
            self.WinBg.SpriteFrame = self.bgsp[1];
            self.winOrlostLab.string = 'Loser';
            self.scoreLabLeft.node.color = cc.color().fromHEX("#6dcce8");//score颜色
            self.coinLab.node.color = cc.color().fromHEX("#e81c26");
            self.coinLab.string = userGetScore * base;
            self.coinspLeft.spriteFrame= self.coinsp[1];
        }

    }

    // update (dt) {},
});
