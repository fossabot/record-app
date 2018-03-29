const rn_bridge = require('rn-bridge')
const os = require('os')
const path = require('path')
const Node = require('node')

process.on('uncaughtException', (err) => {
  console.log(err)
})

const repo = path.resolve(os.tmpdir(), './ipfs')
console.log(repo)

const nodeConfig = {
  repo: repo,
  directory: path.resolve(os.tmpdir(), './orbitdb'),
  init: true,
  pass: '2662d47e3d692fe8c2cdb70b907ebb12b216a9d9ca5110dd336d12e7bf86073b',
  EXPERIMENTAL: {
    pubsub: true
  },

  config: {
    Addresses: {
      Swarm: [
	//'/ip4/0.0.0.0/tcp/4002',
	//'/ip4/0.0.0.0/tcp/4003/ws'
	//'/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star'
	//'/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
}

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
  rn_bridge.channel.send(msg)
})

try {
  const node = new Node(nodeConfig)

  node.on('error', function(err) {
    console.log(err)
  })

  node.on('ready', function() {
    console.log('main.js: node ready')
    rn_bridge.channel.send('ready')
  })

} catch(e) {
  console.log(e)
}

/* try {
 *   const IPFS = require('ipfs')
 *   const node = new IPFS({
 *     repo: path.resolve(os.tmpdir(), './record'),
 *     EXPERIMENTAL: {
 *       pubsub: true
 *     },
 *     config: ipfsConfig
 *   })
 *   
 *   console.log(node)
 *   
 *   node.on('ready', () => {
 *     console.log('ready')
 * 
 *     node.config.get((err, config) => {
 *       if (err) {
 * 	throw err
 *       }
 *       console.log(config)
 * 
 *       rn_bridge.channel.send('ready')      
 *     })
 *     
 *   })
 *   
 *   node.on('error', (err) => {
 *     console.log(err)
 *   })
 * 
 * } catch(e) {
 *   console.log(e)
 * }
 * */
/* try {
 *   var leveldown = require('leveldown')
 *   var levelup = require('levelup')
 * 
 *   // 1) Create our store
 *   var db = levelup(leveldown(path.resolve(os.tmpdir(), './mydb')), {}, function(err, db) {
 *     if (err) console.log(err)
 * 
 *     console.log(db)
 *   })
 * 
 *   db.on('open', () => {
 *     console.log('db open')
 *   })
 * 
 *   db.on('opening', () => {
 *     console.log('db opening')
 *   })
 * 
 *   db.on('put', () => {
 *     console.log('put called')
 *   })
 * 
 *   console.log(db)    
 * 
 *   // 2) Put a key & value
 *   db.put('name', 'levelup', function (err) {
 *     if (err) return console.log(err)
 * 
 *     // 3) Fetch by key
 *     db.get('name', function (err, value) {
 *       if (err) return console.log(err) //rn_bridge.channel.send(`Ooops!: ${err.toString()}`) // likely the key was not found
 * 
 *       // Ta da!
 *       console.log(value)
 *     })
 *   })
 * } catch(e) {
 *   rn_bridge.channel.send(e.toString())
 * }
 * */

/* const IPFSFactory = require('ipfsd-ctl')
 * const f = IPFSFactory.create({type: 'proc', exec: require('ipfs') })
 * 
 * try {
 *   f.spawn({
 *     disposable: true,
 *     init: true,
 *     start: true,
 *     EXPERIMENTAL: {
 *       pubsub: true
 *     },
 *     config: ipfsConfig
 *   }, function (err, ipfsd) {
 *     if (err) { throw err }
 * 
 *     ipfsd.api.id(function (err, res) {
 *       if (err) { console.log(err) }
 *       console.log(`IPFS API: ${ipfsd.apiAddr}`)
 *       console.log(`IPFS ID: ${res.id}`)
 * 
 *       rn_bridge.channel.send('ready')            
 *     })
 * 
 *   })
 * } catch(e) {
 *   console.log(e)
 * }
 * */

console.log('main.js initialized')
