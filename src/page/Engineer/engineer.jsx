/***
 *  系统管理--工程师管理
 * @auth jxl
 */
import React, { Component } from 'react'
import { Form, InputNumber, Input, Button, Modal, message, Select, Tooltip, Table, Row, Col, Checkbox, Upload } from 'antd'
import { connect } from 'react-redux'
import { ADD_PANE } from '/redux/action'
import Common from '/page/common.jsx'
//引入数据导出接口 （wxy）
import { GetbiUserexportView, PostbiUserexport } from '/api/excelObtn'
import moment from "moment";//wxy

const ButtonGroup = Button.Group
const { Option } = Select;
const { confirm } = Modal;//wxy
let token = localStorage.getItem('token'); //wxy


// 引入页面CSS
import '@/assets/less/pages/logBookTable.css'
// 分页组件
import Pagination from "@/components/pagination/index"
// 引入 API接口
import { educationalLevel, getBiUser, biUserInfo } from '/api/engineer'


@connect(state => ({
    panes: state.global.panes,
}), dispath => ({
    add(pane) { dispath({ type: ADD_PANE, data: pane }) },
}))



class engineer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // 导出按钮开关wxy
            DCOff: false,
            DCtabledata: [],
            canNull: "",
            Echeckbox: [],
            uploadConf: {//上传配置 导入wxy
                name: 'file',
                action: '/biUser/import',
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
            //设置表格的高度
            h: { y: 240 },
            // 表格数据
            tabledata: [],
            // 表格列数据
            columns: [{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '姓名',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text, record) =>
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{ color: '#1890ff', cursor: 'pointer', display: 'block' }} onClick={() => this.previewing(record)}>{text}</span>
                    </Tooltip>
            }, {
                title: '所属部门',
                dataIndex: 'deptName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '职位名称',
                dataIndex: 'positionName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '文化程度',
                dataIndex: 'educational',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '员工状态',
                dataIndex: 'mpstatus',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '工作年限',
                dataIndex: 'bussiYear',
                ellipsis: {
                    showTitle: false,
                },
                align: 'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '工作省份',
                dataIndex: 'province',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '地市',
                dataIndex: 'city',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }, {
                title: '人员类型',
                dataIndex: 'jobType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
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

            userTypeArr: [], //人员类型数据集合
            leavelArr: [], // 文化程度数据集合
            startBussiYear: '',      // 工作年限---最小值
            endBussiYear: '',  // 工作年限---最大值
            rules: [
                {
                    label: '姓名',
                    key: 'name',
                    render: _ => <Input style={{ width: 200 }} placeholder="请输入姓名" />
                }, {
                    label: '所属部门',
                    key: 'deptName',
                    render: _ => <Input style={{ width: 200 }} placeholder="请输入所属部门" />
                }, {
                    label: '工作年限',
                    key: 'year',
                    render: _ => <span>
                        <InputNumber min={1} style={{ width: 80 }} onChange={this.onChangeServiceMin} value={this.state.startBussiYear} />
                        ~
                        <InputNumber min={1} style={{ width: 80 }} onChange={this.onChangeServiceMax} value={this.state.endBussiYear} />
                    </span>
                }
                // ,{
                //     label: '人员类型',
                //     key: 'jobType',
                //     render: _ => <Select style={{ width: 200 }} placeholder="请选择人员类型" allowClear={true}>
                //         {
                //             this.state.userTypeArr.map((items, index) => {
                //                 return (<Option key={items.itemCode} value={items.itemCode}>{items.itemValue}</Option>)
                //             })
                //         }
                //     </Select>

                // }
                , {
                    label: '文化程度',
                    key: 'educational',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择文化程度" allowClear={true}>
                        {
                            this.state.leavelArr.map((items, index) => {
                                return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>
                }, {
                    label: '员工状态',
                    key: 'mpstatus',
                    render: _ =>
                        <Select style={{ width: 200 }} placeholder="请选择员工状态" allowClear={true}>
                            <Option key='在职'>在职</Option>
                            <Option key='离职'>离职</Option>
                        </Select>

                }
            ],
            visible: false,  // 对话框的状态
            titleMap: {
                add: '新增公告信息',
                edit: '修改公告信息',
                previewing: '查看信息'
            },
            visibleStatus: 'add',
            // 当前点击的工程师ID
            selectedRowKeys: null,
            tableId: null,

        }
    }

    // 组件将要挂载完成后触发的函数
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.addEventListener("resize", () => { this.SortTable() }, false)

        this.init();

        // 查询工程师列表
        this.getTableList();

    }

    // 初始化数据
    init = () => {

        // 人员类型--接口



        // 文化程度---接口
        educationalLevel({ dictCode: 'educational' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    leavelArr: res.data,
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })


    }

    // 获取 工程师信息 接口
    getBiUserInfo = (id) => {
        biUserInfo(id).then(res => {
            if (res.success == 1) {
                this.setState({
                    modalTable: res.data.certList,
                    modalFormArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }


    // 查询工程师列表（分页)
    getTableList = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.setState({ loading: true })
            var values = {
                ...fieldsValue,
            };
            let newSearchForm = {
                deptName: values.deptName,
                educational: values.educational,
                mpstatus: values.mpstatus,
                name: values.name,
                startBussiYear: this.state.startBussiYear,
                endBussiYear: this.state.endBussiYear
            }

            getBiUser(this.state.pageSize, this.state.current, newSearchForm).then(res => {
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


    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            console.log(this.tableDom.offsetHeight);
            let h = this.tableDom.clientHeight - 125;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }


    // 工作年限---最小值输入框事件
    onChangeServiceMin = (value) => {
        this.setState({
            startBussiYear: value
        })
    }

    // 工作年限---最大值输入框事件
    onChangeServiceMax = (value) => {
        this.setState({
            endBussiYear: value
        })
    }



    // 查询条件--事件
    onSearch = (e) => {
        e.preventDefault();
        // 走接口调用
        this.getTableList();
    }

    //清空高级搜索
    clearSearchprops = () => {
        this.setState({
            startBussiYear: '',
            endBussiYear: ''
        })
        this.props.form.resetFields();
    }


    // 单选框按钮---选中事件
    onSelectChange = (selectedRowKeys) => {
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

    // 点击表格--姓名时，弹出二级对话框(只读状态)
    previewing = (record) => {
        let pane = {
            title: record.name + '工程师档案',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'Engineer/formSearch.jsx',
            params: {
                id: record.id,
                userId: record.userId
            }
        }

        this.props.add(pane)


    }


    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.pagination, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            pagination: data
        }, () => {
            // 调用接口
            this.getTableList()
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
            this.getTableList()
        })


    }


    // 对话框---确认
    handleOk = e => {
        console.log(e);
        if (this.state.visibleStatus == 'previewing') {
            this.setState({
                visible: false,
            });
        } else {
            this.setState({
                visible: false,
            });
        }
    };



    // 关闭--详情---对话框
    handleCancel = () => {
        this.setState({
            visible: false,
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

    //弹出框wxy
    showModal = () => {
        this.setState({
            DCOff: true,
        });
    };

    //弹出框wxy
    handleCancel = (e) => {

        this.setState({
            DCOff: false,
        });
    };
    //数据导入wxy
    dataimport = () => {
        alert(' 数据导入wxy')
    }

    //数据导出wxy
    dataExport = () => {
        let { DCOff } = this.state
        GetbiUserexportView().then((res) => {
            console.log(res)
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
                    DCOff: !DCOff
                });

            }
        })
    }
    //选中改变wxy
    onchangeCheckbox = (e) => {
        this.setState({
            Echeckbox: e
        })
    }
    //弹出框数据导出,需要传产wxy
    handleOk = (e) => {
        let { Echeckbox } = this.state

        // 请求导出表按钮，数据导出
        let currentDay = moment().format("YYYYMMDD");
        let fileName = "工程师信息管理表" + currentDay + ".xls";
        const hide = message.loading("报表数据正在检索中,请耐心等待。。。", 0);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            var values = {
                ...fieldsValue,
                selectedField: Echeckbox.join(',')
            };
            PostbiUserexport(values).then(res => {
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
            DCOff: false,
        });
    };


    render = _ => {

        const { getFieldDecorator } = this.props.form;
        const { h, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };

        return (
            <div className="engineerContent main_height" id="engineerContent" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                    {this.state.rules.map((val, index) =>
                        <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                            {getFieldDecorator(val.key, val.option)(val.render())}
                        </Form.Item>)}
                    <Form.Item>
                        <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={this.clearSearchprops}>重置</Button>
                    </Form.Item>
                    {/* //wxy数据导入 数据导出 */}
                    <Upload  {...this.state.uploadConf}>
                        <Button type="primary" style={{ marginLeft: '10px' }}>数据导入</Button>
                    </Upload>
                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.dataExport}>数据导出</Button>
                    {/* //wxy */}
                    <Modal
                        title="导出文件"
                        visible={this.state.DCOff}
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



                </Form>

                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table
                        className="jxlTable"
                        bordered
                        rowKey={record => record.id} //在Table组件中加入这行代码
                        // onRow={this.onClickRow}
                        // rowSelection={rowSelection}
                        dataSource={this.state.tabledata}
                        columns={this.state.columns}
                        pagination={false}
                        scroll={h}
                        size={'small'}
                        style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                        loading={this.state.loading}  //设置loading属性
                    />

                    <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                </div>
            </div>
        )
    }



}

const EngineerForm = Form.create()(engineer)
export default EngineerForm;