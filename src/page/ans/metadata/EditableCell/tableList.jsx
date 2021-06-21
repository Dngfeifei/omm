import React from 'react';
import {Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm, Checkbox, Col} from 'antd';
const { confirm } = Modal;
import {FormOutlined} from '@ant-design/icons';
const FormItem = Form.Item;
const { Provider } = React.createContext()//组件之间传值
// 引入 API接口
import { addTable, deleteTable , updateTable, getColumnList } from '/api/metaData'
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'
import ColumnModal from "./columnModal.jsx";

  

class TableList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: '',
            data: [],
            count:0,
            formConfig: {},
            categoryId: null,   //参数类型ID
            columnList: [{key: 0, status: 1}],
            columnVisible: false,
            columnTitle: '',
            columns: [
                {
                    title: '元数据名称',
                    dataIndex: 'name',
                    align:'center',
                    width:'160px',
                },
                {
                    title: '库表名称',
                    dataIndex: 'tableName',
                    width:'160px',
                },
                {
                    title: '描述信息',
                    dataIndex: 'description',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width:'80px',
                    align: 'center',
                    render: t => t === 0 ? '禁用' : '启用',
                },
                {
                    title: '同步数据库',
                    dataIndex: 'syncData',
                    width:'100px',
                    align: 'center',
                    render: t => t === 0 ? '不同步' : '同步',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    width:'80px',
                    render: (t, r) => <FormOutlined style={{color: '#1890ff'}} onClick={_ => this.showColumn(r)} />
                },
            ],
            rules: [
                {
                    label: '元数据名称',
                    key: 'name',
                    option: {
                        rules: [
                            { required: true, message: "请输入" },
                        ]
                    },
                    render: _ => <Input />
                },
                {
                    label: '数据库表',
                    key: 'tableName',
                    option: {
                        rules: [
                            { required: true, message: "请输入" },
                        ]
                    },
                    render: _ => <Input />
                },
                {
                    label: '描述信息',
                    key: 'description',
                    option: {
                        rules: [
                            { required: true, message: "请输入" },
                        ],
                    },
                    render: _ => <Input />
                },
                {
                    label: '启用',
                    key: 'status',
                    option: {
                        valuePropName: 'checked',
                        initialValue: true
                    },
                    render: _ => <Checkbox value={1}></Checkbox>
                },
                {
                    label: '同步数据库',
                    key: 'syncData',
                    option: {
                        valuePropName: 'checked',
                        initialValue: true
                    },
                    render: _ => <Checkbox></Checkbox>
                }
            ],
        }
    }

    // 数据更新完成时触发的函数
    componentWillReceiveProps(nextProps) {
        // console.log(props,nextProps)
        if (this.props.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
                count: nextProps.data.length + 1,  
                categoryId: this.props.parentValueID  //参数类型ID
            })
        }
       
    }

    // table表格复选框---选中事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRows);
        this.setState({ 
            selectedRowKeys: selectedRowKeys
        });
    }

    // 删除
    handleDelete=()=>{
        var _this = this
        if (this.state.selectedRowKeys) {
            confirm({
                title: '删除',
                content: '您确定删除此元数据吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    var ID = _this.state.selectedRowKeys[0]
                    deleteTable({ id: ID }).then(res => {
                        if (res.code === 200) {
                            //  获取系统参数列表
                            _this.props.handleChange();
                             // 选中项已删除,存储的选中项数据置为空
                             _this.setState({
                                selectedRowKeys:null
                            })
                        } else if (res.success === 0) {
                            message.error(res.message);
                        }
                    })
                },
                onCancel() {
                    message.info('取消删除！');
                },
            });
        } else {
            message.warning('请先选择系统参数！')
        }
    }

    // 保存
    handleSave = _ => {
        let params = {}
        this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 获取合并后的表单数据
                params = Object.assign({}, val)
                params.status = params.status === undefined ? 1 : (params.status ? 1 : 0)
                params.syncData = params.syncData === undefined ? 1 : (params.syncData ? 1 : 0)
                if (!this.state.formConfig.id) {
                    params = Object.assign({}, params, { categoryId: this.state.categoryId})
                    console.log(params)
                    addTable(params).then(res => {
                        if(res.code === 200){
                            message.success('保存成功')
                            this.setState({formConfig: {visible: false, id: null}})
                            this.props.handleChange()
                        }else{
                            message.error(res.data)
                        }
                    })
                } else {
                    params = Object.assign({}, params, { categoryId: this.state.categoryId, id: this.state.formConfig.id })
                    updateTable(params).then(res => {
                        if(res.code === 200){
                            message.success('保存成功')
                            this.setState({formConfig: {visible: false, id: null}})
                            this.props.handleChange()
                        }else{
                            message.error(res.data)
                        }
                    })
                }
            }
        })
    }


    // 选中行
    onClickRow = (record) => {
        if (this.state.RowLock) {
           var selectedRowKeys = [];
           selectedRowKeys.push(record.id)
            return {
                onClick: () => {
                    this.setState({
                        selectedRowKeys:selectedRowKeys
                    });
                },
            };
        }
    }
    //新增
    handleAdd = _ => {
        if(this.state.categoryId) {
            this.setState({formConfig: {visible: true, id: null}})
            this.props.form.resetFields()
        }else{
            message.error('请先选择元数据类别')
        }
    }
    //修改
    handleEdit = _ => {
        if(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            const item = this.props.data.filter(e => e.id === this.state.selectedRowKeys[0])[0]
            this.props.form.setFields({ description: { value: item.description },
                name: { value: item.name }, tableName: { value: item.tableName },
                status: { value: item.status === 1 },
                syncData: { value: item.syncData === 1 }})
            this.setState({formConfig: {visible: true, id: item.id}})
        }else{
            message.error('请先选择元数据')
        }
    }
    //编辑字段明细
    showColumn = r => {
        this.setState({columnVisible: true, columnTitle: r.name, tableId: r.id})
        //获得明细
        getColumnList({id: r.id}).then(res => {
            if(res.data && res.data.length > 0){
                this.setState({columnList: res.data.map(e => Object.assign({key: e.id}, e))})
            }else{
                this.setState({columnList: [{key: 0, status: 1}]})
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio'
        };
        return (
            <div>
                <Row gutter={24} style={{padding: '24px 15px 6px 15px',textAlign:'right'}}>
                    <Button style={{marginRight: '10px'}} onClick={this.handleDelete}>删除</Button>
                    <Button style={{marginRight: '10px'}} onClick={this.handleEdit}>修改</Button>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={_ => this.handleAdd()}>新增</Button>
                </Row>
                
                <Provider value={this.props.form}>
                    <Table
                        className="jxlTable"
                        onRow={this.onClickRow}
                        bordered
                        rowKey={"id"}
                        rowSelection={rowSelection}   //设置table的复选框
                        dataSource={this.props.data}
                        columns={this.state.columns}
                        scroll={this.props.scroll}
                        rowClassName="editable-row"
                        pagination={false}
                        size={'small'}
                        style={{ marginTop: '16px', overflowY: 'auto' }}
                    />
                    {this.props.children}
                </Provider >
                <ColumnModal data={this.state.columnList} disabled={this.state.readonly} visible={this.state.columnVisible}
                             onCancel={_ => this.setState({columnVisible: false})} tableId={this.state.tableId}
                             refresh={columnList => this.setState({columnList})} title={this.state.columnTitle} />
                <Modal title='元数据信息'
                       onOk={this.handleSave}
                       visible={this.state.formConfig.visible}
                       confirmLoading={this.state.loading}
                       bodyStyle={{padding: 0}}
                       onCancel={_ => this.setState({formConfig: {visible: false, item: {}}})}
                       okText="保存"
                       width='820px'
                       style={{top: 160, marginBottom: 100}}
                       cancelText="取消">
                    <Row gutter={24}>
                        <Form labelCol={{ span: 4 }} layout="horizontal" style={{margin: '20px 10px'}}>
                            {this.state.rules.map((val, index) =>
                                val.key === "description" ?
                                    <Col key={index} span={24} style={{ display: 'block' }}>
                                        <FormItem
                                            label={val.label} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                                            {getFieldDecorator(val.key, val.option)(val.render())}
                                        </FormItem>
                                    </Col> : <Col key={index} span={12} style={{ display: 'block' }}>
                                        <FormItem
                                            label={val.label} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator(val.key, val.option)(val.render())}
                                        </FormItem>
                                    </Col>
                            )}
                        </Form>
                    </Row>
                </Modal>
            </div>
           
        )
    }
}


const TableListForm = Form.create()(TableList)
export default TableListForm



