/***
 *   配置项-配置基础显示数据文件
 *   @author gl
 */

import React, { Component } from 'react'
import { Row, Col,  Input, Select,  DatePicker,Upload,Form,Icon,InputNumber,TreeSelect } from 'antd'
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
let name='realName';
if (process.env.NODE_ENV == 'production') {
    name=`${process.env.ENV_NAME}_realName`
}
export const baseData = {registerUserName:localStorage.getItem(name)}
//查询条件
export const rules1= [
    {
        label: '模糊查询',
        key: 'x',
        render: _ => <Input  placeholder="请输入"  />
    }
]
function render(_this,type,selectData,itemCode,itemValue,selectChange,required,dataIndex,label) {
    if(type == 'input1'){
        return <Input disabled={required} placeholder="请输入" />
    }else if(type == 'input2'){
        return <Input disabled={required} disabled placeholder="项目带入" />
    }else if(type == 'input4'){
        return <Input disabled={required} disabled placeholder={_this.props.searchListIDCode==2 ? "产品带入" : "配置项带入"} />
    }else if(type == 'input5'){
        return <Input disabled={required} disabled placeholder="系统类别带入" />
    }else if(type == 'input3'){
        return <Input disabled={required} placeholder="请输入" suffix={<Icon type="appstore" className="dateIcon" onClick={() => _this.openProject(dataIndex)} />} />
    }else if(type == 'select'){
        return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true} disabled={required} onChange={(value,option) => _this.onAreaChange(selectChange,value,selectData,dataIndex,itemValue,option,label)}>
                    {
                        _this.state.selectData[selectData] ? _this.state.selectData[selectData].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} appitem={items}>{itemValue ? items[itemValue] : items.name}</Option>)
                        }):[].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        })
                    }
                </Select>
    }else if(type == 'select1'){
        return <Select disabled={required} style={{ width: '100%' }} disabled={required} placeholder="请选择" allowClear={true} onChange={(value,option) => _this.onAreaChange(selectChange,value,selectData,dataIndex,itemValue,option,label)}>
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
    }else if(type == 'treeSelect'){
        return <TreeSelect
                disabled={required}
                style={{ minWidth: 170 }}
                // value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={_this.props.tree.treeData}
                placeholder="请选择"
                onChange={(value,option) => _this.onAreaChange(selectChange,value,selectData,dataIndex,itemValue,option,label)}
                onSelect={_this.props.treeSelect}
            />
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
    //操作系统版本号
    'operateSystemVersion':{
        key:'operateSystemVersion',
        label:'项目号',
        span:6,
        rules:[],
        render: render,
        type:'input1',
    },
    //操作系统
    'operateSystemId':{
        key:'operateSystemId',
        label:'服务区域',
        span:6,
        rules:[],
        render: render,
        type:'select1',
    },
    'basedataId':{
        key:'basedataId',
        label:'配置项名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'treeSelect',
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
        render:render,
        type:'input1'
    },
    //登记人
    'registerUserName':{
        key:'registerUserName',
        label:'登记人',
        span:6,
        rules:[],
        render:render,
        type:'input2'
    },
    //登记时间
    'registerTime':{
        label: '登记时间',
        key: 'registerTime',
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
    //产品类别
    'serviceClassId':{
        key:'serviceClassId',
        label:'产品类别',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select1'
    },
    //技术方向
    'skillTypeId':{
        key:'skillTypeId',
        label:'技术方向',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select1'
    },
    //品牌
    'brandId':{
        key:'brandId',
        label:'品牌',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select1'
    },
    //产品线
    'productLineId':{
        key:'productLineId',
        label:'产品线',
        span:6,
        rules:[
            {
            required: true,
            message: '该选项不能为空！',
            },
        ],
        render:render,
        type:'select1'
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
    //产品型号
    'productModelName2':{
        key:'productModelName',
        label:'产品型号',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render:render,
        type:'input1',
    },
    //收集人
    'collectUserName':{
        key:'collectUserName',
        label:'收集人',
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
    //产品等级
    'productLevelId':{
        key:'productLevelId',
        label:'产品等级',
        span:6,
        rules:[{
            required: true,
            message: '该选项不能为空！',
          }],
        render:render,
        type:'select1'
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
    }
}
const columnsBasic = [{
            title: '公司名称',
            dataIndex: 'compayName',
            ellipsis:true,
            align: 'center',
        },
        {
            title: '客户编号',
            dataIndex: 'custNum',
            width:100,
            selectData:'customerData',
            align: 'center'
        },{
            title: '客户名称',
            dataIndex: 'custName',
            ellipsis:true,
            key:"custName",
            align: 'center',
        },{
            title: '项目编号',
            dataIndex: 'projectNumber',
            key:"projectNumber",
            align: 'center',
        },{
            title: '项目名称',
            dataIndex: 'projectName',
            ellipsis: true,
            width:200,
            key:"projectName",
            align: 'center',
        },{
            title: '项目经理',
            dataIndex: 'projectManagerName',
            key:"projectManagerName",
            width:90,
            align: 'center',
        },{
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
        },{
            title: '项目销售',
            dataIndex: 'projectSalesmanName',
            key:"projectSalesmanName",
            align: 'center',
        },
        {
            title: '所在省市',
            dataIndex: 'projectArea',
            key:"projectAreaId",
            selectData:'areaData',
            itemValue:'area',
            selectChange: 'projectAreaId',
            align: 'center',
        },{
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
        },{
            title: '联系方式',
            dataIndex: 'custUserMobile',
            key:"custUserMobile",
            align: 'center',
        }
        ]
const rules = [{
        label: '配置项',
        key: 'basedataId',
        render: _this => <TreeSelect
                            style={{ minWidth: 180 }}
                            // value={this.state.value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={_this.state.tree.treeData}
                            placeholder="请选择"
                            onSelect={_this.onTreeSelect}
                            // onChange={this.onChange}
                        />
    },{
        label: '项目号',
        key: 'projectNumber',
        render: _ => <Input  placeholder="请输入"  />
    },
    {
        label: '项目名称',
        key: 'projectName',
        render: _ => <Input  placeholder="请输入"  />
    
    },{
        label: '登记人',
        key: 'registerUserName',
        render: _ => <Input  placeholder="请输入"  />
    },{
        label: '收集人',
        key: 'collectUserName',
        render: _ => <Input  placeholder="请输入"  />
    }]
const riskColumns = [
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
]
//输出面板信息
export const panes = [
    //硬件设备子节点
    {
        type:['2'],
        rules:[...rules],
        riskColumns:[...riskColumns],
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
            columnsBasic:[...columnsBasic],
            columnsDevice:[
                {
                    title: '配置项',
                    dataIndex: 'basedataName',
                    selectChange: 'basedataId',
                    ellipsis:true,
                    key:"basedataId",
                    align: 'center',
                },
                {
                    title: '产品型号/软件名称',
                    dataIndex: 'productModelName',
                    key:"productModelName",
                    key2:"productModelName2",
                    align: 'center',
                },
                {
                    title: '序列号/软件版本号',
                    dataIndex: 'serialNumber',
                    key:"serialNumber",
                    align: 'center',
                },
                {
                    title: '操作系统',
                    dataIndex: 'operateSystemName',
                    key:"operateSystemId",
                    selectChange: 'operateSystemType',
                    selectData:'systemCategory',
                    align: 'center',
                },
                {
                    title: '操作系统版本',
                    dataIndex: 'operateSystemVersion',
                    key:"operateSystemVersion",
                    align: 'center',
                },
                {
                    title: '应用类别',
                    dataIndex: 'appTypeName',
                    key:"appTypeId",
                    selectChange: 'appTypeId',
                    selectData:'systemCategory',
                    align: 'center',
                },
                {
                    title: '应用名称',
                    dataIndex: 'appName',
                    key: 'appName',
                    align: 'center',
                },
                {
                    title: '应用重要性',
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
                    title: '是否维护',
                    dataIndex: 'isMroName',
                    key:'isMroId',
                    selectData:'maintained',
                    align: 'center'
                },
                {
                    title: '产品类别',
                    dataIndex: 'serviceClassName',
                    key:"serviceClassName",
                    align: 'center',
                },
                {
                    title: '运维对象',
                    dataIndex: 'skillTypeName',
                    key:"skillTypeName",
                    align: 'center',
                },
                {
                    title: '品牌',
                    dataIndex: 'brandName',
                    key:"brandName",
                    align: 'center',
                },
                {
                    title: '产品线',
                    dataIndex: 'productLineName',
                    key:"productLineName",
                    align: 'center',
                },
                {
                    title: '产品线级别',
                    dataIndex: 'productLevel',
                    key:"productLevel",
                    align: 'center',
                },
                {
                    title: '收集人',
                    dataIndex: 'collectUserName',
                    key: 'collectUserName',
                    align: 'center',
                },
                {
                    title: '登记人',
                    dataIndex: 'registerUserName',
                    key: 'registerUserName',
                    align: 'center',
                },
                {
                    title: '登记时间',
                    dataIndex: 'registerTime',
                    key:"registerTime",
                    align: 'center',
                }
            ]
        },
        columns:[]
    },
    //软件设备
    {
        type:['1'],
        rules:[...rules],
        riskColumns:[...riskColumns],
        basicData:{
            columnsBasic:[...columnsBasic],
            columnsDevice:[
                {
                    title: '配置项',
                    dataIndex: 'basedataName',
                    selectChange: 'basedataId',
                    ellipsis:true,
                    key:"basedataId",
                    align: 'center',
                },
                {
                    title: '产品型号/软件名称',
                    dataIndex: 'productModelName',
                    key:"productModelName",
                    key2:"productModelName2",
                    align: 'center',
                },
                {
                    title: '序列号/软件版本号',
                    dataIndex: 'serialNumber',
                    key:"serialNumber",
                    align: 'center',
                },
                {
                    title: '操作系统',
                    dataIndex: 'operateSystemName',
                    key:"operateSystemId",
                    selectChange: 'operateSystemType',
                    selectData:'systemCategory',
                    align: 'center',
                },
                {
                    title: '操作系统版本',
                    dataIndex: 'operateSystemVersion',
                    key:"operateSystemVersion",
                    align: 'center',
                },
                {
                    title: '应用类别',
                    dataIndex: 'appTypeName',
                    key:"appTypeId",
                    selectChange: 'appTypeId',
                    selectData:'systemCategory',
                    align: 'center',
                },
                {
                    title: '应用名称',
                    dataIndex: 'appName',
                    key: 'appName',
                    align: 'center',
                },
                {
                    title: '应用重要性',
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
                    title: '是否维护',
                    dataIndex: 'isMroName',
                    key:'isMroId',
                    selectData:'maintained',
                    align: 'center'
                },
                {
                    title: '产品类别',
                    dataIndex: 'serviceClassName',
                    key:'serviceClassName',
                    align: 'center',
                },
                {
                    title: '运维对象',
                    dataIndex: 'skillTypeName',
                    key:"skillTypeName",
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
                    title: '产品线级别',
                    dataIndex: 'productLevel',
                    selectData:'productLevelType',
                    key:"productLevelId",
                    align: 'center',
                },
                {
                    title: '收集人',
                    dataIndex: 'collectUserName',
                    key: 'collectUserName',
                    align: 'center',
                },
                {
                    title: '登记人',
                    dataIndex: 'registerUserName',
                    key: 'registerUserName',
                    align: 'center',
                },
                {
                    title: '登记时间',
                    dataIndex: 'registerTime',
                    key:"registerTime",
                    align: 'center',
                }
        ]},
        subColumns:[],
        columns:[]
    }
];