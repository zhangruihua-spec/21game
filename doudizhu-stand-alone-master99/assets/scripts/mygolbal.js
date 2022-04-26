import socketctr from "./data/socket_ctr.js"
import playerdata from "./data/player.js"
import eventlister from "./util/event_lister.js"

let myglobal = {} || myglobal
myglobal.socket = socketctr()
myglobal.playerData = playerdata()
myglobal.eventlister = eventlister({})

export default myglobal
