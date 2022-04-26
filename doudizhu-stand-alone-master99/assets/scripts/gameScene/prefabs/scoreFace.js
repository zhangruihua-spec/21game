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

        smailNode:cc.Node,
        cryNode:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initdata(data){
        let self = this;
        self.smailNode.active =false;
        self.cryNode.active =false;
        if (data > 0) {
            self.facesp.spriteFrame = self.faceBg[0];
            self.scoreNum.font = self.awardFonts[0];
            self.scoreNum.string = '+' + data;
            self.smailNode.active =true;
        } else {
            self.facesp.spriteFrame = self.faceBg[1];
            self.scoreNum.font = self.awardFonts[1];
            self.scoreNum.string = '' + data;
            self.cryNode.active =true;
        }
    }


    // update (dt) {},
});
