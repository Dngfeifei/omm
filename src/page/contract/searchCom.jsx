import React from 'react'
import { Button, Modal, Input, Icon, Select, DatePicker, InputNumber, Checkbox } from 'antd'
const Option = Select.Option
const InputGroup = Input.Group
import { getDictSelectMuti } from '/api/dict'

class SearchCom extends React.Component {

	async componentWillMount () {
		this.gethyandservlist()
	}

	state = {
		hytypelist: [],
		servtypelist: []
	}

	gethyandservlist = _ => {
		getDictSelectMuti({codeList: ['servtype', 'hytype']}).then(res => {
			this.setState({servtypelist: res.data.servtype, hytypelist: res.data.hytype})
		})
	}

	render = _ => 
	<span>
		<Input 
		value={this.props.search.name}
		allowClear
		onChange={e => this.props.changeSearch({name: e.target.value})}
		style={{width: 300}}
		addonBefore="关键字" placeholder="合同号/合同名称/项目号/客户" />
		<Select
	    allowClear = {true}
	    style={{ width: 260}}
	    onChange={t=> this.props.changeSearch({hytype: t || '' })}
	    placeholder="选择行业类型"
	  >
	    {this.state.hytypelist.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
	  </Select>
	  <Select
	    allowClear = {true}
	    style={{ width: 200}}
	    onChange={t=> this.props.changeSearch({servtype: t || ''})}
	    placeholder="选择服务类别"
	  >
	    {this.state.servtypelist.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
	  </Select>

	  <Input 
	  type="number"
		value={this.props.search.mixnum}
		onChange={e => this.props.changeSearch({mixnum: e.target.value})}
		style={{width: 200}}
		addonBefore="合同金额" placeholder="最小值" />

	  <Input
	  type="number" 
		value={this.props.search.maxnum}
		onChange={e => this.props.changeSearch({maxnum: e.target.value})}
		style={{width: 200}}
		addonBefore="合同金额" placeholder="最大值" />

		 <Input 
		value={this.props.search.eqname}
		onChange={e => this.props.changeSearch({eqname: e.target.value})}
		style={{width: 260}}
		addonBefore="设备名称" placeholder="设备名称" />

		<Input 
		value={this.props.search.city}
		onChange={e => this.props.changeSearch({city: e.target.value})}
		style={{width: 200}}
		addonBefore="技术区域" placeholder="省份" />

		<Select allowClear = {true} style={{ width: 100}}
	    onChange={t=> this.props.changeSearch({isaccept: t || ''})}
	    placeholder="验收报告">
	    <Option value='Y' key='Y'>有</Option>
	    <Option value='N' key='N'>无</Option>
	  </Select>

	  <Select allowClear = {true} style={{ width: 100}}
	    onChange={t=> this.props.changeSearch({checkNotice: t || ''})}
	    placeholder="中标通知">
	    <Option value={1} key={1}>有</Option>
	    <Option value={2} key={2}>无</Option>
	  </Select>
		<InputGroup compact style={{width: 320, display: 'inline-block', lineHeight: '32px', height: '32px'}}>
      <Select defaultValue="ge" style={{marginRight: 0}} onChange={t=> this.props.changeSearch({fromDateTy: t || ''})}>
        <Option value="ge">大于等于</Option>
        <Option value="le">小于等于</Option>
      </Select>
      <DatePicker onChange={e => this.props.changeSearch({fromDate: e})} placeholder="合同开始日期" />
    </InputGroup>
    <InputGroup compact style={{width: 320, display: 'inline-block', lineHeight: '32px', height: '32px'}}>
      <Select defaultValue="le" style={{marginRight: 0}} onChange={t=> this.props.changeSearch({toDateTy: t || ''})}>
      	<Option value="le">小于等于</Option>
        <Option value="ge">大于等于</Option>
      </Select>
      <DatePicker onChange={e => this.props.changeSearch({toDate: e})} placeholder="合同结束日期" />
    </InputGroup>

    <Checkbox onChange={e => this.props.changeSearch({group: e.target.checked})}>供应商去重</Checkbox>
</span>

}

export default SearchCom