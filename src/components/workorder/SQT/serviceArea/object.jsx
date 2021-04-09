/**
 * 服务计划表--副表-服务区域（服务对象）
 * @author yyp
*/


import React, { Component } from 'react'
import { Input, Select, Table, Button, Radio, message, Row, Modal } from 'antd'
const { Option } = Select;
const { confirm } = Modal;

// 引入页面CSS
import '@/assets/less/pages/servies.less'
// 引入 API接口
import { GetBaseData } from '/api/selfEvaluation'
import { GetDictInfo } from '/api/dictionary'  //数据字典api
// 当前表格条数 默认为0条
let rowCount = 0;
// 下拉框基础数据（产品类型-skillType,产品线- productLine）
let baseData = { skillType: [], productLine: [], brand: [] }
// 产品类别下拉框数据
let productCategoryData = [];
class ObjectEl extends Component {
    // 设置默认props
    static defaultProps = {
        title: {},   // 当前服务区域名称
        edit: true,  // 状态 是否可编辑
        dataSource: {},  //服务对象数据数据
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
                    title: '服务区域',
                    dataIndex: 'area',
                    key: 'area',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        let content = <div dangerouslySetInnerHTML={{ __html: props.title }} ></div>
                        const obj = {
                            children: content,
                            props: {},
                        };
                        if (index === 0) {
                            obj.props.rowSpan = rowCount;
                        }
                        if (index > 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    },
                },
                {
                    title: '',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Radio value={index}></Radio>
                    },
                },
                {
                    title: '序号',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        return index + 1
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
                        if (!row.productType == "") {
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
                        if (this.state.filterArr[index] != undefined && this.state.filterArr[index].length > 0) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectProduct}>
                                <Option value={""} index={index} >请选择</Option>
                                {this.state.filterArr[index].map((item) => {
                                    return <Option key={item.id} index={index} value={item.code}>{item.name}</Option>
                                })
                                }
                            </Select>;
                        } else {
                            return ""
                        }
                    },
                },
                {
                    title: '设备等级',
                    dataIndex: 'deviceLevel',
                    width: "9%",
                    align: 'center',
                    render: (value, row, index) => {
                        // row.name==""?""
                        let brandId = ""
                        baseData.brand.map((item) => {
                            if (item.code == row.brand) {
                                brandId = item.id
                            }
                        });

                        let levels = []
                        baseData.productLine.map((item) => {
                            if (item.name == row.productLineName && item.parentId == brandId) {
                                levels.push(item.strValue1)
                            }
                        })
                        if (levels.length == 0) {
                            return ""
                        } else if (levels.length == 1) {
                            if (levels[0].toString() === "1") {
                                return "高端"
                            } else if (levels[0].toString() === "0") {
                                return "中低端"
                            }
                        } else if (levels.length >= 2) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                                <Option value={"1"} index={index} >高端</Option>
                                <Option value={"0"} index={index} >中低端</Option>
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
            // 当前表格配置-不可编辑
            columns2: [
                {
                    title: '服务区域',
                    dataIndex: 'area',
                    key: 'area',
                    width: "15%",
                    align: 'center',
                    render: (value, row, index) => {
                        let content = <div dangerouslySetInnerHTML={{ __html: props.title }} ></div>
                        const obj = {
                            children: content,
                            props: {},
                        };
                        if (index === 0) {
                            obj.props.rowSpan = rowCount;
                        }
                        if (index > 0) {
                            obj.props.rowSpan = 0;
                        }
                        return obj;
                    },
                },
                {
                    title: '序号',
                    width: "7%",
                    align: 'center',
                    render: (value, row, index) => {
                        return index + 1
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
                    width: "14%",
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
                    width: "12%",
                    align: 'center',
                    render: (value, row, index) => {
                        let brandData = [];
                        if (!row.productType == "") {
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
                        if (this.state.filterArr[index] != undefined && this.state.filterArr[index].length > 0) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectProduct}>
                                <Option value={""} index={index} >请选择</Option>
                                {this.state.filterArr[index].map((item) => {
                                    return <Option key={item.id} index={index} value={item.code}>{item.name}</Option>
                                })
                                }
                            </Select>;
                        } else {
                            return ""
                        }
                    },
                },
                {
                    title: '设备等级',
                    dataIndex: 'deviceLevel',
                    width: "10%",
                    align: 'center',
                    render: (value, row, index) => {
                        // row.name==""?""
                        let brandId = ""
                        baseData.brand.map((item) => {
                            if (item.code == row.brand) {
                                brandId = item.id
                            }
                        });

                        let levels = []
                        baseData.productLine.map((item) => {
                            if (item.name == row.productLineName && item.parentId == brandId) {
                                levels.push(item.strValue1)
                            }
                        })
                        if (levels.length == 0) {
                            return ""
                        } else if (levels.length == 1) {
                            if (levels[0].toString() === "1") {
                                return "高端"
                            } else if (levels[0].toString() === "0") {
                                return "中低端"
                            }
                        } else if (levels.length >= 2) {
                            return <Select disabled={!props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectLevels}>
                                <Option value={""} index={index} >请选择</Option>
                                <Option value={"1"} index={index} >高端</Option>
                                <Option value={"0"} index={index} >中低端</Option>
                            </Select>;
                        }
                    },
                },
                {
                    title: '设备数量 ',
                    dataIndex: 'deviceCount',
                    key: 'deviceCount',
                    width: "10%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangedeviceCount}></Input>;
                    },
                },
                {
                    title: '外包数量',
                    dataIndex: 'outsourceCount',
                    key: 'outsourceCount',
                    width: "10%",
                    align: 'center',
                    render: (value, row, index) => {
                        return <Input disabled={!props.edit} name={index} value={value} onChange={this.onChangeoutsourceCount}></Input>;
                    },
                },
            ],
            // 当前表格选中项
            current: null,
        }
    }
    // 数据即将挂载
    componentWillMount() {
        //    页面数据初始化
        this.init()
    }
    init = () => {
        // 获取列表数据和是否可编辑权限
        let dataSource = Array.from(this.props.dataSource)
        let { edit } = this.props
        rowCount = dataSource.length;
        this.setState({
            dataSource, edit
        })
        // 调用下拉框基础数据接口
        this.getBaseData()
        // 获取数据字典-产品类别数据
        GetDictInfo({ dictCode: "productCategory" }).then(res => {
            if (res.success != 1) {
                message.error("性别下拉框资源未获取，服务器错误！")
            } else {
                productCategoryData = res.data;
            }
        })
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
                })
            }
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, error: checkResult })
    }
    // 获取列表选中项
    onChangeRadio = ({ target }) => {
        this.setState({
            current: target.value
        }, () => {
            this.updateToparent()
        })
    }
    // 获取产品类别
    onSelectCategory = (val, { props }) => {
        let { dataSource, filterArr } = this.state;
        if (val == "" || dataSource[props.index].productCategory != val) {
            dataSource[props.index].productType = ""
            dataSource[props.index].productLine = ""
            dataSource[props.index].brand = ""
            dataSource[props.index].productLineName = ""
            dataSource[props.index].deviceLevel = ""
            filterArr[props.index] = []
        }

        dataSource[props.index].productCategory = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取技术方向
    onSelectType = (val, { props }) => {
        let { dataSource, filterArr } = this.state;
        if (val == "" || dataSource[props.index].productType != val) {
            dataSource[props.index].productLine = ""
            dataSource[props.index].brand = ""
            dataSource[props.index].productLineName = ""
            dataSource[props.index].deviceLevel = ""
            filterArr[props.index] = []
        }
        dataSource[props.index].productType = val;
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 获取品牌
    onSelectBrand = (val, { props }) => {
        // 最新品牌数据更新
        let { dataSource, filterArr } = this.state;
        let row = dataSource[props.index];
        if (val == "" || row.brand != val) {
            row.productLine = ""
            row.productLineName = ""
            row.deviceLevel = ""
        }
        row.brand = val;
        // 获取最新产品线数组
        let productLineData = [];
        // 最新产品线数据更新
        if (val != "") {
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
            filterArr[props.index] = productLineData;
        } else {
            filterArr[props.index] = [];
        }
        this.setState({
            dataSource,
            filterArr
        }, () => {
            this.updateToparent()
        })


    }
    // 获取产品线
    onSelectProduct = (val, { props }) => {
        let { dataSource, baseData } = this.state;
        if (dataSource[props.index].productLine == val) {
            return
        }
        if (val == "" || dataSource[props.index].productLine != val) {
            dataSource[props.index].deviceLevel = ""
        }
        if (val == "") {
            dataSource[props.index].productLineName = ""
        } else {
            dataSource[props.index].productLineName = props.children;
        }
        dataSource[props.index].productLine = val;



        let brandId = ""
        baseData.brand.map((item) => {
            if (item.code == dataSource[props.index].brand) {
                brandId = item.id
            }
        });
        let levels = []
        baseData.productLine.map((item) => {
            if (item.name == props.children && item.parentId == brandId) {
                levels.push(item.strValue1)
            }
        })
        if (levels.length == 1) {
            dataSource[props.index].deviceLevel = levels[0]
        }
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })

    }

    // 获取产品级别
    onSelectLevels = (val, { props }) => {
        // 产品级别数据更新
        let { dataSource, baseData, filterArr } = this.state;
        dataSource[props.index].deviceLevel = val;
        let productLineName = dataSource[props.index].productLineName;
        if (val != "") {
            let current = baseData.productLine.filter((item) => {
                return item.name == productLineName && item.strValue1 == val
            })
            dataSource[props.index].productLine = current[0].code;
            // 产品线数据数组更新  
            filterArr[props.index].forEach((item, i) => {
                if (item.name == productLineName) {
                    filterArr[props.index][i] = current[0]
                }
            })
        }

        this.setState({
            dataSource, filterArr
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
    addRow = () => {
        if (this.state.dataSource.length) {
            let checkResult = this.onCheck()
            if (!checkResult.state) {
                message.destroy()
                message.warning(checkResult.message)
                return
            }
        }
        let newRow = {
            area: '福建/厦门【主责区域】',
            productType: "",
            brand: "",
            productLine: '',
            deviceCount: '',
            outsourceCount: '',
        }
        let dataSource = this.state.dataSource
        dataSource.push(newRow)
        rowCount = dataSource.length
        this.setState({
            dataSource
        }, () => {
            this.updateToparent()
        })
    }
    // 删除行
    delRow = () => {
        let { current, dataSource } = this.state;
        if (current == null) {
            message.destroy()
            message.warning("请选中后再进行删除操作！")
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
                dataSource.splice(current, 1)
                _this.setState({
                    dataSource,
                    current: null
                }, () => {
                    _this.updateToparent()
                })
            },
        });

    }
    // 数据校验 字段为空返回false
    onCheck = () => {
        let result = { state: true, message: "" }
        let data = this.state.dataSource;
        data.forEach((el, index) => {
            Object.keys(el).forEach(item => {
                if (el.productCategory == 1 && item == "deviceLevel") {
                    // 1 软件 不存在设备等级  若是软件类别并且是设备等级字段 此字典不校验
                    return
                }
                if (this.state.filterArr.length) {
                    let isHas = this.state.filterArr[index] == undefined ? false : true
                    if (!isHas || !this.state.filterArr[index].length) {
                        // 如果 此分类下的产品线不存在， 产品线和设备等级字段不校验
                        if (item == "deviceLevel" || item == "productLine" || item == "productLineName") {
                            return
                        }
                    }

                }
                if (el[item] == "") {
                    result = { state: false, message: "请将服务对象信息填写完整再进行其它操作" }
                }
            })
        })
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
        let { dataSource, columns, columns2, current, edit } = this.state
        return (
            <div className="commTop">
                <div className="navTitle">服务对象</div>
                {
                    edit ? <Row gutter={24} style={{ textAlign: "right" }}>
                        <Button style={{ marginRight: "10px" }} type="primary" onClick={this.addRow}>新增一行</Button>
                        <Button style={{ marginRight: "10px" }} type="primary" onClick={this.delRow}>删除</Button>
                    </Row> : ""
                }
                <Radio.Group onChange={this.onChangeRadio} value={current} style={{ width: "100%" }}>
                    <Table bordered dataSource={dataSource} columns={edit ? columns : columns2} pagination={false} rowKey={(record, i) => i} />
                </Radio.Group>
            </div>
        )
    }
}
export default ObjectEl