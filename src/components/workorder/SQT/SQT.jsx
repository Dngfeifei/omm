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
import { SqtBaseDetail, } from '/api/serviceMain.js'
import  ServiceArea from './serviceArea/serviceArea'


class Sqt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabsList:[{
                name:'主表信息'
            }],
            datasources:[],
            tabsListF:[],
            paramsObj:{
                
            }
        }
    }
    async componentWillMount () {
        
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


    childMethod=()=>{
        return this.state.paramsObj       
    }
    //接受附表验证信息函数
    getChildrenVildter = () => {

    }

    render = _ => {
        return (
            <div className="SqtContent">
                <Tabs defaultActiveKey="0" tabPosition={'top'} style={{ overflowY:'auto' }}>
                    {this.state.tabsList.map((item,index) => (
                        <TabPane tab={item.name} key={index}>
                            {/* 主表--组件  */}
                           <ServicesMain paramsObj={this.state.paramsObj} onChangeData={this.getChildrenData}></ServicesMain>
                        </TabPane>
                    ))}
                    {
                        this.state.tabsListF.map((item,index) => (
                            <TabPane tab={item.name} key={index}>
                                {/* 主表--组件  */}
                               <ServiceArea dataSource={this.state.datasources} onChange={this.getChildrenData} type="" power=""></ServiceArea>
                            </TabPane>
                        ))
                    }
                </Tabs>
            </div>
        )
    }
}
export default Sqt;
