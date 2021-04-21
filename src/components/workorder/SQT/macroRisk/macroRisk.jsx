/**
 * 服务计划表--副表---宏观风险 子组件
 * @author yyp
*/
import React, { Component } from 'react'
import { Checkbox, Select, Input, Icon, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

// 引入页面CSS
import '@/assets/less/components/layout.less'
// 引入 API接口
import { GetBaseData } from '/api/selfEvaluation'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

class SA extends Component {
    // 设置默认props
    static defaultProps = {
        // dataSource: {
        //     areaId: "", //区域ID
        //     area: "福建厦门",  //区域名称
        //     isMainDutyArea: 1,  //主责区域  1 是主责区域 0不是主责区域
        //     isMeetContract: "",//满足合同 1满足  0不满足
        //     isMeetSla: "",//满足SLA      1满足  0不满足
        //     slaDesc: "",//不能满足sla原因说明
        //     isTher: "",// 
        //     therDesc: "",//其他描述
        //     remark: "",//备注
        //     isCompanySupportList: [//需公司资源支持的产品数据
        //         // {
        //         //     productCategory: "",//产品类别
        //         //     productType: "",//技术方向
        //         //     brand: "",//品牌
        //         //     productLine: "",//产品线编码
        //         //     productLineName: "",//产品线名称
        //         //     deviceLevel: "",//产品等级（高端、中低端）
        //         //     productModel: "",//产品型号
        //         // }
        //     ],
        //     notCompanySupportList: [//无资源支持的产品数据
        //         // {
        //         //     productCategory: "",//产品类别
        //         //     productType: "",//技术方向
        //         //     brand: "",//品牌
        //         //     productLine: "",//产品线编码
        //         //     productLineName: "",//产品线名称
        //         //     deviceLevel: "",//产品等级（高端、中低端）
        //         //     productModel: "",//产品型号
        //         // }
        //     ],
        // },  //副表数据
        // isEdit: "",  //编辑权限
        // onChange: (data) => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            // 下拉框基础数据（技术方向,产品线,品牌，产品类别）
            baseData: { skillType: [], productLine: [], brand: [], productCategoryData: [] },
            dataSource: {
                // areaId: "", //区域ID
                // area: "福建厦门",  //区域名称
                // isMainDutyArea: 1,  //主责区域  1 是主责区域 0不是主责区域
                // isMeetContract: "",//满足合同 1满足  0不满足
                // isMeetSla: "",//满足SLA      1满足  0不满足
                // slaDesc: "",//不能满足sla原因说明
                // isTher: "",//其他 
                // therDesc: "",//其他描述
                // remark: "",//备注
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
            isEdit: props.isEdit,//页面是否可编辑
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
    // 组件传递数据初始化 基础下拉框数据请求获取之后调用此方法
    initData = () => {
        let { dataSource } = this.props
        let { isEdit } = this.state
        isEdit = this.props.isEdit
        dataSource.isCompanyChecked = dataSource.isCompanySupportList.length ? true : false
        dataSource.notCompanyChecked = dataSource.notCompanySupportList.length ? true : false
        dataSource.isCompanySupportList = this.appendElement(dataSource.isCompanySupportList)
        dataSource.notCompanySupportList = this.appendElement(dataSource.notCompanySupportList)
        this.setState({
            dataSource, isEdit
        }, () => {
            this.updateToparent()
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
                    this.initData()
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
    }
    // 复选框数据更新   
    onChangeEl = (e) => {
        let name = e.target.name
        let val = e.target.checked ? 1 : 0
        let { dataSource } = this.state
        dataSource[name] = val
        this.setState({
            dataSource,
        }, () => {
            this.updateToparent()
        })
    }
    // 产品数据新增一行
    addNewRow = (name, i) => {
        let { dataSource } = this.state
        if (!this.checkArr(dataSource[name]).state) {
            message.destroy()
            message.warning("请将列表数据填写完整后再进行新增操作")
            return
        }
        // let newRow = {
        //     productCategory: "",//产品类别
        //     productType: "",//技术方向
        //     brand: "",//品牌
        //     productLine: "",//产品线编码
        //     productLineName: "",//产品线名称
        //     deviceLevel: "",//产品等级（高端、中低端）
        //     productModel: "",//产品型号
        //     productLineData: [],
        //     levels: []
        // }
        let newRow = JSON.parse(JSON.stringify(Object.assign({}, dataSource[name][i])))
        dataSource[name].splice((i + 1), 0, newRow)
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 产品数据删除一行
    delRow = (name, i) => {
        let { dataSource } = this.state
        if (dataSource[name].length < 2) {
            message.destroy()
            message.error("不可删除，当前已勾选选项下至少填写一条相关产品数据！")
            return
        }
        dataSource[name].splice(i, 1)
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 需公司资源支持列表下拉框更新
    onSelectChange1 = (info, current) => {
        let { dataSource, baseData } = this.state
        let name = info.props.name
        let val = info.props.value
        let row = dataSource.isCompanySupportList[current];
        let oldVla = row[name]
        if (name == "productCategory" && val != oldVla) {
            dataSource.isCompanySupportList[current].productType = ""
            dataSource.isCompanySupportList[current].brand = ""
            dataSource.isCompanySupportList[current].productLineData = []
            dataSource.isCompanySupportList[current].productLine = ""
            dataSource.isCompanySupportList[current].productLineName = ""
            dataSource.isCompanySupportList[current].levels = ""
            dataSource.isCompanySupportList[current].deviceLevel = ""
        } else if (name == "productType" && val != oldVla) {
            dataSource.isCompanySupportList[current].brand = ""
            dataSource.isCompanySupportList[current].productLineData = []
            dataSource.isCompanySupportList[current].productLine = ""
            dataSource.isCompanySupportList[current].productLineName = ""
            dataSource.isCompanySupportList[current].levels = ""
            dataSource.isCompanySupportList[current].deviceLevel = ""
        } else if (name == "brand" && val != oldVla) {
            dataSource.isCompanySupportList[current].productLine = ""
            dataSource.isCompanySupportList[current].productLineName = ""
            dataSource.isCompanySupportList[current].levels = ""
            dataSource.isCompanySupportList[current].deviceLevel = ""
            // 获取最新产品线数组
            let productLineData = [];
            // 最新产品线数据更新
            if (val != "") {
                let brandId = ""
                baseData.brand.map((item) => {
                    if (item.code == val) {
                        brandId = item.id
                    }
                });
                let allProductLineData = baseData.productLine.filter((item) => {
                    return item.parentId == brandId
                })
                let obj = {};
                productLineData = allProductLineData.reduce((cur, next) => {
                    obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
                    return cur;
                }, [])
            }
            dataSource.isCompanySupportList[current].productLineData = productLineData

        } else if (name == "productLine" && val != oldVla) {
            dataSource.isCompanySupportList[current].productLineName = info.props.children
            dataSource.isCompanySupportList[current].deviceLevel = ""

            let levels = []
            let brandId = ""
            baseData.brand.map((item) => {
                if (item.code == row.brand) {
                    brandId = item.id
                }
            });
            baseData.productLine.map((item) => {
                if (item.name == info.props.children && item.parentId == brandId) {
                    levels.push(item.strValue1)
                }
            })
            dataSource.isCompanySupportList[current].levels = levels
            if (levels.length == 1) {
                dataSource.isCompanySupportList[current].deviceLevel = levels[0]
            }
        } else if (name == "deviceLevel" && val != oldVla) {
            if (val != "") {
                let currentRow = baseData.productLine.filter((item) => {
                    return item.name == row.productLineName && item.strValue1 == val
                })[0]
                row.productLine = currentRow.code;
                // 产品线数据数组更新  
                dataSource.isCompanySupportList[current].productLineData.forEach((item, i) => {
                    if (item.name == row.productLineName) {
                        dataSource.isCompanySupportList[current].productLineData[i] = currentRow
                    }
                })
            }
        } else if (val == oldVla) {
            return
        }
        dataSource.isCompanySupportList[current][name] = val
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 需公司资源支持列表输入框更新
    onInputChange1 = ({ name, value }, current) => {
        let { dataSource } = this.state
        dataSource.isCompanySupportList[current][name] = value
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 公司无资源支持列表输入框更新
    onInputChange2 = ({ name, value }, current) => {
        let { dataSource } = this.state
        dataSource.notCompanySupportList[current][name] = value
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 公司无资源支持列表下拉框更新
    onSelectChange2 = (info, current) => {
        let { dataSource, baseData } = this.state
        let name = info.props.name
        let val = info.props.value
        let row = dataSource.notCompanySupportList[current];
        let oldVla = row[name]
        if (name == "productCategory" && val != oldVla) {
            dataSource.notCompanySupportList[current].productType = ""
            dataSource.notCompanySupportList[current].brand = ""
            dataSource.notCompanySupportList[current].productLineData = []
            dataSource.notCompanySupportList[current].productLine = ""
            dataSource.notCompanySupportList[current].productLineName = ""
            dataSource.notCompanySupportList[current].levels = ""
            dataSource.notCompanySupportList[current].deviceLevel = ""
        } else if (name == "productType" && val != oldVla) {
            dataSource.notCompanySupportList[current].brand = ""
            dataSource.notCompanySupportList[current].productLineData = []
            dataSource.notCompanySupportList[current].productLine = ""
            dataSource.notCompanySupportList[current].productLineName = ""
            dataSource.notCompanySupportList[current].levels = ""
            dataSource.notCompanySupportList[current].deviceLevel = ""
        } else if (name == "brand" && val != oldVla) {
            dataSource.notCompanySupportList[current].productLine = ""
            dataSource.notCompanySupportList[current].productLineName = ""
            dataSource.notCompanySupportList[current].levels = ""
            dataSource.notCompanySupportList[current].deviceLevel = ""
            // 获取最新产品线数组
            let productLineData = [];
            // 最新产品线数据更新
            if (val != "") {
                let brandId = ""
                baseData.brand.map((item) => {
                    if (item.code == val) {
                        brandId = item.id
                    }
                });
                let allProductLineData = baseData.productLine.filter((item) => {
                    return item.parentId == brandId
                })
                let obj = {};
                productLineData = allProductLineData.reduce((cur, next) => {
                    obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
                    return cur;
                }, [])
            }
            dataSource.notCompanySupportList[current].productLineData = productLineData

        } else if (name == "productLine" && val != oldVla) {
            dataSource.notCompanySupportList[current].productLineName = info.props.children
            dataSource.notCompanySupportList[current].deviceLevel = ""

            let levels = []
            let brandId = ""
            baseData.brand.map((item) => {
                if (item.code == row.brand) {
                    brandId = item.id
                }
            });
            baseData.productLine.map((item) => {
                if (item.name == info.props.children && item.parentId == brandId) {
                    levels.push(item.strValue1)
                }
            })
            dataSource.notCompanySupportList[current].levels = levels
            if (levels.length == 1) {
                dataSource.notCompanySupportList[current].deviceLevel = levels[0]
            }
        } else if (name == "deviceLevel" && val != oldVla) {
            if (val != "") {
                let currentRow = baseData.productLine.filter((item) => {
                    return item.name == row.productLineName && item.strValue1 == val
                })[0]
                row.productLine = currentRow.code;
                // 产品线数据数组更新  
                dataSource.notCompanySupportList[current].productLineData.forEach((item, i) => {
                    if (item.name == row.productLineName) {
                        dataSource.notCompanySupportList[current].productLineData[i] = currentRow
                    }
                })
            }
        } else if (val == oldVla) {
            return
        }
        dataSource.notCompanySupportList[current][name] = val
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 表单输入框更新
    onInputChange = ({ target }) => {
        let name = target.name
        let value = target.value
        let { dataSource } = this.state
        dataSource[name] = value
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        // 1 校验相关必填数据 获取校验结果
        // 2 根据不同情况 获取不同的提交数据
        let checkResult = this.onCheck()
        let newData = this.getUpdatedData()
        this.props.onChange({ dataSource: newData, info: checkResult })
    }
    // 新增时 已有数组数据校验  若有某必填元素为空 返回false
    checkArr = (arr = []) => {
        let error = { state: true, field: "" }
        try {
            arr.forEach((el) => {
                Object.keys(el).forEach(item => {
                    // 若此条数据产品类别为软件时 设备等级字段不校验
                    if (el.productCategory == 1 && item == "deviceLevel") {
                        return
                    }
                    if (el.productCategory == 1 && item == "levels") {
                        return
                    }
                    // 若此条数据产品线数据数组为空时 产品线和设备等级字段不校验
                    if (!el.productLineData.length && item == "productLine") {
                        return
                    }
                    if (!el.productLineData.length && item == "productLineName") {
                        return
                    }
                    if (!el.productLineData.length && item == "productLineData") {
                        return
                    }
                    if (!el.productLineData.length && item == "deviceLevel") {
                        return
                    }
                    if (!el.productLineData.length && item == "levels") {
                        return
                    }
                    // 产品型号字段为非必填 不校验
                    if (item == "productModel") {
                        return
                    }
                    if (el[item] == "") {
                        let field = ""
                        switch (item) {
                            case "productCategory":
                                field = "产品类别"
                                break;
                            case "productType":
                                field = "技术方向"
                                break;
                            case "brand":
                                field = "品牌"
                                break;
                            case "productLine":
                                field = "产品线"
                                break;
                            case "deviceLevel":
                                field = "设备等级"
                                break;
                            default:
                                field = ""
                        }
                        error = { state: false, field: field }
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
    // 获取最新要提交的数据
    getUpdatedData = () => {
        let { dataSource } = this.state
        let newData = {}
        if (dataSource.isMeetContract) {
            newData.isMeetContract = dataSource.isMeetContract
        } else {
            if (dataSource.isCompanyChecked) {
                newData.isCompanySupportList = dataSource.isCompanySupportList
            }
            if (dataSource.notCompanyChecked) {
                newData.notCompanySupportList = dataSource.notCompanySupportList
            }
            if (dataSource.isMeetSla) {
                newData.isMeetSla = dataSource.isMeetSla
                newData.slaDesc = dataSource.slaDesc
            }
            if (dataSource.isTher) {
                newData.isTher = dataSource.isTher
                newData.therDesc = dataSource.therDesc
            }
        }
        newData.area = dataSource.area
        newData.isMainDutyArea = dataSource.isMainDutyArea
        newData.areaId = dataSource.areaId
        newData.remark = dataSource.remark
        return newData
    }
    // 数据校验
    onCheck = () => {
        // 1 复选框有且必须至少一条选中
        // 2 选中项 若存在相关数据 相关数据必须不为空
        // 3 列表数据若存在 列表数据相关字段校验
        let error = { state: true, message: "" }
        let { dataSource } = this.state
        if (dataSource.isMeetContract == 0 && dataSource.isTher == 0 && dataSource.isCompanyChecked == 0 && dataSource.notCompanyChecked == 0) {
            error = { state: false, message: "请勾选表单宏观风险-" + dataSource.area + "的宏观风险类型！" }
            return error
        }
        if (dataSource.isCompanyChecked) {
            let result = this.checkArr(dataSource.isCompanySupportList)
            if (!result.state) {
                error = { state: false, message: "表单宏观风险-" + dataSource.area + "的" + result.field + "不能为空！" }
                return error
            }
        }
        if (dataSource.notCompanyChecked) {
            let result = this.checkArr(dataSource.notCompanySupportList)
            if (!result.state) {
                error = { state: false, message: "表单宏观风险-" + dataSource.area + "的" + result.field + "不能为空！" }
                return error
            }
        }
        if (dataSource.isMeetSla) {
            if (dataSource.slaDesc == "") {
                error = { state: false, message: "表单宏观风险-" + dataSource.area + "的原因说明不能为空！" }
                return error
            }
        }
        if (dataSource.isTher) {
            if (dataSource.therDesc == "") {
                error = { state: false, message: "表单宏观风险-" + dataSource.area + "的描述不能为空！" }
                return error
            }
        }
        return error
    }
    render = _ => {
        let { dataSource, isEdit, baseData } = this.state
        let { isCompanyChecked, notCompanyChecked } = dataSource
        return <div className="layoutOMM">
            <div className="worksheet">
                <div className="row">
                    <div className="column">
                        <div className="val">宏观风险</div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <div style={{ width: "100%" }}>
                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={!isEdit || dataSource.isCompanyChecked || dataSource.notCompanyChecked || dataSource.isMeetSla || dataSource.isTher ? true : false} name="isMeetContract" checked={dataSource.isMeetContract ? true : false} onChange={this.onChangeEl}>区域内满足合同</Checkbox></div>
                            </div>
                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={!isEdit || dataSource.isMeetContract ? true : false} name="isCompanyChecked" checked={dataSource.isCompanyChecked ? true : false} onChange={this.onChangeEl}>需公司资源支持</Checkbox></div>
                            </div>
                            {
                                isCompanyChecked ? <div className="row">
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>产品类别</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>技术方向</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>品牌</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>产品线</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>设备等级</span></div>
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
                                            <div style={{ height: "100%", position: "absolute", left: "-20px", top: "10px" }}>
                                                <div><Icon type="plus-square" theme="twoTone" onClick={() => this.addNewRow("isCompanySupportList", i)} /></div>
                                                <div><Icon type="minus-circle" theme="twoTone" onClick={() => this.delRow("isCompanySupportList", i)} /></div>
                                            </div>
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productCategory} onSelect={(e, info) => this.onSelectChange1(info, i)}>
                                                    <Option value={""} name="productCategory">请选择</Option>
                                                    {
                                                        baseData.productCategoryData.map((item) => {
                                                            return <Option key={item.itemCode} name="productCategory" value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 技术方向 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productType} onSelect={(e, info) => this.onSelectChange1(info, i)}>
                                                    <Option value={""} name="productType">请选择</Option>
                                                    {
                                                        baseData.skillType.filter((item) => {
                                                            return item.strValue4 == el.productCategory;
                                                        }).map((item) => {
                                                            return <Option key={item.id} name="productType" value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 品牌 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.brand} onSelect={(e, info) => this.onSelectChange1(info, i)}>
                                                    <Option value={""} name="brand">请选择</Option>
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
                                                            return <Option key={item.id} name="brand" value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 产品线 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.brand && el.productLineData.length ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productLine} onSelect={(e, info) => this.onSelectChange1(info, i)}>
                                                        <Option value={""} name="productLine">请选择</Option>
                                                        {
                                                            el.productLineData.map((item) => {
                                                                return <Option key={item.id} name="productLine" value={item.code}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} name="productLine">请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} name="productLine">请选择</Option>
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
                                                        <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} onSelect={(e, info) => this.onSelectChange1(info, i)}>
                                                            <Option value={""} name="deviceLevel" >请选择</Option>
                                                            <Option value={"1"} name="deviceLevel" >高端</Option>

                                                            <Option value={"0"} name="deviceLevel" >中低端</Option>
                                                        </Select>
                                                        : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && el.productLineData.length && !el.productLine && el.productCategory != 1 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productLine && el.levels.length == 0 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand && el.productCategory != 1 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productCategory == 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 型号 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}><Input disabled={!isEdit} name="productModel" value={el.productModel} onChange={(e) => this.onInputChange1(e.target, i)} placeholder="" /></div>
                                        </div>
                                    </div>
                                }) : ""
                            }

                            <div className="row">
                                <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={!isEdit || dataSource.isMeetContract ? true : false} name="notCompanyChecked" checked={dataSource.notCompanyChecked ? true : false} onChange={this.onChangeEl}>公司暂无资源支持能力</Checkbox></div>
                            </div>
                            {
                                notCompanyChecked ? <div className="row">
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>产品类别</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>技术方向</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>品牌</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>产品线</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val"><span className={isEdit ? "ant-form-item-required" : ""}>设备等级</span></div>
                                    </div>
                                    <div className="column">
                                        <div className="val">型号</div>
                                    </div>
                                </div> : ""
                            }
                            {
                                notCompanyChecked ? dataSource.notCompanySupportList.map((el, i) => {
                                    return <div className="row" key={i}>
                                        {/* 产品类别 */}
                                        <div className="column" style={{ position: "relative" }}>
                                            <div style={{ height: "100%", position: "absolute", left: "-20px", top: "10px" }}>
                                                <div><Icon type="plus-square" theme="twoTone" onClick={() => this.addNewRow("notCompanySupportList", i)} /></div>
                                                <div><Icon type="minus-circle" theme="twoTone" onClick={() => this.delRow("notCompanySupportList", i)} /></div>
                                            </div>
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productCategory} onSelect={(e, info) => this.onSelectChange2(info, i)}>
                                                    <Option value={""} name="productCategory">请选择</Option>
                                                    {
                                                        baseData.productCategoryData.map((item) => {
                                                            return <Option key={item.itemCode} name="productCategory" value={item.itemCode}>{item.itemValue}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 技术方向 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productType} onSelect={(e, info) => this.onSelectChange2(info, i)}>
                                                    <Option value={""} name="productType">请选择</Option>
                                                    {
                                                        baseData.skillType.filter((item) => {
                                                            return item.strValue4 == el.productCategory;
                                                        }).map((item) => {
                                                            return <Option key={item.id} name="productType" value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 品牌 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                <Select disabled={!isEdit} style={{ width: "100%" }} value={el.brand} onSelect={(e, info) => this.onSelectChange2(info, i)}>
                                                    <Option value={""} name="brand">请选择</Option>
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
                                                            return <Option key={item.id} name="brand" value={item.code}>{item.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/* 产品线 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}>
                                                {
                                                    el.brand && el.productLineData.length ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productLine} onSelect={(e, info) => this.onSelectChange2(info, i)}>
                                                        <Option value={""} name="productLine">请选择</Option>
                                                        {
                                                            el.productLineData.map((item) => {
                                                                return <Option key={item.id} name="productLine" value={item.code}>{item.name}</Option>
                                                            })
                                                        }
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} name="productLine">请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.productLine}>
                                                        <Option value={""} name="productLine">请选择</Option>
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
                                                        <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} onSelect={(e, info) => this.onSelectChange2(info, i)}>
                                                            <Option value={""} name="deviceLevel" >请选择</Option>
                                                            <Option value={"1"} name="deviceLevel" >高端</Option>

                                                            <Option value={"0"} name="deviceLevel" >中低端</Option>
                                                        </Select>
                                                        : ""
                                                }
                                                {
                                                    el.brand && !el.productLineData.length ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.brand && el.productLineData.length && !el.productLine && el.productCategory != 1 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productLine && el.levels.length == 0 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    !el.brand && el.productCategory != 1 ? <Select disabled={!isEdit} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                                {
                                                    el.productCategory == 1 ? <Select disabled={true} style={{ width: "100%" }} value={el.deviceLevel} >
                                                        <Option value={""} name="deviceLevel" >请选择</Option>
                                                    </Select> : ""
                                                }
                                            </div>
                                        </div>
                                        {/* 型号 */}
                                        <div className="column">
                                            <div className="val" style={{ padding: "10px" }}><Input disabled={!isEdit} name="productModel" value={el.productModel} onChange={(e) => this.onInputChange2(e.target, i)} placeholder="" /></div>
                                        </div>
                                    </div>
                                }) : ""
                            }
                            <div className="row">
                                <div className="column">
                                    <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={!isEdit || dataSource.isMeetContract ? true : false} name="isMeetSla" checked={dataSource.isMeetSla ? true : false} onChange={this.onChangeEl}>SLA不能满足</Checkbox></div>
                                </div>
                                <div className="column column4">
                                    <div className="val alignLeft" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
                                        <div className={isEdit && dataSource.isMeetSla ? "ant-form-item-required" : ""} style={{ minWidth: "88px" }}>原因说明：</div>
                                        <TextArea disabled={!isEdit || dataSource.isMeetContract || !dataSource.isMeetSla ? true : false} style={{ flex: "auto" }} name="slaDesc" value={dataSource.slaDesc} autoSize onChange={this.onInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <div className="val alignLeft" style={{ padding: "0 10px" }}><Checkbox disabled={!isEdit || dataSource.isMeetContract ? true : false} name="isTher" checked={dataSource.isTher ? true : false} onChange={this.onChangeEl}>其他</Checkbox></div>
                                </div>
                                <div className="column column4">
                                    <div className="val alignLeft" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
                                        <div className={isEdit && dataSource.isTher ? "ant-form-item-required" : ""} style={{ minWidth: "88px" }}>描述：</div>
                                        <TextArea disabled={!isEdit || dataSource.isMeetContract || !dataSource.isTher ? true : false} style={{ flex: "auto" }} name="therDesc" value={dataSource.therDesc} autoSize onChange={this.onInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column" >
                        <div className="val alignLeft" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
                            <div className={isEdit && dataSource.isTher ? "ant-form-item-required" : ""} style={{ minWidth: "88px" }}>备注：</div>
                            <TextArea disabled={!isEdit ? true : false} name="remark" value={dataSource.remark} autoSize onChange={this.onInputChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
export default SA