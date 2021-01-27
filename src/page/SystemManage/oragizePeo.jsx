import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table ,Tooltip } from 'antd'
// import Common from '/page/common.jsx'
import { getTree, saveJG, editJG, saveEditJG, deleteJG, checkRY, releGL, deleteGL, addRY } from '/api/ommJG'
import Pagination from '/components/pagination'
import TreeNode from '/components/tree/'

import '@/assets/less/pages/oragizePeo.less'
const FormItem = Form.Item
const { confirm } = Modal;
class systempeo extends Component {
    constructor(props){
        super(props)
        this.checkPeoId = this.checkPeoId.bind(this)
        this.deletePeo = this.deletePeo.bind(this)
        this.checkDialogData = this.checkDialogData.bind(this)
        this.JGsave = this.JGsave.bind(this)
    }
    componentWillMount() {
        //获取树
        this.getTreeAll()
    }
    componentDidMount(){
        // this.getTreeAll()
    }

    state = {
        // search: Object.assign({name: '', num: ''}, this.state.pageconf),
        rules: [
            {
                label: '姓名',
                key: 'realName',
                render: _ => <Input style={{ width: 150 }} />
            },
            {
                label: '系统账号',
                key: 'userName',
                render: _ => <Input style={{ width: 150 }} />
            },
            {
                label: '状态',
                key: 'status',
                render: _ => <Select style={{ width: 150 }} placeholder="选择状态">
                    <Option value='1' key='1'>启用</Option>
                    <Option value='0' key='0'>禁用</Option>
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
        pepplerules:[
            {
                label: '姓名',
                key: 'realName',
                render: _ => <Input style={{ width: 200 }} />
            },{
                label: '系统账号',
                key: 'userName',
                render: _ => <Input style={{ width: 200 }} />
            }
            // ,{
            //     label: '性别',
            //     key: 'sex',
            //     render: _ => <Select style={{ width: 200 }} placeholder="请选择性别">
            //         <Option value='0' key='0'>男</Option>
            //         <Option value='1' key='1'>女</Option>
            //     </Select>
            // },{
            //     label: '邮箱',
            //     key: 'email',
            //     render: _ => <Input style={{ width: 200 }} />
            // },{
            //     label: '员工号',
            //     key: 'userNum',
            //     render: _ => <Input style={{ width: 200 }} />
            // },{
            //     label: '固定电话',
            //     key: 'fixedPhone',
            //     render: _ => <Input style={{ width: 200 }} />
            // },{
            //     label: '移动电话',
            //     key: 'mobilePhone',
            //     render: _ => <Input style={{ width: 200 }} />
            // },
        ],
        columns: [
            {
                title: '姓名',
                dataIndex: 'realName',
                width:80,
            }, {
                title: '员工号',
                dataIndex: 'userNum',
                ellipsis: {
                    showTitle: false,
                },
                render: userNum => (
                    <Tooltip placement="topLeft" title={userNum}>
                      {userNum}
                    </Tooltip>
                  ),
            }, {
                title: '系统账号',
                dataIndex: 'userName',
                width:90,
                render: userName => (
                    <Tooltip placement="topLeft" title={userName}>
                      {userName}
                    </Tooltip>
                  ),
            }, {
                title: '性别',
                dataIndex: 'sex',
                render: t => t == '1' ? '男' : '女',
                width:70,
            }, {
                title: '所属组织',
                dataIndex: 'orgFullName',
                width:110,
                render: orgFullName => (
                    <Tooltip placement="topLeft" title={orgFullName}>
                      {orgFullName}
                    </Tooltip>
                  ),
            }, {
                title: '职务',
                dataIndex: 'duties',
            }, {
                title: '移动电话',
                dataIndex: 'mobilePhone',
                ellipsis: {
                    showTitle: false,
                },
                render: mobilePhone => (
                    <Tooltip placement="topLeft" title={mobilePhone}>
                      {mobilePhone}
                    </Tooltip>
                  ),
            }, {
                title: '状态',
                dataIndex: 'status',
                render: t => t == '1' ? '启用' : '禁用'
            }
        ],
        peocolumns:[
            {
                title: '姓名',
                dataIndex: 'realName',
            },{
                title: '员工号',
                dataIndex: 'userNum',
            },{
                title: '系统账号',
                dataIndex: 'userName',
            },{
                title: '邮箱',
                dataIndex: 'email',
                width:200,
            },{
                title: '性别',
                dataIndex: 'sex',
                render: t => t == '1' ? '男' : '女',
            },{
                title: '职务',
                dataIndex: 'duties',
            }
        ],
        tabledata: [],
        tableLogdata: [],
        name: '111',
        num: '',
        visible: false,
        edit: false,
        title: '',
        selectedRowKeys: [],
        selectedRowKeys2: [],
        // 第一页表格选中id
        tableID: [],
        treeData: [
            // {
            //     key: '11',
            //     title: '组织机构跟节点',
            //     children: [{
            //         key: '23',
            //         title: '董事会',
            //         children: [
            //             {
            //                 key: '4', title: '总经理办公室', children: [
            //                     { key: '5', title: '技术服务中心' },
            //                     { key: '6', title: '保障中心' }
            //                 ]
            //             },
            //             {
            //                 key: '7', title: '董事会秘书', children: [
            //                     { key: '8', title: '证券事业部' }
            //                 ]
            //             }
            //         ]
            //     }]
            // }
        ],
        // 选中的树
        selectedTreeId: null,
        // 弹出框选中的id
        userIds: [],
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
        // 分页参数
		pageConf2: {
			limit: 10,
			offset: 0
		},
		// 分页配置
		pagination2: {
			pageSize: 10,
			current: 1,
			total: 0,
		},
    }

    // 树数据
    getTreeAll = ()=>{
         getTree().then(res =>{
             console.log(res.data)
            this.setState({treeData : res.data})
        })
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
            console.log(this.state.selectedTreeId);
            this.setState({ edit: true })
            this.setState({ title: '编辑机构' })
            editJG({id:this.state.selectedTreeId}).then(res=>{
                console.log(res);
                 this.props.form.setFields({orgFullName: { value:res.data.orgFullName} })
                 this.props.form.setFields({orgShortName: { value:res.data.orgShortName} })
                 this.props.form.setFields({orgNum: { value:res.data.orgNum} })
                 this.props.form.setFields({orgCode: { value:res.data.orgCode} })
            })
        } else {
            message.warning('请先选择机构！')
        }
    }
    // 删除树
    deleteT = _ => {
        if (this.state.selectedTreeId) {
            let _this = this;
            confirm({
                title: '删除',
                content: '删除后不可恢复,确定删除吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    let params = _this.state.selectedTreeId;
                    deleteJG({ id: params }).then(res => {
                        _this.getTreeAll();
                    }).catch(res => {
                        console.log(res)
                    })
                },
            });
            
        }else{
            message.warning('请先选择机构！')
        }
        
    }
    // 保存
    handleOk = _ => {
        this.props.form.validateFieldsAndScroll([`orgFullName`, `orgShortName`, `orgNum`, `orgCode`], {}, (err, val) => {
            let params = Object.assign(val,{orgParentId:this.state.selectedTreeId})
            console.log(params)
            if (this.state.title == '添加机构') {
                // if(this.addrules.orgFullName.length >0 && this.addrules.orgShortName.length > 0){
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
                let param2 = Object.assign(val,{id:this.state.selectedTreeId})
                delete param2.orgParentId
                console.log(param2);
                saveEditJG(param2).then(res => {
                    console.log(res);
                    this.setState({ edit: false })
                    this.getTreeAll();
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
    }
    onSelectChange2 = (selectedRowKeys2, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRows);
        this.setState({ selectedRowKeys2 });
        let arr = [];
        for (let p of selectedRows) {
            arr.push(p.id)
        }
        this.setState({ userIds: Array.from(new Set(arr)) })
        console.log(this.state.userIds)
    }
    // 树选中后
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
            this.setState({ selectedTreeId: selectedKeys[0] })
        // console.log(selectedKeys[0])
        let pdata = Object.assign({}, {orgId:selectedKeys[0]},this.state.pageConf)
            this.checkPeo(pdata);
        
    };
    //拖拽结束时执行
    onDragEnd = info => {
         alert(1)
    }
    //拖拽tree，判断为哪个位置
    onDrop = info => {
        const dropKey = info.node.props.eventKey;//目标节点
        const dragKey = info.dragNode.props.eventKey; //移动节点
        let data3 = {
            id:info.dragNode.props.eventKey,
            orgParentId:info.node.props.eventKey,
        }
        let _this = this;
            confirm({
                title: '确定移动机构吗？',
                onOk() {
                    saveEditJG(data3).then(res =>{
                        console.log(res);
                        _this.getTreeAll();
                    }).catch( err =>{
                        console.log(err)
                    })
                },
            });
        
        // const dropPos = info.node.props.pos.split('-');
        // const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        // const loop = (data, key, callback) => {
        //     data.forEach((item, index, arr) => {

        //         if (item.key === key) {

        //             return callback(item, index, arr);
        //         }
        //         if (item.children) {
        //             return loop(item.children, key, callback);
        //         }
        //     });
        // };
        // const data = [...this.state.treeData];

        // // Find dragObject
        // let dragObj;
        // loop(data, dragKey, (item, index, arr) => {
        //     arr.splice(index, 1);
        //     dragObj = item;
        // });

        // if (!info.dropToGap) {
        //     // Drop on the content
        //     loop(data, dropKey, item => {
        //         item.children = item.children || [];
        //         // where to insert 示例添加到尾部，可以是随意位置
        //         item.children.push(dragObj);
        //     });
        // } else if (
        //     (info.node.props.children || []).length > 0 && // Has children
        //     info.node.props.expanded && // Is expanded
        //     dropPosition === 1 // On the bottom gap
        // ) {
        //     loop(data, dropKey, item => {
        //         item.children = item.children || [];
        //         // where to insert 示例添加到头部，可以是随意位置
        //         item.children.unshift(dragObj);
        //     });
        // } else {
        //     let ar;
        //     let i;
        //     loop(data, dropKey, (item, index, arr) => {
        //         ar = arr;
        //         i = index;
        //     });
        //     if (dropPosition === -1) {
        //         ar.splice(i, 0, dragObj);
        //     } else {
        //         ar.splice(i + 1, 0, dragObj);
        //     }
        // }

        // this.setState({
        //     treeData: data,
        // });
    };
    checkPeo = (params) => {
		// let params = Object.assign({}, this.state.pageConf, {orgId:Number(orgId)})
		checkRY(params).then(res => {
			if (res.success == 1) {
				let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
				let pageConf = {
					limit: res.data.size,
					offset: (res.data.current - 1) * 10
				}
				this.setState({ tabledata: res.data.records, pagination: pagination,  })
			}
		})
	}
    // 点击查询按钮
    checkPeoId() {
        this.props.form.validateFields(null, {}, (err, val) => {
            let params = Object.assign({ orgId: this.state.selectedTreeId }, val,this.state.pageConf)
            checkRY(params).then(res => {
                let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
                console.log(res);
                this.setState({ tabledata: res.data.records })
                this.setState({ pagination: pagination })
                this.setState({ realName: '', userName: '', realName: null })
            }).catch(err => {
                console.log(err)
            })
        })
        
    }
    clear = () =>{
        this.props.form.resetFields();
    }
    // 关联机构人员按钮点击
    check = _ => {
        if(this.state.selectedTreeId){
            this.setState({ visible: true })
            // 渲染弹框里的表格 查询所有人员
            this.checkAllPeople(this.state.pageConf2)
        }else{
            message.warning('请先勾选机构!')
        }
        
    }
    // 解除关联人员
    deletePeo() {
        console.log(this.state.tableID)
        let data = {
            // orgId: this.state.selectedTreeId,
            userIds: this.state.tableID,
        }
        if (this.state.tableID.length > 0) {
            let _this = this;
            confirm({
                title: '解除关联',
                content: '解除后不可恢复,确定解除吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    deleteGL(data).then(res => {
                        console.log(res);
                        if (res.status == '200') {
                            let data = Object.assign({}, {orgId:_this.state.selectedTreeId},_this.state.pageConf)
                            _this.checkPeo(data);
                            message.success('解除成功')
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                },
            });
            
        } else {
            message.warning('请先勾选解除关联人员!')
        }

    }
    // 查询所有人员
    checkAllPeople(param2){
        let data = {
            // offset: this.pageLogList.pageNum,
            // limit: this.pageLogList.pageSize,
        }
        checkRY(param2).then(res => {
            console.log(res);
            let pagination2 = {
                pageSize: res.data.size,
                current: res.data.current,
                total: res.data.total,
            }
            console.log(res);
            this.setState({ tableLogdata: res.data.records })
            this.setState({ pagination2: pagination2 })
        })
    }
    // 弹框里的人员查询
    checkDialogData() {
        this.props.form.validateFields(null, {}, (err, val) => {
            let params = Object.assign({}, val,this.state.pageConf2)
            checkRY(params).then(res => {
                let pagination = {
					pageSize: res.data.size,
					current: res.data.current,
					total: res.data.total,
				}
                this.setState({ tableLogdata: res.data.records })
                this.setState({ pagination2: pagination })
            }).catch(err => {
                console.log(err)
            })
        })
        
    }
     // 点击弹框里的保存按钮添加人员
     JGsave(){
        let data ={
            orgId:this.state.selectedTreeId,
            userIds:this.state.userIds
        }
        if(this.state.userIds.length > 0){
            releGL(data).then(res =>{
                console.log(res);
                this.state.visible = false;
                if(res.status == '200'){
                    let data = Object.assign({}, {orgId:this.state.selectedTreeId},this.state.pageConf)
                    this.checkPeo(data);
                    this.state.selectedRowKeys = [];
                    this.state.selectedRowKeys2 = [];
                    message.success('关联成功')
                }
                // this.dialogData = res.data;
            }).catch( err =>{
                console.log(err)
            })
        }else{
            message.warning('请先勾选关联人员!')
        }
         
    }
    // 分页页码变化
	pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, {orgId:this.state.selectedTreeId},{ offset: (current - 1) * 10 });
        this.checkPeo(pageConf)
	}
	// 分页条数变化
	pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf,{orgId:this.state.selectedTreeId},{ limit: pageSize });
		this.checkPeo(pageConf)
    }
    // 分页页码变化
	pageIndexChange2 = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf2,{ offset: (current - 1) * 10 });
        this.checkAllPeople(pageConf)
	}
	// 分页条数变化
	pageSizeChange2 = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf2,{ limit: pageSize });
		this.checkAllPeople(pageConf)
	}
    onRow = (record) =>{
        return {
            onClick: () =>{
                const {selectedRowKeys,tableID} = this.state;
                selectedRowKeys.indexOf(record.id) > -1 ? selectedRowKeys.splice(selectedRowKeys.indexOf(record.id),1) : selectedRowKeys.push(record.id);
               // userIds.indexOf(record.id) > -1 ? userIds.splice(userIds.indexOf(record.id),1) : userIds.push(record.id);
            //    tableID = [...selectedRowKeys]
               this.setState({selectedRowKeys,tableID:selectedRowKeys});
            }

        }
    } 
    render = _ => {
        const { getFieldDecorator } = this.props.form
        const { selectedRowKeys,selectedRowKeys2 } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const rowSelection2 = {
            selectedRowKeys2,
            onChange: this.onSelectChange2
        };
        return <div  className="my_height" >
            <Row className="my_height" style={{paddingTop:'0px'}}>
                <Col span={5} className="my_height oragizTree" style={{ borderRight: '4px solid #E8E8E8',}}>
                    {
                        this.state.treeData.length > 0 &&
                        <TreeNode
                            className=""
                            draggable
                            blockNode
                            addTree={this.add}
                            editTree={this.edit}
                            deletetTree={this.deleteT}
                            // style={{position:'absolute',width:'100%',top:'50px',bottom:'0', overflow: 'auto'}}
                            defaultExpandAll={true}
                            autoExpandParent={true}
                            onSelect={this.onSelect}
                            onDragEnter={this.onDragEnter}
                            onMouseDown={this.onDragEnd}
                            onDrop={this.onDrop}
                            treeData={this.state.treeData}
                        />
                    }
                    
                </Col>
                <Col span={19} className="my_height" style={{ paddingLeft: '10px', paddingTop:'8px',background: "#fff"}}>
                    <Form style={{ width: '100%' ,}}>
                        <Row gutter={24}>
                            {this.state.rules.map((val, index) =>
                                <Col key={index} span={6} style={{ display: 'block' }}>
                                    <FormItem
                                        label={val.label} labelCol={{ span: 7 }}>
                                        {getFieldDecorator(val.key, val.option)(val.render())}
                                    </FormItem>
                                </Col>)}
                            <Button type="primary" style={{ marginLeft: '10px' , marginTop:'5px'}} onClick={this.checkPeoId}>查询</Button>
                            <Button type="info" style={{ marginLeft: '10px' , marginTop:'5px'}} onClick={this.clear}>清空</Button>
                        </Row>
                        <Row style={{ marginTop: '0px' ,textAlign:"right"}}>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.check}>关联机构人员</Button>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.deletePeo}>解除关联人员</Button>
                        </Row>
                    </Form>
                    <Table
                        bordered
                        rowKey="id"
                        // size="small"
                        onRow={this.onRow}
                        rowSelection={rowSelection}
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={{y:'calc(100vh - 350px)'}}
                        style={{ marginTop: '16px' }}
                    />
                    <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
                </Col>
            </Row>
            <Modal title='关联人员'
                onOk={this.JGsave}
                visible={this.state.visible}
                // confirmLoading={this.state.loading}
                // onCancel={this.props.onCancel}
                onCancel={_ => this.setState({ visible: false })}
                width={900}
                style={{ top: 50, marginBottom: 100 }}
                okText="提交"
                cancelText="取消">
                <Form>
                    <Row gutter={2}>
                        {this.state.pepplerules.map((val, index) =>
                            <Col key={index} span={8} style={{ display: 'block' }}>
                                <FormItem
                                    label={val.label} labelCol={{ span: 7 }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>)}
                            <Button type="primary" style={{ marginLeft: '10px',marginTop: '5px' }} onClick={this.checkDialogData}>查询</Button>
                            <Button type="info" style={{ marginLeft: '10px',marginTop: '5px' }} onClick={this.clear}>清空</Button>
                          
                    </Row>
                </Form>
                <Table
                        bordered
                        rowKey="id"
                        rowSelection={rowSelection2}
                        dataSource={this.state.tableLogdata}
                        columns={this.state.peocolumns}
                        pagination={false}
                        // size={}
                        scroll={{ x: 800, y: 300 }}
                        style={{ marginTop: '0px' }}
                    />
                <Pagination current={this.state.pagination2.current} pageSize={this.state.pagination2.pageSize} total={this.state.pagination2.total} onChange={this.pageIndexChange2} onShowSizeChange={this.pageSizeChange2} />
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













