/**
 * 表格信息--测试
 * @author jxl
*/


import React, { Component } from 'react'
import { Descriptions, Icon, Form, Input, Select, DatePicker, message } from 'antd'

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;



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




class basicInfor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // 系统账号人员
            username: '',
            // 描述列表数据
            descList: [{
                label: '记录单号',
                key: 'workOrder',
                render: _ => this.state.basicInfor.workOrder
            }, {
                label: '公司名称',
                key: 'compayName',
                render: _ => this.state.basicInfor.compayName ? this.state.basicInfor.compayName : <Input value={this.state.basicInfor.compayName} />
            }, {
                label: '填写时间',
                key: 'fillTime',
                render: _ => moment().format('YYYY-MM-DD HH:mm:ss'),   // 自动填写当前的系统日期时间
            }, {
                label: '填写人',
                key: 'username',
                render: _ => this.state.basicInfor.username ? this.state.basicInfor.username : <Input value={this.state.basicInfor.username} />,
            }, {
                label: '填写部门',
                key: 'branch',
                render: _ => <Input value={this.state.basicInfor.branch} />
            }, {
                label: '项目类别',
                key: 'projectType',
                render: _ =>  <Select style={{width: '100%' }} placeholder="请选择项目类别" allowClear={true} value={this.state.basicInfor.projectType} onChange={(value)=>this.handleChange('projectType',value)}>
                    {
                        this.state.projectTypeArray.map((items, index) => {
                            return (<Option key={index} value={items.itemCode} disabled={this.state.basicInfor.projectType?true:false}>{items.itemValue}</Option>)
                        })
                    }
                </Select>
            }, {
                label: '项目号',
                key: 'projectNumber',
                render: _ => <span>{this.state.basicInfor.projectNumber}<Icon type="appstore" className="dateIcon" onClick={this.showProjectDailg} /></span>
            }, {
                label: '项目名称',
                key: 'projectName',
                render: _ => this.state.basicInfor.projectName ? this.state.basicInfor.projectName : <Input value={this.state.basicInfor.projectName} />,
            }, {
                label: '服务类别',
                key: 'serviceTypeName',
                render: _ => this.state.basicInfor.serviceTypeName ? this.state.basicInfor.serviceTypeName : <Input value={this.state.basicInfor.serviceTypeName} />
            }, {
                label: '客户编码',
                key: 'custNum',
                render: _ => this.state.basicInfor.custNum ? this.state.basicInfor.custNum : <Input value={this.state.basicInfor.custNum} />,
            }, {
                label: '客户名称',
                key: 'custName',
                render: _ => this.state.basicInfor.custName ? this.state.basicInfor.custName : <Input value={this.state.basicInfor.custName} />,
            }, {
                label: '所属行业',
                key: 'industry',
                render: _ => this.state.basicInfor.industry ? this.state.basicInfor.industry : <Input value={this.state.basicInfor.industry} />,
            }, {
                label: '客户级别',
                key: 'custLevel',
                render: _ => <Select style={{width: '100%' }} placeholder="请选择客户级别" allowClear={true} value={this.state.basicInfor.custLevel} onChange={(value)=>this.handleChange('custLevel',value)}>
                {
                    this.state.rankArray.map((items, index) => {
                        return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                    })
                }
            </Select>
            }, {
                label: '项目销售',
                key: 'salesmanName',
                render: _ => <span>{this.state.basicInfor.salesmanName}<Icon type="user" className="dateIcon" onClick={this.showUser} /></span>
                
            }, {
                label: '销售联系方式',
                key:'salesmanPhone',
                render: _ => <Input value={this.state.basicInfor.salesmanPhone} />
            }, {
                label: '项目经理类型',
                key:'managerType',
                render: _ => <Select style={{ width: '100%' }} placeholder="请选择项目经理类型" allowClear={true} value={this.state.basicInfor.managerType} onChange={(value) => this.handleChange('managerType', value)}>
                        {
                            this.state.managerTypeList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>
                }, {
                label: '项目经理',
                key: 'managerName',
                render: _ => this.state.basicInfor.managerType == '1' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>
                : <span>{this.state.basicInfor.managerName}<Icon type="user" className="dateIcon" onClick={this.showUser} /></span>
                
            }, {
                label: '项目经理联系方式',
                key: 'managerPhone',
                render: _ =>  this.state.basicInfor.managerType == '1' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>
                :  this.state.basicInfor.managerPhone ? this.state.basicInfor.managerPhone : <Input value={this.state.basicInfor.managerPhone} />
               
            }, {
                label: '项目开始日期',
                key: 'startDate',
                span: 2,
                render: _ => this.state.basicInfor.startDate ? this.state.basicInfor.startDate : <DatePicker style={{ width: '100%' }} />
            }, {
                label: '项目结束日期',
                key: 'endDate',
                span: 2,
                render: _ => this.state.basicInfor.endDate ? this.state.basicInfor.endDate : <DatePicker style={{ width: '100%' }} />
            }, {
                label: '是否续签项目',
                key: 'isRenewal',
                render: _ => <Select style={{ width: '100%' }} placeholder="请选择是否续签项目" allowClear={true} value={this.state.basicInfor.isRenewal}  onChange={(value)=>this.handleChange('isRenewal',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '续签项目号',
                key: 'renewalNumber',
                render: _ => this.state.basicInfor.isRenewal== '0' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div> : this.state.basicInfor.renewalNumber ? this.state.basicInfor.renewalNumber : <Input value={this.state.basicInfor.renewalNumber} />
            }, {
                label: '续签项目名称',
                key: 'renewalName',
                render: _ => this.state.basicInfor.isRenewal== '0' ? <div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div> : this.state.basicInfor.renewalName ? this.state.basicInfor.renewalName : <Input value={this.state.basicInfor.renewalName} />
            }, {
                label: '是否转包项目',
                key: 'isSubcontract',
                span: 2,
                render: _ => <Select style={{ width: '100%' }} placeholder="请选择是否转包项目" allowClear={true} value={this.state.basicInfor.isSubcontract}  onChange={(value)=>this.handleChange('isSubcontract',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '最终客户名称',
                key: 'finalCustName',
                span: 2,
                render: _ => this.state.basicInfor.isSubcontract=='0'?<div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>:<Input value={this.state.basicInfor.finalCustName} />
            }, {
                label: '是否有团建负责',
                key: 'isLeagueBuild',
                span: 2,
                render: _ => <Select style={{ width: '100%' }} placeholder="请选择是否有团建负责" allowClear={true} value={this.state.basicInfor.isLeagueBuild}  onChange={(value)=>this.handleChange('isLeagueBuild',value)}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '团建负责人',
                key: 'teamManager',
                span: 2,
                render: _ => this.state.basicInfor.isLeagueBuild=='0'?<div style={{position:'absolute',backgroundColor: '#fafafa',cursor:' no-drop',top:'0',left:'0',width:'100%',height:'48px'}}></div>:<Input value={this.state.basicInfor.teamManager} />
            }],


            /*********************     项目选择器 projectSelector.jsx组件     ********************** */
            moduleTitle:'项目选择器',
            visibleModule:false,
            
            /*********************    人员选择器 engineerSelector.jsx组件     ********************** */




            // 项目类别--数据集合
            projectTypeArray:[],
            // 客户级别--数据集合
            rankArray:[],
            // 项目经理类型--数据集合
            managerTypeList:[],


            // 所有数据集合
            basicInfor:{
                workOrder:'019289203',  //记录单号
                compayName:'', //公司名称
                fillTime:'', //填写时间
                username:'',//填写人
                branch:'', //填写部门
                projectType:'', //项目类别
                projectNumber:'',//项目号
                projectName:'',//项目名称
                serviceTypeName:'',//服务类别
                custNum:'',//客户编码
                custName:'',//客户名称
                industry:'',//所属行业
                custLevel:'',//客户级别
                salesmanName:'',//项目销售
                salesmanPhone:'',//销售联系方式
                managerType:'',//项目经理类型
                managerName:'',//项目经理
                managerPhone:'',//项目经理联系方式
                startDate:'',//项目开始日期
                endDate:'',//项目结束日期
                isRenewal:'',//是否续签项目,1是，0-否
                renewalNumber:'',//续签项目号
                renewalName:'',//续签项目名称
                isSubcontract:'',//是否转包项目
                finalCustName:'',//最终客户名称
                isLeagueBuild:'',//是否有团建负责
                leagueBuildName:''//团建负责人
            },


            // 子组件---选择器选中的数据集合
            info:null,

            
        }
    }

    componentWillMount() {
        let name = 'realName';
        if (process.env.NODE_ENV == 'production') {
            name = `${process.env.ENV_NAME}_realName`
        }
        console.log(!(process.env.NODE_ENV == 'production'))
        let userName = localStorage.getItem(name)
        let data = Object.assign({}, this.state.basicInfor, { username: userName })
        this.setState({ basicInfor:data })
    }

    // 挂载完成
    componentDidMount = () => {
        this.init();


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


    }

    /**
     *  自定义封装---用于一个对象给另一个对象赋值。
     * params: 第一个对象取值 给 第二个对象赋值
     */
    format = (param1, param2) => {
        Object.keys(param1).forEach(function (v) {
            if (param1[v] != undefined && param1[v] != "") {
                param2[v] = param1[v];
            }
        });
        return param2;
    }

    // 所有下拉框onchange事件
    handleChange=(element,value)=>{
        console.log('****************         所有下拉框onchange事件          *********************')
        console.log(element,value)

        let {basicInfor}= this.state;
        basicInfor[element]=value;

        //使用setsatte方法改变类中属性
        let data = Object.assign({}, basicInfor);

        this.setState({
            basicInfor:data
        })

        console.log('--------------        重新赋值之后  basicInfor       --------------')
        console.log(this.state.basicInfor)
    }


    // 获取---表工单号接口
    getWork=()=>{
        serviceWorkOrder().then(res=>{
            if (res.success == 1) {
                this.setState({
                    workOrder:res.data
                })
            }else if (res.success == 0) {
                message.error(res.message)
            }
        })
    }



    // 点击【项目号】旁边的icon，就弹出【项目选择器】对话框
    showProjectDailg=()=>{
        console.log('------------           点击【项目号】旁边的icon，就弹出【项目选择器】对话框            -------------')
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

    // 点击【项目销售】旁边的icon，就弹出【人员选择器】对话框
    showUser=()=>{

    }


    // 点击确认之后，将对应的数据带入到基本信息中
    handleOk=(info)=>{
        let newBasicInfor = this.format(info,this.state.basicInfor);

        console.log('*********************       合并赋值后的info数据        **********************')
        console.log(newBasicInfor)

        this.setState({
            basicInfor:newBasicInfor
        })
    }
    
    render = _ => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="BasicInfor">
                {/* 基本信息--区域 */}
                <Descriptions bordered size='small'>
                    {
                        this.state.descList.map((item, index) => {
                            return (
                                <Descriptions.Item label={item.label} span={item.span} key={index}>
                                    {item.render()}
                                </Descriptions.Item>
                            )
                        })
                    }
                </Descriptions>

                {/* 项目选择器---组件 */}
                {
                    this.state.visibleModule ? <ProjectSelector title={this.state.moduleTitle} onCancel={this.close} onOk={this.handleOk}></ProjectSelector> : null 
                }
                
            </div>
        )
    }
}
const BasicInfor = Form.create()(basicInfor)
export default BasicInfor