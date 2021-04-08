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
            tabsListF:[],
            paramsObj:{
                
            }
        }
    }
    async componentWillMount () {
        this.init()
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


    // 页面初始化方法(回显数据)
    init = () => {
    //根据节点获取paramsObj
        if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('masterList') > -1){  //主表查询接口
            this.getSqtDetail(this.props.config.id)
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
            if (res.success == '1') {
                this.setState({
                    paramsObj:res.data
                })
            }else if (res.success == '0') {
                message.error(res.message)
            }
        })
    }



    // 定义方法,
    getChildrenData = (dat) => {
        this.setState({
            paramsObj:dat
        })
    }

//服务需求表提交验证接口
submission=async ()=>{
        let {paramsObj} = this.state,AssistantPonse,MasterPonse;
        if(!this.vildteMasterList()){
            message.error('主表信息填写不完整，请检查！')
            return false;
        }
        if(this.props.config.formControl &&  this.props.config.formControl.action.indexOf('serviceArea') > -1){//附表1查询接口
            for(let i = 0,len = this.state.datasources; i < len ; i++ ){
                if(datasources[i].error.state) {
                    message.error(res.message)
                    return false;
                }
            }
            AssistantPonse = await PostaddAssistant(this.state.datasources)
        }
        MasterPonse = await SqtBase(paramsObj)
        // if((MasterPonse.success == 1 && !AssistantPonse) || (MasterPonse.success == 1 &&  AssistantPonse.success == 1)){
        //     message.error('数据提交成功，并且执行工作流提交')
        // }else{
        //     message.error('数据信息提交失败，请联系管理员！')
        // }
        if(MasterPonse.success != 1){
            message.error(MasterPonse.message)
            return false;
        }
        if(AssistantPonse && AssistantPonse.success != 1){
            message.error(AssistantPonse.message)
            return false;
        }
        return this.state.paramsObj       
    }
    //接受附表验证信息函数
    getChildrenVildter = (data,index) => {
        let {datasources} = this.state;
        datasources[index] = {...datasources[index],...data.dataSource,...data.error};
    }
    //验证主表信息是否填写完整
    vildteMasterList = () => {
        let vilde = true,{paramsObj} = this.state;
        if(!paramsObj.orderNum){  //记录单号不能为空
            vilde = false;
        }
        return vilde;
    }
    render = _ => {
        let {datasources} = this.state;
        return (
            <div className="SqtContent">
                <Tabs defaultActiveKey="0" tabPosition={'top'} style={{ overflowY:'auto' }}>
                    {this.state.tabsList.map((item,index) => (
                        <TabPane tab={item.name} key={index}>
                            {/* 主表--组件  */}
                           <ServicesMain paramsObj={this.state.paramsObj} onChangeData={this.getChildrenData} power={this.props.config.formControl ? this.props.config.formControl : {}} ></ServicesMain>
                        </TabPane>
                    ))}
                    {
                        datasources.map((item,index) => (
                            <TabPane tab={item.name} key={index}>
                                {/* 附表--组件  */}
                               <ServiceArea dataSource={this.state.datasources[index]} onChange={(data) => this.getChildrenVildter(data,index)} type={this.state.paramsObj.serviceTypeName} power={this.props.config.formControl}></ServiceArea>
                            </TabPane>
                        ))
                    }
                </Tabs>
            </div>
        )
    }
}
export default Sqt;
