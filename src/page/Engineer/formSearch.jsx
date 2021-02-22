import React, {Component} from 'react'
import { Form, InputNumber , Input, Button, Modal, message, Select, Tooltip, Table , Row, Col,   } from 'antd'

const { Option } = Select;



// 引入页面CSS
import '@/assets/less/pages/logBookTable.css'
// 引入 API接口
import { educationalLevel , } from '/api/engineer'


class formSearch extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // 对话框表格--列数据
            modalTableColumns:[
                {
                    title: '序号',
                    dataIndex: 'index',
                    align:'center',
                    width:'50px',
                    // 第一种：每一页都从1开始
                    render:(text,record,index)=> `${index+1}`
                },{
                    title: '证书厂商',
                    dataIndex: 'certVender',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '全称',
                    dataIndex: 'certName',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '简称',
                    dataIndex: 'certNick',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '级别',
                    dataIndex: 'certLevel',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '编号',
                    dataIndex: 'certCode',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '获得日期',
                    dataIndex: 'getDate',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '到期日期',
                    dataIndex: 'overDate',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '证书类型',
                    dataIndex: 'certType',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '原件是否在公司',
                    dataIndex: 'hasOriginal',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text == '1' ? '是' : '否'}</Tooltip>
                },{
                    title: '备注',
                    dataIndex: 'remark',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }
            ],
            // 对话框---基本信息Form数据
            modalFromRules: [{
                label: '公司',
                key: 'company',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入公司" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '姓名',
                key: 'name',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入姓名" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '员工编号',
                key: 'userNum',
                option: {
                    rules: [
                        {
                            message: "请输入数字",
                            pattern: /^[0-9]{0,}$/,
                            trigger: "blur",
                        }
                    ]
                },
                render: _ => <Input style={{ width: 240 }} placeholder="请输入员工编号" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '所属部门',
                key: 'deptName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入所属部门" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '上级部门',
                key: 'parentOrgName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入上级部门" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '职位名称',
                key: 'positionName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入职位名称" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '性别',
                key: 'gender',
                render: _ => <Select style={{ width: 240 }} placeholder="请输入性别" allowClear={true} disabled={this.props.visibleStatus == 'previewing' ? true : false}>
                    <Option value={1}>男</Option>
                    <Option value={0}>女</Option>
                </Select>
            }, {
                label: '年龄',
                key: 'age',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入年龄" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '文化程度',
                key: 'educational',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入文化程度" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '是否全日制',
                key: 'fulltime',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入是否全日制" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '员工状态',
                key: 'mpstatus',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入员工状态" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '参加工作时间',
                key: 'startDate',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入参加工作时间" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '入我司时间',
                key: 'entryDate',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入入我司时间" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '工作年限',
                key: 'bussiYear',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入工作年限" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '本公司工作年限',
                key: 'compYear',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入本公司工作年限" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '工作省份',
                key: 'province',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入工作省份" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '地市',
                key: 'city',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入地市" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '电子邮箱',
                key: 'email',
                option: {
                    rules: [
                        // { required: true, message: "请输入邮箱" },
                        {
                            message: "请按照正确的邮箱格式输入",
                            pattern: "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$",
                            trigger: "blur",
                        }]
                },
                render: _ => <Input style={{ width: 240 }} placeholder="请输入电子邮箱" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '手机号',
                key: 'mobile',
                option: {
                    rules: [
                        {
                            message: "请输入正确的手机号码",
                            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                            trigger: "blur",
                        }]
                },
                render: _ => <Input style={{ width: 240 }} placeholder="请输入手机号" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '职级',
                key: 'jobGrade',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入职级" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '人员类型',
                key: 'jobType',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入人员类型" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }, {
                label: '劳务关系所属公司',
                key: 'contactComp',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入劳务关系所属公司" disabled={this.props.visibleStatus == 'previewing' ? true : false} />
            }],
            titleMap: {
                add: '新增公告信息',
                edit: '修改公告信息',
                previewing: '查看信息'
            },
           
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(props,nextProps)
        if (this.props.modalFormArray != nextProps.modalFormArray) {
            this.setBaseInfo(nextProps.modalFormArray)
        }
       
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
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        

        return (
            <Modal title={this.state.titleMap[this.props.visibleStatus]} visible={this.props.visible} onCancel={this.props.handleCancel} onOk={this.props.handleOk} width='65%' id="modalengineer">
                   
                <div className="tableCertificate">
                    <div className='title'>工程师基础信息</div>
                    <div className="modalFrom" id="modalFrom" style={{height:'405px',padding:'15px 15px 15px 25px'}}>
                        <Form className="ant-advanced-search-form" id="ant-advanced-search-form" {...formItemLayout}>
                            <Row gutter={24}>{this.getFields()}</Row>
                        </Form>
                    </div>
                    <div className='title'>证书信息</div>
                    <Table
                    className="jxlTable"
                    bordered
                    rowKey={record=>record.id} 
                    dataSource={this.props.modalTable}
                    columns={this.state.modalTableColumns}
                    pagination={false}
                    size={'small'}
                    style={{ marginTop: '16px', padding: '0px 15px', height: 'calc(100vh - 770px)', overflowY: 'auto' }}
                />
                </div>
            </Modal>
        )
    }



}


const FormSearch = Form.create()(formSearch)
export default FormSearch