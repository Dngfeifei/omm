import React, { Component } from 'react'
import { Modal, message, Button, Row, Col, Form, Input, Select, Table, DatePicker, TimePicker, } from 'antd'

// 分页组件
import Pagination from "@/components/pagination/index";
// 时间格式化组件
import moment from 'moment'

// 引入时间选择器
const { MonthPicker, RangePicker } = DatePicker;

const FormItem = Form.Item
const ButtonGroup = Button.Group



class logBook extends Component {
    async componentWillMount() {
       console.log("*****************        this.state.tabledata.length       *****************") 
       console.log(this.state.tabledata.length)

    //    this.setState({
    //     total:this.state.tabledata.length
    //    })
    }

    // 挂载完成
    componentDidMount=()=>{
        
    }


    state = {
        visible: false,  // 对话框的状态
        form:{
            pageSize:10,
            current:1
        },
        total:50,  //表格分页---设置显示一共几条数据







        loading:false,  //表格加载太
        rules: [
            {
                label: '操作类型',
                key: 'status',
                render: _ => <Select style={{ width: 200 }} placeholder="请选择状态">
                    <Option value='0' key='0'>启用</Option>
                    <Option value='1' key='1'>禁用</Option>
                </Select>
            },{
                label: '操作用户',
                key: 'realName',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入操作用户名称"/>
            }, {
                label: '操作时间',
                key: 'dataTime',
                render:_=> <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                // render:_=> <div><DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /><span> 至 </span><DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /></div>
            },{
                label: '操作资源',
                key: 'realaa',
                render: _ => <Input style={{ width: 200 }} />
            },
            {
                label: '操作对象',
                key: 'userName',
                render: _ => <Input style={{ width: 200 }} />
            }
        ],
        columns: [{
                title: '序号',
                dataIndex: 'index',
                // 第一种：每一页都从1开始
                // render:(text,record,index)=> `${index+1}`

                // 第二种：分页连续自增序号
                render: (text, record, index) => {   
                    return (
                        `${(this.state.form.current - 1) * (this.state.form.pageSize) + (index + 1)}`  //当前页数减1乘以每一页页数再加当前页序号+1
                    )
                }
            },  
            {
                title: '操作类型',
                dataIndex: 'type'
            }, {
                title: '操作时间',
                dataIndex: 'time'
            }, {
                title: '操作用户',
                dataIndex: 'userName',
            }, {
                title: '操作资源',
                dataIndex: 'resources',
            }, {
                title: '操作对象',
                dataIndex: 'Object',
            }, {
                title: '操作详情',
                dataIndex: 'action',
                render: (text, record) => (
                    record.type=="系统登录"?<a onClick={this.showModal}>{record.userName}登录</a>:record.type=="系统退出"?<a onClick={this.showModal}>{record.userName}退出</a>:record.type=="异常登陆"?<a onClick={this.Object}>{record.userName}{record.resources}</a>:<a onClick={this.showModal}>{record.type}【{record.resources}】：{record.Object}</a>
                    
                ),
            }
        ],
        tabledata: [
            {  
                "type": "系统登录",
                "time":"2020-12-14  16:07:41",
                "userName": "张大",
                "resources": "系统登录",
                "Object": "经理1",
                "action":''
            },{
                "type": "系统退出",
                "time":"2020-12-14  12:07:41",
                "userName": "记下",
                "resources": "系统退出",
                "Object": "客户1",
                "action":''
            },
            {
                "type": "异常登陆",
                "time":"2020-12-14  16:07:43",
                "userName": "李四",
                "resources": "异常登陆",
                "Object": "经理2",
                "action":''
            },
            {
                "type": "修改",
                "time":"2020-12-14  16:07:47",
                "userName": "张五",
                "resources": "工分台账",
                "Object": "201072809765",
                "action":''
                
            },{
                "type": "删除",
                "time":"2020-12-15  16:07:47",
                "userName": "甄大达",
                "resources": "人员管理",
                "Object": "gjs",
                "action":''
                
            }
        ],
    }


    // 初始化接口
    init=()=>{
        
        console.log("-------------  init()  ---------------")
        console.log(this.state.form,this.state.form.pageSize)
    }



    // 根据条件模糊查询
    onSearch=(e)=>{
        e.preventDefault();
        // await this.setState({loading: true})
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
              return;
            }

            const values = {
                ...fieldsValue,
                'dataTime':[
                    moment(dataTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                    moment(dataTime[1]).format('YYYY-MM-DD HH:mm:ss')
                ],
            }

            console.log('Received values of form------------------- ', values);

            let copyObj = Object.assign({}, this.state.form,values)
            console.log(copyObj);

            // 走接口调用

        })
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
        let data = Object.assign({}, this.state.form, { current: page })
        
        this.setState({
            form: data
        },()=>{
            // 调用接口
            this.init()
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.form, { current: 1,pageSize: pageSize })
        
        this.setState({
            form:data
        },()=>{
            // 调用接口
            this.init()
        })

       
    }






    render = _ => {
        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div style={{ border: '0px solid red',background:' #fff'}} className="main_height">
                <Form style={{ width: '100%', paddingTop: '10px' }}>
                    <Row gutter={24}>
                        {this.state.rules.map((val, index) =>
                            <Col key={index} span={8} style={{ display: 'block' }}>
                                <FormItem
                                    label={val.label} labelCol={{ span: 4 }} style={{ marginBottom: '8px' }}>
                                    {getFieldDecorator(val.key, val.option)(val.render())}
                                </FormItem>
                            </Col>)}
                    </Row>
                    <Row style={{ marginLeft: '15px' }}>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.onSearch}>查询</Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                    </Row>
                </Form>
                <Table
                    bordered
                    rowSelection={rowSelection}
                    dataSource={this.state.tabledata}
                    columns={this.state.columns}
                    pagination={false}
                    style={{ marginTop: '16px',padding: '0px 15px',minHeight: '645px',overflowY: 'auto' }}
                    loading={this.state.loading}  //设置loading属性
                />
                
                <Pagination total={this.state.total} pageSize={this.state.form.pageSize} current={this.state.form.current}  onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>

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
const LogBookForm = Form.create()(logBook)
export default LogBookForm