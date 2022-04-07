//发牌管理器
const cardobj = function (value, shape, king) {
  var that = {}
  that.index = -1
  if (value) {
    that.value = value
    that.val = value + 2 // gameRule使用
  }

  if (shape) {
    that.shape = shape
  }

  if (king != undefined) {
    that.king = king
    that.value = king
    that.val = king + 2 // gameRule使用
    that.shape = 0
  }
  return that
}
const cardvalue = {
  "A": 12,
  "2": 13,
  "3": 1,
  "4": 2,
  "5": 3,
  "6": 4,
  "7": 5,
  "8": 6,
  "9": 7,
  "10": 8,
  "J": 9,
  "Q": 10,
  "K": 11,
}

// 黑桃：spade
// 红桃：heart
// 梅花：club
// 方片：diamond
const CardShape = {
  "S": 1,
  "H": 2,
  "C": 3,
  "D": 4,
};

//大小王分开写是因为只有一张，并且没有黑桃这些区分
// const Kings = {
//   "kx": 14, //小王
//   "Kd": 15,  //大王
// };

function carder() {
  var that = {
    card_list: []
  }
  const shuffleCard = function () {
    for (var i = that.card_list.length - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      //随机交换
      var tmpCard = that.card_list[randomIndex];
      that.card_list[randomIndex] = that.card_list[i];
      that.card_list[i] = tmpCard;
    }

    // for(var i=0;i<that.card_list.length;i++){
    //     console.log("card value:"+that.card_list[i].value+" shape:"+that.card_list[i].shape+" king"+that.card_list[i].king)
    // }
    return that.card_list
  }
  //发牌
  const creatleCard = function () {
    that.card_list = []
    //实例化52张牌
    for (const iv in cardvalue) {
      for (const js in CardShape) {
        //实例化牌对象
        const card = cardobj(cardvalue[iv], CardShape[js], undefined)
        card.index = that.card_list.length;
        that.card_list.push(card)
      }
    }

    // for (var i in Kings) {
    //   var card = cardobj(undefined, undefined, Kings[i]);
    //   card.index = that.card_list.length;
    //   that.card_list.push(card)
    // }
    //洗牌
    shuffleCard()
  }
  //把牌分成三份和三张带翻的牌
  //每份牌17张
  that.splitThreeCards = function () {
    //创建牌
    creatleCard()
    var threeCards = {}
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 3; j++) {
        if (threeCards.hasOwnProperty(j)) {
          threeCards[j].push(that.card_list.pop());
        } else {
          threeCards[j] = [that.card_list.pop()];
        }
      }
    }

    return [threeCards[0], threeCards[1], threeCards[2], that.card_list]
  }

  //出一张牌
  const isOneCard = function (cardList) {
    if (cardList.length === 1) {
      return true;
    }
    return false;
  }


  

  const getCardValue = that.IsCanPushs

  return that
}
module.exports = carder()

// example
// [{ index: 7, value: 1, shape: 4 },
// { index: 15, value: 3, shape: 4 },
// { index: 0, value: 13, shape: 1 },
// { index: 20, value: 5, shape: 1 },
// { index: 5, value: 1, shape: 2 },
// { index: 40, value: 9, shape: 1 },
// { index: 37, value: 12, shape: 2 },
// { index: 27, value: 6, shape: 4 },
// { index: 14, value: 3, shape: 3 },
// { index: 39, value: 12, shape: 4 },
// { index: 2, value: 13, shape: 3 },
// { index: 28, value: 7, shape: 1 },
// { index: 35, value: 8, shape: 4 },
// { index: 6, value: 1, shape: 3 },
// { index: 42, value: 9, shape: 3 },
// { index: 30, value: 7, shape: 3 },
// { index: 43, value: 9, shape: 4 }]