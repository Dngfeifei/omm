/**
 * 信息管理---项目信息管理
 * @author jxl
 */

import React, { Component } from 'react'
import { Form, InputNumber, Input, Button, PageHeader, message, Select, Tooltip, Table, Row, Col, } from 'antd'
import { connect } from 'react-redux'
import { REMOVE_PANE } from '/redux/action'
const { Option } = Select;

// 引入页面CSS
import '@/assets/less/pages/custormerInfo.less'
// 引入 API接口
import { BiProjectInfo , ProjectArea , ProjectMember , Contact , ServiceObject} from '/api/ProjectInfor'

@connect(state => ({
	panes: state.global.panes,
	activeKey: state.global.activeKey,
}), dispath => ({
	remove(key){dispath({type: REMOVE_PANE, key})},
}))

class projectInfor extends Component　{
    constructor(props) {
        super(props)

        this.state = {
            //设置表格的高度
            h: { y: 240 },
            // 项目号ID
            projectID: null,  
            // 基本信息Form数据
            modalFromRules:[{
                label: '公司名称',
                key: 'compayName',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入公司名称" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目号',
                key: 'projectNumber',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目号" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目名称',
                key: 'projectName',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目名称" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目类别',
                key: 'projectType',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目类别" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目状态',
                key: 'projectStatus',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目状态" disabled={this.state.projectID ? true : false} />
            },{
                label: '服务类别',
                key: 'serviceType',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入服务类别" disabled={this.state.projectID ? true : false} />
            },{
                label: '所属行业',
                key: 'industry',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入所属行业" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目开始日期',
                key: 'startDate',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目开始日期" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目结束日期',
                key: 'endDate',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目结束日期" disabled={this.state.projectID ? true : false} />
            },{
                label: '是否有项目经理负责',
                key: 'hasManager',
                render: _ => <Select style={{ width: 260 }} placeholder="请选择是否有项目经理负责" allowClear={true} disabled={this.state.projectID ? true : false}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            },{
                label: '项目经理',
                key: 'manager',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目经理" disabled={this.state.projectID ? true : false} />
            },{
                label: '客户名称',
                key: 'custName',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入客户名称" disabled={this.state.projectID ? true : false} />
            },{
                label: '项目销售',
                key: 'salesman',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入项目销售" disabled={this.state.projectID ? true : false} />
            },{
                label: '销售联系方式',
                key: 'salesmanPhone',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入销售联系方式" disabled={this.state.projectID ? true : false} />
            },{
                label: '是否续签项目',
                key: 'projectName',
                render: _ =><Select style={{ width: 260 }} placeholder="请选择是否续签项目" allowClear={true} disabled={this.state.projectID ? true : false}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            },{
                label: '续签项目号',
                key: 'renewalNumber',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入续签项目号" disabled={this.state.projectID ? true : false} />
            },{
                label: '续签项目名称',
                key: 'renewalName',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入续签项目名称" disabled={this.state.projectID ? true : false} />
            },{
                label: '是否转包项目',
                key: 'isSubcontract',
                render: _ => <Select style={{ width: 260 }} placeholder="请选择是否转包项目" allowClear={true} disabled={this.state.projectID ? true : false}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            },{
                label: '最终客户名称',
                key: 'finalCustName',
                render: _ => <Input style={{ width: 260 }} placeholder="请输入最终客户名称" disabled={this.state.projectID ? true : false} />
            }],
            // 底部tab标签title
            TitleLists: [{ name: '项目组成员' }, { name: '服务区域' }, { name: '客户联系人' },{name:'服务承诺'}, { name: '服务对象' }],
            // state中的activeType值来实现样式切换的效果
            activeType: 0,

            // 项目组成员---table表格数据集合
            ProjectTeamMembersTable: [],
            // 项目组成员---table表格--列数据集合
            ProjectTeamMembersColumns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '服务区域',
                dataIndex: 'area',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '项目角色',
                dataIndex: 'type',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '姓名',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '联系电话',
                dataIndex: 'mobile',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 服务区域---table表格数据集合
            ServiceAreaTable: [],
            // 服务区域---table表格--列数据集合
            ServiceAreaColumns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '服务区域',
                dataIndex: 'area',
                ellipsis: {
                    showTitle: false,
                },
                width:'12%',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '客户地址',
                dataIndex: 'address',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 客户联系人---table表格数据集合
            ClientContactTable: [],
            // 客户联系人---table表格--列数据集合
            ClientContactColumns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '服务区域',
                dataIndex: 'area',
                ellipsis: {
                    showTitle: false,
                },
                width:'12%',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '联系人类型',
                dataIndex: 'type',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '姓名',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '联系电话',
                dataIndex: 'mobile',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '邮箱',
                dataIndex: 'email',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 服务对象---table表格数据集合
            TargetGroupTable: [],
            // 服务对象---table表格--列数据集合 
            TargetGroupColumns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '服务区域',
                dataIndex: 'area',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '产品类型',
                dataIndex: 'productType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '产品线',
                dataIndex: 'productLine',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '设备等级',
                dataIndex: 'deviceLevel',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '设备数量',
                dataIndex: 'deviceCount',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '外包数量',
                dataIndex: 'outsourceCount',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],

        }
    }

    componentWillMount(){
        let projectID = this.props.params.dataType.id;
        this.setState({
            projectID: projectID
        })
    }

    componentDidMount() {
        this.init();
    }


    init = () => {

        if (this.state.projectID) {
            // 调用---项目基本信息接口
            this.getProject(this.state.projectID);
            // 调用---服务区域接口
            this.getArea(this.state.projectID);
            // 调用---项目组成员接口
            this.getMembers(this.state.projectID);
            // 调用---服务对象列表
            this.getService(this.state.projectID);
            // 调用---客户技术联系人列表
            this.getProjectContact(this.state.projectID);
        }
    }

    // 项目基本信息接口
    getProject = (id) => {
        // 基本信息--接口
        BiProjectInfo(id).then(res => {
            if (res.success == 1) {
                this.setState({
                    modalFormArray: res.data
                })
                // 基本信息form表单赋值
                this.setBaseInfo(this.state.modalFormArray);
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }

    // 服务区域接口
    getArea=(id)=>{
        ProjectArea(id).then(res=>{
            if (res.success == 1) {
                this.setState({
                    ServiceAreaTable: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }
    
    // 项目组成员接口
    getMembers=(id)=>{
        ProjectMember(id).then(res=>{
            if (res.success == 1) {
                this.setState({
                    ProjectTeamMembersTable: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }

    // 服务对象列表
    getService = (id) => {
        ServiceObject(id).then(res => {
            if (res.success == 1) {
                this.setState({
                    TargetGroupTable: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }
    // 客户技术联系人列表
    getProjectContact = (id) => {
        Contact(id).then(res => {
            if (res.success == 1) {
                this.setState({
                    ClientContactTable: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }


    // 头部-返回上一页【回到：客户信息列表页面】
    remove = () => {
		this.props.remove(this.props.activeKey)
    }
    //  底部tab标签title切换
    handleSiblingsClick = (index) => {
        this.setState({
            activeType: index
        })
    }
    //通过form.setFieldsValue将数据绑定到各个Form表单控件上，这里定义了返显的方法。
    setBaseInfo = (data) => {
        const { form } = this.props;
        Object.keys(form.getFieldsValue()).forEach(key => {
            const obj = {};
            if (data[key]) {
                obj[key] = data[key] || null;
            }
            form.setFieldsValue(obj);
        });
    };
    // 对话框--基本工程师信息Form布局
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < this.state.modalFromRules.length; i++) {
            children.push(
                <Col span={8} key={i} >
                    <Form.Item label={this.state.modalFromRules[i].label} style={{ marginBottom: '8px' }} key={i}>
                        {getFieldDecorator(this.state.modalFromRules[i].key, this.state.modalFromRules[i].option)(this.state.modalFromRules[i].render())}
                    </Form.Item>
                </Col>,
            );
        }
        return children;
    }


    render = _ => {

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 15 },
        };

        const { getFieldDecorator } = this.props.form;

        const { h , } = this.state;


        return (
            <div className="CustomerInforContent" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <div className="top">
                    {/* <PageHeader onBack={this.remove} title="项目档案" style={{ background: '#fff' }} /> */}
                    <div className='title activedTitle actived'>基础信息</div>
                    <div className="modalFrom" id="modalFrom" style={{ height: '345px', padding: '15px 15px 15px 25px' }}>
                        <Form className="ant-advanced-search-form" id="ant-advanced-search-form" {...formItemLayout}>
                            <Row gutter={24}>{this.getFields()}</Row>
                        </Form>
                    </div>

                    <div className="list-item">
                        {
                            this.state.TitleLists.map((item, i) => {
                                return (
                                    <div className={this.state.activeType == i ? 'title actived activedTitle' : 'title'} onClick={this.handleSiblingsClick.bind(this, i)} data-index={i} key={i}>{item.name}</div>
                                );
                            })
                        }
                    </div>
                </div>
                
                <div className="tableCertificates">
                    {/* 切换内容区域 */}
                    <div className="Switching" style={{ flex: 'auto' }}>
                        {/* 项目组成员--区域 */}
                        <div className="ProjectTeamMembers" style={{ display: this.state.activeType == 0 ? 'block' : 'none' }}>
                            <Table
                                className="jxlTable"
                                rowKey={"id"}
                                bordered
                                dataSource={this.state.ProjectTeamMembersTable}
                                columns={this.state.ProjectTeamMembersColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>
                        {/* 服务区域--区域  */}
                        <div className="ServiceArea" style={{ display: this.state.activeType == 1 ? 'block' : 'none' }}>
                        <Table
                                className="jxlTable"
                                rowKey={"id1"}
                                bordered
                                dataSource={this.state.ServiceAreaTable}
                                columns={this.state.ServiceAreaColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />

                        </div>

                        {/* 客户联系人--区域  */}
                        <div className="ClientContact" style={{ display: this.state.activeType == 2 ? 'block' : 'none' }}>
                        <Table
                                className="jxlTable"
                                rowKey={"id2"}
                                bordered
                                dataSource={this.state.ClientContactTable}
                                columns={this.state.ClientContactColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />

                        </div>

                         {/* 服务承诺--区域  */}
                        <div className="ProjectPledge"  style={{ display: this.state.activeType == 3 ? 'block' : 'none' }}>

                        </div>
                        {/* 服务对象--区域  */}
                        <div className="TargetGroup" style={{ display: this.state.activeType == 4 ? 'block' : 'none' }}>
                        <Table
                                className="jxlTable"
                                rowKey={"id3"}
                                bordered
                                dataSource={this.state.TargetGroupTable}
                                columns={this.state.TargetGroupColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
        
const ProjectInforMation = Form.create()(projectInfor)
export default ProjectInforMation