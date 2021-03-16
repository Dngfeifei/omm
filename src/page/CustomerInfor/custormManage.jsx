/***
 *  基础信息--客户信息管理
 * @auth jxl
*/

import React, { Component } from "react";
import { hashHistory } from 'react-router'
import { Form, Input, Button, Modal, message, Select, Tooltip, Table, Row, Col, } from 'antd'
const { Option } = Select;

import { connect } from 'react-redux'
import { ADD_PANE} from '/redux/action'



// 引入页面CSS
import '@/assets/less/pages/logBookTable.css'
// 分页组件
import Pagination from "@/components/pagination/index"

// 引入 API接口
import { customerLevel , getBiCustomer , biCustomerInfo , biCustomerUpdate} from '/api/customerInfor'

@connect(state => ({
    panes: state.global.panes,
}), dispath => ({
    add(pane) { dispath({type: ADD_PANE, data: pane})},
}))



class Customer extends Component{
    constructor(props) {
        super(props)

        this.state = {
            //设置表格的高度
            h: { y: 240 },
            // 客户级别--数据集合
            rankArray:[],
            rules: [{
                label: '客户编码',
                key: 'custNum',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入客户编码" />
            },{
                label: '客户名称',
                key: 'custName',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入客户名称" />
            },{
                label: '客户级别',
                key: 'custLevel',
                render: _ => <Select style={{ width: 200 }} placeholder="请选择客户级别" allowClear={true}>
                    {
                        this.state.rankArray.map((items, index) => {
                            return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                        })
                    }
                </Select>
            }],
            // 表格数据
            tabledata: [],
            // 表格列数据
            columns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '客户编码',
                dataIndex: 'custNum',
                ellipsis: {
                    showTitle: false,
                },
                width: '240px',
                render: (text, record)=> 
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer',display:'block',textAlign:'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            },{
                title: '客户名称',
                dataIndex: 'custName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '客户级别',
                dataIndex: 'custLevel',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => text == '1' ? '一级' : text == '2' ? '二级' : text == '3' ? '三级' : 'VIP客户'
            }],
            total: 0, // 分页器组件 总条数
            // 此属性是适用于 表格的分页数据
            pageSize: 10,
            current: 0,
            // 此对象只是适用于分页查询
            pagination: {
                limit: 10,
                offset: 1
            },
            loading: false,  //表格加载太

            visible: false,  // 对话框的状态
            titleMap: {
                add: '新增客户信息',
                edit: '修改客户信息'
            },
            visibleStatus: 'add',
            selectedRowKeys:null,
            newGroup:{
                custNum:'',
                custName:'',
                custLevel:''
            }
        }
    }

    // 组件将要挂载完成后触发的函数
    componentDidMount() {

        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)

        this.init();
        // 获取客户列表（分页)
        this.getTableList();
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            console.log(this.tableDom.offsetHeight);
            let h = this.tableDom.clientHeight - 125;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 初始化数据
    init = () => {
        // 获取客户级别--数据
        customerLevel({dictCode:'customerLevel'}).then(res=>{
            if (res.success == 1) {
                this.setState({
                    rankArray:res.data
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })

        
    }

    // 获取客户列表（分页)
    getTableList = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.setState({ loading: true })
            var values = {
                ...fieldsValue,
            };
            let newSearchForm = {
                custNum: values.custNum, // 客户编号
                custName: values.custName,    // 客户名称
                custLevel: values.custLevel // 客户等级
            }

            getBiCustomer(this.state.pageSize,this.state.current, newSearchForm).then(res => {
                if (res.success == 1) {
                    this.setState({
                        loading: false,
                        tabledata: res.data.records,
                        total: parseInt(res.data.total)
                    })
                } else if (res.success == 0) {
                    message.error(res.message);
                }
            })
        })
    }

    // 获取客户信息详情
    getCustInfor=(Id)=>{
        biCustomerInfo(Id).then(res=>{
            if (res.success == 1) {
                /**   将客户等级id换成中文   **/
                let newCustLevel = res.data.custLevel;
                // 任务类型下拉列表数据
                let objCenter = this.state.rankArray; 
                for (var i = 0; i < objCenter.length; i++) {
                    if (newCustLevel.indexOf(objCenter[i].itemValue) >= 0) {
                        newCustLevel = objCenter[i].itemCode;
                    }
                }
                let newGroup = Object.assign({}, this.state.newGroup, { custNum: res.data.custNum, custName:res.data.custName, custLevel:newCustLevel})

                this.setState({
                    newGroup: newGroup
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })
    }



    
    // 查询条件--事件
    onSearch = (e) => {
        e.preventDefault();
        // 获取客户列表（分页)
        this.getTableList();
    }

    //清空高级搜索
    clearSearchprops = () => {
        this.props.form.resetFields();
    }

    // 点击表格中某客户编码进行客户信息页面
    previewing=(record)=>{
        let pane = {
            title: record.custName+'客户档案',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'CustomerInfor/customerInformation.jsx',
            params:{
                id:record.id
            }
        }
        this.props.add(pane)


    }

    // 修改事件按钮----弹出对话框
    handleEdit=()=>{
        if (this.state.selectedRowKeys) {
            var key = this.state.selectedRowKeys[0];
            this.setState({
                visible: true,
                visibleStatus:'edit'
            });
            // 调用---查询客户信息详情接口
            this.getCustInfor(key);
        }else {
            message.warning('请先选择一条客户信息！')
        }
       
    }

    //获取新增或修改后的客户级别
    handleChange = (value) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custLevel: value })
        this.setState({
            newGroup: newGroup
        })
    }
    //获取新增或修改后的客户名称
    getdictName = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custName: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //获取新增或修改后的客户编码
    getdictCode = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custNum: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }


    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            pagination: data
        }, () => {
            // 获取客户列表（分页)
            this.getTableList();
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: 1, limit: pageSize })

        this.setState({
            current: 0,
            pageSize: pageSize,
            pagination: data
        }, () => {
            // 获取客户列表（分页)
            this.getTableList();
        })


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

    // 单选框按钮---选中事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys: selectedRowKeys
        });
    }

    // 对话框---确认
    handleOk = e => {
       
        var params = this.state.newGroup;
        // 校验数据 不能为空 空：提示名称为空不能保存
        if (params.custName == "" || params.custName == null) {
            message.destroy()
            message.warning('客户名称不能为空!');
            return false
        }
        if (params.custNum == "" || params.custNum == null) {
            message.destroy()
            message.warning('客户编码不能为空!');
            return false
        }
        if (params.custLevel == "" || params.custLevel == null) {
            message.destroy()
            message.warning('客户级别不能为空!');
            return false
        }

        // 判断保存类型是新增还是修改
        if(this.state.visibleStatus == 'add'){
           
           


        }else if(this.state.visibleStatus == 'edit'){
            let _this = this
            let params = {
                custLevel:_this.state.newGroup.custLevel,
                id: _this.state.selectedRowKeys[0] 
            }
            
            biCustomerUpdate(params).then(res=>{
                if (res.success == 1) {
                    message.success(res.message)
                    this.setState({
                        visible: false,
                    });
                    // 获取客户列表（分页)
                    this.getTableList();

                }else if(res.success == 0){
                    message.error(res.message)
                }
            })

        }

        

    };

    // 关闭--详情---对话框
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };


    render = _ => {
        const { getFieldDecorator } = this.props.form;

        const { h , selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio'
        };

        // 节点渲染区域
        return (
            <div className="engineerContent main_height" id="engineerContent" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                    {this.state.rules.map((val, index) =>
                        <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {getFieldDecorator(val.key, val.option)(val.render())}
                        </Form.Item>)}
                    <Form.Item>
                        <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                    </Form.Item>
                    <Form.Item style={{ position: 'absolute', right: '20px' }}>
                        <Button onClick={this.handleEdit}>修改</Button>
                    </Form.Item>
                </Form>

                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        bordered
                        rowKey={record => record.id} //在Table组件中加入这行代码
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

                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>

                {/* 新增/编辑---客户信息对话框 */}
                <Modal title={this.state.titleMap[this.state.visibleStatus]} visible={this.state.visible} onCancel={this.handleCancel} onOk={this.handleOk} width='25%' id="modalengineer">
                   <Row>
                        <label style={{display:'block',marginBottom:'16px'}}>
                            <span className={this.state.visibleStatus == 'add' ? "ant-form-item-required" : ''} style={{ display: "inline-block", textAlign: "right" }}>客户级别：</span>
                            <Select style={{ width: 300 }} placeholder="请选择客户级别" allowClear={true} onChange={this.handleChange} value={this.state.newGroup.custLevel}>
                                {
                                    this.state.rankArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                                    })
                                }
                            </Select>
                        </label>
                        <label style={{display:'block',marginBottom:'16px'}}>
                            <span className={this.state.visibleStatus == 'add' ? "ant-form-item-required" : ''} style={{ display: "inline-block", textAlign: "right" }}>客户编码：</span>
                            <Input placeholder="请选择客户编码" value={this.state.newGroup.custNum} onChange={this.getdictCode} allowClear={true} style={{ width: "300px" }} disabled={this.state.visibleStatus == 'add' ? false : true} />
                        </label>
                        <label style={{display:'block',marginBottom:'16px'}}>
                            <span className={this.state.visibleStatus == 'add' ? "ant-form-item-required" : ''} style={{display: "inline-block", textAlign: "right" }}>客户名称：</span>
                            <Input placeholder="请选择客户名称" value={this.state.newGroup.custName} onChange={this.getdictName} allowClear={true} style={{ width: "300px" }} disabled={this.state.visibleStatus == 'add' ? false : true} />
                        </label>
                   </Row>
                </Modal>
            </div>
        )
    }



}

const CustormManage = Form.create()(Customer)
export default CustormManage;