/***
 *  系统管理--工程师管理
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, List, Tag, Button, Select, Input, message } from 'antd'
import {
    FormOutlined
} from '@ant-design/icons';
const { Option } = Select;
const { TextArea } = Input;

// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'
// 引入页面CSS
import '@/assets/less/components/layout.less'
// 引入 API接口
import { GetAssessLog, GetAssessConfig, PostAssessConfig, TemporaryOpen } from '/api/gradeConfig'

class engineerConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 工程师自评估填写功能状态
            status: null,
            // 工程师自评估填写功能暂存状态
            currentStatus: null,
            // 工程师配置是否不可编辑 true：不可编辑  false：可编辑
            editStatus: true,
            // 开启历史
            history: [
                // {
                //     "content":"关闭全体工程师能力自评估填写功能。",
                //     "id":"3653",
                //     "objectName":"-",
                //     "operateTime":"2021-03-01 09:50:05",
                //     "operateType":"update",
                //     "resourceName":"工程师技能评价配置",
                //     "userName":"testa"
                // },
            ],
            // 专业能力级别分值
            "competenceLevel": [
                // {
                //     "itemCode": "expert",
                //     "itemName": "",
                //     "itemType": "competenceLevel",
                //     "itemValue": "90",
                //     "itemValue2": "",
                //     "version": "1"
                // },
            ],
            // 专业能力分类
            comableType: [
                {
                    key: "skillType",
                    name: "技能类型"
                },
                {
                    key: "productLine",
                    name: "产品线级别"
                },
                {
                    key: "competenceLevel",
                    name: "专业能力级别"
                }
            ],
            // 专业能力评分规则
            comableFormulaVal: null,
            comableFormula: null,
            // 综合能力分类
            proableType: [
                {
                    key: "experience",
                    name: "工作经验"
                },
                {
                    key: "certificate",
                    name: "资质证书"
                },
                {
                    key: "commskills",
                    name: "沟通能力"
                },
                {
                    key: "docskills",
                    name: "文档编辑能力"
                },
                {
                    key: "competence",
                    name: "专业能力"
                },
            ],
            // 工程师评分规则
            proableFormulaVal: "",
            proableFormula: "",
            // 工程师级别分值
            "engineerLevel": [
                // {
                //     "itemCode": "expert3",
                //     "itemName": "",
                //     "itemType": "engineerLevel",
                //     "itemValue": "95",
                //     "itemValue2": "",
                //     "version": "1"
                // },
            ],
            // 工程师选择器配置
            selector: {
                visible: false,
            }
        }
    }
    // 组件将要挂载前触发的函数
    async componentWillMount() {
        // 进入页面初始化页面数据 调用初始化方法
        this.init()
    }
    // 组件将要挂载完成后触发的函数
    componentDidMount() {

    }
    // 页面初始化方法(回显数据)
    init = () => {
        // 获取开启日志历史数据
        GetAssessLog().then(res => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.setState({
                    history: res.data
                })
            }
        })
        // 获取回显配置数据
        GetAssessConfig().then(res => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                let rules = res.data.comableFormula;
                let rules2 = res.data.proableFormula;
                this.state.comableType.forEach(item => {
                    rules = rules.replace(item.key,item.name)
                })
                this.state.proableType.forEach(item => {
                    rules2 = rules2.replace(item.key,item.name)
                })
                console.log(rules,rules2)
                this.setState({
                    status: res.data.status,
                    currentStatus: res.data.status,
                    competenceLevel: res.data.competenceLevel,
                    comableFormula: res.data.comableFormula,
                    proableFormula: res.data.proableFormula,
                    comableFormulaVal: rules,
                    proableFormulaVal: rules2,
                    engineerLevel: res.data.engineerLevel
                }, () => {
                })
            }
        })
    }

    // 状态开启关闭方法
    onChangeState = (value) => {
        this.setState({
            currentStatus: value
        }, () => {
            let { status, currentStatus } = this.state;
            if (status == 0 && currentStatus == 1) {
                this.setState({
                    editStatus: false
                })
            } else {
                this.setState({
                    editStatus: true
                })
            }
        })
    }

    // 工程师专业能力级别分值改变方法
    onChangeitemValue = (e) => {
        let id = e.target.id.slice(1)
        let val = e.target.value
        let data = this.state.competenceLevel;
        data.forEach(item => {
            item.itemCode == id ? item.itemValue = val : '';
        })
        this.setState({
            competenceLevel: data
        }, () => {
        })
    }
    // 工程师专业能力级别案例数改变方法
    onChangeitemValue2 = (e) => {
        let id = e.target.id.slice(1)
        let val = e.target.value
        let data = this.state.competenceLevel;
        data.forEach(item => {
            item.itemCode == id ? item.itemValue2 = val : '';
        })
        this.setState({
            competenceLevel: data
        }, () => {
        })
    }
    // 工程师本项专业能力分值计算规则改变方法
    onChangecomableFormulaVal = (e) => {
        let val = e.target.value
        let valCode = e.target.value
        this.state.comableType.forEach(item => {
            valCode = valCode.replace(item.name, item.key)
        })
        this.setState({
            comableFormulaVal: val,
            comableFormula: valCode
        }, () => {
        })
    }

    // 工程师综合能力分值计算规则改变方法
    onChangeAllRules = (e) => {
        let val = e.target.value
        let valCode = e.target.value
        this.state.proableType.forEach(item => {
            valCode = valCode.replace(item.name, item.key)
        })
        this.setState({
            proableFormulaVal: val,
            proableFormula: valCode
        }, () => {
        })
    }

    // 工程师级别起始分值改变方法
    onChangeStart = (e) => {
        let id = e.target.id.slice(1)
        let val = e.target.value
        let data = this.state.engineerLevel;
        data.forEach(item => {
            item.itemCode == id ? item.itemValue = val : '';
        })
        this.setState({
            engineerLevel: data
        }, () => {
        })
    }

    // 工程师级别截止分值改变方法
    onChangeEnd = (e) => {
        let id = e.target.id.slice(1)
        let val = e.target.value
        let data = this.state.engineerLevel;
        data.forEach(item => {
            item.itemCode == id ? item.itemValue2 = val : '';
        })
        this.setState({
            engineerLevel: data
        }, () => {
        })
    }
    // 专业能力tag添加方法
    appendComable = (item) => {
        if (this.state.editStatus) { return }
        let { comableFormulaVal, comableFormula } = this.state;
        comableFormulaVal += item.name;
        comableFormula += item.key
        this.setState({
            comableFormulaVal,
            comableFormula
        })
    }
    // 综合能力tag添加方法
    appendProable = (item) => {
        if (this.state.editStatus) { return }
        let { proableFormulaVal, proableFormula } = this.state;
        proableFormulaVal += item.name;
        proableFormula += item.key
        this.setState({
            proableFormulaVal,
            proableFormula
        })
    }
    // 保存前数据校验
    check = _ => {
        let error = true;
        let { competenceLevel, comableFormulaVal, comableFormula, proableFormulaVal, proableFormula, engineerLevel } = this.state;
        // 数据校验
        // 工程师专业能力级别评定规则数据校验
        let current = competenceLevel[0].itemValue
        competenceLevel.forEach((el, i) => {
            if (el.itemValue == "" || isNaN(Number(el.itemValue))||el.itemValue2 == "" || isNaN(Number(el.itemValue2))) {
                el["error"] = "不能为空且必须是数字"
                error = false
            } else if (i != 0) {
                if (el.itemValue * 1 >= current * 1 && current != "") {
                    el["error"] = "请填写正确的分值"
                    error = false
                }
            } else {
                el["error"] = ""
            }
            current = el.itemValue

        })
        this.setState({
            competenceLevel: competenceLevel
        })
        // 工程师本项专业能力分值计算规则数据校验
        let reg = /[\u4e00-\u9fa5]/;
        let reg2 = /[A-Za-z]/;
        var reg3 = new RegExp("[`~!@#$^&=|{}':;',\\[\\]<>?~！@#￥……&——|{}【】‘；：”“'。，、？]");
        let errorStr2 = ''
        if (comableFormulaVal == "") {
            error = false
            errorStr2 = "工程师本项专业能力分值计算规则不能为空"
        } else if (reg3.test(comableFormulaVal)) {
            error = false
            errorStr2 = "工程师本项专业能力分值计算规则不能包含除+-*/之外的其他符号"
        } else if (reg2.test(comableFormulaVal)) {
            error = false
            errorStr2 = "工程师本项专业能力分值计算规则不能包含英文字符"
        } else if (reg.test(comableFormula)) {
            error = false
            errorStr2 = "工程师本项专业能力分值计算规则不符合规范"
        } else {
            errorStr2 = ''
        }
        this.setState({
            comableFormulaError: errorStr2
        })
        // 工程师综合能力分值计算规则数据校验
        let errorStr = ''
        if (proableFormulaVal == "") {
            error = false
            errorStr = "工程师综合能力分值计算规则不能为空"
        } else if (reg3.test(proableFormulaVal)) {
            error = false
            errorStr = "工程师综合能力分值计算规则不能包含除+-*/之外的其他符号"
        } else if (reg2.test(proableFormulaVal)) {
            error = false
            errorStr = "工程师综合能力分值计算规则不能包含英文字符"
        } else if (reg.test(proableFormula)) {
            error = false
            errorStr = "工程师综合能力分值计算规则不符合规范"
        } else {
            errorStr = ''
        }
        this.setState({
            proableFormulaError: errorStr
        })
        // 工程师专业能力级别评定规则数据校验
        let start = engineerLevel[0].itemValue
        let end = engineerLevel[0].itemValue2
        let level = engineerLevel[0].itemName
        engineerLevel.forEach((item, i) => {
            if (i == 0) {
                if (item.itemValue == "" || isNaN(Number(item.itemValue))) {
                    item["error"] = "起始分值不能为空且必须是数字"
                    error = false
                } else {
                    item["error"] = ""
                }
            } else {
                if (item.itemValue == "" || item.itemValue2 == "" || isNaN(Number(item.itemValue)) || isNaN(Number(item.itemValue2))) {
                    item["error"] = "分值不能为空且必须是数字"
                    error = false
                } else if (item.itemValue2 * 1 >= start * 1 && start != "") {
                    item["error"] = "请填写正确的分值"
                    error = false
                } else if (item.itemValue * 1 > item.itemValue2 * 1) {
                    item["error"] = "请填写正确的分值"
                    error = false
                } else {
                    item["error"] = ""
                }
                start = item.itemValue
                end = item.itemValue2
                level = item.itemName
            }
        })
        this.setState({
            engineerLevel: engineerLevel
        })
        return error
    }

    //保存数据
    sava = _ => {
        let params = {}
        // 改为关闭状态的保存
        if (this.state.status && !this.state.currentStatus) {
            params = { status: this.state.currentStatus }
        } else {
            if (!this.check()) {
                return
            } else {
                let { currentStatus, competenceLevel, comableFormula, proableFormula, engineerLevel } = this.state;
                params = Object.assign({}, { status: currentStatus, competenceLevel, comableFormula, proableFormula, engineerLevel })
            }
        }
        PostAssessConfig(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                this.init()
            }
        })
        // 校验文案
        // 1 状态未变不保存   文案
        // 2 状态改变 开启-关闭 只保存状态值     关闭-开启 保存状态和规则

    }

    // 工程师自评估临时开启
    opening = _ => {
        this.setState({
            selector: {
                visible: true,
            }
        })
    }

    // 工程师选择器确定方法
    onSelectorOK = (selectedKeys, info) => {
        let params={ids:selectedKeys}
        TemporaryOpen(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                this.init()
            }
        })
        this.onSelectorCancel()
    }

    // 工程师选择器取消方法
    onSelectorCancel = _ => {
        this.setState({
            selector: {
                visible: false,
            }
        })
    }

    render = _ => {
        return (
            <div className="layoutOMM">
                <div className="loPageTitle">工程师技能评价配置</div>
                <div className="loPageContent">
                    <div className="loArea">
                        <div className="loAreaTitle">
                            <FormOutlined style={{ marginRight: "10px" }} />
                            全体工程师能力自评估填写功能
                            <Select key={this.state.currentStatus} value={this.state.currentStatus} onChange={this.onChangeState} style={{ width: 120, margin: "0 15px" }}>
                                <Option value={0}>关闭</Option>
                                <Option value={1}>开启</Option>
                            </Select>
                            <Button type="primary" onClick={this.opening}>临时开启</Button>
                        </div>
                        <div className="loAreaContent">
                            <List
                                dataSource={this.state.history}
                                split={false}
                                size="small"
                                rowKey={"time"}
                                renderItem={(item, i) => <List.Item>{(i + 1) + "、 " + item.operateTime + " " + item.userName + item.content}</List.Item>}
                            />
                        </div>
                    </div>
                    <div className="loArea">
                        <div className="loAreaTitle">
                            <FormOutlined style={{ marginRight: "10px" }} />
                            工程师专业能力级别评定规则：
                        </div>
                        <div className="loAreaContent">
                            <List
                                dataSource={this.state.competenceLevel}
                                split={false}
                                size="small"
                                rowKey={"level"}
                                renderItem={(item, i) =>
                                    <List.Item>
                                        {item.itemName + '级别评定规则为'}
                                        <Input id={"m" + item.itemCode} disabled={this.state.editStatus} onChange={this.onChangeitemValue} style={{ width: "80px", margin: "0 5px" }} value={item.itemValue} />
                                        {'分以上；'}
                                        {'案例说明数量达到'}
                                        <Input id={"m" + item.itemCode} disabled={this.state.editStatus} onChange={this.onChangeitemValue2} style={{ width: "80px", margin: "0 5px" }} value={item.itemValue2} />
                                        {'个以上；'}
                                        <span className="ListError">{item.error}</span>
                                    </List.Item>}
                            />
                        </div>
                    </div>
                    <div className="loArea">
                        <div className="loAreaTitle">
                            <FormOutlined style={{ marginRight: "10px" }} />
                            工程师本项专业能力分值计算规则：
                            {this.state.comableType.map((item, key) => {
                                return <Tag key={item.key} onClick={_ => this.appendComable(item)}>{item.name}</Tag>
                            })}
                        </div>
                        <div className="loAreaContent">
                            <TextArea disabled={this.state.editStatus} rows={4} key={this.state.comableFormulaVal} value={this.state.comableFormulaVal} onChange={this.onChangecomableFormulaVal} style={{ marginTop: "10px" }} />
                            <span className="ListError">{this.state.comableFormulaError}</span>
                        </div>
                    </div>
                    <div className="loArea">
                        <div className="loAreaTitle">
                            <FormOutlined style={{ marginRight: "10px" }} />
                            工程师综合能力分值计算规则：
                            {this.state.proableType.map((item, key) => {
                                return <Tag key={item.key} onClick={_ => this.appendProable(item)}>{item.name}</Tag>
                            })}
                        </div>
                        <div className="loAreaContent">
                            <TextArea disabled={this.state.editStatus} rows={4} key={this.state.proableFormulaVal} value={this.state.proableFormulaVal} onChange={this.onChangeAllRules} style={{ marginTop: "10px" }} />
                            <span className="ListError">{this.state.proableFormulaError}</span>
                        </div>
                    </div>
                    <div className="loArea">
                        <div className="loAreaTitle">
                            <FormOutlined style={{ marginRight: "10px" }} />
                            工程师级别评定规则
                        </div>
                        <div className="loAreaContent">
                            <List
                                dataSource={this.state.engineerLevel}
                                split={false}
                                size="small"
                                rowKey={"level"}
                                renderItem={(item, i) =>
                                    <List.Item >
                                        {item.itemName + '级别评定规则为'}
                                        <Input disabled={this.state.editStatus} style={{ width: "80px", margin: "0 5px" }} id={"a" + item.itemCode} onChange={this.onChangeStart} value={item.itemValue} />
                                        {'分至'}
                                        <Input disabled={this.state.editStatus} style={{ width: "80px", margin: "0 5px" }} id={"b" + item.itemCode} onChange={this.onChangeEnd} value={item.itemValue2} />
                                        {'分；'}
                                        <span className="ListError">{item.error}</span>
                                    </List.Item>}
                            />
                        </div>
                    </div>
                </div>
                <div className="loFooterBtns">
                    <Button type="info" onClick={this.init}>取消</Button>
                    {
                        this.state.currentStatus != this.state.status ? <Button type="primary" onClick={this.sava}>保存</Button> : <Button type="info" disabled>保存</Button>
                    }
                </div>
                {
                    this.state.selector.visible ? <Selector
                        onOk={this.onSelectorOK}
                        onCancel={this.onSelectorCancel} /> : ""
                }
            </div>
        )
    }
}

const EngineerForm = Form.create()(engineerConfig)
export default EngineerForm;