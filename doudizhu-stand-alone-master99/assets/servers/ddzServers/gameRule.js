//游戏规则
var GameRule = function () {

};

/**
 * 牌型判断
 * @method function
 * @param  {[shape]} cards [description]
 * @return {[shape]}       [description]
 */
GameRule.prototype.typeJudge = function (cards) {
  var self = this, len = cards.length;
  cards.sort((a, b) => b.val - a.val);
  switch (len) {
    case 1:
      return { 'cardKind': self.ONE, 'val': cards[0].val, 'size': len };
    case 2:
      if (self.isPairs(cards))
        return { 'cardKind': self.PAIRS, 'val': cards[0].val, 'size': len };
      else if (self.isKingBomb(cards))
        return { 'cardKind': self.KING_BOMB, 'val': cards[0].val, 'size': len };
      else
        return null;
    case 3:
      if (self.isThree(cards))
        return { 'cardKind': self.THREE, 'val': cards[0].val, 'size': len };
      else
        return null;
    case 4:
      if (self.isThreeWithOne(cards)) {
        return { 'cardKind': self.THREE_WITH_ONE, 'val': self.getMaxVal(cards, 3), 'size': len };
      } else if (self.isBomb(cards)) {
        return { 'cardKind': self.BOMB, 'val': cards[0].val, 'size': len };
      }
      return null;
    default:
      if (self.isProgression(cards))
        return { 'cardKind': self.PROGRESSION, 'val': cards[0].val, 'size': len };
      else if (self.isProgressionPairs(cards))
        return { 'cardKind': self.PROGRESSION_PAIRS, 'val': cards[0].val, 'size': len };
      else if (self.isThreeWithPairs(cards))
        return { 'cardKind': self.THREE_WITH_PAIRS, 'val': self.getMaxVal(cards, 3), 'size': len };
      else if (self.isPlane(cards))
        return { 'cardKind': self.PLANE, 'val': self.getMaxVal(cards, 3), 'size': len };
      else if (self.isPlaneWithOne(cards))
        return { 'cardKind': self.PLANE_WITH_ONE, 'val': self.getMaxVal(cards, 3), 'size': len };
      else if (self.isPlaneWithPairs(cards))
        return { 'cardKind': self.PLANE_WITH_PAIRS, 'val': self.getMaxVal(cards, 3), 'size': len };
      else if (self.isFourWithTwo(cards))
        return { 'cardKind': self.FOUR_WITH_TWO, 'val': self.getMaxVal(cards, 4), 'size': len };
      else if (self.isFourWithPairs(cards))
        return { 'cardKind': self.FOUR_WITH_TWO_PAIRS, 'val': self.getMaxVal(cards, 4), 'size': len };
      else
        return null;

  }

};
//是否是对子
GameRule.prototype.isPairs = function (cards) {
  return cards.length == 2 && cards[0].val === cards[1].val;
};
//是否是三根
GameRule.prototype.isThree = function (cards) {
  return cards.length == 3 && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
};
//是否是三带一
GameRule.prototype.isThreeWithOne = function (cards) {
  if (cards.length != 4) return false;
  var c = this.valCount(cards);
  return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是三带一对
GameRule.prototype.isThreeWithPairs = function (cards) {
  if (cards.length != 5) return false;
  var c = this.valCount(cards);
  return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是顺子
GameRule.prototype.isProgression = function (cards) {
  // if(cards.length < 5 || cards[0].val === 15) return false;
  // for (var i = 0; i < cards.length; i++) {
  //     if(i != (cards.length - 1) && (cards[i].val - 1) != cards[i + 1].val){
  //         return false;
  //     }
  // }
  if (cards.length < 5 || cards.length > 12) return false
  var tmp_cards = cards
  //不能有2或者大小王
  for (var i = 0; i < tmp_cards.length; i++) {
    if (tmp_cards[i].value == 13 || tmp_cards[i].value == 14
      || tmp_cards[i].value == 15) {
      return false
    }
  }

  // 是否连续
  for (var i = 0; i < tmp_cards.length; i++) {
    if (i === tmp_cards.length -1) break
    var p1 = Number(tmp_cards[i].value)
    var p2 = Number(tmp_cards[i + 1].value)
    if (Math.abs(p1 - p2) != 1) {
      return false
    }

  }

  return true;
};




/**
 * 获取min到max之间的随机整数，min和max值都取得到
 * @param  {number} min - 最小值
 * @param  {number} max - 最大值
 * @return {number}
 */
GameRule.prototype.random = function (min, max) {
  min = min == null ? 0 : min;
  max = max == null ? 1 : max;
  var delta = (max - min) + 1;
  return Math.floor(Math.random() * delta + min);
};

/**
 * 牌统计，统计各个牌有多少张，比如2张A，一张8
 * @param  {list} cards - 要统计的牌
 * @return {object array} val：值，count：数量
 */
GameRule.prototype.valCount = function (cards) {
  var result = [];
  var addCount = function (result, v) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].val == v) {
        result[i].count++;
        return;
      }
    }
    result.push({ 'val': v, 'count': 1 });
  };
  for (var i = 0; i < cards.length; i++) {
    addCount(result, cards[i].val);
  }
  return result;
};
/**
 * 获取指定张数的最大牌值
 * @param  {list} cards - 牌
 * @param  {list} cards - 张数
 * @return 值
 */
GameRule.prototype.getMaxVal = function (cards, n) {
  var c = this.valCount(cards);
  var max = 0;
  for (var i = 0; i < c.length; i++) {
    if (c[i].count === n && c[i].val > max) {
      max = c[i].val;
    }
  }
  return max;
};


/**
 * 卡牌排序
 * @method cardSort
 * @param  {Object} a [description]
 * @param  {Object} b [description]
 * @return 1 : a < b ,-1 a : > b   [description]
 */
GameRule.prototype.cardSort = function (a, b) {
  var va = parseInt(a.val);
  var vb = parseInt(b.val);
  if (va === vb) {
    return a.shape > b.shape ? 1 : -1;
  } else if (va > vb) {
    return -1;
  } else {
    return 1;
  }
};
/**
 * 牌型枚举
 */
GameRule.prototype.ONE = 1;

GameRule.prototype.typeJudge = function (cards) {
  var self = this, len = cards.length;
  cards.sort((a, b) => b.val - a.val);
  switch (len) {
    case 1:
      return { 'cardKind': self.ONE, 'val': cards[0].val, 'size': len };
  }

};

//桌位状态
GameRule.prototype.DESK_STATUS_READY = 1;
GameRule.prototype.DESK_STATUS_ROB = 2;
GameRule.prototype.DESK_STATUS_PLAY = 3;

module.exports = GameRule
