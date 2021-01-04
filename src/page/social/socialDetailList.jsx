import React, { Component } from 'react'
import { Modal, Input, Button, message, Table } from 'antd'
import { getsocialdetail, exportSocialDetail } from '/api/social'
import { dealBlob } from '/api/tools'

class SocialDetailList extends Component{

	async componentWillReceiveProps (nextprops) {
		if (nextprops.config != this.props.config && nextprops.config.visible) {
			this.setState({socialId: nextprops.config.item.id})
			this.getdetaillist(nextprops.config.item.id)
		}
	}

	state = {
		socialId: null,
		columns: [{
			title: '部门',
			dataIndex: 'depart'
		},{
			title: '岗位',
			dataIndex: 'orgpost'
		},{
			title: '姓名',
			dataIndex: 'name'
		}],
		tabledata: [],
		loading: false,
		lock: false,
		exportBtn: false
	}


	getdetaillist = id => {
		let param = {socialId: id}
		getsocialdetail(param).then(res => {
				let data = res.data.map(val => {
					let baseItem = Object.assign({}, val, { key: val.id })
					return baseItem
				})
				this.setState({
					tabledata: data, 
					loading: false
				})
		})
	}


  //导出
	exportExcel = _ => {
		this.setState({exportBtn: true})
		const r = this.props.config.item
		exportSocialDetail({socialId: this.state.socialId}).then(blob => {
			dealBlob(blob, `社保缴纳名单_${r.city}_${r.month}_${r.corpName}.xlsx`)
			this.setState({exportBtn: false})
		})
	}

	render = _ => {
		return <Modal title={<div>查看缴纳名单 <Button 
			style={{marginLeft: 20}}
			onClick={_ => this.exportExcel()}
			type="primary" icon="download" loading={this.state.exportBtn}>导出</Button></div>}
		footer= {null}
		visible={this.props.config.visible}
		confirmLoading={this.state.loading}
		onCancel={this.props.onCancel}
		width={1000}
		style={{top: 50, marginBottom: 50}}>
      <Table dataSource={this.state.tabledata} 
      size='small'
      pagination={false}
      columns={this.state.columns} 
      loading={this.state.loading} />	
		</Modal>
	}
}

export default SocialDetailList