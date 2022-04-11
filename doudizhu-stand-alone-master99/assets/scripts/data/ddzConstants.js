/**
 * @description 斗地主常量
 */
module.exports = {
  /**
  * @description 游戏状态
  */
  gameState: {
    INVALID: -1, // 无效
    WAITREADY: 1,  // 进入房间，等待游戏
    GAMESTART: 2,  //开始游戏，已准备
    PUSHCARD: 3,   //发牌
    GETCARD:4,      //摸牌
    PLAYING: 6,     //出牌阶段
    GAMEEND: 7      // 游戏结束
  },
  /**
   * @description 扑克牌纹理
   */
  _pokersFrame : null,
  _chipsFrame : null,
}