import myglobal from './mygolbal.js'

let common = require('common')
let ddzData = require('ddzData')
let ddzServers = require('ddzServers')
let gameRule = require('gameRule')

let start = cc.Class({
  extends: cc.Component,
  onLoad() {
    window.myglobal = window.myglobal || myglobal
    window.common = window.common || common
    window.G = window.G || {
      gameRule: new gameRule()
    }
    !CC_EDITOR && ddzData.initData()
    !CC_EDITOR && ddzServers.initServer()

  }
})
module.extends = start
