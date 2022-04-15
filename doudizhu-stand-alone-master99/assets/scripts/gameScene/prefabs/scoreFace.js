// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
'use strict'
cc.Class({
    extends: cc.Component,

    properties: {
        faceBg: {
            default: [],
            type: cc.SpriteFrame
        },
        scoreNum: cc.Label,
        facesp: cc.Sprite,

        awardFonts: {
            default: [],
            type: cc.Font
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initdata(data){
        let self = this;
        if (data > 0) {
            self.facesp.spriteFrame = self.faceBg[0];
            self.scoreNum.font = self.awardFonts[0];
            self.scoreNum.string = '+' + data;
        } else {
            self.facesp.spriteFrame = self.faceBg[1];
            self.scoreNum.font = self.awardFonts[1];
            self.scoreNum.string = '' + data;
        }
    }


    // update (dt) {},
});
