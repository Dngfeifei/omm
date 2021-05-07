/**
 * 服务计划表--副表---宏观风险
 * @author yyp
*/
import React, { Component } from 'react'
import { Table, message } from 'antd';

// 引入页面CSS
import '@/assets/less/pages/servies.less'

// 引入 API接口
import { GetAppointment } from '/api/serviceMain.js'

let start = []
let lengths = []
class ReservationServiceSummary extends Component {
    // 设置默认props
    static defaultProps = {
        power: {
            id: "12",
        },
    }
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [
                // {
                //     area: "福建/厦门",
                //     isMainDutyArea: 1,
                //     serviceTime: "2021-02-08  10:49",
                //     userId: "realName",
                //     userName: "realName",
                //     mobilePhone: "mobilePhone",
                //     description: "remarks"
                // },
            ],
            // 表格配置项
            columns: [
                {
                    title: '服务区域',
                    dataIndex: 'area',
                    key: "area",
                    width: "17%",
                    align: 'center',
                    render: (value, row, index) => {
                        let title = row.isMainDutyArea ? '<span style="color:red">【主责区域】</span>' : ""
                        let content = <div dangerouslySetInnerHTML={{ __html: value + title }} ></div>
                        const obj = {
                            children: content,
                            props: {},
                        };
                        obj.props.rowSpan = 0;
                        start.forEach((item, i) => {
                            if (index == item) {
                                obj.props.rowSpan = lengths[i];
                            }
                        })
                        return obj
                    },
                },
                {
                    title: '预约上门服务时间',
                    dataIndex: 'serviceTime',
                    key: "serviceTime",
                    width: "17%",
                    align: 'center',
                    render: (value, row, index) => {
                        return value
                    },

                },
                {
                    title: '上门服务工程师',
                    dataIndex: 'userName',
                    key: "userName",
                    width: "17%",
                    align: 'center',
                    render: (value, row, index) => {
                        return value
                    },
                },
                {
                    title: '联系电话 ',
                    dataIndex: 'mobilePhone',
                    key: "mobilePhone",
                    width: "17%",
                    align: 'center',
                    render: (value, row, index) => {
                        return value
                    },
                },
                {
                    title: '备注',
                    dataIndex: 'description',
                    key: "description",
                    width: "32%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <div style={{ textAlign: "left" }}>{value}</div>
                    },
                },
            ],
        }
    }
    componentWillMount() {
        this.getAppointmentData()
    }
    // 请求预约服务数据
    getAppointmentData = () => {
        GetAppointment({ baseId: this.props.power.id }).then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.handleData(res.data)
            }
        })
    }
    // 对请求后的数据进行处理
    handleData = (data) => {
        let result = []
        start = []
        lengths = []
        let node = 0;
        data.forEach((item) => {
            start.push(node)
            node += item.list.length
            lengths.push(item.list.length)
            item.list.forEach((li) => {
                let obj = Object.assign({}, li, { area: item.area, isMainDutyArea: item.isMainDutyArea })
                result.push(obj)
            })
        })
        this.setState({
            dataSource: result
        })
    }
    render = _ => {
        let { dataSource, columns } = this.state
        return <div className="ServiesContent">
            <div className="commTop">
                <Table bordered
                    dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
            </div >
        </div >
    }
}
export default ReservationServiceSummary