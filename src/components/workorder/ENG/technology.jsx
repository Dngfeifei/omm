/***
 *  系统管理--工程师专业能力编辑
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, Button, message, Card, Select, Row, Col, Checkbox, Input, Cascader, Modal, Tooltip } from 'antd'
const { Option } = Select;
const { confirm } = Modal;
import {
    MinusOutlined,
    PlusOutlined,
} from '@ant-design/icons';
// 引入页面CSS
import '@/assets/less/components/layout.less'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/base.jsx"
// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"
// 引入 富文本编辑器组件
import Editor from "@/components/editor"

// 引入 API接口
import { PostAssessProable } from '/api/selfEvaluation'

// 引入为空校验方法
import nullCheck from '@/assets/js/methods.js'

// 循环追加tree所需节点属性 key title
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.code;
        if (list.hasOwnProperty("name")) {
            list.title = list.name;
        }
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}

class People extends Component {

    async componentWillReceiveProps(nextprops) {

    }
    // 设置默认props
    static defaultProps = {
        config: {
            type: "",  //add edit see
            title: "",
            visible: false,
        },
        baseData: {},  //下拉框基础数据
    }
    componentWillMount() {
        let { echoData, config } = this.props;
        let skillTypeId = "", brandId = "", competenceLevelId = ""
        let data = JSON.parse(JSON.stringify(Object.assign({}, this.state, echoData)))
        if (config.type == "edit" && data.cases.length == 0) {
            data.cases.push({ custName: "", productLineCode: "", serviceItemCode: "", caseDesc: "" })
        }
        this.props.baseData.skillType.forEach((item) => {
            if (item.code == echoData.skillTypeCode) {
                skillTypeId = item.id
            }
        })
        this.props.baseData.brand.forEach((item) => {
            if (item.code == echoData.brandCode) {
                brandId = item.id
            }
        })
        this.props.baseData.competenceLevel.forEach((item) => {
            if (item.code == echoData.proableLevel) {
                competenceLevelId = item.strValue1
            }
        })
        this.setState({
            ...data,
            skillTypeId, brandId, competenceLevelId
        })
    }
    state = {
        // id: "",           //	专业id
        assessId: "",     //   工程师自评价id
        skillTypeCode: "",   //	技术类别编码
        brandCode: "",    //	品牌编码
        productLineCodes: [], //	产品线编码
        productLineLevelCode: "", //	产品线级别编码
        proableLevel: "", //	专业能力级别
        serviceItemCodes: [], //	服务项
        cases: [{ custName: "", productLineCode: "", serviceItemCode: "", caseDesc: "" }],  //案例

        skillTypeId: "",   //	技术类别编码
        brandId: "",    //	品牌编码
        competenceLevelId: "", //	专业能力级别
    }

    // 技术类别选中方法
    onSelect1 = (val, option) => {
        // 若技术类别选中项与之前选中数据不同 则品牌已选中项、产品线级别已选中项、产品线已选中项、案例数据中产品线已选中项为空
        let preVal = this.state.skillTypeCode;
        if (preVal != val) {
            this.setState({
                brandCode: "",    //	品牌编码
                productLineCodes: [], //	产品线编码
                productLineLevelCode: "", //	产品线级别编码
                skillTypeCode: val,
                skillTypeId: option.key
            })
            let cases = this.state.cases;
            cases.forEach((item) => {
                item.productLineCode = ""
            })
            this.setState({
                cases
            })
        }
    }
    // 品牌选中方法
    onSelect2 = (val, option) => {
        // 若品牌选中项与之前选中数据不同 则产品线级别已选中项、产品线已选中项、案例数据中产品线已选中项为空
        let preVal = this.state.brandCode;
        if (preVal != val) {
            this.setState({
                productLineCodes: [], //	产品线编码
                productLineLevelCode: "", //	产品线级别编码
                brandCode: val,
                brandId: option.key
            })
            let cases = this.state.cases;
            cases.forEach((item) => {
                item.productLineCode = ""
            })
            this.setState({
                cases
            })
        }
    }
    // 产品线级别选中方法
    onSelect3 = (val, option) => {
        // 若产品线级别选中项与之前选中数据不同 则产品线已选中项、案例数据中产品线已选中项为空
        let preVal = this.state.productLineLevelCode;
        if (preVal != val) {
            this.setState({
                productLineCodes: [], //	产品线编码
                productLineLevelCode: val, //	产品线级别编码

            })
            let cases = this.state.cases;
            cases.forEach((item) => {
                item.productLineCode = ""
            })
            this.setState({
                cases
            })
        }

    }
    // 产品线选中方法
    onChange4 = (checkedValues, info) => {
        this.setState({
            productLineCodes: checkedValues
        })
        let cases = this.state.cases;
        cases.forEach((item) => {
            if (checkedValues.indexOf(item.productLineCode) < 0) {
                item.productLineCode = ""
            }
        })
        this.setState({
            cases
        })
    }
    // 专业级别选中方法
    onSelect5 = (val, option) => {
        // 若专业级别选中项与之前选中数据不同 则专业服务分类已选中项、案例数据中专业服务分类已选中项为空
        let preVal = this.state.proableLevel;
        if (preVal != val) {
            this.setState({
                serviceItemCodes: [],
                proableLevel: val,
                competenceLevelId: option.key
            })
            let cases = this.state.cases;
            cases.forEach((item) => {
                item.serviceItemCode = ""
            })
            this.setState({
                cases
            })
        }
    }
    // 专业能力选中方法
    onTreeSelect6 = (val, option) => {
        this.setState({
            serviceItemCodes: val
        })
        let cases = this.state.cases;
        cases.forEach((item) => {
            if (val.indexOf(item.serviceItemCode) < 0) {
                item.serviceItemCode = ""
            }
        })
        this.setState({
            cases
        })
    }
    // 添加新案例
    addCase = () => {
        let newCase = { custName: "", productLineCode: "", serviceItemCode: "", caseDesc: "" };
        let cases = this.state.cases;
        cases.push(newCase)
        this.setState({
            cases
        })
    }
    // 删除案例
    delCase = (e) => {
        let cases = this.state.cases;
        if (cases.length == 1) {
            return
        }
        cases.splice(e, 1);
        this.setState({
            cases: []
        }, () => {
            this.setState({
                cases
            })
        })

    }
    // 案例 客户名称获取方法
    onChangeCase = (e) => {
        let cases = this.state.cases;
        cases[e.target.name].custName = e.target.value;
        this.setState({
            cases
        })
    }

    // 案例模块 已选产品线选中方法
    onSelectCase1 = (val, option) => {
        let cases = this.state.cases;
        cases[option.ref].productLineCode = val;
        this.setState({
            cases
        })
    }

    // 案例模块 能力项选中方法
    onSelectCase2 = (val, option) => {
        let result = [];
        if (!val.length) {
            return
        }
        result = val[val.length - 1];
        let cases = this.state.cases;
        cases[option[0].ref].serviceItemCode = result;
        this.setState({
            cases
        })
    }
    //获取富文本数据
    getContent = (content, key) => {
        let cases = this.state.cases;
        console.log(cases, key, cases[key], cases[key])
        cases[key].caseDesc = content;
        this.setState({
            cases
        })
    }
    // 保存前数据校验
    check = (obj, arr = []) => {
        let result = true
        Object.keys(obj).forEach(function (key) {
            if (nullCheck(obj[key])) {
                result = false
            }
        });
        arr.forEach((item) => {
            Object.keys(item).forEach(function (key) {
                if (nullCheck(item[key])) {
                    result = false
                }
            });
        })
        return result
    }
    // 提交专业能力数据
    onSubmit = () => {
        let { skillTypeCode, brandCode, productLineCodes, productLineLevelCode, proableLevel, serviceItemCodes, cases } = this.state;
        let newCase = []
        for (var i = 0; i < cases.length; i++) {
            let { custName, productLineCode, serviceItemCode, caseDesc } = cases[i];
            console.log(nullCheck(custName), "null")
            if (nullCheck(custName) && nullCheck(productLineCode) && nullCheck(serviceItemCode) && nullCheck(caseDesc)) {
                // cases.splice(i, 1)
            } else {
                newCase.push({ custName, productLineCode, serviceItemCode, caseDesc })
            }
        }
        let allData = { skillTypeCode, brandCode, productLineCodes, productLineLevelCode, proableLevel, serviceItemCodes }
        let checked = this.check(allData, newCase);
        if (!checked) {
            message.destroy()
            message.error("所有表单项均为必填项，请填写完整后再提交!")
            return
        }
        let params = Object.assign({}, this.state, { cases: newCase })
        // 专业能力数据提交
        PostAssessProable(params).then((res) => {
            if (res.success != 1) {
                confirm({
                    // title: '删除',
                    content: res.message,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                })

            } else {
                this.props.onOk()
            }
        })
    }
    render = _ => {
        // 接受组件外传递的数据
        let { onCancel, baseData } = this.props;
        let { productLine, competenceLevel, serviceClass, skillType, brand } = baseData;
        assignment(serviceClass)
        let { type, title, visible } = this.props.config;

        // 专业能力树级数据过滤
        let filterTree = (tree = [], arr = []) => {
            if (!tree.length || !this.state.proableLevel) return []
            for (let item of tree) {
                if (item.strValue1.indexOf(this.state.competenceLevelId) < 0) continue
                let node = { ...item, children: [] }
                arr.push(node)
                if (item.children && item.children.length) filterTree(item.children, node.children)
            }
            return arr
        }
        // 
        let filterTree2 = (tree = [], ref = "") => {
            let result = []   //最终数据数组
            let allCode = [] //一级目录id
            let arr = []    //中间接受数组
            if (!tree.length || !this.state.proableLevel) return []
            for (let item of tree) {
                let node = { ...item, children: [], ref: ref }
                if (this.state.serviceItemCodes.indexOf(item.code) >= 0) {
                    allCode.push(item.id)
                }
                if (item.children && item.children.length) {
                    item.children.forEach((current) => {
                        if (this.state.serviceItemCodes.indexOf(current.code) >= 0) {
                            current.ref = ref
                            node.children.push(current);
                            allCode.push(current.parentId)
                        }
                    })
                }
                arr.push(node)
            }
            arr.forEach((el) => {
                if (allCode.indexOf(el.id) >= 0) {
                    result.push(el)
                }
            })
            return result
        }
        // 
        let filterTree3 = (tree = [], caseItem) => {
            let result = [];
            if (!tree.length) {
                return
            }
            tree.forEach((item) => {
                if (caseItem.serviceItemCode == item.code) {
                    result.push(item.code)
                }
                if (item.children && item.children.length) {
                    item.children.forEach((current) => {
                        if (caseItem.serviceItemCode == current.code) {
                            result.push(item.code)
                            result.push(current.code)
                        }
                    })
                }

            })
            return result
        }
        // 通过下拉框选择项过滤后的产品
        let productLineDatas = [];
        if (this.state.brandId && this.state.productLineLevelCode) {
            productLineDatas = productLine.filter((item) => {
                return item.parentId == this.state.brandId && item.strValue1 == this.state.productLineLevelCode;
            })
        }
        return <div>
            <ModalParant title={title}
                destroyOnClose={true}
                visible={visible}
                onOk={this.onSubmit}//若无选中数据 执行关闭方法
                onCancel={onCancel}
                width={1100}
                bodyStyle={{ padding: "0" }}
                footer={type == "see" ? [
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>
                ] : [
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.onSubmit}>
                        确定
                    </Button>,
                ]}
            >
                <div className="layoutOMM layoutForm" style={{ height: "600px", overflowY: "auto" }}>
                    <div className="loPageContent" >
                        <Card style={{ marginBottom: "30px" }}>
                            <div className="formRow">
                                <div className="formCol">
                                    <span className="formKey  ant-form-item-required">技术类别：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <Select disabled={type == "see" ? true : false} className="formVal" value={this.state.skillTypeCode} onSelect={this.onSelect1}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        <Option value="">请选择</Option>
                                        {
                                            skillType.map((item) => {
                                                return <Option key={item.id} value={item.code}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className="formCol">
                                    <span className="formKey  ant-form-item-required">品牌：</span>
                                    <Select disabled={type == "see" ? true : false} className="formVal" value={this.state.brandCode} onSelect={this.onSelect2}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        <Option value="">请选择</Option>
                                        {
                                            !this.state.skillTypeCode ? "" : (brand.filter((item) => {
                                                return item.parentId == this.state.skillTypeId;
                                            }).map((item, index) => {
                                                return <Option key={item.id} value={item.code}>{item.name}</Option>
                                            }))
                                        }
                                    </Select>
                                </div>
                                <div className="formCol">
                                    <span className="formKey ant-form-item-required">产品线级别：</span>
                                    <Select disabled={type == "see" ? true : false} className="formVal" value={this.state.productLineLevelCode} onSelect={this.onSelect3}>
                                        <Option value="">请选择</Option>
                                        <Option value="1">高端</Option>
                                        <Option value="0">中低端</Option>
                                    </Select>
                                </div>
                            </div>
                            <div style={{ paddingLeft: "97px", marginBottom: "20px" }}>
                                {productLineDatas.length ? <Card>
                                    <Checkbox.Group disabled={type == "see" ? true : false} style={{ width: '100%' }} value={this.state.productLineCodes} onChange={this.onChange4} >
                                        <Row>
                                            {
                                                this.state.brandId && this.state.productLineLevelCode ? (productLineDatas.map((item, index) => {
                                                    return <Col span={6} key={index} >
                                                        <Tooltip title={item.name}>
                                                            <Checkbox value={item.code} style={{
                                                                width: "100%",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap"
                                                            }}>{item.name}</Checkbox>
                                                        </Tooltip>
                                                    </Col>
                                                })) : ""
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </Card> : ""}

                            </div>

                            <div className="formRow">
                                <div className="formCol">
                                    <span className="formKey ant-form-item-required">专业能力级别：</span>
                                    <Select disabled={type == "see" ? true : false} className="formVal" value={this.state.proableLevel} onSelect={this.onSelect5}>
                                        <Option value="">请选择</Option>
                                        {
                                            competenceLevel.map((item) => {
                                                return <Option key={item.strValue1} value={item.code}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className="formCol"></div>
                                <div className="formCol"></div>
                            </div>
                            {
                                !this.state.proableLevel ? "" : < div className="formRow">
                                    <div className="formCol">
                                        <span className="formKey ant-form-item-required">专业能力项：</span>
                                        {type != "see" ? <TreeParant className="formVal" treeData={filterTree(serviceClass)}
                                            expandedKeys={(() => {
                                                let arr = []
                                                filterTree(serviceClass).forEach((el) => {
                                                    arr.push(el.code)
                                                })
                                                return arr
                                            })()}
                                            checkable={true}
                                            onCheck={this.onTreeSelect6}  //点击树节点触发事件
                                            checkedKeys={this.state.serviceItemCodes}
                                        /> : <TreeParant className="formVal" treeData={filterTree2(serviceClass, 999)}
                                            expandedKeys={(() => {
                                                let arr = []
                                                filterTree2(serviceClass, 999).forEach((el) => {
                                                    arr.push(el.code)
                                                })
                                                return arr
                                            })()}
                                            checkable={true}
                                            onCheck={this.onTreeSelect6}  //点击树节点触发事件
                                            checkedKeys={this.state.serviceItemCodes}
                                            disabled
                                        />}
                                    </div>
                                </div>
                            }
                        </Card>
                        {
                            this.state.cases.map((item, key) => {
                                return <Card key={key} title="案例说明" style={{ marginBottom: "20px" }} extra={type == "see" ? <span></span> : (<span><MinusOutlined onClick={_ => this.delCase(key)} />&nbsp;&nbsp;<PlusOutlined key={key} onClick={this.addCase} /></span>)}>
                                    <div className="formRow">
                                        <div className="formCol">
                                            <span className="formKey">客户名称：</span>
                                            {
                                                type == "see" ? <Tooltip title={item.custName}>
                                                    <span>
                                                        <Input disabled className="formVal" name={key} value={item.custName} onChange={this.onChangeCase} style={{ width: "142px" }} ></Input>
                                                    </span>
                                                </Tooltip> : <Input className="formVal" name={key} value={item.custName} onChange={this.onChangeCase} style={{ width: "142px" }} ></Input>
                                            }

                                        </div>
                                        <div className="formCol">
                                            <span className="formKey"> 产品线：</span>
                                            {item.productLineCode ? <Tooltip title={
                                                productLine.map((subItem) => {
                                                    if (subItem.code == item.productLineCode) {
                                                        return subItem.name
                                                    } else {
                                                        return ""
                                                    }
                                                })
                                            }>
                                                <Select disabled={type == "see" ? true : false} className="formVal" value={item.productLineCode} key={key} onSelect={this.onSelectCase1}
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        width: "156px"
                                                    }}
                                                >
                                                    <Option ref={key} value="">请选择</Option>
                                                    {
                                                        this.state.productLineCodes.length ? (productLine.filter((subItem) => {
                                                            return this.state.productLineCodes.indexOf(subItem.code) >= 0
                                                        }).map((subItem, index) => {
                                                            return <Option ref={key} key={subItem.id} value={subItem.code}>{subItem.name}</Option>
                                                        })) : ""
                                                    }
                                                </Select>
                                            </Tooltip> : <Select disabled={type == "see" ? true : false} className="formVal" value={item.productLineCode} key={key} onSelect={this.onSelectCase1}
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    width: "156px"
                                                }}
                                            >
                                                <Option ref={key} value="">请选择</Option>
                                                {
                                                    this.state.productLineCodes.length ? (productLine.filter((subItem) => {
                                                        return this.state.productLineCodes.indexOf(subItem.code) >= 0
                                                    }).map((subItem, index) => {
                                                        return <Option ref={key} key={subItem.id} value={subItem.code}>{subItem.name}</Option>
                                                    })) : ""
                                                }
                                            </Select>}

                                        </div>
                                        <div className="formCol2">
                                            <span className="formKey"> 能力项：</span>
                                            <Cascader className="formVal" disabled={type == "see" ? true : false} allowClear={false} fieldNames={{ label: 'name', value: 'code' }} value={filterTree3(serviceClass, item)} options={filterTree2(serviceClass, key)} onChange={this.onSelectCase2} placeholder="请选择" />
                                        </div>
                                    </div>
                                    <div className="formRow">
                                        <div className="formCol">
                                            <span className="formKey">案例说明：</span>
                                            <div className="formVal">
                                                <Editor key={key} disabled={type == "see" ? true : false} name={key} value={item.caseDesc} getContent={this.getContent} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            })
                        }



                    </div>
                </div>
            </ModalParant>
        </div >

    }
}

const postArea = Form.create()(People)
export default postArea

