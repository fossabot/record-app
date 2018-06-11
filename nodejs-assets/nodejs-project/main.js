const rnBridge = require('rn-bridge')
const os = require('os')
const fs = require('fs')
const IPFS = require('ipfs')
const path = require('path')
const debug = require('debug')
const Logger = require('logplease')

const OrbitDB = require('orbit-db')
const RecordNode = require('record-node')

debug.useColors = () => false // disable colors in log (fixes xcode issue)

// Log Record / IPFS / OrbitDB
const logger = debug('main')
debug.enable('main,jsipfs:*,libp2p:*,bitswap:*') //libp2p:switch:dial,libp2p:switch:transport,libp2p:swarm:dialer')
Logger.setLogLevel(Logger.LogLevels.DEBUG)

process.on('uncaughtException', (err) => {
  console.log(err)
})

logger('starting')

let rn = null
let ipfs = null
let started = false

const init = (docsPath) => {
  if (started)
    return

  started = true

  const recorddir = path.resolve(docsPath, './record')

  if (!fs.existsSync(recorddir)) { fs.mkdirSync(recorddir) }

  logger(`Record Dir: ${recorddir}`)

  const ipfsConfig = {
    init: {
      bits: 1024
    },
    repo: path.resolve(recorddir, './ipfs'),
    EXPERIMENTAL: {
      dht: false, // TODO: BRICKS COMPUTER
      relay: {
        enabled: true,
        hop: {
          enabled: false, // TODO: CPU hungry on mobile
          active: false
        }
      },
      pubsub: true
    },
    config: {
      Bootstrap: [],
      Addresses: {
	Swarm: [
          '/ip4/159.203.117.254/tcp/9090/ws/p2p-websocket-star'
	]
      }
    }
  }

  try {
    // Create the IPFS node instance
    const ipfs = new IPFS(ipfsConfig)

    // TODO: throttle ipfs attemptDials & incoming connections from same peer

    ipfs.on('ready', async () => {
      const orbitAddressPath = path.resolve(recorddir, 'address.txt')

      const orbitAddress = fs.existsSync(orbitAddressPath) ?
                           fs.readFileSync(orbitAddressPath, 'utf8') : undefined

      logger(`Orbit Address: ${orbitAddress}`)

      const opts = {
        orbitPath: path.resolve(recorddir, './orbitdb'),
        orbitAddress: orbitAddress,
        logConfig: {
          replicate: false
        }
      }

      rn = new RecordNode(ipfs, OrbitDB, opts)

      try {
        await rn.load()
        fs.writeFileSync(orbitAddressPath, rn._log.address)
      } catch(e) {
        console.log(e)
      }

      rnBridge.channel.send(JSON.stringify({ action: 'ready' }))

      // TODO: syncContacts once dialing is complete
      setTimeout(() => {
        rn.syncContacts()
      }, 30000)

    })

  } catch(e) {
    console.log(e)
  }

  logger('initialized')

}

rnBridge.channel.on('message', async (message) => {

  const msg = JSON.parse(message)
  logger(msg)

  let data
  let log

  switch(msg.action) {
    case 'init':
      init(msg.data.docsPath)
      break

    case 'suspend':
      ipfs.stop()
      break

    case 'resume':
      ipfs.start((err) => {
        if (err) {
          console.log(err)
        }

        logger('ipfs started')
      })
      break

    case 'contacts:get':
      if (!rn) {
        return
      }

      try {
        log = await rn.getLog(msg.data.logId)
        data = log.contacts.all()
      } catch (e) {
        console.log(e)
      }

      rnBridge.channel.send(JSON.stringify({
        action: msg.action,
        data
      }))
      break

    case 'contacts:add':
      if (!rn) {
        return
      }

      try {
        const { address, alias } = msg.data
        log = await rn.getLog(msg.data.logId)
        data = await log.contacts.findOrCreate({ address, alias })
      } catch (e) {
        console.log(e)
      }
      rnBridge.channel.send(JSON.stringify({
        action: msg.action,
        data
      }))
      break

    case 'info:get':
      if (!rn) {
        return
      }

      try {
        data = await rn.info()
      } catch (e) {
        console.log(e)
      }

      rnBridge.channel.send(JSON.stringify({
        action: msg.action,
        data
      }))
      break

    case 'tracks:get':
      if (!rn) {
        return
      }

      try {
        log = await rn.getLog(msg.data.logId)
        data = log.tracks.all()
      } catch(e) {
        console.log(e)
      }

      rnBridge.channel.send(JSON.stringify({
        action: msg.action,
        data
      }))
      break

    case 'tracks:add':
      if (!rn) {
        return
      }

      try {
        const { title, url } = msg.data
        log = await rn.getLog(msg.data.logId)
        data = await log.tracks.findOrCreate({ title, url })
      } catch (e) {
        console.log(e)
      }

      rnBridge.channel.send(JSON.stringify({
        action: msg.action,
        data
      }))
      break

    default:
      logger(`Invalid message action: ${msg.action}`)
  }

})
