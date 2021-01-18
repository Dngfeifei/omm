import React, { Component } from 'react'
import qs from 'qs';
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, Card } from 'antd'
const { Option } = Select;
import { GetRoleTree, AddRoleGroup, EditRoleGroup, DelRoleGroup, GetRole, AddRole, EditRole, DelRole, GetResourceTree } from '/api/role.js'
import Pagination from '/components/pagination'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const ButtonGroup = Button.Group
const { confirm } = Modal;
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("roleCategoryName")) {
            list.title = list.roleCategoryName;
        } else if (list.hasOwnProperty("resourceName")) {
            list.title = list.resourceName;
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

class role extends Component {
    async componentWillMount() {
        this.searchTree()
        // 请求角色所要挂载的全量资源数据
        GetResourceTree()
            .then(res => {
                if (res.success != 1) {
                    alert("请求错误")
                    return
                } else {
                    //给tree数据赋值key title
                    assignment(res.data)
                    this.setState({
                        resourceData: res.data,
                    })
                }
            })
    }
    state = {
        // 请求加锁 防止多次请求
        lock: false,
        //左侧角色树相关数据
        tree: {
            //右侧角色树数据
            treeData: [
                // {
                //     key: 1,
                //     title: '组织机构跟节点',
                //     children: [{
                //         key: 3,
                //         title: '董事会',
                //         children: [
                //             {
                //                 key: 4, title: '总经理办公室', children: [
                //                     { key: 5, title: '技术服务中心' },
                //                     { key: 6, title: '保障中心' }
                //                 ]
                //             },
                //             {
                //                 key: 7, title: '董事会秘书', children: [
                //                     { key: 8, title: '证券事业部' }
                //                 ]
                //             }
                //         ]
                //     }]
                // }
            ],
        },
        //右侧table相关数据
        table: {
            //右侧角色表格配置
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'roleName',
                    align: 'center',
                },
                {
                    title: ' 操作 ',
                    align: 'center',
                    width: 200,
                    render: (t, r) => <div style={{ 'display': 'flex', justifyContent: 'space-around', padding: '0 5px' }}>
                        <a onClick={_ => this.editRoleItem(r)}>修改</a>
                        <a onClick={_ => this.delRoleItem([r.id])}>删除</a>
                    </div>
                }
            ],
            //右侧角色表格数据
            rolesData: [
                // {
                //     "id": 1,
                //     "roleName": "总经理",
                // },
                // {
                //     "id": 2,
                //     "roleName": "区域经理",
                // },
                // {
                //     "id": 3,
                //     "roleName": "部门经理",
                // },
            ],

        },
        //新增修改角色组弹窗配置
        roleGroupWindow: {
            roleGroupModal: false, //弹窗是否显示可见
            roleGroupModalType: 0, //0新增  1修改
            roleGroupModalTitle: "新增",//弹窗title
        },
        //角色组参数数据 
        newRoleGroup: {
            //tree当前选中项ID
            treeSelect: null,
            //新增或修改后的角色组数据
            newRoleGroupVal: null,
        },
        //新增修改角色弹窗配置
        roleWindow: {
            roleModal: false,
            roleModalType: 0, //0新增  1修改
            roleModalTitle: "新增"
        },
        //右侧查询表单参数
        searchRoleName: null,
        searchListID: null,
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        //当前选中角色数据
        currentRole: {
            id: null,
            roleName: null,
            status: null,
            resources: [],
        },
        //表格选中项
        tableSelecteds: [],
        //资源树数据
        resourceData: null
    }
    //角色组树数据查询
    searchTree = async () => {
        //请求角色组数据 右侧表格渲染第一列角色数据
        GetRoleTree()
            .then(res => {
                if (res.success != 1) {
                    alert("请求错误")
                    return
                } else {
                    assignment(res.data)
                    this.setState({
                        tree: { treeData: res.data }
                    })
                }
            })
    }
    //新增角色组
    addRoleGroup = () => {
        // 新增内容区域内容置空 新增内容区域显示
        let select = this.state.newRoleGroup.treeSelect
        this.setState({
            newRoleGroup: {
                treeSelect: select,
                newRoleGroupVal: null,
            },
            roleGroupWindow: {
                roleGroupModal: true,
                roleGroupModalType: 0,
                roleGroupModalTitle: "新增角色组"
            },
        })
    }
    //编辑角色组
    editRoleGroup = () => {
        let selected = this.state.newRoleGroup.treeSelect;
        //1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
        if (selected == "" || selected == null) {
            message.warning('没有选中数据,无法进行修改!');
            return
        }
        //2 编辑弹窗展示 
        this.setState({
            roleGroupWindow: {
                roleGroupModal: true,
                roleGroupModalType: 1,
                roleGroupModalTitle: "修改角色组"
            },
        })
    }
    //删除角色组
    delRoleGroup = async _ => {
        //1 判断角色组tree是否有选中 如无选中提示无选中数据无法删除
        let selected = this.state.newRoleGroup.treeSelect;
        if (selected == "" || selected == null) {
            message.warning('没有选中数据,无法进行删除!');
            return
        }
        //2 获取选中项  发起删除请求  
        let params = this.state.newRoleGroup.treeSelect;//参数 id和角色组名称
        let _this = this
        DelRoleGroup([params]).then(res => {
            if (res.success != 1) {
                message.error("请求错误")
                return
            } else {
                _this.searchTree()
            }
        })
    }
    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        if (!info.selected) {
            this.setState({
                newRoleGroup: {
                    treeSelect: null,
                    newRoleGroupVal: null
                }
            })
            return
        }
        let data = info.selectedNodes[0].props
        this.setState({
            newRoleGroup: {
                treeSelect: data.id,
                newRoleGroupVal: data.roleCategoryName
            },
            searchListID: data.id
        })
        // 选中后请求角色数据
        this.searchRoleFun(data.id)
    };
    //获取新增或修改后的角色组名称
    getNewRoleGroupVal = (e) => {
        let newRoleGroup = Object.assign({}, this.state.newRoleGroup, { newRoleGroupVal: e.target.value })
        this.setState({
            newRoleGroup: newRoleGroup
        })
    }
    //保存新增或修改后的角色组名称
    saveRoleGroup = _ => {
        //1 获取input数据
        let val = this.state.newRoleGroup.newRoleGroupVal
        //2 校验数据 不能为空 空：提示名称为空不能保存
        if (val == "" || val == null) {
            message.warning('名称为空，不能保存数据!');
            return
        }
        if (this.state.lock) {
            return
        } else {
            this.setState({ lock: true })
        }
        //3 判断保存类型是新增还是修改
        if (this.state.roleGroupWindow.roleGroupModalType == 0) {
            //新增 请求新增方法
            let params = {
                parentId: this.state.newRoleGroup.treeSelect,
                roleCategoryName: this.state.newRoleGroup.newRoleGroupVal
            };
            AddRoleGroup(params).then(res => {
                if (res.success != 1) {
                    message.error("请求错误")
                    return
                } else {
                    // 4 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        roleGroupWindow: {
                            roleGroupModal: false
                        },
                        newRoleGroup: {
                            newRoleGroupVal: ''
                        }
                    })
                    //5 左侧角色组tree刷新 
                    this.searchTree()
                }
                this.setState({ lock: false })
            })

        } else if (this.state.roleGroupWindow.roleGroupModalType == 1) {
            //修改 请求修改方法
            let params = {
                id: this.state.newRoleGroup.treeSelect,
                roleCategoryName: this.state.newRoleGroup.newRoleGroupVal
            };
            EditRoleGroup(params).then(res => {
                if (res.success != 1) {
                    message.error("请求错误")
                    return
                } else {
                    // 4 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        roleGroupWindow: {
                            roleGroupModal: false
                        },
                        newRoleGroup: {
                            newRoleGroupVal: ''
                        }
                    })
                    //5 左侧角色组tree刷新 
                    this.searchTree()
                }
                this.setState({ lock: false })
            })
        }
        // 。。在3步骤内填写下面逻辑。。。。。。。。。

    }
    // 角色名称查询
    searchRoleNameFun = () => {
        let id = this.state.searchListID
        let name = this.state.searchRoleName
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        if (name == "" || name == null) {
            message.warning('请先输入查询内容，然后再进行查询。');
            return
        }
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求角色数据
        let params = {
            roleCategoryId: id,
            roleName: name,
            pageSize: this.state.pageSize,
            pageIndex: this.state.pageIndex,
        }
        GetRole(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData: res.data.list
                })
                this.setState({ table: data, total: res.data.rowCount })
            } else {
                message.error("请求失败,请重试！")
            }

        })
    }
    // 角色名称查询
    searchRoleNameFun2 = (obj) => {
        let id = this.state.searchListID
        let name = this.state.searchRoleName
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求角色数据
        let params = Object.assign({},
            {
                roleCategoryId: id,
                roleName: name,
                pageSize: this.state.pageSize,
                pageIndex: this.state.pageIndex,
            }, obj)
        GetRole(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData: res.data.list
                })
                this.setState({ table: data, total: res.data.rowCount })
            } else {
                message.error("请求失败,请重试！")
            }

        })
    }
    // 角色列表获取
    searchRoleFun = (id) => {
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求角色数据
        let params = {
            roleCategoryId: id,
            pageSize: this.state.pageSize,
            pageIndex: this.state.pageIndex,
        }
        GetRole(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData: res.data.list
                })
                this.setState({ table: data, total: res.data.rowCount })
            } else {
                message.error("请求失败,请重试！")
            }

        })
    }
    // 点击添加，按钮的弹出框
    addRoleItem = _ => {
        let id = this.state.searchListID
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法新增角色
        if (id == "" || id == null) {
            message.warning('请先选中左侧角色组，然后再进行角色新增。');
            return
        }
        this.setState({
            roleWindow: {
                roleModal: true,
                roleModalType: 0,
                roleModalTitle: "新增角色"
            },
        })
    }
    // 点击修改，按钮的弹出框
    editRoleItem = (r) => {
        let ids = [];
        r.resources.forEach(item => { ids.push(item.id) })
        this.setState({
            roleWindow: {
                roleModal: true,
                roleModalType: 1,
                roleModalTitle: "修改角色"
            },
            currentRole: {
                id: r.id,
                roleName: r.roleName,
                status: r.status,
                resources: ids
            }
        })
    }
    //角色表格单项删除
    delRoleItem = async (arr) => {
        let pid = this.state.searchListID
        let _this = this
        confirm({
            title: '删除后不可恢复,确定删除吗？',
            onOk() {
                DelRole(arr).then(res => {
                    if (res.success == 1) {
                        _this.searchRoleFun(pid)
                    }
                })
            }
        })
    }
    // 角色数据保存
    editRoleSave = async () => {
        let id = this.state.searchListID
        let type = this.state.roleWindow.roleModalType
        if (!type) {
            // 新增保存
            let data = this.state.currentRole;
            let arr = []
            data.resources.forEach(item => {
                arr.push({ id: item })
            })
            let params = {
                roleName: data.roleName,
                status: data.status,
                resources: arr,
                roleCategoryId: id
            }
            if (this.state.lock) {
                return
            } else {
                this.setState({ lock: true })
            }
            AddRole(params).then(res => {
                if (res.success == 1) {
                    this.setState({
                        roleWindow: {
                            roleModal: false,
                            roleModalType: null, //0新增  1修改
                            roleModalTitle: null
                        },
                        currentRole: {
                            roleCode: null,
                            roleName: null,
                            status: null,
                            resources: [],
                        }
                    })
                    this.searchRoleFun(id)
                } else {
                    message.error("新增失败")
                }
                this.setState({ lock: false })
            })
        } else {
            {
                // 修改保存
                let data = this.state.currentRole;
                let arr = []
                data.resources.forEach(item => {
                    arr.push({ id: item })
                })
                let params = {
                    roleName: data.roleName,
                    status: data.status,
                    id: data.id,
                    resources: arr
                }
                if (this.state.lock) {
                    return
                } else {
                    this.setState({ lock: true })
                }

                EditRole(params).then(res => {
                    if (res.success == 1) {
                        this.setState({
                            roleWindow: {
                                roleModal: false,
                                roleModalType: null, //0新增  1修改
                                roleModalTitle: null
                            },
                            currentRole: {
                                roleCode: null,
                                roleName: null,
                                status: null,
                                resources: []
                            }
                        })
                        this.searchRoleFun(id)
                    } else {
                        message.error("新增失败")
                    }
                    this.setState({ lock: false })
                })
            }
        }
    }
    // 角色表格批量删除
    delRoleItems = async () => {
        let arr = this.state.tableSelecteds
        if (arr && arr.length) {
            this.delRoleItem(arr)
        } else {
            message.warning('请先选中要删除的树，然后再进行批量删除操作。');
        }
    }
    //获取角色名称查询选项
    getSearchRoleName = (e) => {
        let newData = Object.assign({}, { searchRoleName: e.target.value })
        this.setState({
            searchRoleName: e.target.value
        })
    }
    // 分页页面变化
    pageIndexChange = (index, pageSize) => {
        console.log(index, pageSize)
        this.setState({
            pageIndex: index
        })
        this.searchRoleNameFun2({ pageIndex: index })
    }
    pageSizeChange = (index, size) => {
        console.log(index, size)
        this.setState({
            pageSize: size
        })
        this.searchRoleNameFun2({ pageSize: size })
    }
    //获取新增或修改后的角色名称
    getroleName = (e) => {
        let newData = Object.assign({}, this.state.currentRole, { roleName: e.target.value })
        this.setState({
            currentRole: newData
        })
    }
    //获取新增或修改后的角色状态
    getstatus = (e) => {
        let newData = Object.assign({}, this.state.currentRole, { status: e })
        this.setState({
            currentRole: newData
        })
    }

    // 表格选中后
    onTableSelect = selectedRowKeys => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys
        })
    };
    onCheck = (checkedKeys, info) => {
        let obj = Object.assign({}, this.state.currentRole, { resources: checkedKeys })
        this.setState({
            currentRole: obj
        })
    };

    render = _ => {
        const { getFieldDecorator } = this.props.form
        return <div style={{ display: 'flex', height: "100%" }}>
            {/* 左侧角色组 tree */}
            <Card style={{ flex: "6" }}>
                <Col style={{ marginBottom: "10px" }}>
                    <Button type="primary" onClick={this.addRoleGroup}>新增</Button>
                    <Button type="primary" style={{ margin: '0 10px' }} onClick={this.editRoleGroup}>修改</Button>
                    <Button type="primary" onClick={this.delRoleGroup}>删除</Button>
                </Col>
                <Tree
                    onSelect={this.onTreeSelect}
                    defaultExpandAll={true}
                    treeData={this.state.tree.treeData}
                />
            </Card>
            {/* 右侧角色table表格 */}
            <Card style={{ flex: "18" }}>
                <Form style={{ width: '100%' }}>
                    <Row>
                        <Input addonBefore="角色名称" placeholder="请输入" value={this.state.searchRoleName} onChange={this.getSearchRoleName} style={{ width: '200px' }} />
                        <Button type="primary" onClick={this.searchRoleNameFun}>查询</Button>
                    </Row>
                    <Row style={{ textAlign: 'right' }}>
                        <Button type="info" style={{ marginLeft: '10px' }} onClick={this.addRoleItem}>新增</Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.delRoleItems}>批量删除角色</Button>
                    </Row>
                </Form>
                <Table bordered rowSelection={{ onChange: this.onTableSelect }} dataSource={this.state.table.rolesData} columns={this.state.table.columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} />
                <Pagination current={this.state.pageIndex} pageSize={this.state.pageSize} total={this.state.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
            </Card>
            {/* 角色组新增修改弹窗 */}
            <Modal
                title={this.state.roleGroupWindow.roleGroupModalTitle}
                visible={this.state.roleGroupWindow.roleGroupModal}
                onCancel={_ => this.setState({ roleGroupWindow: { roleGroupModal: false } })}
                onOk={this.saveRoleGroup}
                cancelText="取消"
                okText="保存"
            >
                <Input addonBefore="角色组名称" placeholder="请输入" value={this.state.newRoleGroup.newRoleGroupVal} onChange={this.getNewRoleGroupVal} style={{ margin: "5% 10px", width: '90%' }} />
            </Modal>
            {/* 角色的新增修改弹窗 */}
            <Modal
                title={this.state.roleWindow.roleModalTitle}
                visible={this.state.roleWindow.roleModal}
                onCancel={_ => this.setState({
                    roleWindow: { roleModal: false },
                    currentRole: {
                        roleCode: null,
                        roleName: null,
                        status: null,
                    }
                })}
                onOk={_ => this.editRoleSave()}
                width={650}
                style={{ top: 50, marginBottom: 100 }}
                okText="保存"
                cancelText="取消"
            >
                <FormItem
                    label={"角色名称"} labelCol={{ span: 4 }}>
                    <Input placeholder="请输入" value={this.state.currentRole.roleName} onChange={this.getroleName} style={{ width: '300px' }} />
                </FormItem>
                <FormItem
                    label={"角色状态"} labelCol={{ span: 4 }}>
                    <Select style={{ width: "300px" }} value={this.state.currentRole.status} onChange={this.getstatus} >
                        <Option value={1}>启用</Option>
                        <Option value={0}>停用</Option>
                    </Select>
                </FormItem>
                <Card style={{ width: "500px", overflowY: "auto", marginLeft: "30px" }}>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        autoExpandParent={true}
                        checkedKeys={this.state.currentRole.resources}
                        style={{ height: '200px' }}
                        treeData={this.state.resourceData}
                    />
                </Card>

            </Modal>

        </div>
    }

}
const roles = Form.create()(role)
export default roles













