import React, { Component } from 'react'
import { connect } from "react-redux";

import { Button, Input, Form, Table, Tooltip, Tag, message, Modal,Icon  } from 'antd'


import { GetSysNotice } from '/api/systemBulletin'
// 分页组件
import Pagination from "@/components/pagination/index"

import CardInfo from "./noticeInfo";

class NoticeMore extends Component {
    async componentWillMount() {
        this.init()
    }
    // 组件将要挂载完成后触发的函数
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)

    }
    state = {
        //设置表格的高度
        h: { y: 440 },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        finish: false,
        loading: false,
        data: [],
        // 控制当前页面的显示/隐藏--状态
        isShow: true,
        // 控制当前页面的刷新(加载)--状态
        loading: false,
        // 公告详情页弹窗显示/隐藏--状态
        visible: false,
        modolInfo: {},
        // 表格列数据
        columns: [{
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: '60px',
            // 第一种：每一页都从1开始
            render: (text, record, index) => `${index + 1}`
            // }
        },
        {
            title: '标题',
            dataIndex: 'noticeTitle',
            width: 300,
            ellipsis: {
                showTitle: false,
            },
            render: (text, row) => {
                let style = {}
                style = row.isTop == 1 ? { color: '#1890ff', cursor: 'pointer', fontWeight: "bold" } : { color: '#1890ff', cursor: 'pointer' }
                return <span style={style} onClick={_ => this.showDetails(row)}>{text}
                    {row.noticeFiles.length ? <Icon type="paper-clip" style={{ marginLeft: "5px" }} /> : ""}
                </span>
            }
        }, {
            title: '关键字',
            dataIndex: 'noticeType',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: tags => (
                <span>
                    {tags.split(",").map((tag, i) => (
                        tag != "" ? <Tag color="blue" key={i}>
                            {tag}
                        </Tag> : ""

                    ))}
                </span>
            )
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            width: 120,
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            // render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '发布人',
            dataIndex: 'publishUserName',
            width: 80,
            align: 'center',
        },
            //{
            //     title: '是否置顶',
            //     dataIndex: 'isTop',
            //     width: 80,
            //     align: 'center',
            //     render: t => t == '1' ? '是' : '否',  // 0-是 1-否 
            // }, 
        ],
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            console.log(this.tableDom.offsetHeight);
            let h = this.tableDom.clientHeight - 10;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }


    // 初始化数据
    init = () => {
        this.gettableData(0)
    }
    // 获取列表数据
    gettableData = (obj = 1) => {
        let params = {
            status: 1,
            limit: this.state.pagination.pageSize,
            offset: obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0,
        }
        params = Object.assign({}, params)
        GetSysNotice(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total,
                })
                console.log(res.data.records, 2)
                this.setState({ data: res.data.records, pagination: pagination })
            }
        })
    }
    // 用于修改卡片的显示/隐藏
    change = () => {
        this.setState({
            isShow: false
        })
    }


    // 用于修改卡片的加载态
    refresh = () => {
        this.setState({
            loading: true
        })
        const timeoutID = setTimeout(() => {
            //执行
            this.setState({
                loading: false
            })
            //清除
            clearTimeout(timeoutID);
        }, 1000)

    }
    // 公告详情页展示方法
    showDetails = (item) => {
        this.setState({
            modolInfo: item,
            visible: true
        })
    }
    // 公告详情弹窗页关闭方法
    closeDetails = (item) => {
        this.setState({
            modolInfo: {},
            visible: false
        })
    }

    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { current: current });
        this.setState({
            pagination,
            selectedKeys: [],
            selectedInfo: [],
        }, _ => {
            this.gettableData()
        })
    }

    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { pageSize: pageSize });
        this.setState({
            pagination,
            selectedKeys: [],
            selectedInfo: [],
        }, _ => {
            this.gettableData()
        })
    }
    render() {
        const { h } = this.state;
        return (
            <div className="bulletinContent" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: "100%" }}>

                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        bordered
                        rowKey={"id"}
                        dataSource={this.state.data}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                </div>
                {!this.state.visible ? "" : <CardInfo onCancel={this.closeDetails} data={this.state.modolInfo} />}
            </div>
        );
    }

}

export default NoticeMore;