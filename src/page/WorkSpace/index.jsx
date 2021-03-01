import React, { Component } from 'react'
import { Modal, message, Button, Row, Col, Form, Input, Select, Table, DatePicker, TimePicker,Tooltip } from 'antd'

// 分页组件
import Pagination from "@/components/pagination/index";
// 时间格式化组件
import moment from 'moment'
import { connect } from 'react-redux'

// 引入时间选择器
const { MonthPicker, RangePicker } = DatePicker;

const FormItem = Form.Item
const ButtonGroup = Button.Group
const { Option } = Select;

// 引入 API接口
import {getSysLog, getByCode} from '/api/systemParameter'
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'

import { ADD_PANE,SET_WORKLIST} from '/redux/action'
//引入接口
import { getWorkList } from '/api/workspace'

@connect(state => ({
	resetwork: state.global.resetwork
}), dispath => ({
	add(pane){dispath({ type: ADD_PANE, data: pane })},
	setWorklist(data){dispath({ type: SET_WORKLIST,data})}
}))


class workList extends Component {

    componentWillMount(){
        this.getOperateType()
    }
//本组件监控外部属性变化时调用回调
    componentWillReceiveProps (nextprops) {
        //当工单处理完成提交后刷新原工单列表
        console.log(nextprops)
        if(nextprops.resetwork.switch){
            console.log('该工单列表更新')
            this.init();
            let resetwork = {key:null,switch:false}
            this.props.setWorklist(resetwork)
        }
		
	}
    // 挂载完成
    componentDidMount=()=>{
        this.init();

        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", ()=>{this.SortTable()}, false)
    }


    state = {
        h:{y:240},  //设置表格的高度
        visible: false,  // 对话框的状态
        pageSize:10,
        current:0,
        total:0,  //表格分页---设置显示一共几条数据
        typeArr:[],

        pagination:{
            limit:10,
            offset:1,
        },





        loading:false,  //表格加载太
        rules: [
            {
                label: '工单号',
                key: 'operateType',
                render: _ => <Select style={{ width: 200 }} placeholder="请选择状态" allowClear={true}>
                    {
                        this.state.typeArr.map((items, index) => {
                            return (<Option key={items.itemCode} value={items.itemCode}>{items.itemValue}</Option>)
                        })
                    }
                </Select>
               
            },{
                label: '操作用户',
                key: 'userName',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入操作用户名称"/>
            }, {
                label: '操作时间',
                key: 'dataTime',
                render:_=>  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            },{
                label: '操作资源',
                key: 'resourceName',
                render: _ => <Input style={{ width: 200 }} />
            },
            {
                label: '操作对象',
                key: 'objectName',
                render: _ => <Input style={{ width: 200 }} />
            }
        ],
        columns: [{
                title: '序号',
                dataIndex: 'index',
                align:'center',
                width:'80px',
                // 第一种：每一页都从1开始
                render:(text,record,index)=> `${index+1}`
                // }
            },  
            {
                title: '工单编号',
                dataIndex: 'operateType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '工单类型',
                dataIndex: 'operateTime',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '受理人',
                dataIndex: 'userName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '创建人',
                dataIndex: 'resourceName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '状态',
                dataIndex: 'objectName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '操作详情',
                dataIndex: 'content',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }
        ],
        tabledata: [],
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 125;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 获取 类型
    getOperateType=()=>{
        getByCode({dictCode:'operateType'}).then(res=>{
            if (res.success == 1) {
                this.setState({
                    typeArr: res.data,
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }

    // 初始化接口
    init=()=>{
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const rangeTimeValue = fieldsValue['dataTime'];
            

            if (rangeTimeValue == undefined) {
                var values = {
                    ...fieldsValue,
                    'dataTime': ['',''],
                };
            }else {
                var values = {
                    ...fieldsValue,
                    'dataTime': [
                        rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                        rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
                    ],
                };
            }
            console.log(this.props)
            let newParams = {
                operateType:values.operateType,
                startTime:values.dataTime[0],
                endTime:values.dataTime[1],
                userName:values.userName,
                resourceName:values.resourceName,
                objectName:values.objectName,
                type: this.props.params.type ? this.props.params.type : ''
            }
    
            getSysLog(this.state.pageSize, this.state.current, newParams).then(res => {
                if (res.success == 1) {
                    this.setState({ loading: false })
                    this.setState({
                        tabledata: res.data.records,
                        total: parseInt(res.data.total)
                    })
                } else if (res.success == 0) {
                    message.error(res.message);
                }
            })
           

        });
        
    }



    //获取表单数据
    getFormData = _ => {
        let params;
        this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 获取合并后的表单数据
                params = Object.assign({}, val)
            }
        })
        return params;
    }



    // 根据条件模糊查询
    onSearch=(e)=>{
        e.preventDefault();
        this.setState({ loading: true })
        // 走接口调用
        this.init();
       
    }

    //清空高级搜索
    clearSearchprops =()=> {
        this.props.form.resetFields();
    }

    // 打开--详情---对话框
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    // 关闭--详情---对话框
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };


    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange=(page, pageSize)=>{
        let data = Object.assign({}, this.state.pagination, { offset: page })
        
        this.setState({
            current: (page-1) * pageSize,
            pagination:data
        },()=>{
            // 调用接口
            this.init()
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: 1,limit: pageSize })
        
        this.setState({
            current: 0,
            pageSize: pageSize ,
            pagination:data
        },()=>{
            // 调用接口
            this.init()
        })

       
    }
//单击行打开工单详情页
    onClickRow = (record) => {
            return {
                onClick: () => {
                    let pane = {
                        title: '测试标签',
                        key: '10000',
                        url: 'WorkOrder/index.jsx',
                        params:{
                            pKey:this.props.params.type
                        }
                    }
                    this.props.add(pane)
                },
            };
        
    }

    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys,h } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
       
        return (
            <div style={{ border: '0px solid red',background:' #fff'}} className="main_height" style={{display:'flex',flexDirection:'column',flexWrap:'nowrap'}}>
                <Form layout='inline' style={{ width: '100%', paddingTop: '24px',marginLeft:'15px'}} id="logbookForm">
                    {this.state.rules.map((val, index) =>
                        <FormItem
                            label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {getFieldDecorator(val.key, val.option)(val.render())}
                        </FormItem>)}
                    <FormItem>
                        <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                    </FormItem>
                </Form>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        bordered
                        dataSource={this.state.tabledata}
                        onRow={this.onClickRow}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        rowKey={"id"}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px',height:h,overflowY:'auto'}}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)}  onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>
                

                {/* 详情页--对话框 底部内容，当不需要默认底部按钮时，可以设为 footer={null} */}
                <Modal title="日志详情" visible={this.state.visible} onCancel={this.handleCancel} footer={null}>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }

}
const workSpaceForm = Form.create()(workList)
export default workSpaceForm



