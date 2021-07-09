/***
 * 系统管理----系统公告
 * @author jxl
 */

import React, { Component } from 'react'

import { Button, Input, Form, Table, Tooltip, Tag, message, Modal, Icon } from 'antd'
const { confirm } = Modal;

// 引入页面CSS
import '@/assets/less/pages/bulletin.css'
// 分页组件
import Pagination from "@/components/pagination/index"
// 引入 API接口
import { GetSysNotice, DelSysNotice } from '/api/systemBulletin'

// 引入专业能力组件
import Notice from './notice.jsx'


class systemBulletin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //设置表格的高度
            h: { y: 440 },
            // Form表单查询
            rules: [{
                label: '标题',
                key: 'noticeTitle',
                render: _ => <Input allowClear style={{ width: 340 }} placeholder="请输入公告标题查询" />
            }],
            // 表格数据
            tableData: [],
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
                    return <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={_ => this.previewing(row)}>{text}
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
            }, {
                title: '发布状态',
                dataIndex: 'status',
                width: 80,
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: t => t == '1' ? '发布' : '草稿',  // 0-草稿 1-发布 
            }, {
                title: '是否置顶',
                dataIndex: 'isTop',
                width: 80,
                align: 'center',
                render: t => t == '1' ? '是' : '否',  // 0-是 1-否 
            }, {
                title: '发布时间',
                dataIndex: 'publishTime',
                width: 120,
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                // render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }
            ],
            selectedKeys: [],  //选中的table表格的id
            selectedInfo: [],  //选中的table表格的数据
            viewItem: null,
            // 分页配置
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
            loading: false,  //表格加载太
            visible: false,
            visibleStatus: 'add',
        }
    }
    //组件挂载前
    componentWillMount() {
        // 页面数据初始化
        this.init()
    }
    // 组件将要挂载完成后触发的函数
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)

    }
    // 初始化数据
    init = () => {
        this.gettableData(0)
    }
    // 获取列表数据
    gettableData = (obj = 1) => {
        let params = {
            limit: this.state.pagination.pageSize,
            offset: obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0,
        }
        params = Object.assign({}, params, this.getFormData())
        GetSysNotice(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total,
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
            }
        })
    }
    //获取表单数据
    getFormData = _ => {
        let params;
        this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 获取合并后的表单数据
                params = Object.assign({}, val)
            }
        })
        return params;
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

    // 查询条件--事件
    onSearch = () => {
        this.gettableData(0)
    }

    // 单选框按钮---选中事件
    onSelectChange = (selectedKeys, selectedInfo) => {
        this.setState({
            selectedKeys,
            selectedInfo
        });
    }

    // 选中行时就选中单选框按钮
    onClickRow = (record, b) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id]
                this.setState({
                    selectedKeys
                });
            },
        };
    }

    // 新增按钮--事件
    handleAdd = () => {
        // 对话框打开
        this.setState({
            visible: true,
            visibleStatus: 'add'
        })
    }
    // 编辑按钮--事件
    handleEdit = () => {
        if (this.state.selectedKeys.length) {
            let key = this.state.selectedKeys[0]
            let selectedInfo = this.state.tableData.filter((item) => {
                return item.id == key
            })
            this.setState({
                selectedInfo,
                viewItem: selectedInfo[0],
                visible: true,
                visibleStatus: 'edit'
            })
        } else {
            message.destroy()
            message.warning('请先选择一条公告信息！')
        }
    }
    // 删除按钮--事件
    handlerDelete = () => {
        var _this = this
        if (this.state.selectedKeys.length) {
            confirm({
                title: '删除',
                content: '您确定删除此公告信息？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    var ID = _this.state.selectedKeys[0]
                    DelSysNotice(ID).then(res => {
                        if (res.success != 1) {
                            message.destroy()
                            message.error(res.message)
                        } else {
                            _this.setState({
                                selectedKeys: [],
                                selectedInfo: []
                            })
                            _this.gettableData()
                        }
                    })
                },
                // onCancel() {
                //     message.info('取消删除！');
                // },
            });
        } else {
            message.destroy()
            message.warning('请先选择一条公告信息！')
        }
    }
    // 点击表格标题，打开预览模式
    previewing = (info) => {
        // 对话框打开
        this.setState({
            viewItem: info,
            visible: true,
            visibleStatus: 'previewing'
        })
    }
    // 对话框确认
    handleOk = () => {
        this.handleCancel()
        this.gettableData()
    };
    // 对话框关闭
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

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
    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const { selectedKeys, h } = this.state;
        const rowSelection = {
            selectedRowKeys: selectedKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };


        return (
            <div className="bulletinContent" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: "100%" }}>
                <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                    {this.state.rules.map((val, index) =>
                        <Form.Item
                            label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {getFieldDecorator(val.key, val.option)(val.render())}
                        </Form.Item>)}
                    <Form.Item>
                        <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                    </Form.Item>
                    <Form.Item style={{ position: 'absolute', right: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={this.handlerDelete}>删除</Button>
                        <Button style={{ marginRight: '10px' }} onClick={this.handleEdit}>编辑</Button>
                        <Button type="primary" onClick={this.handleAdd}>新增</Button>
                    </Form.Item>
                </Form>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        bordered
                        rowKey={"id"}
                        onRow={this.onClickRow}
                        rowSelection={rowSelection}
                        dataSource={this.state.tableData}
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
                {/* 详情页--对话框 */}
                {!this.state.visible ? "" : <Notice type={this.state.visibleStatus} data={this.state.viewItem} onOk={this.handleOk} onCancel={this.handleCancel}></Notice>}
            </div>
        )
    }
}
const BulletinForm = Form.create()(systemBulletin)
export default BulletinForm;