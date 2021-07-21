import React, { Component } from 'react'
import { Row, Col,  Input, Select,  DatePicker,Upload,Form,Icon,InputNumber } from 'antd'
const { Option } = Select;
const FormItem = Form.Item
const { TextArea,Search} = Input;
// 引入日期格式化
import moment from 'moment'

let ComponentNode,riskInvestigationNode;
export const setComNode = (type,_this) => {
    if(type == 'risk'){
        riskInvestigationNode = _this;
    }else{
        ComponentNode = _this;
    }
}

export const baseData = {}


//查询条件
export const rules1= [
    {
        label: '模糊查询',
        key: 'x',
        render: _ => <Input  placeholder="请输入"  />
    }
]
function render(_this,type,selectData,itemCode,itemValue,selectChange,required,dataIndex) {
    if(type == 'input1'){
        return <Input disabled={required} placeholder="请输入" />
    }else if(type == 'input2'){
        return <Input disabled={required} disabled placeholder="项目带入" />
    }else if(type == 'input4'){
        return <Input disabled={required} disabled placeholder="产品带入" />
    }else if(type == 'input5'){
        return <Input disabled={required} disabled placeholder="系统类别带入" />
    }else if(type == 'input3'){
        return <Input disabled={required} placeholder="请选择" suffix={<Icon type="appstore" className="dateIcon" onClick={() => _this.openProject(dataIndex)} />} />
    }else if(type == 'select'){
        return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true} disabled={required} onChange={(value,option) => _this.onAreaChange(selectChange,value,selectData,dataIndex,itemValue,option)}>
                    {
                        _this.state.selectData[selectData] ? _this.state.selectData[selectData].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} appitem={items}>{itemValue ? items[itemValue] : items.name}</Option>)
                        }):[].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        })
                    }
                </Select>
    }else if(type == 'select1'){
        return <Select disabled={required} style={{ width: '100%' }} disabled={required} placeholder="请选择" allowClear={true} onChange={(value,option) => _this.onAreaChange(selectChange,value,selectData,dataIndex,itemValue,option)}>
                    {
                        _this.state.selectData[selectData] ? _this.state.selectData[selectData].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} appitem={items}>{itemValue ? items[itemValue] : items.name}</Option>)
                        }):[].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        })
                    }
                </Select>
    }else if(type == 'textarea'){
        return <TextArea disabled={required} placeholder="请输入" rows={4}/>
    }else if(type == 'date'){
        return <DatePicker disabled={required} placeholder="请选择日期" format="YYYY-MM-DD" />
    }
}
function renderDom(obj) {
    return {
        key:obj.key,
        label:obj.title,
        span:6,
        rules:[],
        render: render,
        type:obj.inputType,
    }  
}
export const assetsListData = {
    //配置项名称
    'basedataName':{
        key:'basedataName',
        label:'配置项名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input2',
    },
    //项目号
    'projectNumber':{
        key:'projectNumber',
        label:'项目号',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input3',
    },
    //项目名称
    'projectName':{
        key:'projectName',
        label:'项目名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input2',
    },
    //项目经理
    'projectManagerName':{
        key:'projectManagerName',
        label:'项目经理',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //客户名称
    'custName':{
        key:'custName',
        label:'客户名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input2',
    },
    //保障结束日期
    'maintenanceEnd':{
        label: '保障结束日期',
        key: 'maintenanceEnd',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'date',
    },
    //保障开始日期
    'maintenanceStart':{
        label: '保障开始日期',
        key: 'maintenanceStart',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'date',
    },
    //结束时间
    'projectEndDate':{
        label: '结束时间',
        key: 'projectEndDate',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input2',
    },
    //开始时间
    'projectStartDate':{
        label: '开始时间',
        key: 'projectStartDate',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'input2',
    },
    //项目经理
    'projectManagerName':{
        key:'projectManagerName',
        label:'项目经理',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //项目销售
    'projectSalesmanName':{
        key:'projectSalesmanName',
        label:'项目销售',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //服务区域
    'projectAreaId':{
        key:'projectAreaId',
        setValue:'projectAreaName',
        label:'服务区域',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'select1',
    },
    //机房地址
    'computerRoomAddress':{
        key:'computerRoomAddress',
        label:'机房地址',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        },
        render:render,
        type:'select'
    },
    //客户方管理员
    'custUserName':{
        key:'custUserId',
        label:'客户方管理员',
        setValue:'custUserName',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input1'
    },
    //客户
    'custId':{
        key:'custId',
        label:'客户',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select'
    },
    //客户管理员
    'custUserId':{
        key:'custUserId',
        label:'客户管理员',
        setValue:'custUserName',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select'
    },
    //联系方式
    'custUserMobile':{
        key:'custUserMobile',
        label:'联系方式',
        span:6,
        rules:[
            {
              required: true,
              pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
              message: '请输入正确的联系方式！',
            },
          ],
        render: () =>{
            return <Input placeholder="请输入联系方式" />;
        },
        render:render,
        type:'input1'
    },
    //产品类别
    'serviceClassName':{
        key:'serviceClassName',
        setValue:'serviceClassName',
        label:'产品类别',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input4'
    },
    //技术方向
    'skillTypeName':{
        key:'skillTypeName',
        setValue:'skillTypeName',
        label:'技术方向',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input4'
    },
    //品牌
    'brandName':{
        key:'brandName',
        setValue:'brandName',
        label:'品牌',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input4'
    },
    //产品线
    'productLineName':{
        key:'productLineName',
        setValue:'productLineName',
        label:'产品线',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input4'
    },
    //产品型号
    'productModelName':{
        key:'productModelName',
        setValue:'productModelName',
        label:'产品型号',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render:render,
        type:'input3',
    },
    //产品等级
    'productLevel':{
        key:'productLevel',
        setValue:'productLevelName',
        label:'产品等级',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'input4'
    },
    //产品名称
    'productName':{
        key:'productName',
        label:'产品名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'input1'
    },
    //应用类别
    'appTypeId':{
        label: '应用类别',
        key: 'appTypeId',
        setValue:'appTypeName',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'select'
    },
    //appLevel系统重要程度
    'appLevel':{
        label: '系统重要程度',
        key: 'appLevel',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'select'
    },
    //风险等级
    'riskLevelName':{
        label: '风险等级',
        key: 'riskLevelName',
        span:6,
        rules:[],
        render:render,
        type:'input5'
    },
    //是否维护
    'isMroId':{
        label: '是否维护',
        key: 'isMroId',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'select'
    },
    //用途
    'usage':{
        key:'usage',
        label:'用途',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
     //操作
    'operation':{
        key:'operation',
        label:'操作',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
     //创建人
    'creatorName':{
        key:'creatorName',
        label:'创建人',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
    //修改时间
    'updateTime':{
        key:'updateTime',
        label:'修改时间',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
    //修改人
    'updaterName':{
        key:'updaterName',
        label:'修改人',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
    //状态
    'status':{
        label: '状态',
        key: 'status',
        span:6,
        rules:[],
        render:render,
        type:'select'
    },
    //备注
    'description':{
        key:'description',
        label:'备注',
        span:24,
        rules:[],
        render:render,
        type:'textarea'
    },
    //MODEL型号
    'appName':{
        label: 'MODEL型号',
        key: 'appName',
        span:6,
        rules:[],
        render:render,
        type:'input1'
    },
    //序列号
    'serialNumber':{
        key:'serialNumber',
        label:'序列号',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'input1'
    },
     //备机情况
     'strValue3':{
        key:'strValue3',
        label:'备机情况',
        span:6,
        render:render,
        renderDom:renderDom,
    },
     //控制器型号
     'strValue4':{
        key:'strValue4',
        label:'控制器型号',
        span:6,
        rules:[],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
     //控制器数量
     'strValue5':{
        key:'strValue5',
        label:'控制器数量',
        span:6,
        rules:[
            
          ],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
    //硬盘/驱动器/SFP型号
    'strValue6':{
        key:'strValue6',
        label:'硬盘/驱动器/SFP型号',
        span:6,
        rules:[
            
          ],
        
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //硬盘/驱动器/SFP数量
    'strValue7':{
        key:'strValue7',
        label:'硬盘/驱动器/SFP数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //控制器微码
    'strValue8':{
        key:'strValue8',
        label:'控制器微码',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //Raid保护
    'strValue9':{
        key:'strValue9',
        label:'Raid保护',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源风扇冗余
    'strValue10':{
        key:'strValue10',
        label:'电源风扇冗余',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //风险规避意见
    'strValue11':{
        key:'strValue11',
        label:'风险规避意见',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //HotSpare描述
    'strValue12':{
        key:'strValue12',
        label:'HotSpare描述',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //raid级别
    'strValue13':{
        key:'strValue13',
        label:'raid级别',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //异步型号
    'strValue14':{
        key:'strValue14',
        label:'异步型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //异步数量
    'strValue15':{
        key:'strValue15',
        label:'异步数量',
        span:6,
        rules:[],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
    //内存型号
    'strValue16':{
        key:'strValue16',
        label:'内存型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //内存数量
    'strValue17':{
        key:'strValue17',
        label:'内存数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //磁带机型号
    'strValue18':{
        key:'strValue18',
        label:'磁带机型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //磁带机数量
    'strValue19':{
        key:'strValue19',
        label:'磁带机数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源型号
    'strValue20':{
        key:'strValue20',
        label:'电源型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源数量
    'strValue21':{
        key:'strValue21',
        label:'电源数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //RootVG镜像
    'strValue22':{
        key:'strValue22',
        label:'RootVG镜像',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //单电运行
    'strValue23':{
        key:'strValue23',
        label:'单电运行',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //风险规避意见
    'strValue24':{
        key:'strValue24',
        label:'风险规避意见',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //用途
    'usage':{
        key:'usage',
        label:'用途',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //配置项编号
    'strValue25':{
        key:'strValue25',
        label:'配置项编号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
}
const columnsBase = [{
    title: '配置项',
    dataIndex: 'basedataTypeName',
    ellipsis:true,
    key:"basedataTypeId",
    itemCode:'id',
    itemValue:'basedataTypeName',
    selectData:'basedataTypeList',
    align: 'center',
},
{
    title: '客户编号',
    dataIndex: 'custNum',
    width:100,
    selectData:'customerData',
    align: 'center'
},
{
    title: '项目编号',
    dataIndex: 'projectNumber',
    key:"projectNumber",
    align: 'center',
},
{
    title: '客户名称',
    dataIndex: 'custName',
    ellipsis:true,
    key:"custName",
    align: 'center',
},
{
    title: '项目名称',
    dataIndex: 'projectName',
    ellipsis: true,
    width:200,
    key:"projectName",
    align: 'center',
},
{
    title: '项目经理',
    dataIndex: 'projectManagerName',
    key:"projectManagerName",
    width:90,
    align: 'center',
},
{
    title: '开始时间',
    dataIndex: 'projectStartDate',
    key:"projectStartDate",
    align: 'center',
},
{
    title: '结束时间',
    dataIndex: 'projectEndDate',
    key:"projectEndDate",
    align: 'center',
},
{
    title: '项目销售',
    dataIndex: 'projectSalesmanName',
    key:"projectSalesmanName",
    align: 'center',
},
{
    title: '服务区域',
    dataIndex: 'projectAreaArea',
    key:"projectAreaId",
    selectData:'areaData',
    itemValue:'area',
    selectChange: 'projectAreaId',
    align: 'center',
},
{
    title: '机房地址',
    dataIndex: 'projectAreaAddress',
    key:"projectAreaAddress",
    ellipsis:true,
    align: 'center',
},
{
    title: '客户方管理员',
    dataIndex: 'custUserName',
    selectData:'customerData',
    key:"custUserId",
    align: 'center',
},
{
    title: '联系方式',
    dataIndex: 'custUserMobile',
    key:"custUserMobile",
    align: 'center',
},
{
    title: '产品类别',
    dataIndex: 'serviceClassName',
    key:"serviceClassId",
    selectChange: 'serviceClassId',
    selectData:'productType',
    align: 'center',
},
{
    title: '技术方向',
    dataIndex: 'skillTypeName',
    selectChange: 'skillTypeId',
    selectData:'productSkillType',
    key:"skillTypeId",
    align: 'center',
},
{
    title: '品牌',
    dataIndex: 'brandName',
    selectChange: 'brandId',
    selectData:'productBrandType',
    key:"brandId",
    align: 'center',
},
{
    title: '产品线',
    dataIndex: 'productLineName',
    selectData:'productLineType',
    key:"productLineId",
    selectChange: 'productLineId',
    align: 'center',
},
{
    title: '产品型号',
    dataIndex: 'productModelName',
    selectData:'productModeType',
    key:"productModelId",
    selectChange: 'productModelId',
    align: 'center',
},
{
    title: '产品等级',
    dataIndex: 'productLevel',
    selectData:'productLevel',
    key:"productLevel",
    align: 'center',
}]
export const columns = [
    ...columnsBase,
{
    title: 'MODEL型号',
    dataIndex: 'strValue1',
    key:"strValue1",
    align: 'center',
},
{
    title: '序列号',
    dataIndex: 'strValue2',
    key:"strValue2",
    align: 'center',
},
{
    title: '应用类别',
    dataIndex: 'appTypeName',
    key:"appTypeId",
    selectData:'appType',
    align: 'center',
},
{
    title: '备机情况',
    dataIndex: 'strValue3',
    key:"strValue3",
    selectData:'backupStatus',
    inputType:'select',
    align: 'center',
},
{
    title: '风险等级',
    dataIndex: 'riskLevelName',
    selectData:'riskLevel',
    ellipsis:true,
    key:"riskLevelId",
    align: 'center',
}]

//输出面板信息
export const panes = [
    //硬件设备子节点
    {
        type:['skillType'],
        rules:[{
            label: '项目号',
            key: 'projectNumber',
            render: _ => <Input  placeholder="请输入"  />
        },
        {
            label: '项目名称',
            key: 'projectName',
            render: _ => <Input  placeholder="请输入"  />
           
        },{
            label: '服务区域',
            key: 'projectArea',
            render: _ => <Input  placeholder="请输入"  />
        },{
            label: '客户名称',
            key: 'custName',
            render: _ => <Input  placeholder="请输入"  />
        },{
            label: '产品型号',
            key: 'productModelName',
            render: _ => <Input  placeholder="请输入"  />
        },{
            label: '产品线',
            key: 'productLineName',
            render: _ => <Input  placeholder="请输入"  />
        },{
            label: '品牌',
            key: 'brandName',
            render: _ => <Input  placeholder="请输入"  />
        },{
            label: '产品等级',
            key: 'productLevelId',
            render: _this => <Select  placeholder="请选择" allowClear={true} style={{width:182}}>
                            {
                                _this.state.selectData.productLevelList.map((items, index) => {
                                    return (<Option key={items.id} value={items.id}>{items.name}</Option>)
                                })
                            }
                        </Select>
        }],
        riskColumns:[
            {
                title: <div className="ant-form-item-required1">风险配置项</div>,
                dataIndex: 'rcName',
                align:'center',
                width:'100px',
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">当前风险</div>,
                dataIndex: 'rcValue',
                width:'100px',
                align:'center',
                render:(text,record,index) => {
                    const {roleWindow} = riskInvestigationNode.props;
                    if(record.dataType == 'string'){
                        return <Input disabled={roleWindow.roleModalType == 2 ? true : false} placeholder="请选择" value={text} onChange={({target:{value}}) => riskInvestigationNode.onFormChange(index,'rcValue',value)} />
                    }else if(record.dataType == 'int'){
                        return <Select disabled={roleWindow.roleModalType == 2 ? true : false} style={{ width: '100%' }} value={record.rcValueId} placeholder="请选择" allowClear={true} onChange={(value,option) => riskInvestigationNode.onFormChange(index,'rcValueId',value,'rcValue',option)}>
                                    {
                                        record.currentRisks.map((items, index) => {
                                            return (<Option key={index} value={items.currentRiskId} appitem={items}>{items.currentRiskName}</Option>)
                                        })
                                    }
                                </Select>
                    }else if(record.dataType == 'date'){
                        return <DatePicker disabled={roleWindow.roleModalType == 2 ? true : false} placeholder="请选择日期" value={text ? moment(text) : null} format="YYYY-MM-DD" onChange={(date, dateString) => riskInvestigationNode.onFormChange(index,'rcValue',dateString)} />
                    }
                   
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">收集方式</div>,
                dataIndex: 'rcSourceId',
                align:'center',
                width:'100px',
                render:(text,record,index) => {
                    const {roleWindow} = riskInvestigationNode.props;
                    return <Select disabled={roleWindow.roleModalType == 2 ? true : false} style={{ width: '100%' }} value={text} placeholder="请选择" allowClear={true} onChange={(value,option) => riskInvestigationNode.onFormChange(index,'rcSourceId',value,'rcSource',option)}>
                                {
                                    riskInvestigationNode.state.selectData.rcSourceList.map((items, index) => {
                                        return (<Option key={index} value={items.id} appitem={items}>{items.name}</Option>)
                                    })
                                }
                            </Select>
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">建议值</div>,
                dataIndex: 'rcSuggest',
                align:'center',
                width:'80px',
                render:(text,record,index) => {
                    const {roleWindow} = riskInvestigationNode.props;
                    return <Input disabled={roleWindow.roleModalType == 2 ? true : false} placeholder="请输入"  value={text} onChange={({target:{value}}) => riskInvestigationNode.onFormChange(index,'rcSuggest',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">备注</div>,
                dataIndex: 'description',
                align:'center',
                width:'280px',
                render:(text,record,index) => {
                    const {roleWindow} = riskInvestigationNode.props;
                    return <Input disabled={roleWindow.roleModalType == 2 ? true : false} placeholder="请选择" value={text} onChange={({target:{value}}) => riskInvestigationNode.onFormChange(index,'description',value)} />
                },
                editable: true,
            }
        ],
        subColumns:[
            {
                title: '序号',
                dataIndex: 'key',
                editable: false,
                align:'center',
                width:'60px',
                //每一页都从1开始
                render:(text,record,index)=> `${index+1}`
            },
            {
                title: <div className="ant-form-item-required">部件号</div>,
                dataIndex: 'partNumber',
                width:'100px',
                align:'center',
                render:(text,record,index) => {
                    const {roleWindow} = ComponentNode.props;
                    return <Input placeholder="请选择" disabled={roleWindow.roleModalType == 2 ? true : false} value={text} suffix={<Icon type="appstore" className="dateIcon" onClick={() => ComponentNode.openModal()} />} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件序列号</div>,
                dataIndex: 'partSerial',
                align:'center',
                width:'100px',
                render:(text,record,index) => {
                    const {roleWindow} = ComponentNode.props;
                    return <Input disabled={roleWindow.roleModalType == 2 ? true :false} placeholder="请输入" value={text} onChange={({target:{value}}) => ComponentNode.onFormChange(index,'partSerial',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件位置</div>,
                dataIndex: 'partPosition',
                align:'center',
                width:'150px',
                render:(text,record,index) => {
                    const {roleWindow} = ComponentNode.props;
                    return <Input disabled={roleWindow.roleModalType == 2 ? true :false} placeholder="请输入" value={text} onChange={({target:{value}}) => ComponentNode.onFormChange(index,'partPosition',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件类别</div>,
                dataIndex: 'partTypeName',
                align:'center',
                editable: true,
                width:'150px',
                render:(text,record,index) => {
                   return <Input disabled={true} placeholder="部件号带入" value={text} onChange={({target:{value}}) =>ComponentNode.onFormChange(index,'partTypeName',value)} />
                }
            },
            {
                title: <div className="ant-form-item-required1">数量</div>,
                dataIndex: 'partAmount',
                align:'center',
                width:'90px',
                render:(text,record,index) => {
                    const {roleWindow} = ComponentNode.props;
                    return <InputNumber style={{width: '100%'}} disabled={roleWindow.roleModalType == 2 ? true :false} min={1} value={text ? text : 1} onChange={(value) => ComponentNode.onFormChange(index,'partAmount',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">描述</div>,
                dataIndex: 'description',
                align:'center',
                width:'200px',
                render:(text,record,index) => {
                    return <Input disabled={true} placeholder="部件号带入" value={text} onChange={({target:{value}}) =>ComponentNode.onFormChange(index,'description',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">FC</div>,
                dataIndex: 'fc',
                align:'center',
                width:'150px',
                render:(text,record,index) => {
                    return <Input disabled={true} placeholder="部件号带入"  value={text} onChange={({target:{value}}) => ComponentNode.onFormChange(index,'fc',value)} />
                },
                editable: true,
            },{
                title: <div className="ant-form-item-required1">备注</div>,
                dataIndex: 'remark',
                align:'center',
                width:'280px',
                render:(text,record,index) => {
                    const {roleWindow} = ComponentNode.props;
                    return <Input disabled={roleWindow.roleModalType == 2 ? true :false} value={text} onChange={({target:{value}}) => ComponentNode.onFormChange(index,'remark',value)} />
                },
                editable: true,
            }
        ],
        basicData:{
            columnsBasic:[{
                title: '配置项',
                dataIndex: 'basedataName',
                ellipsis:true,
                key:"basedataName",
                align: 'center',
            },
            {
                title: '客户编号',
                dataIndex: 'custNum',
                width:100,
                selectData:'customerData',
                align: 'center'
            },
            {
                title: '项目编号',
                dataIndex: 'projectNumber',
                key:"projectNumber",
                align: 'center',
            },
            {
                title: '客户名称',
                dataIndex: 'custName',
                ellipsis:true,
                key:"custName",
                align: 'center',
            },
            {
                title: '项目名称',
                dataIndex: 'projectName',
                ellipsis: true,
                width:200,
                key:"projectName",
                align: 'center',
            },
            {
                title: '项目经理',
                dataIndex: 'projectManagerName',
                key:"projectManagerName",
                width:90,
                align: 'center',
            },
            {
                title: '开始时间',
                dataIndex: 'projectStartDate',
                key:"projectStartDate",
                align: 'center',
            },
            {
                title: '结束时间',
                dataIndex: 'projectEndDate',
                key:"projectEndDate",
                align: 'center',
            },
            {
                title: '项目销售',
                dataIndex: 'projectSalesmanName',
                key:"projectSalesmanName",
                align: 'center',
            },
            {
                title: '服务区域',
                dataIndex: 'projectArea',
                key:"projectAreaId",
                selectData:'areaData',
                itemValue:'area',
                selectChange: 'projectAreaId',
                align: 'center',
            },
            {
                title: '机房地址',
                dataIndex: 'computerRoomAddress',
                key:"computerRoomAddress",
                selectData:'addressList',
                itemValue:'address',
                ellipsis:true,
                align: 'center',
            },
            {
                title: '客户方管理员',
                dataIndex: 'custUserName',
                selectData:'customerData',
                selectChange: 'custUserId',
                key:"custUserId",
                align: 'center',
            },
            {
                title: '联系方式',
                dataIndex: 'custUserMobile',
                key:"custUserMobile",
                align: 'center',
            }],
            columnsDevice:[
                {
                    title: '产品型号',
                    dataIndex: 'productModelName',
                    key:"productModelName",
                    align: 'center',
                },
                {
                    title: '产品等级',
                    dataIndex: 'productLevel',
                    selectData:'productLevel',
                    key:"productLevel",
                    align: 'center',
                },{
                    title: '产品线',
                    dataIndex: 'productLineName',
                    selectData:'productLineType',
                    key:"productLineName",
                    selectChange: 'productLineId',
                    align: 'center',
                },{
                    title: '品牌',
                    dataIndex: 'brandName',
                    key:"brandName",
                    align: 'center',
                },{
                    title: '技术方向',
                    dataIndex: 'skillTypeName',
                    key:"skillTypeName",
                    align: 'center',
                },{
                    title: '产品类别',
                    dataIndex: 'serviceClassName',
                    key:"serviceClassName",
                    align: 'center',
                },
                {
                    title: '序列号',
                    dataIndex: 'serialNumber',
                    key:"serialNumber",
                    align: 'center',
                },
                {
                    title: '保障开始日期',
                    dataIndex: 'maintenanceStart',
                    key:"maintenanceStart",
                    align: 'center',
                },
                {
                    title: '保障结束日期',
                    dataIndex: 'maintenanceEnd',
                    key:"maintenanceEnd",
                    align: 'center',
                },
                {
                    title: '系统类别',
                    dataIndex: 'appTypeName',
                    key:"appTypeId",
                    selectChange: 'appTypeId',
                    selectData:'systemCategory',
                    align: 'center',
                },
                {
                    title: '系统名称',
                    dataIndex: 'appName',
                    key: 'appName',
                    align: 'center',
                },
                {
                    title: '系统重要程度',
                    dataIndex: 'appLevel',
                    key:"appLevel",
                    selectData:'appLevelList',
                    align: 'center',
                },
                {
                    title: '风险等级',
                    dataIndex: 'riskLevelName',
                    ellipsis:true,
                    key:"riskLevelName",
                    align: 'center',
                },
                {
                    title: '是否维护',
                    dataIndex: 'isMroName',
                    key:'isMroId',
                    selectData:'maintained',
                    align: 'center'
                }
            ]
        },
        columns:[]
    },
    //硬件设备/软件设备
    {
        type:['productType'],
        rules:[...rules1],
        basicData:{columnsBasic:[
            {
                title: '编码',
                dataIndex: 'code',
                width:80,
                align: 'center',
            },{
                title: '名称',
                dataIndex: 'name',
                align: 'center',
            },{
                title: '所属',
                dataIndex: 'parentName',
                align: 'center',
            },{
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                render:(val)=>{
                    return val == 1 ? '启用' : '废弃';
                }
            },{
                title: '创建人',
                dataIndex: 'creatorName',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width:150,
                align: 'center',
            }
        ],columnsDevice:[]},
        subColumns:[],
        columns:[]
    },
    //X86
    {
        type:[25],
        rules:[...rules1],
        basicData:{columnsBasic:[],columnsDevice:[]},
        subColumns:[],
        columns:[
            ...columns,
            {
                title: '应用描述',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: 'CPU内核编号',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                width:100,
                align: 'center',
            },
            {
                title: 'CPU数量',
                dataIndex: 'strValue6',
                inputType:'input1',
                key: 'strValue6',
                align: 'center',
            },
            {
                title: '硬盘型号',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                align: 'center',
            },
            {
                title: '硬盘数量',
                dataIndex: 'strValue8',
                inputType:'input1',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: 'SCSI/RAID卡型号',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: 'SCSI/RAID卡数量',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: 'HBA卡型号',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                width:100,
                align: 'center',
            },
            {
                title: 'HBA卡数量',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '网卡型号',
                dataIndex: 'strValue13',
                inputType:'input1',
                key: 'strValue13',
                align: 'center',
            },
            {
                title: '网卡数量',
                dataIndex: 'strValue14',
                inputType:'input1',
                key: 'strValue14',
                align: 'center',
            },
            {
                title: '电源型号',
                dataIndex: 'strValue15',
                inputType:'select',
                key: 'strValue15',
                align: 'center',
            },
            {
                title: '电源数量',
                dataIndex: 'strValue16',
                inputType:'input1',
                key: 'strValue16',
                align: 'center',
            },
            {
                title: '内存型号',
                dataIndex: 'strValue17',
                inputType:'input1',
                key: 'strValue17',
                width:150,
                align: 'center',
            },
            {
                title: '内存数量',
                dataIndex: 'strValue18',
                inputType:'input1',
                key: 'strValue18',
                align: 'center',
            },
            {
                title: '磁带机型号',
                dataIndex: 'strValue19',
                inputType:'input1',
                key: 'strValue19',
                align: 'center',
            },
            {
                title: '磁带机数量',
                dataIndex: 'strValue20',
                inputType:'input1',
                key: 'strValue20',
                align: 'center',
            },
            {
                title: 'VG镜像',
                dataIndex: 'strValue21',
                inputType:'input1',
                key: 'strValue21',
                align: 'center',
            },
            {
                title: '单电运行',
                dataIndex: 'strValue22',
                inputType:'input1',
                key: 'strValue22',
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue23',
                inputType:'input1',
                key: 'strValue23',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                selectData:'maintained',
                key: 'isMroId',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            }
        ]
    },
    //网络安全（负载均衡）
    {
        type:[26],
        rules:[...rules1],
        basicData:{columnsBasic:[],columnsDevice:[]},
        subColumns:[],
        columns:[
            ...columns,
            {
                title: '应用描述',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: '风扇型号',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                width:150,
                align: 'center',
            },
            {
                title: '风扇数量',
                dataIndex: 'strValue8',
                inputType:'input1',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: '引擎板型号',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: '引擎板数量',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: '业务母板型号',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                align: 'center',
            },
            {
                title: '业务母板数量',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '业务子板型号',
                dataIndex: 'strValue13',
                inputType:'input1',
                key: 'strValue13',
                width:150,
                align: 'center',
            },
            {
                title: '业务子板数量',
                dataIndex: 'strValue14',
                inputType:'input1',
                key: 'strValue14',
                align: 'center',
            },
            {
                title: '引擎板槽位',
                dataIndex: 'strValue15',
                inputType:'input1',
                key: 'strValue15',
                align: 'center',
            },
            {
                title: 'lisence信息',
                dataIndex: 'strValue17',
                inputType:'input1',
                key: 'strValue17',
                align: 'center',
            },
            {
                title: '电源数量',
                dataIndex: 'strValue16',
                inputType:'input1',
                key: 'strValue16',
                align: 'center',
            },
            {
                title: 'uptime',
                dataIndex: 'strValue19',
                inputType:'input1',
                key: 'strValue19',
                width:150,
                align: 'center',
            },
            {
                title: '内存数量',
                dataIndex: 'strValue18',
                inputType:'input1',
                key: 'strValue18',
                align: 'center',
            },
            {
                title: '管理IP',
                dataIndex: 'strValue20',
                inputType:'input1',
                key: 'strValue20',
                align: 'center',
            },
            {
                title: 'Version',
                dataIndex: 'strValue21',
                inputType:'input1',
                key: 'strValue21',
                align: 'center',
            },
            {
                title: 'Flash/Memory',
                dataIndex: 'strValue22',
                inputType:'input1',
                key: 'strValue22',
                align: 'center',
            },
            {
                title: '设备联系状况',
                dataIndex: 'strValue23',
                inputType:'input1',
                key: 'strValue23',
                width:150,
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue25',
                inputType:'input1',
                key: 'strValue25',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                selectData:'maintained',
                key: 'isMroId',
                align: 'center'
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key:'description',
                width:150,
                align: 'center',
            }
        ]
    },
    //其他（硬件）
    {
        type:[27],
        rules:[...rules1],
        basicData:{columnsBasic:[],columnsDevice:[]},
        subColumns:[],
        columns:[
            ...columns,
            {
                title: '是否正常状态',
                dataIndex: 'strValue4',
                inputType:'select',
                selectData:'maintained',
                key: 'strValue4',
                align: 'center',
                render:(text,row,index) => {
                    if(text == 0){
                        return '否'
                    }else{
                        return '是'
                    }
                }
            },
            {
                title: '容量',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                width:150,
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                selectData:'maintained',
                key: 'isMroId',
                align: 'center'
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                key: '0',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                key: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ]
    },
    //中间件
    {
        type:[29],
        rules:[...rules1],
        basicData:{columnsBasic:[],columnsDevice:[]},
        subColumns:[],
        columns:[
            ...columnsBase,
            {
                title: '中间件名称',
                dataIndex: 'strValue1',
                key: 'strValue1',
                align: 'center',
            },
            {
                title: '版本',
                dataIndex: 'strValue2',
                key: 'strValue2',
                align: 'center',
            },
            {
                title: '应用类别',
                dataIndex: 'appTypeName',
                selectData:'appType',
                key: 'appTypeId',
                align: 'center',
            },
            {
                title: '状态',
                dataIndex: 'strValue3',
                selectData:'statusList',
                inputType:'input1',
                key: 'strValue3',
                align: 'center',
            },
            {
                title: '是否集群',
                dataIndex: 'strValue4',
                selectData:'maintained',
                inputType:'select',
                key: 'strValue4',
                align: 'center',
                render:(text,row,index) => {
                    if(text == 0){
                        return '否'
                    }else{
                        return '是'
                    }
                }
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                selectData:'maintained',
                key: 'isMroId',
                align: 'center'
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ]
    },
    //数据库（软件）
    {
        type:[28],
        rules:[...rules1],
        basicData:{columnsBasic:[],columnsDevice:[]},
        subColumns:[],
        columns:[
            ...columnsBase,
            {
                title: '数据库名称',
                dataIndex: 'strValue1',
                key: 'strValue1',
                align: 'center',
            },
            {
                title: '实例名称',
                dataIndex: 'strValue2',
                key: 'strValue2',
                align: 'center',
            },
            {
                title: '应用类别',
                dataIndex: 'appTypeName',
                selectData:'appType',
                key: 'appTypeId',
                align: 'center',
            },
            {
                title: '数据库管理方式',
                dataIndex: 'strValue3',
                inputType:'input1',
                key: 'strValue3',
                align: 'center',
            },
            {
                title: '数据库用途',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: 'HA状况',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                align: 'center',
            },
            {
                title: '灾备状况',
                dataIndex: 'strValue6',
                inputType:'input1',
                key: 'strValue6',
                align: 'center',
            },
            {
                title: 'OS版本',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                align: 'center',
            },
            {
                title: '是否集群',
                dataIndex: 'strValue8',
                selectData:'maintained',
                inputType:'select',
                key: 'strValue8',
                align: 'center',
                render:(text,row,index) => {
                    if(text == 0){
                        return '否'
                    }else{
                        return '是'
                    }
                }
            },
            {
                title: '数据库版本',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: '最新补丁',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: '备份方式',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                align: 'center',
            },
            {
                title: '位数',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                selectData:'maintained',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                key: '0',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                key: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ]
    }
];