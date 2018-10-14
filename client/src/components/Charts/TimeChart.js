/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import Card, { CardContent } from 'material-ui/Card'

const TimeChart = ({ chartData }) => {
  return (
    <div>
      <Card>
        <CardContent className='CardContent'>
          <ResponsiveContainer width='100%' height={455}>
            <ScatterChart>
              <CartesianGrid strokeDasharray='5 5' />
              <XAxis dataKey='datetime' className='datetime' />
              <YAxis domain={[0, chartData.dataMax]} dataKey='count' />
              <Tooltip cursor={{ strokeDasharray: '5 5' }} />
              <Scatter
                className='datetime'
                data={chartData.displayData}
                line={{}}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimeChart
