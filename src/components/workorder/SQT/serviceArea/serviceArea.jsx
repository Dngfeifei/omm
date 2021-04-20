/**
 * 服务计划表--副表---服务区域（客户技术联系人、服务对象、项目组成员）
 * @author yyp
*/
import React, { Component } from 'react'
import { message } from 'antd'

//引入客户技术联系人组件
import Contact from '/components/workorder/SQT/serviceArea/contact.jsx'
//引入服务对象组件
import ObjectEl from '/components/workorder/SQT/serviceArea/object.jsx'
//引入项目组成员组件
import Member from '/components/workorder/SQT/serviceArea/member.jsx'

// 引入页面CSS
import '@/assets/less/pages/servies.less'
// 引入 接口
import { getAssistant } from '/api/serviceMain.js'

class SA extends Component {
    // 设置默认props
    static defaultProps = {
        type: "",  //服务类别
        power: {
            id: "",
            formRead: 1,
            formControl: {
                //服务区域副表
                serviceArea: {
                    isEdit: true,
                    contactIsEdit: false,
                    objectIsEdit: true,
                    memberIsEdit: true
                }
            }
        },  //编辑权限
        onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [
                {
                    areaId: "",
                    area: "",
                    isMainDutyArea: 1,
                    contactList: [],
                    objectList: [],
                    memberList: [],
                }
            ],
            // contactError: [],//客户技术联系人报错信息
            // objectError: [],//服务对象报错信息
            // memberError: [],//项目组成员报错信息
            error: [],
            objIsShow: true, //服务对象是否显示
            contactIsEdit: true,//客户技术联系人是否可编辑
            objectIsEdit: true,//服务对象是否可编辑
            memberIsEdit: true,//项目组成员是否可编辑
            types: ["101", "203", "205", "207", "208", "210"]//此服务分类下 服务对象模块不显示
        }
    }
    componentWillMount() {
        this.initData()
        this.getPower()
    }
    // 请求表单数据
    initData = () => {
        getAssistant({ baseId: this.props.power.id }).then(res => {
            if (res.success == '1') {
                this.setState({
                    datasources: res.data
                })
            } else if (res.success == '0') {
                this.setState({
                    dataSource: [{
                        areaId: "",
                        area: "河南",
                        isMainDutyArea: 1,
                        contactList: [],
                        objectList: [],
                        memberList: [],
                    }]
                })
                // message.error(res.message)
            }
        })
    }
    // 获取界面权限
    getPower = () => {
        let { type, power } = this.props
        let { objIsShow, contactIsEdit, objectIsEdit, memberIsEdit, types } = this.state
        // 页面模块显示逻辑
        if (types.indexOf(toString(type)) >= 0) {
            objIsShow = false
        }
        // 页面模块只读逻辑
        if (power.formRead == 1) {
            // 若为1 所有页面可编辑
            if (power.formControl.serviceArea.isEdit) {
                // 若power.serviceArea.isEdit为true 服务区域页面可编辑
                contactIsEdit = power.formControl.serviceArea.contactIsEdit
                objectIsEdit = power.formControl.serviceArea.objectIsEdit
                memberIsEdit = power.formControl.serviceArea.memberIsEdit

            } else {
                // 若power.serviceArea.isEdit为true 服务区域页面只读
                contactIsEdit = false
                objectIsEdit = false
                memberIsEdit = false
            }
        } else {
            // 若为2 所有只读
            contactIsEdit = false
            objectIsEdit = false
            memberIsEdit = false
        }
        this.setState({
            objIsShow, contactIsEdit, objectIsEdit, memberIsEdit,
        })
    }
    // 客户技术联系人数据更新   
    onChangeCTC = (info, index) => {
        let { dataSource, error, contactIsEdit } = this.state
        if (!contactIsEdit) { return }
        dataSource[index].contactList = info.dataSource
        error[index] ? "" : error[index] = {}
        error[index]["contactError"] = info.error
        this.setState({
            dataSource,
            error
        }, () => {
            this.updateToparent()
        })
    }
    // 服务对象数据更新   
    onChangeSO = (info, index) => {
        let { dataSource, error, objectIsEdit } = this.state
        if (!objectIsEdit) { return }
        dataSource[index].objectList = info.dataSource
        error[index] ? "" : error[index] = {}
        error[index]["objectError"] = info.error
        this.setState({
            dataSource, error
        }, () => {
            this.updateToparent()
        })
    }
    // 项目组成员数据更新   
    onChangePT = (info, index) => {
        let { dataSource, error, memberIsEdit } = this.state
        if (!memberIsEdit) { return }
        dataSource[index].memberList = info.dataSource
        error[index] ? "" : error[index] = {}
        error[index]["memberError"] = info.error
        this.setState({
            dataSource, error
        }, () => {
            this.updateToparent()
        })
    }
    // 更新数据到父级
    updateToparent = () => {
        let checkResult = this.onCheck()
        this.props.onChange({ dataSource: this.state.dataSource, info: checkResult })
    }
    // 数据校验
    onCheck = () => {
        // 0 判断模块是否可编辑 实现对应逻辑
        // 1 各组件数组均至少存在一条数据
        // 2 报错信息包含服务区域名称
        // 3 报错信息由页面从上到下执行
        // 4 同时返回数据和报错信息
        let { dataSource, error, objIsShow, contactIsEdit, objectIsEdit, memberIsEdit } = this.state;
        let newError = { state: true, message: "" }
        if (contactIsEdit) {
            error.forEach(({ contactError }) => {
                if (!newError.state) { return }
                newError = { state: contactError.state, message: contactError.message }
            })
        } else if (objectIsEdit && memberIsEdit) {
            if (objIsShow) {
                error.forEach(({ objectError }) => {
                    if (!newError.state || !objectError) { return }
                    newError = { state: objectError.state, message: objectError.message }
                })
            }
            if (!newError.state) { return newError }
            error.forEach(({ memberError }) => {
                if (!newError.state || !memberError) { return }
                newError = { state: memberError.state, message: memberError.message }
            })
        }
        return newError
    }
    render = _ => {
        let { dataSource, objIsShow, contactIsEdit, memberIsEdit, objectIsEdit } = this.state
        return <div className="ServiesContent">
            {
                dataSource.map((item, index) => {
                    return <div className="commTop" key={index}>
                        <div className="navTitle" style={{ float: "none" }}>
                            {item.area}
                            {item.isMainDutyArea ? <span style={{ color: "red" }}>【主责区域】</span> : ""}

                        </div>
                        <div>
                            <Contact area={item.area} edit={contactIsEdit} dataSource={item.contactList} onChange={(info) => this.onChangeCTC(info, index)}></Contact>
                            {
                                objIsShow ? <ObjectEl area={item.area} edit={objectIsEdit} dataSource={item.objectList} onChange={(info) => { this.onChangeSO(info, index) }}></ObjectEl> : ""
                            }
                            <Member area={item.area} edit={memberIsEdit} dataSource={item.memberList} onChange={(info) => { this.onChangePT(info, index) }}></Member>
                        </div>
                    </div>
                })
            }

        </div>
    }
}
export default SA