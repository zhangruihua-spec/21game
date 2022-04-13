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
        card_prefab: cc.Prefab,
        outcardNode:cc.Node,
        bgNode:cc.Node
       
    },
   
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    },

    initdata() {
        this.outcardsData = [];
    },

    start () {

    },
    updateData(data){
        let self = this;
        self.outcardsData.push(data);
        //先把牌出具push到牌数据中
        self.outcardNode.removeAllChildren();
        //创建牌节点，添加上去
        self.cards_node = []
        for (var i = 0; i < self.outcardsData.length; i++) {
            var card = cc.instantiate(this.card_prefab)
            card.scale = 1;
            card.parent = this.outcardNode;
            card.getComponent("card").showCards(self.outcardsData[i])
        }
        //计算当前牌的总分数
        let socreAll = 0;
        for (var i = 0; i < self.outcardsData.length; i++) {
            let cardScore = self.outcardsData[i].val;
            //A==1点  2==2点   
            if (cardScore > 13) {
                cardScore = cardScore - 13;
            }
            socreAll = socreAll + cardScore;
        }
        //更新桌面分数
        $socket.emit('_refreshDeskScore', socreAll);


    },
    update(){
        let self =this;
        const maxcardNum = 12;
        let lay = self.outcardNode.getComponent(cc.Layout)
        if (self.outcardsData.length > 12) {
            let  cardw = 128;
            let  outcardNum = self.outcardsData.length;
            let newSPx = (cardw * (outcardNum - maxcardNum )) / (outcardNum - 1 );
           
            self.outcardNode.getComponent(cc.Layout).spacingX = - (newSPx-2);
        }
        self.outcardNode.getComponent(cc.Layout).updateLayout();
    },

    resetData () {
        if (this.outcardNode) {
            this.outcardNode.removeAllChildren();
        }
    },
    
});