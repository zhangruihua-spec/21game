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
       
    },
   
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
    },

    ctor() {
      
        this.outcardsData = [];
      
      },

    start () {

    },
    updateData(data){
        let self = this;
       
        this.outcardsData.push(data);
        //先把牌出具push到牌数据中
    

        //创建牌节点，添加上去
        this.cards_node = []
        for (var i = 0; i < self.outcardsData.length; i++) {

        var card = cc.instantiate(this.card_prefab)
        card.scale = 0.8;
        // card.parent = this.node.parent
        card.parent = this.node;
        //   card.x = card.width * 0.4 * (-0.5) * (-16) + card.width * 0.4 * 0;
        //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动
        //   card.y = -250
        //   card.active = false

        card.getComponent("card").showCards(self.outcardsData[i])
        //存储牌的信息,用于后面发牌效果
        //   this.cards_node.push(card)
        //   this.card_width = card.width
        }
        }

    // update (dt) {},
});
