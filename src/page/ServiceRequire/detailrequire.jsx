/***
 * 信息管理---详情页服务需求表
 * @author wxy
 */


import React, { Component } from 'react'
import { Button, message, Spin } from 'antd';
const creatHistory = require("history").createHashHistory;
const history = creatHistory();//返回上一页这段代码

import { connect } from 'react-redux'
import { REMOVE_PANE, ADD_PANE, SET_WORKLIST } from '/redux/action'

// 引入服务需求表工单组件
import SQT from '@/components/workorder/SQT/SQT_1.jsx'
// import SQT from '@/components/workorder/SQT/microrisk/microrisk.jsx'
// import SQT from '@/components/workorder/SQT/microrisk/microriskSummary.jsx'


@connect(state => ({
    panes: state.global.panes,
    activeKey: state.global.activeKey,
    resetwork: state.global.resetwork,
}), dispath => ({
    remove(key) { dispath({ type: REMOVE_PANE, key }) },
    add(pane) { dispath({ type: ADD_PANE, data: pane }) },
    setWorklist(data) { dispath({ type: SET_WORKLIST, data }) },
}))



class RequireSqt extends Component {
    // 设置默认props
    static defaultProps = {

    }
    // 组件将要挂载前触发的函数
    async componentWillMount() {
        // this.init();
    }
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
            spin: true,
            flowType: ""
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ spin: false })
        }, 1000);
    }

    render = _ => {
        // 流程类型 YY:预约服务，HG:宏观风险，WG:微观风险 多个用逗号隔开，YY，HG，WG


        let types = this.props.params.dataType.flowType
        let arrOne = ['macroRisk', 'macroRiskSummary'], arrTwo = ['microRisk', 'microRiskSummary'], arrThree = ['reservationService', 'reservationServiceSummary']
        arrOne = types.indexOf('HG') > -1 ? arrOne : []
        arrTwo = types.indexOf('WG') > -1 ? arrTwo : []
        arrThree = types.indexOf('YY') > -1 ? arrThree : []

        console.log(types.indexOf('HG'))
        console.log(types.indexOf('WG'))
        console.log(types.indexOf('YY'))
        let params = {
            formRead: 2,
            id: this.props.params.dataType.id,
            formControl: {
                action: ['masterList', 'serviceArea', ...arrOne, ...arrTwo, ...arrThree],
                masterList: { isEdit: false },
                serviceArea: { isEdit: false, contactIsEdit: false, objectIsEdit: false, memberIsEdit: false },
                microRisk: { isEdit: false },
                microRiskSummary: { isEdit: false },
                macroRisk: { isEdit: false },
                macroRiskSummary: { isEdit: false },
                reservationService: { isEdit: false },
                reservationServiceSummary: { isEdit: false }
            }, sign: 1
        }

        return (

            <div className="service" style={{ height: '100%', padding: '0 15px', overflow: 'hidden' }}>
                <Spin size="large" spinning={this.state.spin}>
                    <SQT ref="getSwordButton" config={params}></SQT>
                </Spin>
            </div>

        )
    }
}

export default RequireSqt;