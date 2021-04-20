/***
 * 信息管理系统---服务需求表
 * 
 */


import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SET_WORKLIST } from '/redux/action'

import { Form, Tabs, Button, Select, message, Tooltip, Modal } from 'antd'

const { TabPane } = Tabs;

// 引入less
import '@/assets/less/pages/servies.less'
// 引入主表信息组件
import ServicesMain from '/components/workorder/SQT/masterList/ServiceRequire.jsx'
// 引入 接口
import { SqtBaseDetail,getAssistant,SqtBase,PostaddAssistant } from '/api/serviceMain.js'
import  ServiceArea from './serviceArea/serviceArea'


class Sqt extends Component {

    constructor(props) {
        super(props)
        if(this.props.setRef) this.props.setRef(this);
        this.state = {
            tabsList:[{
                name:'主表信息'
            }],   
            datasources:[],  //附表1数据存储
            microRisk:{},  //微观风险附表数据存储
            tabsListF:[],
            swich:true,//主表密钥
            paramsObj:{
                
            },
            masterVildter:['orderNum',  //记录单号
            'companyName', //公司名称
            'writeTime', //填写时间
            'writeUserName',//填写人
            'writeDept', //填写部门
            'projectType', //项目类别
            'projectNumber',//项目号
            'projectName',//项目名称
            'serviceTypeName',//服务类别
            'custNum',//客户编码
            'custName',//客户名称
            'industry',//所属行业
            'custLevel',//客户级别
            'salesmanName',//项目销售
            'salesmanPhone',//销售联系方式
            'managerType',//项目经理类型
            'managerName',//项目经理
            'managerPhone',//项目经理联系方式
            'startDate',//项目开始日期
            'endDate',//项目结束日期
            'isRenewal',// 是否续签项目,1是，0-否
            'renewalNumber',//续签项目号
            'renewalName',//续签项目名称
            'isSubcontract',// 是否转包项目,1是，0-否
            'finalCustName',//最终客户名称
            'isLeagueBuild',//是否有团建负责，1是，0否
            'leagueBuildName',//团建负责人

            'serviceMode',  // 服务方式
            'longInspectionCycle',  //远程巡检周期
            'sceneInspectionCycle',      // 现场巡检周期
            'isFirstInspection', // 是否需要提供首次巡检服务，1-是，0-否
            'isCollectConfig', // 是否收集相关配置信息，1-是，0-否
            'notCollectReason',    // 不收集配置信息原因说明
            'serviceReportCycle', // 服务报告提交周期
            'serviceListRequire', // 服务单要求
            'otherPromise', //其他重要承诺及要求
            'slaList'
            ]
        }
    }
    componentWillMount () {
        this.init()
	}
    // componentDidMount(){
    //     //this.init()
    // }
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


    // 页面初始化方法(回显数据)
    init = () => {
    //根据节点获取paramsObj
    // console.log(this.props.config.formControl,this.props.config.formControl.action.indexOf('masterList') > -1)
        if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('masterList') > -1){  //主表查询接口
            // console.log(this.props.config.id);
            setTimeout(()=>{
                this.getSqtDetail(this.props.config.id)
            },0)
        }
        if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('serviceArea') > -1){//附表1查询接口
            getAssistant({baseId:this.props.config.id}).then(res => {
                if (res.success == '1') {
                    this.setState({
                        datasources:res.data
                    })
                }else if (res.success == '0') {
                    message.error(res.message)
                }
            })
        }
        
    }


    // 服务计划表---查询接口
    getSqtDetail=(id)=>{
        SqtBaseDetail(id).then(res=>{
            const {paramsObj} = this.state;
            if (res.success == '1') {
                let newData = {...paramsObj,...res.data};
                this.setState({
                    paramsObj:{...newData},
                    swich:!this.state.swich
                },()=>{
                    // console.log(this.state.paramsObj)
                })
            }else if (res.success == '0') {
                message.error(res.message)
            }
        })
    }



    // 定义方法,
    getChildrenData = (dat) => {
        console.log(dat)
        if((this.props.config.sign == 1 && !this.state.swich) || !this.props.config.sign){
            const {paramsObj} = this.state;
            this.setState({
                paramsObj:{...paramsObj,...dat}
            })
        }
    }

//服务需求表提交验证接口
submission=async ()=>{
        if(this.props.config.formRead == 2) {
            this.props.submission(true)
            return false
        }
        let {paramsObj} = this.state,AssistantPonse,MasterPonse;
        if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('serviceArea') > -1){//附表1提交接口
            for(let i = 0,len = this.state.datasources; i < len ; i++ ){
                if(datasources[i].error.state) {
                    message.error(res.message)
                    return false;
                }
            }
            AssistantPonse = await PostaddAssistant(this.state.datasources)
        }
         if (!this.props.config.formControl || ( this.props.config.formControl.masterList.nodes && this.props.config.formControl.masterList.isEdit)) {
            if (!this.vildteMasterList()) {
                message.error('主表信息填写不完整，请检查！(基本区域和服务承诺为必填项)')
                return false;
            }
            // console.log(JSON.stringify(paramsObj))
            // return
            MasterPonse = await SqtBase(paramsObj)
            if (MasterPonse.success != 1) {
                message.error(MasterPonse.message)
                return false;
            }
         }
        if(AssistantPonse && AssistantPonse.success != 1){
            message.error(AssistantPonse.message)
            return false;
        }
       if(this.props.submission) this.props.submission(true);
        return true;       
    }
    //接受附表验证信息函数
    getChildrenVildter = (data,index) => {
        let {datasources} = this.state;
        datasources[index] = {...datasources[index],...data.dataSource,...data.error};
    }
    //接收微观风险附表数据
    getChildrenVildter = () => {
        let {datasources} = this.state;
        datasources[index] = {...datasources[index],...data.dataSource,...data.error};
    }
    //验证主表信息是否填写完整
    vildteMasterList = () => {
        let vilde = true,{paramsObj,masterVildter} = this.state;
        for(var i of masterVildter){
            console.log(i,paramsObj)
            if((i == 'notCollectReason' && paramsObj['isCollectConfig'] == 1) || (i == 'leagueBuildName' && paramsObj['isLeagueBuild'] == 0) || (i == 'finalCustName' && paramsObj['isSubcontract'] == 0) || (i == 'managerName' && paramsObj['managerType'] == 1) || ((i == 'renewalName' || i == 'renewalNumber') && paramsObj['isRenewal'] == 0 )){
                continue;
            }
            if(!(paramsObj[i]+'')){
                console.log(i,paramsObj[i])
                return false;
            }
        }
        // if(!paramsObj.orderNum){  //记录单号不能为空
        //     vilde = false;
        // }
         return true;
    }
    render = _ => {
        let {datasources,paramsObj} = this.state;
        console.log(paramsObj.serviceTypeName,datasources,this.props.config)
        return (
            <div className="SqtContent">
                <Tabs defaultActiveKey="0" tabPosition={'top'} style={{ overflowY:'auto' }}>
                    {this.state.tabsList.map((item,index) => (
                        <TabPane tab={item.name} key={index}>
                            {/* 主表--组件  */}
                           <ServicesMain paramsObj={paramsObj} onChangeData={this.getChildrenData} power={this.props.config ? this.props.config : {}} swich={this.state.swich} ></ServicesMain>
                        </TabPane>
                    ))}
                    {
                       (paramsObj.serviceType && datasources.length) ? datasources.map((item,index) => (
                        <TabPane tab={item.area} key={index+1}>
                            {/* 附表--组件  */}
                           <ServiceArea dataSource={item} onChange={(data) => this.getChildrenVildter(data,index)} type={this.state.paramsObj.serviceTypeName} power={this.props.config}></ServiceArea>
                        </TabPane>
                    )) : null
                    }
                </Tabs>
            </div>
        )
    }
}
export default Sqt;
