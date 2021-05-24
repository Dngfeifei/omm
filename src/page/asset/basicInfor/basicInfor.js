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
//查询条件
export const rules = {
    rules1:[
        {
            label: '一级服务目录',
            key: 'a',
            render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
        },
        {
            label: '二级服务目录',
            key: 'b',
            render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                {
                    [].map((items, index) => {
                        return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                    })
                }
            </Select>
           
        },{
            label: '三级服务目录',
            key: 'g',
            render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
        },{
            label: '需求类型',
            key: 'h',
            render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
        },{
            label: '状态',
            key: 'h',
            render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                            {
                                [].map((items, index) => {
                                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                                })
                            }
                        </Select>
        }
    ]
}
//新增/修改弹出框内容
export const assetsListData = {
    assetsListData1:[
        {
            key:'4',
            label:'一级服务目录',
            span:12,
            rules:[
                {
                  required: true,
                  message: '该选项不能为空！',
                },
              ],
            render: _this =>{
                return <div className="plusParent"><Select placeholder="请选择" allowClear={true}>
                            {
                                _this.state.serviceRegionList.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select><Icon type="plus-square" onClick={_this.Secondary}/></div>;
            }
        },
        {
            key:'5',
            label:'二级服务目录',
            span:12,
            rules:[
                {
                  required: true,
                  message: '该选项不能为空！',
                },
              ],
            render: _this =>{
                return <div className="plusParent"><Select placeholder="请选择" allowClear={true}>
                            {
                                _this.state.serviceRegionList.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select><Icon type="plus-square" onClick={_this.Secondary}/></div>;
            }
        },
        {
            key:'9',
            label:'三级服务目录',
            span:12,
            rules:[
                {
                  required: true,
                  message: '该选项不能为空！',
                },
              ],
            render: _this =>{
                return <div className="plusParent"><Select placeholder="请选择" allowClear={true}>
                            {
                                _this.state.serviceRegionList.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select><Icon type="plus-square" onClick={_this.Secondary}/></div>;
            }
        },
        {
            key:'11',
            label:'需求类型',
            span:12,
            rules:[
                {
                  required: true,
                  message: '该选项不能为空！',
                },
              ],
            render: _this =>{
                return <Select style={{ width: '90%' }} placeholder="请选择" allowClear={true}>
                            {
                                _this.state.serviceRegionList.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select>;
            }
        },
        {
            key:'12',
            label:'状态',
            span:12,
            rules:[
                {
                  required: true,
                  message: '该选项不能为空！',
                },
              ],
            render: _this =>{
                return <Select style={{ width: '90%' }} placeholder="请选择" allowClear={true}>
                            {
                                _this.state.serviceRegionList.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select>;
            }
        }
    ]
}
//表格参数
export const columns = {
    columns1:[
        {
            title: '序号',
            dataIndex: 'key',
            editable: false,
            align: 'center',
            width: '80px',
            render: (text, record, index) => `${index + 1}`
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render: (t, r) => {
                t.toString()
                if (t == "1") {
                    return "启用"
                } else if (t == "0") {
                    return "禁用"
                }
            }
        },
        {
            title: '最后更新时间',
            dataIndex: 'updateTime',
            align: 'center',
        }
    ]
}
//表格参数数据匹配
export const panes = {
    pane1:{
        
    },
    pane2:{
        
    },
    pane3:{
       
    },
    pane4:{
        
    },

}

//查询条件基础数据存储
export const conditionalData = {
    pane1:{
        newEntry:false,
        1:[],
        2:[],
        3:[],
        4:[],
        5:[],
    },
    pane2:{
        newEntry:false,
        selectData1:[],
    },
    pane3:{
        newEntry:false,
        selectData1:[],
        selectData2:[],
        selectData3:[],
        selectData4:[],
    },
    pane4:{
        newEntry:false,
        selectData1:[],
        selectData2:[],
        selectData3:[],
        selectData4:[],
        selectData5:[],
        selectData6:[],
        selectData7:[],
    },

}