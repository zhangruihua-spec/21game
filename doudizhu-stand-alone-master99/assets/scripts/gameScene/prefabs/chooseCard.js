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
        
        card_node:{
            type:cc.Sprite,
            default:[]
        },
        cards_sprite_atlas: cc.SpriteAtlas,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.chooseData = [];
    },

    start () {

    },
    onTouchCard(card,event){
        let self = this;
        switch (event) {
            case 'left':
                //通知服务器 
                window.$socket.emit('threeSelectedCard',self.chooseData[0]);
                break;
            case 'mid':
                window.$socket.emit('threeSelectedCard',self.chooseData[1]);
                break;
            case 'right':
                window.$socket.emit('threeSelectedCard',self.chooseData[2]);
                break;
            default:
                break;
        }
        self.node.destroy();
    },

    initCardData(data){

        let self = this;
        self.chooseData = data;
        const cardValue = {
            "12": 1,
            "13": 2,
            "1": 3,
            "2": 4,
            "3": 5,
            "4": 6,
            "5": 7,
            "6": 8,
            "7": 9,
            "8": 10,
            "9": 11,
            "10": 12,
            "11": 13
        };

        // 黑桃： spade
        // 红桃： heart
        // 梅花： club
        // 方片： diamond
        // const CardShape = {
        //     "S": 1,
        //     "H": 2,
        //     "C": 3,
        //     "D": 4,
        // };
        const cardShape = {
            "1": 3,
            "2": 2,
            "3": 1,
            "4": 0
        };
  
    //   var spriteKey = '';
    //   if (card.shape) {
    //     spriteKey = 'card_' + (cardShape[card.shape] * 13 + cardValue[card.value]);
    //   } 
  
    //   this.node.getComponent(cc.Sprite).spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey)

      //显示三张牌的值
      for (let index = 0; index < data.length; index++) {
          const element = data[index];

          var spriteKey = '';
          if (element.shape) {
            spriteKey = 'card_' + (cardShape[element.shape] * 13 + cardValue[element.value]);
          } 
      
          self.card_node[index].spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey)
          
      }
     
      
    }

  
});
