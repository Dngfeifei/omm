

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
            data: [], //数据包
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
                width:'80px',
                //每一页都从1开始
                render:(text,record,index)=> `${index+1}`
            },
            {
                title: <div className="ant-form-item-required">服务区域</div>,
                dataIndex: 'area',
                editable: true,
                render:(text,record,index) => {
                   let value = text.split("/"),parentedit = this.props.isEdit ? 0 : 1;;
                   return <Cascader disabled={parentedit ? false : true} options={this.state.computerRegion} value={value} onChange={(value) => this.onAreaChange(index,'area',value)} placeholder="请选择区域" />
                }
            },
            {
                title: <div className="ant-form-item-required">是否是主责区域</div>,
                dataIndex: 'isMainDutyArea',
                // render: t => t == '1' ? '是' : '否',
                render:(text,record,index)=>{
                    let parentedit = this.props.isEdit ? 0 : 1;
                    return (<Radio.Group value={text} onChange={({target:{value}}) => this.onAreaChange(index,'isMainDutyArea',value)}>
                        <Radio value='1' disabled={parentedit ? false : true}>是</Radio>
                        <Radio value='0' disabled={parentedit ? false : true}>否</Radio>
                    </Radio.Group>)
                },
                editable: true,
               
            },{
                title: <div className="ant-form-item-required">客户地址</div>,
                dataIndex: 'address',
                render:(text,record,index) => {
                    let node = this.setJurisdiction(this.props.isEdit,this.props.formRead,this.props.node);
                    return <Input disabled={node} onChange={({target:{value}}) => this.onAreaChange(index,'address',value)} />
                },
                editable: true,
            }
        ]
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
        // console.log('selectedRowKeys changed: ',selectedRowKeys, selectedRows);
        this.setState({ 
            selectedRowKeys:selectedRowKeys,
        });
    }
    // 选中行时就选中单选框按钮
    onRow = (record) => {
        return {
            onClick: () => {
                // let selectedKeys = [record.id];
                let selectedKeys = [record.key];
                this.setState({
                    selectedRowKeys: selectedKeys,
                })
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
                    scroll={this.props.scroll}
                    // rowClassName="editable-row"
                    pagination={false}
                    size={'small'}
                    style={{ marginTop: '16px', overflowY: 'auto' }}
                />
            </div>
           
        )
    }

}
export default Component;
