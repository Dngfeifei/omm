/**
 * 服务计划表--副表---宏观风险
 * @author yyp
*/
import React, { Component } from 'react'
import { Checkbox, Select, Input, Icon, message, DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
import { UserOutlined } from '@ant-design/icons';

import moment from 'moment';

// 引入工程师选择器组件
import Selector from '/components/selector/engineerSelector.jsx'

// 引入页面CSS
import '@/assets/less/components/layout.less'
// 引入 API接口
import { GetBaseData } from '/api/selfEvaluation'
import { GetDictInfo } from '/api/dictionary'  //数据字典api
import { getMacroRiskSum } from '/api/serviceMain.js'


class SA extends Component {
    // 设置默认props
    static defaultProps = {
        // dataSource: {
        //     isMeetContract: "",//满足合同 1满足  0不满足
        //     isMeetSla: "",//满足SLA      1满足  0不满足
        //     slaDesc: [
        //         {
        //             area: "河北/石家庄",
        //             info: "河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州"
        //         }
        //     ],//不能满足sla原因说明
        //     isTher: "",// 
        //     therDesc: [
        //         {
        //             area: "河北/石家庄",
        //             info: "河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州"
        //         }
        //     ],//其他描述
        //     remark: [
        //         {
        //             area: "河北/石家庄",
        //             info: "河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州河南郑州"
        //         },
        //     ],//备注
        //     isCompanySupportList: [
        //         {
        //             "productCategory": "2",
        //             "productType": "02",
        //             "brand": "060",
        //             "productLine": "",
        //             "productLineName": "",
        //             "deviceLevel": "",
        //             "productModel": "555",
        //             "productLineData": [],
        //             "levels": ""
        //         }
        //     ],
        //     notCompanySupportList: [
        //         {
        //             "productCategory": "1",
        //             "productType": "12",
        //             "brand": "079",
        //             "productLine": "0514",
        //             "productLineName": "TSM",
        //             "deviceLevel": "",
        //             "productModel": "999",
        //             researchStartTime: "",
        //             researchEndTime: "",
        //             "productLineData": [
        //                 {
        //                     "basedataTypeCode": "productLine",
        //                     "basedataTypeName": "产品线",
        //                     "children": "",
        //                     "code": "0514",
        //                     "id": "893",
        //                     "intValue1": "",
        //                     "name": "TSM",
        //                     "parentId": "885",
        //                     "strValue1": "",
        //                     "strValue2": "",
        //                     "strValue3": "",
        //                     "strValue4": ""
        //                 }
        //             ],
        //             "levels": [
        //                 ""
        //             ]
        //         },
        //         {
        //             "productCategory": "1",
        //             "productType": "12",
        //             "brand": "079",
        //             "productLine": "0514",
        //             "productLineName": "TSM",
        //             "deviceLevel": "",
        //             "productModel": "999",
        //             researchStartTime: "",
        //             researchEndTime: "",
        //             "productLineData": [
        //                 {
        //                     "basedataTypeCode": "productLine",
        //                     "basedataTypeName": "产品线",
        //                     "children": "",
        //                     "code": "0514",
        //                     "id": "893",
        //                     "intValue1": "",
        //                     "name": "TSM",
        //                     "parentId": "885",
        //                     "strValue1": "",
        //                     "strValue2": "",
        //                     "strValue3": "",
        //                     "strValue4": ""
        //                 }
        //             ],
        //             "levels": [
        //                 ""
        //             ]
        //         }
        //     ],
        //     "areaId": "",
        // },  //副表数据
        // power: {
        //     id: "",
        //     formRead: 1,
        //     formControl: {
        //         macroRiskSummary: { isEdit: true }
        //     }
        // },  //编辑权限
        // onChange: (data) => { console.log(data) } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            // 下拉框基础数据（技术方向,产品线,品牌，产品类别）
            baseData: { skillType: [], productLine: [], brand: [], productCategoryData: [], researchStatus: [], researchLevel: [] },
            dataSource: {
                // isMeetContract: "",//满足合同 1满足  0不满足
                // isMeetSla: "",//满足SLA      1满足  0不满足
                // slaDesc: [],//不能满足sla原因说明
                // isTher: "",//其他 
                // therDesc: [],//其他描述
                // remark: [],//备注
                // isCompanySupportList: [//需公司资源支持的产品数据
                //     {
                //         isCompanySupport: "",//1:需要公司支持/0公司暂无资源支持能力
                //         productCategory: "",//产品类别
                //         productType: "",//技术方向
                //         brand: "",//品牌
                //         productLine: "",//产品线编码
                //         productLineName: "",//产品线名称
                //         deviceLevel: "",//产品等级（高端、中低端）
                //         productModel: "",//产品型号
                //     }
                // ],
                // notCompanySupportList: [//无资源支持的产品数据
                //     {
                //         isCompanySupport: "",//1:需要公司支持/0公司暂无资源支持能力
                //         productCategory: "",//产品类别
                //         productType: "",//技术方向
                //         brand: "",//品牌
                //         productLine: "",//产品线编码
                //         productLineName: "",//产品线名称
                //         deviceLevel: "",//产品等级（高端、中低端）
                //         productModel: "",//产品型号
                //     }
                // ],
                // isCompanyChecked: false,//需公司资源支持
                // notCompanyChecked: false,//需公司资源支持
            },
            isEdit: true,//页面是否可编辑
            // 工程师选择器配置
            selector: {
                visible: false,
            },
            // 待提交数据
            submitData: []
        }
    }
    componentWillMount() {
        this.init()
    }
    // 页面数据初始化
    init = () => {
        this.getBaseData()
        this.getDictInfo()
    }

    // 请求宏观风险数据
    getMacroRiskData = () => {
        // 请求下拉框基础数据
        getMacroRiskSum({ baseId: this.props.power.id }).then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.setState({
                    dataSource: res.data
                }, () => {
                    this.initData()
                })
            }
        })
    }
    // 请求下拉框基础数据方法
    getBaseData = () => {
        // 请求下拉框基础数据
        GetBaseData().then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                let { skillType, productLine, brand } = res.data
                let baseData = Object.assign({}, this.state.baseData, { skillType, productLine, brand })
                this.setState({
                    baseData
                }, () => {
                    this.getMacroRiskData()
                })
            }
        })
    }
    // 获取数据字典-产品类别数据
    getDictInfo = () => {
        GetDictInfo({ dictCode: "productCategory" }).then(res => {
            if (res.success != 1) {
                message.error("产品类别下拉框资源未获取，服务器错误！")
            } else {
                let productCategoryData = res.data;
                let baseData = Object.assign({}, this.state.baseData, { productCategoryData })
                this.setState({
                    baseData
                })
            }
        })
        GetDictInfo({ dictCode: "researchStatus" }).then(res => {
            if (res.success != 1) {
                message.error("产品类别下拉框资源未获取，服务器错误！")
            } else {
                let researchStatus = res.data;
                let baseData = Object.assign({}, this.state.baseData, { researchStatus })
                this.setState({
                    baseData
                })
            }
        })
        GetDictInfo({ dictCode: "researchLevel" }).then(res => {
            if (res.success != 1) {
                message.error("产品类别下拉框资源未获取，服务器错误！")
            } else {
                let researchLevel = res.data;
                let baseData = Object.assign({}, this.state.baseData, { researchLevel })
                this.setState({
                    baseData
                })
            }
        })
    }
    // 组件传递数据初始化 基础下拉框数据请求获取之后调用此方法
    initData = () => {
        let { dataSource, power } = this.props
        let { isEdit } = this.state
        // 页面模块只读逻辑
        if (power.formRead == 1) {
            // 若为1 根据权限配置判断是否只读
            isEdit = power.formControl.macroRiskSummary.isEdit
        } else {
            // 若为2 所有只读
            isEdit = false
        }
        dataSource.isCompanyChecked = dataSource.isCompanySupportList.length ? true : false
        dataSource.notCompanyChecked = dataSource.notCompanySupportList.length ? true : false
        dataSource.isCompanySupportList = this.appendElement(dataSource.isCompanySupportList)
        dataSource.notCompanySupportList = this.appendElement(dataSource.notCompanySupportList)
        dataSource.notCompanySupportList.forEach(({ id, researchStatus, researchLevel, researchPersonId, researchPerson, researchStartTime, researchEndTime }) => {
            this.state.submitData.push({ id, researchStatus, researchLevel, researchPersonId, researchPerson, researchStartTime, researchEndTime })
        })
        this.setState({
            dataSource, isEdit
        }, () => {
        })
    }
    // 列表数据追加属性productLineData、levels
    appendElement = (arr = []) => {
        let { baseData } = this.state
        if (arr.length) {
            arr.map((arrItem, i) => {
                // 1 判断产品类别 软件无设备等级
                //                硬件产品线可能不存在 设备等级随产品线有无

                // 当前类别下产品线数组
                let productLineData = [];
                // 当前产品级别数据
                let levels = []
                // 数据更新追加
                if (arrItem.brand != "") {
                    let brandId = ""
                    baseData.brand.map((item) => {
                        if (item.code == arrItem.brand) {
                            brandId = item.id
                        }
                    });
                    let allProductLineData = baseData.productLine.filter((item) => {
                        return item.parentId == brandId
                    })
                    if (allProductLineData.length) {
                        let obj = {};
                        productLineData = allProductLineData.reduce((cur, next) => {
                            if (next.name == arrItem.productLineName && next.code != arrItem.productLine) {
                                return cur
                            }
                            obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
                            return cur;
                        }, [])
                    }
                    baseData.productLine.map((item) => {
                        if (item.name == arrItem.productLineName && item.parentId == brandId) {
                            levels.push(item.strValue1)
                        }
                    })

                }
                arrItem.productLineData = productLineData
                arrItem.levels = levels
            })
        } else {
            // 列表数据为0条时  默认增加一条空数据
            let newRow = {
                productCategory: "",//产品类别
                productType: "",//技术方向
                brand: "",//品牌
                productLine: "",//产品线编码
                productLineName: "",//产品线名称
                deviceLevel: "",//产品等级（高端、中低端）
                productModel: "",//产品型号
                productLineData: [],
                levels: []
            }
            arr.push(newRow)
        }
        return arr

    }
    // 列表下拉框更新
    onSelectChange = (info, current) => {
        let { dataSource, submitData } = this.state
        let row = dataSource.notCompanySupportList[current];
        let oldVla = row[name]
        let name = info.props.name
        let val = info.props.value
        if (oldVla == val) {
            return
        }
        dataSource.notCompanySupportList[current][name] = val
        submitData[current][name] = val
        this.setState({
            dataSource, submitData
        }, () => {
            this.updateToparent()
        })
    }
    // 获取研发时间
    onGetDate = (date, current) => {
        let { dataSource, submitData } = this.state
        dataSource.notCompanySupportList[current].researchStartTime = date[0]
        dataSource.notCompanySupportList[current].researchEndTime = date[1]

        submitData[current].researchStartTime = date[0]
        submitData[current].researchEndTime = date[1]
        this.setState({
            dataSource, submitData
        }, () => {
            this.updateToparent()
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        // 1 校验相关必填数据 获取校验结果
        let checkResult = this.onCheck()
        let newData = this.getNewData()
        this.props.onChange({ dataSource: newData, info: checkResult })
    }
    // 数据校验
    onCheck = () => {
        //数据相关字段校验 所有字段均不可为空
        let error = { state: true, message: "" }
        let { submitData } = this.state
        try {
            submitData.forEach((el) => {
                if (el.researchStatus == "2") {
                    // el.researchLevel = ""
                    // el.researchPerson = ""
                    // el.researchPersonId = ""
                    // el.researchStartTime = ""
                    // el.researchEndTime = ""
                    return
                }
                Object.keys(el).forEach(item => {
                    // 产品型号字段为非必填 不校验
                    if (item == "id" || item == "researchPersonId") {
                        return
                    }

                    if (el[item] == "" || el[item] == undefined) {
                        let field = ""
                        console.log(item)
                        switch (item) {
                            case "researchStatus":
                                field = "状态"
                                break;
                            case "researchLevel":
                                field = "研发程度"
                                break;
                            case "researchPerson":
                                field = "研发人员"
                                break;
                            case "researchStartTime":
                                field = "研发时间"
                                break;
                            case "researchEndTime":
                                field = "研发时间"
                                break;
                            default:
                                field = ""
                        }
                        error = { state: false, message: "表单宏观风险汇总的" + field + "不能为空" }
                        if (field) {
                            throw new Error('End Loop')
                        }
                    }
                })
            })
        } catch (e) {
        }
        return error
    }
    // 获取最新提交数据
    getNewData = () => {
        let { submitData } = this.state
        submitData.forEach((el) => {
            if (el.researchStatus == "2") {
                el.researchLevel = ""
                el.researchPerson = ""
                el.researchPersonId = ""
                el.researchStartTime = ""
                el.researchEndTime = ""
            }
        })
        return submitData
    }
    // 选择工程师
    getUserInfo = (index) => {
        this.setState({
            rowKey: index,
            selector: {
                visible: true,
            }
        })
    }
    // 工程师选择器确定方法
    onSelectorOK = (selectedKeys, selectedInfo) => {
        let { id, realName } = selectedInfo[0];
        let { dataSource, rowKey, submitData } = this.state;
        dataSource.notCompanySupportList[rowKey].researchPersonId = id;
        dataSource.notCompanySupportList[rowKey].researchPerson = realName;

        submitData[rowKey].researchPersonId = id
        submitData[rowKey].researchPerson = realName;
        this.setState({
            dataSource, submitData
        }, () => {
            this.updateToparent()
        })
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
        let { dataSource, isEdit, baseData } = this.state
        let { isCompanyChecked, notCompanyChecked } = dataSource
        return <div className="layoutOMM">
            <div className="worksheet">
                <div className="row">
                    <div className="column ">
                        <div className="val">宏观风险汇总表</div>
                    </div>
                </div>
                <div className="row">

                    <div className="column ">
                        <div style={{ width: "100%" }}>
                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={true} checked={dataSource.isMeetContract ? true : false}>区域内满足合同</Checkbox></div>
                            </div>
                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={true} checked={dataSource.isCompanyChecked ? true : false}>需公司资源支持</Checkbox></div>
                            </div>
                            {
                                isCompanyChecked ? <div className="row">
                                    <div className="column">
                                        <div className="val"><span>产品类别</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>技术方向</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>品牌</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>产品线</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>设备等级</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val">型号</div>
                                    </div>
                                </div> : ""
                            }
                            {
                                isCompanyChecked ? dataSource.isCompanySupportList.map((el, i) => {
                                    return <div className="row" key={i}>
                                        {/* 产品类别 */}
                                        <div className="column" style={{ position: "relative" }}>
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.productCategory}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.productCategoryData.map((item) => {
                                                            return <Option key={item.itemCode} value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 技术方向 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.productType}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.skillType.filter((item) => {
                                                            return item.strValue4 == el.productCategory;
                                                        }).map((item) => {
                                                            return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 品牌 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.brand}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.brand.filter((item) => {
                                                            let skillTypeID = ""
                                                            baseData.skillType.map((item) => {
                                                                if (item.code == el.productType) {
                                                                    skillTypeID = item.id
                                                                }
                                                            });
                                                            return item.parentId == skillTypeID
                                                        }).map((item) => {
                                                            return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 产品线 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.brand && el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                        {
                                                            el.productLineData.map((item) => {
                                                                return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 设备等级 */}
                                        <div className="column" style={{ justifyContent: "center" }}>
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.levels.length == 1 && el.levels[0].toString() === "1" ? <span>高端</span> : ""
                                                }
                                                {
                                                    el.levels.length == 1 && el.levels[0].toString() === "0" ? <span>中低端</span> : ""
                                                }
                                                {
                                                    el.levels.length == 2 ?
                                                        <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel}>
                                                            <Option value={""}  >请选择</Option>
                                                            <Option value={"1"}  >高端</Option>

                                                            <Option value={"0"}  >中低端</Option>
                                                        </Select>
                                                        : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && el.productLineData.length && !el.productLine && el.productCategory != 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productLine && el.levels.length == 0 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand && el.productCategory != 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productCategory == 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 型号 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}><Input disabled={true} value={el.productModel} /></div>
                                        </div>
                                    </div>
                                }) : ""
                            }

                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={true} checked={dataSource.notCompanyChecked ? true : false}>公司暂无资源支持能力</Checkbox></div>
                            </div>
                            {
                                notCompanyChecked ? <div className="row">
                                    <div className="column">
                                        <div className="val"><span>产品类别</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>技术方向</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>品牌</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>产品线</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span>设备等级</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val">型号</div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>状态</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>研发程度</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>研发人员</span></div>
                                    </div>
                                    <div className="column2">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>研发时间</span></div>
                                    </div>
                                </div> : ""
                            }
                            {
                                notCompanyChecked ? dataSource.notCompanySupportList.map((el, i) => {
                                    return <div className="row" key={i}>
                                        {/* 产品类别 */}
                                        <div className="column" style={{ position: "relative" }}>
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.productCategory}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.productCategoryData.map((item) => {
                                                            return <Option key={item.itemCode} value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 技术方向 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.productType}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.skillType.filter((item) => {
                                                            return item.strValue4 == el.productCategory;
                                                        }).map((item) => {
                                                            return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 品牌 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={true} style={{ width: "100%" }} value={el.brand}>
                                                    <Option value={""} >请选择</Option>
                                                    {
                                                        baseData.brand.filter((item) => {
                                                            let skillTypeID = ""
                                                            baseData.skillType.map((item) => {
                                                                if (item.code == el.productType) {
                                                                    skillTypeID = item.id
                                                                }
                                                            });
                                                            return item.parentId == skillTypeID
                                                        }).map((item) => {
                                                            return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 产品线 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.brand && el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                        {
                                                            el.productLineData.map((item) => {
                                                                return <Option key={item.id} value={item.code}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 设备等级 */}
                                        <div className="column" style={{ justifyContent: "center" }}>
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.levels.length == 1 && el.levels[0].toString() === "1" ? <span>高端</span> : ""
                                                }
                                                {
                                                    el.levels.length == 1 && el.levels[0].toString() === "0" ? <span>中低端</span> : ""
                                                }
                                                {
                                                    el.levels.length == 2 ?
                                                        <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel}>
                                                            <Option value={""}  >请选择</Option>
                                                            <Option value={"1"}  >高端</Option>

                                                            <Option value={"0"}  >中低端</Option>
                                                        </Select>
                                                        : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && el.productLineData.length && !el.productLine && el.productCategory != 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productLine && el.levels.length == 0 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand && el.productCategory != 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productCategory == 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""}  >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 型号 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}><Input disabled={true} value={el.productModel} /></div>
                                        </div>
                                        {/* 状态 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit ? true : false} style={{ width: "100%" }} value={el.researchStatus} onSelect={(keys, info) => this.onSelectChange(info, i)}>
                                                    <Option name="researchStatus" value={""} >请选择</Option>
                                                    {
                                                        baseData.researchStatus.map((item) => {
                                                            return <Option key={item.itemCode} name="researchStatus" value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 研发程度 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit || el.researchStatus == 2 ? true : false} style={{ width: "100%" }} value={el.researchStatus == 2 ? "" : el.researchLevel} onSelect={(keys, info) => this.onSelectChange(info, i)}>
                                                    <Option name="researchLevel" value={""} >请选择</Option>
                                                    {
                                                        baseData.researchLevel.map((item) => {
                                                            return <Option key={item.itemCode} name="researchLevel" value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 研发人员 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px", lineHeight: "0" }} >
                                                <div onClick={_ => { isEdit && el.researchStatus != 2 ? this.getUserInfo(i) : "" }}><Input disabled placeholder="" value={el.researchStatus == 2 ? "" : el.researchPerson} addonAfter={isEdit && el.researchStatus != 2 ? <UserOutlined /> : ""} /></div>
                                            </div>
                                        </div>
                                        {/* 研发时间 */}
                                        <div className="column2">
                                            {/* <div className="val" style={{ padding: "10px" }}><Input disabled={!isEdit ? true : false} value={el.productModel} /></div> */}
                                            <div className="val" style={{ padding: "10px" }}>
                                                <RangePicker disabled={!isEdit || el.researchStatus == 2 ? true : false} style={{ padding: "10px", textAlign: "left" }} value={el.researchStartTime && el.researchEndTime && el.researchStatus != 2 ? [moment(el.researchStartTime, 'YYYY-MM-DD'), moment(el.researchEndTime, 'YYYY-MM-DD')] : ""} onChange={(date, dateStr) => { this.onGetDate(dateStr, i) }} />
                                            </div>
                                        </div>
                                    </div>
                                }) : ""
                            }
                            <div className="row">
                                <div className="column">
                                    <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={true} checked={dataSource.isMeetSla ? true : false}>SLA不能满足</Checkbox></div>
                                </div>
                                <div className="column column4">
                                    {/* <div className="val alignLeft" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
                                        <div style={{ minWidth: "80px" }}>原因说明：</div>
                                        <TextArea disabled={true} style={{ flex: "auto" }} value={dataSource.slaDesc} autoSize />
                                    </div> */}
                                    <div>
                                        {
                                            dataSource.slaDesc.map((item, i) => {
                                                return <div className="val alignLeft" key={i} style={{ padding: "0 10px", display: "flex", lineHeight: "30px", minHeight: 0 }}>
                                                    <div style={{ minWidth: "172px" }}>[{item.area}]原因说明：</div>
                                                    <div style={{ flex: "auto" }}>{item.info}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={true} checked={dataSource.isTher ? true : false}>其他</Checkbox></div>
                                </div>
                                <div className="column column4">
                                    <div>
                                        {
                                            dataSource.therDesc.map((item, i) => {
                                                return <div className="val alignLeft" key={i} style={{ padding: "0 10px", display: "flex", lineHeight: "30px", minHeight: 0 }}>
                                                    <div style={{ minWidth: "140px" }}>[{item.area}]描述：</div>
                                                    <div style={{ flex: "auto" }}>{item.info}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column" >
                        <div className="val alignLeft" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
                            <div>{
                                dataSource.remark.map((item, i) => {
                                    return <div className="val alignLeft" key={i} style={{ padding: "0 10px", display: "flex", lineHeight: "30px", minHeight: 0 }}>
                                        <div style={{ minWidth: "140px" }}>[{item.area}]备注：</div>
                                        <div style={{ flex: "auto" }}>{item.info}</div>
                                    </div>
                                })
                            }
                            </div>
                            {/* <div style={{ minWidth: "80px" }}>备注：</div>
                            <TextArea disabled={true} value={dataSource.remark} autoSize /> */}
                        </div>

                    </div>
                </div>
                {
                    this.state.selector.visible ? <Selector
                        onOk={this.onSelectorOK}
                        onCancel={this.onSelectorCancel} /> : ""
                }
            </div>
        </div >
    }
}
export default SA