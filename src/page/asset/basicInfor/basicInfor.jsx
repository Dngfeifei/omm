import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, DatePicker,Upload,Icon } from 'antd'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"


import { GetBasicTree,AddTable,EditTable, DelTable,GetTable, DelRole,getAllBaseDataTypes,getBasicSearchData,getBaseData } from '/api/assets.js'
import { GetDictInfo } from '/api/dictionary'
import Pagination from '/components/pagination'//分页组件
import {rules,assetsListData,columns,panes,conditionalData,baseData} from './basicInfor.js'//获取页面渲染配置项
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
let timeout;
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list['id'];
        list.value = list['id'];
        if (list.hasOwnProperty("name")) {
            list.title = list['name'];
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
                columns: columns,
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
            basedataTypeList:[],//数据类别数据包
            productLevel:[],//产品等级数据包
            //新增修改角色组弹窗配置
            roleGroupWindow: {
                roleGroupModal: false, //弹窗是否显示可见
                roleGroupModalType: 0, //0新增  1修改
                roleGroupModalTitle: "新增",//弹窗title
            },
            //资源树新增编辑参数数据 
            newRoleGroup: {
                //tree当前选中项ID
                treeSelect: null,
                //新增或修改后的资源树名称
                newRoleGroupVal: null,
                //新增或修改后的资源树编码
                newRoleGroupCode: null,
                //新增或修改后的资源树上级分类
                newRoleGroupType: null,
                //新增或修改后的资源树数据类别
                newBaseDataTypes: null,
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
            searchListName: null,
            basedataTypeId: null,
            basedataTypeName: null,
            basedataTypeIdSelect: 0,
            TreeParantID:null,
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
            
            serviceRegionList:[],     //每个面板二级弹出框显示内容
            assetsList: assetsListData, //每个面板的第一层弹框显示内容
            baseData:baseData, //基本需上传字段数据
            searchData:[],//联想查询输入回传数据
            searchX:undefined        //联想查询输入数据
        }
    }
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100 < 0 ? 120 : this.tableDom.clientHeight - 120 ;
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
        this.init();
        this.searchTree(1)
    }
    //初始化数据
    init = () => {
        //数据类别下拉数据初始化
        getAllBaseDataTypes({}).then(res => {
            if (res.success == 1) {
                this.setState({basedataTypeList:res.data})
            } else {
                message.error(res.message)
            }
        })
        //产品等级下拉数据初始化
        getBaseData({}).then(res => {
            if (res.success == 1) {
                let {productLevel} = this.state;
                this.setState({productLevel:res.data.productLevel})
            } else {
                message.error(res.message)
            }
        })
    }
    //基础树结构数据查询
    searchTree = async (pass) => {
        //请求树结构数据 右侧表格渲染第一列角色数据
        GetBasicTree({type:'basedata'})
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
                    if (pass && res.data) {
                        this.setState({
                            searchListID: res.data[0]['id'],
                            searchListName:res.data[0]['name'],
                            TreeParantID: res.data[0]['parentId'],
                            basedataTypeId: res.data[0]['basedataTypeId'],
                            basedataTypeName: res.data[0]['basedataTypeName'],
                            newRoleGroup:{
                                treeSelect:res.data[0]['parentId'],
                                newRoleGroupVal:null,
                                newRoleGroupCode:null,
                                newRoleGroupType:null
                            }
                        })
                        // this.getBaseData(res.data[0].id)
                        this.searchRoleFun(res.data[0]['id'])//此处获取表格数据修改为先获取基础数据包再获取表格数据进行展示
                    }
                }
            })
    }
    //获取表格数据
    searchRoleFun = (parentId,pass) => {
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (parentId == "" || parentId == null) {
            message.warning('请先选中左侧树节点，然后再进行查询！');
            return
        }
        // const fieldNames = this.state.rules['rules1'].map(item => item.key)
        let x = this.state.searchX?this.state.searchX:'';//this.props.form.getFieldsValue(['x']).x ? this.props.form.getFieldsValue(['x']).x :''
        // 2 发起查询请求 查询后结构给table赋值
        let params = pass ? Object.assign({},{x}, {parentId},this.state.pageConf) : Object.assign({},{x}, {parentId},this.state.pageConf, { offset: 0 })
        GetTable(params).then(res => {
            if (res.success == 1) {
                let data = Object.assign({}, this.state.table, {
                    rolesData:res.data.records ? res.data.records : []
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
        console.log(selectedKeys,info)
        if (!info.selected) {
            let table = Object.assign({}, this.state.table, { rolesData: [] })
            let pagination = Object.assign({}, this.state.pagination, {
                total: 0,
                current: 1,
            })
            let pageConf = Object.assign({}, this.state.pageConf, {
                offset: 0,
            })
            this.setState({ table: table, pagination: pagination, pageConf: pageConf,searchListID: null,searchListName:null,newRoleGroup:{
                treeSelect:null,
                newRoleGroupVal:null,
                newRoleGroupCode:null,
                newRoleGroupType:null
            }})
            return
        }
        let data = info.selectedNodes[0].props.dataRef
        this.setState({
            searchListID: data['id'],
            searchListName:data['name'],
            TreeParantID: data['parentId'],
            basedataTypeId: data['basedataTypeId'],
            basedataTypeName: data['basedataTypeName'],
            tableSelecteds: [],
            tableSelectedInfo: [],
            newRoleGroup:{
                treeSelect:data['parentId'],
                newRoleGroupVal:null,
                newRoleGroupCode:null,
                newRoleGroupType:null
            }
        },()=>{
            // 选中后请求列表数据
            let {searchListID} = this.state;
            this.searchRoleFun(searchListID)
        })
    };
    // 打开节点
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    //获取新增或修改后的资源树名称
    getNewRoleGroupVal = (type,val) => {
        let obj = {};
        obj[type] = val;
        let newRoleGroup = Object.assign({}, this.state.newRoleGroup, obj)
        this.setState({
            newRoleGroup: newRoleGroup
        })
    }
    //点击行选中选框
    onRow = (record,index) => {
        return {
            onClick: () => {
                let selectedKeys = [`key${index}`], selectedItems = [record];
                this.onTableSelect(selectedKeys, selectedItems);
            }
        }
    }
    // 资产表格数据查询
    onSearch = () => {
        let id = this.state.searchListID;
        this.setState({searchX:undefined})
        this.searchRoleFun(id);
    }
    openModal = (roleModalType) => {
        let {searchListID,table,tableSelectedInfo,baseData} = this.state,roleModalTitle = null;
        if(roleModalType == 0){
            if (searchListID == "" || searchListID == null) {
                message.warning('请先选中左侧树节点！');
                return
            }
            roleModalTitle = "新增资产配置";
            this.setState({
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                },
                basedataTypeIdSelect:''
            })
        }else{
            if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
                message.destroy()
                message.warning("没有选中数据,无法进行修改!")
                return
            }
            roleModalTitle = roleModalType == 1 ? "修改资产配置" : "查看资产配置";
            this.setState({
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                },
                basedataTypeIdSelect:tableSelectedInfo.basedataTypeId
            })
        }
        
    }

    //表格单项删除
    delRoleItem = async (arr) => {
        if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
            message.destroy()
            message.warning("没有选中数据,无法进行删除!")
            return;
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
                DelTable({ ids: [id] }).then(res => {
                    if (res.success == 1) {
                        _this.searchRoleFun(_this.state.searchListID)
                        _this.searchTree()
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
        // 当前表单编辑类型（保存或修改或者查看）
        let type = this.state.roleWindow.roleModalType
        let {TreeParantID,searchListID,searchListName} = this.state;
		
        
        if (!type) {
            // 新增保存
            let params = {
                ...this.state.baseData,
                parentId:searchListID,
                parentName:searchListName,
                ...newParams
            }
            AddTable(params).then(res => {
                if (res.success == 1) {
                    this.setState({
                        roleWindow: {
                            roleModal: false,
                            roleModalType: null, //0新增  1修改
                            roleModalTitle: null
                        },
                        tableSelecteds: [],
                        tableSelectedInfo: []
                    })
                    this.searchRoleFun(searchListID)
                    this.searchTree()
                    message.success("操作成功")
                } else {
                    message.error(res.message)
                }
            })
        } else {
        //     {
                // 修改保存
                let params = {
                    ...this.state.tableSelectedInfo[0],
                    ...newParams
                }

                EditTable(params).then(res => {
                    if (res.success == 1) {
                        this.setState({
                            roleWindow: {
                                roleModal: false,
                                roleModalType: null, //0新增  1修改
                                roleModalTitle: null
                            },
                            tableSelecteds: [],
                            tableSelectedInfo: []
                        })
                       this.searchRoleFun(searchListID)
                       this.searchTree()
                        message.success("操作成功")
                    } else {
                        message.error(res.message)
                    }
                })
            }
         })
    }
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        // let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        },()=>{
            this.searchRoleFun(this.state.searchListID,1)
        })
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        },()=>{
            this.searchRoleFun(this.state.searchListID,1)
        })
    }

    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info,
        })
    };
    //生成新增/修改/查看弹框内容
    getFields = (assetsList) => {
        // const {assetsList} = this.state;
        let {roleWindow,tableSelectedInfo,baseData,searchListID,searchListName,basedataTypeIdSelect,basedataTypeId,basedataTypeName} = this.state;
        const { getFieldDecorator } = this.props.form;
        baseData = Object.assign({}, baseData, { parentId:  searchListID,parentName:searchListName,basedataTypeId,basedataTypeName});
        const children = [];
        for (let i = 0; i < assetsList.length; i++) {
            let label = assetsList[i].label,disabled = false;
            if(basedataTypeIdSelect == 13){           //特殊处理
                if(assetsList[i].key == 'code'){
                    console.log(assetsList[i])
                    label = '产品型号'
                }
                if(assetsList[i].key == 'name'){
                    label = '产品名称'
                }
            }else{
                if(assetsList[i].key == 'intValue1'){
                    continue;
                }
            }
            //当打开窗口为修改时，数据类别字段禁止编辑
            if(roleWindow.roleModalType == 1 && assetsList[i].key == 'basedataTypeId'){
                disabled = true
            }
          children.push(
            <Col span={assetsList[i].span} key={i}>
              <Form.Item label={label}>
                {getFieldDecorator(assetsList[i].key, {
                  rules: roleWindow.roleModalType == 2 ? [] : assetsList[i].rules,
                  initialValue: !roleWindow.roleModalType ? baseData[assetsList[i].key] : isNaN(tableSelectedInfo[0][assetsList[i].key]) ? tableSelectedInfo[0][assetsList[i].key] : tableSelectedInfo[0][assetsList[i].key]+''
                })(roleWindow.roleModalType == 2 ? assetsList[i].render(this,disabled) : assetsList[i].render(this,disabled))}
              </Form.Item>
            </Col>,
          );
        }
        return children;
      }
     //特殊处理选择数据类别
     onChange = (value)=>{
        this.setState({basedataTypeIdSelect:value})
     }
    //重置查询条件
    clearSearchprops = () => {
        // this.props.form.resetFields(['searchName'])
        this.setState({searchX:undefined});
    }
    //设置显示表格内容
    getClums = (data) => {
        const {basedataTypeId} = this.state;
        let newColumns = data[0].data;
        data.forEach((item) => {
            if(item.type.indexOf(Number(basedataTypeId)) > -1){
                newColumns = item.data;
            }
        })
        return newColumns;
    }
    swich = false

    //联想查询数据切换
    handleSearch = value => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(()=>{
             console.log(value)
            if (value) {
                getBasicSearchData({x:value}).then(res =>{
                    if (res.success != 1) {
                        message.error("请求错误")
                        this.setState({ searchData: [] });
                        return
                    }else{
                        // let data = res.data.unshift(value)
                        this.setState({searchData:res.data,searchX:value})
                    }
                });
            }else if(value === '' && this.swich){
                this.setState({searchData:[],searchX:undefined})
            }else {
                this.setState({ searchData: [] });
            }
        }, 300);
    };
    //联想输入输入数据回填
    handleChange = searchX => {
        this.setState({ searchX });
    };
    render = _ => {
        const { h,assetsList } = this.state;
        const { columns } = this.state.table;
        const { getFieldDecorator } = this.props.form;
        const column = this.getClums(columns) ? this.getClums(columns) : [];
        const assetsLists = this.getClums(assetsList) ? this.getClums(assetsList) : [];
        return <div style={{ border: '0px solid red', background: ' #fff', height: '100%'}} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row assetsTree" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant edit={false} treeData={this.state.tree.treeData} selectedKeys={[this.state.searchListID]}
                       addTree={this.addRoleGroup} editTree={this.editRoleGroup} deletetTree={this.delRoleGroup}
                       onExpand={this.onExpand} onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '16px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form id="assetsForm" layout='inline' style={{ width: '100%' }}>
                        <Row>
                        {this.state.rules['rules1'].map((val, index) =>
                            // <FormItem
                            //     label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            //     {getFieldDecorator(val.key, val.option)(val.render(this))}
                            // </FormItem>
                            <FormItem
                            label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {val.render(this)}
                        </FormItem>)}
                            <FormItem style={{flex:'auto',textAlign:'right'}}>
                                <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                                <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={12} style={{ textAlign: 'left'}}>
                                {/* <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>模板下载</Button>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>导出</Button>
                                <Upload>
                                    <Button>
                                    <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload> */}
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(2)}>查看</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>删除</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(1)}>修改</Button>
                                <Button type="primary" onClick={(e) => this.openModal(0)}>新增</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto',height: 10 }} ref={(el) => this.tableDom = el}>
                        <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.table.rolesData} columns={column} style={{ marginTop: '20px',maxHeight:'86%' }} rowKey={(record, index) => `key${index}`} pagination={false} scroll={h} size="small" />
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
                className={this.state.roleWindow.roleModalType == 2 ? 'seeModal' : ''}
            >
                {
                    <Form id="assetsBoxFrom" layout='inline'>
                        <Row gutter={[24,15]}>{ this.getFields(assetsLists)}</Row>
                    </Form>
                }
            </Modal>
            {/* 资源树新增修改弹窗 */}
            <Modal
                title={this.state.roleGroupWindow.roleGroupModalTitle}
                visible={this.state.roleGroupWindow.roleGroupModal}
                onCancel={_ => this.setState({ roleGroupWindow: { roleGroupModal: false } })}
                onOk={this.saveRoleGroup}
                cancelText="取消"
                okText="保存"
            >
                <Form id="resourceTree" layout='inline' style={{ width: '100%'}}>
                    <FormItem
                        label={"名称"} style={{ marginBottom: '8px',width:'100%',display:'flex' }} required>
                        <Input placeholder="请输入" value={this.state.newRoleGroup.newRoleGroupVal} onChange={({target:{value}}) => this.getNewRoleGroupVal('newRoleGroupVal',value)} />
                    </FormItem>
                    <FormItem
                        label={"编码"} style={{ marginBottom: '8px',width:'100%',display:'flex' }} required>
                        <Input placeholder="请输入" value={this.state.newRoleGroup.newRoleGroupCode} onChange={({target:{value}}) => this.getNewRoleGroupVal('newRoleGroupCode',value)} />
                    </FormItem>
                    <FormItem
                        label={"上级分类"} style={{ marginBottom: '8px',width:'100%',display:'flex' }} required>
                        <Select placeholder="请选择" value={this.state.newRoleGroup.newRoleGroupType} ononChange={(value) => this.getNewRoleGroupVal('newRoleGroupType',value)}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label={"数据类别"} style={{ marginBottom: '8px',width:'100%',display:'flex' }} required>
                        <Select placeholder="请选择" value={this.state.newRoleGroup.newBaseDataTypes} ononChange={(value) => this.getNewRoleGroupVal('newBaseDataTypes',value)}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    }

}
const assetsAllocations = Form.create()(assetsAllocation)
export default assetsAllocations













