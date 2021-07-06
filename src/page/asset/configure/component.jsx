

import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';

const { confirm } = Modal;


// 引入 API接口
import { } from '/api/systemParameter'

// 正式服务区域---渲染
class Component extends React.Component {
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
        console.log('部件信息加载')
    }

    // 新增table表格一行
    handleAdd = () => {
            const { count, data } = this.state;
            const newData = {
                area: "",
                isMainDutyArea: "",
                address: '',
                serviceAreaNew:[]
            };

            const newSelectKey = []
            newSelectKey.push(newData.key)
            this.setState({
                data: [...data, newData],
                selectedRowKeys:newSelectKey,   // 将当前新增的行进行选中
            });
        

    };
    
    //区域更改值并回传
    onAreaChange = (index,key,val) => {
        let {data} = this.state;
        if(data[index]){
            data[index][key] = key == 'area' ? val.join('/'):val.toString();
            this.setState({data});
        }
    }
    // 初始化
    init = () => {
        this.columns = [
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
                title: <div className="ant-form-item-required1">fc</div>,
                dataIndex: '1',
                align:'center',
                width:'100px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'1',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件号</div>,
                dataIndex: '2',
                width:'100px',
                align:'center',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'2',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件位置</div>,
                dataIndex: '3',
                align:'center',
                width:'100px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'3',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">部件类别</div>,
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
                title: <div className="ant-form-item-required1">数量</div>,
                dataIndex: '5',
                align:'center',
                width:'80px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) => this.onFormChange(index,'5',value)} />
                },
                editable: true,
            },
            {
                title: <div className="ant-form-item-required1">描述</div>,
                dataIndex: '6',
                align:'center',
                width:'200px',
                render:(text,record,index) => {
                    return <Input disabled={false} value={text} onChange={({target:{value}}) =>this.onFormChange(index,'6',value)} />
                },
                editable: true,
            },{
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
    // 删除--系统参数（单个删除）
    handlerDelete=()=>{
        var _this = this
        if (this.state.selectedRowKeys) {
            confirm({
                title: '删除',
                content: '您确定删除此数据吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    var ID = _this.state.selectedRowKeys[0]
                    const dataSource = [..._this.state.data];
                    _this.setState({ data: dataSource.filter(item => item.key !== ID),selectedRowKeys:null });
                },
                onCancel() {
                    message.info('取消删除！');
                },
            });
        } else {
            message.warning('请先选择一条数据进行删除！')
        }
    }

    // 单选框按钮---选中事件
    selectChangeArea = (selectedRowKeys, selectedRows) => {
        this.setState({ 
            selectedRowKeys:selectedRowKeys,
        });
    }
    // 选中行时就选中单选框按钮
    onRow = (record,index) => {
        return {
            onClick: () => {
                console.log(record,index)
                let selectedKeys = [index];
                this.selectChangeArea(selectedKeys,record);
            }
        }
    }
    render() {
        this.init()
        const rowSelectionArea = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.selectChangeArea,
            type:'radio'
        };
        return (
            <div>
                <Row gutter={24} style={{textAlign:'right',visibility:'visible'}}>
                    <Button style={{marginRight: '10px'}} onClick={this.handlerDelete} >删除</Button>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={this.handleAdd}>新增</Button>
                </Row>
                <Table
                    className="jxlTable"
                    onRow={this.onRow}
                    bordered
                    rowKey={index => index}
                    rowSelection={rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.columns}
                    scroll={{y:450}}
                    pagination={false}
                    size={'small'}
                    style={{marginTop:16}}
                />
            </div>
           
        )
    }

}
export default Component;
