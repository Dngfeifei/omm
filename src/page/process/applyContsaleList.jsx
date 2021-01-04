import React, { Component } from 'react'
import { Button, message, Icon, Checkbox, Modal, Table, Divider, Drawer } from 'antd'
import { geSelectedContsale } from '/api/contsale'
import { submitApply, saveContDetail } from '/api/contapply'
import Contselect from '/page/contract/contselect.jsx'
import ContractIndex from '/page/contract/contractIndex.jsx'
import { numSep } from '/api/tools'

class ApplyContsaleList extends Component{

	async componentWillMount () {
		this.geSelectedContsale(this.props.item)
		await this.setState({canedit: this.props.item.canedit})
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.item != this.props.item) {
			this.setState({selecteditems: [], selectedkeys: [], canedit: nextprops.item.canedit})
			//获得已选择
			this.geSelectedContsale(nextprops.item)
		}
	}

	state = {
		canedit: false,
		defaultChecked: false,//借用原件是否默认选中
		disableChecked: false,//借用原件是否默认不可用
		projects: [],
		loading: false,
		btnloading: false,
		lock: false,
		visible: false,
		selecteditems: [],
		selectedkeys: [],
		fileList: [],
		dvisible: false,
		activitId: null,
		columns: [
		{
		  title: '项目号',
		  dataIndex: 'pkProjectCode'
		}, {
		  title: '合同名称',
		  dataIndex: 'vcontname',
		  width: '30%'
		}, {
			title: '合同金额',
			dataIndex: 'ncontmny',
			render: t => '¥' + numSep(t)
		 }, {
		  title: '合同份数',
		  dataIndex: 'ncontnum',
		  render: (t, r) => `${t}(${t-r.lockNum})`
		}, {
		  title: <Checkbox onChange={e => this.changeCheckAll(e.target.checked)} disabled={!this.props.item.canedit}>案例原件</Checkbox>,
		  dataIndex: 'borrow',
		  render: (t, r) => ((r.ncontnum > r.lockNum || r.checked) && this.props.item.canedit ) ? <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)}
		  checked={r.checked} 
		  disabled={this.state.disableChecked}>案例原件</Checkbox> : <Checkbox onChange={e => this.changeCheckBox(r, e.target.checked)} 
		  checked={r.checked} disabled={true}>案例原件</Checkbox>
		}, {
		  title: <Checkbox onChange={e => this.changeCheckInvoices(e.target.checked)} disabled={!this.props.item.canedit}>发票扫描件</Checkbox>,
		  dataIndex: 'invoice',
		  render: (t, r) => this.props.item.canedit ? <Checkbox onChange={e => this.changeCheckInvoice(r, e.target.checked)} 
		  checked={r.invoicechecked} 
		  disabled={this.state.disableChecked}>发票扫描件</Checkbox> : <Checkbox onChange={e => this.changeCheckInvoice(r, e.target.checked)} 
		  checked={r.invoicechecked} disabled={true}>发票扫描件</Checkbox>
		}, {
		  title: <Checkbox onChange={e => this.changeCheckOriginalInvoices(e.target.checked)} disabled={!this.props.item.canedit}>发票原件</Checkbox>,
		  dataIndex: 'invoiceo',
		  render: (t, r) => ((r.invoiceout === 0 || r.invoiceochecked) && this.props.item.canedit) ? <Checkbox onChange={e => this.changeCheckOriginalInvoice(r, e.target.checked)} 
		  checked={r.invoiceochecked} 
		  disabled={this.state.disableChecked}>发票原件</Checkbox> : <Checkbox onChange={e => this.changeCheckOriginalInvoice(r, e.target.checked)} 
		  checked={r.invoiceochecked} disabled={true}>发票原件</Checkbox>
		}, {
		  title: '操作',
		  dataIndex: 'operator',
				render: (t, r) => <div>{this.props.item.canedit ? <span><a title="删除" ><Icon type="delete" onClick={_ => this.removedone(r.key)} /></a>
					<Divider type="vertical" /></span> : null }<a title="明细" ><Icon type="search" onClick={_ => this.showView(r.key)} /></a></div>
		}]
	}
	//预览信息
	showView = id => {
		this.setState({activitId: id, dvisible: true})
	}
	//获得已选择列表
	geSelectedContsale = r => {
		geSelectedContsale({contId: r.contId, requireId: r.id}).then(res => {
			this.setState({selecteditems: res.data.map(e => {
				e.key = e.pkContsale
				e.checked = e.ind > 0
				e.invoicechecked = e.servcontent == '1'
				e.invoiceochecked = e.cities == '1'
				return e
			}), selectedkeys: res.data.map(e => e.pkContsale)})
		})
	}
	//全选
	changeCheckAll = b => {
		this.state.selecteditems.forEach(t => {
				if(t.ncontnum - t.lockNum > 0)
				t.checked = b
			})
		this.setState({selecteditems: this.state.selecteditems})
	}
	//修改-借用原件
	changeCheckBox = (r, v) =>{
    let selecteditems = this.state.selecteditems.map(item => {
    	if(r.key == item.key){
    		item.checked = v
    	}
    	return item
    })
    this.setState({selecteditems})
	}
	//全选 -- 发票原件
	changeCheckOriginalInvoices = b => {
		this.state.selecteditems.forEach(t => {
				t.invoiceochecked = b
			})
		this.setState({selecteditems: this.state.selecteditems})
	}
	//修改-借用原件 -- 发票原件
	changeCheckOriginalInvoice = (r, v) =>{
    let selecteditems = this.state.selecteditems.map(item => {
    	if(r.key == item.key){
    		item.invoiceochecked = v
    	}
    	return item
    })
    this.setState({selecteditems})
	}
	//全选 -- 发票
	changeCheckInvoices = b => {
		this.state.selecteditems.forEach(t => {
				t.invoicechecked = b
			})
		this.setState({selecteditems: this.state.selecteditems})
	}
	//修改-借用原件 -- 发票
	changeCheckInvoice = (r, v) =>{
    let selecteditems = this.state.selecteditems.map(item => {
    	if(r.key == item.key){
    		item.invoicechecked = v
    	}
    	return item
    })
    this.setState({selecteditems})
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

	selectdone = items => {
		const selectedkeys = [...this.state.selectedkeys]
		items.forEach(item => {
			if(this.state.selectedkeys.indexOf(item.key) < 0){
				item.checked = this.state.defaultChecked
				this.state.selecteditems.push(item)
				selectedkeys.push(item.key)
			}
		})
		this.setState({selectedkeys})
	}

	removedone = key => {
		let selecteditems = this.state.selecteditems.filter(function(item) {
      return item.key != key
    })
    let selectedkeys = this.state.selectedkeys.filter(function(item) {
      return item != key
    })
    this.setState({selecteditems, selectedkeys})
	}

	rendermodal = _ => 
		<Modal title="选择资料"
			footer={null}
		  visible={this.state.visible}
		  onCancel={_ => this.setState({visible: false})}
		  mask={true}
		  width='90%'
		>
			<Contselect isOriginal = {this.state.defaultChecked} 
			selectedkey={this.state.selectedkeys}
			visible={this.state.visible}
			selectdone={this.selectdone} 
			onCancel={_ => this.setState({visible: false})}  />
		</Modal> 

	submit = async _ => {
		if (!this.state.selecteditems || this.state.selecteditems.length==0) {
			message.error('请先选择资料，再提交申请')
			return
		}
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true, btnloading: true})
			let params = {id: this.props.item.contId, field0: this.props.item.id}
			params.contDetailList = this.state.selecteditems.map(t => {
				return {
					pid: this.props.item.contId,
					docId: t.pkContsale,
					docCode: t.pkProjectCode,
					docName: t.vcontname,
					paperNum: t.checked ? 1 : 0,
					filed2: t.invoicechecked ? 1 : 0, 
					filed3: t.invoiceochecked ? 1 : 0, 
					remark: this.props.item.id //保存需求ID
				}
			})
			saveContDetail(params)
			.then(res => {
				this.setState({lock: false, loading: false,  btnloading: false})
				if (res.code == 200 || res === true) {
					message.success('提交成功')
					this.props.close()
				}
			})
		}
	}

	handleChange = ({ file, fileList }) => { 
    this.setState({ fileList })
  }

	render = _ => {
			return <div style={{width: '96%', margin: '10px 20px'}}>
			<p>需求描述：{this.props.item.descrip}</p>
			<p>案例列表数量：{this.props.item.listnum}；案例扫描件数量：{this.props.item.picnum}；案例原件数量：{this.props.item.papernum}</p>
			<div>
      {this.props.item.canedit ? <Button icon="select" onClick={this.addmodel}>选择资料</Button> : null}
				<p style={{width: 640, float: 'right'}}>【已选择数量：案例扫描件数量：{this.state.selecteditems.length}；案例原件数量：{this.state.selecteditems.filter(e => e.checked).length}；
					发票扫描件数量：{this.state.selecteditems.filter(e => e.invoicechecked).length}；发票原件数量：{this.state.selecteditems.filter(e => e.invoiceochecked).length}；】</p>
			</div>
      <Table columns={this.state.columns} dataSource={this.state.selecteditems} locale={{emptyText: '暂无数据'}} pagination={false} />
    	 {this.rendermodal()}
    	{this.props.item.canedit ? 
    		<Button type="primary" style={{marginTop: '20px',float: 'right'}} onClick={this.submit} loading={this.state.btnloading}>保存案例</Button> 
    		: null}
    	<div style={{height: 50}}></div>
				<Drawer
					width={740}
					placement="right"
					closable={true}
					onClose={_ => this.setState({dvisible: false})}
					visible={this.state.dvisible}
				><ContractIndex params={{id: this.state.activitId, readonly: true, visible: this.state.dvisible}}/></Drawer>
      </div>
	}

}

export default ApplyContsaleList