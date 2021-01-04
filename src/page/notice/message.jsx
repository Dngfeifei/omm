import React from 'react'
import { List, Button } from 'antd'
import Common from '/page/common.jsx'
import { getmessages } from '/api/notice'

class Notice extends Common{

	async componentDidMount () {
		this.search()
	}

	state = {
		limit: 10,
		offset: 0,
		finish: false,
    loading: false,
		data: []
	}

	search = async (offset = this.state.offset) => {
		this.setState({loading: true})
		let data = this.state.data
		await getmessages({limit: this.state.limit, offset}).then(res => {
			this.setState({loading: false})
			res.data.records.forEach(v => {
				let str = v.content + '       - '  + v.createTime
				data.push(str)
			})
			if(data.length >= res.data.total){
				this.setState({finish: true})
			}
		})
		this.setState({
				data: data
			})
	}

	onLoadMore = _ => {
		let offset = this.state.offset + this.state.limit
		this.setState({offset})
		this.search(offset)
	}


	render = _ => {
		const { finish, loading, list } = this.state;
    const loadMore = !finish && !loading ? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
      }}
      >
        <Button onClick={this.onLoadMore}>加载更多</Button>
      </div>
    ) : null
		return <div>
	    <List
	      header={<div>消息中心</div>}
	      bordered
	      loadMore={loadMore}
	      loading={this.state.loading}
	      dataSource={this.state.data}
	      renderItem={item => (<List.Item>{item}</List.Item>)}
	    />
	  </div>
}
}

export default Notice