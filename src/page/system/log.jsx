import React from 'react'
import { Input, Select, Button, DatePicker, Icon, Modal, message, Table } from 'antd'
import { getLogList, clearLogs } from '/api/log'
import Common from '/page/common.jsx'
import { momentFormat } from '/api/tools'

const { RangePicker } = DatePicker
class Log extends Common{
	async componentWillMount () {
		this.search()
	}
	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		columns: [{
			title: '日志名称',
			dataIndex: 'logname',
			width: 100
		}, {
			title: '操作人',
			dataIndex: 'userName',
			width: 100
		}, {
			title: '日期',
			dataIndex: 'createtime',
			width: 160
		}, {
			title: '结果',
			dataIndex: 'succeed',
			width: 80
		}, {
			title: '信息',
			dataIndex: 'message',
		}],
		selectedtable: false,
		rowSelection: false,
		cfmVisible: false,
		tips: ''
	})


	search = async _ => {
		await this.setState({loading: true})
		let search = Object.assign({}, this.state.search)
		if (!search.type) {
			search.type = 0
		}
		this.handleTime(search, 'beginTime')
		this.handleTime(search, 'endTime')
		return getLogList(search)
		.then(res => {
			console.log(res.data)
			let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
			this.setState({
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	beforeClearLog = _ => {
		let title = '登录日志'
		if (this.state.search.type == 1) {
			title = '操作日志'
		}
		let beginTime = momentFormat(this.state.search.beginTime)
		let endTime = momentFormat(this.state.search.endTime)
		let time = ''
		if (this.state.search.beginTime) {
			time = beginTime + '到' + endTime + '内的'
		}
		this.setState({tips: `确认清空${time}${title}吗`, cfmVisible: true})
	}

	clearlog = async _ => {
		await this.setState({loading: true, cfmVisible: false})
		let search = Object.assign({}, this.state.search)
		if (!search.type) {
			search.type = 0
		}
		this.handleTime(search, 'beginTime')
		this.handleTime(search, 'endTime')
		clearLogs(search).then(res => {
			if(res.code == 200){
				message.success('清空成功')
				this.search()
			}
		})
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<Select 
			defaultValue={0}
			style={{width: 120, marginRight: 15}}  
			onChange={val => this.changeSearch({type: val})}>
				{['登录日志', '其他日志'].map((val, key) => <Option value={key} key={key}>{val}</Option>)}
	    </Select>
			<Input 
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="名称" placeholder="操作人名称" />
			<RangePicker 
			onChange={dates => this.changeSearch({beginTime: dates[0], endTime: dates[1]})}
			value={[this.state.search.beginTime, this.state.search.endTime]}
			className="search"
			placeholder={['开始日期', '结束日期']}
			/>
			<Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
			<Button 
			onClick={this.research}
			type="primary" icon="retweet">重置</Button>
			<Button 
			onClick={this.beforeClearLog}
			type="primary" icon="delete">清空日志</Button>
		</div>
	</div>


	rendermodal = _ => [
		<Modal title="信息"
		  visible={this.state.cfmVisible}
		  onOk={this.clearlog}
		  mask={true}
		  width={400}
		  onCancel={_ => this.setState({cfmVisible: false})}
		  okText="确认"
		  cancelText="取消"
		>
			<p>{this.state.tips}</p>
		</Modal>]

}

export default Log