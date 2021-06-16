/***
 *  工程师自评统计报表
 * @auth wangxinyue
*/


import React, { Component } from 'react'
import { Modal, message, Button, Row, Col, Form, Input, Select, Table, DatePicker, TimePicker, Tooltip } from 'antd'
import moment from 'moment';

// 分页组件
import Pagination from "@/components/pagination/index";



// 引入 API接口
import { getReport, getAssessmentReport } from '/api/selfEvaluationReport'

// 引入页面CSS
// import '/assets/less/pages/logBookTable.css'

// 文件下载ip地址
let urlPrefix = ""

class AssessmentReport extends Component {

    // 挂载完成
    componentWillMount = () => {
        this.init();

        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)
    }


    state = {
        h: { y: 240 },  //设置表格的高度
        visible: false,  // 对话框的状态
        pageSize: 10,
        current: 0,
        total: 0,  //表格分页---设置显示一共几条数据
        pagination: {
            limit: 10,
            offset: 1,
        },
        loading: false,  //表格加载太
        columns: [{
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: '80px',
            // 第一种：每一页都从1开始
            render: (text, record, index) => `${index + 1}`
            // }
        },
        {
            title: '报表名称',
            dataIndex: 'fileName',
            align: 'center',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        }, {
            title: '生成时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        }, {
            title: '操作',
            dataIndex: 'fileUri',
            align: 'center',
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            render: (fileUri, record) => <a href={urlPrefix + fileUri + "?filename=" + record.fileName}>下载</a>
        }
        ],
        tabledata: [],
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 125;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 初始化接口
    init = () => {
        getReport(this.state.pagination).then(res => {
            if (res.success == 1) {
                this.setState({ loading: false })
                urlPrefix = res.data.urlPrefix,
                    this.setState({
                        tabledata: res.data.page.records,
                        total: parseInt(res.data.page.total)
                    })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }


    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: (page - 1) * pageSize })

        this.setState({
            pagination: data
        }, () => {
            // 调用接口
            this.init()
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: 0, limit: pageSize })
        this.setState({
            pagination: data
        }, () => {
            // 调用接口
            this.init()
        })
    }
    // 导出工程师技能评价报告
    downFile = () => {
        let currentDay = moment().format('YYYYMMDD');
        let fileName = "工程师技能评价报告_" + currentDay + ".xlsx"
        const hide = message.loading('报表数据正在检索中,请耐心等待。。。', 0);
        getAssessmentReport().then(res => {
            if (res.success == 1) {
                message.destroy()
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = res.data + "?filename=" + fileName;
                a.click();
                document.body.removeChild(a);
            } else if (res.success == 0) {
                message.destroy()
                message.error(res.message);

            }
        })
    }

    render = _ => {
        const { h } = this.state;
        return (
            <div className="main_height" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', paddingTop: "20px" }}>
                <div>
                    <Button type="primary" onClick={this.downFile} style={{ float: "right", marginRight: "30px" }}>导出</Button>
                </div>
                <p style={{ paddingLeft: "20px", paddingBottom: "10px", fontSize: "16px", borderBottom: "1px solid #e8e8e8" }}>工程师自评统计日报</p>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        rowKey="id"
                        className="jxlTable"
                        bordered
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>

            </div>
        )
    }

}
export default AssessmentReport



