/**
 * 服务需求表----服务承诺
 * @author  jxl
 */


import React, { Component } from 'react'
import { Descriptions, Badge , Form , Input , Select , DatePicker } from 'antd'


const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 引入日期格式化
import moment from 'moment'
// 引入页面CSS
import '/assets/less/pages/performancePledge.less'


class performance extends Component {
    constructor(props) {
        super(props)

        this.state = {
            columns =[
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '年龄',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: '住址',
                    dataIndex: 'address',
                    key: 'address',
                },
            ],
        }
    }



    // 挂载完成
    componentDidMount = () => {
        this.init();
        


    }

    // 初始化接口
    init = () => {

    }


    render = _ => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="performanceContent">
                
                <div className="formContent">
                    <Descriptions bordered column={5}>
                        <Descriptions.Item label="服务方式">Cloud Database</Descriptions.Item>
                        <Descriptions.Item label="是否提交验收报告">Prepaid</Descriptions.Item>
                        <Descriptions.Item label="远程巡检周期">YES</Descriptions.Item>
                        <Descriptions.Item label="现场巡检周期">2018-04-24 18:00:00</Descriptions.Item>
                        <Descriptions.Item label="巡检特殊说明" span={2}>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="tableContent">

                </div>
            </div>
        )
    }
}


const PerformanceForm = Form.create()(performance)
export default PerformanceForm