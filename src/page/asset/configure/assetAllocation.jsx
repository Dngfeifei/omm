import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, DatePicker,Upload,Icon } from 'antd'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"
// 引入---【项目选择器组件】
import ProjectSelector from '/components/selector/projectSelector.jsx'


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
        this.state = {
            // 表格默认滚动高度
            h: { x:true,y: 240 },
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
                columns: [],
                //右侧角色表格数据
                rolesData: [],
               
    
            },  
            panes:{rules:[],columns:[],assetsListData:[]},      //基础显示数据
            //二级面板显示配置
            secondWindow: {
                roleGroupModal: false, //弹窗是否显示可见
                roleGroupModalType: 0, //0新增  1修改
                roleGroupModalTitle: "新增",//弹窗title
            },
            basedataTypeList:[],
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
            TreeParantID:null,
            //当前选中角色数据
            currentRole: {
                id: null,
                roleName: null,
                status: null,
                resources: [],
            },
            //表格选中项
            tableSelecteds: [],//表格选中id存储
            tableSelectedInfo: [],//表格选中行数据存储
            baseData: baseData, //基本需上传字段数据
            stretch: false,//展开查询条件
            searchParmas: {},//查询条件参数存储
            visibleModule: false, //项目选择器开关
            searchData:[],//联想查询输入回传数据
            searchX:undefined,       //联想查询输入数据
            selectData:{
                areaData:[{id:1,name:'ahe'}],//区域下拉列表输入数据
                customerData:[{id:1,name:'ahe'}],//客户下拉列表输入数据
                maintained:[{id:"0",name:"否"},{id:"1",name:"是"}],//是否维护数据
                basedataTypeList:[],//配置项下拉数据
                productModeType:[], //产品型号
                productLineType:[], //产品线
                productBrandType:[], //品牌
                productSkillType:[], //技术方向
            },
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
        //所有下拉数据初始化
        getBaseData({}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                this.setState({selectData:{...selectData,...res.data}})
            } else {
                message.error(res.message)
            }
        })
        //配置项下拉数据初始化
        getAllBaseDataTypes({}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { basedataTypeList: res.data});
                this.setState({selectData})
            } else {
                message.error(res.message)
            }
        })
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
    // 资产配置管理表格数据查询
    onSearch = () => {
        let id = this.state.searchListID;
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        if (id == "" || id == null) {
            message.destroy()
            message.warning('请先选中左侧角色组，然后再进行查询。');
            return
        }
        this.searchRoleFun(id);
    }
    //回传点击查询按钮所填参数
    onChangeSearch = (field,value) => {
        let {searchParmas} = this.state;
        searchParmas[field] = value;
    }
    //打开新增、编辑、查看窗口
    openModal = (roleModalType) => {
        let {searchListID,table,tableSelectedInfo,baseData} = this.state,roleModalTitle = null;
        if(roleModalType == 0){
            if (searchListID == "" || searchListID == null) {
                message.warning('请先选中左侧角色组，然后再进行角色新增。');
                return
            }
            roleModalTitle = "新增资产配置";
            this.setState({
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                }
            })
        }else{
            if (!this.state.tableSelectedInfo || this.state.tableSelectedInfo.length == 0) {
                message.destroy()
                message.warning("没有选中数据,无法进行修改!")
                return
            }
            roleModalTitle = roleModalType == 1 ? "修改资产配置" : "查看资产配置";
            
            
            let selectData = this.initSelectData();
            this.setState({
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                },
                selectData
            })
        }
    }
    //编辑的时候初始化下拉框数据
    initSelectData =() => {
        let {selectData} = this.state;
        let productModeType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.tableSelectedInfo[0].productLineId);
        let productSkillType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.tableSelectedInfo[0].serviceClassId);
        let productBrandType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.tableSelectedInfo[0].skillTypeId);
        let productLineType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.tableSelectedInfo[0].brandId);
        this.getAreaData(this.state.tableSelectedInfo[0].projectId)
        this.getCustomer(this.state.tableSelectedInfo[0].projectAreaId)
        selectData = Object.assign({}, selectData, { productModeType,productSkillType,productBrandType,productLineType});
        return selectData;
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
            // if (err) {
            //     return;
            // }
            console.log(fieldsValue);
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
            tableSelectedInfo: info
        })
    };
    //生成新增/修改/查看弹框内容
    getFields = (assetsList) => {
        // const {assetsList} = this.state;
        let {roleWindow,tableSelectedInfo,baseData,searchListID,searchListName} = this.state;
        const { getFieldDecorator } = this.props.form;
        baseData = Object.assign({}, baseData, { parentId:  searchListID,parentName:searchListName});
        const children = [];
        // console.log(assetsList)
        for (let i = 0; i < assetsList.length; i++) {
        //   console.log(assetsList[i].key)
            if(!assetsList[i].key){
                continue;
            }
            let item = assetsListData[assetsList[i].key];
            // console.log(assetsList[i].key.indexOf('strValue'),assetsWList[i].key.split('strValue')[1])
            if(assetsList[i].key.indexOf('strValue')>-1 && (assetsList[i].key.split('strValue')[1]>2&&assetsList[i].key.split('strValue')[1]<5) ){
                item = assetsListData[assetsList[i].key].renderDom ? assetsListData[assetsList[i].key].renderDom(assetsList[i]) : item;
            }
            let initialValue = !roleWindow.roleModalType ? baseData[assetsList[i].key] : isNaN(tableSelectedInfo[0][assetsList[i].key]) ? tableSelectedInfo[0][assetsList[i].key] : tableSelectedInfo[0][assetsList[i].key]+'';
            // if(assetsList[i].key == 'projectStartDate' || assetsList[i].key == 'projectEndDate' || assetsList[i].key == 'updateTime') initialValue = initialValue == undefined ? initialValue : moment(initialValue);
            children.push(
                <Col span={item ? item.span : 6} key={i}>
                <Form.Item label={item ? item.label : '修改字段'}>
                    {getFieldDecorator(item ? item.key : `unknown${i}`, {
                    rules: roleWindow.roleModalType == 2 ? [] : item ? item.rules : [],
                    initialValue: initialValue
                    })(roleWindow.roleModalType == 2 ? <Input disabled/> : item ? item.render(this,item.type,assetsList[i].selectData,assetsList[i].itemCode,assetsList[i].itemValue,assetsList[i].selectChange) : <Input />)}
                </Form.Item>
                </Col>
            );
        }
        return children;
    }
     
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
    //项目选择器打开函数
    openProject = () => {
        this.setState({
            visibleModule:true
        })
    }
    //项目选择器关闭函数
    close = () => {
        this.setState({
            visibleModule:false
        })
    }
    //获取服务区域下拉列表数据
    getAreaData = (projectId) =>{
        GetAllocationArea(projectId).then(res => {
            if (res.success != 1) {
                message.error("请求错误")
                return
            }else{
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { areaData: res.data});
                this.setState({selectData})
            }
        })
    }

    //获取客户下拉列表数据
    getCustomer = (projectAreaId) =>{
        GetAllocationCustomer(projectAreaId).then(res => {
            if (res.success != 1) {
                message.error("请求错误")
                return
            }else{
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { customerData: res.data});
                this.setState({selectData})
            }
        })
    }
    //查找产品联动数据
    getProjectData = (list,id) => {
        for (let i in list) {
			if(list[i].id==id){
                if(list[i].children){
                    return list[i].children;
                }else{
                    return [];
                }
			}
			if(list[i].children){
				let node= this.getProjectData(list[i].children,id);
				if(node!==undefined){
					return node
				}
			}
        }
    }
    //服务区域选择改变
    onAreaChange = (selectChange,id)=>{
        // console.log(selectChange,id)
        if(selectChange == 'projectAreaId' ){  //服务区域
            this.getCustomer(id)
        }else if(selectChange == 'serviceClassId'){//产品类别
            this.props.form.resetFields(['skillTypeId','brandId','productLineId','productModelId'])
            let productSkillType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],id);
            // // console.log(productSkillType)
            // return
            let {selectData} = this.state;
            selectData = Object.assign({}, selectData, { productSkillType});
            this.setState({selectData})
        }else if(selectChange == 'skillTypeId'){//技术方向
            this.props.form.resetFields(['brandId','productLineId','productModelId'])
            let productBrandType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],id);
            let {selectData} = this.state;
            selectData = Object.assign({}, selectData, { productBrandType});
            this.setState({selectData})
        }else if(selectChange == 'brandId'){//品牌
            this.props.form.resetFields(['productLineId','productModelId'])
            let productLineType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],id);
            let {selectData} = this.state;
            selectData = Object.assign({}, selectData, { productLineType});
            this.setState({selectData})
        }else if(selectChange == 'productLineId'){//产品线
            this.props.form.resetFields(['productModelId'])
            let productModeType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],id);
            let {selectData} = this.state;
            selectData = Object.assign({}, selectData, { productModeType});
            this.setState({selectData})
        }
        // this.getCustomer(projectAreaId)
    }
    //处理项目选择器返回数据
    setProjectHandleOk = (info) =>{
        if(info){
            info.projectId = info.id
            info.projectManagerName = info.managerName
            info.projectStartDate = info.startDate
            info.projectEndDate = info.endDate
            info.projectSalesmanName = info.salesmanName
        }
        return info;
    }
    //项目选择器回传参数
    projecthandleOk = (info) => {
        info = this.setProjectHandleOk(info);
        const { roleWindow,tableSelectedInfo} = this.state;
        this.props.form.resetFields();
         console.log(info)
        // return 
        if(roleWindow.roleModalType == 0){
            this.setState({
                baseData: info ? info : {}
            },()=>{
                this.getAreaData(this.state.baseData.projectId)
            })
        }else{
            this.setState({
                tableSelectedInfo: info ? {...tableSelectedInfo,...info} : tableSelectedInfo
            },()=>{
                this.getAreaData(this.state.tableSelectedInfo[0].projectId)
                this.getCustomer(this.state.tableSelectedInfo[0].projectAreaId)
            })
        }
        
    }
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
            } else {
                this.setState({ searchData: [] });
            }
        }, 300);
    };
    //联想输入输入数据回填
    handleChange = searchX => {
        this.setState({ searchX });
    };
    render = _ => {
        const { h,panes } = this.state;
        const { getFieldDecorator } = this.props.form;
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
                    currentRole: {
                        roleCode: null,
                        roleName: null,
                        status: null,
                    }
                })}
                onOk={_ => this.editRoleSave()}
                width={1200}
                style={{ top: 50, marginBottom: 100 }}
                okText="保存"
                cancelText="取消"
                className={this.state.roleWindow.roleModalType == 2 ? 'seeModal' : ''}
            >
                {
                    <Form id="assetsBoxFrom" className="AllocationForm" layout='inline'>
                        <Row gutter={[24,15]}>{ this.getFields(panes.columns)}</Row>
                    </Form>
                }
            </Modal>
            {
                this.state.visibleModule ? <ProjectSelector title={'项目选择器'} onCancel={this.close} onOk={this.projecthandleOk}></ProjectSelector> : null
            }
        </div>
    }

}
const assetsAllocations = Form.create()(assetsAllocation)
export default assetsAllocations













