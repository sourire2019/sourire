/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var sql = require('./db/pgservice.js');
var helper = require('../../helper.js')
var fs = require('fs');
var path = require('path');
var logger = helper.getLogger('blockscanner');

class CRUDService {

    constructor() {

    }


    getTxCountByBlockNum(channelName, blockNum) {
        return sql.getRowByPkOne(`select blocknum ,txcount from blocks where genesis_block_hash='${channelName}' and blocknum=${blockNum} `);
    }

    getTransactionByID(channelName, txhash) {
        let sqlTxById = ` select t.txhash,t.validation_code,t.payload_proposal_hash,t.creator_msp_id,t.endorser_msp_id,t.contractname,t.type,t.createdt,t.read_set,t.write_set,channel.name as channelname from TRANSACTIONS as t inner join channel on t.genesis_block_hash=channel.genesis_block_hash where t.txhash = '${txhash}' `;
        return sql.getRowByPkOne(sqlTxById);
    }

    getTxList(channelName, blockNum, txid) {
        let sqlTxList = ` select t.creator_msp_id,t.txhash,t.type,t.contractname,t.createdt,channel.name as channelname from transactions as t  inner join channel on t.genesis_block_hash=channel.genesis_block_hash where  t.blockid >= ${blockNum} and t.id >= ${txid} and
        t.genesis_block_hash = '${channelName}'  order by  t.id desc`;
        return sql.getRowsBySQlQuery(sqlTxList);

    }

    getBlockAndTxList(channelName, blockNum) {

        let sqlBlockTxList = ` select blocks.blocknum,blocks.txcount ,blocks.datahash ,blocks.blockhash ,blocks.prehash,blocks.createdt,(
        SELECT  array_agg(txhash) as txhash FROM transactions where blockid = blocks.blocknum and genesis_block_hash = '${channelName}' group by transactions.blockid ),
        channel.name as channelname  from blocks inner join channel on blocks.genesis_block_hash =channel.genesis_block_hash  where
         blocks.genesis_block_hash ='${channelName}' and blocknum >= ${blockNum}
         order by blocks.blocknum desc`;
        return sql.getRowsBySQlQuery(sqlBlockTxList);
    }

    async getChannelConfig(channelName) {
        let channelConfig = await sql.getRowsBySQlCase(` select * from channel where name ='${channelName}' `);
        return channelConfig;
    }

    async saveChannelRow(artifacts) {
        var channelTxArtifacts = fs.readFileSync(artifacts.channelTxPath);
        var channelConfig = fs.readFileSync(artifacts.channelConfigPath);
        try {

            let insert = await sql.saveRow('channel', {
                'name': artifacts.channelName,
                'channel_hash': artifacts.channelHash,
                'channel_config': channelConfig,
                'channel_tx': channelTxArtifacts,
                'createdt': new Date()
            });

            let resp = {
                success: true,
                message: 'Channel ' + artifacts.channelName + " saved"
            };

            return resp;
        } catch (err) {
            let resp = {
                success: false,
                message: 'Faile to save channel ' + artifacts.channelName + " in database "
            };
            return resp;
        }

    }

    async saveBlock(block) {

        let c = await sql.getRowByPkOne(`select count(1) as c from blocks where blocknum='${block.blockNum}' and txcount='${block.txCount}'
        and genesis_block_hash='${block.genesis_block_hash}' and prehash='${block.preHash}' and datahash='${block.dataHash}' `)
        if (c.c == 0) {
            await sql.saveRow('blocks', {
                'blocknum': block.blockNum,
                'prehash': block.preHash,
                'datahash': block.dataHash,
                'blockhash': block.blockhash,
                'txcount': block.txCount,
                'genesis_block_hash': block.genesis_block_hash,
                'createdt': new Date(block.firstTxTimestamp)
            });

            return true;
        }

        return false;
    }

    async saveTransaction(transaction) {
        await sql.saveRow('transactions', transaction);
        await sql.updateBySql(`update contracts set txcount =txcount+1 where name = '${transaction.contractname}' and genesis_block_hash='${transaction.genesis_block_hash}'`);
    }


    async getCurBlockNum(channelName) {
        try {
            var row = await sql.getRowsBySQlCase(`select max(blocknum) as blocknum from blocks  where genesis_block_hash='${channelName}'`);

        } catch (err) {
            logger.error(err)
            return -1;
        }

        let curBlockNum

        if (row == null || row.blocknum == null) {
            curBlockNum = -1
        } else {
            curBlockNum = parseInt(row.blocknum)
        }

        return curBlockNum
    }

    // ====================contracts=====================================
    async saveContract(contract) {
        let c = await sql.getRowByPkOne(`select count(1) as c from contracts where name='${contract.name}' and genesis_block_hash='${contract.genesis_block_hash}' and version='${contract.version}' and path='${contract.path}'`)
        if (c.c == 0) {
            await sql.saveRow('contracts', contract)
        }
    }

    getChannelByGenesisBlockHash(channelName) {
        return sql.getRowByPkOne(`select name from channel where genesis_block_hash='${channelName}'`);
    }


    async saveChannel(channel) {
        let c = await sql.getRowByPkOne(`select count(1) as c from channel where name='${channel.name}' and genesis_block_hash='${channel.genesis_block_hash}'`)
        if (c.c == 0) {
            await sql.saveRow('channel', {
                "name": channel.name,
                "createdt": channel.createdt,
                "blocks": channel.blocks,
                "trans": channel.trans,
                "channel_hash": channel.channel_hash,
                "genesis_block_hash":channel.genesis_block_hash
            })
        } else {
            await sql.updateBySql(`update channel set blocks='${channel.blocks}',trans='${channel.trans}',channel_hash='${channel.channel_hash}' where name='${channel.name}'and genesis_block_hash='${channel.genesis_block_hash}'`)
        }
    }

    async saveNode(node) {
        let c = await sql.getRowByPkOne(`select count(1) as c from node where genesis_block_hash='${node.genesis_block_hash}' and requests='${node.requests}' `)
        if (c.c == 0) {
            await sql.saveRow('node', node)
        }
    }

    async getChannelsInfo() {
        var channels = await sql.getRowsBySQlNoCondtion(` select c.id as id,c.name as channelname,c.blocks as blocks ,c.genesis_block_hash as genesis_block_hash,c.trans as transactions,c.createdt as createdat,c.channel_hash as channel_hash from channel c
        group by c.id ,c.name ,c.blocks  ,c.trans ,c.createdt ,c.channel_hash,c.genesis_block_hash order by c.name `);

        return channels
      }

    // ====================Orderer BE-303=====================================
    async saveOrderer(orderer) {
            let c = await sql.getRowByPkOne(`select count(1) as c from orderer where requests='${orderer.requests}' `)
            if (c.c == 0) {
                await sql.saveRow('orderer', orderer)
        }
    }
    // ====================Orderer BE-303=====================================
    }

module.exports = CRUDService;