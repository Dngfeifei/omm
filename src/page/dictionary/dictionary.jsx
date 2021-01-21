import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, Card } from 'antd'
import { GetDictionary, AddDictionary, EditDictionary, DelDictionary, GetDictItems, AddDictItem, EditDictItem, DelDictItem } from '/api/dictionary.js'
const { Search } = Input;
const { Option } = Select
const { Item } = Form
const { confirm } = Modal;
const { Provider, Consumer } = React.createContext()//组件之间传值
import Pagination from '/components/pagination'

// 树数据过滤转化 添加key title字段
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("dictName")) {
            list.title = list.dictName;
        }
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}
// 表格可编辑行渲染
class EditableCell extends React.Component {
    renderCell = ({ getFieldDecorator }) => {
        const {
            editing, dataIndex, title, Inputs, record, index, children,
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
                                initialValue: record[dataIndex],
                            })(
                                <Select style={{ width: 120 }}>
                                    <Option value={0}>禁用</Option>
                                    <Option value={1}>启用</Option>
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

class content extends Component {
    async componentWillMount() {
        this.searchTree()
    }
    state = {
        // 首次进入 
        newEntry: true,
        // 可编辑字段标识
        editingKey: '',
        // 分页参数
        pageConf: {
            limit: 10,
            offset: 0
        },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 请求加锁 防止多次请求
        lock: false,
        //左侧角色树相关数据
        searchName: "",
        tree: {
            //右侧角色树数据
            treeData: [
                // { key: 1, title: '组织机构跟节点' },
                // { key: 4, title: '总经理办公室' },
                // { key: 7, title: '董事会秘书' },
                // { key: 5, title: '技术服务中心' },
                // { key: 6, title: '保障中心' }
            ],
        },
        //右侧table相关数据
        table: {
            //右侧角色表格配置
            columns: [
                {
                    title: '字典值',
                    dataIndex: 'itemValue',
                    align: 'center',
                    editable: true,
                },
                {
                    title: '编码值',
                    dataIndex: 'itemCode',
                    align: 'center',
                    editable: true,
                },
                {
                    title: '顺序',
                    dataIndex: 'serialNumber',
                    align: 'center',
                    editable: true,
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    align: 'center',
                    editable: true,
                    render: (t, r) => {
                        if (t == 1) {
                            return "启用"
                        } else if (t == 0) {
                            return "禁用"
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render: (text, record, index) => {
                        const { editingKey } = this.state;
                        const editable = this.isEditing(record);
                        return <div>
                            {
                                this.editable(editable, editingKey, record)
                            }
                        </div>
                    }
                },

            ],
            //右侧角色表格数据
            dictData: [],
        },
        //新增修改字典弹窗配置
        newGroupWindow: {
            newGroupModal: false, //弹窗是否显示可见
            newGroupModalType: 0, //0新增  1修改
            newGroupModalTitle: "",//弹窗title
        },
        //字典tree当前选中项ID
        currentID: null,
        currentGroup: {
            dictName: null,//字典名称
            dictCode: null//字典编码
        },
        //字典参数数据 
        newGroup: {
            dictName: null,//字典名称
            dictCode: null//字典编码
        },
    }
    //数据字典树数据查询
    searchTree = async (params = {}) => {
        // 请求数据字典树数据
        GetDictionary(params)
            .then(res => {
                if (res.success != 1) {
                    alert("操作失败")
                    return
                } else {
                    //给tree数据赋值key title
                    assignment(res.data)
                    this.setState({
                        tree: {
                            treeData: res.data
                        }
                    })
                    if (this.state.newEntry) {
                        this.searchList({ dictId: res.data[0].id })
                        this.setState({newEntry:false})
                    }
                }
            })
    }
    //新增数据字典项
    addGroup = () => {
        // 新增内容区域内容置空 新增内容区域显示
        this.setState({
            newGroup: {
                dictName: null,
                dictCode: null,
            },
            newGroupWindow: {
                newGroupModal: true,
                newGroupModalType: 0,
                newGroupModalTitle: "新增字典"
            },
        })
    }
    //编辑字典
    editGroup = () => {
        let selected = this.state.currentID;
        //1 判断字典tree是否有选中 如无选中提示无选中数据无法修改
        if (selected == "" || selected == null) {
            message.warning('没有选中数据,无法进行修改!');
            return
        }
        //2 编辑弹窗展示 
        this.setState({
            newGroup: this.state.currentGroup,
            newGroupWindow: {
                newGroupModal: true,
                newGroupModalType: 1,
                newGroupModalTitle: "编辑字典"
            },
        })
    }
    //删除字典
    delGroup = async _ => {
        //1 判断字典tree是否有选中 如无选中提示无选中数据无法删除
        let selected = this.state.currentID;
        if (selected == "" || selected == null) {
            message.warning('没有选中数据,无法进行删除!');
            return
        }
        //2 获取选中项  发起删除请求  
        let _this = this
        confirm({
            title: '删除后不可恢复,确定删除吗？',
            onOk() {
                DelDictionary({ id: selected }).then(res => {
                    if (res.success != 1) {
                        message.error("操作失败")
                        return
                    } else {
                        _this.searchTree()
                        message.success("操作成功")
                    }
                })
            },
        });

    }
    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        if (!info.selected) {
            this.setState({
                currentID: "",
            })
            return
        }
        let data = info.selectedNodes[0].props
        this.setState({
            currentID: data.id,
            currentGroup: {
                dictName: data.dictName,
                dictCode: data.dictCode
            },
            newGroup: {
                dictName: data.dictName,
                dictCode: data.dictCode
            },
            pageConf: Object.assign({}, this.state.pageConf, { offset: 0 })
        })
        // 选中后请求字典项详情列表数据
        this.searchList({ dictId: data.id, offset: 0 })
    };

    //获取要查询的字典名称
    getSearchName = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }
    // 通过字典名称查询字典数据
    onSearch = (e) => {
        let value = this.state.searchName;
        this.searchTree({ dictName: value })
    }
    //获取新增或修改后的字典名称
    getdictName = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { dictName: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //获取新增或修改后的字典编码
    getdictCode = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { dictCode: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //保存新增或修改后的字典名称
    saveNewGroup = _ => {
        //1 获取input数据
        let params = this.state.newGroup
        //2 校验数据 不能为空 空：提示名称为空不能保存
        if (params.dictName == "" || params.dictName == null) {
            message.warning('名称不能为空!');
            return
        }
        if (params.dictCode == "" || params.dictCode == null) {
            message.warning('编码不能为空!');
            return
        }
        if (this.state.lock) {
            return
        } else {
            this.setState({ lock: true })
        }
        //3 判断保存类型是新增还是修改
        if (this.state.newGroupWindow.newGroupModalType == 0) {
            //新增 请求新增方法
            let params = this.state.newGroup
            AddDictionary(params).then(res => {
                if (res.success != 1) {
                    message.error("操作失败")
                    return
                } else {
                    // 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        newGroupWindow: {
                            newGroupModal: false
                        },
                        newGroup: {
                            dictName: '',
                            dictCode: ''
                        }
                    })
                    //左侧字典tree刷新 
                    this.searchTree()
                    message.success("操作成功")
                }
                this.setState({ lock: false })
            })

        } else if (this.state.newGroupWindow.newGroupModalType == 1) {
            //修改 请求修改方法
            let _this = this
            let params = Object.assign({}, this.state.newGroup, { id: this.state.currentID })
            EditDictionary(params).then(res => {
                if (res.success != 1) {
                    message.error("操作失败")
                    return
                } else {
                    // 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        newGroupWindow: {
                            newGroupModal: false
                        },
                        currentGroup: _this.state.newGroup,
                        newGroup: {
                            dictName: '',
                            dictCode: ''
                        }
                    })
                    //左侧字典tree刷新 
                    this.searchTree()
                    message.success("操作成功")
                }
                this.setState({ lock: false })
            })
        }
    }
    // 查询字典项详情列表
    searchList = (Params = {}) => {
        let params = Object.assign({}, this.state.pageConf, { dictId: this.state.currentID }, Params)
        GetDictItems(params).then(res => {
            if (res.success != 1) {
                message.error("操作失败")
                return
            } else {
                let data = Object.assign({}, this.state.table, {
                    dictData: res.data.records
                })
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total,
                    pageSize: res.data.size,
                    current: res.data.current,
                })
                let pageConf = Object.assign({}, this.state.pagination, {
                    limit: res.data.size,
                    offset: (res.data.current - 1) * 10,
                })
                this.setState({ table: data, pagination: pagination, pageConf: pageConf })
            }
        })
    }

    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * 10 });
        let dictId = this.state.currentID;
        let params = Object.assign({}, pageConf, { dictId: dictId })
        this.searchList(params)
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        let dictId = this.state.currentID;
        let params = Object.assign({}, pageConf, { dictId: dictId })
        this.searchList(params)
    }

    //判断是否可编辑
    isEditing = record => record.id == this.state.editingKey

    //是否展示编辑
    editable = (editable, editingKey, record) => {
        const ele = editable ? (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Consumer>
                    {
                        form => (
                            <a onClick={() => this.saveItem(form, record.id)}>
                                保存
                            </a>
                        )
                    }
                </Consumer>
                <a onClick={() => this.cancel()}>取消</a>
            </div>
        ) : (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <a disabled={editingKey !== ''} onClick={() => this.editItem(record.id)}>
                        修改
                 </a>
                    <a disabled={editingKey !== ''} onClick={() => this.delItem(record.id)}>
                        删除
                 </a>
                </div>
            );
        return ele
    }
    // 新增字典项
    addItem = () => {
        let oldData = this.state.table.dictData
        let count = oldData.length + 1

        let data = [...oldData, {
            id: count,
            itemValue: ``,
            itemCode: ``,
            serialNumber: "",
            status: 1,
        }]
        let table = Object.assign({}, this.state.table, { dictData: data })
        this.setState({
            table: table,
            editingKey: count, //将当前新增的数据进行新增填写
            editType: 0
        });

    }
    //编辑字典项
    editItem = (key) => {
        this.setState({
            editingKey: key,
            editType: 1
        })
    }
    // 删除字典项
    delItem = (key) => {
        let ID = this.state.currentID;//当前字典ID
        DelDictItem({ id: [key] }).then(res => {
            if (res.success != 1) {
                message.error("操作失败")
                return
            } else {
                this.searchList({ dictId: ID })
            }
        })
    }
    //保存字典项
    saveItem = (form, key) => {
        form.validateFields((error, row) => {
            if (error) { return }
            var params = JSON.parse(JSON.stringify(row));
            let type = this.state.editType;//当前编辑类型
            let ID = this.state.currentID;//当前字典ID
            // dictId
            if (!type) {
                //新增保存
                params = Object.assign({}, params, { dictId: ID })
                AddDictItem(params).then(res => {
                    if (res.success != 1) {
                        message.error("操作失败")
                        return
                    } else {
                        this.setState({ editingKey: '' });
                        this.searchList({ dictId: ID })
                    }
                })
            } else {
                //编辑保存
                params = Object.assign({}, params, { id: key })
                EditDictItem(params).then(res => {
                    if (res.success != 1) {
                        message.error("操作失败")
                        return
                    } else {
                        this.setState({ editingKey: '' });
                        this.searchList({ dictId: ID })
                    }
                })
            }
        })
    }
    //取消
    cancel = () => {
        confirm({
            title: '是否确定取消?',
            onOk() {
                this.setState({
                    editingKey: ''
                })
            },
            onCancel() {
                this.setState({
                    editingKey: ''
                })
            },
        });
    }
    render = _ => {
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        // 表格列配置
        const columns = this.state.table.columns.map(col => {
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
        const { getFieldDecorator } = this.props.form
        return <div style={{ display: 'flex', height: "100%" }}>
            {/* 左侧字典 tree */}
            <Card style={{ flex: "3" }}>
                <Col style={{ marginBottom: "10px" }}>
                    <Button type="primary" onClick={this.addGroup}>新增</Button>
                    <Button type="primary" style={{ margin: '0 10px' }} onClick={this.editGroup}>修改</Button>
                    <Button type="primary" onClick={this.delGroup}>删除</Button>
                </Col>
                <Col style={{ marginBottom: "10px" }}>
                    <Search required addonBefore="字典名称" onSearch={this.onSearch} placeholder="请输入" value={this.state.searchName} onChange={this.getSearchName} style={{ margin: "2% 10px", width: '90%' }} />
                </Col>
                <Tree
                    onSelect={this.onTreeSelect}
                    defaultExpandAll={true}
                    treeData={this.state.tree.treeData}
                />
            </Card>
            {/* 右侧角色table表格 */}
            <Card title="字典管理" style={{ flex: "8" }}>
                <Form style={{ width: '100%' }}>
                    <Row>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.addItem}>新增</Button>
                    </Row>
                </Form>
                <Provider value={this.props.form}>
                    <Table bordered dataSource={this.state.table.dictData} columns={columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} components={components} />
                </Provider>
                <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
            </Card>
            {/* 字典新增修改弹窗 */}
            <Modal
                title={this.state.newGroupWindow.newGroupModalTitle}
                visible={this.state.newGroupWindow.newGroupModal}
                onCancel={_ => this.setState({ newGroupWindow: { newGroupModal: false } })}
                onOk={this.saveNewGroup}
                cancelText="取消"
                okText="保存"
            >
                <Input required addonBefore="字典名称" placeholder="请输入" value={this.state.newGroup.dictName} onChange={this.getdictName} style={{ margin: "2% 10px", width: '90%' }} />
                <Input required addonBefore="编码值" placeholder="请输入" value={this.state.newGroup.dictCode} onChange={this.getdictCode} style={{ margin: "2% 10px", width: '90%' }} />
            </Modal>


        </div>
    }
}
const area = Form.create()(content)
export default area













