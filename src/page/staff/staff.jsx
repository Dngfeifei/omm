import React from 'react'
import { connect } from 'react-redux'
import {Input, Button, Icon, Modal, Upload, message, Select, DatePicker, TreeSelect} from 'antd'
const InputGroup = Input.Group
import { getStaffList, deleteStaff, importURL, exportStaffInfo, highSearch, getUserIdnum } from '/api/staff'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import moment from 'moment'
import { dealBlob, handleTreeData } from '/api/tools'
import StaffSearchHigh from '/page/staff/staffSearchHigh.jsx'
import { getCompanys } from '/api/dict'
import Idphoto from '/page/staff/idphoto.jsx'


@connect(state => ({
	thisrole: state.global.thisrole,
}))
class Staff extends Common{
	 componentWillMount () {
		this.search()
		//获得公司信息
		getCompanys({}).then(res => {
			this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
		})
	}


	state = Object.assign({}, this.state, {
		companys: [],
		search: Object.assign({pkCorp: '1002'}, this.state.pageconf),
		columns: [{
			title: '名称',
			dataIndex: 'name'
		},{
			title: '编号',
			dataIndex: 'psncode'
		},{
			title: '部门',
			dataIndex: 'deptName'
		},{
			title: '工作省份',
			dataIndex: 'province'
		},{
			title: '地市',
			dataIndex: 'city'
		},{
			title: '社保缴纳地',
			dataIndex: 'socialinsure'
		},{
			title: '工作年限',
			dataIndex: 'bussiyear',
			render: (t, r) =>  r.startdDate ? moment(new Date()).diff(moment(new Date(r.startdDate)), 'year') : ''
		},{
			title: '文化程度',
			dataIndex: 'educational'
		},{
			title: '照片信息',
			dataIndex: 'avatar',
			render: (t, r) => t ? <a href='javascript:void(0);' onClick={_ => this.setState({bvisible: true, url: r.avatar})}>查看</a> : '未上传'
		}],
		selected: {},
		loading: true,
		tabledata: [],
		fileList: [],
		btnLoading:false,
		uploadconf: {visible: false},
		modalconf: {visible: false, item: {}},
		ishigh: false,
		highvisible: false,
		searchprops: [{key: 0, leftc: '(', rightc: ')', logic: 'and'}],
		searchchilds: [[{key: 0, leftc: '(', rightc: ')', logic: 'and'}]],
		bvisible: false,
		url: '',
		idnum: '',
		pvisible: false,
	})

	atSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({}, this.state.search)
		if(search.endDate) search.endDate = search.endDate.format('YYYY-MM-DD')
		return getStaffList(search)
		.then(res => {
			let data = (f => f(f))(f => list => list.map(val => {
				let baseItem = Object.assign({}, val, { key: val.id })
				return baseItem
			}))(res.data.records)
			this.setState({
				ishigh: false,
				tabledata: data, 
				loading: false,
				pagination: Object.assign({}, this.state.pagination, {
					total: Number(res.data.total),
					current: Number(res.data.current)
				})
			})
		})
	}

	search = _ => {
		if(this.state.ishigh){
			this.highSearch()
		}else{
			this.atSearch()
		}
	}

	//检查有无作废权限
	hasCheckDone = _ => {
		const pp = this.props.thisrole.filter(e => e == '人事管理员')
		if(pp.length > 0){
			return true
		}else{
			return false
		}
	}

	deleteback = _ => {
		this.research()
	}
	delete = _ => {
		this.handleOk(deleteStaff, 'id', '删除', 'deleteback')
	}

	done = async _ => {
		let type = this.state.modalconf.type
		let config = {}
		config.modalconf = {visible: false, item: {}}
		this.setState(config)
		if (type == 'add') {
			this.research()
		} else {
			await this.setState({selected: {}})
			this.search()
		}
	}

	openIdPhoto = _ => {
		getUserIdnum().then(res => {
			if(res.data){
				this.setState({pvisible: true, idnum : res.data})
			}else{
				message.error('请先维护本人身份证号')
			}
		})
	}

	renderSearch = _ => <div>
		<div className="mgrSearchBar">
			<TreeSelect size='small' style={{ width: 260 }} allowClear
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						value={this.state.search.pkCorp}
						onChange={e => this.changeSearch({pkCorp: e})}
						treeData={this.state.companys}
						placeholder="请选择公司"
						treeDefaultExpandAll/>
			<Input
			style={{width: 200}}
			value={this.state.search.name}
			allowClear
			onChange={e => this.changeSearch({name: e.target.value})}
			addonBefore="人员" placeholder="名称/编号" />
			<Input
			style={{width: 200}}
			value={this.state.search.city}
			onChange={e => this.changeSearch({city: e.target.value})}
			addonBefore="工作地市" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.dept}
			onChange={e => this.changeSearch({dept: e.target.value})}
			addonBefore="部门" placeholder="" />
			<Input
			style={{width: 200}}
			value={this.state.search.socialinsure}
			onChange={e => this.changeSearch({socialinsure: e.target.value})}
			addonBefore="社保缴纳地" placeholder="" />
			<InputGroup compact style={{width: 300, display: 'inline-block'}}>
        <Input value={this.state.search.minyear} type='number'
        	onChange={e => this.changeSearch({minyear: e.target.value})}
        style={{ width: 100, textAlign: 'center' }} placeholder="工作年限" />
        <Input
          style={{
            width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input value={this.state.search.maxyear} type='number'
        	onChange={e => this.changeSearch({maxyear: e.target.value})}
        style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="工作年限" />
      </InputGroup>
			<Input
			style={{width: 200}}
			value={this.state.search.specialty}
			allowClear
			onChange={e => this.changeSearch({specialty: e.target.value})}
			addonBefore="专业" placeholder="输入专业" />
			<Input
			style={{width: 260}}
			value={this.state.search.certname}
			allowClear
			onChange={e => this.changeSearch({certname: e.target.value})}
			addonBefore="证书" placeholder="输入证书名称/简称/厂商" />
			<Input
			style={{width: 200}}
			value={this.state.search.certstate}
			allowClear
			onChange={e => this.changeSearch({certstate: e.target.value})}
			addonBefore="证书级别" placeholder="输入证书级别" />
			<Select size='small'
					value={this.state.search.certout}
					allowClear
					placeholder="证书是否过期"
					onChange={e => this.changeSearch({certout: e})}
					style={{width: 160}}>
				<Option value={0}>否</Option>
				<Option value={1}>是</Option>
			</Select>
			<DatePicker onChange={e => this.changeSearch({endDate: e})} placeholder="资质到期日" />
			<Select size='small' 
			value={this.state.search.mpstatus}
			allowClear
			placeholder="选择在职状态"
			onChange={e => this.changeSearch({mpstatus: e})}
			style={{width: 160}}>
				    <Option value='在职'>在职</Option>
				    <Option value='离职'>离职</Option>
			</Select>
			<Button 
			onClick={this.atSearch}
			type="primary" icon="search">搜索</Button>
		</div>
	</div>

	addpanel = async type => {
		await window.remove('staffForm')
		let pane = {
				title: '添加人员信息',
				key: 'staffForm',
				url: 'staffForm',
				params: {}
			}
		if(type && type == 'edit'){
			let item = this.state.selected.selectedItems[0]
			pane.title = `修改信息:${item.name}`
			pane.params = {
				id: item.id
			}
		}
		window.add(pane)
	}

	openupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({token, uploadconf: {visible: true}, fileList: []})
	}

	downloadTemplate = _ => {// 导出模版
		exportStaffs().then(blob => {
			dealBlob(blob, '人员导入模版.xlsx')
		})
	}

	handleChange = ({ file, fileList }) => { 
    if(file.status == 'done'){
  		if(file.response.data && file.response.data.length>0){
  			message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
  		}else{
  			message.success('导入成功')
  			this.setState({uploadconf: {visible: false}})
  			this.search()
  		}
    }else if(file.status == 'error'){
    	message.error(file.response.message)
    }
    this.setState({fileList})
  }

  //导出
	exportExcel = _ => {
		this.setState({btnLoading: true})
		let search = Object.assign({}, this.state.search)
		exportStaffInfo(search).then(blob => {
			dealBlob(blob, '人员信息.xlsx')
			this.setState({btnLoading: false})
		})
	}

	//高级查询
	//高级搜索
	highSearch = async _ => {
		await this.setState({loading: true, selected: {}})
		const searchprops = [...this.state.searchprops]
		//未选择公司时，默认股份
		const pkcorps = searchprops.filter(e => e.column === 'pk_corp');
		if(pkcorps.length === 0){
			searchprops.splice(0, 0, {key: 0, leftc: '(', column:'pk_corp', compare: '=',
				value : '1002',  rightc: ')', logic: 'and'});
		}
		let param = Object.assign({searchprops: JSON.stringify(searchprops),
				childs: JSON.stringify(this.state.searchchilds)},
			{limit: this.state.search.limit, offset: this.state.search.offset})
		highSearch(param).then(res => {
			if(res.code == 200){
				let data = res.data.records.map(val => Object.assign({}, val, {key: val.id}))
				this.setState({
					ishigh: true,
					tabledata: data,
					loading: false,
					pagination: Object.assign({}, this.state.pagination, {
						total: Number(res.data.total),
						current: Number(res.data.current)
					})
				})
				this.setState({highvisible: false})
			}
		})
	}

	renderBtn = _ => <div>
	<ButtonGroup>
		<Button 
		onClick={_ => this.addpanel('edit')}
		type="primary" icon="edit">查看|编辑</Button>
		<Button
		onClick={_ => this.openIdPhoto()}
		type="primary" icon="upload">上传本人照片</Button>
		{this.hasCheckDone() ? <Button 
		onClick={this.changemodel}
		type="primary" icon="close">作废</Button> : null}
		{/** <Button
		onClick={this.openupload}
		type="primary" icon="upload">导入</Button> **/}
		{this.hasCheckDone() ? <Button 
		onClick={this.exportExcel}
		type="primary" icon="download" loading={this.state.btnLoading}>导出</Button> : null}
		<Button
			onClick={_ => this.setState({highvisible: true})}
			type="primary" icon="search">高级搜索</Button>
	</ButtonGroup>
	</div>

	rendermodal = _ => <div>
		<Modal title="信息"
		  visible={this.state.visible}
		  onOk={this.delete}
		  mask={false}
		  width={400}
		  onCancel={this.changemodel}
		  okText="确认"
		  cancelText="取消"
		>
			<p>是否作废？</p>
		</Modal>
		<Modal title="高级搜索"
			   visible={this.state.highvisible}
			   footer={null}
			   mask={true}
			   width={1000}
			   onCancel={_ => this.setState({highvisible: false})} >
		<StaffSearchHigh  data={this.state.searchprops}	 childs={this.state.searchchilds}
						  handler={this.highSearch}
						  refresh={_ => this.setState({searchprops: [...this.state.searchprops]})}
						  refreshChild={_ => this.setState({searchchilds: [...this.state.searchchilds]})} />
		</Modal>
		<Modal title="导入"
		  visible={this.state.uploadconf.visible}
		  footer={null}
		  mask={true}
		  width={500}
		  onCancel={_ => this.setState({uploadconf: {visible: false}})}
		>
		<p>人员信息导入，<a onClick={this.downloadTemplate}>模版下载</a></p>
			<Upload className='attr-upload'
					action={`${importURL}`}
					data={{dictid: this.state.dictid}}
					headers={{Authorization: `Bearer ${this.state.token}`}}
					onChange = {this.handleChange}
					fileList = {this.state.fileList}
					multiple={false} >
						<Button>
							<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal>
		<Modal title="人员照片" visible={this.state.bvisible} width={500}
			   onCancel={_ => this.setState({bvisible: false})}
			   footer={null} >
			<img src={this.state.url} style={{maxWidth: 258, maxHeight: 258}} />
		</Modal>
		<Modal title="上传本人照片" visible={this.state.pvisible} width={500}
			   onCancel={_ => this.setState({pvisible: false})}
			   footer={null} >
			<Idphoto idnum={this.state.idnum} />
		</Modal>
		</div>

}

export default Staff