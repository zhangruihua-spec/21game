//牌型定义
const CardsValue = {
  'one': {
    name: 'One',
    value: 1
  },

};
const defines = {
  serverUrl: 'http://localhost:3000',
  jdRoomConfig: {
    'rate_1': {
      needCostGold: 10,
      bottom: 1,
      rate: 1
    },
    'rate_2': {
      needCostGold: 100,
      bottom: 10,
      rate: 2
    },
    'rate_3': {
      needCostGold: 200,
      bottom: 20,
      rate: 3
    },
    'rate_4': {
      needCostGold: 500,
      bottom: 50,
      rate: 4
    }
  },
  roomNames: ['初级房', '中级房', '高级房', '大师房'],
  // 游戏状态
  gameState: {
    INVALID: -1, // 无效
    WAITREADY: 1,  //等待游戏
    GAMESTART: 2,  //开始游戏
    PUSHCARD: 3,   //发牌
    PLAYING: 6,     //出牌阶段  
  }
};
const isopen_sound = 1;
//exports.roomFullPlayerCount = 3;
qian_state = {
  "buqiang": 0,
  "qiang": 1,
};


window.defines = defines;
//https://www.iqiyi.com/v_19rshq4vz0.html
