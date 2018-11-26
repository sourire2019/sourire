import actions from './actions'
import moment from 'moment-timezone'
import { get, post } from 'services/request.js'

import axios from 'axios'
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

mock.onGet('/api/channels').reply(200,{
  "channels": [
    "justitia-chan3"
  ]
})

mock.onGet('/api/curChannel').reply(200,{
  "currentChannel": "justitia-chan1"
})

const channel = () => dispatch => {
  return axios.get('/api/curChannel')
    .then(resp => {
      dispatch(actions.getChannel(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}

const channelList = () => (dispatch) => {
  return axios.get('/api/channels')
    .then(resp => {
      dispatch(actions.getChannelList(resp.data))
    })
    .catch(error => {
      console.error(error)
    })
}



const blockPerHour = channel => dispatch => {
  return get(`/api/blocksByHour/${channel}/1`)
    .then(resp => {
      dispatch(actions.getBlockPerHour(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const blockPerMin = channel => dispatch => {
  return get(`/api/blocksByMinute/${channel}/1`)
    .then(resp => {
      dispatch(actions.getBlockPerMin(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const changeChannel = channel => dispatch => {
  return get(`/api/changeChannel/${channel}`)
    .then(resp => {
      dispatch(actions.updateChannel(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

// const channel = () => dispatch => {
//   return get('/api/curChannel')
//     .then(resp => {
//       dispatch(actions.getChannel(resp))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const channelList = () => dispatch => {
//   return get('/api/channels')
//     .then(resp => {
//       dispatch(actions.getChannelList(resp))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

const dashStats = channel => dispatch => {
  return get(`/api/status/${channel}`)
    .then(resp => {
      dispatch(actions.getDashStats(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const notification = notification => dispatch => {
  var notify = JSON.parse(notification)
  dispatch(actions.getNotification(notify))
}

const nodeStatus = channel => dispatch => {
  return get(`/api/nodesStatus/${channel}`)
    .then(resp => {
      dispatch(actions.getNodeStatus(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionByOrg = channel => dispatch => {
  return get(`/api/txByOrg/${channel}`)
    .then(resp => {
      dispatch(actions.getTransactionByOrg(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionPerHour = channel => dispatch => {
  return get(`/api/txByHour/${channel}/1`)
    .then(resp => {
      dispatch(actions.getTransactionPerHour(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const transactionPerMin = channel => dispatch => {
  return get(`/api/txByMinute/${channel}/1`)
    .then(resp => {
      dispatch(actions.getTransactionPerMin(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const contractList = (channel, limit, num) => (dispatch) => {
  return get(`/api/contract/${channel}/${limit}/${num}`)
    .then(resp => {
      dispatch(actions.getContractList(resp))
    }).catch(error => {
      console.error(error)
    })
}

// table channel
const channels = () => (dispatch) => {
  return get('/api/channels/info')
    .then(resp => {
      if (resp['channels']) {
        resp['channels'].forEach(element => {
          element.createdat = moment(element.createdat)
            .tz(moment.tz.guess())
            .format('M-D-YYYY h:mm A zz')
        })
      }

      dispatch(actions.getChannels(resp))
    }).catch(error => {
      console.error(error)
    })
}

const nodeList = (channel) => (dispatch) => {
  return get(`/api/nodes/${channel}`)
    .then(resp => {
      dispatch(actions.getNodeList(resp))
    }).catch(error => {
      console.error(error)
    })
}

const transaction = (channel, transactionId) => (dispatch) => {
  return get(`/api/transaction/${channel}/${transactionId}`)
    .then(resp => {
      dispatch(actions.getTransaction(resp))
    }).catch(error => {
      console.error(error)
    })
}

const transactionList = (channel , limit, num) => (dispatch) => {
  return get(`/api/txList/${channel}/${limit}/${num}`)
    .then(resp => {
      resp.rows.forEach(element => {
        element.createdt = moment(element.createdt)
          .tz(moment.tz.guess())
          .format('M-D-YYYY h:mm A zz')
      })

      dispatch(actions.getTransactionList(resp))
    }).catch(error => {
      console.error(error)
    })
}

const blockList = (channel, limit, num) => (dispatch) => {
  return get(`/api/blockAndTxList/${channel}/${limit}/${num}`)
    .then(resp => {
      dispatch(actions.getBlockList(resp))
    }).catch(error => {
      console.error(error)
    })
}

const watchContract = (channel, id) => dispatch => {
    return get(`/api/watchcontract/${channel}/${id}`)
    .then(resp => {
        dispatch(actions.getWatchContract(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

const uploadContract = (channel, id, value) => dispatch => {
    let contractvalue = {
      value : value
    }

    return post(`/api/uploadContract/${channel}/${id}`,{
      data : value
    })
    .then(resp => {
      dispatch(actions.getUploadContract(resp))
    })
    .catch(error => {
      console.error(error)
    })
}

export default {
  blockList,
  contractList,
  channels,
  nodeList,
  transaction,
  transactionList,
  blockPerHour,
  blockPerMin,
  transactionPerHour,
  transactionPerMin,
  transactionByOrg,
  notification,
  dashStats,
  channel,
  channelList,
  changeChannel,
  nodeStatus,
  watchContract,
  uploadContract
}

// import actions from './actions'
// import axios from 'axios'
// import moment from 'moment-timezone'
// var MockAdapter = require('axios-mock-adapter');
// var mock = new MockAdapter(axios);

// mock.onGet('/api/blockAndTxList').reply(200, {
//   "rows": [
//     {
//         "blocknum": 18986,
//         "txcount": 9,
//         "datahash": "0x7fd6691cf6114a11c3f2fb75501b4dc8f58206aced871f429ea0b14b5c4a3920",
//         "blockhash": "0x458a64ad15f1c6b65a0c928cda9b377aadbb0508b55e5eaddab7a6b59fe6f59a",
//         "prehash": "0x97c9fabb157d492c9c21adf56144c3b37c7d7e8409b61a2f3ed61422fbed6220",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "txhash": [
//             "0xfc64fe1ca4b9a97b0506ef5cb214069cdf0fc3a0eff3ec741980e651c0feb3e7",
//             "0x3462a47fd4e62bd619fa8a90ee1c9fddc7f95646e15cf839baa485d7b172094e",
//             "0xb5e96154bd58aa978ef7b48a634a96e13e14a99b02754ecb8004fa6c41e414d9",
//             "0x472e22f461a4678c6473b200c7df074c2eb6d0c230bac31d5e2a1f9696592fcd",
//             "0xc3971cf9c8be7c2e30ba91481ea66592d55fdb88214d0a43165a4653095cadb3",
//             "0xdd4e2bccaed9522682a965a11f2f366ae38006c86a73f2cbe33143039b9fc41e",
//             "0xda74d3118805afe0e629e1425b62c41a22236d4a80bbeacb1da04e46c6e53bc8",
//             "0x412747a1435b433c28ce0548943c163734a2c53637b5fba29e84223d31993630",
//             "0x2f29089d8c1748adc09b2962e75348e5b8056b1cbdd0bd02fdeb5e4170aad931"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18985,
//         "txcount": 0,
//         "datahash": "0x0000000000000000000000000000000000000000000000000000000000000000",
//         "blockhash": "0x97c9fabb157d492c9c21adf56144c3b37c7d7e8409b61a2f3ed61422fbed6220",
//         "prehash": "0xb0330d550af282630a3a1003065113a39d064bd1c432b8544e07acbdb37cdf30",
//         "createdt": "2018-10-16T23:08:08.000Z",
//         "txhash": null,
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18984,
//         "txcount": 4,
//         "datahash": "0x7fd6691cf6114a11c3f2fb75501b4dc8f58206aced871f429ea0b14b5c4a3920",
//         "blockhash": "0xb0330d550af282630a3a1003065113a39d064bd1c432b8544e07acbdb37cdf30",
//         "prehash": "0x83decf0b7430cd2088dda636bb78fd9fda77453e75419b83b2f592e26b1edbca",
//         "createdt": "2018-10-16T23:08:06.000Z",
//         "txhash": [
//             "0x472311c68646ce257c33c2a2a7282258af3d0227f515c9e78c3b71a2dd3d45eb",
//             "0x74aa880dfb56d888e9ca6b823095e186c90fee4fbc38075b4dd39da8f492c4c9",
//             "0xbdb716f118b3aa984d8faffdc866dd0c7adacb405ec3067364a94638b99687aa",
//             "0xcfc066dea7d3827be02c340f907ddb0e654e95342be28a6d2a08e169c18bfc05"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18983,
//         "txcount": 7,
//         "datahash": "0x064574272816f8c9eb0e5642ffe797d13e1a20b47f5a2bd5b3169357d51f43a8",
//         "blockhash": "0x83decf0b7430cd2088dda636bb78fd9fda77453e75419b83b2f592e26b1edbca",
//         "prehash": "0xe39d56466058dc750907fb314b21175b465e889265af5e368e891cd0f6cdfaa7",
//         "createdt": "2018-10-16T23:08:04.000Z",
//         "txhash": [
//             "0x9f2447418c50fc7550126f8670ae0543572af0f1365a892179ccfe539041ce78",
//             "0xc7402f13958610687fcdc163da2a20eb5899fbe07d8f91cc8d61f4b580d822e6",
//             "0x084c83c3f294b444115e4afbfbe4920d62f22b4e19aeea2bddedd0c840ce7674",
//             "0xe82c9f68dd6c93439ce4731e03a6ea5d436ce49fce10176fcdf65e4f94d9f201",
//             "0x191364f6012f2f0bf3623b519ad5eb268263e110ded8dae5082df56d2a2ac3bd",
//             "0xba5952aa2166a9c0558f1428aee683493bb5016b76b673a0b8d9df718326e3f4",
//             "0xecada6e49e16ddb8d7eb7bece2603e134ea53ef889b3ca2d839b4e56a76bc477"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18982,
//         "txcount": 5,
//         "datahash": "0xfe7ca5e77ebebdbe5b01977e814ad2e46a266f1e1af5f918dee0e064b3270c6f",
//         "blockhash": "0xe39d56466058dc750907fb314b21175b465e889265af5e368e891cd0f6cdfaa7",
//         "prehash": "0x22fecd3695eafc5fea571181de387ee29eaa135e7e20a00d5787263a214bbba8",
//         "createdt": "2018-10-16T23:08:02.000Z",
//         "txhash": [
//             "0xd98e66ceba7df671c3dd49da13d4013b2438d11d15a3e81d9a4ffef94310cefd",
//             "0x386bafe34a49fb33245dcf966733cbc6e6bd5029035bd51809276508af808cf1",
//             "0xf9e8ffcb065a36b27e53172b628d229beb77057be99038aa2eccd4b0bdc8af40",
//             "0x8827a7f8c4bf628bceb2176ad34221962efe78033056d6b133196979e961e2f8",
//             "0x0318e250e4e701274261f1430bd42aab59a269bb693e55db2a1064273dd0f7e1"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18981,
//         "txcount": 4,
//         "datahash": "0xbdb0114aa7b3b0b83443ce7c3fe8ae7027b3a2bc848714cc2a449192dfe7344f",
//         "blockhash": "0x22fecd3695eafc5fea571181de387ee29eaa135e7e20a00d5787263a214bbba8",
//         "prehash": "0x4023a70fd1d7f2a8beca5227e7c5165929e0911f5f7846e1b8aa30158ff7378b",
//         "createdt": "2018-10-16T23:08:00.000Z",
//         "txhash": [
//             "0xe70bfef5b2c683ddd4ca2ff1dc471aac9794bab91005aedb7a496c32ecb89cc6",
//             "0xfe96c8d27cd649f105033bf26be79c8a380b5b72338fc3fafaa6b29dfb61fbb2",
//             "0xb40f0f60e426ce74c3cc270d1c36f247bed9541b6877aa1673dbf30536a83f3a",
//             "0x0bb1008b99221d19e25896521c3a7355c90ac03788a97d76acd3c3f7ef7c472d"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18980,
//         "txcount": 4,
//         "datahash": "0xb769c2b68390a51c109e43ae0fa3873dce8914333990d1b5225fa3fa5da18534",
//         "blockhash": "0x4023a70fd1d7f2a8beca5227e7c5165929e0911f5f7846e1b8aa30158ff7378b",
//         "prehash": "0x9dd2babe55c864868faa19d611d847187c4627c68328c36c1a6ec91b716e9786",
//         "createdt": "2018-10-16T23:07:58.000Z",
//         "txhash": [
//             "0x21a8b35381925436d635d8b8886d17b7700877b44b438ba0f6831e1c062457f1",
//             "0xbb84381a24452974e0a8cc67128ac8e01615217f77034c2259cd862171b736c6",
//             "0x3f5d0f706c4141b3d38248154b8078f1906940629b0832a6763bc16ef88f0480",
//             "0xf8d2dec177b6cbbab1639d2afc528bca07493af2c91509065e7db529b81a8fe5"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18979,
//         "txcount": 8,
//         "datahash": "0xab3da9770990193b375b74d819626f71141f2790e0dbc5a95ebe1f6d624556c4",
//         "blockhash": "0x9dd2babe55c864868faa19d611d847187c4627c68328c36c1a6ec91b716e9786",
//         "prehash": "0x645a74b4f4608a6d563e9eac2dcb8c5135a6cecf064566a8eec5acd30bf23748",
//         "createdt": "2018-10-16T23:07:56.000Z",
//         "txhash": [
//             "0x821fb22327db9cf97b02e7a2eb507cd8dee96ded0007683ca9d9bd81505949c9",
//             "0xb6f6238cc2c300a9968e9c7ac1ef1af82d6b7119e151e4dc755aa4deb3721941",
//             "0xa00b6ad03ece58ceb01831a0197252b42efaaef41c4997fccf50ea2d2ba1ce42",
//             "0x8226bcca949e1df4d9d9e6b9c72293cd2604dbe009d6b68f06407e5e11ef9111",
//             "0x3380aaa173897bc8f85f532347716783701be3499f24c23b6da7415dbd75252a",
//             "0x7a9ee089420bbdacc18c8216fccef8c51076c7acb98a53de7dcb19ddde248c1c",
//             "0x82ce517bf26e2899bdfa1f3e23b6942d7f826d5399eafe5955b2c683bda748bf",
//             "0x0a175073c95dc47e40ca40b2dce639397eb951697152d4c19fde278366d31cd6"
//         ],
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18978,
//         "txcount": 0,
//         "datahash": "0x0000000000000000000000000000000000000000000000000000000000000000",
//         "blockhash": "0x645a74b4f4608a6d563e9eac2dcb8c5135a6cecf064566a8eec5acd30bf23748",
//         "prehash": "0xef0c64c49e62862d3c47416b59af1e339a9f95fc8f8f6e1b81da6fcc6b8b397d",
//         "createdt": "2018-10-16T23:07:54.000Z",
//         "txhash": null,
//         "channelname": "justitia-chan1"
//     },
//     {
//         "blocknum": 18977,
//         "txcount": 6,
//         "datahash": "0x68481300bf2efd8f94616551a9096ae4a89260fe7b4e386c883cd59eb1c44930",
//         "blockhash": "0xef0c64c49e62862d3c47416b59af1e339a9f95fc8f8f6e1b81da6fcc6b8b397d",
//         "prehash": "0x9ee67058cf424aca0e347ea5cbe14d568de6205cf97dbfdba4c8ff7048e478fc",
//         "createdt": "2018-10-16T23:07:52.000Z",
//         "txhash": [
//             "0xa96297396c4e367e55dfd0929241532c874b109efa4de9e5c47cdf03e5727beb",
//             "0xe3c8f9fcf5c47ed79364b5e09f20cf72c2b895bf1d3138da86f286d255858511",
//             "0xc147c1ef3f581ef53c0dc189efef854df71c2864ccffc41235b67577168ee9f3",
//             "0xfb09e070832310a9f726ad929e1e012b6c50c64c944ddc19eb35f7fef7aa3b2e",
//             "0x3a1f4f24003e267f1a3478cde49ff7b80a4323e47cd2e7ae00516b390dc3bca0",
//             "0x3272bcd218cd62deef109ddd91bf7a635ea7df04938ff4d61f3406b83d26f9e8"
//         ],
//         "channelname": "justitia-chan1"
//     }
//   ]
// });

// mock.onGet('/api/contract').reply(200, {
//   "contract": [
//     {
//         "id" : 0,
//         "name": "0xf11902ca8bb5df180e0843a349f76be2f6c9f06e",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0x8a657c1e5e69a437ab7acabee54937f0a031225719a0bfab6ac0371c13189c18",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 1,
//         "name": "0x25b88fa14edee9a87a396432919f07d80965c732",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0x3298359ad17b4bb1ff2856ea75228455774a0a5c8e19d4c4bee07a2f81f5600a",
//         "contract_code": null,
//         "srecode" : "jruefihgiodcfk",
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 2,
//         "name": "0x3d53ec23c0e58de07f5042d9b5a3fdeb4b33f7f3",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0x588972b57b48d5fd1f41be78c617f0e5116c21f8c4c2a7ca8277db6bd4ff04b9",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 3,
//         "name": "0x34824636703264c992f6955e90652f67607a930d",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0xd633747bdacaf8399197c2a0133ae87a821bb534c9c15780b1cc04e31d58e561",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 4,
//         "name": "0x05938a839301c9d6f3cb955acfd59cea29a955b3",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0xd0fa162d1db66f88df4393dd65c9c87958f67ae4619640c387290d515149c799",
//         "contract_code": null,
//         "srecode" : "ndyhcfiesdruwhyfc",
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 5,
//         "name": "0x9098d3ea16e71b9030b814fba0101af51e10c145",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0xe84a71c016f9015b40d2f17a248d4503e724ac791c01abc110dc66f3bce20a00",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 6,
//         "name": "0x0863a10c6873842667d4907f58a2c8518dc1c807",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0xa96945650ec4e3de4382613afeefdfc8790ad6bd85e91471a4cbfe2256dbd6b5",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 7,
//         "name": "0x7f027ee33d1642fdd4aebe09f8049ee65f021d2a",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0x746078dd03e33350ca20baa83e23f0f2d00f2168f2efff717e1073f9b6364880",
//         "contract_code": null,
//         "srecode" : null,
//         "bytecode" : "01010101011"
//     },
//     {
//         "id" : 8,
//         "name": "0x2ea7588addaaa29b95eec58102c9abab77fbca9e",
//         "balance": "0",
//         "txcount": 1,
//         "creator": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "creator_hash": "0xcff76ab48d241860445fa0df8d2bb3de8d43a43db064ab1af4ea781dfb2d095f",
//         "contract_code": null,
//         "srecode" : "uherfiwqpljforhfceikcifdh",
//         "bytecode" : "01010101011"
//     }
//   ]
// });

// mock.onGet('/api/channels/info').reply(200, {
//     "channels": [
//         {
//             "id": 65,
//             "channelname": "justitia-chan1",
//             "blocks": 40,
//             "genesis_block_hash": "justitia-chan1",
//             "transactions": 0,
//             "createdat": "2018-10-17T06:10:09.000Z",
//             "channel_hash": "justitia-chan1"
//         }
//     ]
// });

// mock.onGet('/api/nodes').reply(200, {
//   "nodes": [
//     {
//         "name": "justitia-chan1",
//         "requests": "127.0.0.1:47768",
//         "server_hostname": "justitia-node1",
//         "genesis_block_hash": "justitia-chan1"
//     },
//     {
//         "name": "justitia-chan2",
//         "requests": "127.0.0.1:47768",
//         "server_hostname": "justitia-node2",
//         "genesis_block_hash": "justitia-chan1"
//     }
//   ]
// });

// mock.onGet('/api/transaction').reply(200, {
//   "row": {
//     "txhash": "0x8e1adeaad8927c1e5212c041abec70af92cf4a711d21dd77cc0772210ea3074a",
//     "validation_code": null,
//     "payload_proposal_hash": null,
//     "creator_msp_id": null,
//     "endorser_msp_id": null,
//     "contractname": "",
//     "type": "0",
//     "createdt": "2018-10-16T22:59:23.000Z",
//     "read_set": {},
//     "write_set": {},
//     "channelname": "justitia-chan1"
//   }
// });

// mock.onGet('/api/txList').reply(200, {
//   "rows": [
//     {
//         "creator_msp_id": null,
//         "txhash": "0x2f29089d8c1748adc09b2962e75348e5b8056b1cbdd0bd02fdeb5e4170aad931",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x87f029b41ea019dfbabf17bb579870c3e87faf8a",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0x412747a1435b433c28ce0548943c163734a2c53637b5fba29e84223d31993630",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x01c91a1b352a2903bc8378e5f645c9bc8685029e",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xda74d3118805afe0e629e1425b62c41a22236d4a80bbeacb1da04e46c6e53bc8",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x1f851d4d373e3e4d93bc1f26718b3ea0e5d3b1f1",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xdd4e2bccaed9522682a965a11f2f366ae38006c86a73f2cbe33143039b9fc41e",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x57924a847e363a49c757792aa2f30f46fa922370",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xc3971cf9c8be7c2e30ba91481ea66592d55fdb88214d0a43165a4653095cadb3",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x1d1602e497f7a6d13a4e846ea469a1bfa24ecb13",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0x472e22f461a4678c6473b200c7df074c2eb6d0c230bac31d5e2a1f9696592fcd",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x926794f9785ed0ffe92364ee796f2234998f6f20",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xb5e96154bd58aa978ef7b48a634a96e13e14a99b02754ecb8004fa6c41e414d9",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x3be86cf6b79472aa0ad787ec410e08b877e52feb",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0x3462a47fd4e62bd619fa8a90ee1c9fddc7f95646e15cf839baa485d7b172094e",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x7a445eaf276834d9aaeda583f46d6b505489923e",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xfc64fe1ca4b9a97b0506ef5cb214069cdf0fc3a0eff3ec741980e651c0feb3e7",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:10.000Z",
//         "blockid": 18986,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x8be461ea3c27b698a31515a98b8fa339b4bea51a",
//         "channelname": "justitia-chan1"
//     },
//     {
//         "creator_msp_id": null,
//         "txhash": "0xcfc066dea7d3827be02c340f907ddb0e654e95342be28a6d2a08e169c18bfc05",
//         "type": "0",
//         "contractname": "",
//         "createdt": "2018-10-16T23:08:06.000Z",
//         "blockid": 18984,
//         "blocktime": null,
//         "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
//         "to": "0x926794f9785ed0ffe92364ee796f2234998f6f20",
//         "channelname": "justitia-chan1"
//     }
//   ]
// });

// mock.onGet('/api/blocksByHour/1').reply(200, {
//   "rows": [
//     {
//         "datetime": "2018-11-04T03:00:00.000Z",
//         "count": "20"
//     },
//     {
//         "datetime": "2018-11-04T04:00:00.000Z",
//         "count": "10"
//     },
//     {
//         "datetime": "2018-11-04T05:00:00.000Z",
//         "count": "40"
//     },
//     {
//         "datetime": "2018-11-04T06:00:00.000Z",
//         "count": "50"
//     },
//     {
//         "datetime": "2018-11-04T07:00:00.000Z",
//         "count": "900"
//     },
//     {
//         "datetime": "2018-11-04T08:00:00.000Z",
//         "count": "20"
//     }
//   ]
// });


// mock.onGet('/api/blocksByMinute/1').reply(200,{
//   "rows": [
//     {
//         "datetime": "2018-11-05T02:25:00.000Z",
//         "count": "100"
//     },
//     {
//         "datetime": "2018-11-05T02:26:00.000Z",
//         "count": "0"
//     },
//     {
//         "datetime": "2018-11-05T02:27:00.000Z",
//         "count": "80"
//     },
//     {
//         "datetime": "2018-11-05T02:28:00.000Z",
//         "count": "0"
//     },
//     {
//         "datetime": "2018-11-05T02:29:00.000Z",
//         "count": "0"
//     },
//     {
//         "datetime": "2018-11-05T02:30:00.000Z",
//         "count": "0"
//     }
//   ]
// })

// mock.onGet('/api/changeChannel').reply(200,{
//     "currentChannel": "justitia-chan1"
// })

// mock.onGet('/api/curChannel').reply(200,{
//   "currentChannel": "justitia-chan1"
// })

// mock.onGet('/api/channels').reply(200,{
//   "channels": [
//     "justitia-chan1"
//   ]
// })

// mock.onGet('/api/status').reply(200,{

//     "contractCount": "79",
//     "txCount": "4247",
//     "latestBlock": "997",
//     "nodeCount": "1",
//     "channelCount": "1"
  
// })

// mock.onGet('/api/nodesStatus').reply(200,{
//   "nodes": [
//     {
//         "status": "RUNNING",
//         "server_hostname": "127.0.0.1:47768"
//     }
//   ]
// })

// mock.onGet('/api/txByOrg').reply(200,{
//   "rows": [
//     {
//         "count": "0",
//         "creator_msp_id": null
//     }
//   ]
// })

// mock.onGet('/api/txByHour/1').reply(200,{
//   "rows": [
//     {
//         "datetime": "2018-11-04T03:00:00.000Z",
//         "count": "10"
//     },
//     {
//         "datetime": "2018-11-04T04:00:00.000Z",
//         "count": "110"
//     },
//     {
//         "datetime": "2018-11-04T05:00:00.000Z",
//         "count": "40"
//     },
//     {
//         "datetime": "2018-11-04T06:00:00.000Z",
//         "count": "7"
//     },
//     {
//         "datetime": "2018-11-04T07:00:00.000Z",
//         "count": "20"
//     },
//     {
//         "datetime": "2018-11-04T08:00:00.000Z",
//         "count": "59"
//     },
//     {
//         "datetime": "2018-11-04T09:00:00.000Z",
//         "count": "60"
//     }
//   ]
// })

// mock.onGet('/api/txByMinute/1').reply(200,{
//   "rows": [
//     {
//         "datetime": "2018-11-05T02:29:00.000Z",
//         "count": "10"
//     },
//     {
//         "datetime": "2018-11-05T02:30:00.000Z",
//         "count": "20"
//     },
//     {
//         "datetime": "2018-11-05T02:31:00.000Z",
//         "count": "30"
//     },
//     {
//         "datetime": "2018-11-05T02:32:00.000Z",
//         "count": "40"
//     },
//     {
//         "datetime": "2018-11-05T02:33:00.000Z",
//         "count": "50"
//     },
//     {
//         "datetime": "2018-11-05T02:34:00.000Z",
//         "count": "60"
//     },
//     {
//         "datetime": "2018-11-05T02:35:00.000Z",
//         "count": "70"
//     }
//   ]
// })

// mock.onGet('/api/watchcontract').reply(200,{
//     "row" : "123 <br /> doc //n <br /> cjuyd"
// })

// mock.onPost('/api/uploadContract').reply(200,{
//     "message" : "success"
// })

// const blockList = (channel) => (dispatch) => {
//   return axios.get(`/api/blockAndTxList`)
//     .then(resp => {
//       dispatch(actions.getBlockList(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// const contractList = (channel) => (dispatch) => {
//   return axios.get(`/api/contract`)
//     .then(resp => {
//       dispatch(actions.getContractList(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// // table channel
// const channels = () => (dispatch) => {
//   return axios.get('/api/channels/info')
//     .then(resp => {
//       if (resp['channels']) {
//         resp['channels'].forEach(element => {
//           element.createdat = moment(element.createdat)
//             .tz(moment.tz.guess())
//             .format('M-D-YYYY h:mm A zz')
//         })
//       }

//       dispatch(actions.getChannels(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// const nodeList = (channel) => (dispatch) => {
//   return axios.get(`/api/nodes`)
//     .then(resp => {
//       dispatch(actions.getNodeList(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// const transaction = (channel, transactionId) => (dispatch) => {
//   return axios.get(`/api/transaction`)
//     .then(resp => {
//       dispatch(actions.getTransaction(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// const transactionList = (channel) => (dispatch) => {
//   return axios.get(`/api/txList`)
//     .then(resp => {
//       resp.data.rows.forEach(element => {
//         element.createdt = moment(element.createdt)
//           .tz(moment.tz.guess())
//           .format('M-D-YYYY h:mm A zz')
//       })

//       dispatch(actions.getTransactionList(resp.data))
//     }).catch(error => {
//       console.error(error)
//     })
// }

// const blockPerHour = channel => dispatch => {
//   return axios.get(`/api/blocksByHour/1`)
//     .then(resp => {
//       dispatch(actions.getBlockPerHour(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const blockPerMin = channel => dispatch => {
//   return axios.get(`/api/blocksByMinute/1`)
//     .then(resp => {
//       dispatch(actions.getBlockPerMin(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const changeChannel = channel => dispatch => {
//   return axios.get(`/api/changeChannel`)
//     .then(resp => {
//       dispatch(actions.updateChannel(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const channel = () => dispatch => {
//   return axios.get('/api/curChannel')
//     .then(resp => {
//       dispatch(actions.getChannel(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const channelList = () => (dispatch) => {
//   return axios.get('/api/channels')
//     .then(resp => {
//       dispatch(actions.getChannelList(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const dashStats = () => dispatch => {
//   return axios.get('/api/status')
//     .then(resp => {
//       dispatch(actions.getDashStats(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const notification = notification => dispatch => {
//   var notify = JSON.parse(notification)
//   dispatch(actions.getNotification(notify))
// }

// const nodeStatus = channel => dispatch => {
//   return axios.get(`/api/nodesStatus`)
//     .then(resp => {
//       dispatch(actions.getNodeStatus(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const transactionByOrg = channel => dispatch => {
//   return axios.get(`/api/txByOrg`)
//     .then(resp => {
//       dispatch(actions.getTransactionByOrg(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const transactionPerHour = channel => dispatch => {
//   return axios.get(`/api/txByHour/1`)
//     .then(resp => {
//       dispatch(actions.getTransactionPerHour(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const transactionPerMin = channel => dispatch => {
//   return axios.get(`/api/txByMinute/1`)
//     .then(resp => {
//       dispatch(actions.getTransactionPerMin(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const watchContract = (channel, id) => dispatch => {
//     return axios.get(`/api/watchcontract`)
//     .then(resp => {
//         dispatch(actions.getWatchContract(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// const uploadContract = (channel, id, value) => dispatch => {
//     return axios.post(`/api/uploadContract`)
//     .then(resp => {
//         dispatch(actions.getUploadContract(resp.data))
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

// export default {
//   blockList,
//   contractList,
//   channels,
//   nodeList,
//   transaction,
//   transactionList,
//   blockPerHour,
//   blockPerMin,
//   transactionPerHour,
//   transactionPerMin,
//   transactionByOrg,
//   notification,
//   dashStats,
//   channel,
//   channelList,
//   changeChannel,
//   nodeStatus,
//   watchContract,
//   uploadContract
// }