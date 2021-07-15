import React, { Component } from 'react'
import { Row, Col,  Input, Select,Form,Icon ,Divider} from 'antd'
import {columnsBasic,columnsDevice,assetsListData} from './assetsList.js'//获取页面渲染配置项
// 引入---【项目选择器组件】
import ProjectSelector from '/components/selector/projectSelector.jsx'
// 引入---【产品选择器组件】
import ProductSelector from '/components/selector/productSelector.jsx'

import { getInfo, GetAddress,getBaseData,GetAllocationArea,GetAllocationCustomer} from '/api/assets.js'
const { Option } = Select;
const FormItem = Form.Item
const { TextArea,Search} = Input;
// const dateFormat = 'YYYY-MM-DD';
// 引入日期格式化
import moment from 'moment'
class BasicInformation extends Component {
    constructor (props){
        super(props)
        this.state = {
            baseData:{...props.baseData},
            roleWindow:props.roleWindow,
            visibleModule:false,
            visibleProductModel:false,
            selectData:{
                areaData:[{id:1,name:'ahe'}],//区域下拉列表输入数据
                customerData:[{id:'-1',name:'无'}],//客户下拉列表输入数据
                maintained:[],//是否维护数据
                systemCategory:[],//系统类别下拉
                appLevelList:[],//系统重要程度
                riskLevel:[],//风险等级下拉
                addressList:[],//机房地址下拉数据
                statusList:[],//状态下拉数据
                basedataTypeList:[],//配置项下拉数据
                productModeType:[], //产品型号
                productLineType:[], //产品线
                productBrandType:[], //品牌
                productSkillType:[], //技术方向
            },
            dateKeys:[]
        }
        if(this.props.setSon) this.props.setSon(this);
    }
    componentWillMount(){
        //初始化下拉列表数据
        this.init();
        if(this.props.roleWindow.roleModalType){
            let selectData = this.initSelectData();
            // this.setState({selectData});
        }
    }
    //编辑的时候初始化下拉框数据
    initSelectData =() => {
        let {selectData} = this.state;
        this.getAreaData(this.state.baseData.projectId)
        this.getCustomer(this.state.baseData.projectAreaId)
        this.state.baseData.projectAreaId && this.getAddress(this.state.baseData.projectAreaId)
        this.state.baseData.appTypeId && this.getInfo(this.state.baseData.appTypeId)
        // selectData = Object.assign({}, selectData, { });
        return selectData;
    }
    //生成新增/修改/查看弹框内容
    getFields = (assetsList) => {
        let {baseData,roleWindow,dateKeys} = this.state;
        const { getFieldDecorator } = this.props.form,children = [];
        for (let i = 0; i < assetsList.length; i++) {
            if(!assetsList[i].key){
                continue;
            }
            let item = assetsListData[assetsList[i].key];
            
            //处理初始化显示值
            let initialValue = (item.type == 'date'&& baseData[assetsList[i].key]) ? moment(baseData[assetsList[i].key],"YYYY-MM-DD") : baseData[assetsList[i].key] ,rules=roleWindow.roleModalType == 2 ? [] : item ?   item.rules : [] ,required = false;
            if(roleWindow.roleModalType && assetsList[i].key !== assetsList[i].dataIndex && !initialValue){
                initialValue = baseData[assetsList[i].dataIndex];
            }
            if(item.type == 'date'){
                dateKeys.push(item.key);
            }
             //处理产品联动是否可编辑
            if(assetsList[i].key == 'productSkillType' || assetsList[i].key == 'productBrandType' || assetsList[i].key == 'productLineType' || assetsList[i].key == 'productLevel' || assetsList[i].key == 'serviceClassId'){
    
                required = true;
            }
            //处理配置项是否可编辑
            if(roleWindow.roleModalType == 2 || assetsList[i].key == 'basedataTypeId'){
                required = true;
            }
            children.push(
                <Col span={item ? item.span : 6} key={i}>
                <Form.Item label={item ? assetsList[i].title : '无效字段'}>
                    {getFieldDecorator(item ? item.key : `unknown${i}`, {
                    rules: [],//rules,
                    initialValue: initialValue
                    })( item ? item.render(this,item.type,assetsList[i].selectData,assetsList[i].itemCode,assetsList[i].itemValue,assetsList[i].selectChange,required,assetsList[i].dataIndex) : <Input />)}
                </Form.Item>
                </Col>
            );
        }
        return children;
    }
    //初始化下数据
    init = () => {
        //系统类别
        getBaseData({basedataTypeCode:'systemType'}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { systemCategory: res.data});
                this.setState({selectData})
            } else {
                message.error(res.message)
            }
        })
        //系统重要程度
        getBaseData({basedataTypeCode:'appLevel'}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { appLevelList: res.data});
                this.setState({selectData})
            } else {
                message.error(res.message)
            }
        })
        //是否维护
        getBaseData({basedataTypeCode:'isMaintain'}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { maintained: res.data});
                this.setState({selectData})
            } else {
                message.error(res.message)
            }
        })
    }
    //处理项目选择器返回数据
    setProjectHandleOk = (info) =>{
        if(info){
            info.projectId = info.id
            // info.projectNum = info.projectNumber
            info.projectManagerName = info.managerName
            info.projectStartDate = info.startDate
            info.projectEndDate = info.endDate
            info.projectSalesmanName = info.salesmanName
        }
        return info;
    }
    //项目选择器回传参数
    projecthandleOk = (info) => {
        console.log(info)
        info = this.setProjectHandleOk(info);
        const { roleWindow,tableSelectedInfo,baseData} = this.state;
        this.props.form.resetFields(['projectNumber','projectName','projectManagerName','custName','projectEndDate','projectStartDate','projectManagerName','projectSalesmanName']);
        //  console.log(info,this.state.baseData)
         let nowParams = this.props.form.getFieldsValue();
        let resetParams = {projectAreaId:undefined,projectAreaAddress:undefined,custUserId:undefined,custUserMobile:undefined};
        this.setState({
            baseData: info ? {...baseData,...nowParams,...info,...resetParams} : {...baseData,...nowParams,...resetParams}
        },()=>{
            console.log(this.state.baseData)
            this.getAreaData(this.state.baseData.projectId)
        })
        
    }
    //产品选择器回传参数
    producthandleOk = (info) => {
        const {baseData} = this.state;
        this.props.form.resetFields(['productModelName','productLevel','productLineName','brandName','skillTypeName','serviceClassName']);
        //  console.log(info,this.state.baseData)
        let nowParams = this.props.form.getFieldsValue();
        // console.log(baseData,nowParams,info)
        this.setState({
            baseData: info ? {...baseData,...nowParams,...info} : {...baseData,...nowParams}
        },()=>{
            console.log(this.state.baseData)
            // this.getAreaData(this.state.baseData.projectId)
        })
    }
    //获取服务区域下拉列表数据
    getAreaData = (projectId) =>{
        GetAllocationArea(projectId).then(res => {
            let {selectData} = this.state;
            if (res.success != 1) {
                selectData = Object.assign({}, selectData, { areaData: []});
                this.setState({selectData});
                // message.error("请求错误")
                return
            }else{
                selectData = Object.assign({}, selectData, { areaData: res.data ? res.data : []});
                this.setState({selectData})
            }
        })
    }

    //获取客户下拉列表数据
    getCustomer = (projectAreaId) =>{
        GetAllocationCustomer(projectAreaId).then(res => {
            let {selectData} = this.state;
            if (res.success != 1) {
                selectData = Object.assign({}, selectData, { customerData: [{id:'-1',name:'无'}]});
                this.setState({selectData})
                // message.error("请求错误")
                return
            }else{
                selectData = Object.assign({}, selectData, { customerData: res.data && res.data.length ? [...res.data,{id:'-1',name:'无'}]:[{id:'-1',name:'无'}]});
                this.setState({selectData})
            }
        })
    }
    //获取机房地址下拉
    getAddress = (projectAreaId) =>{
        GetAddress(projectAreaId).then(res => {
            let {selectData} = this.state;
            if (res.success != 1) {
                selectData = Object.assign({}, selectData, { addressList: [{id:'-1',name:'无'}]});
                this.setState({selectData})
                // message.error("请求错误")
                return
            }else{
                selectData = Object.assign({}, selectData, { addressList: res.data && res.data.length ? [...res.data,{id:'-1',name:'无'}]:[{id:'-1',name:'无'}]});
                this.setState({selectData})
            }
        })
    }
    //获取风险等级下拉列表数据
    getInfo = (id) =>{
        getInfo({id}).then(res => {
            let {baseData} = this.state;
            if (res.success != 1) {
                 message.error("获取风险等级接口错误！")
            }else{
                // selectData = Object.assign({}, selectData, { riskLevel: res.data && res.data.length ? [...res.data,{id:'-1',name:'无'}]:[{id:'-1',name:'无'}]});
                baseData['riskLevelId'] = res.data.id,baseData['riskLevelName'] = res.data.name;
                this.setState({baseData})
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
    onAreaChange = (selectChange,id,selectData,dataIndex,itemValue,option)=>{
        const {baseData} = this.state,item = option.props.appitem;
        if(selectChange == 'projectAreaId' ){  //服务区域
            baseData['computerRoomAddress'] = baseData['custUserId'] = baseData['custUserMobile'] = undefined;
            this.props.form.resetFields(['computerRoomAddress','custUserId','custUserMobile']);
            this.getCustomer(id);
            this.getAddress(id);
        }else if(selectChange == 'appTypeId' ){  //系统类别
            this.getInfo(item.intValue1)
        }else if(selectChange == 'custUserId' ){  //客户管理员
            baseData['custUserMobile'] = item.mobile;
        }
        // let getData = this.state.selectData[selectData].filter(item => item.id == id );
        baseData[dataIndex] = itemValue ? item[itemValue] : item['name'];
        this.setState({baseData})
    }
    //项目选择器打开函数
    openProject = (type) => {
        const obj = {};
        if(type == 'projectNumber'){
            obj['visibleModule'] = true;
        }else{
            obj['visibleProductModel'] = true;
        }
        this.setState(obj);
    }
    //项目选择器关闭函数
    close = () => {
        this.setState({
            visibleModule:false,
            visibleProductModel:false
        },()=>{
            this.props.form.resetFields();
        })
    }
    //提交函数
    onSubmit = () => {
        // 1 校验必填数据是否填写
        return this.props.form.validateFields((err, fieldsValue) => {
            // console.log(this.state.baseData);
            if (err) {
                return;
            }
        })
    }
    render  () {
        return (
            <div>
                <div className="commTop">
                    <div className="navTitle">项目信息</div>
                    <Form id="assetsBoxFrom" className="AllocationForm" layout='inline'>
                        <Row gutter={[16,15]}>{ this.getFields(this.props.panes.basicData.columnsBasic)}</Row>
                    </Form>
                </div>
                <Divider />
                {this.props.panes.basicData.columnsDevice.length ? <div className="commTop">
                    <div className="navTitle">设备信息</div>
                    <Form id="assetsBoxFrom2" className="AllocationForm" layout='inline'>
                        <Row gutter={[16,15]}>{ this.getFields(this.props.panes.basicData.columnsDevice)}</Row>
                    </Form>
                </div> : null}
                
                {/* 项目选择器 */}
                {
                    this.state.visibleModule ? <ProjectSelector title={'项目选择器'} onCancel={this.close} onOk={this.projecthandleOk}></ProjectSelector> : null
                }
                {/* visibleProductModel */}
                {/* 产品选择器 */}
                {
                    this.state.visibleProductModel ? <ProductSelector title={'产品选择器'} skillTypeId={this.props.searchListID} onCancel={this.close} onOk={this.producthandleOk}></ProductSelector> : null
                }
            </div>  
        )
    }
}
const BasicInformations = Form.create()(BasicInformation)
export default BasicInformations