const common = require("../../scripts/common/common");

/**
 * AI逻辑
 *
 */
const AILogic = function (p) {
  this.player = p;
  this.cards = p.cardList.slice(0).sort((a, b) => b.val - a.val);
  // this.analyse();
};
// ai牌型类
const AICardType = (val, cardList) => ({val, cardList})
/**
 * 跟牌,AI根据上家牌出牌
 * @method function
 * @param  {object} winc 当前牌面最大牌
 * @param  {boolean} isWinnerIsLandlord 当前最大是否是地主
 * @return {number} winnerCardCount 当前最大那家剩余手牌数
 */
AILogic.prototype.follow = function (winc, winnerCardCount) {
  var self = this;

  //console.log('cards--',self.cards);

  var c = self.cards.slice(0, 1);
           
              return {
                cardList: c,
                cardKind: G.gameRule.ONE,
                size: 1,
                val: c[0].val
              };
  // var result = (function () {
  //   switch (winc.cardKind) {//判断牌型
  //     case G.gameRule.ONE://单牌
  //       var one = self.matchCards(self._one, G.gameRule.ONE, winc, isWinnerIsLandlord, winnerCardCount);
  //       if (!one) {
  //         if (isWinnerIsLandlord || self.player.isLandlord) {
  //           for (var i = 0; i < self.cards.length; i++) {
  //             if (self.cards[i].val <= 15 && self.cards[i].val > winc.val) {
  //               return {
  //                 cardList: self.cards.slice(i, i + 1),
  //                 cardKind: G.gameRule.ONE,
  //                 size: 1,
  //                 val: self.cards[i].val
  //               };
  //             }
  //           }
  //         }
  //         if (self.times <= 1 && self._pairs.length > 0 && self._pairs[0].val > 10) {//剩下一对大于10拆牌
  //           var c = self.cards.slice(0, 1);
  //           if (c[0].val > winc.val) {
  //             return {
  //               cardList: c,
  //               cardKind: G.gameRule.ONE,
  //               size: 1,
  //               val: c[0].val
  //             };
  //           } else {
  //             return null;
  //           }
  //         }
  //       }
  //       return one;
   
  //     default:
  //       return null;
  //   }
  // })();

};

/**
 * 出牌,默认出包含最小牌的牌
 * @method function
 * @param {Number} landlordCardsCnt 地主剩余牌的数量
 * @return {array} [description]
 */
AILogic.prototype.play = function (landlordCardsCnt) {
    var self = this;
   
    var idx = common.random(0,length(self.cards));
 
    var minCard = self.cards[idx];
    
    return minCard;
};



/**
 * 将src中对应值的牌数据移到dest中
 */
AILogic.prototype.moveItem = function (src, dest, v) {
  for (var i = src.length - 1; i >= 0; i--) {
    if (src[i].val === v) {
      dest.push(src.splice(i, 1)[0]);
    }
  }
};

/**
 * 设置返回牌的类型
 * @method setCardKind
 * @param  {[object]}    obj  对象
 * @param  {[kind]}    kind 牌型
 */
AILogic.prototype.setCardKind = function (obj, kind) {
  obj.cardKind = kind;
  obj.size = obj.cardList.length;
  return obj;
};


module.exports = AILogic
