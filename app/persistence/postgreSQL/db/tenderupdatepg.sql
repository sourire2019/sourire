--
--    SPDX-License-Identifier: Apache-2.0
--

\c tendermintexplorer;
--TODO research the prev_blockhash for the genesis block??
ALTER TABLE Blocks ADD COLUMN prev_blockhash character varying(256) DEFAULT NULL;
ALTER TABLE Blocks ADD COLUMN blockhash character varying(256) DEFAULT NULL;
ALTER TABLE Blocks ADD COLUMN genesis_block_hash character varying(256) DEFAULT NULL;

ALTER TABLE Transaction ADD COLUMN status  integer DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN creator_msp_id character varying(128) DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN endorser_msp_id character varying(800) DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN contract_id character varying(256) DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN type character varying(128) DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN read_set  json default NULL;
ALTER TABLE Transaction ADD COLUMN write_set  json default NULL;
ALTER TABLE Transaction ADD COLUMN genesis_block_hash character varying(256) DEFAULT NULL;

ALTER TABLE channel ADD COLUMN genesis_block_hash character varying(256) DEFAULT NULL;
ALTER TABLE channel ADD COLUMN channel_hash character varying(256) DEFAULT NULL;
ALTER TABLE channel ADD COLUMN channel_config  bytea default NULL;
ALTER TABLE channel ADD COLUMN channel_block  bytea DEFAULT NULL;
ALTER TABLE channel ADD COLUMN channel_tx  bytea DEFAULT NULL;
ALTER TABLE channel ADD COLUMN channel_version character varying(128) DEFAULT NULL;

ALTER TABLE contracts ADD COLUMN genesis_block_hash character varying(256) DEFAULT NULL;
ALTER TABLE contracts DROP COLUMN channelname ;

ALTER TABLE node DROP COLUMN name;
ALTER TABLE node ADD COLUMN genesis_block_hash character varying(256) DEFAULT NULL;
ALTER TABLE Transaction ADD COLUMN validation_code character varying(50) DEFAULT NULL,
ADD COLUMN envelope_signature character varying DEFAULT NULL,
ADD COLUMN payload_extension character varying DEFAULT NULL,
ADD COLUMN creator_id_bytes character varying DEFAULT NULL,
ADD COLUMN creator_nonce character varying DEFAULT NULL,
ADD COLUMN contract_proposal_input character varying DEFAULT NULL,
ADD COLUMN payload_proposal_hash character varying DEFAULT NULL,
ADD COLUMN endorser_id_bytes character varying DEFAULT NULL,
ADD COLUMN endorser_signature character varying DEFAULT NULL;

ALTER TABLE transaction DROP COLUMN channelname;
ALTER TABLE blocks DROP COLUMN channelname;


DROP INDEX IF EXISTS blocks_blocknum_idx;
CREATE INDEX ON Blocks (blocknum);

DROP INDEX IF EXISTS blocks_genesis_block_hash_idx;
CREATE INDEX ON Blocks (genesis_block_hash);

DROP INDEX IF EXISTS blocks_createdt_idx;
CREATE INDEX ON Blocks (createdt);

DROP INDEX IF EXISTS transaction_txhash_idx;
CREATE INDEX ON Transaction (txhash);

DROP INDEX IF EXISTS transaction_genesis_block_hash_idx;
CREATE INDEX ON Transaction (genesis_block_hash);

DROP INDEX IF EXISTS transaction_createdt_idx;
CREATE INDEX ON Transaction (createdt);

DROP INDEX IF EXISTS transaction_blockid_idx;
CREATE INDEX ON Transaction (blockid);

DROP INDEX IF EXISTS transaction_contract_proposal_input_idx;
CREATE INDEX ON Transaction (contract_proposal_input);

DROP INDEX IF EXISTS channel_genesis_block_hash_idx;
CREATE INDEX ON channel (genesis_block_hash);

DROP INDEX IF EXISTS channel_channel_hash_idx;
CREATE INDEX ON channel (channel_hash);

ALTER TABLE IF EXISTS Transaction RENAME TO Transactions;

ALTER TABLE contracts ADD COLUMN balance character varying(256) DEFAULT NULL,
ADD COLUMN creator character varying(256) DEFAULT NULL,
ADD COLUMN creator_hash character varying(256) DEFAULT NULL,
ADD COLUMN contract_code character varying(256) DEFAULT NULL
;

ALTER TABLE transactions 
ADD COLUMN blocktime character varying(256) DEFAULT NULL,
ADD COLUMN transaction_from character varying(256) DEFAULT NULL,
ADD COLUMN transaction_to character varying(256) DEFAULT NULL
;