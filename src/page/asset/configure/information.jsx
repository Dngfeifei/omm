/***
 *    配置库配置管理新增硬件设备---基础信息组件
 *   @author gl
 */
import React, { Component } from 'react'
import { Row, Col,  Input, Select,Form,Icon ,Divider} from 'antd'
// 引入---【项目选择器组件】
import ProjectSelector from '/components/selector/projectSelector.jsx'
// 引入---【产品选择器组件】
import ProductSelector from '/components/selector/productSelector.jsx'
// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'
import {getParent} from '@/assets/js/publicMethod.js'//获取公共方法

import { getInfo, GetAddress,getBaseData,GetAllocationArea,GetAllocationCustomer,getBrand} from '/api/assets.js'
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
            visibleSelector:false,
            selectData:{
                areaData:[],//区域下拉列表输入数据
                customerData:[{id:'-1',name:'无'}],//客户下拉列表输入数据
                maintained:[],//是否维护数据
                systemCategory:[],//系统类别下拉
                appLevelList:[],//系统重要程度
                riskLevel:[],//风险等级下拉
                addressList:[],//机房地址下拉数据
                statusList:[],//状态下拉数据
                basedataTypeList:[],//配置项下拉数据
                productModeType:[], //产品型号
                productLineType:[{id:'-1',name:'无'}], //产品线
                productBrandType:[{id:'-1',name:'无'}], //品牌
                productSkillType:[], //技术方向
                productLevelType:[{id:'-1',name:'无'}],//产品线级别
                operateSystemType:[], // 操作系统
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
        // let productSkillType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.baseData.serviceClassId);
        // let productBrandType = this.getProjectData(this.state.selectData.productType ? this.state.selectData.productType : [],this.state.baseData.skillTypeId);
        this.getAreaData(this.state.baseData.projectId)
        this.getCustomer(this.state.baseData.projectAreaId)
        this.getBrandData(this.state.baseData.basedataId);
        this.state.baseData.projectAreaId && this.getAddress(this.state.baseData.projectAreaId)
        this.state.baseData.appTypeId && this.getInfo(this.state.baseData.appTypeId)
        //selectData = Object.assign({}, selectData, { productSkillType:productSkillType? productSkillType :[],productBrandType:productBrandType? productBrandType :[]});
        return selectData;
    }
    getFormKey = (item) => {
        const {searchListIDCode} = this.props,obj = {key:item.key};
        if(item.key == 'productModelName'){
            obj['key'] = searchListIDCode == 1 ? item.key2 : item.key;
            obj['lable'] = searchListIDCode == 1 ? '软件名称' : '产品型号';
        }
        if(item.key == 'serialNumber'){
            obj['lable'] = searchListIDCode == 1 ? '软件版本号' : '序列号';
        }
        return obj;
    }
    //生成新增/修改/查看弹框内容
    getFields = (assetsList) => {
        let {baseData,roleWindow,dateKeys} = this.state,{assetsListData} = this.props;
        const { getFieldDecorator } = this.props.form,children = [];
        for (let i = 0; i < assetsList.length; i++) {
            if(!assetsList[i].key){
                continue;
            }
            const keyObj = this.getFormKey(assetsList[i])
            let item = assetsListData[keyObj.key];
            if(!item) console.log(keyObj.key)
            //处理初始化显示值
            let initialValue = (item.type == 'date'&& baseData[assetsList[i].key]) ? moment(baseData[assetsList[i].key],"YYYY-MM-DD") : baseData[assetsList[i].key] ,rules=roleWindow.roleModalType == 2 ? [] : item ?   item.rules : [] ,required = false;
            if(roleWindow.roleModalType && assetsList[i].key !== assetsList[i].dataIndex && !initialValue){
                initialValue = baseData[assetsList[i].dataIndex];
            }
            if(item.type == 'date'){
                dateKeys.push(item.key);
            }
             //处理产品联动是否可编辑
            if(assetsList[i].key == 'productSkillType'){
    
                required = true;
            }
            //处理配置项是否可编辑
            if(roleWindow.roleModalType == 2 || (roleWindow.roleModalType == 1 && assetsList[i].key == 'basedataId')){
                required = true;
            }
            children.push(
                <Col span={item ? item.span : 6} key={i}>
                <Form.Item label={item ? keyObj.lable ? keyObj.lable : assetsList[i].title : '无效字段'}>
                    {getFieldDecorator(item ? item.key : `unknown${i}`, {
                    rules: rules,
                    initialValue: initialValue
                    })( item ? item.render(this,item.type,assetsList[i].selectData,assetsList[i].itemCode,assetsList[i].itemValue,assetsList[i].selectChange,required,assetsList[i].dataIndex,assetsList[i].title) : <Input />)}
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
    //获取品牌、产品类别、技术方向数据
    getBrandData = (skillTypeId,resetArr) => {
        const {baseData} = this.state;
        resetArr.forEach(item => {
            baseData[item] = undefined;
        })
            console.log('gengxin')
            //查询品牌数据
        getBrand({skillTypeId}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { productBrandType: res.data[0].brands});
                baseData['serviceClassId'] = res.data[0].serviceClassId,
                baseData['serviceClassName'] = res.data[0].serviceClassName,
                baseData['skillTypeId'] = res.data[0].skillTypeId,
                baseData['skillTypeName'] = res.data[0].skillTypeName;
                this.setState({selectData,baseData})
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
            // console.log(this.state.baseData)
            this.getAreaData(this.state.baseData.projectId)
        })
        
    }
    //产品选择器回传参数
    producthandleOk = (info) => {
        const {baseData} = this.state;
        console.log(info)
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
    //人员选择器回传参数-手机人
    onSelectorOK = (key, info) => {
        const {baseData} = this.state;
        baseData['collectUserName'] = info[0].realName,
        baseData['collectUserId'] = key[0];
        this.setState({
            baseData
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
                selectData = Object.assign({}, selectData, { addressList: [{id:'-1',address:'无'}]});
                this.setState({selectData})
                // message.error("请求错误")
                return
            }else{
                selectData = Object.assign({}, selectData, { addressList: res.data && res.data.length ? [...res.data,{id:'-1',address:'无'}]:[{id:'-1',address:'无'}]});
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
    getProjectData = (list,id,fieldType,setField) => {
        let {selectData} = this.state,obj = {};
        for (let i in list) {
			if(list[i].id==id){
                if(list[i][fieldType]){
                    obj[setField] = list[i][fieldType];
                }
			}
        }
        selectData = Object.assign({}, selectData, obj);
        this.setState({selectData})
    }
    //服务区域选择改变
    onAreaChange = (selectChange,id,selectData1,dataIndex,itemValue,option,label)=>{
        console.log(selectChange,option)
        const {baseData,selectData} = this.state,item = selectChange == 'basedataId' ? {name:option[0]} : option.props.appitem;
        if(selectChange == 'projectAreaId' ){  //服务区域
            baseData['computerRoomAddress'] = baseData['custUserId'] = baseData['custUserMobile'] = undefined;
            this.props.form.resetFields(['computerRoomAddress','custUserId','custUserMobile']);
            this.getCustomer(id);
            this.getAddress(id);
        }else if(selectChange == 'appTypeId' ){  //系统类别
            this.getInfo(item.intValue1)
        }else if(selectChange == 'custUserId' ){  //客户管理员
            baseData['custUserMobile'] = item.mobile;
        }else if(selectChange == 'brandId' ){  //品牌
            this.getProjectData(selectData.productBrandType,id,'productLines','productLineType')
        }else if(selectChange == 'productLineId' ){  //产品线
            this.getProjectData(selectData.productLineType,id,'productLevels','productLevelType')
        }else if(selectChange == 'basedataId'){  //配置项
            let parentNodes = getParent(this.props.tree.treeData,id).reverse();
            let searchListIDCode = parentNodes[parentNodes.length-1] ? parentNodes[parentNodes.length-1].code : null;
            const resetArr = ['productModelName','serialNumber','serviceClassName','skillTypeName','brandName','brandId','productLineName','productLineId','productLevel','productLevelId'];
            this.props.form.resetFields(resetArr);
            if(searchListIDCode == 1) this.getBrandData(id,resetArr);   //重置关联数据
        }
        if(label == '中间件类型' && this.props.setStrValue1) this.props.setStrValue1(id)
        // let getData = this.state.selectData[selectData].filter(item => item.id == id );
        baseData[dataIndex] = itemValue ? item[itemValue] : item['name'];
        this.setState({baseData})
    }
    //扩展字段下拉组件选择改变函数
    // onAreaChange2 = (value,label) => {
    //     if(label == '中间件类型' && this.props.setStrValue1) this.props.setStrValue1(value)
    // }
    //项目选择器打开函数
    openProject = (type) => {
        const {roleWindow} = this.props;
        if(roleWindow.roleModalType == 2) return;
        const obj = {};
        if(type == 'projectNumber'){
            obj['visibleModule'] = true;
        }else if(type == 'collectUserName'){
            obj['visibleSelector'] = true;
        }else{
            obj['visibleProductModel'] = true;
        }
        this.setState(obj);
    }
    //项目选择器关闭函数
    close = () => {
        this.setState({
            visibleModule:false,
            visibleSelector:false,
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
        // const columnsDevice = this.props.searchListIDCode == 2 ? this.props.panes.basicData.columnsDevice : this.props.panes.basicData.columnsDevice.concat(this.props.incrementFeild);
        return (
            <div>
                <div className="commTop">
                    <div className="navTitle">项目信息</div>
                    <Form id="assetsBoxFrom" className="AllocationForm" layout='inline'>
                        <Row gutter={[16,15]}>{ this.getFields(this.props.panes.basicData.columnsBasic)}</Row>
                    </Form>
                </div>
                <Divider />
                <div className="commTop">
                    <div className="navTitle">配置信息</div>
                    <Form id="assetsBoxFrom2" className="AllocationForm" layout='inline'>
                        <Row gutter={[16,15]}>{ this.getFields(this.props.panes.basicData.columnsDevice)}</Row>
                    </Form>
                </div>
                
                {/* 项目选择器 */}
                {
                    this.state.visibleModule ? <ProjectSelector title={'项目选择器'} onCancel={this.close} onOk={this.projecthandleOk}></ProjectSelector> : null
                }
                {/* visibleProductModel */}
                {/* 产品选择器 */}
                {
                    this.state.visibleProductModel ? <ProductSelector title={'产品选择器'} skillTypeId={this.props.searchListID} onCancel={this.close} onOk={this.producthandleOk}></ProductSelector> : null
                }
                {/* 人员选择器---组件 */}
                {
                    this.state.visibleSelector ? <Selector title={'人员选择器'} onOk={this.onSelectorOK} onCancel={this.close} /> : null
                }
            </div>  
        )
    }
}
const BasicInformations = Form.create()(BasicInformation)
export default BasicInformations