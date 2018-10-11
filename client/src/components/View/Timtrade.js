import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import ReactEcharts from 'echarts-for-react';
import { Icon } from '@icedesign/base';
import 'echarts/lib/chart/map';
import 'echarts/map/js/world';

const geoCoordMap = {
  '中国 · 浙江兰溪': [119.133, 29.12],
  尼日利亚仓: [-4.388361, 11.186148],
  美国洛杉矶仓: [-118.24311, 34.052713],
  香港邦泰仓: [114.195466, 22.282751],
  美国芝加哥仓: [-87.801833, 41.870975]
};

const data = [
  {
    name: '中国 · 浙江兰溪',
    value: 10,
  }
];

const v = [
  3,
  3,
  3,
  3,
 
];

function formtGCData(geoData, gcData, srcNam, dest) {
  const tGeoDt = [];
  gcData.map((value) => {
    if (srcNam !== value.name) {
      if (dest) {
        tGeoDt.push({
          coords: [geoData[srcNam], geoData[value.name]],
        });
      } else {
        tGeoDt.push({
          coords: [geoData[value.name], geoData[srcNam]],
        });
      }
    }
    return null;
  });
  return tGeoDt;
}

function formtVData(geoData, vData, srcNam) {
  const tGeoDt = [];
  for (let i = 0, len = vData.length; i < len; i++) {
    const tNam = vData[i].name;
    if (srcNam !== tNam) {
      tGeoDt.push({
        name: tNam,
        value: geoData[tNam],
        symbolSize: v[i],
        itemStyle: {
          normal: {
            color: '#FFD24D',
            borderColor: 'gold',
          },
        },
      });
    }
  }
  tGeoDt.push({
    name: srcNam,
    value: geoData[srcNam],
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: '#4DFFFF',
        borderColor: '#fff',
      },
    },
  });
  return tGeoDt;
}
const planePath = 'arrow';

const option = {
  geo: {
    name: 'Enroll distribution',
    type: 'map',
    map: 'world',
    label: {
      emphasis: {
        show: false,
      }
    }
  }

}


export default class RealTimeTradeChart extends Component {
  static displayName = 'RealTimeTradeChart';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      date: '',
    };
  }

  updateDate = () => {
    const date = new Date();
    this.setState({
      date: `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    });
  };

  componentDidMount() {
    setInterval(this.updateDate, 1000);
  }

  render() {
    return (
      <IceContainer style={{ background: '#000' }}>
        <div style={styles.info}>
          <h1 style={styles.title}>TEST</h1>
          <p style={styles.time}>
            <Icon type="time" size="small" style={styles.timeIcon} />
            {this.state.date}
          </p>
          <p style={styles.subTitle}>今日交易额</p>
          <p style={styles.sum}>16828234</p>
        </div>
        <ReactEcharts option={option} style={{ height: '300px' }} />
      </IceContainer>
    );
  }
}

const styles = {
  info: {
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: '32px',
  },
  time: {
    fontSize: '18px',
    margin: '15px 0 25px',
  },
  subTitle: {
    width: '100px',
    lineHeight: '24px',
    margin: '0 auto',
    color: '#F8BC38',
    backgroundColor: '#1A484E',
    fontSize: '14px',
  },
  sum: {
    margin: '15px 0 0',
    lineHeight: '30px',
    fontSize: '38px',
    color: 'rgb(255, 246, 0)',
    fontWeight: 'bold',
  },
  timeIcon: {
    marginRight: '8px',
  },
};