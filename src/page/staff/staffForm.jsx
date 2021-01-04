import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, TreeSelect, Form, Button, message, Icon, List, Modal, DatePicker, Input, InputNumber, Row, Col, Spin, Cascader } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import { addStaff, getDetail, getConditionMembers, checkDone} from '/api/staff'
import moment from 'moment'
import StaffIndex from '/page/staff/staffIndex.jsx'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import { getDeptSelect, getTopDepartment, getOrgLevels } from '/api/mtn'
import { handleTreeData, handleTreeValue, getGenderByIdnum, getDateByIdnum} from '/api/tools'
import { cities } from '/api/cities'

const tocoms = [{code: '1002', name: '北京银信长远科技股份有限公司'},
	{code: '1004', name: '北京银信长远数云科技有限公司'}]

@connect(state => ({
	thisrole: state.global.thisrole,
}))
class StaffItem extends Component{

	async componentDidMount () {
		this.getAllDocs()
		let id = this.props.params.id
		let readonly = this.props.params.readonly || false
		if(id){
			this.setState({id})
			this.search(id)
		}
		if(readonly){//是否信息申请
			this.setState({readonly : true})
		}
	}

	async componentWillReceiveProps (nextprops) {
		if (nextprops.params != this.props.params) {
			let id = nextprops.params.id
			let readonly = nextprops.params.readonly || false
			if(id){
				this.setState({id})
				this.search(id)
			}
			if(readonly){//是否信息申请
				this.setState({readonly : true})
			}
		}
	}

	constructor(props) {
		super(props)
    this.lastFetchId = 0
  }

	state = {
		readonly: false,
		companys: [],
		depts: [],
		politicals: [],
		marriages: [],
		educationals: [],
		nations: [],
		socialcities: [],
		orglevels: [],
		healthystate: [],
		accnature: [],
		stafftype: [],
		mpstatuses: [
			{code: '在职', name: '在职'},
			{code: '离职', name: '离职'}
		],
		englishes: [],
		provinces: [],
		cities: [],
		fetching: false,
		mems: [], //oa用户
		timefileds: ['checkDate','bithday','startdDate','entryDate', 'graduatedDate', 'socialDate'],
		rules: [{
			label: '登记日期',
			key: 'checkDate',
			review: 0, // 是否需要复核
			renew: 0,	// 是否需要更新
			option: {
				initialValue: moment(),
				rules: [{
		        	required: true, message: '请选择登记日期',
			    }]
			},
		    render: _ => <DatePicker size='small' placeholder="登记日期" style={{width: 200}} />
		},{
			label: '公司',
			key: 'pkCorp',
			review: 0,
			renew: 0,
			option: {
				initialValue: '1002',
				rules: [{
		        	required: true, message: '请选择一个公司!',
			    }]
			},
		    render: _ => <TreeSelect size='small'
		        style={{ width: 260 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={this.state.companys}
		        placeholder="请选择公司"
		        treeDefaultExpandAll/>
		},{
			label: '姓名',
			key: 'name',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请输入姓名',
			    }]
			},
	    render: _ => <Select style={{width: 200}} size='small'
	    	showSearch
        placeholder="选择人员"
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleUserChange}
      >
        {this.state.mems.map(r => <Option key={r.code} value={r.name}>{r.name}</Option>)}
      </Select>
		},{
			label: '员工编号',
			key: 'psncode',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请输入人员编号',
			    }]
			},
	    render: _ => <Input size='small' style={{width: 200}} maxLength={50} />
		},{
			label: '所属部门',
			key: 'deptId',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择所属部门!',
			    }]
			},
		    render: _ => <TreeSelect size='small'
		    		showSearch
		    		optionFilterProp="children"
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
		        style={{ width: 200 }}
		        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
		        treeData={this.state.depts}
		        treeNodeFilterProp="title"
				placeholder="请选择部门"
				onChange={this.deptChange}
				/>
		},{
			label: '上级部门',
			key: 'parentDept',
			render: _ => <Input size='small' 
			style={{width: 200}} 
			disabled={true}
			/>
		},{
			label: '职位名称',
			key: 'orgLevelId',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择职位名称!',
			    }]
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.orglevels.map(t => <Option value={t.id} key={t.id}>{t.name}</Option>)}
				  </Select>
		},{
			label: '身份证号',
			key: 'idnum',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请填写身份证号',
			    }]
			},
	    render: _ => <Input size='small' style={{width: 200}} maxLength={50} onBlur={e => this.getByIdnum(e.target.value)} />
		},{
			label: '性别',
			key: 'gender',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择性别',
			    }]
			},
	    render: _ => <Select size='small' style={{width: 200}}>
				    <Option value={1}>男</Option>
				    <Option value={2}>女</Option>
				  </Select>
		},{
			label: '出生日期',
			key: 'bithday',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择出生日期',
			    }]
			},
		    render: _ => <DatePicker size='small' placeholder="出生日期" style={{width: 200}} />
		},{
			label: '民族',
			key: 'nation',
			review: 0,
			renew: 0,
			option: {
				rules: []
			},
	    render: _ => <Select size='small' style={{width: 200}}
	    			showSearch
				    optionFilterProp="children"
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
				    {this.state.nations.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '政治面貌',
			key: 'political',
			review: 0,
			renew: 0,
			option: {
				rules: []
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.politicals.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '婚姻状况',
			key: 'marriage',
			review: 0,
			renew: 1,
			option: {
				rules: []
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.marriages.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '文化程度',
			key: 'educational',
			review: 1,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请选择文化程度!',
			    }]
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.educationals.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '员工状态',
			key: 'mpstatus',
			review: 1,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请选择员工状态!',
			    }]
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.mpstatuses.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '毕业院校',
			key: 'graduated',
			review: 1,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请输入毕业院校',
			    }]
			},
	    render: _ => <Input size='small' style={{width: 200}} maxLength={50}/>
		},{
			label: '专业',
			key: 'specialty',
			review: 1,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请输入专业',
			    }]
			},
	    render: _ => <Input size='small' style={{width: 200}} maxLength={50}/>
		},{
			label: '毕业时间',
			key: 'graduatedDate',
			review: 1,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请选择毕业时间',
			    }]
			},
		    render: _ => <DatePicker size='small' placeholder="毕业时间" style={{width: 200}} />
		},{
			label: '英语等级',
			key: 'english',
			review: 0,
			renew: 1,
			option: {
				rules: [{
		        	required: true, message: '请选择英语等级',
			    }]
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.englishes.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '参加工作时间',
			key: 'startdDate',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择参加工作时间',
			    }]
			},
		    render: _ => <DatePicker size='small' placeholder="参加工作时间" style={{width: 200}}
		    onChange={t => this.props.form.setFields({bussiyear: {value: t ? moment(new Date).diff(t, 'year') : ''}})} />
		},{
			label: '入职我司时间',
			key: 'entryDate',
			review: 0,
			renew: 0,
			option: {
				rules: []
			},
		    render: _ => <DatePicker size='small' placeholder="入职我司时间" style={{width: 200}}
		    onChange={t => this.props.form.setFields({compyaer: {value: t ? moment(new Date).diff(t, 'year') : ''}})}  />
		},{
			label: '工作年限',
			key: 'bussiyear',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请输入行业工作年限',
			    }]
			},
	    render: _ => <InputNumber size='small' style={{width: 200}} />
		},{
			label: '公司工作年限',
			key: 'compyaer',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请输入公司工作年限',
			    }]
			},
	    render: _ => <InputNumber size='small' style={{width: 200}} />
		},{
			label: '工作省份',
			key: 'province',
			review: 0,
			renew: 1,
			option: {
				rules: []
			},
		    render: _ => <Select onChange={this.procity}
		    size='small' style={{width: 200}}>
				    {this.state.provinces.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '地市',
			key: 'city',
			review: 0,
			renew: 1,
			option: {
				rules: []
			},
		    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.cities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '第一次缴纳社保时间',
			key: 'socialDate',
			review: 0,
			renew: 0,
			option: {
				rules: [{
		        	required: true, message: '请选择第一次缴纳社保时间',
			    }]
			},
		    render: _ => <DatePicker size='small' placeholder="第一次缴纳社保时间" style={{width: 200}} />
		},{
			label: '社保缴纳地',
			key: 'socialinsure',
			review: 0,
			renew: 1,
			option: {
				rules: []
			},
	    render: _ => <Select size='small' style={{width: 200}}
		    		showSearch
				    optionFilterProp="children"
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
				    {this.state.socialcities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '健康状况',
			key: 'jkzk',
			review: 0,
			renew: 1,
	    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.healthystate.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '电子信箱',
			key: 'dzxx',
			review: 0,
			renew: 0,
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '户口所在地',
			key: 'hkszd',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请选择户口所在地'}]},
	    render: _ => <Cascader options={cities} fieldNames={{label: 'name', value: 'name', children: 'area'}}
	    placeholder="请选择" />
		},{
			label: '户口性质',
			review: 0,
			renew: 1,
			key: 'hkxz',
			option: {rules: [{required: true, message: '请选择户口性质'}]},
	    render: _ => <Select size='small' style={{width: 200}}>
				    {this.state.accnature.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '籍贯',
			review: 0,
			renew: 0,
			key: 'jg',
	    render: _ => <Cascader options={cities} fieldNames={{label: 'name', value: 'name', children: 'area'}}
	    placeholder="请选择" />
		},{
			label: '人事关系所在单位',
			review: 0,
			renew: 1,
			key: 'rsgxszdw',
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '档案存放地',
			review: 0,
			renew: 1,
			key: 'dacfd',
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '家庭住址',
			key: 'jtzz',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入家庭住址'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '手机号',
			key: 'phone',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入手机号'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '紧急联系人',
			key: 'jjlxr',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入紧急联系人'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '与本人关系',
			key: 'ybrgx',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入与本人关系'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '紧急联系人电话',
			key: 'lxdh',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入联系电话'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '个人银行账户',
			key: 'gryhzh',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入个人银行账户'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '账户名称',
			key: 'zhmc',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入账户名称'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '银行类型',
			key: 'yhlx',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入银行类型'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '开户银行',
			key: 'khyh',
			review: 0,
			renew: 1,
			option: {rules: [{required: true, message: '请录入开户银行'}]},
	    render: _ => <Input size='small' style={{width: 200}} />
		},{
			label: '职级',
			key: 'orglevel',
			review: 0,
			renew: 1,
			option: {rules: []},
	    render: _ => <Input size='small' style={{width: 200}} maxLength={50}/>
		},{
			label: '劳动关系所属公司',
			key: 'ldgxssgs',
			review: 0,
			renew: 1,
			option: {
				rules: [{
					required: true, message: '请选择劳动关系所属公司',
				}]
			},
	    render: _ => <Select size='small' style={{width: 200}}>
				    {tocoms.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
				  </Select>
		},{
			label: '人员类型',
			key: 'staffType',
			review: 0,
			renew: 1,
			option: {
				rules: [{
					required: true, message: '请选择人员类型!',
				}]
			},
			render: _ => <TreeSelect size='small'
									 style={{ width: 260 }}
									 dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
									 treeData={handleTreeData(this.state.stafftype, 'name', 'name', 'children')}
									 placeholder="请选择人员类型"
									 treeDefaultExpandAll/>
		}],
		id: null,
		checkState: 0,
		loading: false,
		lock: false,
		visible: false
	}

	//查找OA人员信息
	fetchUser = value => {
		if(!value){return}
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ mems: [], fetching: true });
    getConditionMembers({value}).then(res => {
        if (fetchId !== this.lastFetchId || res.data.length === 0) {
          return
        }
        this.setState({ mems: res.data, fetching: false });
      });
	}
	//选择人员
	handleUserChange = (r, option) => {
		const value = option.key
		this.setState({
      mems: [],
      fetching: false,
    })
    // 根据人员信息设置 编号、部门、身份证号
    const obj = this.state.mems.filter(e => e.code === value)[0]
    this.props.form.setFields({psncode: {value: value}, deptId: {value: obj.orgDepartmentId}, 
    	orgLevelId: {value: obj.orgLevelId}, 
    	idnum: {value: obj.idnum}, 
    	dzxx: {value: obj.emailAddress},
    	mpstatus: {value: obj.state == 1 ? '在职' : '离职'}})
    if(obj.orgDepartmentId) this.deptChange(obj.orgDepartmentId)
    if(obj.idnum) this.getByIdnum(obj.idnum)
	}

	//通过身份证号获得出生日期和性别
	getByIdnum = v => {
		const date = getDateByIdnum(v)
		const gender = getGenderByIdnum(v)
		this.props.form.setFields({gender: {value: gender || 1}, 
			bithday: {value: moment(date)}})
	}

	deptChange = value => {
		getTopDepartment({value}).then(res =>{
			this.props.form.setFields({parentDept: {value:  res.data}})
		})
	}

	getAllDocs = _ => {
		getCompanys({}).then(res => {
			this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
		})
		getDeptSelect({}).then(res => {
			this.setState({depts: handleTreeData(res.data, 'name', 'id', 'childrenDepts')})
			// console.log(this.state.depts)
		})
		getOrgLevels({}).then(res => {
			this.setState({orglevels: res.data})
		})
		let codeList = ['politicals','marriages','educationals','englishes',
		'provinces', 'nations', 'socialcities', 'healthystate', 'accnature', 'stafftype']
		getDictSelectMuti({codeList}).then(res => {
			codeList.forEach(key => {
				this.setState(res.data)
			})
		})
	}

	search = id => {
		getDetail({id}).then(res => {
			//处理日期数据
			this.state.timefileds.forEach(t => {
				if(res.data[t]) res.data[t] = moment(res.data[t])
			})
			//是否有编辑权限
			const readonly = !res.data.isedit || res.data.isedit != 1
			if(!this.state.readonly){
				this.setState({readonly: readonly})
			}
			let obj = this.props.form.getFieldsValue()
			for(let k in obj){
				obj[k] = {value: res.data[k]}
			}
			if (obj.startdDate && obj.startdDate.value) obj.bussiyear = {value: moment(new Date).diff(moment(obj.startdDate.value), 'year')}
			if (obj.entryDate && obj.entryDate.value) obj.compyaer = {value: moment(new Date).diff(moment(obj.entryDate.value), 'year')}
			// 处理人员姓名
			if(obj.name.value){
				this.fetchUser(obj.name.value)
			}
			//处理户口所在地与籍贯（级联选择）
			if(obj.hkszd.value) obj.hkszd.value = obj.hkszd.value.split(',')
			if(obj.jg.value) obj.jg.value = obj.jg.value.split(',')
			this.props.form.setFields(obj)
			this.setState({checkState: res.data.checkstate})
			if(res.data.province){this.procity(res.data.province)}
			if(res.data.deptId){this.deptChange(res.data.deptId)}
		})
		
	}
	//检查有无审核权限
	hasCheckDone = _ => {
		const pp = this.props.thisrole.filter(e => e == '人事管理员')
		if(this.state.checkState == 0 && pp.length > 0){
			return true
		}else{
			return false
		}
	}
	//复核
	checkDone = _ => {
		const id = this.props.params.id
		checkDone({id}).then(res => {
			if(res.code == 200){
				message.success('复核成功')
				this.setState({checkState: 1})
			}
		})
	}
	//省市联动
	procity = t => {
		this.state.provinces.forEach( item => {
			if(item.code == t){
				this.setState({cities: item.children})
			}
		})
	}

	addmodel = _ => {
		this.setState({visible: true})
	}

	submit = async _ => {
		if (!this.state.lock) {
			await this.setState({lock: true, loading: true})
			this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
				if (!err || !Object.getOwnPropertyNames(err).length) {
					let params = Object.assign({id: this.state.id}, val)
					//处理日期
					this.state.timefileds.forEach(t => {
						if (params[t]) params[t] = params[t].format('YYYY-MM-DD')
					})
					if (params.pkCorp) params.corpName = handleTreeValue(this.state.companys ,params.pkCorp)
					if (params.deptId) params.deptName = handleTreeValue(this.state.depts ,params.deptId)
					if (params.hkszd) params.hkszd = params.hkszd.join(',')
					if (params.jg) params.jg = params.jg.join(',')
					addStaff(params).then(res => {
						if (res.code == 200 || res === true) {
							message.success('保存成功')
							if(!this.state.id) this.setState({id: res.data})
						}
						this.setState({lock: false, loading: false})
					})
				} else {
					this.setState({lock: false,  loading: false})
				}
			})
		}
	}

	render = _ => {
			const { getFieldDecorator } = this.props.form
			return <div style={{margin: '30px 20px'}}>
			<Form className="flex-form">
			<Row gutter={24}>
        {this.state.rules.map((val, index) => <Col key={index} span={8} style={{ display: 'block'}}><FormItem 
        label={val.label} labelCol={{span: 8}}>
          	{getFieldDecorator(val.key, val.option)(val.render())}
        </FormItem></Col>)}
        <Col span={8} style={{ display: 'block'}}>
        	{this.state.readonly ? null : <div><Button type="primary" style={{margin: '5px 20px'}}
    	onClick={this.submit} loading={this.state.loading}>保存</Button>
    			{this.hasCheckDone() ? <Button type="primary" style={{margin: '5px 20px'}}
    	onClick={this.checkDone}>复核</Button> : null}
    	</div>}
        </Col>
        </Row>
      </Form>
      <StaffIndex staffId={this.props.params.id || this.state.id} readonly={this.props.params.readonly || this.state.readonly} />
      </div>
	}

}

const StaffForm = Form.create()(StaffItem)
export default StaffForm