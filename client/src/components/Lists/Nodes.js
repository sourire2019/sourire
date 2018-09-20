/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';
import {FormattedMessage} from 'react-intl';

const Nodes = ({ nodeList }) => {
    const columnHeaders = [
        {
            Header: <FormattedMessage
                    id="page.localeProvider.nodename"
                    defaultMessage="Node Name"
                    description="Node Name"
                    />,
            accessor: "server_hostname",
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["server_hostname"] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
            filterAll: true
        },
        {
            Header: <FormattedMessage
                    id="page.localeProvider.endpoint"
                    defaultMessage="ENDPOINT"
                    description="ENDPOINT"
                    />,
            accessor: "requests",
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["requests"] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
            filterAll: true
        }
    ];

    return (
        <div>
            <ReactTable
                data={nodeList}
                columns={columnHeaders}
                defaultPageSize={5}
                className="-striped -highlight"
                filterable
                minRows={0}
                showPagination={nodeList.length < 5  ?  false : true }

            />
        </div>
    );
};

export default Nodes;
