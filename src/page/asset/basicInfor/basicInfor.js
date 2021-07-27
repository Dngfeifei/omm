import React, { Component } from 'react'
import { Row, Col,  Input, Select,  DatePicker,Upload,Form,Icon } from 'antd'
const { Option } = Select;
const FormItem = Form.Item
const { TextArea } = Input;
export const assetsList = (props) => {
    let childrens = [];
    if(props.dataSource.length){
        props.dataSource.forEach((element,index) => {
            childrens.push(
                <div className="flex" style={{height:100,border:'1px solid black',marginBottom:15,border:'1px solid #e8e8e8'}} key={index}>
                    <Checkbox style={{margin:'0 10px'}} />
                    <p className="flex" style={{width:80,height:'80%',backgroundColor:'red',margin:'auto 0',justifyContent:'center'}}>1级</p>
                    <Row gutter={[5, 5]} style={{flex:'auto'}}>
                        <Col span={8}>序列号：0140617862</Col>
                        <Col span={8}>设备型号：16口串口管理设备ACS16</Col>
                        <Col span={8}>服务大区：服务交付华南大区</Col>
                        <Col span={16}>项目名称：(201051812343)中国移动通信集团福建有限公司第三方维保</Col>
                        <Col span={8}>省份：福建省 </Col>
                        <Col span={16}>客户名称：中国移动通信集团福建有限公司</Col>
                        <Col span={8}>项目经理：金枫</Col>
                    </Row>
                </div>,
            )
        });
    }else{
        childrens = <Empty />
    }
    return childrens;
}
export const baseData = {
    "basedataTypeId":undefined,
    "basedataTypeName":undefined,
    "code":undefined,
    "createTime":undefined,
    "creatorId":undefined,
    "creatorName":undefined,
    "description":undefined,
    "floatValue1":undefined,
    "floatValue2":undefined,
    "floatValue3":undefined,
    "floatValue4":undefined,
    "floatValue5":undefined,
    "id":undefined,
    "intValue1":undefined,
    "intValue10":undefined,
    "intValue2":undefined,
    "intValue3":undefined,
    "intValue4":undefined,
    "intValue5":undefined,
    "intValue6":undefined,
    "intValue7":undefined,
    "intValue8":undefined,
    "intValue9":undefined,
    "isDelete":undefined,
    "name":undefined,
    "parentId":undefined,
    "parentName":undefined,
    "serialNumber":undefined,
    "source":undefined,
    "status":undefined,
    "strValue1":undefined,
    "strValue10":undefined,
    "strValue2":undefined,
    "strValue3":undefined,
    "strValue4":undefined,
    "strValue5":undefined,
    "strValue6":undefined,
    "strValue7":undefined,
    "strValue8":undefined,
    "strValue9":undefined,
    "updateTime":undefined,
    "updaterId":undefined,
    "updaterName":undefined
}
//查询条件
export const rules = {
    rules2:[
        {
            label: '名称',
            key: 'name',
            render: _this => <Input placeholder="请输入" />
        },
        {
            label: '编码',
            key: 'code',
            render: _this => <Input placeholder="请输入"/>
           
        }
    ],
    rules1:[
        {
            label: '名称',
            key: 'name',
            render: _this => <Input placeholder="请输入" value={_this.state.searchName} onChange={({target:{value}}) => _this.handleChange('searchName',value)}/>
        },
        {
            label: '编码',
            key: 'code',
            render: _this => <Input placeholder="请输入" value={_this.state.searchCode} onChange={({target:{value}}) => _this.handleChange('searchCode',value) } />
           
        }
    ]
}
//新增/修改弹出框内容
export const assetsListData = [
    {
        type:[8,14,1,2,3,13],
        data:[
            {
                key:'code',
                label:'编码',
                span:12,
                rules:[
                    {
                      required: true,
                      message: '该选项不能为空！',
                    },
                  ],
                renderForm: (_this,disabled) =>{
                    return <Input disabled={disabled} placeholder="请输入" />;
                }
            },
            {
                key:'name',
                label:'名称',
                span:12,
                rules:[
                    {
                      required: true,
                      message: '该选项不能为空！',
                    },
                  ],
                renderForm: (_this,disabled) =>{
                    return <Input disabled={disabled} placeholder="请输入" />;;
                }
            },
            {
                key:'parentName',
                label:'所属',
                span:12,
                rules:[
                    {
                      required: true,
                      message: '该选项不能为空！',
                    },
                  ],
                renderForm: (_this,disabled) =>{
                    return <Input disabled={disabled} disabled placeholder="请输入" />;
                }
            },
            {
                key:'status',
                label:'状态',
                span:12,
                rules:[
                    {
                      required: true,
                      message: '该选项不能为空！',
                    },
                  ],
                renderForm: (_this,disabled) =>{
                    return <Select disabled={disabled}  placeholder="请选择" allowClear={true}>
                                <Option key="1" value="1">启动</Option>
                                <Option key="0" value="0">废弃</Option>
                            </Select>;
                }
            },
            {
                key:'description',
                label:'说明',
                span:12,
                rules:[
                    {
                      required: true,
                      message: '该选项不能为空！',
                    },
                  ],
                renderForm: (_this,disabled) =>{
                    return <Input disabled={disabled} placeholder="请输入" />;
                }
            }
        ]
    },
    // {
    //     type:[13],
    //     data:[
    //         {
    //             key:'basedataTypeId',
    //             label:'数据类别',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Select  placeholder="请选择" allowClear={true}>
    //                             {
    //                                 _this.state.basedataTypeList.map((items, index) => {
    //                                     return (<Option key={items.id} value={items.id}>{items.basedataTypeName}</Option>)
    //                                 })
    //                             }
    //                         </Select>;
    //             }
    //         },
    //         {
    //             key:'code',
    //             label:'编码',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Input placeholder="请输入" />;
    //             }
    //         },
    //         {
    //             key:'name',
    //             label:'名称',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Input placeholder="请输入" />;;
    //             }
    //         },
    //         {
    //             key:'parentName',
    //             label:'所属',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Input disabled placeholder="请输入" />;
    //             }
    //         },
    //         {
    //             key:'status',
    //             label:'状态',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Select  placeholder="请选择" allowClear={true}>
    //                             <Option key="1" value="1">启动</Option>
    //                             <Option key="0" value="0">废弃</Option>
    //                         </Select>;
    //             }
    //         },
    //         {
    //             key:'intValue1',
    //             label:'产品等级',
    //             span:12,
    //             rules:[
    //                 {
    //                   required: true,
    //                   message: '该选项不能为空！',
    //                 },
    //               ],
    //             render: _this =>{
    //                 return <Input disabled placeholder="请输入" />;
    //             }
    //         }
    //     ]
    // }
]
//表格参数
export const columns = [
    {
        type:[8,14,1,2,3,13],
        data:[
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
                title: '分类',
                dataIndex: 'basedataTypeName',
                ellipsis: {
                    showTitle: false,
                },
                width:200,
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
        ]
    }
]