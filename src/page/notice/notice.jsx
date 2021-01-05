import React from 'react'
import { List, Button, Icon } from 'antd'
import Common from '/page/common.jsx'
import { getnotices } from '/api/notice'
import moment from 'moment'

class Notice extends Common{

	async componentWillMount () {
		this.search()
	}

	state = {
		limit: 10,
		offset: 0,
		finish: false,
    loading: false,
		data: [],
	}

	search = async (offset = this.state.offset) => {
		this.setState({loading: true})
		let data = this.state.data
		await getnotices({limit: this.state.limit, offset}).then(res => {
			this.setState({loading: false})
			return
			res.data.records.forEach(v => {
				let str = v.title + '：' + v.content + '       - '  + v.createtime
				let flag = moment(new Date()).diff(v.createtime, 'days') < 3
				data.push({str, flag})
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
		return <div className='tab-page'>
		<div style={{height: 500, overflow: 'scroll'}}>
	    <List
	      header={<div>系统公告</div>}
	      bordered
	      loadMore={loadMore}
	      loading={this.state.loading}
	      dataSource={this.state.data}
	      renderItem={item => item.flag ? <List.Item> <Icon type="notification" style={{marginRight: 20, color: '#ff6500'}}/> {item.str}</List.Item> : <List.Item>{item.str}</List.Item>}
	    /></div>
	    <div style={{paddingLeft: '12px', marginTop: '20px'}}>
	    <div style={{fontSize: '16px', fontWeight: 'bold'}}>系统使用手册</div>
	    <div>1、营销中心操作手册 &nbsp;&nbsp;&nbsp;&nbsp; <a target="_blank" href="../file/投标系统销售使用手册.pdf">投标系统销售使用手册.pdf</a></div>
	    <div>2、系统管理员操作手册 &nbsp;&nbsp;&nbsp;&nbsp;<a href="#"></a></div>
	    </div>
	  </div>
}
}

export default Notice