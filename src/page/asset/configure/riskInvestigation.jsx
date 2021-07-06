

import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';

const { confirm } = Modal;


// 引入 API接口
import { } from '/api/systemParameter'

// 正式服务区域---渲染
class RiskInvestigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                {
                    1:"2323",
                    2:"2323",
                    3:"2323",
                    4:"2323",
                    5:"2323",
                    6:"2323",
                }
            ], //数据包
            selectedRowKeys:null,  //选中的table表格的id
        }
    }

    // 数据更新完成时触发的函数
    componentWillMount() {
        // this.initData(this.props.data)
        console.log('风险排查加载')
    }
    // 初始化
    init = () => {
        this.columns = [
            {
                title: <div className="ant-form-item-required1">风险配置项</div>,
                dataIndex: '1',
                align:'center',
                width:'100px',
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">设备分类</div>,
                dataIndex: '2',
                width:'100px',
                align:'center',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'2',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">收集方式</div>,
                dataIndex: '3',
                align:'center',
                width:'100px',
                render:(text,record,index) => {
                    return <Select style={{ width: '100%' }} value={text} placeholder="请选择" allowClear={true} disabled={false} onChange={(value) => this.onFormChange(index,'4',value)}>
                                {
                                    [].map((items, index) => {
                                        return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                                    })
                                }
                            </Select>
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">风险等级</div>,
                dataIndex: '4',
                align:'center',
                editable: true,
                width:'100px',
                render:(text,record,index) => {
                   return <Select style={{ width: '100%' }} value={text} placeholder="请选择" allowClear={true} disabled={false} onChange={(value) => this.onFormChange(index,'4',value)}>
                                {
                                    [].map((items, index) => {
                                        return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                                    })
                                }
                            </Select>
                }
            },
            {
                title: <div className="ant-form-item-required1">建议值</div>,
                dataIndex: '5',
                align:'center',
                width:'80px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'5',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">备注</div>,
                dataIndex: '7',
                align:'center',
                width:'280px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'7',value)} />
                },
                editable: true,
            }
        ]
    }
    //表格表单写入
    onFormChange = (index,type,value) => {
        const {data} = this.state;
        data[index][type] = value;
        this.setState({data})
    }
    render() {
        this.init()
        return (
            <div>
                <Table
                    className="jxlTable"
                    onRow={this.onRow}
                    bordered
                    rowKey={index => index}
                    // rowSelection={rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.columns}
                    scroll={{y:550}}
                    pagination={false}
                    size={'small'}
                    style={{marginTop:16}}
                />
            </div>
           
        )
    }

}
export default RiskInvestigation;
