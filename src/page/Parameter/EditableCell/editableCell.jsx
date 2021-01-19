import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm } from 'antd';

const { confirm } = Modal;




const { Item } = Form
const { Provider, Consumer } = React.createContext()//组件之间传值

import './index.css'

// 引入 API接口
import { addSysList, deleteSysList ,updateSysList } from '/api/systemParameter'


class EditableCell extends React.Component {
    renderCell = ({ getFieldDecorator }) => {
        const {
            editing, dataIndex,initValue, title, Inputs, record, index, children,
            ...restProps
        } = this.props;


        return (
            <td {...restProps} className='my-cell-td'>
                {editing ? (
                    dataIndex == 'status' ?
                        < Item style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `请输入 ${title}!`
                                }],
                                initialValue:(record[dataIndex]).toString()
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value="0">禁用</Option>
                                    <Option value="1">启用</Option>
                                </Select>
                            )}
                        </Item> : < Item style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{ required: true, message: `请输入 ${title}!` }],
                                initialValue: record[dataIndex],
                            })(
                                <Inputs />
                            )}
                        </Item>
                ) : children
                }
            </td>
        );
    };
    render() {
        return <Consumer>{this.renderCell}</Consumer>;
    }
}


  
  


class TableRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: '',
            data: [],
            count:0,
            parameterCategoryId:null,   //参数类型ID
            editLock:false,  //用于判断还是新增
        }
    }

    // 组件将要挂载时触发的函数
    async componentWillMount(){
        

    }

    // 数据更新完成时触发的函数
    componentWillReceiveProps(nextProps) {
        // console.log(props,nextProps)
        if (this.props.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
                count: this.state.data.length + 1,  
                parameterCategoryId:this.props.parentValueID  //参数类型ID
            })
        }
       
    }





    // 新增table表格一行
    handleAdd = () => {
        const { count, data } = this.state;
        const newData = {
            key: count,
            id:count,
            paramterName: ``,
            status: '1',
            parameterValue:"",
            description: ``,
            operation: "",
        };
        
        this.setState({
            data: [...data, newData],
            count: count + 1,
            editingKey: newData.id //将当前新增的数据进行新增填写
        });

    };


    //判断是否可编辑
    isEditing = record => record.id == this.state.editingKey
    

    //是否展示编辑
    editable = (editable, editingKey, record) => {
        const ele = editable ? (
            <span style={{ display: 'block' }}>
                <Consumer>
                    {
                        form => (
                            <a onClick={() => this.save(form,record.id)} style={{ marginRight: 8 }}>
                                保存
                            </a>
                        )
                    }
                </Consumer>
                <Popconfirm title="是否取消修改?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                </Popconfirm>
            </span>
        ) : (
            <div>
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)} style={{ marginRight: '15px' }}>修改</a>
                <a disabled={editingKey !== ''} onClick={() => this.delete(record.id)}>删除</a>
            </div>
        );
        return ele
    }

    //编辑
    edit = (id) => {
        this.setState({
            editingKey: id,
            editLock:true
        })

    }
     
    // 删除
    delete = (key) => {
        deleteSysList({ id: key }).then(res => {
            if (res.success == 1) {
                //  获取系统参数列表
                this.props.handleChange();
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }

    //保存
    save = (form,id) => {
        form.validateFields((error, row) => {
            if (error) {
                return
            }

            var params =JSON.parse( JSON.stringify(row));
            
            params.parameterCategoryId = this.state.parameterCategoryId;
            
            if (this.state.editLock) {
                params.id = id;
                
                updateSysList(params).then(res=>{
                    if (res.success == 1) {
                        
                        this.setState({ editingKey: '' });
                        //  获取系统参数列表
                        this.props.handleChange();
                    }else if (res.success == 0){
                        message.error(res.message);
                    }
                })
            }else {
                addSysList(params).then(res=>{
                    if (res.success == 1) {
                        
                        this.setState({ editingKey: '' });
                        //  获取系统参数列表
                        this.props.handleChange();
                    }else if (res.success == 0){
                        message.error(res.message);
                    }
                })
            }
        })
    }

    //取消
    cancel = (key) => {
        // 判断  若是【新增】的取消功能，则刚刚新增数据删除；若是【修改】的取消功能 则是取消修改
        if (this.state.editLock) {   // 修改
            this.setState({
                editingKey: '',
                editLock:false
            })
        }else {  // 新增
            const dataSource = [...this.state.data];
            this.setState({ 
                data: dataSource.filter(item => item.key !== key) ,
                editingKey: '',
                editLock:false
            });
        }
       
    }

    // 初始化
    init = () => {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                editable: false,
                // 第一种：每一页都从1开始
                render:(text,record,index)=> `${index+1}`

                // 第二种：分页连续自增序号
                // render: (text, record, index) => {   
                //     return (
                //         `${(this.state.form.current - 1) * (this.state.form.pageSize) + (index + 1)}`  //当前页数减1乘以每一页页数再加当前页序号+1
                //     )
                // }
            },
            {
                title: '参数名称',
                dataIndex: 'paramterName',
                editable: true,
            },
            {
                title: '参数值',
                dataIndex: 'parameterValue',
                editable: true,
            },{
                title: '参数描述',
                dataIndex: 'description',
                editable: true,
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: t => t == '1' ? '启用' : '禁用',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    console.log(record)
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return <div>
                        {
                            this.editable(editable, editingKey, record)
                        }
                    </div>
                }
            },
        ]
    }

    // table表格复选框---选中事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRows);
        this.setState({ selectedRowKeys });
        // let arr = [];
        // for (let p of selectedRows) {
        //     arr.push(p.id)
        // }
        // this.setState({ tableID: Array.from(new Set(arr)) })
        // console.log(this.state.tableID)
        // this.userIds = Array.from(new Set(arr));
    }

    

    render() {
        this.init()
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {

            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    Inputs: Input,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        return (
            <div>
                <Row gutter={24} style={{padding: '15px 15px 0px 15px'}}>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={this.handleAdd}>新增</Button>
                    {/* <Button type="danger">批量删除</Button> */}
                </Row>
                
                <Provider value={this.props.form}>
                    <Table
                        components={components}   //覆盖默认的 table 元素
                        bordered
                        rowKey="id"
                        rowSelection={rowSelection}   //设置table的复选框
                        dataSource={this.state.data}
                        columns={columns}
                        rowClassName="editable-row"
                        pagination={false}
                        style={{ marginTop: '16px', minHeight: '738px', overflowY: 'auto',height:'calc(100vh - 230px)' }}
                    />
                </Provider >
            </div>
           
        )
    }
}


const EditableFormTable = Form.create()(TableRow);
export default EditableFormTable;



