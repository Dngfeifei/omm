import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, DatePicker,Upload,Icon } from 'antd'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"


import { GetRoleTree, AddRoleGroup, EditRoleGroup, DelRoleGroup, GetRole, AddRole, EditRole, DelRole, GetResourceTree } from '/api/role.js'
import { GetDictInfo } from '/api/dictionary'
import Pagination from '/components/pagination'//分页组件
import {rules,assetsListData,columns} from './basicInfor.js'//获取页面渲染配置项
import '@/assets/less/pages/assets.less'
//引入状态管理
import { connect } from 'react-redux'
// 引入时间选择器
const { MonthPicker, RangePicker } = DatePicker;
const { confirm } = Modal;
const { TreeNode } = Tree;
const { Option } = Select;
const FormItem = Form.Item
const { TextArea } = Input;
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("title")) {
            list.title = list.title;
        }
        if (list.hasOwnProperty("children")) {
            list.disabled = 1;
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}
@connect(state => ({
    activeKey: state.global.activeKey,
}), dispath => ({
}))
class assetsAllocation extends Component {
    constructor (props){
        super(props)
        this.state = {
            // 表格默认滚动高度
            h: { y: 240 },
            // 首次进入 
            newEntry: true,
            // tree节点搜索高亮配置
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
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
            // 分页配置

            //左侧角色树相关数据
            tree: {
                //右侧角色树数据
                treeData: [],
            },
            //右侧table相关数据
            table: {
                //右侧角色表格配置
                columns: columns['columns1'],
                //右侧角色表格数据
                rolesData: [],
               
    
            },  
            rules: rules,    //每个面板的查询条件配置
            //二级面板显示配置
            secondWindow: {
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
            //新增修改产看弹窗配置
            roleWindow: {
                roleModal: false,
                roleModalType: 0, //0新增  1修改
                roleModalTitle: "新增"
            },
            //右侧查询表单参数
            searchRoleName: null,
            searchListID: null,
            //当前选中角色数据
            currentRole: {
                id: null,
                roleName: null,
                status: null,
                resources: [],
            },
            //表格选中项
            tableSelecteds: [],
            tableSelectedInfo: [],
            
            serviceRegionList:{},     //每个面板二级弹出框显示内容
            assetsList: assetsListData, //每个面板的第一层弹框显示内容
            assetsPostData:{            //每个面板查看修改数据的时候要回显的数据存储,共用一个
                1:'23',
                2:'',
                3:'',
                4:'',
                5:'',
                6:'',
                7:'',
                8:'',
                9:'',
                10:''
            }
        }
    }
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100 < 0 ? 100 : this.tableDom.clientHeight - 100 ;
            console.log(h)
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", ()=>{
            if(this.props.activeKey == this.props.params.type) this.SortTable();
        }, false)
    }
    async componentWillMount() {
        // 查询左侧树，以及初始表格数据
        this.searchTree()
    }
    

    //资产树结构数据查询
    searchTree = async () => {
        //请求角色组数据 右侧表格渲染第一列角色数据
        GetRoleTree()
            .then(res => {
                if (res.success != 1) {
                    message.error("请求错误")
                    return
                } else {
                    assignment(res.data)
                    this.setState({
                        tree: { treeData: res.data },
                    })
                    // this.generateList(res.data)
                    if (res.data) {
                        this.setState({
                            searchListID: res.data[0].id,
                        })
                        this.searchRoleFun(res.data[0].id)
                    }
                }
            })
    }
    //获取表格数据
    searchRoleFun = (id) => {
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        const fieldNames = this.state.rules['rules1'].map(item => item.key)
        let formValues = this.props.form.getFieldsValue(fieldNames)
        // 2 发起查询请求 查询后结构给table赋值
        let params = Object.assign({},formValues, this.state.pageConf, { offset: 0 })
        GetRole(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData: res.data.records
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
            } else {
                message.error(res.message)
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
                },
                searchListID: []
            })
            let table = Object.assign({}, this.state.table, { rolesData: [] })
            let pagination = Object.assign({}, this.state.pagination, {
                total: 0,
                current: 1,
            })
            let pageConf = Object.assign({}, this.state.pageConf, {
                offset: 0,
            })
            this.setState({ table: table, pagination: pagination, pageConf: pageConf })
            return
        }
        let data = info.selectedNodes[0].props.dataRef
        this.setState({
            newRoleGroup: {
                treeSelect: data.id,
                newRoleGroupVal: data.roleCategoryName
            },
            searchListID: data.id,
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        // 选中后请求角色数据
        this.searchRoleFun(data.id)
    };
    // 打开节点
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    //获取新增或修改后的角色组名称
    getNewRoleGroupVal = (e) => {
        let newRoleGroup = Object.assign({}, this.state.newRoleGroup, { newRoleGroupVal: e.target.value })
        this.setState({
            newRoleGroup: newRoleGroup
        })
    }
    //点击行选中选框
    onRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id], selectedItems = [record];
                this.setState({
                    tableSelecteds: selectedKeys,
                    tableSelectedInfo: selectedItems
                })
            }
        }
    }
    // 资产表格数据查询
    onSearch = () => {
        let id = this.state.searchListID
        let name = this.state.searchRoleName
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.destroy()
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        this.searchRoleFun(id);
    }
    // 查询列表数据
    searchRoleNameFun2 = (pageConf) => {
        let id = this.state.searchListID
        let name = this.state.searchRoleName
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.destroy()
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求角色数据
        let params = Object.assign({}, {
            roleCategoryId: id,
            roleName: name,
        }, pageConf)

        GetRole(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData: res.data.records
                })
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total,
                    pageSize: res.data.size,
                    current: res.data.current,
                })
                let pageConf = Object.assign({}, this.state.pagination, {
                    limit: res.data.size,
                    offset: (res.data.current - 1) * res.data.size,
                })
                this.setState({ table: data, pagination: pagination, pageConf: pageConf })
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
                roleModalTitle: "新增资产配置"
            },
        })
    }
    // 点击修改，按钮的弹出框
    editRoleItem = () => {
        if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
            message.destroy()
            message.warning("没有选中数据,无法进行修改!")
            return
        }
        let row = this.state.tableSelectedInfo[0];
        // let ids = [];
        // if (row.resources && row.resources.length > 0) {
        //     if (row.resources[0]) {
        //         row.resources.forEach(item => { 
        //             //代码修改过，源代码为 ids.push(item.id)
        //             let item1 = this.getId(this.state.resourceData,item.id);
        //             !item1 && ids.push(item.id);     
        //             //代码修改过，源代码为 ids.push(item.id)
        //         })
        //     }
        // }
        this.setState({
            roleWindow: {
                roleModal: true,
                roleModalType: 1,
                roleModalTitle: "修改资产配置"
            }
        })
    }

    //角色表格单项删除
    delRoleItem = async (arr) => {
        if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
            message.destroy()
            message.warning("没有选中数据,无法进行删除!")
        }
        let id = this.state.tableSelectedInfo[0].id;
        let _this = this
        confirm({
            title: '删除',
            content: '删除后不可恢复,确定删除吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelRole({ ids: [id] }).then(res => {
                    if (res.success == 1) {
                        _this.searchRoleFun(_this.state.searchListID)
                        _this.setState({
                            tableSelecteds: [],
                            tableSelectedInfo: []
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            }
        })
    }
    // 新增/编辑数据保存
    editRoleSave = async () => {
        // 1 校验必填数据是否填写
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            console.log(fieldsValue);
            let newParams = {...fieldsValue}
            //获取列表数据
        //      getWorkList(this.state.pageSize, this.state.current,newParams).then(res => {
        //         if (res.success == 1) {
        //             this.setState({ loading: false })
        //             this.setState({
        //                 tabledata: res.data.records,
        //                 total: parseInt(res.data.total)
        //             })
        //         } else if (res.success == 0) {
        //             message.error(res.message);
        //         }
        //     })
        // });

        
        // // 当前表单编辑类型（保存或修改）
        let type = this.state.roleWindow.roleModalType
        // // 当前选择的角色组ID
        let id = this.state.searchListID
        // // 资源树选中数组
        // let resourceArr = []
		
		// //重新格式化上传数据
        // let updata = [];
        // if (formData.resources && formData.resources.length > 0) {
        //     formData.resources.forEach(item => {
        //         let item1 = this.getParentId(this.state.resourceData,item);
        //         updata = [...updata,...item1,...[item]];
        //     })
        // }
        // updata = Array.from(new Set(updata))
        // if (updata && updata.length > 0) {
        //     updata.forEach(item => {
        //         resourceArr.push({ id: item })
        //     })
        // }
        // if (!type) {
        //     // 新增保存
        //     let params = {
        //         roleName: formData.roleName,
        //         status: formData.status,
        //         resources: resourceArr,
        //         roleCategoryId: id
        //     }
        //     if (this.state.lock) {
        //         return
        //     } else {
        //         this.setState({ lock: true })
        //     }
        //     AddRole(params).then(res => {
        //         if (res.success == 1) {
        //             this.setState({
        //                 roleWindow: {
        //                     roleModal: false,
        //                     roleModalType: null, //0新增  1修改
        //                     roleModalTitle: null
        //                 },
        //                 currentRole: {
        //                     roleCode: null,
        //                     roleName: null,
        //                     status: null,
        //                     resources: [],
        //                 },
        //                 tableSelecteds: [],
        //                 // tableSelectedInfo: []
        //             })
        //             this.searchRoleFun(id)
        //             message.success("操作成功")
        //         } else {
        //             message.error(res.message)
        //         }
        //         this.setState({ lock: false })
        //     })
        // } else {
        //     {
        //         // 修改保存
        //         let params = {
        //             roleName: formData.roleName,
        //             status: formData.status,
        //             id: formData.id,
        //             resources: resourceArr
        //         }
        //         if (this.state.lock) {
        //             return
        //         } else {
        //             this.setState({ lock: true })
        //         }

        //         EditRole(params).then(res => {
        //             if (res.success == 1) {
        //                 this.setState({
        //                     roleWindow: {
        //                         roleModal: false,
        //                         roleModalType: null, //0新增  1修改
        //                         roleModalTitle: null
        //                     },
        //                     currentRole: {
        //                         roleCode: null,
        //                         roleName: null,
        //                         status: null,
        //                         resources: []
        //                     },
        //                     tableSelecteds: [formData.id],
        //                     tableSelectedInfo: [params]
        //                 })
        //                 this.searchRoleFun(id)
        //                 message.success("操作成功")
        //             } else {
        //                 message.error(res.message)
        //             }
        //             this.setState({ lock: false })
        //         })
            // }
         })
    }
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        this.searchRoleNameFun2(pageConf)
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        // let pagination = Object.assign({}, this.state.pageConf, { pageSize: pageSize });
        // this.setState({
        //     pageConf: pageConf,
        // })
        // this.searchRoleNameFun2(pageConf)
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        this.searchRoleNameFun2(pageConf)
    }

    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info
        })
    };
	 //判断该节点是否渲染
    getId = (list,id)=>{
        for (let i in list) {
			if(list[i].id==id && list[i].children && list[i].children.length){
				return true
			}
			if(list[i].children){
				let node= this.getId(list[i].children,id);
				if(node){
					return true
				}
			}
        } 
    }
    //生成新增/修改/查看弹框内容
    getFields = (assetsList) => {
        // const {assetsList} = this.state;
        const {assetsPostData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < assetsList.length; i++) {
          children.push(
            <Col span={assetsList[i].span} key={i}>
              <Form.Item label={assetsList[i].label}>
                {getFieldDecorator(`field-${i}`, {
                  rules: assetsList[i].rules,
                  initialValue: assetsPostData[assetsList[i].key],
                })(assetsList[i].render(this))}
              </Form.Item>
            </Col>,
          );
        }
        return children;
      }
    render = _ => {
        const { h } = this.state;
        const { getFieldDecorator } = this.props.form;
        return <div style={{ border: '0px solid red', background: ' #fff', height: '100%'}} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row assetsTree" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant edit={false} treeData={this.state.tree.treeData} selectedKeys={[this.state.searchListID]}
                        onExpand={this.onExpand} onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '16px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form id="assetsForm" layout='inline' style={{ width: '100%' }}>
                        <Row>
                        {this.state.rules['rules1'].map((val, index) =>
                            <FormItem
                                label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </FormItem>)}
                            <FormItem style={{flex:'auto',textAlign:'right'}}>
                                <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                                <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={12} style={{ textAlign: 'left'}}>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>模板下载</Button>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>导出</Button>
                                <Upload>
                                    <Button>
                                    <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>查看</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>删除</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={this.editRoleItem}>修改</Button>
                                <Button type="primary" onClick={this.addRoleItem}>新增</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto',height: 10 }} ref={(el) => this.tableDom = el}>
                        <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.table.rolesData} columns={this.state.table.columns} style={{ marginTop: '20px',maxHeight:'80%' }} rowKey={"id"} pagination={false} scroll={h} size="small" />
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                    </div>
                </Col>
            </Row>
            {/* 资产的新增、修改、查看弹窗 */}
            <Modal
                title={this.state.roleWindow.roleModalTitle}
                destroyOnClose
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
                width={750}
                style={{ top: 50, marginBottom: 100 }}
                okText="保存"
                cancelText="取消"
            >
                {
                    <Form id="assetsBoxFrom" layout='inline'>
                        <Row gutter={[24,15]}>{ this.getFields(this.state.assetsList['assetsListData1'])}</Row>
                    </Form>
                }
            </Modal>
        </div>
    }

}
const assetsAllocations = Form.create()(assetsAllocation)
export default assetsAllocations













