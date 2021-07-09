
/***
 * 配置库配置管理新增硬件设备---部件信息组件
 * 
 * @author  gl
 */
import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';
import {setComNode} from './assetsList.js'//获取页面渲染配置项
const { confirm } = Modal;
// 引入---【部件选择器组件】
import ProductSelector from '/components/selector/productSelector.jsx'


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
            visibleProductModel:false,
        }
        if(setComNode) setComNode(this)
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
    
    //部件选择器更改值并回传
    onAreaChange = (index,key,val) => {
        let {data} = this.state;
        if(data[index]){
            data[index][key] = key == 'area' ? val.join('/'):val.toString();
            this.setState({data});
        }
    }
    // 初始化
    init = () => {
        
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
        console.log(selectedRowKeys,selectedRows)
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
    //部件选择器返回数据保存
    projecthandleOk = (info) => {
        
    }
    //打开部件部件选择器
    openModal = () => {
        this.setState({visibleProductModel:true})
    }
    //关闭部件选择器
    close = () => {
        this.setState({visibleProductModel:false})
    }
    render() {
        // this.init()
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
                    rowKey={(record,index) => index}
                    rowSelection={rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.props.panes.subColumns}
                    scroll={{y:450}}
                    pagination={false}
                    size={'small'}
                    style={{marginTop:16}}
                />
                {/* 产品选择器 */}
                {
                    this.state.visibleProductModel ? <ProductSelector title={'部件选择器'} onCancel={this.close} onOk={this.projecthandleOk}></ProductSelector> : null
                }
            </div>
           
        )
    }

}
export default Component;
