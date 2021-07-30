/**
 * 信息管理---项目信息
 * @author jxl
*/


import React, { Component } from 'react'
import { Modal, message, Button, Row, Col, Form, Input, Select, Table, Tooltip, Checkbox, Upload } from 'antd'
import { connect } from 'react-redux'
import { ADD_PANE } from '/redux/action'


// 分页组件
import Pagination from "@/components/pagination/index";
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'
// 引入页面CSSwxy
import '/assets/less/pages/excelObtn.less'
// 引入 API接口
import { BiProjectList, companyList } from '/api/ProjectInfor'
import { customerLevel } from '/api/customerInfor'
//引入数据导出接口 （wxy）
import { GetexportView, Postexport, Postimport } from '/api/excelObtn'
import moment from "moment";//wxy
const { confirm } = Modal;//wxy
const FormItem = Form.Item
const ButtonGroup = Button.Group
const { Option } = Select;
let token = localStorage.getItem('token'); //wxy
@connect(state => ({
    panes: state.global.panes,
}), dispath => ({
    add(pane) { dispath({ type: ADD_PANE, data: pane }) },
}))

class projectMation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 导出按钮开关
            visible: false,
            // 复选框选中与不选中能否为空
            canNull: "",
            Echeckbox: [],
            chebox: [],
            DCtabledata: [
                // {
                //     "comment": "父机构ID",
                //     // "fieldType": "bigint(20)",
                //     "tableField": "org_parent_id"
                // }, {

                //     // "comment": "组织机构编号",
                //     // "fieldType": "varchar(50)",
                //     "tableField": "org_num"

                // }, {
                //     "comment": "组织机构编号",
                //     "fieldType": "varchar(50)",
                //     "tableField": "org_num"

                // }
            ],//导出表格数据
            uploadConf: {//上传配置 导入
                name: 'file',
                action: '/biProject/import',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                showUploadList: false,
                onChange(info) {
                    if (info.file.status !== 'uploading') {
                    }
                    if (info.file.status === 'done') {
                        message.success(`${info.file.name} 文件上传成功`);
                    } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} 文件上传失败.`);
                    }
                },
            },
            DCcolums: [{     //导出表的所有字段
                title: '字段名称',
                dataIndex: 'tableField',
                align: 'center',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block', textAlign: 'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }, {

                title: '字段类型',
                dataIndex: 'fieldType',
                align: 'center',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block', textAlign: 'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }, {

                title: '能否为空',
                dataIndex: 'canNull',
                align: 'center',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block', textAlign: 'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }, {

                title: '中文名称',
                dataIndex: 'comment',
                align: 'center',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block', textAlign: 'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }],

            //设置表格的高度
            h: { y: 240, x: 1300 },
            pageSize: 10,
            current: 0,
            total: 0,  //表格分页---设置显示一共几条数据
            typeArr: [],

            pagination: {
                limit: 10,
                offset: 1,
            },
            // 表格数据
            tabledata: [],
            // 表格数据
            columns: [{
                title: '项目号',
                dataIndex: 'projectNumber',
                align: 'center',
                width: 120,
                fixed: 'left',
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block', textAlign: 'center' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }, {
                title: '项目名称',
                dataIndex: 'projectName',
                fixed: 'left',
                width: 160,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 150,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '客户名称',
                dataIndex: 'custName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '公司名称',
                dataIndex: 'compayName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '项目类别',
                dataIndex: 'projectType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '项目状态',
                dataIndex: 'projectStatus',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '服务类别',
                dataIndex: 'serviceType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '所属行业',
                dataIndex: 'industry',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '项目开始日期',
                dataIndex: 'startDate',
                ellipsis: {
                    showTitle: false,
                },
                align: 'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '项目结束日期',
                dataIndex: 'endDate',
                ellipsis: {
                    showTitle: false,
                },
                align: 'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '是否有项目经理负责',
                dataIndex: 'hasManager',
                ellipsis: {
                    showTitle: false,
                },
                render: t => t == '1' ? '是' : '否',
            }, {
                title: '项目经理',
                dataIndex: 'manager',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '项目销售',
                dataIndex: 'salesman',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '销售联系方式',
                dataIndex: 'salesmanPhone',
                ellipsis: {
                    showTitle: false,
                },
                align: 'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '是否续签项目',
                dataIndex: 'isRenewal',
                ellipsis: {
                    showTitle: false,
                },
                render: t => t == '1' ? '是' : '否',
            }, {
                title: '续签项目号',
                dataIndex: 'renewalNumber',
                ellipsis: {
                    showTitle: false,
                },
                align: 'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '续签项目名称',
                dataIndex: 'renewalName',
                ellipsis: {
                    showTitle: false,
                },

                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '是否转包项目',
                dataIndex: 'isSubcontract',
                ellipsis: {
                    showTitle: false,
                },
                render: (t, r) => {
                    if (t == 1) {
                        return "是"
                    } else if (t == 0) {
                        return "否"
                    }
                }
            }, {
                title: '最终客户名称',
                dataIndex: 'finalCustName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            loading: false,  //表格加载太
            rules: [
                {
                    label: '项目号',
                    key: 'projectNumber',
                    render: _ => <Input style={{ width: 200 }} placeholder="请输入操作用户名称" />
                }, {
                    label: '项目名称',
                    key: 'projectName',
                    render: _ => <Input style={{ width: 200 }} placeholder="请输入操作用户名称" />
                }, {
                    label: '客户名称',
                    key: 'custName',
                    render: _ => <Input style={{ width: 200 }} />
                }, {
                    label: '公司名称',
                    key: 'compayName',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择公司名称" allowClear={true}>
                        {
                            this.state.companyNameList.map((items, index) => {
                                return (<Option key={items.id} value={items.id}>{items.name}</Option>)
                            })
                        }
                    </Select>

                }, {
                    label: '项目类别',
                    key: 'projectType',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择项目类别" allowClear={true}>
                        {
                            this.state.projectTypeList.map((items, index) => {
                                return (<Option key={items.itemCode} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>

                }, {
                    label: '项目状态',
                    key: 'serviceType',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择项目状态" allowClear={true}>
                        {
                            this.state.projectStatusList.map((items, index) => {
                                return (<Option key={items.itemCode} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>

                }, {
                    label: '服务类别',
                    key: 'projectStatus',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择服务类别" allowClear={true}>
                        {
                            this.state.servicesTypeList.map((items, index) => {
                                return (<Option key={items.itemCode} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>

                }
            ],
            // 公司名称---数据集合
            companyNameList: [],
            // 项目类别---数据集合
            projectTypeList: [],
            // 项目状态---数据集合
            projectStatusList: [],
            // 服务类别--数据集合
            servicesTypeList: [],


        }
    }

    // 挂载完成
    componentDidMount = () => {

        this.init();


    }

    // 初始化接口
    init = () => {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)
        // 获取数据字典各项--数据
        this.getCustLevel();
        // 获取项目列表数据
        this.getProjectList();

    }

    // 获取数据字典各项数据  
    getCustLevel = () => {
        // 项目类别--数据
        customerLevel({ dictCode: 'projectType' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    projectTypeList: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 服务类别
        customerLevel({ dictCode: 'serviceType' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    servicesTypeList: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 项目状态
        customerLevel({ dictCode: 'projectStatus' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    projectStatusList: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 公司列表
        companyList().then(res => {
            if (res.success == 1) {
                this.setState({
                    companyNameList: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
    }

    // 获取项目列表数据
    getProjectList = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.setState({ loading: true })
            var values = {
                ...fieldsValue,
            };


            BiProjectList(this.state.pageSize, this.state.current, values).then(res => {
                if (res.success == 1) {
                    this.setState({
                        loading: false,
                        tabledata: res.data.records,
                        total: parseInt(res.data.total)
                    })
                } else if (res.success == 0) {
                    message.error(res.message);
                }
            })
        })
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 125;

            let x = this.tableDom.clientWidth + 1000;
            this.setState({
                h: {
                    y: (h),
                    x: (x)
                }
            });
        }, 0)
    }


    // 根据条件模糊查询
    onSearch = (e) => {
        e.preventDefault();
        this.setState({ loading: true })
        // 走接口调用
        this.getProjectList();

    }

    //清空高级搜索
    clearSearchprops = () => {
        this.props.form.resetFields();
    }

    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            pagination: data
        }, () => {
            // 调用接口
            this.getProjectList()
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
            // 调用接口
            this.getProjectList()
        })

    }

    // 点击table表格---【项目号】跳转到【项目档案】页面
    previewing = (record) => {
        let pane = {
            title: record.projectName + '档案',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'ProjectManage/ProjectInformation.jsx',
            params: {
                id: record.id
            }
        }
        this.props.add(pane)
    }


    // 显示对话框
    onClickShowModul = () => {

        // 测试--打开另一个标签页面
        let pane = {
            title: '服务需求表',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'ServiceRequire/ServiceRequire.jsx'
        }
        this.props.add(pane)
    }
    //弹出框wxy
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    //弹出框wxy
    handleCancel = (e) => {

        this.setState({
            visible: false,
        });
    };
    //数据导入wxy

    //数据导出wxy
    dataExport = () => {
        let { visible } = this.state
        GetexportView().then((res) => {
            if (res.success != 1) {
                message.error("请求错误");
                return;
            } else {
                let Echeckbox = []
                let arr = res.data.filter(item => {
                    console.log(item)
                    return item.canNull == "NO"
                })
                arr.forEach(item => {
                    Echeckbox.push(item.tableField)
                })

                this.setState({
                    DCtabledata: res.data,
                    Echeckbox,
                    visible: !visible
                });

            }
        })
    }
    //选中改变
    onchangeCheckbox = (e) => {
        this.setState({
            Echeckbox: e
        })
    }
    //弹出框数据导出,需要传产
    handleOk = (e) => {
        let { Echeckbox } = this.state

        // 请求导出表按钮，数据导出
        let currentDay = moment().format("YYYYMMDD");
        let fileName = "项目信息管理表" + currentDay + ".xls";
        const hide = message.loading("报表数据正在检索中,请耐心等待。。。", 0);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            var values = {
                ...fieldsValue,
                selectedField: Echeckbox.join(',')
            };
            Postexport(values).then(res => {
                console.log(res)
                if (res.success == 1) {
                    message.destroy();
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = res.data + "?filename=" + fileName;
                    a.click();
                    document.body.removeChild(a);
                } else if (res.success == 0) {
                    message.destroy();
                    message.error(res.message);
                }
            })
        })


        // 关闭按钮
        this.setState({
            visible: false,
        });
    };

    render = _ => {

        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys, h } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div className="main_height" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                    {this.state.rules.map((val, index) =>
                        <FormItem
                            label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {getFieldDecorator(val.key, val.option)(val.render())}
                        </FormItem>)}
                    <FormItem>
                        <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                        {/* //wxy数据导入 数据导出 */}
                        <Upload  {...this.state.uploadConf}>
                            <Button type="primary" style={{ marginLeft: '10px' }}>数据导入</Button>
                        </Upload>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this.dataExport()}>数据导出</Button>
                        {/* <Button style={{ marginLeft: '10px' }} onClick={this.onClickShowModul}>重置</Button>*/}
                        <Modal
                            title="导出文件"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            key=""
                            okText="导出"
                            cancelText="取消"
                        >

                            {/* //wxy表格内容 */}
                            <div>
                                <Checkbox.Group style={{ width: '100%' }} onChange={this.onchangeCheckbox} defaultValue={this.state.Echeckbox}>
                                    <Row>
                                        {
                                            this.state.DCtabledata.map((item, index) => {
                                                return <Col span={8} key={index} > <Checkbox value={item.tableField}

                                                    disabled={item.canNull === 'NO' ? true : false}
                                                >{item.comment}
                                                </Checkbox></Col>
                                            })
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </Modal>
                    </FormItem>
                </Form>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        rowKey={"id"}
                        bordered
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />
                    {/* 分页器组件 */}
                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>



            </div>
        )
    }

}


const ProjectMationForm = Form.create()(projectMation)
export default ProjectMationForm
