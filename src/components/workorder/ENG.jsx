/***
 *  系统管理--工程师自评工单ENG
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, Table, Button, Select, message, Tooltip, Modal } from 'antd'
const { Option } = Select;
const { confirm } = Modal;

// 引入专业能力组件
import Technology from './technology.jsx'
// 引入页面CSS
import '@/assets/less/components/layout.less'
// 引入 API接口
import { GetBaseData, GetAssessData, DelAssessProable, PostAssessData } from '/api/selfEvaluation'
// 引入为空校验方法
import nullCheck from '@/assets/js/methods.js'

class ENG extends Component {
    // 设置默认props
    static defaultProps = {
        config: {
            formRead: 1, id: "", //外部所传参数  1为可编辑 2为不可编辑  id为工单id号
        }
    }
    // 组件将要挂载前触发的函数
    async componentWillMount() {
        // 获取外部传递参数
        let config = this.props.config;
        this.setState({
            pageConfig: config
        }, () => {
            this.init() // 页面初始化
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            // 专业能力表格配置
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    editable: false,
                    align: 'center',
                    width: '80px',
                    render: (text, record, index) => `${index + 1}`
                },
                {
                    title: '技术类别',
                    dataIndex: 'skillTypeName',
                    align: 'center',
                    width: 200
                },
                {
                    title: '品牌',
                    dataIndex: 'brandName',
                    align: 'center',
                    width: 200
                },
                {
                    title: '产品线级别',
                    dataIndex: 'productLineLevel',
                    align: 'center',
                    width: 200
                },
                {
                    title: '具备维护能力的产品线',
                    dataIndex: 'productLines',
                    align: 'center',
                    width: 380,
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text, record, index) => {
                        let str = ""
                        text.forEach((item, i) => {
                            // str += `${i + 1}、${item}`
                            str += (i + 1) + "、" + item + "\n"
                        })
                        return <Tooltip title={text.map((item, i) => {
                            return <span key={i}>{(i + 1) + "、" + item}<br /></span>
                        })}>
                            <span title={str}>{text.join()}</span>
                        </Tooltip>
                    }
                },
                {
                    title: '专业能力级别',
                    dataIndex: 'level',
                    width: 200,
                    align: 'center',
                },
            ],
            // 专业能力表格选中项
            selectedKeys: [],
            selectedInfo: [],
            // 专业能力弹窗组件配置
            config: {
                type: "",
                title: "",
                visible: false,
            },
            //下拉框基础数据
            baseData: {
                "commskills": [],   //沟通能力
                "docskills": [],   //文档编辑能力
                "experience": [],   //工作经验
                "productLine": [],   //产品线
                "competenceLevel": [],   //专业能力级别
                "serviceClass": [],   //专业能力
                "skillType": [],   //技术类别
                "brand": [],   //品牌
            },
            //专业能力窗口回显数据
            echoData: {
                // id: "",
                // assessId: "",
                // skillTypeCode: "",
                // skillTypeName: "",
                // brandCode: "",
                // brandName: "",
                // productLineCode: [],
                // productLineName: [],
                // productLineLevel: "",
                // competenceLevel: "",
                // productLineLevelVal: "",
                // competenceLevelVal: "",
                // serviceItemCode: [],
                // cases: [],
            },
            // 工程师回显数据
            info: {
                // id: "",                            //工程师自评价ID
                // name: "李四",                            //工程师姓名
                // deptName: "上海研发",                            //部门
                // experienceCode: "01",                            //经验
                // commskillsCode: "01",                            //沟通能力
                // docskillsCode: "01",                            //文档编辑能力
                // highCert: "6",                            //高级证书
                // middleCert: "5",                            //中级证书
                // elementaryCert: "4",                            //初级证书
                // assessProableList: [                            //专业能力数组
                //     {
                //         id: "1",
                //         assessId: "",
                //         skillTypeCode: "01",
                //         skillTypeName: "小型机",
                //         brandCode: "02",
                //         brandName: "IBM",
                //         productLineCode: [5, 6],
                //         productLineName: ["P670/P690", "P590/P595"],
                //         productLineLevel: "高端",
                //         competenceLevel: "高端",
                //         productLineLevelVal: "1",
                //         competenceLevelVal: "1",
                //         serviceItemCode: [5, 6],
                //         cases: [],
                //     }
                // ],
                assessProableList: [],
                certs: []

            },
            // 外部所传参数  1为可编辑 2为不可编辑  id为工单id号
            pageConfig: { formRead: 1, id: "" }
        }
    }

    // 页面初始化方法(回显数据)
    init = () => {
        //  1 获取下拉框基础数据
        this.getBaseData()
        //  2 通过组件传参获取工程师自评id、页面元素权限配置 
        //  3 获取已提交自评数据
        this.getAssessData()

    }
    // 获取下拉框基础数据方法
    getBaseData = () => {
        // 请求下拉框基础数据
        GetBaseData().then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.setState({
                    baseData: res.data
                })
            }
        })
    }
    // 获取已提交自评数据方法
    getAssessData = () => {
        let param = { id: this.state.pageConfig.id }
        // 请求已提交自评数据
        GetAssessData(param).then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.setState({
                    info: res.data
                })
            }
        })
    }
    // 经验选中方法
    onSelect1 = (val, option) => {
        let info = Object.assign({}, this.state.info, { experienceCode: val })
        this.setState({
            info
        })
    }
    // 沟通能力选中方法
    onSelect2 = (val, option) => {
        let info = Object.assign({}, this.state.info, { commskillsCode: val })
        this.setState({
            info
        })
    }
    // 文档编辑能力选中方法
    onSelect3 = (val, option) => {
        let info = Object.assign({}, this.state.info, { docskillsCode: val })
        this.setState({
            info
        })
    }
    // 行选中
    onRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id], selectedInfo = [record];
                this.setState({
                    selectedKeys, selectedInfo
                })

            }
        }
    }
    // 专业能力表格选中
    onSelect = (selectedKeys, selectedInfo) => {
        this.setState({
            selectedKeys, selectedInfo
        })
    }

    // 新增专业能力
    onAddAbility = _ => {
        this.setState({
            config: {
                type: "add",
                title: "新增专业能力",
                visible: true,
            },
            echoData: { assessId: this.state.info.id }
        })
    }

    // 修改专业能力
    onEditAbility = _ => {
        let checked = this.state.selectedKeys.length;
        if (!checked) {
            message.destroy()
            message.error("未选中列表项,请选中后再编辑")
        } else {
            let echoData = this.state.selectedInfo[0]
            this.setState({
                config: {
                    type: "edit",
                    title: "修改专业能力",
                    visible: true,
                },
                echoData
            })
        }
    }
    // 查看专业能力
    onSeeAbility = _ => {
        let checked = this.state.selectedKeys.length;
        if (!checked) {
            message.destroy()
            message.error("未选中列表项,请选中后再查看")
        } else {
            let echoData = this.state.selectedInfo[0]
            this.setState({
                config: {
                    type: "see",
                    title: "查看专业能力",
                    visible: true,
                },
                echoData
            })
        }
    }
    // 删除专业能力
    onDelAbility = _ => {
        let checked = this.state.selectedKeys;
        if (!checked.length) {
            message.destroy()
            message.error("未选中列表项,请选中后再删除")
            return
        }
        let _this = this
        // 删除提示+删除操作   
        confirm({
            title: '删除',
            content: '删除后不可恢复,确定删除吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let param = checked[0]
                DelAssessProable(param).then(res => {
                    if (res.success != 1) {
                        message.error(res.message)
                    } else {
                        _this.setState({
                            selectedKeys: [],
                            selectedInfo: []
                        })
                        _this.updateTab()
                    }
                })
            },
        });

    }
    // 专业能力组件确认方法
    onOk = _ => {
        this.updateTab()
        this.onCancel()
    }
    // 专业能力组件取消方法
    onCancel = _ => {
        let visible = false;
        let config = Object.assign({}, this.state.config, { visible })
        this.setState({
            config
        })
    }
    // 专业能力数据更新
    updateTab = _ => {
        // 请求已提交自评数据 更新专业能力列表
        GetAssessData().then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                let { info } = this.state;
                info = Object.assign({}, info, { assessProableList: res.data.assessProableList })
                this.setState({
                    info
                })
            }
        })
    }
    // 保存前数据校验
    check = (obj) => {
        let result = true
        Object.keys(obj).forEach(function (key) {
            if (nullCheck(obj[key])) {
                result = false
            }
        });
        return result
    }

    //提交数据
    sava = _ => {
        let { id, experienceCode, commskillsCode, docskillsCode } = this.state.info;
        let params = { id, experienceCode, commskillsCode, docskillsCode };
        let checked = this.check(params);
        if (!checked) {
            message.destroy()
            message.error("请将工程师相关信息填写完整再进行提交！")
            return
        }
        PostAssessData(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                let pageConfig = Object.assign({}, this.state.pageConfig, { formRead: 2 })
                console.log(pageConfig, "pageConfig1")
                this.setState({
                    pageConfig
                }, () => {
                    console.log(pageConfig, "pageConfig2")
                })
            }
        })
    }
    render = _ => {
        let { experience, commskills, docskills } = this.state.baseData;
        let { info, pageConfig } = this.state;
        let readOnly = pageConfig.formRead == 2 || !info.status;
        let highCert = info.hasOwnProperty("certs") ? info.certs.filter((item) => {
            return item.certLevel == "高级"
        }) : [];
        let middleCert = info.hasOwnProperty("certs") ? info.certs.filter((item) => {
            return item.certLevel == "中级"
        }):[];
        let elementaryCert = info.hasOwnProperty("certs") ? info.certs.filter((item) => {
            return item.certLevel == "初级"
        }):[];
        return (
            <div className="layoutOMM">
                <div className="loPageContent">
                    <div className="loArea">
                        <div className="worksheet">
                            <div className="row">
                                <div className="column">
                                    <div className="key">工程师姓名</div>
                                    <div className="val">{info.userName}</div>
                                </div>
                                <div className="column">
                                    <div className="key">部门</div>
                                    <div className="val">{info.deptName}</div>
                                </div>
                                <div className="column">
                                    <div className="key">经验</div>
                                    <div className="val" style={{ padding: "0 10px" }}>
                                        <Select disabled={!readOnly ? false : true} value={info.experienceCode} style={{ width: "100%" }} bordered={false} onSelect={this.onSelect1}>
                                            <Option value="">请选择</Option>
                                            {
                                                experience.map((item, key) => {
                                                    return <Option key={key} value={item.code}>{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </div>

                                </div>
                            </div>
                            <div className="row">
                                <div className="column2">
                                    <div className="key">沟通能力</div>
                                    <div className="val" style={{ padding: "0 10px" }}>
                                        <Select disabled={!readOnly ? false : true} value={info.commskillsCode} bordered={false} style={{ width: "100%" }} onSelect={this.onSelect2}>
                                            <Option value="">请选择</Option>
                                            {
                                                commskills.map((item, key) => {
                                                    return <Option key={key} value={item.code}>{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="key">文档编辑能力</div>
                                    <div className="val" style={{ padding: "0 10px" }}>
                                        <Select disabled={!readOnly ? false : true} value={info.docskillsCode} bordered={false} style={{ width: "100%" }} onSelect={this.onSelect3}>
                                            <Option value="">请选择</Option>
                                            {
                                                docskills.map((item, key) => {
                                                    return <Option key={key} value={item.code}>{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <div className="key">资质证书</div>
                                    <div className="val">
                                        <div className="row">
                                            <div className="column"><div className="val">高级</div></div>
                                            <div className="column"><div className="val">中级</div></div>
                                            <div className="column"><div className="val">初级</div> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <div className="key">数量</div>
                                    <div className="val">
                                        <div className="row">
                                            <div className="column"><div className="val">
                                                {
                                                    highCert.length ? <Tooltip title={highCert.map((item, i) => {
                                                        return <span key={i}>{(i + 1) + "、" + item.certName}<br /></span>
                                                    })}>
                                                        <span>
                                                            {highCert.length}
                                                        </span>
                                                    </Tooltip> : 0
                                                }

                                            </div></div>
                                            <div className="column"><div className="val">
                                                {
                                                    middleCert.length ? <Tooltip title={middleCert.map((item, i) => {
                                                        return <span key={i}>{(i + 1) + "、" + item.certName}<br /></span>
                                                    })}>
                                                        <span>
                                                            {middleCert.length}
                                                        </span>
                                                    </Tooltip> : 0
                                                }

                                            </div></div>
                                            <div className="column"><div className="val">
                                                {
                                                    elementaryCert.length ? <Tooltip title={elementaryCert.map((item, i) => {
                                                        return <span key={i}>{(i + 1) + "、" + item.certName}<br /></span>
                                                    })}>
                                                        <span>
                                                            {elementaryCert.length}
                                                        </span>
                                                    </Tooltip> : 0}

                                            </div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="loRowBtns alignRight">
                        {/* {info.assessProableList.length ? (<Button type="primary" onClick={this.onSeeAbility}>查看</Button>) : ""} */}
                        <Button type="primary" onClick={this.onSeeAbility}>查看</Button>
                        {!readOnly ? (<Button type="primary" onClick={this.onDelAbility}>删除</Button>) : ""}
                        {!readOnly ? (<Button type="primary" onClick={this.onEditAbility}>修改</Button>) : ""}
                        {!readOnly ? (<Button type="primary" onClick={this.onAddAbility}>新增</Button>) : ""}
                    </div>
                    <div className="loArea">
                        <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onSelect, selectedRowKeys: this.state.selectedKeys, type: "radio", columnWidth: '60px', }} dataSource={info.assessProableList} columns={this.state.columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} size="small" />
                    </div>

                    <div className="loRowBtns alignRight">
                        {!readOnly ? (<Button type="primary" onClick={this.sava}>提交</Button>) : ""}
                    </div>
                </div>
                {!this.state.config.visible ? "" : <Technology onOk={this.onOk} onCancel={this.onCancel}
                    baseData={this.state.baseData}
                    echoData={this.state.echoData}
                    config={this.state.config}></Technology>}
            </div>
        )
    }
}

const ENGForm = Form.create()(ENG)
export default ENGForm;