/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import nock from "nock";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import actions from "./actions";
import operations from "./operations";
import reducers from "./reducers";
import * as selectors from "./selectors";
import types from "./types";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const initialState = {};

describe("Tables", () => {
  describe("Operations", () => {
    afterEach(() => {
      nock.cleanAll();
    });

    const channel = "mychannel";

    test("blockList", async done => {
      nock(/\w*(\W)/g)
        .get(`/api/blockAndTxList/${channel}/0`)
        .reply(200, {
          rows: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.BLOCK_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.blockList(channel));
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.BLOCK_LIST);

      done();
    });

    test("blockList catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get(`/api/blockAndTxList/${channel}/0`)
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.BLOCK_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.blockList(channel));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });

    test("contractList", async done => {
      nock(/\w*(\W)/g)
        .get(`/api/contract/${channel}`)
        .reply(200, {
          rows: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.CONTRACT_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.contractList(channel));
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.CONTRACT_LIST);

      done();
    });

    test("contractList catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get(`/api/contract/${channel}`)
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.CONTRACT_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.contractList(channel));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });

    test("channels", async done => {
      nock(/\w*(\W)/g)
        .get("/api/channels/info")
        .reply(200, {
          channels: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.CHANNELS }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.channels());
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.CHANNELS);

      done();
    });

    test("channels catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get("/api/channels/info")
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.CHANNELS }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.channels(channel));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });

    test("nodeList", async done => {
      nock(/\w*(\W)/g)
        .get(`/api/nodes/${channel}`)
        .reply(200, {
          rows: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.NODE_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.nodeList(channel));
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.NODE_LIST);

      done();
    });

    test("nodeList catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get(`/api/nodes/${channel}`)
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.NODE_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.nodeList(channel));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });

    test("transaction", async done => {
      nock(/\w*(\W)/g)
        .get(`/api/transaction/${channel}/1`)
        .reply(200, {
          rows: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.TRANSACTION }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.transaction(channel, 1));
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.TRANSACTION);

      done();
    });

    test("transaction catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get(`/api/transaction/${channel}/1`)
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.TRANSACTION }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.transaction(channel, 1));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });

    test("transactionList", async done => {
      nock(/\w*(\W)/g)
        .get(`/api/txList/${channel}/0/0/`)
        .reply(200, {
          rows: [{ test: "rows" }]
        });

      const expectedActions = [{ type: types.TRANSACTION_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.transactionList(channel));
      const actions = store.getActions();
      expect(actions[0].type).toEqual(types.TRANSACTION_LIST);

      done();
    });

    test("transactionList catch error", async done => {
      spyOn(console, "error");
      nock(/\w*(\W)/g)
        .get(`/api/txList/${channel}/0/0/`)
        .replyWithError({ code: "ECONNREFUSED" });

      const expectedActions = [{ type: types.TRANSACTION_LIST }];
      const store = mockStore(initialState, expectedActions);

      await store.dispatch(operations.transactionList(channel));
      const actions = store.getActions();
      expect(actions).toEqual([]);

      done();
    });
  });

  describe("Reducers", () => {
    test("blockListReducer", () => {
      const payload = { rows: "test" };
      const action = actions.getBlockList(payload);

      const newState = reducers(initialState, action);
      expect(newState.blockList.rows).toBe("test");
    });

    test("contractListReducer", () => {
      const payload = { contract: "test" };
      const action = actions.getcontractList(payload);

      const newState = reducers(initialState, action);
      expect(newState.contractList.rows).toBe("test");
    });

    test("channelsReducer", () => {
      const payload = { channels: "test" };
      const action = actions.getChannels(payload);

      const newState = reducers(initialState, action);
      expect(newState.channels.rows).toBe("test");
    });

    test("nodeListReducer", () => {
      const payload = { nodes: "test" };
      const action = actions.getNodeList(payload);

      const newState = reducers(initialState, action);
      expect(newState.nodeList.rows).toBe("test");
    });

    test("transactionReducer", () => {
      const payload = { row: "test" };
      const action = actions.getTransaction(payload);

      const newState = reducers(initialState, action);
      expect(newState.transaction.transaction).toBe("test");
    });

    test("transactionListReducer", () => {
      const payload = "test";
      const action = actions.getTransactionList(payload);

      const newState = reducers(initialState, action);
      expect(newState.transactionList.rows).toBe("test");
    });
  });

  describe("selectors", () => {
    test("blockListSelector", () => {
      const state = { tables: { blockList: { rows: "test" } } };
      const blockList = selectors.blockListSelector(state);
      expect(blockList).toBe("test");
    });

    test("contractListSelector", () => {
      const state = { tables: { contractList: { rows: "test" } } };
      const contractList = selectors.contractListSelector(state);
      expect(contractList).toBe("test");
    });

    test("channelsSelector", () => {
      const state = { tables: { channels: { rows: "test" } } };
      const channels = selectors.channelsSelector(state);
      expect(channels).toBe("test");
    });

    test("nodeListSelector", () => {
      const state = { tables: { nodeList: { rows: "test" } } };
      const nodeList = selectors.nodeListSelector(state);
      expect(nodeList).toBe("test");
    });

    test("transactionSelector", () => {
      const state = { tables: { transaction: { transaction: "test" } } };
      const transaction = selectors.transactionSelector(state);
      expect(transaction).toBe("test");
    });

    test("transactionListSelector", () => {
      const state = { tables: { transactionList: { rows: "test" } } };
      const transactionList = selectors.transactionListSelector(state);
      expect(transactionList).toBe("test");
    });
  });
});
