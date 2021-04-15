/**
 * 服务计划表--副表---服务区域（客户技术联系人、服务对象、项目组成员）
 * @author yyp
*/
import React, { Component } from 'react'

//引入客户技术联系人组件
import Contact from '/components/workorder/SQT/serviceArea/contact.jsx'
//引入服务对象组件
import ObjectEl from '/components/workorder/SQT/serviceArea/object.jsx'
//引入项目组成员组件
import Member from '/components/workorder/SQT/serviceArea/member.jsx'

class SA extends Component {
    // 设置默认props
    static defaultProps = {
        dataSource: {},  //副表数据
        type: "",  //服务类别
        power: {},  //编辑权限
        onChange: () => { } //数据变化后 外部接受最新数据的方法
    }
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            dataSource: {
                areaId: "",
                area: "",
                isMainDutyArea: 1,
                contactList: [],
                objectList: [],
                memberList: [],
            },
            contactError: {},//客户技术联系人报错信息
            objectError: {},//服务对象报错信息
            memberError: {},//项目组成员报错信息
            objIsShow: true, //服务对象是否显示
            contactIsEdit: true,//客户技术联系人是否可编辑
            objectIsEdit: true,//服务对象是否可编辑
            memberIsEdit: true,//项目组成员是否可编辑
            types: ["101", "203", "205", "207", "208", "210"]//此服务分类下 服务对象模块不显示
        }
    }

    componentWillMount() {
        let { dataSource, type, power } = this.props
        let { objIsShow, contactIsEdit, objectIsEdit, memberIsEdit, types } = this.state
        let isMainDutyAreaStr = dataSource.isMainDutyArea ? '<span style="color:red">[主责区域]</span>' : ""
        let title = dataSource.area + isMainDutyAreaStr
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
            dataSource, title, objIsShow, contactIsEdit, objectIsEdit, memberIsEdit,
        })
    }

    // 挂载完成
    componentDidMount = () => {

    }
    // 客户技术联系人数据更新   
    onChangeCTC = (info) => {
        let { dataSource, contactError } = this.state
        dataSource = Object.assign({}, dataSource, { contactList: info.dataSource })
        contactError = info.error
        this.setState({
            dataSource,
            contactError
        }, () => {
            this.updateToparent()
        })
    }
    // 服务对象数据更新   
    onChangeSO = (info) => {
        let { dataSource, objectError } = this.state
        dataSource = Object.assign({}, dataSource, { objectList: info.dataSource })
        objectError = info.error
        this.setState({
            dataSource, objectError
        }, () => {
            this.updateToparent()
        })
    }
    // 项目组成员数据更新   
    onChangePT = (info) => {
        let { dataSource, memberError } = this.state
        dataSource = Object.assign({}, dataSource, { memberList: info.dataSource })
        memberError = info.error
        this.setState({
            dataSource, memberError
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
    onCheck = (type = null) => {
        // 0 判断模块是否可编辑 实现对应逻辑
        // 1 各组件数组均至少存在一条数据
        // 2 报错信息包含服务区域名称
        // 3 报错信息由页面从上到下执行
        // 4 同时返回数据和报错信息
        let { dataSource, contactError, objectError, memberError, objIsShow, contactIsEdit, objectIsEdit, memberIsEdit } = this.state;
        let { contactList, objectList, memberList, area } = dataSource;
        let error = { state: true, message: "" }
        if (contactIsEdit) {
            if (contactList.length < 1) {
                error = { state: false, message: area + ",表单信息填写不全，请填写完整后再进行其它操作" }
                return error
            }

            if (!contactError.state) {
                error = contactError
            }
        } else if (objectIsEdit && memberIsEdit) {
            if (objIsShow) {
                if (objectList.length < 1 || memberList.length < 1) {
                    error = { state: false, message: area + ",表单信息填写不全，请填写完整后再进行其它操作" }
                    return error
                }
                if (!memberList.state) {
                    error = memberError
                }
                if (!objectError.state) {
                    error = objectError
                }
            } else {
                if (memberList.length < 1) {
                    error = { state: false, message: area + ",表单信息填写不全，请填写完整后再进行其它操作" }
                    return error
                }
                if (!memberList.state) {
                    error = memberError
                }
            }
        }
        let newErroor = Object.assign({}, error, { message: area + "," + error.message })
        return newErroor
    }
    render = _ => {
        let { dataSource, title, objIsShow, contactIsEdit, memberIsEdit, objectIsEdit } = this.state
        return <div className="ServiesContent">

            <Contact title={title} edit={contactIsEdit} dataSource={dataSource.contactList} onChange={this.onChangeCTC}></Contact>
            {
                objIsShow ? <ObjectEl title={title} area={dataSource.area} edit={objectIsEdit} dataSource={dataSource.objectList} onChange={this.onChangeSO}></ObjectEl> : ""
            }
            <Member title={title} edit={memberIsEdit} dataSource={dataSource.memberList} onChange={this.onChangePT}></Member>
        </div>
    }
}
export default SA