/**
 * 服务计划表--副表---宏观风险
 * @author yyp
*/
import React, { Component } from 'react'
import { message } from 'antd';


//引入宏观风险子组件
import ReservationService from '@/components/workorder/SQT/reservationService/reservationService.jsx'

// 引入页面CSS
import '@/assets/less/pages/servies.less'

// 引入 API接口
import { GetAppointment } from '/api/serviceMain.js'

class ReservationServiceList extends Component {
    // 设置默认props
    static defaultProps = {
        power: {
            id: "12",
            formRead: 1,
            formControl: {
                reservationService: { isEdit: true }
            }
        },  //编辑权限
        onChange: (data) => { console.log(data, "result") } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [
                // {
                //     areaId: "", //区域ID
                //     area: "河北厦门",  //区域名称
                //     isMainDutyArea: 1,  //主责区域  1 是主责区域 0不是主责区域
                //     startDate: "2017-12-30",
                //     list: [
                //         {
                //             serviceTime: "2021-02-08  10:49",
                //             userId: "realName",
                //             userName: "realName",
                //             mobilePhone: "mobilePhone",
                //             description: "remarks"
                //         }
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
        this.getAppointmentData()
    }
    // 获取界面编辑权限
    getPower = () => {
        let { power } = this.props
        let { isEdit } = this.state
        // 页面模块只读逻辑
        if (power.formRead == 1) {
            // 若为1 根据权限配置判断是否只读
            isEdit = power.formControl.reservationService.isEdit
        } else {
            // 若为2 所有只读
            isEdit = false
        }
        this.setState({
            isEdit
        })
    }
    // 请求预约服务数据
    getAppointmentData = () => {
        GetAppointment({ baseId: this.props.power.id }).then((res) => {
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
        error[index] = info.error
        dataSource[index].list = info.dataSource
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
                            <ReservationService edit={isEdit} area={item.area} startDate={item.startDate} dataSource={item.list} onChange={(info) => this.onChangeList(info, index)}></ReservationService>
                        </div>
                    </div>
                })
            }
        </div>
    }
}
export default ReservationServiceList