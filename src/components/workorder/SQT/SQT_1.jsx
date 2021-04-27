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
import ServicesMain from '@/components/workorder/SQT/masterList/ServiceRequire.jsx'
// 引入 接口
import { SqtBaseDetail,SqtBase,PostaddAssistant, PostMacroRisk,PostMacroRiskSum,PostaddMicroRisk,PostaddMicroRiskSum} from '/api/serviceMain.js'
//引入服务区域附表组件
import  ServiceArea from '@/components/workorder/SQT/serviceArea/serviceArea'
//引入宏观风险附表组件
import  MacroRiskList from '@/components/workorder/SQT/macroRisk/macroRiskList'
//引入宏观风险汇总附表组件
import  MacroRiskSummary from '@/components/workorder/SQT/macroRisk/macroRiskSummary'

//引入微观风险附表组件
import  MicroRisk from '@/components/workorder/SQT/microrisk/microrisk'
//引入微观风险汇总附表组件
import  MicroRiskSummary from '@/components/workorder/SQT/microrisk/microriskSummary'


class Sqt extends Component {

    constructor(props) {
        super(props)
        if(this.props.setRef) this.props.setRef(this);
        this.state = {
            tabsList:[{
                name:'主表信息'
            }],   
            schedule:{
                serviceArea: {post:PostaddAssistant,area: '服务区域'}, //服务区域附表数据 + 验证
                macroRisk: {post:PostaddMicroRisk,area: '宏观风险'},//宏观风险附表数据 + 验证
                macroRiskSummary: {post:PostaddMicroRisk,area: '宏观风险汇总'},//宏观风险汇总附表数据 + 验证
                microRisk: {post:PostaddMicroRisk,area: '微观风险'},//微观风险附表数据 + 验证
                microRiskSummary: {post:PostaddMicroRisk,area: '微观风险汇总'},//微观风险汇总附表数据 + 验证
            },//附表数据存储
            tabsListF:[],
            swich:true,//主表密钥
            paramsObj:{
                
            },
            masterVildter:[{
                attribute:'orderNum', //记录单号
                errorMeassge:'主表记录单号不能为空！'
            },{
                attribute:'companyName', //公司名称
                errorMeassge:'主表公司名称不能为空！'
            },{
                attribute: 'writeTime', //填写时间
                errorMeassge:'主表填单时间不能为空！'
            },{
                attribute: 'writeUserName',//填写人
                errorMeassge:'主表填写人不能为空！'
            },{
                attribute: 'writeDept', //填写部门
                errorMeassge:'主表填写部门不能为空！'
            },{
                attribute: 'projectType', //项目类别
                errorMeassge:'主表项目类别不能为空！'
            },{
                attribute: 'projectNumber',//项目号
                errorMeassge:'主表项目号不能为空！'
            },{
                attribute: 'projectName',//项目名称
                errorMeassge:'主表项目名称不能为空！'
            },{
                attribute: 'serviceType',//服务类别
                errorMeassge:'主表服务类别不能为空！'
            },{
                attribute: 'custNum',//客户编码
                errorMeassge:'主表客户编码不能为空！'
            },{
                attribute: 'custName',//客户名称
                errorMeassge:'主表客户名称不能为空！'
            },{
                attribute: 'industry',//所属行业
                errorMeassge:'主表所属行业不能为空！'
            },{
                attribute: 'custLevel',//客户级别
                errorMeassge:'主表客户级别不能为空！'
            },{
                attribute: 'salesmanName',//项目销售
                errorMeassge:'主表项目销售不能为空！'
            },{
                attribute: 'salesmanPhone',//销售联系方式
                errorMeassge:'主表销售联系方式不能为空！'
            },{
                attribute: 'managerType',//项目经理类型
                errorMeassge:'主表项目经理类型不能为空！'
            },{
                attribute: 'managerName',//项目经理
                errorMeassge:'主表项目经理不能为空！'
            },{
                attribute: 'managerPhone',//项目经理联系方式
                errorMeassge:'主表项目经理联系方式不能为空！'
            },{
                attribute: 'startDate',//项目开始日期
                errorMeassge:'主表项目开始日期不能为空！'
            },{
                attribute: 'endDate',//项目结束日期
                errorMeassge:'主表项目结束日期不能为空！'
            },{
                attribute: 'isRenewal',// 是否续签项目,1是，0-否
                errorMeassge:'主表是否续签项目不能为空！'
            },{
                attribute: 'renewalNumber',//续签项目号
                errorMeassge:'主表续签项目号不能为空！'
            },{
                attribute: 'renewalName',//续签项目名称
                errorMeassge:'主表续签项目名称不能为空！'
            },{
                attribute: 'isSubcontract',// 是否转包项目,1是，0-否
                errorMeassge:'主表是否转包项目不能为空！'
            },{
                attribute: 'finalCustName',//最终客户名称
                errorMeassge:'主表最终客户名称不能为空！'
            },{
                attribute: 'isLeagueBuild',//是否有团建负责，1是，0否
                errorMeassge:'主表是否有团建负责不能为空！'
            },{
                attribute: 'leagueBuildName',//团建负责人
                errorMeassge:'主表团建负责人不能为空！'
            },{
                attribute: 'serviceMode',  // 服务方式
                errorMeassge:'主表服务方式不能为空！'
            },{
                attribute: 'longInspectionCycle',  //远程巡检周期
                errorMeassge:'主表远程巡检周期不能为空！'
            },{
                attribute: 'sceneInspectionCycle',      // 现场巡检周期
                errorMeassge:'主表现场巡检周期不能为空！'
            },{
                attribute: 'isFirstInspection', // 是否需要提供首次巡检服务，1-是，0-否
                errorMeassge:'主表是否需要提供首次巡检服务不能为空！'
            },{
                attribute: 'isCollectConfig', // 是否收集相关配置信息，1-是，0-否
                errorMeassge:'主表是否是否收集相关配置信息不能为空！'
            },{
                attribute:  'notCollectReason',    // 不收集配置信息原因说明
                errorMeassge:'主表不收集配置信息原因说明不能为空！'
            },{
                attribute:  'serviceReportCycle', // 服务报告提交周期
                errorMeassge:'主表服务报告提交周期不能为空！'
            },{
                attribute:  'serviceListRequire', // 服务单要求
                errorMeassge:'主表服务单要求不能为空！'
            },{
                attribute:  'otherPromise', //其他重要承诺及要求
                errorMeassge:'主表其他重要承诺及要求不能为空！'
            }
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
    submission= async ()=>{
        if(this.props.config.formRead == 2) {
            this.props.submission(true)
            return false
        }
        let {paramsObj,schedule} = this.state,AssistantPonse,MasterPonse;
        //服务区域附表提交接口
        // if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('serviceArea') > -1 && this.props.config.formControl.serviceArea.isEdit){
        //     const {datasources} = this.state;
        //     if(!datasources.info || !datasources.info.state) {
        //         message.error(!datasources.info ? '请填写服务区域附表！': datasources.info.message)
        //         return false;
        //     }
        //     AssistantPonse = await PostaddAssistant(datasources.dataSource)
        // }

        //所有附表数据验证提交
        for(var i in schedule){
            // console.log(schedule)
             if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf(i) > -1 && this.props.config.formControl[i].isEdit){
                // console.log(i)
                if(!schedule[i].info || !schedule[i].info.state) {
                    message.error(!schedule[i].info ? `请填写${schedule[i].area}附表！`: schedule[i].info.message)
                    return false;
                }
                let schedulePost = await schedule[i].post(schedule[i].dataSource)
                if(schedulePost.success != 1){
                    message.error(schedulePost.message)
                    return false;
                }
              }
        }
        //主表提交接口
         if (!this.props.config.formControl || (this.props.config.formControl.masterList.nodes && [2,3].indexOf(this.props.config.formControl.masterList.nodes)) || (this.props.config.formControl.masterList.isEdit)) {
            if (!this.vildteMasterList()) {
                // message.error('主表信息填写不完整，请检查！(基本区域和服务承诺为必填项)')
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
        if(this.props.submission) this.props.submission(true);
        return true;       
    }
    //接受附表验证信息函数
    getChildrenVildter = (data,type) => {
        const {schedule} = this.state;
        schedule[type] = {...schedule[type],...data}
    }
    //验证主表信息是否填写完整
    vildteMasterList = () => {
        //主表基本填写信息验证
        let slaNum = 0,{paramsObj,masterVildter} = this.state;
        for(var i of masterVildter){
            console.log(i,paramsObj)
            if((i.attribute == 'notCollectReason' && paramsObj['isCollectConfig'] == 1) || (i.attribute == 'leagueBuildName' && paramsObj['isLeagueBuild'] == 0) || (i.attribute == 'finalCustName' && paramsObj['isSubcontract'] == 0) || (i.attribute == 'managerName' && paramsObj['managerType'] == 1) || ((i.attribute == 'renewalName' || i.attribute == 'renewalNumber') && paramsObj['isRenewal'] == 0 )){
                continue;
            }
            if(!(paramsObj[i.attribute]+'')){
                console.log(i.attribute,paramsObj[i.attribute])
                message.error(i.errorMeassge);
                return false;
            }
        }
        //主表SLA等级信息验证
        for(var j of paramsObj['slaList']){
            if((j.engineerArriveTime +'') && (j.respondTime +'') && (j.solveTime +'') && (j.spareArriveTime +'')){
                slaNum++;
            }
        }
        if(slaNum < 1){
            message.error('请保证主表服务承诺SLA等级有一条数据填写完整再进行提交！');
            return false;
        }
        return true;
    }
    render = _ => {
        let {datasources,paramsObj} = this.state;
        const schedule = (this.props.config.formControl &&  this.props.config.formControl.action.indexOf('serviceArea') > -1) ? true : false;
        const macroRiskList = (this.props.config.formControl &&  this.props.config.formControl.action.indexOf('macroRisk') > -1) ? true : false;
        const macroRiskSummary = (this.props.config.formControl &&  this.props.config.formControl.action.indexOf('macroRiskSummary') > -1) ? true : false;
        const microRisk = (this.props.config.formControl &&  this.props.config.formControl.action.indexOf('microRisk') > -1) ? true : false;
        const microRiskSummary = (this.props.config.formControl &&  this.props.config.formControl.action.indexOf('microRiskSummary') > -1) ? true : false;
        console.log(this.props.config);
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
                       (paramsObj.serviceType && schedule) ? 
                        <TabPane tab="服务区域" key="1">
                            {/* 附表--组件  */}
                           <ServiceArea onChange={(data) => this.getChildrenVildter(data,'serviceArea')} type={this.state.paramsObj.serviceType} power={this.props.config}></ServiceArea>
                        </TabPane>
                     : null
                    }
                    {
                       macroRiskList ? 
                        <TabPane tab="宏观风险" key="2">
                            {/* 附表--组件  */}
                           <MacroRiskList onChange={(data) => this.getChildrenVildter(data,'macroRisk')} power={this.props.config}></MacroRiskList>
                        </TabPane>
                     : null
                    }
                    {
                       macroRiskSummary ? 
                        <TabPane tab="宏观风险汇总" key="3">
                            {/* 附表--组件  */}
                           <MacroRiskSummary onChange={(data) => this.getChildrenVildter(data,3)} power={this.props.config}></MacroRiskSummary>
                        </TabPane>
                     : null
                    }
                    {
                       microRisk ? 
                        <TabPane tab="微观风险" key="4">
                            {/* 附表--组件  */}
                           <MicroRisk onChange={(data) => this.getChildrenVildter(data,'microRisk')} power={this.props.config}></MicroRisk>
                        </TabPane>
                     : null
                    }
                    {
                       microRiskSummary ? 
                        <TabPane tab="微观风险汇总" key="5">
                            {/* 附表--组件  */}
                           <microRiskSummary onChange={(data) => this.getChildrenVildter(data,'microRiskSummary')} power={this.props.config}></microRiskSummary>
                        </TabPane>
                     : null
                    }
                </Tabs>
            </div>
        )
    }
}
export default Sqt;
