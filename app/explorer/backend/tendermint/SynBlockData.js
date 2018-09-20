/*
 *SPDX-License-Identifier: Apache-2.0
 */

var helper = require('../../../helper.js')
var logger = helper.getLogger('synBlockData');
var convertHex = require('convert-hex');
var Enum = require('enum');
var crypto = require("crypto");

var myEnum = new Enum({
    VALID: 0,
    NIL_ENVELOPE: 1,
    BAD_PAYLOAD: 2,
    BAD_COMMON_HEADER: 3,
    BAD_CREATOR_SIGNATURE: 4,
    INVALID_ENDORSER_TRANSACTION: 5,
    INVALID_CONFIG_TRANSACTION: 6,
    UNSUPPORTED_TX_PAYLOAD: 7,
    BAD_PROPOSAL_TXID: 8,
    DUPLICATE_TXID: 9,
    ENDORSEMENT_POLICY_FAILURE: 10,
    MVCC_READ_CONFLICT: 11,
    PHANTOM_READ_CONFLICT: 12,
    UNKNOWN_TX_TYPE: 13,
    TARGET_CHAIN_NOT_FOUND: 14,
    MARSHAL_TX_ERROR: 15,
    NIL_TXACTION: 16,
    EXPIRED_CONTRACT: 17,
    CONTRACT_VERSION_CONFLICT: 18,
    BAD_HEADER_EXTENSION: 19,
    BAD_CHANNEL_HEADER: 20,
    BAD_RESPONSE_PAYLOAD: 21,
    BAD_RWSET: 22,
    ILLEGAL_WRITESET: 23,
    INVALID_OTHER_REASON: 255
});

class SynBlockData {

    constructor(platform, persistence, broadcaster) {
        this.platform = platform;
        this.crudService = persistence.getCrudService();
        this.broadcaster = broadcaster;
    }

    async syncBlock() {
    try {
            //目前按一个channel做同步
            console.log("this is tendermint SynBlockData");
            var curBlockNum;
            var genesisBlockHash = "";
            var channelName = "";
            var statusdata = JSON.parse(platform.getStatus());
            if(statusdata) {
               genesisBlockHash = statusdata.result.node_info.network;
               channelName = statusdata.result.node_info.network;
            }

            var  maxBlockNum = await this.getMaxBlockNum(channelName);
            curBlockNum = await this.crudService.getCurBlockNum(genesisBlockHash);
            if (curBlockNum == -1) {
                curBlockNum = 0;
            }
            await this.getBlockByNumber(channelName, curBlockNum + 1, maxBlockNum +1);
        } catch (err) {
            console.log(err);
        }
    }

    async getBlockTimeStamp(block) {
        var blockTimestamp = null;
        try {
            if (block && block.block_meta && block.block_meta.header.time) {
                blockTimestamp = block.block_meta.header.time;
            }
        } catch (err) {
            logger.error(err)
        }
        return blockTimestamp;
    };
    async saveBlockRange(block,channelName) {


        var blockRecord = {
            'blockNum': block.block_meta.header.height,
            'txCount': block.block_meta.header.num_txs,
            'preHash': block.block.header.last_block_id.hash,
            'dataHash': block.block_meta.header.data_hash,
            'firstTxTimestamp': block.block_meta.header.time,
            'blockhash': block.block_meta.block_id.hash,
            'genesis_block_hash': block.block_meta.header.chain_id
        };

        var blockSaved = await this.crudService.saveBlock(blockRecord);

/*        if (blockSaved) {

            //push last block
            var notify = {
                'title': 'Block ' + block.header.number + ' Added',
                'type': 'block',
                'message': 'Block ' + block.header.number + ' established with ' + block.data.data.length + ' tx',
                'time': new Date(firstTxTimestamp),
                'txcount': block.data.data.length,
                'datahash': block.header.data_hash
            };

            this.broadcaster.broadcast(notify);*/

            await this.saveTransactions(block,channelName);

        };

    async saveTransactions(block,channelName) {
        //////////contract//////////////////
        //synccontracts();
        //////////tx/////////////////////////
        let txLen = block.block_meta.header.num_txs;
        if (parseInt(txLen) >0 ) {
          for (let i = 0; i < txLen; i++) {
            var tx = block.block.data.txs[i];
            var txhash = this.calculateTxHash(tx);
            var transaction = {
                'blockid': block.block_meta.header.height,
                'txhash': txhash,
                'createdt': new Date(block.block_meta.header.time),
                'contractname': "",
                'contract_id': "",
                'status': 0,
                'creator_msp_id': "",
                'endorser_msp_id': "",
                'type': "",
                'read_set': {},
                'write_set': {},
                'genesis_block_hash': block.block_meta.header.chain_id,
                'validation_code': "",
                'envelope_signature': "",
                'payload_extension': "",
                'creator_nonce': "",
                'contract_proposal_input': "",
                'endorser_signature': "",
                'creator_id_bytes': "",
                'payload_proposal_hash': "",
                'endorser_id_bytes': ""
            };
            await this.crudService.saveTransaction(transaction);
          }
        }

    };

    /**
     *
     * @param {*} channelName
     * @param {*} maxBlockNum
     * @param {*} syncStartDate
     * Method provides the ability to sync based on configured property syncStartDate in config.json
     */
    async syncBlocksFromDate(channelName, maxBlockNum, syncStartDate) {}
    async getBlockByNumber(channelName, start, end) {
        while (start < end) {
            let block = platform.getBlockByNumber(channelName, start);
            try {
                var savedNewBlock = await this.saveBlockRange(block,channelName)
            } catch (err) {
                console.log(err.stack);
                logger.error(err)
            }
            start++
        }
    }

    async syncBlockByNumber(height) {
            var channelName = "";
            var statusdata = JSON.parse(this.platform.getStatus());
            if(statusdata) {
               channelName = statusdata.result.node_info.network;
            }
            let block = platform.getBlockByNumber(channelName, height);

            try {
                var savedNewBlock = await this.saveBlockRange(block,channelName)
            } catch (err) {
                console.log(err.stack);
                logger.error(err)
            }
    }

    calculateBlockHash(header) {
        let headerAsn = asn.define('headerAsn', function () {
            this.seq().obj(this.key('Number').int(), this.key('PreviousHash').octstr(), this.key('DataHash').octstr());
        });

        let output = headerAsn.encode({
            Number: parseInt(header.number),
            PreviousHash: Buffer.from(header.previous_hash, 'hex'),
            DataHash: Buffer.from(header.data_hash, 'hex')
        }, 'der');
        let hash = sha.sha256(output);
        return hash;
    };


    calculateTxHash(tx) {
          var content = new Buffer(tx, 'base64')
          var detail = content.toString();
          var txHash = crypto.createHash('sha256').update(detail).digest('hex');
          console.log(txHash.slice(0,40));
          return txHash.slice(0,40);
    }


    async getMaxBlockNum(channelName) {
        try {
            var statusdata = JSON.parse(platform.getStatus());
            var height = "";
            if(statusdata) {
               height = statusdata.result.sync_info.latest_block_height;
            }
            return parseInt(height);
        } catch (err) {
            logger.error(err)
        }
    };


    // ====================contracts=====================================
    async saveContracts(channelName) {};
    //没有多个，故按一个处理先
    async saveChannel() {
            //从status内查询 名称及块数
            var statusdata = JSON.parse(platform.getStatus());
            var nums = "";
            var chain_id = "";
            var total_txs = "";
            if(statusdata) {
               nums = statusdata.result.sync_info.latest_block_height;
               chain_id = statusdata.result.node_info.network;
            }
            //从最后一块内，获取交易总数
            var blockdata =platform.getBlockByNumber(chain_id, nums);
            if(blockdata) {
                total_txs = blockdata.block_meta.header.total_txs;
            }
            let date = new Date()
            var channel = {
                blocks: parseInt(nums),
                trans: parseInt(total_txs),
                name: chain_id,
                createdt: date,
                channel_hash: chain_id,
                genesis_block_hash: chain_id
            };
            this.crudService.saveChannel(channel);
    };

    async syncChannels() {
        try {
            await this.saveChannel();
        } catch (err) {
            logger.error(err)
        }
    };

    async saveNodelist() {
        var nodelists = [];
        var statusdata = JSON.parse(platform.getStatus());
        var netinfo = JSON.parse(platform.getnetInfo());

         if(statusdata) {
            nodelists.push({"requests": statusdata.result.node_info.listen_addr,
                            "genesis_block_hash": statusdata.result.node_info.network,
                            "server_hostname": statusdata.result.node_info.listen_addr
                        });
        }
        if(netinfo) {
            var netnodes = netinfo.result.peers;
            for( var i = 0;i < netnodes.length;i++){
                nodelists.push({"requests": netnodes[i].node_info.listen_addr,
                                "genesis_block_hash": netnodes[i].node_info.network,
                                "server_hostname": netnodes[i].node_info.listen_addr
                              });
            }
        }
        let nodelen = nodelists.length
        for (let i = 0; i < nodelen; i++) {
            var nodes = nodelists[i]
            this.crudService.saveNode(nodes);
        }
    };
    // ====================Orderer BE-303=====================================
    async saveOrdererlist(channelName) {};
    // ====================Orderer BE-303=====================================
    async syncContracts() {};
    //暂时没有多个channel，故直接调用。
    syncNodelist() {
        try {
            this.saveNodelist();
        } catch (err) {
            logger.error(err)
        }
    };
    // ====================Orderer BE-303=====================================
    syncOrdererlist() {};
    // ====================Orderer BE-303=====================================
    syncChannelEventHubBlock() {};
}

module.exports = SynBlockData;
