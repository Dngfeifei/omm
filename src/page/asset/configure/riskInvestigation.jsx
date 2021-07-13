

import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';

const { confirm } = Modal;

import {setComNode} from './assetsList.js'//获取页面渲染配置项
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
        if(setComNode) setComNode('risk',this)
    }

    // 数据更新完成时触发的函数
    componentWillMount() {
        // this.initData(this.props.data)
        console.log('风险排查加载')
    }
    // 初始化
    init = () => {
        // this.columns = 
    }
    //表格表单写入
    onFormChange = (index,type,value) => {
        const {data} = this.state;
        data[index][type] = value;
        this.setState({data})
    }
    render() {
        // this.init()
        return (
            <div>
                <Table
                    className="jxlTable"
                    onRow={this.onRow}
                    bordered
                    rowKey={index => index}
                    // rowSelection={rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.props.panes.riskColumns}
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
