/***
 *   配置项页面组件
 *   @author gl
 */
import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, DatePicker,Upload,Icon,Tabs } from 'antd'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"


import { GetAllocationTree, GetAllocationTable, AddAllocationTable, EditAllocationTable,getConfigMeta,getByCode, DelAllocationTable,getBaseData,getAllocationSearchData,getDetail,GetTablebasic} from '/api/assets.js'
import { GetDictInfo } from '/api/dictionary'
import Pagination from '/components/pagination'//分页组件
import {panes,baseData,assetsListData} from './assetsList.js'//获取页面渲染配置项
import {getParent} from '@/assets/js/publicMethod.js'//获取公共方法
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
            panes:{rules:[],columns:[],assetsListData:[],basicData:{columnsBasic:[],columnsDevice:[]},subColumns:[],riskColumns:[]},      //基础显示数据
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
            //高级查询窗口
            searchWindow:{
                roleModal: false,
                roleModalTitle: "高级查询"
            },
            //右侧查询表单参数
            searchRoleName: null,
            searchListID: null,
            searchListIDCode: null, //判断是软件服务还是硬件服务 2 为硬件  1为软件
            searchListName: null,
            basedataTypeId: 'productType',
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
                    child: require('./information.jsx').default,
                    typeCode:['1','2'],
                    errMessage:''
                },
                {
                    name:'部件信息',
                    child: require('./component.jsx').default,
                    typeCode:['2'],
                    errMessage:'请填写部件信息信息！'
                },
                {
                    name:'风险排查',
                    child: require('./riskInvestigation.jsx').default,
                    typeCode:['1','2'],
                    errMessage:'请填写风险排查信息！'
                }
            ],
            selectData:{
                productLevelList:[],//区域下拉列表输入数据
            },
            detail:null,
            incrementFeild:[],        //扩展数据字段
            incrementFeilds:[],        //存储扩展字段select组件使用
        }
    }
    //获取各组件所需参数并赋值
    getProps = (type) => {
        const {roleWindow,baseData,detail,searchListID,searchListName,searchListIDCode,basedataTypeId,basedataTypeName,panes,incrementFeild,incrementFeilds,selectData,tree} = this.state;
        // console.log(detail,roleWindow.roleModalType == 0 ? baseData : detail ? detail : {})
        return {
            baseData: roleWindow.roleModalType == 0 ? baseData : detail ? detail : {},
            roleWindow,
            assetsListData,
            basedataTypeId,
            searchListID,
            searchListName,
            searchListIDCode,
            incrementFeild,
            incrementFeilds,
            panes,
            selectData,
            tree,
            basedataTypeName,
            treeSelect:this.onTreeSelect,
            setSon: (el) => this[`son${type}`] = el
        }
    }
    SortTable = () => {
        setTimeout(() => {
            // const {panes} = this.state,columns = panes.basicData.columnsBasic.concat(columnsBasic);
            let h = this.tableDom.clientHeight - 100 < 0 ? 120 : this.tableDom.clientHeight - 120 ;
            // console.log(h)
            this.setState({
                h: {
                    x:4500,
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
        getBaseData({basedataTypeCode:'productLevel'}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { productLevelList: res.data});
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
                        //获取当前节点的父节点，判断其code
                        let parentNodes = getParent(res.data,res.data[0]['children'][0]['id']).reverse();
                        let searchListIDCode = parentNodes[parentNodes.length-1] ? parentNodes[parentNodes.length-1].code : null;
                        let pane = this.getClums(searchListIDCode,panes);
                        this.setState({
                            searchListIDCode,
                            panes:pane,
                        },()=>{
                           // this.searchRoleFun(res.data[0]['id'])
                        })
                    }
                }
            })
    }
    //获取表格数据
    searchRoleFun = (parentId,pass) => {
        //1 判断角色组tree是否有选中 如无选中提示无选中 无法查询
        this.props.form.validateFields((err, fieldsValue) => {
            // console.log(this.state.baseData);
            if (err) {
                return;
            }
            console.log(fieldsValue)
            let newParams = {...fieldsValue}
            if(!newParams.basedataId) newParams.basedataId = "";
            // return console.log(newParams);
            // 2 发起查询请求 查询后结构给table赋值
            let x = this.state.searchX?this.state.searchX:'',{basedataTypeId} = this.state;
            let params = pass ? Object.assign({},newParams,{parentId:-1},this.state.pageConf) : Object.assign({},newParams,this.state.pageConf, { offset: 0 })
            
            GetAllocationTable(params,params.limit,params.offset).then(res => {
                this.setTableData(res)
            })
            // this.props.form.resetFields(); //重置查询条件输入
        })
        
        
    }
    //根据不同接口返回设置表格数据显示
    setTableData = (res) => {
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
    }
    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        // console.log(selectedKeys, info)
        // return
        //获取当前节点的父节点，判断其code
        let data = info.props;
        let parentNodes = getParent(this.state.tree.treeData,data['id']).reverse();
        let searchListIDCode = parentNodes[parentNodes.length-1] ? parentNodes[parentNodes.length-1].code : null;
        let pane = this.getClums(searchListIDCode,panes)
        // let incrementFeild = searchListIDCode == 1 ? await getConfigMeta({basedataTypeId:data['id']}) : {data:[]};
        // // 重置表格数据
        // let tableData = Object.assign({}, this.state.table, {
        //     rolesData: []
        // })
        this.setState({
            searchListID: data['id'],
            searchListName:data['name'],
            searchListIDCode,
            panes:pane,
            // incrementFeild:this.getIncrementFeild(incrementFeild.data),       //赋值扩展字段
        },()=>{
            // 选中后请求列表数据
            // let {searchListID} = this.state;
            // this.searchRoleFun(searchListID)
        })
    };
    //处理不同组件加载不同组件
    getFormCompent = (item,index) => {
        if(item.fieldType == 2){
            getByCode({code: item.dictCode }).then(res => {
                let {selectData,incrementFeilds} = this.state,obj = {};
                if (res.success == 1) {
                    obj[`select${index}`] = res.data ? res.data :[];
                } else {
                    obj[`select${index}`] = [];
                }
                incrementFeilds.splice(incrementFeilds.indexOf(item.fieldEn), 1);
                selectData = Object.assign({}, selectData,obj);
                this.setState({ selectData,incrementFeilds});
            })
            return (_this,type,selectData,itemCode,itemValue,selectChange,required,dataIndex,label) => {
                // console.log(_this.state.selectData,index)
                return (<Select disabled={required}  placeholder="请选择" allowClear={true} onChange={(value,option) => _this.onAreaChange2(value,label)}>
                            {_this.props.selectData[selectData] ? _this.props.selectData[selectData].map((items, index) => {
                                return (<Option key={index} value={items.id}>{items.name}</Option>)
                            }) : [].map((items, index) => {
                                return (<Option key={index} value={items.id}>{items.name}</Option>)
                            })}
                        </Select> )
            }
        }else{
            return (_this,type,selectData,itemCode,itemValue,selectChange,required,dataIndex) => <Input disabled={required} placeholder="请输入" />
        }
    }
    getFieldName = (id,dataIndex) => {
        const nowData = this.state.selectData[dataIndex] ? this.state.selectData[dataIndex] :[];
        for(let i of nowData){
            if(i.id == id){
                return i.name;
            }
        }
    }
    //处理获取到的扩展增量显示数据
    getIncrementFeild = (data) => {
        let newData = [],newDataFields = [];
        if(data instanceof Array){
            data.forEach((item,index) => {
                let obj = {}, obj2 = {};
                obj['title'] = obj2['label'] = item.fieldCn,
                obj2['key'] = obj['dataIndex'] = obj['key'] = item.fieldEn,
                obj2['rules'] = item.isRequired ? [{required: true,message: '该选项不能为空！'}] : [],
                obj2['render'] = this.getFormCompent(item,index),
                obj2['type'] = item.fieldType,
                obj2['span'] = 6,
                obj['align'] = 'center';
                assetsListData[item.fieldEn] = obj2;
                if(item.fieldType == 2){
                    obj['render'] = (value,row,indexData) => {
                        console.log(value,`select${index}`,this.getFieldName(value,`select${index}`))
                        return this.getFieldName(value,`select${index}`)
                    }
                    obj['selectData'] =  `select${index}`,
                    obj['selectChange'] =  item.fieldEn,
                        newDataFields.push(item.fieldEn);
                }
                newData.push(obj);
            })
            this.setState({incrementFeilds:newDataFields})
        }
        return newData;
    }
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
        // if (id == "" || id == null) {
        //     message.destroy()
        //     message.warning('请先选中左侧角色组，然后再进行查询。');
        //     return
        // }
        this.setState({searchWindow: { roleModal: false }})
        this.searchRoleFun(id);
    }
    //回传点击查询按钮所填参数
    onChangeSearch = (field,value) => {
        let {searchParmas} = this.state;
        searchParmas[field] = value;
    }
    //打开新增、编辑、查看窗口
    openModal = async (roleModalType) => {
        let {tableSelectedInfo,selectData,tree} = this.state,roleModalTitle = null;
        // this.props.form.resetFields();
        if(roleModalType == 0){
            let parentNodes = getParent(tree.treeData,tree.treeData[0]['children'][0]['id']).reverse();
            let searchListIDCode = parentNodes[parentNodes.length-1] ? parentNodes[parentNodes.length-1].code : null;
            let pane = this.getClums(searchListIDCode,panes);
            roleModalTitle = "新增资产配置";
            this.setState({
                searchListIDCode,
                searchListID: null,
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                },
                panes:pane,
                selectData:{...selectData, productModeType:[], productLineType:[],productBrandType:[],productSkillType:[]}
            })
        }else{
            if (!tableSelectedInfo || tableSelectedInfo.length == 0) {
                message.destroy()
                message.warning("没有选中数据,无法进行修改!")
                return
            }
            roleModalTitle = roleModalType == 1 ? "修改资产配置" : "查看资产配置";
            let detailRes = await getDetail(tableSelectedInfo[0].id),detail = {};
            if(detailRes.success == 1){
                detail = detailRes.data;
            }
            let searchListIDCode = tableSelectedInfo[0].code;
            let pane = this.getClums(searchListIDCode,panes);
            this.setState({
                searchListIDCode,
                searchListID: tableSelectedInfo[0].id,
                roleWindow: {
                    roleModal: true,
                    roleModalType,
                    roleModalTitle
                },
                panes:pane,
                detail
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
                        // _this.searchTree()
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
    //处理时间组件值格式化回传
    setDateValue = (fieldsValue) => {
        const {dateKeys} = this.son0.state,newDateParams = {};
        dateKeys.forEach((item,index) => {
            newDateParams[item] = fieldsValue[item] ? fieldsValue[item].format('YYYY-MM-DD'):undefined;
        })
        return newDateParams;
    }
    // 新增/编辑数据保存
    editRoleSave = () => {
        const {tabPane,searchListIDCode} = this.state;
        //基本信息表单验证完成后再进行其他模块验证
        this.son0.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                message.error('基本信息填写不完整，请检查！')
                return;
            }
            //验证部件，风险提交数据
            for(let i=1; i < tabPane.length; i++){
                if(tabPane[i].typeCode.indexOf(searchListIDCode) > -1){
                    if(this[`son${i}`]){
                        let son = this[`son${i}`];
                        if(!son.onSubmit()) return false;
                    }else{
                        message.error(tabPane[i].errMessage)
                        return;
                    }
                }
            }
            let newFieldsValue = this.setDateValue(fieldsValue),{searchListID} = this.state;
            let params = {
                ...this.son0.state.baseData,
                ...fieldsValue,
                ...newFieldsValue,
                configParts:searchListIDCode == '1' ? [] : this.son1.onSubmit(),
                configRisks:this.son2.onSubmit(),
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
                    })
                    this.searchRoleFun(searchListID)
                    // this.searchTree()
                    message.success("操作成功")
                } else {
                    message.error(res.message)
                }
            })
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
            if(item.type.indexOf(basedataTypeId) > -1){
                newColumns = item;
            }
        })
        return newColumns;
    }
    //控制查询条件伸缩显示
    setStretch = ()=>{
        const {stretch} = this.state;
        this.setState({searchWindow:{roleModal:true}})
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
        const { h,panes } = this.state,columns = panes.basicData.columnsBasic.concat(panes.basicData.columnsDevice,this.state.incrementFeild);
        const {getFieldDecorator} = this.props.form;
        columns.length > 6 ? h.x = 4500 : h.x = 0;
        // const { getFieldDecorator } = this.props.form;
        // console.log(panes)
        // const baseData = this.getClums(panes);
        return <div style={{ border: '0px solid red', background: ' #fff', height: '100%'}} >
            <Row gutter={24} className="main_height">
                {/* <Col span={5} className="gutter-row assetsTree" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant edit={false} treeData={this.state.tree.treeData} selectedKeys={[this.state.searchListID]}
                       addTree={this.addRoleGroup} editTree={this.editRoleGroup} deletetTree={this.delRoleGroup}
                       onExpand={this.onExpand} onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col> */}
                <Col span={24} className="gutter-row main_height" style={{ padding: '16px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form id="assetsForm" layout='inline' style={{ width: '100%' }}>
                        {/* <Row type="flex" style={{flexWrap:'nowrap'}}> */}
                        <Row>
                            <Col span={16}>
                                <Row style={{display:'flex'}}>
                                    {panes.rules.map((val, index) =>
                                        index <= 1 ?<FormItem  style={{display:'flex'}}
                                            label={val.label} key={index}>
                                            {getFieldDecorator(val.key, val.option?val.option:{})(val.render(this))}
                                        </FormItem>:null)}
                                        <FormItem style={{flex:'auto',textAlign:'right'}}>
                                            <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.setStretch}>高级查询</Button>
                                            {/* <span style={{ marginLeft: '10px',color:'#1890ff',fontSize:12}} onClick={this.setStretch}>{this.state.stretch ? '收起' : '展开'}</span> */}
                                        </FormItem>
                                </Row>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <FormItem style={{flex:'auto',textAlign:'right'}}>
                                    <Button type="primary" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(2)}>查看</Button>
                                    <Button type="info" style={{ marginRight: '10px' }} onClick={this.delRoleItem}>删除</Button>
                                    <Button type="info" style={{ marginRight: '10px' }} onClick={(e) => this.openModal(1)}>修改</Button>
                                    <Button type="primary" onClick={(e) => this.openModal(0)}>新增</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto',height: 10 }} ref={(el) => this.tableDom = el}>
                        <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.table.rolesData} columns={columns} style={{ marginTop: '20px',maxHeight:'86%' }} rowKey={(record, index) => `key${index}`} pagination={false} scroll={h} size="small" />
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
                    tableSelectedInfo: [],
                    detail:null,
                })}
                onOk={_ => this.editRoleSave()}
                width={1200}
                style={{ top: 16}}
                bodyStyle={{paddingTop:0,minHeight:520,maxHeight:625,overflowY:'auto'}}
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
                            if(item.typeCode.indexOf(this.state.searchListIDCode) == -1){
                                return null;
                            }
                            return (
                                <TabPane tab={item.name} key={index}>
                                    <Children {...resetProps}></Children>
                                </TabPane> 
                            )
                        })
                    }
                </Tabs>
            </Modal>
            {/* 高级搜索查询 */}
            <Modal
                title="高级查询"
                // destroyOnClose
                visible={this.state.searchWindow.roleModal}
                onCancel={_ => this.setState({
                    searchWindow: { roleModal: false }
                })}
                onOk={_ => this.onSearch()}
                width={600}
                style={{ top: 50, marginBottom: 100 }}
                okText="保存"
                cancelText="取消"
                className="ViewModal"
            >
                <Form id="searchForm" layout='inline' style={{ width: '100%' }}>
                    {
                        <Row>
                            {panes.rules.map((val, index) =>
                                <Col span={12}  key={index}><FormItem
                                    label={val.label} style={{ marginBottom: '8px' }}>
                                    {getFieldDecorator(val.key, val.option?val.option:{})(val.render(this))}
                                </FormItem></Col>)}
                        </Row>
                    }
                </Form>
            </Modal>
        </div>
    }

}
const assetsAllocations = Form.create()(assetsAllocation)
export default assetsAllocations













