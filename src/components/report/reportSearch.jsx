import React, { Component }  from 'react'
import { Input, Button, Icon, Modal, message, DatePicker, Select, InputNumber } from 'antd'


class ReportSearch extends Component{

	getSearchDom = t => {
		if(t.showType == 0){
			return <InputNumber 
							style={{width: 160}}
							value={this.props.search[t.arg]}
							onChange={e => this.props.changeInput(t.arg, e)}
							placeholder={t.label} />
		}else if(t.showType == 1){
			return <Input
			style={{width: 240}}
			value={this.props.search[t.arg]}
			allowClear
			onChange={e => this.props.changeInput(t.arg, e.target.value)}
			addonBefore={t.label} />
		}else if(t.showType == 2){
			return <DatePicker onChange={e => this.props.changeInput(t.arg, e)} placeholder={t.label} style={{width: 160}} />
		}else if(t.showType == 3){
			return <Select allowClear = {true} style={{ width: 160}} placeholder={t.label}
						    onChange={e=> this.props.changeInput(t.arg, e)}						    
						  >
						    {this.props.dict[t.dictCode] ? this.props.dict[t.dictCode].map(d => <Option value={d.code} key={d.code}>{d.name}</Option>) : null}
						  </Select>
		}else{
			return <Select mode="multiple" style={{ width: 240}} placeholder={t.label}
						    onChange={e=> this.changeInput(t.arg, e)}						    
						  >
						    {this.props.dict[t.dictCode] ? this.props.dict[t.dictCode].map(d => <Option value={d.code} key={d.code}>{d.name}</Option>) : null}
						  </Select>
		}

	}


	render = _ => {
		return <span>
			{this.props.searchdoms.length > 0 ? this.props.searchdoms.map((val, index) => this.getSearchDom(val)) : null}
		</span>
	}

}

export default ReportSearch