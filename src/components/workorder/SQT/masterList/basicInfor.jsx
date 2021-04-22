/**
 * 表格信息--测试
 * @author jxl
*/


import React, { Component } from 'react'
import { Descriptions, Icon, Form, Input, Select, DatePicker, message } from 'antd'

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';


// 引入---【项目选择器组件】
import ProjectSelector from '/components/selector/projectSelector.jsx'
// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'
// 引入日期格式化
import moment from 'moment'
// 引入页面CSS
import '/assets/less/pages/servies.less'
// 引入 js
import { serviceWorkOrder , } from '/api/serviceMain.js'
// 引入--数据字典统一接口
import {customerLevel } from '/api/customerInfor'
import { node } from '../../../../../config/dev.env';




class basicInfor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 系统账号人员
            username: '',
            // 描述列表数据
            descList: [{
                label: '记录单号',
                key: 'orderNum',
                render: _ => this.state.basicInfor.orderNum
            }, {
                label: '公司名称',
                key: 'companyName',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.companyName} onChange={({ target: { value } })=>this.handleChange('companyName',value)} placeholder='根据项目号进行带入'  />
            }, {
                label: '填写时间',
                key: 'writeTime',
                render: _ => this.state.basicInfor.writeTime
            }, {
                label: '填写人',
                key: 'writeUserName',
                //  ? this.state.basicInfor.username : 
                render: _ => this.state.basicInfor.writeUserName  // 自动根据用户生成
            }, {
                label: '填写部门',
                key: 'writeDept',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.writeDept} onChange={({ target: { value } })=>this.handleChange('writeDept',value)} />
            }, {
                label: '项目类别',
                key: 'projectType',
                render: (isEdit,formRead,node) =>  <Select style={{width: '100%' }} disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} placeholder="请选择项目类别" allowClear={true} value={this.state.basicInfor.projectType+''} onChange={(value)=>this.handleChange('projectType',value)}>
                    {
                        this.state.projectTypeArray.map((items, index) => {
                            return (<Option key={index} value={items.itemCode} disabled={this.state.basicInfor.projectType?true:false}>{items.itemValue}</Option>)
                        })
                    }
                </Select>
            }, {
                label: '项目号',
                key: 'projectNumber',
                render: (isEdit,formRead,node) => this.setJurisdiction(isEdit,formRead,node) ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px',color:'#c4c4c4',display:'flex',justifyContent:'start',alignItems:'center',padding:'8px 16px'}}>{this.state.basicInfor.projectNumber}</div> : <span>{this.state.basicInfor.projectNumber}<Icon type="appstore" className="dateIcon" onClick={this.showProjectDailg} /></span>
            }, {
                label: '项目名称',
                key: 'projectName',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.projectName} onChange={({ target: { value } })=>this.handleChange('projectName',value)} placeholder='根据项目号进行带入'/>,
            }, {
                label: '服务类别',
                key: 'serviceTypeName',
                render: (isEdit,formRead,node) => <Select disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{width: '100%' }} placeholder="请选择" allowClear={true} value={this.state.basicInfor.serviceType+''} onChange={(value)=>this.handleChange('serviceType',value)}>
                {
                    this.state.ServiceTypeArray.map((items, index) => {
                        return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                    })
                }
            </Select>
                // render: isEdit => <Input disabled={isEdit ? true : false} value={this.state.basicInfor.serviceTypeName} onChange={({ target: { value } })=>this.handleChange('serviceTypeName',value)} placeholder='根据项目号进行带入' />
            }, {
                label: '客户编码',
                key: 'custNum',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.custNum} onChange={({ target: { value } })=>this.handleChange('custNum',value)} placeholder='根据项目号进行带入' />,
            }, {
                label: '客户名称',
                key: 'custName',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.custName} onChange={({ target: { value } })=>this.handleChange('custName',value)} placeholder='根据项目号进行带入' />,
            }, {
                label: '所属行业',
                key: 'industry',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.industry} onChange={({ target: { value } })=>this.handleChange('industry',value)} placeholder='根据项目号进行带入' />,
            }, {
                label: '客户级别',
                key: 'custLevel',
                render: (isEdit,formRead,node) => <Select disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{width: '100%' }} placeholder="请选择客户级别" allowClear={true} value={this.state.basicInfor.custLevel} onChange={(value)=>this.handleChange('custLevel',value)}>
                {
                    this.state.rankArray.map((items, index) => {
                        return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                    })
                }
            </Select>
            }, {
                label: '项目销售',
                key: 'salesmanName',
                render: (isEdit,formRead,node) => this.setJurisdiction(isEdit,formRead,node) ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px',color:'#c4c4c4',display:'flex',justifyContent:'start',alignItems:'center',padding:'8px 16px'}}>{this.state.basicInfor.salesmanName}</div> : <span>{this.state.basicInfor.salesmanName}<Icon type="user" className="dateIcon" onClick={()=>this.showUser('项目销售')} /></span>
                
            }, {
                label: '销售联系方式',
                key:'salesmanPhone',
                render: (isEdit,formRead,node) => <Input disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} value={this.state.basicInfor.salesmanPhone} onChange={({ target: { value } })=>this.handleChange('salesmanPhone',value)} placeholder='根据项目销售进行带入' />
            }, {
                label: '项目经理类型',
                key:'managerType',
                render: (isEdit,formRead,node) => <Select disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{ width: '100%' }} placeholder="请选择项目经理类型" allowClear={true} value={this.state.basicInfor.managerType} onChange={(value) => this.handleChange('managerType', value)}>
                        {
                            this.state.managerTypeList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>
            },{
                label: '项目经理',
                key: 'managerName',
                render: (isEdit,formRead,node) => this.setJurisdiction(isEdit,formRead,node,2) ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px',color:'#c4c4c4',display:'flex',justifyContent:'start',alignItems:'center',padding:'8px 16px'}}>{this.state.basicInfor.managerName}</div> : this.state.basicInfor.managerType == '1' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px',color:'#c4c4c4',display:'flex',justifyContent:'start',alignItems:'center',padding:'8px 16px'}}>{this.state.basicInfor.managerName}</div>
                : <span>{this.state.basicInfor.managerName}<Icon type="user" className="dateIcon" onClick={()=>this.showUserManager('项目经理')} /></span>
                
            }, {
                label: '项目经理联系方式',
                key: 'managerPhone',
                render: (isEdit,formRead,node) => {
                    // let a = this.props.node != 2 ? this.setJurisdiction(isEdit,formRead,node) ? true : this.state.basicInfor.managerType == '1' ? false : true : false;
                    return <Input disabled={ this.setJurisdiction(isEdit,formRead,node,2) ? true : this.state.basicInfor.managerType == '1' ? true : false } value={this.state.basicInfor.managerPhone} onChange={({ target: { value } })=>this.handleChange('managerPhone',value)} placeholder='根据项目经理所选进行带入' />}
               
            }, {
                label: '项目开始日期',
                key: 'startDate',
                span: 2,
                //  this.state.basicInfor.startDate ? this.state.basicInfor.startDate : 
                render: (isEdit,formRead,node) =><DatePicker disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{ width: '100%' }} value={this.state.basicInfor.startDate?moment(this.state.basicInfor.startDate, dateFormat):null} format={dateFormat} onChange={(date, dateString)=>this.timeChange('startDate',date, dateString)} />
            }, {
                label: '项目结束日期',
                key: 'endDate',
                //  this.state.basicInfor.endDate ? this.state.basicInfor.endDate : 
                render: (isEdit,formRead,node) => <DatePicker disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{ width: '100%' }} value={this.state.basicInfor.endDate?moment(this.state.basicInfor.endDate, dateFormat):null} format={dateFormat} onChange={(date, dateString)=>this.timeChange('endDate',date, dateString)} />
            }, {
                label: '是否续签项目',
                key: 'isRenewal',
                render: (isEdit,formRead,node) => <Select style={{ width: '100%' }} disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} placeholder="请选择是否续签项目" allowClear={true} value={this.state.basicInfor.isRenewal+''} onChange={(value)=>this.handleChange('isRenewal',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '续签项目号',
                key: 'renewalNumber',
                render: (isEdit,formRead,node) => this.state.basicInfor.isRenewal== '0' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div> : <Input disabled={isEdit ? true : false} value={this.state.basicInfor.renewalNumber} onChange={({ target: { value } })=>this.handleChange('renewalNumber',value)} />
            }, {
                label: '续签项目名称',
                key: 'renewalName',
                render: (isEdit,formRead,node) => this.state.basicInfor.isRenewal== '0' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div> : <Input disabled={isEdit ? true : false} value={this.state.basicInfor.renewalName} onChange={({ target: { value } })=>this.handleChange('renewalName',value)} />
            }, {
                label: '是否转包项目',
                key: 'isSubcontract',
                span: 2,
                render: (isEdit,formRead,node) => <Select disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{ width: '100%' }} placeholder="请选择是否转包项目" allowClear={true} value={this.state.basicInfor.isSubcontract+''} onChange={(value)=>this.handleChange('isSubcontract',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '最终客户名称',
                key: 'finalCustName',
                render: (isEdit,formRead,node) => this.state.basicInfor.isSubcontract=='0'?<div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>:<Input disabled={isEdit ? true : false} value={this.state.basicInfor.finalCustName} onChange={({ target: { value } })=>this.handleChange('finalCustName',value)} />
            }, {
                label: '是否有团建负责',
                key: 'isLeagueBuild',
                span: 2,
                render: (isEdit,formRead,node) => <Select disabled={this.setJurisdiction(isEdit,formRead,node) ? true : false} style={{ width: '100%' }} placeholder="请选择是否有团建负责" allowClear={true} value={this.state.basicInfor.isLeagueBuild+''} onChange={(value)=>this.handleChange('isLeagueBuild',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '团建负责人',
                key: 'leagueBuildName',
                render: (isEdit,formRead,node) => this.state.basicInfor.isLeagueBuild=='0'?<div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>:<Input disabled={isEdit ? true : false} value={this.state.basicInfor.leagueBuildName} onChange={({ target: { value } })=>this.handleChange('leagueBuildName',value)} />
            }
        ],


            /*********************     项目选择器 projectSelector.jsx组件     ********************** */
            moduleTitle:'项目选择器',
            visibleModule:false,
            
            /*********************    人员选择器 engineerSelector.jsx组件     ********************** */
            userTitle:'人员选择器',
            selector: {
                visible: false,
            },



            // 项目类别--数据集合
            projectTypeArray:[],
            // 服务类别--数据集合
            ServiceTypeArray:[],
            // 客户级别--数据集合
            rankArray:[],
            // 项目经理类型--数据集合
            managerTypeList:[],
            // 用于判断点击【人员选择器】时，当前点击的是【项目销售】还是【项目经理】
            userSelector:'',
            // 所有数据集合
            basicInfor:null,
            backBasicInfor:null,
            // 子组件选择器选中的数据集合
            info:null,
            
        }
    }
    // 数据更新完成时触发的函数
    componentWillMount() {
        // 这里判断父组件传过来的【isSelfCreation】属性。
        var isSelfCreation = this.props.isSelfCreation;
        
        this.setState({
            basicInfor: this.props.data,
            backBasicInfor:{...this.props.data}
        }, () => {
            // 判断 如果是从【自行创建服务计划表】的情况下，则将填写人、填写人ID、填写时间 归于：当前系统账号人员、当前的系统日期时间；若不是【自行创建服务计划表】的情况下，则按照数据进行填写
            if (!isSelfCreation) {
                let name = 'realName', id = 'userid';
                if (process.env.NODE_ENV == 'production') {
                    name = `${process.env.ENV_NAME}_realName`
                    id = `${process.env.ENV_NAME}_userid`
                }
                
                let userName = localStorage.getItem(name)
                let userId = localStorage.getItem(id)
                // let data = Object.assign({}, this.state.basicInfor)

                // // 在对象数据集合中新增【填写人ID-writeUserId】
                // data['writeUserId'] = userId;
                serviceWorkOrder().then(res => {
                    if (res.success == 1) {
                        let {backBasicInfor} = this.state
                        let data = Object.assign({},this.state.basicInfor, { orderNum:res.data},{writeUserId:userId, writeUserName: userName,writeTime:moment().format('YYYY-MM-DD HH:mm:ss')});
                        this.setState({
                            basicInfor:data,
                            backBasicInfor:{...backBasicInfor,...data}
                        },()=>{
                            // 将修改的数据传递到父组件
                            this.props.onChangeInfo(this.state.basicInfor)
                        })
                    } else if (res.success == 0) {
                        message.error(res.message)
                    }
                })

            }

        })

       

       
    }
     //@author  gl
     componentWillReceiveProps (nextprops) {
        //  console.log(this.state.basicInfor.orderNum == nextprops.orderNum)
        let {basicInfor} = this.state;
        console.log(JSON.stringify(basicInfor) == JSON.stringify(nextprops.data))
        if(JSON.stringify(basicInfor) == JSON.stringify(nextprops.data)) return;
        // if(this.state.basicInfor.orderNum == nextprops.orderNum){
        //     return false;
        // }
        // console.log(nextprops.data)
		this.setState({
            basicInfor: nextprops.data,
        })
	}
    // 挂载完成
    componentDidMount = () => {
        this.init();


    }
    //处理是否可编辑权限
    setJurisdiction = (isEdit,formRead,node,special) => {
        if(formRead != 2){
            if( node != 3 && node != special){
                return isEdit
            }else{
                return false;
            }
        }else{
            return true;
        }
    }
    // 初始化接口
    init = () => {
        // 客户级别--数据
        customerLevel({ dictCode: 'customerLevel' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    rankArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 项目经理类型--数据
        customerLevel({ dictCode: 'managerType' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    managerTypeList: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
        // 项目类别--数据  
        customerLevel({ dictCode: 'projectType' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    projectTypeArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
        // 项目类别--数据  
        customerLevel({ dictCode: 'serviceType' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    ServiceTypeArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
    }

    /**
       *  自定义封装---用于一个对象给另一个对象赋值。
       * params: 第一个对象==赋值    第二个对象===取值 (意思就是：data给params赋值 返回的是params)
       */
    setInfo = (data, params) => {
        var obj = {};
        Object.keys(params).forEach(key => {
            if (data[key]) {
                obj[key] = data[key] || null;
            }
        });
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                params[key] = obj[key]
                //使用setsatte方法改变类中属性
                var newData = Object.assign({}, params);
            }
        }
        return newData
    };


    // 所有【select下拉框、input输入框】onchange事件
    handleChange = (element, value) => {
        var { basicInfor } = this.state;
        basicInfor[element] = value;
        //使用setsatte方法改变类中属性
        let data = Object.assign({}, basicInfor);


        // 判断是否是【手机号验证】
        if (element == 'salesmanPhone' ||　element == 'managerPhone') {
            // console.log(value,basicInfor)
            var regex = /^1(3|4|5|6|7|8|9)\d{9}$/;
            // if (value) {
                //react使用正则表达式变量的test方法进行校验，若是填写不正确就不将数据返回给父组件；否则 反之
                if (!regex.test(value)) {
                    message.error('请输入正确的手机号码！');
                    this.setState({
                        basicInfor:data
                    })
                }else {
                    message.success('手机号码格式填写正确！');
                    this.setState({
                        basicInfor:data
                    },()=>{
                       // 向父组件传递更新后的对象集合
                       this.props.onChangeInfo(this.state.basicInfor)
                        
                    })
                }
                
            // }    
        }else {
            this.setState({
                basicInfor:data
            },()=>{
               // 向父组件传递更新后的对象集合
               this.props.onChangeInfo(this.state.basicInfor)
                
            })
        }
       
    }

    // 所有【日期时间】的onchange事件
    timeChange = (el, date, dateString) => {

        let {basicInfor}= this.state;
        basicInfor[el] = dateString
        //使用setsatte方法改变类中属性
        let data = Object.assign({}, basicInfor);

        this.setState({
            basicInfor:data
        },()=>{
            // 向父组件传递更新后的对象集合
           this.props.onChangeInfo(this.state.basicInfor)
        })

    }

    // 点击【项目号】旁边的icon，就弹出【项目选择器】对话框
    showProjectDailg=()=>{
        if(this.props.isEdit){
            return false;
        }
        this.setState({
            visibleModule:true
        })
    }
    // 关闭--【项目选择器】对话框组件
    close=()=>{
        this.setState({
            visibleModule:false
        })
    }
    // 【项目选择器】点击确认之后，将对应的数据带入到基本信息中
    handleOk=(info)=>{
        // let newBasicInfor = this.setInfo(info,this.state.basicInfor);
        let newBasicInfor = this.setInfo(info,this.state.backBasicInfor);//重置项目号之后所有值跟着重置 @gl 
        // 新增一项【项目id--projectId】
        newBasicInfor['projectId'] = info.id;
        // console.log(newBasicInfor)
        this.setState({
            basicInfor:newBasicInfor
        },()=>{
            // 向父组件传递更新后的对象集合
            this.props.onChangeInfo(this.state.basicInfor)
            this.props.onGetChange(info)
        })

    }
    // 点击【项目销售】旁边的icon，就弹出【人员选择器】对话框
    showUser=(title)=>{
        if(this.props.isEdit){
            return false;
        }
        this.setState({
            userSelector:title,
            selector: {
                visible: true
            }
        })
    }
    // 点击【项目经理】旁边的icon，就弹出【人员选择器】对话框
    showUserManager=(title)=>{
        // console.log(this.props.node !=2 ,this.props.isEdit)
        if(this.props.node !=2 && this.props.isEdit){
            return false;
        }
        this.setState({
            selector: {
                visible: true
            },
            userSelector:title
        })
    }

    // 关闭--【人员选择器】对话框组件
    onSelectorCancel = _ => {
        this.setState({
            selector: {
                visible: false,
            }
        })
    }

    // 【人员选择器】点击确认之后，将对应的数据带入到基本信息中
    onSelectorOK=(key,info)=>{
        var data = info[0];
        var phone = data.mobilePhone; // 联系电话
        var name = data.realName; // 姓名
        // 首先 判断当前点击的是【项目销售】下的选择器还是【项目经理】下的选择器
        if (this.state.userSelector == '项目销售') {
            var newInfo = Object.assign({}, this.state.basicInfor, { salesmanName: name, salesmanPhone: phone });
            // 新增一项【项目销售id】
            newInfo['salesmanId'] = data.id;
        } else if (this.state.userSelector == '项目经理') {
            var newInfo = Object.assign({}, this.state.basicInfor, { managerName: name, managerPhone: phone });
            // 新增一项【项目经理id】
            newInfo['managerId'] = data.id;
        }
        // 修改源数据
        this.setState({
            basicInfor: newInfo
        },()=>{
            // 向父组件传递更新后的对象集合
            this.props.onChangeInfo(this.state.basicInfor)
           
        })
        // 关闭-对话框组件
        this.onSelectorCancel();
        
    }

    
    
    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const { isEdit,formRead,node } = this.props;
        return (
            <div className="BasicInfor">
                {/* 基本信息--区域 */}
                <Descriptions bordered size='small'>
                    {
                        this.state.descList.map((item, index) => {
                            return (
                                <Descriptions.Item label={item.label} span={item.span ? item.span : 1} key={index}>
                                    {item.render(isEdit,formRead,node)}
                                </Descriptions.Item>
                            )
                        })
                    }
                </Descriptions>

                {/* 项目选择器---组件 */}
                {
                    this.state.visibleModule ? <ProjectSelector title={this.state.moduleTitle} onCancel={this.close} onOk={this.handleOk}></ProjectSelector> : null 
                }
                {/* 人员选择器---组件 */}
                {
                    this.state.selector.visible ? <Selector title={this.state.userTitle} onOk={this.onSelectorOK} onCancel={this.onSelectorCancel} /> : ""
                }
                
            </div>
        )
    }
}
const BasicInfor = Form.create()(basicInfor)
export default BasicInfor