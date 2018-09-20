// /**
// *    SPDX-License-Identifier: Apache-2.0
// */

// var requtil = require("./requestutils.js");
// const dbroutes = (app, persist) => {

//   var statusMetrics = persist.getMetricService();
//   var crudService = persist.getCrudService();

//   app.get("/api/status/:channel", function (req, res) {
//     let channelName = req.params.channel;
//     if (channelName) {
//       statusMetrics.getStatus(channelName, function (data) {
//         if (
//           data &&
//           (data.contractCount &&
//             data.txCount &&  data.nodeCount)
//         ) {
//           return res.send(data);
//         } else {
//           return requtil.notFound(req, res);
//         }
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   /***
//   Transaction count
//   GET /api/block/get -> /api/block/transactions/
//   curl -i 'http://<host>:<port>/api/block/transactions/<channel>/<number>'
//   Response:
//   {
//     "number": 2,
//     "txCount": 1
//   }
//   */
//   app.get("/api/block/transactions/:channel/:number", async function (req, res) {
//     let number = parseInt(req.params.number);
//     let channelName = req.params.channel;
//     if (!isNaN(number) && channelName) {
//         var row = await crudService.getTxCountByBlockNum(channelName,number);
//         if (row) {
//             return res.send({
//               status: 200,
//               number: row.blocknum,
//               txCount: row.txcount
//             });
//         }
//         return requtil.notFound(req, res);
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   //
//   /***
//   Transaction Information
//   GET /api/tx/getinfo -> /api/transaction/<txid>
//   curl -i 'http://<host>:<port>/api/transaction/<channel>/<txid>'
//   Response:
//   {
//     "tx_id": "header.channel_header.tx_id",
//     "timestamp": "header.channel_header.timestamp",
//     "channel_id": "header.channel_header.channel_id",
//     "type": "header.channel_header.type"
//   }
//   */

//   app.get("/api/transaction/:channel/:txid", function (req, res) {
//     let txid = req.params.txid;
//     let channelName = req.params.channel;
//     if (txid && txid != "0" && channelName) {
//         crudService.getTransactionByID(channelName, txid).then(row => {
//         if (row) {
//           return res.send({ status: 200, row });
//         }
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   /***
//   Transaction list
//   GET /api/txList/
//   curl -i 'http://<host>:<port>/api/txList/<channel>/<blocknum>/<txid>/<limitrows>/<offset>'
//   Response:
//   {"rows":[{"id":56,"channelname":"mychannel","blockid":24,
//   "txhash":"c42c4346f44259628e70d52c672d6717d36971a383f18f83b118aaff7f4349b8",
//   "createdt":"2018-03-09T19:40:59.000Z","contractname":"mycc"}]}
//   */
//   app.get("/api/txList/:channel/:blocknum/:txid", function (req, res) {
//     let channelName = req.params.channel;
//     let blockNum = parseInt(req.params.blocknum);
//     let txid = parseInt(req.params.txid);

//     if (isNaN(txid)) {
//       txid = 0;
//     }
//     if (channelName) {
//       crudService.getTxList(channelName, blockNum, txid).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   /***Node List
//   GET /nodelist -> /api/nodes
//   curl -i 'http://<host>:<port>/api/nodes/<channel>'
//   Response:
//   [
//     {
//       "requests": "grpcs://127.0.0.1:7051",
//       "server_hostname": "node0.org1.example.com"
//     }
//   ]
//   */
//   app.get("/api/nodes/:channel", function (req, res) {
//     let channelName = req.params.channel;
//     if (channelName) {
//       statusMetrics.getNodeList(channelName, function (data) {
//         res.send({ status: 200, nodes: data });
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   /***
//    List of blocks and transaction list per block
//   GET /api/blockAndTxList
//   curl -i 'http://<host>:<port>/api/blockAndTxList/channel/<blockNum>/<limitrows>/<offset>'
//   Response:
//   {"rows":[{"id":51,"blocknum":50,"datahash":"374cceda1c795e95fc31af8f137feec8ab6527b5d6c85017dd8088a456a68dee",
//   "prehash":"16e76ca38975df7a44d2668091e0d3f05758d6fbd0aab76af39f45ad48a9c295","channelname":"mychannel","txcount":1,
//   "createdt":"2018-03-13T15:58:45.000Z","txhash":["6740fb70ed58d5f9c851550e092d08b5e7319b526b5980a984b16bd4934b87ac"]}]}
//   *
//   */

//   app.get("/api/blockAndTxList/:channel/:blocknum", function (req, res) {
//     let channelName = req.params.channel;
//     let blockNum = parseInt(req.params.blocknum);
//     if (channelName && !isNaN(blockNum)) {
//       crudService.getBlockAndTxList(channelName, blockNum).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });


//   // TRANSACTION METRICS

//   /***
//    Transactions per minute with hour interval
//   GET /api/txByMinute
//   curl -i 'http://<host>:<port>/api/txByMinute/<channel>/<hours>'
//   Response:
//   {"rows":[{"datetime":"2018-03-13T17:46:00.000Z","count":"0"},{"datetime":"2018-03-13T17:47:00.000Z","count":"0"},{"datetime":"2018-03-13T17:48:00.000Z","count":"0"},{"datetime":"2018-03-13T17:49:00.000Z","count":"0"},{"datetime":"2018-03-13T17:50:00.000Z","count":"0"},{"datetime":"2018-03-13T17:51:00.000Z","count":"0"},
//   {"datetime":"2018-03-13T17:52:00.000Z","count":"0"},{"datetime":"2018-03-13T17:53:00.000Z","count":"0"}]}

//   */

//   app.get("/api/txByMinute/:channel/:hours", function (req, res) {
//     let channelName = req.params.channel;
//     let hours = parseInt(req.params.hours);

//     if (channelName && !isNaN(hours)) {
//       statusMetrics.getTxByMinute(channelName, hours).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });

//   /***
//    Transactions per hour(s) with day interval
//   GET /api/txByHour
//   curl -i 'http://<host>:<port>/api/txByHour/<channel>/<days>'
//   Response:
//   {"rows":[{"datetime":"2018-03-12T19:00:00.000Z","count":"0"},
//   {"datetime":"2018-03-12T20:00:00.000Z","count":"0"}]}
//   */

//   app.get("/api/txByHour/:channel/:days", function (req, res) {
//     let channelName = req.params.channel;
//     let days = parseInt(req.params.days);

//     if (channelName && !isNaN(days)) {
//       statusMetrics.getTxByHour(channelName, days).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });

//   // BLOCK METRICS

//   /***
//    Blocks per minute with hour interval
//   GET /api/blocksByMinute
//   curl -i 'http://<host>:<port>/api/blocksByMinute/<channel>/<hours>'
//   Response:
//   {"rows":[{"datetime":"2018-03-13T19:59:00.000Z","count":"0"}]}

//   */

//   app.get("/api/blocksByMinute/:channel/:hours", function (req, res) {
//     let channelName = req.params.channel;
//     let hours = parseInt(req.params.hours);

//     if (channelName && !isNaN(hours)) {
//       statusMetrics.getBlocksByMinute(channelName, hours).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });

//   /***
//    Blocks per hour(s) with day interval
//   GET /api/blocksByHour
//   curl -i 'http://<host>:<port>/api/blocksByHour/<channel>/<days>'
//   Response:
//   {"rows":[{"datetime":"2018-03-13T20:00:00.000Z","count":"0"}]}

//   */

//   app.get("/api/blocksByHour/:channel/:days", function (req, res) {
//     let channelName = req.params.channel;
//     let days = parseInt(req.params.days);

//     if (channelName && !isNaN(days)) {
//       statusMetrics.getBlocksByHour(channelName, days).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });

//   /***
//    Transactions by Organization(s)
//   GET /api/txByOrg
//   curl -i 'http://<host>:<port>/api/txByOrg/<channel>'
//   Response:
//   {"rows":[{"count":"4","creator_msp_id":"Org1"}]}

//   */
//   app.get("/api/txByOrg/:channel", function (req, res) {
//     let channelName = req.params.channel;

//     if (channelName) {
//       statusMetrics.getTxByOrgs(channelName).then(rows => {
//         if (rows) {
//           return res.send({ status: 200, rows });
//         }
//         return requtil.notFound(req, res);
//       });
//     } else {
//       return requtil.invalidRequest(req, res);
//     }
//   });

//  /**
//           Channels
//           GET /channels -> /api/channels/info
//           curl -i 'http://<host>:<port>/api/channels/<info>'
//           Response:
//           [
//             {
//               "channelName": "mychannel",
//               "channel_hash": "",
//               "craetedat": "1/1/2018"
//             }
//           ]
//         */

//        app.get("/api/channels/info", function (req, res) {
//         crudService.getChannelsInfo().then(data=>{
//           res.send({ status: 200, channels:data })
//         }).catch(err=>res.send({status:500}))
//     });


// }

// module.exports = dbroutes;

/**
*    SPDX-License-Identifier: Apache-2.0
*/

var requtil = require("./requestutils.js");
const dbroutes = (app, persist) => {

  var statusMetrics = persist.getMetricService();
  var crudService = persist.getCrudService();

  app.get("/api/status/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
      statusMetrics.getStatus(channelName, function (data) {
        if (
          data &&
          (data.contractCount &&
            data.txCount &&  data.nodeCount)
        ) {
          return res.send(data);
        } else {
          return requtil.notFound(req, res);
        }
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  /***
  Transaction count
  GET /api/block/get -> /api/block/transactions/
  curl -i 'http://<host>:<port>/api/block/transactions/<channel>/<number>'
  Response:
  {
    "number": 2,
    "txCount": 1
  }
  */
  app.get("/api/block/transactions/:channel/:number", async function (req, res) {
    let number = parseInt(req.params.number);
    let channelName = req.params.channel;
    if (!isNaN(number) && channelName) {
        var row = await crudService.getTxCountByBlockNum(channelName,number);
        if (row) {
            return res.send({
              status: 200,
              number: row.blocknum,
              txCount: row.txcount
            });
        }
        return requtil.notFound(req, res);
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  //
  /***
  Transaction Information
  GET /api/tx/getinfo -> /api/transaction/<txid>
  curl -i 'http://<host>:<port>/api/transaction/<channel>/<txid>'
  Response:
  {
    "tx_id": "header.channel_header.tx_id",
    "timestamp": "header.channel_header.timestamp",
    "channel_id": "header.channel_header.channel_id",
    "type": "header.channel_header.type"
  }
  */

  app.get("/api/transaction/:channel/:txid", function (req, res) {
    let txid = req.params.txid;
    let channelName = req.params.channel;
    if (txid && txid != "0" && channelName) {
        crudService.getTransactionByID(channelName, txid).then(row => {
        if (row) {
          return res.send({ status: 200, row });
        }else{
          return res.send({ status: 200, row : {}});
        }
      });
      // return res.send(
      //       {
      //       "status": 200,
      //       "row": {
      //       "txhash": "5018a79af996a441731b85e5853921d8ddf45978ec932a6fdef0c9e7b6b685a9",
      //       "validation_code": "VALID",
      //       "payload_proposal_hash": "a4f4dfa04ca3805cd758a9b3ebe1fb5ef6d6ca65f4b6d6201bae48c510536d60",
      //       "creator_msp_id": "Org2MSP",
      //       "endorser_msp_id": "{\"Org2MSP\"}",
      //       "chaincodename": "lscc",
      //       "type": "ENDORSER_TRANSACTION",
      //       "createdt": "2018-08-27T04:01:06.000Z",
      //       "read_set": [
      //       {
      //         "chaincode": "lscc",
      //         "set": [
      //         {
      //         "key": "mycc",
      //         "version": null
      //         }
      //         ]
      //       },
      //     {
      //     "chaincode": "mycc",
      //     "set": []
      //     }
      //     ],
      //     "write_set": [
      //     {
      //     "chaincode": "lscc",
      //     "set": [
      //     {
      //     "key": "mycc",
      //     "is_delete": false,
      //     "value": "\n\u0004mycc\u0012\u00031.0\u001a\u0004escc\"\u0004vscc*"
      //     }
      //     ]
      //     },
      //     {
      //     "chaincode": "mycc",
      //     "set": [
      //     {
      //     "key": "a",
      //     "is_delete": false,
      //     "value": "100"
      //     },
      //     {
      //     "key": "b",
      //     "is_delete": false,
      //     "value": "200"
      //     }
      //     ]
      //     }
      //     ],
      //     "channelname": "mychannel"
      //     }
      //     }

      //   )
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  /***
  Transaction list
  GET /api/txList/
  curl -i 'http://<host>:<port>/api/txList/<channel>/<blocknum>/<txid>/<limitrows>/<offset>'
  Response:
  {"rows":[{"id":56,"channelname":"mychannel","blockid":24,
  "txhash":"c42c4346f44259628e70d52c672d6717d36971a383f18f83b118aaff7f4349b8",
  "createdt":"2018-03-09T19:40:59.000Z","contractname":"mycc"}]}
  */
  app.get("/api/txList/:channel/:blocknum/:txid", function (req, res) {
    let channelName = req.params.channel;
    let blockNum = parseInt(req.params.blocknum);
    let txid = parseInt(req.params.txid);
    if (isNaN(txid)) {
      txid = 0;
    }
    if (channelName) {
      crudService.getTxList(channelName, blockNum, txid).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }else {
          return res.send({ status: 200, rows :[]});
          // return requtil.invalidRequest(req, res);
        }
      });
      // return res.send(
      //   {
      //   "status": 200,
      //   "rows": [
      //   {
      //   "creator_msp_id": "OrdererMSP",
      //   "txhash": "",
      //   "type": "CONFIG",
      //   "chaincodename": "",
      //   "createdt": "2018-08-27T04:00:47.000Z",
      //   "channelname": "mychannel"
      //   },
      //   {
      //   "creator_msp_id": "OrdererMSP",
      //   "txhash": "",
      //   "type": "CONFIG",
      //   "chaincodename": "",
      //   "createdt": "2018-08-27T04:00:59.000Z",
      //   "channelname": "mychannel"
      //   },
      //   {
      //   "creator_msp_id": "OrdererMSP",
      //   "txhash": "",
      //   "type": "CONFIG",
      //   "chaincodename": "",
      //   "createdt": "2018-08-27T04:01:03.000Z",
      //   "channelname": "mychannel"
      //   },
      //   {
      //   "creator_msp_id": "Org2MSP",
      //   "txhash": "5018a79af996a441731b85e5853921d8ddf45978ec932a6fdef0c9e7b6b685a9",
      //   "type": "ENDORSER_TRANSACTION",
      //   "chaincodename": "lscc",
      //   "createdt": "2018-08-27T04:01:06.000Z",
      //   "channelname": "mychannel"
      //   },
      //   {
      //   "creator_msp_id": "Org1MSP",
      //   "txhash": "2b8c631a6af4a445c345dd34c058f331901dff895c6312b0296254b88d5e7175",
      //   "type": "ENDORSER_TRANSACTION",
      //   "chaincodename": "mycc",
      //   "createdt": "2018-08-27T04:01:43.000Z",
      //   "channelname": "mychannel"
      //   }
      //   ]
      //   }

      //   )
    
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  /***Node List
  GET /nodelist -> /api/nodes
  curl -i 'http://<host>:<port>/api/nodes/<channel>'
  Response:
  [
    {
      "requests": "grpcs://127.0.0.1:7051",
      "server_hostname": "node0.org1.example.com"
    }
  ]
  */
  app.get("/api/nodes/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
      statusMetrics.getNodeList(channelName, function (data) {
        res.send({ status: 200, nodes: data });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  /***
   List of blocks and transaction list per block
  GET /api/blockAndTxList
  curl -i 'http://<host>:<port>/api/blockAndTxList/channel/<blockNum>/<limitrows>/<offset>'
  Response:
  {"rows":[{"id":51,"blocknum":50,"datahash":"374cceda1c795e95fc31af8f137feec8ab6527b5d6c85017dd8088a456a68dee",
  "prehash":"16e76ca38975df7a44d2668091e0d3f05758d6fbd0aab76af39f45ad48a9c295","channelname":"mychannel","txcount":1,
  "createdt":"2018-03-13T15:58:45.000Z","txhash":["6740fb70ed58d5f9c851550e092d08b5e7319b526b5980a984b16bd4934b87ac"]}]}
  *
  */

  app.get("/api/blockAndTxList/:channel/:blocknum", function (req, res) {
    let channelName = req.params.channel;
    let blockNum = parseInt(req.params.blocknum);
    if (channelName && !isNaN(blockNum)) {
      crudService.getBlockAndTxList(channelName, blockNum).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }else {
          // return requtil.invalidRequest(req, res);
          return res.send({ status: 200, rows : [] });
          // return requtil.notFound(req, res);
        }
        
//       return res.send({
// "status": 200,
// "rows": [
// {
// "blocknum": 4,
// "txcount": 1,
// "datahash": "04fcc704153715257ae4fdb591e72135f2bea5e046e0849fa3c2ccab4d41fc6a",
// "blockhash": "2a94d30e16c5bebaaa0995a1e7104bfb1df78780f6498539498f8c3bfa7a5f04",
// "prehash": "b0e880af258512db67976e684abc3e16c91e0bf4a24095df2e3e91e56427d2ee",
// "createdt": "2018-08-27T04:01:43.000Z",
// "txhash": [
// "2b8c631a6af4a445c345dd34c058f331901dff895c6312b0296254b88d5e7175"
// ],
// "channelname": "mychannel"
// },
// {
// "blocknum": 3,
// "txcount": 1,
// "datahash": "e96c2ae4dd47b9e28cc3b98dfaf8e03e341de79bfd919baff6a8811de19842ac",
// "blockhash": "b0e880af258512db67976e684abc3e16c91e0bf4a24095df2e3e91e56427d2ee",
// "prehash": "40cb56284164dfed6c54b60a03e0278edd5470f56d775a6987f542ba7bd9d9eb",
// "createdt": "2018-08-27T04:01:06.000Z",
// "txhash": [
// "5018a79af996a441731b85e5853921d8ddf45978ec932a6fdef0c9e7b6b685a9"
// ],
// "channelname": "mychannel"
// },
// {
// "blocknum": 2,
// "txcount": 1,
// "datahash": "320004c6700011919e3ddf9f15c4a64994e476fd0c8a3d6345df7a6af6e9e70b",
// "blockhash": "40cb56284164dfed6c54b60a03e0278edd5470f56d775a6987f542ba7bd9d9eb",
// "prehash": "0a298a490b00e1c9405708ad51566ad138f26fa7bdeefe0920a48b0f25c01d5e",
// "createdt": "2018-08-27T04:01:03.000Z",
// "txhash": [
// ""
// ],
// "channelname": "mychannel"
// },
// {
// "blocknum": 1,
// "txcount": 1,
// "datahash": "07cf47cdd2236030454e6a1a4da0c493ee12af797150d774420cb8db80c7e5d6",
// "blockhash": "0a298a490b00e1c9405708ad51566ad138f26fa7bdeefe0920a48b0f25c01d5e",
// "prehash": "6278eeaec5b7a8a19730d262b3097848651ecdc465d08ec910000e45a347554a",
// "createdt": "2018-08-27T04:00:59.000Z",
// "txhash": [
// ""
// ],
// "channelname": "mychannel"
// },
// {
// "blocknum": 0,
// "txcount": 1,
// "datahash": "20d0cc631110b03d9d7f04f1aa775f486c3c9c4d3ac3f1e49d63cdc77505f162",
// "blockhash": "6278eeaec5b7a8a19730d262b3097848651ecdc465d08ec910000e45a347554a",
// "prehash": "",
// "createdt": "2018-08-27T04:00:47.000Z",
// "txhash": [
// ""
// ],
// "channelname": "mychannel"
// }
// ]
// })
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });


  // TRANSACTION METRICS

  /***
   Transactions per minute with hour interval
  GET /api/txByMinute
  curl -i 'http://<host>:<port>/api/txByMinute/<channel>/<hours>'
  Response:
  {"rows":[{"datetime":"2018-03-13T17:46:00.000Z","count":"0"},{"datetime":"2018-03-13T17:47:00.000Z","count":"0"},{"datetime":"2018-03-13T17:48:00.000Z","count":"0"},{"datetime":"2018-03-13T17:49:00.000Z","count":"0"},{"datetime":"2018-03-13T17:50:00.000Z","count":"0"},{"datetime":"2018-03-13T17:51:00.000Z","count":"0"},
  {"datetime":"2018-03-13T17:52:00.000Z","count":"0"},{"datetime":"2018-03-13T17:53:00.000Z","count":"0"}]}

  */

  app.get("/api/txByMinute/:channel/:hours", function (req, res) {
    let channelName = req.params.channel;
    let hours = parseInt(req.params.hours);

    if (channelName && !isNaN(hours)) {
      statusMetrics.getTxByMinute(channelName, hours).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }
        return requtil.notFound(req, res);
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /***
   Transactions per hour(s) with day interval
  GET /api/txByHour
  curl -i 'http://<host>:<port>/api/txByHour/<channel>/<days>'
  Response:
  {"rows":[{"datetime":"2018-03-12T19:00:00.000Z","count":"0"},
  {"datetime":"2018-03-12T20:00:00.000Z","count":"0"}]}
  */

  app.get("/api/txByHour/:channel/:days", function (req, res) {
    let channelName = req.params.channel;
    let days = parseInt(req.params.days);

    if (channelName && !isNaN(days)) {
      statusMetrics.getTxByHour(channelName, days).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }
        return requtil.notFound(req, res);
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  // BLOCK METRICS

  /***
   Blocks per minute with hour interval
  GET /api/blocksByMinute
  curl -i 'http://<host>:<port>/api/blocksByMinute/<channel>/<hours>'
  Response:
  {"rows":[{"datetime":"2018-03-13T19:59:00.000Z","count":"0"}]}

  */

  app.get("/api/blocksByMinute/:channel/:hours", function (req, res) {
    let channelName = req.params.channel;
    let hours = parseInt(req.params.hours);

    if (channelName && !isNaN(hours)) {
      statusMetrics.getBlocksByMinute(channelName, hours).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }
        return requtil.notFound(req, res);
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /***
   Blocks per hour(s) with day interval
  GET /api/blocksByHour
  curl -i 'http://<host>:<port>/api/blocksByHour/<channel>/<days>'
  Response:
  {"rows":[{"datetime":"2018-03-13T20:00:00.000Z","count":"0"}]}

  */

  app.get("/api/blocksByHour/:channel/:days", function (req, res) {
    let channelName = req.params.channel;
    let days = parseInt(req.params.days);

    if (channelName && !isNaN(days)) {
      statusMetrics.getBlocksByHour(channelName, days).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows });
        }
        return requtil.notFound(req, res);
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /***
   Transactions by Organization(s)
  GET /api/txByOrg
  curl -i 'http://<host>:<port>/api/txByOrg/<channel>'
  Response:
  {"rows":[{"count":"4","creator_msp_id":"Org1"}]}

  */
  app.get("/api/txByOrg/:channel", function (req, res) {
    let channelName = req.params.channel;

    if (channelName) {
      // statusMetrics.getTxByOrgs(channelName).then(rows => {
      //   if (rows) {
      //     return res.send({ status: 200, rows });
      //   }
      //   return requtil.notFound(req, res);
      // });
      return res.send(
        {
    "status": 200,
    "rows": [
        {
            "count": "3",
            "creator_msp_id": "OrdererMSP"
        },
        {
            "count": "1",
            "creator_msp_id": "Org1MSP"
        },
        {
            "count": "1",
            "creator_msp_id": "Org2MSP"
        }
    ]
}
        )
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

 /**
          Channels
          GET /channels -> /api/channels/info
          curl -i 'http://<host>:<port>/api/channels/<info>'
          Response:
          [
            {
              "channelName": "mychannel",
              "channel_hash": "",
              "craetedat": "1/1/2018"
            }
          ]
        */

       app.get("/api/channels/info", function (req, res) {
        crudService.getChannelsInfo().then(data=>{
          res.send({ status: 200, channels:data })
        }).catch(err=>res.send({status:500}))
    });


}

module.exports = dbroutes;