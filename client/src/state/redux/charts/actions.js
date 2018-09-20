/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from "./types";

 const getBlockPerHour = (blockPerHour) => ({
    type: types.BLOCK_CHART_HOUR,
    payload: {blockPerHour}
});

 const getBlockPerMin = (blockPerMin) => ({
    type: types.BLOCK_CHART_MIN,
    payload: {blockPerMin}
});

const getChannel = (channel) => ({
    type: types.CHANNEL,
    payload:{channel}
});

const getChannelList = (channelList) => ({
    type: types.CHANNEL_LIST,
    payload: channelList
});

const getDashStats = (dashStats) => ({
    type: types.DASHBOARD_STATS,
    payload: dashStats
});

const getNotification = (notification) => ({
    type: types.NOTIFICATION_LOAD,
    payload:{notification}
});

const getNodeStatus = (nodeStatus) => ({
    type: types.NODE_STATUS,
    payload: nodeStatus
})

const getTransactionByOrg = (transactionByOrg) => ({
    type: types.TRANSACTION_CHART_ORG,
    payload: transactionByOrg
});

 const getTransactionPerHour = (transactionPerHour) => ({
    type: types.TRANSACTION_CHART_HOUR,
    payload: {transactionPerHour}
});

 const getTransactionPerMin = (transactionPerMin) => ({
    type: types.TRANSACTION_CHART_MIN,
    payload: {transactionPerMin}
});

const updateChannel = (channel) => ({
    type: types.CHANGE_CHANNEL,
    payload:{channel}
});

export default {
    getBlockPerHour,
    getBlockPerMin,
    getChannel,
    getChannelList,
    getDashStats,
    getNotification,
    getNodeStatus,
    getTransactionByOrg,
    getTransactionPerHour,
    getTransactionPerMin,
    updateChannel
};
