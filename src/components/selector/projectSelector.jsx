import React, { Component } from 'react'
import { Input, Form, Row, Button, message, Card, Table, Select } from 'antd'
const { Option } = Select;



// 引入 分页组件
import Pagination from '/components/pagination'
// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"

class projectSelect extends Component {
    async componentWillMount() {
	
	}
	async componentWillReceiveProps(nextprops) {
		// 判断参数变化
		// 1 参数visible为ture  窗口显示
		if (nextprops.windowData != this.props.windowData && nextprops.windowData.visible) {

		}
    }
    

    constructor(props) {
        super(props)

        this.state = {
            //设置表格的高度
            h: { y: 240 },
            total: 0, // 分页器组件 总条数
            // 此属性是适用于 表格的分页数据
            pageSize: 10,
            current: 0,
            // 此对象只是适用于分页查询
            pagination: {
                limit: 10,
                offset: 1
            },
            loading: false,  //表格加载太
            selectedRowKeys:null,

        }
    }

    // 单选框按钮---选中事件
    onSelectChange=(selectedRowKeys)=>{
        this.setState({
            selectedRowKeys: selectedRowKeys
        });
    }
    // 选中行时就选中单选框按钮
    onClickRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id]
                this.setState({
                    selectedRowKeys: selectedKeys
                });
            },
        };
    }


    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            pagination: data
        }, () => {
            // 获取选择器列表（分页)
            
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: 1, limit: pageSize })

        this.setState({
            current: 0,
            pageSize: pageSize,
            pagination: data
        }, () => {
            // 获取选择器列表（分页)

        })


    }
    
    onSubmit=()=>{
		if(	this.state.selectedRowKeys.length > 0){
			this.props.onOk(selectedRowKeys, result)
		}else{
          message.destroy()
		  message.error("未选择数据")
		}
	}

    render = _ => {
        const { getFieldDecorator } = this.props.form;

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio'
        };

        console.log('---------------------         选择器--页面        -------------------------')
        console.log(this.props)

        let rules = this.props.data.formRules;

        let tabledata = this.props.data.tableData;

        let columns = this.props.data.tableColumns;

        return (
            <div className="projectSelector">
                <ModalParant title={this.props.title} destroyOnClose={true} visible={true} onOk={this.onSubmit} onCancel={this.props.onCancel} width={1000}>
                    <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                        {rules.map((val, index) =>
                            <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </Form.Item>)}
                        <Form.Item>
                            <Button type="primary" style={{ marginLeft: '25px' }}>查询</Button>
                            <Button style={{ marginLeft: '10px' }}>重置</Button>
                        </Form.Item>
                    </Form>
                    <Table
                        className="jxlTable"
                        bordered
                        rowKey={record => record.id} //在Table组件中加入这行代码
                        onRow={this.onClickRow}
                        rowSelection={rowSelection}
                        dataSource={tabledata}
                        columns={columns}
                        pagination={false}
                        scroll={this.state.h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px',height:this.state.h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </ModalParant>
            </div>
        )
    }
}

const projectSelectArea = Form.create()(projectSelect);
export default projectSelectArea;