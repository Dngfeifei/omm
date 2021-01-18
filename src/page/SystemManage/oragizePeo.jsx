import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table } from 'antd'
// import Common from '/page/common.jsx'
import { getTree, saveJG, editJG, saveEditJG, deleteJG, checkRY, releGL, deleteGL, addRY } from '/api/dict'


const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const ButtonGroup = Button.Group
class systempeo extends Component {
    async componentWillMount() {
        //获取树
        //    await getTree().then(res =>{
        //             this.setState({treedData : res.data})
        //         }).catch( err =>{
        //             console.log(err)
        //         })
    }

    state = {
        // search: Object.assign({name: '', num: ''}, this.state.pageconf),
        rules: [
            {
                label: '姓名',
                key: 'realName',
                render: _ => <Input style={{ width: 200 }} />
            },
            {
                label: '账号',
                key: 'userName',
                render: _ => <Input style={{ width: 200 }} />
            },
            {
                label: '状态',
                key: 'status',
                render: _ => <Select style={{ width: 200 }} placeholder="选择状态">
                    <Option value='0' key='0'>启用</Option>
                    <Option value='1' key='1'>禁用</Option>
                </Select>
            }
        ],
        addrules: [
            {
                label: '组织机构全称',
                key: 'orgFullName',
                option: {
                    rules: [{
                        required: true, message: '组织机构全称不能为空',
                    }]
                },
                render: _ => <Input style={{ width: 150 }} />
            },
            {
                label: '组织机构简称',
                key: 'orgShortName',
                option: {
                    rules: [{
                        required: true, message: '组织机构简称不能为空',
                    }]
                },
                render: _ => <Input style={{ width: 150 }} />
            },
            {
                label: '组织机构编号',
                key: 'orgNum',
                render: _ => <Input style={{ width: 150 }} />
            },
            {
                label: '组织机构代码',
                key: 'orgCode',
                render: _ => <Input style={{ width: 150 }} />
            },
        ],
        columns: [
            {
                title: '姓名',
                dataIndex: 'realName'
            }, {
                title: '工号',
                dataIndex: 'userNum'
            }, {
                title: '账号',
                dataIndex: 'userName',
            }, {
                title: '性别',
                dataIndex: 'sex',
                render: t => t == '1' ? '男' : '女'
            }, {
                title: '所属组织',
                dataIndex: 'org',
            }, {
                title: '职务',
                dataIndex: 'duties',
            }, {
                title: '移动电话',
                dataIndex: 'mobilePhone',
            }, {
                title: '状态',
                dataIndex: 'status',
                render: t => t == '1' ? '启用' : '禁用'
            }
        ],
        tabledata: [
            {
                "realName": "北京",
                "userNum": "192933444884",
                "userName": "kndnkf",
                "sex": 0,
                "org": "华北大区",
                "duties": "经理1",
                "mobilePhone": "1983746363",
                "status": 1,
            },
            {
                "realName": "北京",
                "userNum": "192933444884",
                "userName": "kndnkf",
                "sex": 1,
                "org": "华北大区",
                "duties": "经理2",
                "mobilePhone": "1983746363",
                "status": 0,
            },
            {
                "realName": "北京",
                "userNum": "192933444884",
                "userName": "kndnkf",
                "sex": 1,
                "org": "华北大区",
                "duties": "经理",
                "mobilePhone": "1983746363",
                "status": 0,
            }
        ],
        name: '111',
        num: '',
        visible: false,
        edit: false,
        title: '',
        selectedRowKeys: [],
        tableID: [],
        treeData: [
            {
                key: '11',
                title: '组织机构跟节点',
                children: [{
                    key: '23',
                    title: '董事会',
                    children: [
                        {
                            key: '4', title: '总经理办公室', children: [
                                { key: '5', title: '技术服务中心' },
                                { key: '6', title: '保障中心' }
                            ]
                        },
                        {
                            key: '7', title: '董事会秘书', children: [
                                { key: '8', title: '证券事业部' }
                            ]
                        }
                    ]
                }]
            }
        ],
        selectedTreeId: null,
        Dialog: {  //添加人员数据
            name: '',
            num: null,
            YGNum: null,
            gender: '',
            email: '',
            GDphone: '',
            YDphone: ''
        },
        userIds: []
    }


    // 点击添加，添加机构
    add = _ => {
        if (this.state.selectedTreeId) {
            this.setState({ edit: true })
            this.setState({ title: '添加机构' })
        } else {
            message.warning('请先选择机构！')
        }

    }
    // 点击修改，修改机构
    edit = _ => {
        if (this.state.selectedTreeId) {
            this.setState({ edit: true })
            this.setState({ title: '编辑机构' })
        } else {
            message.warning('请先选择机构！')
        }
    }
    // 删除树
    deleteT = _ => {
        deleteJG({ id: this.state.selectedTreeId }).then(res => {
            this.getTreeAll();
        }).catch(res => {
            console.log(res)
        })
    }
    // 保存
    handleOk = _ => {
        this.props.form.validateFieldsAndScroll([`orgFullName`, `orgShortName`, `orgNum`, `orgCode`], {}, (err, val) => {
            let params = Object.assign(val)
            console.log(params)
            if (this.state.title == '添加机构') {
                // if(this.ruleForm.name.length >0 && this.ruleForm.BH > 0){
                saveJG(params).then(res => {
                    console.log(res);
                    this.setState({ edit: false })
                    this.getTreeAll();

                }).catch(err => {
                    console.log(err)
                })
                // }else{

                // }
            } else {
                // if(this.ruleForm.name.length >0 && this.ruleForm.BH > 0){
                saveEditJG(data2).then(res => {
                    console.log(res);
                    this.setState({ edit: false })
                    _this.getTreeAll();
                    this.setState({
                        orgFullName: '',
                        orgShortName: '',
                        orgNum: null,
                        orgCode: null
                    })
                }).catch(err => {
                    console.log(err)
                })
                // }else{

                // }
            }
        })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRows);
        this.setState({ selectedRowKeys });
        let arr = [];
        for (let p of selectedRows) {
            arr.push(p.id)
        }
        this.setState({ tableID: Array.from(new Set(arr)) })
        console.log(this.state.tableID)
        // this.userIds = Array.from(new Set(arr));
    }
    // 树选中后
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        this.setState({ selectedTreeId: selectedKeys })
        this.checkPeo(selectedKeys);
    };
    //拖拽结束时执行
    onDragEnd = info => {
         console.log('onDragEnd')
    }
    //拖拽tree，判断为哪个位置
    onDrop = info => {
        console.log('onDrop')
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {

                if (item.key === key) {

                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.treeData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, item => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        this.setState({
            treeData: data,
        });
    };
    // 点击树后表格数据查询
    checkPeo(orgId) {
        let data = {
            orgId: orgId,//orgId
            // offset:this.pageList.pageNum,
            // limit:this.pageList.pageSize,
        };
        checkRY(data).then(res => {
            console.log(res);
            this.state.tabledata = res.data.list;
            this.pageList.total = res.data.total;
            // this.pageList.pageNum = res.data.pageNum;
            // this.pageList.pageSize = res.data.pageSize;
        }).catch(err => {
            console.log(err)
        })
    }
    // 点击查询按钮
    checkPeoId() {
        this.props.form.validateFieldsAndScroll([`realName`, `userName`, `status`], {}, (err, val) => {
            let params = Object.assign({ orgId: this.state.selectedTreeId }, val)
        })
        checkRY(params).then(res => {
            console.log(res);
            this.setState({ tabledata: res.data.list })
            // this.data = res.data.list;
            this.setState({ realName: '', userName: '', realName: null })
        }).catch(err => {
            console.log(err)
        })
    }
    // 关联机构人员按钮点击
    check = _ => {
        this.setState({ visible: true })
        // 渲染弹框里的表格 查询所有人员
        this.checkAllPeople()
    }
    // 解除关联人员
    deletePeo() {
        let data = {
            orgId: this.state.selectedTreeId,
            userIds: this.state.userIds,
        }
        if (this.state.userIds.length > 0) {
            deleteGL(data).then(res => {
                console.log(res);
                if (res.status == '200') {
                    this.checkPeo(this.state.selectedTreeId);
                    message.success('请先选择机构！')
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            message.error('请先勾选解除关联人员!')
        }

    }
    // 查询所有人员
    checkAllPeople() {
        let data = {
            offset: this.pageLogList.pageNum,
            limit: this.pageLogList.pageSize,
        }
        checkRY(data).then(res => {
            console.log(res);
            this.dialogData = res.data.list;
            this.pageLogList.total = res.data.total;
        }).catch(err => {
            console.log(err)
        })
    }
    // 弹框里的人员查询
    checkDialogData() {
        let data = {
            realName: this.Dialog.name,//姓名
            userNum: this.Dialog.YGNum,//员工号
            userName: this.Dialog.num,//账号
            fixedPhone: this.Dialog.GDphone,//固定电话
            sex: this.Dialog.gender,//性别
            mobilePhone: this.Dialog.YDphone,//电话
            email: this.Dialog.email,//邮箱
            // offset:this.pageList.pageNum,
            // limit:this.pageList.pageSize,
        };
        checkRY(data).then(res => {
            console.log(res);
            this.dialogData = res.data.list;
            this.pageLogList.total = res.data.total;
        }).catch(err => {
            console.log(err)
        })
    }

    render = _ => {
        const { getFieldDecorator } = this.props.form
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return <div style={{ border: '0px solid red' }} className="main_height">
            <Row className="main_height" gutter={24}>
                <Col span={6} className="gutter-row main_height" style={{ backgroundColor: 'white' }}>
                    <div style={{ height:'60px',display: 'flex',justifyContent: 'space-around',alignItems: 'center'}}>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.add}>新增</Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.edit}>修改</Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.deleteT}>删除</Button>
                    </div>
                    <Tree
                        className="draggable-tree"
                        draggable
                        blockNode
                        defaultExpandAll={true}
                        onDragEnter={this.onDragEnter}
                        onDragEnd={this.onDragEnd}
                        onDrop={this.onDrop}
                        treeData={this.state.treeData}
                        onSelect={this.onSelect}
                    />
                </Col>
                <Col span={18} className="gutter-row main_height" style={{padding: '0 10px 0', backgroundColor:'white'}}>
                    <Form style={{ width: '100%',paddingTop:'10px' }}>
                        <Row gutter={24}>
                            {this.state.rules.map((val, index) =>
                                <Col key={index} span={8} style={{ display: 'block' }}>
                                    <FormItem
                                        label={val.label} labelCol={{ span: 4 }} style={{marginBottom:'8px'}}>
                                        {getFieldDecorator(val.key, val.option)(val.render())}
                                    </FormItem>
                                </Col>)}
                        </Row>
                        <Row>
                            <Button type="primary" style={{ marginLeft: '10px' }}>查询</Button>
                            <Button type="info" style={{ marginLeft: '10px' }}>清空</Button>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.check}>关联机构人员</Button>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.deletePeo}>解除关联人员</Button>
                        </Row>
                    </Form>
                    <Table 
                        bordered
                        rowSelection={rowSelection}
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={true}
                        style={{ marginTop: '16px' }}
                    />
                </Col>
            </Row>
            <Modal title='添加人员'
                // onOk={this.handleOk}
                visible={this.state.visible}
                // confirmLoading={this.state.loading}
                // onCancel={this.props.onCancel}
                onCancel={_ => this.setState({ visible: false })}
                width={600}
                style={{ top: 50, marginBottom: 100 }}
                okText="提交"
                cancelText="取消">
                {/* <Form>
                    {this.state.rules.map((val, index) => <FormItem  
                    label={val.label} labelCol={{span: 6}}>
                        {getFieldDecorator(val.key, val.option)(val.render())}
                    </FormItem>)}
                </Form> */}
            </Modal>
            <Modal
                title={this.state.title}
                visible={this.state.edit}
                onOk={this.handleOk}
                // confirmLoading={this.state.loading}
                onCancel={_ => this.setState({ edit: false })}
                width={650}
                style={{ top: 50, marginBottom: 100 }}
                okText="提交"
                cancelText="取消"
            >
                {<Form>
                    <Row gutter={24}>
                        {this.state.addrules.map((val, index) =>
                            <Col key={index} span={12} style={{ display: 'block' }}>
                                <FormItem
                                    label={val.label} labelCol={{ span: 9 }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>)}
                    </Row>
                </Form>}
            </Modal>
        </div>
    }

}
const BranchContForm = Form.create()(systempeo)
export default BranchContForm













