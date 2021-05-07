/**
 * 服务计划表--副表---宏观风险
 * @author yyp
*/
import React, { Component } from 'react'
import { Checkbox, Select, Input, Icon, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

//引入宏观风险子组件
import MacroRisk from '/components/workorder/SQT/macroRisk/macroRisk.jsx'

// 引入页面CSS
import '@/assets/less/pages/servies.less'

// 引入 API接口
import { getMacroRisk } from '/api/serviceMain.js'

class SA extends Component {
    // 设置默认props
    static defaultProps = {
        // id: "",
        // power: {
        //     id: "",
        //     formRead: 1,
        //     formControl: {
        //         macroRisk: { isEdit: true }
        //     }
        // },  //编辑权限
        // onChange: (data) => { console.log(data, "result") } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [
                // {
                //     areaId: "", //区域ID
                //     area: "河北厦门",  //区域名称
                //     isMainDutyArea: 1,  //主责区域  1 是主责区域 0不是主责区域
                //     isMeetContract: "",//满足合同 1满足  0不满足
                //     isMeetSla: "",//满足SLA      1满足  0不满足
                //     slaDesc: "",//不能满足sla原因说明
                //     isTher: "",//其他 
                //     therDesc: "",//其他描述
                //     remark: "",//备注
                //     isCompanySupportList: [//需公司资源支持的产品数据
                //         // {
                //         //     isCompanySupport: "",//1:需要公司支持/0公司暂无资源支持能力
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
                //         //     isCompanySupport: "",//1:需要公司支持/0公司暂无资源支持能力
                //         //     productCategory: "",//产品类别
                //         //     productType: "",//技术方向
                //         //     brand: "",//品牌
                //         //     productLine: "",//产品线编码
                //         //     productLineName: "",//产品线名称
                //         //     deviceLevel: "",//产品等级（高端、中低端）
                //         //     productModel: "",//产品型号
                //         // }
                //     ]
                // }
            ],
            isEdit: "",
            error: []
        }
    }

    componentWillMount() {
        this.init()
    }
    // 页面数据初始化
    init = () => {
        this.getPower()
        this.getMacroRiskData()
    }
    // 获取界面编辑权限
    getPower = () => {
        let { power } = this.props
        let { isEdit } = this.state
        // 页面模块只读逻辑
        if (power.formRead == 1) {
            // 若为1 根据权限配置判断是否只读
            isEdit = power.formControl.macroRisk.isEdit
        } else {
            // 若为2 所有只读
            isEdit = false
        }
        this.setState({
            isEdit
        })
    }
    // 请求宏观风险数据
    getMacroRiskData = () => {
        // 请求下拉框基础数据
        getMacroRisk({baseId:this.props.power.id}).then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.setState({
                    dataSource: res.data
                })
            }
        })
    }

    // 宏观风险子组件数据更新   
    onChangeList = (info, index) => {
        let { dataSource, error } = this.state
        error[index] = info.info
        dataSource[index] = info.dataSource
        this.setState({
            dataSource, error
        }, () => {
            this.updateToparent()
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        // 1 校验相关必填数据 获取校验结果
        // 2 根据不同情况 获取不同的提交数据
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, info: checkResult })
    }


    // 数据校验
    onCheck = () => {
        // 1 复选框有且必须至少一条选中
        // 2 选中项 若存在相关数据 相关数据必须不为空
        // 3 列表数据若存在 列表数据相关字段校验
        let { error } = this.state
        let newError = { state: true, message: "" }
        error.forEach((item) => {
            if (!newError.state) { return }
            newError = { state: item.state, message: item.message }
        })
        return newError
    }
    render = _ => {
        let { dataSource, isEdit } = this.state
        return <div className="ServiesContent">
            {
                dataSource.map((item, index) => {
                    return <div className="commTop" key={index}>
                        <div className="navTitle" style={{ float: "none" }}>
                            {item.area}
                            {item.isMainDutyArea ? <span style={{ color: "red" }}>【主责区域】</span> : ""}

                        </div>
                        <div>
                            <MacroRisk isEdit={isEdit} dataSource={item} onChange={(info) => this.onChangeList(info, index)}></MacroRisk>
                        </div>
                    </div>
                })
            }
        </div>
    }
}
export default SA