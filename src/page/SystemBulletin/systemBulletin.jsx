/***
 * 系统管理----系统公告
 * @author jxl
 */

import React, { Component } from 'react'
import { Button, Input, Form, Table, Tooltip, Tag, Modal, message  } from 'antd'



// 引入页面CSS
import '@/assets/less/pages/bulletin.css'
// 分页组件
import Pagination from "@/components/pagination/index"
// 引入 API接口
import { } from '/api/systemBulletin'



class systemBulletin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //设置表格的高度
            h: { y: 240 },  
            // Form表单查询
            rules: [{
                label: '标题',
                key: 'title',
                render: _ => <Input style={{ width: 340 }} placeholder="请输入公告标题查询" />
            }],
            // 表格数据
            tabledata: [{
                id: '1',
                dataTime: '2021-02-01 10:23:33',
                object: '交付工程师',
                status: '1',
                publisher: '季寒徳',
                title: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            },
            {
                id: '2',
                dataTime: '2021-02-01 14:23:33',
                object: '全体',
                status: '0',
                publisher: '李洪刚',
                title: 'London No. 1 Lake Park',
                tags: ['loser'],
            },
            {
                id: '3',
                dataTime: '2021-02-01 10:03:33',
                object: '技术支持部',
                status: '1',
                publisher: '吴成根',
                title: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            }], 
            // 表格列数据
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
                title: '标题',
                dataIndex: 'title',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}><span style={{color:'#1890ff',cursor:'pointer'}} onClick={this.previewing}>{text}</span></Tooltip>
            }, {
                title: '类别',
                dataIndex: 'tags',
                ellipsis: {
                    showTitle: false,
                },
                render: tags => (
                    <span>
                        {tags.map(tag => (
                            <Tag color="blue" key={tag}>
                                {tag}
                            </Tag>
                        ))}
                    </span>
                )
            }, {
                title: '公告对象',
                dataIndex: 'object',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '发布状态',
                dataIndex: 'status',
                ellipsis: {
                    showTitle: false,
                },
                render: t => t == '1' ? '发布' : t == '0' ? '草稿' : '作废',  // 0-草稿 1-发布 2-作废
            }, {
                title: '发布时间',
                dataIndex: 'dataTime',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '发布人',
                dataIndex: 'publisher',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }
            ],
            selectedRowKeys: null,  //选中的table表格的id
            total:0, // 分页器组件 总条数
            // 此属性是适用于 表格的分页数据
            pageSize:10,
            current:0,
            // 此对象只是适用于分页查询
            pagination:{
                limit:10,
                offset:1
            },
            loading:false,  //表格加载太
            visible: false,    // 对话框状态
            titleMap:{
                add:'新增公告信息',
                edit:'修改公告信息',
                previewing:'阅览公告信息'
            },
            visibleStatus:'add',
        }
    }

    // 组件将要挂载完成后触发的函数
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)

    }

    // 初始化数据
    init=()=>{

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
            let h = this.tableDom.clientHeight - 100;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 查询条件--事件
    onSearch = () => {


    }

    // 单选框按钮---选中事件
    onSelectChange=(selectedRowKeys)=>{
        this.setState({ 
            selectedRowKeys:selectedRowKeys 
        });
    }

    // 选中行时就选中单选框按钮
    onClickRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id]
                this.setState({
                    selectedRowKeys: selectedKeys
                });
            },
        };
    }

    // 点击表格标题，打开预览模式
    previewing=()=>{
        // 对话框打开
        this.setState({
            visible: true,
            visibleStatus:'previewing'
        })
    }
    

    // 新增按钮--事件
    handleAdd=()=>{
        // 对话框打开
        this.setState({
            visible: true,
            visibleStatus:'add'
        })
    }


    // 编辑按钮--事件
    handleEdit=()=>{
        if (this.state.selectedRowKeys) {
            var ID = this.state.selectedRowKeys[0];
            this.setState({
                visible: true,
                visibleStatus:'edit'
            })
        }else {
            message.warning('请先选择一条公告信息！')
        }
    }



    // 删除按钮--事件
    handlerDelete=()=>{
        var _this = this
        if (this.state.selectedRowKeys) {
            confirm({
                title: '删除',
                content: '您确定删除此公告信息？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    var ID = _this.state.selectedRowKeys[0]
                   
                },
                onCancel() {
                    message.info('取消删除！');
                },
            });
        } else {
            message.warning('请先选择一条公告信息！')
        }
    }

    // 打开--详情---对话框
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    // 关闭--详情---对话框
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            pagination: data
        }, () => {
            // 调用接口
            this.init()
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: 1,limit: pageSize })
        
        this.setState({
            current: 0,
            pageSize: pageSize ,
            pagination:data
        },()=>{
            // 调用接口
            this.init()
        })

       
    }




    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys, h } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };


        return (
            <div className="bulletinContent"  style={{display:'flex',flexDirection:'column',flexWrap:'nowrap'}}>
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
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)}  onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>


                {/* 详情页--对话框 底部内容，当不需要默认底部按钮时，可以设为 footer={null} */}
                <Modal title={this.state.titleMap[this.state.visibleStatus]} visible={this.state.visible} onCancel={this.handleCancel}>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}
const BulletinForm = Form.create()(systemBulletin)
export default BulletinForm;