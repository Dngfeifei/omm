import React, { Component } from 'react'
import { Form, InputNumber, Input, Button, PageHeader, message, Select, Tooltip, Table, Row, Col, } from 'antd'
import { connect } from 'react-redux'
import { REMOVE_PANE } from '/redux/action'
const { Option } = Select;

// 引入页面CSS
import '@/assets/less/pages/custormerInfo.less'
// 引入 API接口
import { educationalLevel, biUserInfo , getCertificate , getSelectByUserId} from '/api/engineer'


@connect(state => ({
	panes: state.global.panes,
	activeKey: state.global.activeKey,
}), dispath => ({
	remove(key){dispath({type: REMOVE_PANE, key})},
}))

class formSearch extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //设置表格的高度
            h: { y: 240 },
            engineerId: null,  // 工程师ID
            // 证书信息表格--列数据
            CertificateInforColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: '50px',
                    // 第一种：每一页都从1开始
                    render: (text, record, index) => `${index + 1}`
                }, {
                    title: '证书厂商',
                    dataIndex: 'certVender',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '全称',
                    dataIndex: 'certName',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '简称',
                    dataIndex: 'certNick',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '级别',
                    dataIndex: 'certLevel',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '编号',
                    dataIndex: 'certCode',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '获得日期',
                    dataIndex: 'getDate',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '到期日期',
                    dataIndex: 'overDate',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '证书类型',
                    dataIndex: 'certType',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }, {
                    title: '原件是否在公司',
                    dataIndex: 'hasOriginal',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text == '1' ? '是' : '否'}</Tooltip>
                }, {
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
                render: _ => <Input style={{ width: 240 }} placeholder="请输入公司" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '姓名',
                key: 'name',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入姓名" disabled={this.state.engineerId ? true : false} />
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
                render: _ => <Input style={{ width: 240 }} placeholder="请输入员工编号" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '所属部门',
                key: 'deptName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入所属部门" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '上级部门',
                key: 'parentOrgName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入上级部门" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '职位名称',
                key: 'positionName',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入职位名称" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '性别',
                key: 'gender',
                render: _ => <Select style={{ width: 240 }} placeholder="请输入性别" allowClear={true} disabled={this.state.engineerId ? true : false}>
                    <Option value={1}>男</Option>
                    <Option value={0}>女</Option>
                </Select>
            }, {
                label: '年龄',
                key: 'age',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入年龄" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '文化程度',
                key: 'educational',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入文化程度" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '是否全日制',
                key: 'fulltime',
                render: _ => <Select style={{ width: 240 }} placeholder="请选择是否全日制" allowClear={true} disabled={this.state.engineerId ? true : false}>
                    <Option value='1'>是</Option>
                    <Option value='0'>否</Option>
                </Select>
            }, {
                label: '员工状态',
                key: 'mpstatus',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入员工状态" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '参加工作时间',
                key: 'startDate',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入参加工作时间" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '入我司时间',
                key: 'entryDate',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入入我司时间" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '工作年限',
                key: 'bussiYear',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入工作年限" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '本公司工作年限',
                key: 'compYear',
                render: _ => <InputNumber min={1} max={100} style={{ width: 240 }} placeholder="请输入本公司工作年限" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '工作省份',
                key: 'province',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入工作省份" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '地市',
                key: 'city',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入地市" disabled={this.state.engineerId ? true : false} />
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
                render: _ => <Input style={{ width: 240 }} placeholder="请输入电子邮箱" disabled={this.state.engineerId ? true : false} />
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
                render: _ => <Input style={{ width: 240 }} placeholder="请输入手机号" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '职级',
                key: 'jobGrade',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入职级" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '人员类型',
                key: 'jobType',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入人员类型" disabled={this.state.engineerId ? true : false} />
            }, {
                label: '劳务关系所属公司',
                key: 'contactComp',
                render: _ => <Input style={{ width: 240 }} placeholder="请输入劳务关系所属公司" disabled={this.state.engineerId ? true : false} />
            }],

            modalFormArray: null,
            // 证书信息-table表格数据集合
            CertificateInforTable: [],
            // 底部tab标签title
            TitleLists: [{ name: '证书信息' }, { name: '专业能力' }, { name: '工作经验及软技能' }],
            // state中的activeType值来实现样式切换的效果
            activeType: 0,
            // 专业能力---table表格数据集合
            ProfessionalCompetTable:[],
            // 专业能力----列数据集合
            ProfessionalCompetColumns:[{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '技术类别',
                dataIndex: 'skillTypeName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '品牌',
                dataIndex: 'brandName',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '具备维护能力的产品线',
                dataIndex: 'productLines',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '产品线级别',
                dataIndex: 'productLineLevel',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '专业能力级别',
                dataIndex: 'level',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 工作经验及软技能
            WorkExperience:{},
            // 详情页面接口中的userId
            userId:"",

        }
    }

    componentWillMount(){
        var engineerID = this.props.params.dataType.id;
        
        this.setState({
            engineerId: engineerID,
            userId:this.props.params.dataType.userId
        })
    }
    
    componentDidMount() {
        

        this.getInit();

        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", ()=>{this.SortTable()}, false)


        
    }

    getInit=()=>{

        if (this.state.engineerId) {
            // 调用---工程师信息接口
            this.getBiUserInfo(this.state.engineerId);

            
        }
    }

    // 获取表格高度
    SortTable=()=> {
        setTimeout(() => {
            let h = this.tableDom.clientHeight;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 获取 工程师信息详情 接口
    getBiUserInfo = (id) => {
        // 基本信息--接口
        biUserInfo(id).then(res => {
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

        // 证书信息--接口
        getCertificate(id).then(res => {
            if (res.success == 1) {
                this.setState({
                    CertificateInforTable: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })

        // 专业能力、工作经验及软技能
        getSelectByUserId({userId:this.state.userId}).then(res => {
            if (res.success == 1) {
                this.setState({
                    // 专业技能
                    ProfessionalCompetTable: res.data.assessProableList,
                    // 工作经验及软技能
                    WorkExperience:res.data
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
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        const { h , } = this.state;
        

        return (
            <div className="CustomerInforContent" style={{display:'flex',flexDirection:'column',flexWrap:'nowrap'}}>
                <div className="top">
                    {/* <PageHeader onBack={this.remove} title="工程师档案" style={{ background: '#fff' }} /> */}
                    <div className='title activedTitle actived'>工程师基础信息</div>
                    <div className="modalFrom" id="modalFrom" style={{ height: '405px', padding: '15px 15px 15px 25px' }}>
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
                   
                    <div className="Switching" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                        {/* 证书信息/专业能力---区域 */}
                        <div className="commonTable" style={{display:this.state.activeType==0?'block':this.state.activeType==1?'block':'none'}}>
                            <Table
                                className="jxlTable"
                                bordered
                                rowKey={record => record.id}
                                dataSource={this.state.activeType == 0 ? this.state.CertificateInforTable : this.state.activeType == 1 ? this.state.ProfessionalCompetTable : null}
                                columns={this.state.activeType == 0 ? this.state.CertificateInforColumns : this.state.activeType == 1 ? this.state.ProfessionalCompetColumns : null}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>
                        {/* 工作经验及专业技能---区域 */}
                        <div className="jin" style={{ display: this.state.activeType == 2 ? 'block' : 'none' }}>
                            <div className="worksheet">
                                <div className="row">
                                    <div className="column">
                                        <div className="key">沟通能力</div>
                                        <div className="val">{this.state.WorkExperience.commskills}</div>
                                    </div>
                                    <div className="column">
                                        <div className="key">经验</div>
                                        <div className="val">{this.state.WorkExperience.experience}</div>
                                    </div>
                                    <div className="column">
                                        <div className="key">文档编辑能力</div>
                                        <div className="val" style={{ padding: "0 10px" }}>{this.state.WorkExperience.docskills}</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <div className="key">资质证书</div>
                                        <div className="val">
                                            <div className="row">
                                                <div className="val1">高级</div>
                                                <div className="val1">中级</div>
                                                <div className="val1">初级</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <div className="key">数量</div>
                                        <div className="val">
                                            <div className="row">
                                                <Tooltip placement="top" title="证书">
                                                    <div className="val1">{this.state.WorkExperience.highCert}</div>
                                                </Tooltip>
                                                <Tooltip placement="top" title="证书">
                                                    <div className="val1">{this.state.WorkExperience.middleCert}</div>
                                                </Tooltip>
                                                <Tooltip placement="top" title="证书">
                                                    <div className="val1">{this.state.WorkExperience.elementaryCert}</div>
                                                </Tooltip>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }



}


const FormSearch = Form.create()(formSearch)
export default FormSearch