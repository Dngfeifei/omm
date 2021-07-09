import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, DatePicker,Upload,Icon,Tabs } from 'antd'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"


import { GetAllocationTree, GetAllocationTable, AddAllocationTable, EditAllocationTable, DelAllocationTable,getBaseData,getAllocationSearchData,GetAllocationArea,GetAllocationCustomer,getAllBaseDataTypes} from '/api/assets.js'
import { GetDictInfo } from '/api/dictionary'
import Pagination from '/components/pagination'//分页组件
import {panes,baseData,assetsListData} from './assetsList.js'//获取页面渲染配置项
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
const { TabPane } = Tabs;
let timeout;
const dateFormat = 'YYYY-MM-DD hh:mm:ss';
// 引入日期格式化
import moment from 'moment'
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
        let tokenName='token',header = {},actionUrl = '';
        if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
            actionUrl = process.env.API_URL
        }
        header.authorization = `Bearer ${localStorage.getItem(tokenName) || ''}`;
        this.state = {
            // 表格默认滚动高度
            h: { x:true,y: 240 },
            // tree节点搜索高亮配置
            expandedKeys: [],
            autoExpandParent: true,
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:`${actionUrl}/biConfiguration/importOldData`,
                // 接受的文件类型
                // accept: '.xls,.xlsx,.doc,.txt,.PPT,.DOCS,.XLSX,.PPTX',
                headers: header,
                multiple: true,
            },
            fileList:[],//导入文件使用
            uploadLoading:false,
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
                columns: [],
                //右侧角色表格数据
                rolesData: [],
               
    
            },  
            panes:{rules:[],columns:[],assetsListData:[],basicData:{columnsBasic:[]},subColumns:[]},      //基础显示数据
            basedataTypeList:[],
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
            TreeParantID:null,
            //表格选中项
            tableSelecteds: [],//表格选中id存储
            tableSelectedInfo: [],//表格选中行数据存储
            baseData: baseData, //基本需上传字段数据
            stretch: false,//展开查询条件
            searchParmas: {},//查询条件参数存储
            visibleModule: false, //项目选择器开关
            searchData:[],//联想查询输入回传数据
            searchX:undefined,       //联想查询输入数据
            tabPane:[
                {
                    name:'基本信息',
                    child: require('./information.jsx').default
                },
                {
                    name:'部件信息',
                    child: require('./component.jsx').default
                },
                {
                    name:'风险排查',
                    child: require('./riskInvestigation.jsx').default
                }
            ]
        }
    }
    //获取各组件所需参数并赋值
    getProps = (type) => {
        const {roleWindow,baseData,tableSelectedInfo,searchListID,searchListName,basedataTypeId,basedataTypeName,panes} = this.state;
        if(type == 0){
            return {
                baseData: roleWindow.roleModalType == 0 ? baseData : tableSelectedInfo[0],
                roleWindow,
                basedataTypeId,
                panes,
                basedataTypeName
            }
        }else if(type == 1){
            return {
                baseData: roleWindow.roleModalType == 0 ? baseData : tableSelectedInfo[0],
                roleWindow,
                basedataTypeId,
                panes,
                basedataTypeName
            }
        }
    }
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100 < 0 ? 120 : this.tableDom.clientHeight - 120 ;
            console.log(h)
            this.setState({
                h: {
                    x:8300,
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

    }
    //基础树结构数据查询
    searchTree = async (pass) => {
        //请求树结构数据 右侧表格渲染第一列角色数据
        GetAllocationTree({type:'configuration'})
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
                        let pane = this.getClums(res.data[0]['id'],panes);
                        this.setState({
                            searchListID: res.data[0]['id'],
                            searchListName:res.data[0]['name'],
                            panes:pane,
                            searchParmas: this.formatParmas(pane),
                            TreeParantID: res.data[0]['parentId'],
                            basedataTypeId: res.data[0]['basedataTypeId'],
                            basedataTypeName: res.data[0]['basedataTypeName'],
                            newRoleGroup:{
                                treeSelect:res.data[0]['parentId'],
                                newRoleGroupVal:null,
                                newRoleGroupCode:null,
                                newRoleGroupType:null
                            }
                        },()=>{
                            this.searchRoleFun(res.data[0]['id'])
                        })
                    }
                }
            })
    }
    //获取表格数据
    searchRoleFun = (parentId,pass) => {
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (parentId == "" || parentId == null) {
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        // 2 发起查询请求 查询后结构给table赋值
        let x = this.state.searchX?this.state.searchX:''
        let params = pass ? Object.assign({},this.state.searchParmas, {parentId},{x},this.state.pageConf) : Object.assign({},this.state.searchParmas, {parentId},{x},this.state.pageConf, { offset: 0 })
        GetAllocationTable(params).then(res => {
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
        let pane = this.getClums(data['basedataTypeId'],panes)
        this.setState({
            searchListID: data['id'],
            panes:pane,
            searchParmas: this.formatParmas(pane),
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
    //查询表格数据参数格式化
    formatParmas = (data) => {
        let obj = {};
        data.rules.forEach((item)=>{
            obj[item.key] = undefined;
        })
        return obj
    }
    // 打开节点
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    //点击行选中选框
    onRow = (record,index) => {
        return {
            onClick: () => {
                let selectedKeys = [`key${index}`], selectedItems = [record];
                this.onTableSelect(selectedKeys, selectedItems);
            }
        }
    }
    // 资产配置管理表格数据查询
    onSearch = () => {
        let id = this.state.searchListID;
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.destroy()
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        this.setState({searchX:undefined})
        this.searchRoleFun(id);
    }
    //回传点击查询按钮所填参数
    onChangeSearch = (field,value) => {
        let {searchParmas} = this.state;
        searchParmas[field] = value;
    }
    //打开新增、编辑、查看窗口
    openModal = (roleModalType) => {
        let {searchListID,selectData,basedataTypeId,basedataTypeName} = this.state,roleModalTitle = null;
        // this.props.form.resetFields();
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
                selectData:{...selectData, productModeType:[], productLineType:[],productBrandType:[],productSkillType:[]},
                baseData:{basedataTypeId,basedataTypeName}
            })
        }else{
            if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
                message.destroy()
                message.warning("没有选中数据,无法进行修改!")
                return
            }
            roleModalTitle = roleModalType == 1 ? "修改资产配置" : "查看资产配置";
            // console.log(tableSelectedInfo)
            // return
            this.setState({
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                }
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
                DelAllocationTable({ ids: [id] }).then(res => {
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
            // console.log(this.state.baseData);
            if (err) {
                return;
            }
            let newParams = {...fieldsValue}
        // 当前表单编辑类型（保存或修改或者查看）
        let type = this.state.roleWindow.roleModalType
        let {searchListID,searchListName} = this.state;
        
        if (!type) {
            // 新增保存
            let params = {
                ...this.state.baseData,
                parentId:searchListID,
                ...newParams
            }
            // console.log(params)
            // return
            AddAllocationTable(params).then(res => {
                if (res.success == 1) {
                    this.setState({
                        roleWindow: {
                            roleModal: false,
                            roleModalType: null, //0新增  1修改
                            roleModalTitle: null
                        },
                        tableSelecteds: [],
                        tableSelectedInfo: []
                    },()=>{
                        this.props.form.resetFields();
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
                newParams = this.setEditPost(newParams);
                let params = {
                    ...this.state.tableSelectedInfo[0],
                    ...newParams
                }
                
                // console.log(params)
                // return
                EditAllocationTable(params).then(res => {
                    if (res.success == 1) {
                        this.setState({
                            roleWindow: {
                                roleModal: false,
                                roleModalType: null, //0新增  1修改
                                roleModalTitle: null
                            },
                            tableSelecteds: [],
                            tableSelectedInfo: []
                        },()=>{
                            this.props.form.resetFields();
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
    //处理编辑修改后要提交的数据，下拉数据为空的，还原为空
    setEditPost = (newParams) => {
        const {columns} = this.state.panes,reg = /^[0-9]*[1-9][0-9]*$/,{form} = this.props;
        columns.forEach(item => {
            if(item.key != item.dataIndex){
                if(!reg.test(newParams[item.key])){
                    newParams[item.key] = '';
                }
            }
        })
        return newParams;
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
        // console.log(selectedRowKeys, info)
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info
        })
    };
     
    //重置查询条件
    clearSearchprops = () => {
        // this.props.form.resetFields(['searchName'])
        this.setState({searchX:undefined})
    }
    //设置显示表格内容
    getClums = (basedataTypeId,data) => {
        let newColumns = data[0];
        data.forEach((item,index) => {
            if(item.type.indexOf(Number(basedataTypeId)) > -1){
                newColumns = item;
            }
        })
        console.log(newColumns)
        return newColumns;
    }
    //控制查询条件伸缩显示
    setStretch = ()=>{
        const {stretch} = this.state;
        this.setState({stretch:!stretch},()=>{
            this.SortTable();
        })
    }
    
    swich = false
    //联想查询数据切换
    handleSearch = value => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(()=>{
             console.log(typeof value,value.toString())
            if (value) {
                getAllocationSearchData({x:value}).then(res =>{
                    if (res.success != 1) {
                        message.error("请求错误")
                        this.setState({ searchData: []});
                        return
                    }else{
                        // let data = res.data.unshift(value)
                        this.setState({searchData:res.data ? res.data : [],searchX:value})
                    }
                });
            }else if(value === '' && this.swich){
                this.setState({searchData:[],searchX:undefined})
            } else {
                this.setState({ searchData: [] });
            }
        }, 300);
    };
    //联想输入输入数据回填
    handleChange = searchX => {
        this.setState({ searchX });
    };
    // 文件上传
    beforeUpload = (file) => {
        console.log(file)
        let reg = /.(xlsx)|(xls)$/;
        if (!reg.test(file.name)) {
            message.error('只能上传文件名后缀为 xlsx/xls 的文件！');
            return false;
        }
        // console.log(file.size,file.size / 1024 / 1024)
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
            message.error('上传文件大小不能超过30MB!');
        }
        this.setState({uploadLoading:true})
        return isLt2M;
    }
    // 文件导入
    ClienttChange=(info)=>{
        // console.log(info)
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log(info)
            if(info.file.response.success == 1){
                message.success(`${info.file.response.message}`);
            }else{
                message.error(`${info.file.response.message}`);
            }
            this.setState({uploadLoading:false})
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！`);
          }
    }
    render = _ => {
        const { h,panes } = this.state;
        // const { getFieldDecorator } = this.props.form;
        // console.log(panes)
        // const baseData = this.getClums(panes);
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
                        {/* <Row type="flex" style={{flexWrap:'nowrap'}}> */}
                        <Row>
                        {/* {panes.rules.map((val, index) =>
                            index <= 1 ? <FormItem
                                label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {val.render()}
                            </FormItem>:null)} */}
                            {panes.rules.map((val, index) =>
                            this.state.stretch ?
                            <FormItem
                                label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {val.render(this)}
                            </FormItem>:<FormItem
                                label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {val.render(this)}
                            </FormItem>
                            // <FormItem
                            //     label={val.label} style={{ marginBottom: '5px' }} key={index}>
                            //     {val.render(this)}
                            // </FormItem> : index <= 1 ? <FormItem
                            //     label={val.label} style={{ marginBottom: '5px' }} key={index}>
                            //     {val.render(this)}
                            // </FormItem>:null
                            )}
                            {/* <div style={{flex:'auto',textAlign:'right'}}> */}
                                <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                                <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                                {/* <span style={{ marginLeft: '10px',color:'#1890ff',fontSize:12}} onClick={this.setStretch}>{this.state.stretch ? '收起' : '展开'}</span> */}
                            {/* </div> */}
                        </Row>
                        {/* {
                            this.state.stretch ? <Row>
                            {panes.rules.map((val, index) =>
                                index > 1 ? <FormItem
                                    label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                    {val.render()}
                                </FormItem>:null)}
                            </Row> : null
                        } */}
                        <Row>
                            <Col span={4} style={{ textAlign: 'left'}}>
                                {/* <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>模板下载</Button>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>导出</Button>*/}
                                
                            </Col>
                            <Col span={20} style={{ textAlign: 'right' }}>
                                <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.ClienttChange} showUploadList={false}>
                                    {/* <Button style={{ marginRight: '10px' }}>
                                        <Icon type="upload" /> 导入文件
                                    </Button> */}
                                    <Button
                                        style={{ marginRight: '10px' }}
                                        type="primary"
                                        icon="upload"
                                        loading={this.state.uploadLoading}
                                        // onClick={this.enterIconLoading}
                                    >
                                        导入老OMM数据
                                    </Button>
                                </Upload> 
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(2)}>查看</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>删除</Button>
                                <Button type="info" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(1)}>修改</Button>
                                <Button type="primary" onClick={(e) => this.openModal(0)}>新增</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto',height: 10 }} ref={(el) => this.tableDom = el}>
                        <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.table.rolesData} columns={panes.columns} style={{ marginTop: '20px',maxHeight:'86%' }} rowKey={(record, index) => `key${index}`} pagination={false} scroll={h} size="small" />
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                    </div>
                </Col>
            </Row>
            {/* 资产配置管理的新增、修改、查看弹窗 */}
            <Modal
                title={this.state.roleWindow.roleModalTitle}
                destroyOnClose
                visible={this.state.roleWindow.roleModal}
                onCancel={_ => this.setState({
                    roleWindow: { roleModal: false },
                    tableSelecteds: [],
                    tableSelectedInfo: []
                })}
                onOk={_ => this.editRoleSave()}
                width={1200}
                style={{ top: 50, marginBottom: 100 }}
                bodyStyle={{paddingTop:0,minHeight:520,maxHeight:600,overflowY:'auto'}}
                okText="保存"
                cancelText="取消"
                className="ViewModal"
            >
                <Tabs defaultActiveKey="0" tabPosition={'top'} style={{ overflowY:'auto' }}>
                    {/* <TabPane tab="基本信息" key="0">
                    </TabPane> */}
                    {
                        this.state.tabPane.map((item,index) => {
                            let Children = item.child;
                            const resetProps = this.getProps(index);
                            return (
                                <TabPane tab={item.name} key={index}>
                                    <Children {...resetProps}></Children>
                                </TabPane> 
                            )
                        })
                    }
                </Tabs>
            </Modal>
            
        </div>
    }

}
export default assetsAllocation













