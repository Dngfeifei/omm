/**
 * 服务计划表--副表-服务区域（服务对象）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Icon, message, Modal } from 'antd'
const { Option } = Select;
const { confirm } = Modal;

// 引入页面CSS
// import '@/assets/less/pages/servies.less'
// 引入 API接口
import { GetBaseData } from '/api/selfEvaluation'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

// 下拉框基础数据（产品类型-skillType,产品线- productLine）
let baseData = { skillType: [], productLine: [], brand: [] }

// 产品类别下拉框数据
let productCategoryData = [];

class ObjectEl extends Component {
    // 设置默认props
    static defaultProps = {
        area:"",
        edit: true,  // 状态 是否可编辑
        dataSource: [],  //服务对象数据数据
        onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            // 基础下拉数据
            baseData: { skillType: [], productLine: [], brand: [] },
            // 当前表格数据
            dataSource: [],
            // 最新过滤后的产品线数组
            filterArr: [],
            // 当前表格配置-可编辑
            columns: [
                {
                    title: '序号',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        if (this.props.edit) {
                            return <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "-36px", top: "-12px", display: "flex", flexDirection: "column" }}>
                                    <div><Icon type="plus-square" theme="twoTone" onClick={() => this.addRow(index)} /></div>
                                    <div><Icon type="minus-circle" theme="twoTone" onClick={() => this.delRow(index)} /></div>
                                </div>
                                <div>{index + 1}</div>
                            </div>
                        } else {
                            return index + 1
                        }
                    },
                },
                {
                    title: '产品类别',
                    dataIndex: 'productCategory',
                    key: 'productCategory',
                    width: "8%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectCategory}>
                            <Option value={""} index={index}>请选择</Option>
                            {
                                productCategoryData.map((item) => {
                                    return <Option key={item.itemCode} index={index} value={item.itemCode}>{item.itemValue}</Option>
                                })
                            }
                        </Select>;
                    },
                },
                {
                    title: '技术方向',
                    dataIndex: 'productType',
                    key: 'productType',
                    width: "13%",
                    align: 'center',
                    render: (value, row, index) => {
                        let skillTypeData = [];
                        skillTypeData = baseData.skillType.filter((item) => {
                            return item.strValue4 == row.productCategory;
                        })
                        return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectType}>
                            <Option value={""} index={index}>请选择</Option>
                            {
                                baseData.skillType.length ? skillTypeData.map((item) => {
                                    return <Option key={item.id} index={index} value={item.code}>{item.name}</Option>
                                }) : ""
                            }
                        </Select>;
                    },
                },
                {
                    title: '品牌',
                    dataIndex: 'brand',
                    key: 'brand',
                    width: "10%",
                    align: 'center',
                    render: (value, row, index) => {
                        let brandData = [];
                        if (row.productType != "") {
                            let skillTypeID = ""
                            baseData.skillType.map((item) => {
                                if (item.code == row.productType) {
                                    skillTypeID = item.id
                                }
                            });
                            brandData = baseData.brand.filter((item) => {
                                return item.parentId == skillTypeID
                            })
                        }
                        return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectBrand}>
                            <Option value={""} index={index}>请选择</Option>
                            {
                                brandData.length ? brandData.map((item) => {
                                    return <Option key={item.id} index={index} value={item.code}>{item.name}</Option>
                                }) : ""
                            }
                        </Select>;
                    },
                },
                {
                    title: '产品线',
                    dataIndex: 'productLine',
                    width: "14%",
                    align: 'center',
                    render: (value, row, index) => {
                        if (row.brand && row.productLineData.length) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectProduct}>
                                <Option value={""} index={index} >请选择</Option>
                                {row.productLineData.map((item) => {
                                    return <Option key={item.id} index={index} value={item.code}>{item.name}</Option>
                                })}
                            </Select>
                        }
                        if (row.brand && !row.productLineData.length) {
                            return <Select disabled={true} style={{ width: "100%" }} value={value}>
                                <Option value={""} index={index} >请选择</Option>

                            </Select>
                        }
                        if (!row.brand) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectProduct}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>
                        }
                    },
                },
                {
                    title: '设备等级',
                    dataIndex: 'deviceLevel',
                    width: "9%",
                    align: 'center',
                    render: (value, row, index) => {
                        if (row.levels.length == 1 && row.levels[0].toString() === "1") {
                            return <span>高端</span>
                        }
                        if (row.levels.length == 1 && row.levels[0].toString() === "0") {
                            return <span>中低端</span>
                        }
                        if (row.levels.length == 2) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                                <Option value={"1"} index={index} >高端</Option>
                                <Option value={"0"} index={index} >中低端</Option>
                            </Select>;
                        }
                        if (row.brand && !row.productLineData.length) {
                            return <Select disabled={true} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>;
                        }
                        if (row.productCategory == 1) {
                            return <Select disabled={true} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>;
                        }
                        if (row.brand && row.productLineData.length && !row.productLine && row.productCategory != 1) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>;
                        }
                        if (row.productLine && row.levels.length == 0) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>;
                        }
                        if (!row.brand && row.productCategory != 1) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                            </Select>;
                        }
                    },
                },
                {
                    title: '设备数量 ',
                    dataIndex: 'deviceCount',
                    key: 'deviceCount',
                    width: "9%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangedeviceCount}></Input>;
                    },
                },
                {
                    title: '外包数量',
                    dataIndex: 'outsourceCount',
                    key: 'outsourceCount',
                    width: "9%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeoutsourceCount}></Input>;
                    },
                },
            ],
        }
    }
    // 数据即将挂载
    componentWillMount() {
        //    页面数据初始化
        this.init()
    }
    init = () => {
        // 调用下拉框基础数据接口
        this.getBaseData()
        // 获取数据字典-产品类别数据
        this.getDictInfo()
    }
    // 获取下拉框基础数据方法
    getBaseData = () => {
        // 请求下拉框基础数据
        GetBaseData().then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                let { skillType, productLine, brand } = res.data
                baseData = { skillType, productLine, brand }
                this.setState({
                    baseData
                }, () => {
                    this.initData()
                })
            }
        })
    }
    // 获取产品类别下拉框数据
    getDictInfo = () => {
        GetDictInfo({ dictCode: "productCategory" }).then(res => {
            if (res.success != 1) {
                message.error("性别下拉框资源未获取，服务器错误！")
            } else {
                productCategoryData = res.data;
            }
        })
    }
    // 组件传递数据初始化
    initData = () => {
        // 获取列表数据和是否可编辑权限
        let dataSource = Array.from(this.props.dataSource)
        let { edit } = this.props
        dataSource = this.appendElement(dataSource)
        this.setState({
            dataSource, edit
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
                deviceCount: '',
                outsourceCount: '',
                productLineData: [],
                levels: []
            }
            arr.push(newRow)
        }
        return arr

    }
    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, error: checkResult })
    }
    // 获取产品类别
    onSelectCategory = (newValue, { props }) => {
        let { dataSource } = this.state;
        let oldValue = dataSource[props.index].productCategory;
        if (newValue != oldValue) {
            dataSource[props.index].productType = ""
            dataSource[props.index].brand = ""
            dataSource[props.index].productLineData = ""
            dataSource[props.index].productLine = ""
            dataSource[props.index].productLineName = ""
            dataSource[props.index].levels = ""
            dataSource[props.index].deviceLevel = ""
        } else {
            return
        }
        dataSource[props.index].productCategory = newValue;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取技术方向
    onSelectType = (newValue, { props }) => {
        let { dataSource } = this.state;
        let oldValue = dataSource[props.index].productType;
        if (newValue != oldValue) {
            dataSource[props.index].brand = ""
            dataSource[props.index].productLineData = ""
            dataSource[props.index].productLine = ""
            dataSource[props.index].productLineName = ""
            dataSource[props.index].levels = ""
            dataSource[props.index].deviceLevel = ""
        } else {
            return
        }
        dataSource[props.index].productType = newValue;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取品牌
    onSelectBrand = (newValue, { props }) => {
        // 最新品牌数据更新
        let { dataSource } = this.state;
        let row = dataSource[props.index];
        let oldValue = dataSource[props.index].brand;
        if (newValue != oldValue) {
            dataSource[props.index].productLine = ""
            dataSource[props.index].productLineName = ""
            dataSource[props.index].levels = ""
            dataSource[props.index].deviceLevel = ""
        } else {
            return
        }
        dataSource[props.index].brand = newValue;
        // 获取最新产品线数组
        let productLineData = [];
        // 最新产品线数据更新
        if (newValue != "") {
            let brandId = ""
            baseData.brand.map((item) => {
                if (item.code == row.brand) {
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
            dataSource[props.index].productLineData = productLineData;
        }
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })


    }
    // 获取产品线
    onSelectProduct = (newValue, { props }) => {
        let { dataSource, baseData } = this.state;
        let oldValue = dataSource[props.index].productLine
        if (newValue != oldValue) {
            dataSource[props.index].productLineName = props.children
            dataSource[props.index].deviceLevel = ""

            let levels = []
            let brandId = ""
            baseData.brand.map((item) => {
                if (item.code == dataSource[props.index].brand) {
                    brandId = item.id
                }
            });
            baseData.productLine.map((item) => {
                if (item.name == props.children && item.parentId == brandId) {
                    levels.push(item.strValue1)
                }
            })
            dataSource[props.index].levels = levels
            if (levels.length == 1) {
                dataSource[props.index].deviceLevel = levels[0]
            }
        } else {
            return
        }
        dataSource[props.index].productLine = newValue;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }

    // 获取产品级别
    onSelectLevels = (newValue, { props }) => {
        // 产品级别数据更新
        let { dataSource, baseData } = this.state;
        if (newValue != "") {
            let productLineName = dataSource[props.index].productLineName;
            let current = baseData.productLine.filter((item) => {
                return item.name == productLineName && item.strValue1 == newValue
            })[0]
            dataSource[props.index].productLine = current.code;
            // 产品线数据数组更新  
            dataSource[props.index].productLineData.forEach((item, i) => {
                if (item.name == productLineName) {
                    dataSource[props.index].productLineData[i] = current
                }
            })
        }
        dataSource[props.index].deviceLevel = newValue;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 设备数量
    onChangedeviceCount = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].deviceCount = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 外包数量
    onChangeoutsourceCount = ({ target }) => {
        let key = target.name
        let val = target.value
        let dataSource = this.state.dataSource;
        dataSource[key].outsourceCount = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 新增一行
    addRow = (index) => {
        if (this.state.dataSource.length) {
            let checkResult = this.onCheck()
            if (!checkResult.state) {
                message.destroy()
                message.warning(checkResult.message)
                return
            }
        }
        let newRow = {
            productCategory: "",//产品类别
            productType: "",//技术方向
            brand: "",//品牌
            productLine: "",//产品线编码
            productLineName: "",//产品线名称
            deviceLevel: "",//产品等级（高端、中低端）
            deviceCount: '',
            outsourceCount: '',
            productLineData: [],
            levels: []
        }
        let dataSource = this.state.dataSource
        dataSource.splice(index + 1, 0, newRow)
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 删除行
    delRow = (index) => {
        let { dataSource } = this.state;
        if (dataSource.length == 1) {
            message.destroy()
            message.warning("请最少填写一条数据！")
            return
        }
        let _this = this
        confirm({
            title: '删除',
            content: '您确定要删除选中的数据吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dataSource.splice(index, 1)
                _this.setState({
                    dataSource,
                }, () => {
                    _this.updateToparent()
                })
            },
        });

    }
    // 数据校验 字段为空返回false
    onCheck = () => {
        let result = { state: true, message: "" }
        let field = ""
        let data = this.state.dataSource;
        try {
            data.forEach((el, index) => {
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
                    if (el[item] == "") {
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
                            case "deviceCount":
                                field = "设备数量"
                                break;
                            case "outsourceCount":
                                field = "外包数量"
                                break;
                            default:
                                field = ""
                        }
                        result.state = false
                        if (field) {
                            throw new Error('End Loop')
                        }
                    }
                })
            })
        } catch (e) { }
        if (!result.state) {
            result.message = "表单服务区域-" + this.props.area + "的" + field + "不能为空！"
        }
        return result
    }
    // 姓名框失去焦点
    onBlurName = ({ target }) => {
        let val = target.value;
        if (val == "" || val.length == 0) {
            message.destroy()
            message.warning("姓名为必填项，请务必填写！")
        }
    }
    // 电话框失去焦点
    onBlurTel = ({ target }) => {
        let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        let val = target.value;
        let result = reg.test(val)
        if (!result) {
            message.destroy()
            message.warning("联系电话为必填项，请务必按正确格式填写！")
        }
    }
    // 邮件框失去焦点
    onBlurEmail = ({ target }) => {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        let val = target.value;
        let result = reg.test(val)
        if (!result) {
            message.destroy()
            message.warning("邮箱为必填项，请务必按正确格式填写！")
        }
    }
    render = _ => {
        let { dataSource, columns } = this.state
        return (
            <div className="commTop">
                <div style={{ display: "flex", alignItems: "stretch" }}>
                    <div style={{ flex: 1, border: "1px solid #e8e8e8", borderRight: "0", textAlign: "center", marginRight: "-1px", position: "relative" }}>
                        <span style={{ fontSize: "15px", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>服务对象</span>
                    </div>
                    <Table bordered style={{ flex: 7 }} dataSource={dataSource} columns={columns} pagination={false} rowKey={(record, i) => i} />
                </div>
            </div>
        )
    }
}
export default ObjectEl