import { Table, Modal } from 'antd';
import { getaccrual } from '/api/trial';


class TrialView extends React.Component {

	async componentWillMount () {
    if(this.props.config.id)
		this.search(this.props.config.id)
	}

  async componentWillReceiveProps (nextprops) {
    if (nextprops.config.id != this.props.id && nextprops.config.visible && nextprops.config.id) {
      this.search(nextprops.config.id)
    }
  }

  constructor(props) {
    super(props);
    this.state = {
    	loading: false,
      title: '',
      dataSource: [],
      dataSource2: [],
      columns: [
      {
        title: '开始日期',
        dataIndex: 'sdate'
      },
      {
        title: '结束日期',
        dataIndex: 'edate'
      },
      {
        title: '资金额',
        dataIndex: 'amount'
      },
      {
        title: '利率',
        dataIndex: 'rate'
      },
      {
        title: '计息天数',
        dataIndex: 'days'
      },
      {
        title: '资金奖励',
        dataIndex: 'rae'
      }],
      columns2: [
      {
        title: '结束日期',
        dataIndex: 'dstartdate'
      },
      {
        title: '缓冲期截止日',
        dataIndex: 'denddate'
      },
      {
        title: '回款金额',
        dataIndex: 'dmoney'
      }
      ],
    };
  }

  //查询
  search = id => {
    this.setState({loading: true})
    getaccrual({id}).then(res => {
      this.setState({dataSource: res.data.dataSource, dataSource2: res.data.dataSource2, loading: false})
      let am = 0
      res.data.dataSource.forEach(t => {
        am += t.rae 
      })
      this.setState({title: am < 0 ? `资金成本：${-am}` : `资金奖励：${am}`})
    })
	}

  render() {
    return (
    	<Modal title={this.state.title}
      visible={this.props.config.visible}
      mask={true}
      width={600}
      onCancel={this.props.onCancel}
      footer={null}
    > 
        <Table
        	size='small'
        	loading = {this.state.loading}	
          bordered
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={false}
          title={_ => <p style={{height: '20px', margin: 0}}>资金奖励</p>}
        />

        <Table
          size='small'
          loading = {this.state.loading}  
          bordered
          dataSource={this.state.dataSource2}
          columns={this.state.columns2}
          pagination={false}
          title={_ => <p style={{height: '20px', margin: 0}}>收款排程</p>}
        />
      </Modal>
    );
  }
}

export default TrialView