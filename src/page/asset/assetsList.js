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
//查询条件1
export const rules1 = [
    {
        label: '品牌',
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
        label: '序列号',
        key: 'b',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
            {
                [].map((items, index) => {
                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                })
            }
        </Select>
       
    },{
        label: '配置项名称',
        key: 'c',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入人员名称"/>
    },{
        label: '项目号',
        key: 'd',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
       
    },{
        label: '客户名称',
        key: 'e',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入人员名称"/>
    },{
        label: '项目号',
        key: 'f',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
       
    },{
        label: '状态',
        key: 'g',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '业务重要性',
        key: 'h',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '机房地理位置',
        key: 'i',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '机柜位置',
        key: 'j',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '管理IP',
        key: 'k',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '设备高度',
        key: 'l',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '型号',
        key: 'm',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '资产编号',
        key: 'n',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '投产日期',
        key: 'o',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '采购日期',
        key: 'p',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '过保日期',
        key: 'q',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '设备电源是否冗余',
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
//查询条件1
export const rules2 = [
    {
        label: '品牌',
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
        label: '序列号',
        key: 'b',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
            {
                [].map((items, index) => {
                    return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                })
            }
        </Select>
       
    },{
        label: '配置项名称',
        key: 'c',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入人员名称"/>
    },{
        label: '项目号',
        key: 'd',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
       
    },{
        label: '客户名称',
        key: 'e',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入人员名称"/>
    },{
        label: '项目号',
        key: 'f',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
       
    },{
        label: '状态',
        key: 'g',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '业务重要性',
        key: 'h',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: 'CPU',
        key: 's',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '操作系统家族',
        key: 't',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '操作系统版本',
        key: 'u',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '内存',
        key: 'v',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    },{
        label: '机房地理位置',
        key: 'i',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '机柜位置',
        key: 'j',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '管理IP',
        key: 'k',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '设备高度',
        key: 'l',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '型号',
        key: 'm',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '资产编号',
        key: 'n',
        render: _ => <Input style={{ width: 200 }} placeholder="请输入工单号"/>
    },{
        label: '投产日期',
        key: 'o',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '采购日期',
        key: 'p',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '过保日期',
        key: 'q',
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },{
        label: '设备电源是否冗余',
        key: 'r',
        render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={items.paramterName} value={items.paramterName}>{items.parameterValue}</Option>)
                            })
                        }
                    </Select>
    }
]
//新增/修改弹出框内容
export const assetsListData = [
    {
        key:'1',
        label:'配置项名称',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'2',
        label:'项目号',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'3',
        label:'客户名称',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'4',
        label:'状态',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            _this.state.serviceRegionList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        }
    },
    {
        key:'5',
        label:'业务重要性',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            _this.state.serviceRegionList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        }
    },
    {
        key:'6',
        label:'机房地理位置',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'7',
        label:'机柜位置',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'8',
        label:'机位',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'9',
        label:'品牌',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            _this.state.serviceRegionList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        }
    },
    {
        key:'10',
        label:'型号',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'11',
        label:'设备电源是否冗余',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
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
        label:'管理IP',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'13',
        label:'设备高度',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            _this.state.serviceRegionList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        }
    },
    {
        key:'14',
        label:'序列号',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        key:'15',
        label:'资产编号',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: () =>{
            return <Input placeholder="placeholder" />;
        }
    },
    {
        label: '投产日期',
        key: '16',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },
    {
        label: '采购日期',
        key: '17',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },
    {
        label: '过保日期',
        key: '18',
        span:12,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    },
    {
        label: '描述',
        key: '19',
        span:24,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            }
          ],
        render:_=>  <TextArea rows={4} />
    },
]

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