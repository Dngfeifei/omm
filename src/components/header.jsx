import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Breadcrumb,message } from 'antd'
import { connect } from 'react-redux'
import { TOGGLE, ADD_PANE, RESET, SET_BREADCRUMB ,GET_MENU} from '/redux/action'
const { Header } = Layout
import { hashHistory } from 'react-router'


import {logout} from '@/api/login.js'

@connect(state => ({
    collapsed: state.global.collapsed,
    breadcrumb: state.global.breadcrumb,
}), dispath => ({
    toggle(key) {dispath({ type: TOGGLE })},
    add(pane) { dispath({type: ADD_PANE, data: pane})},
    setBreadcrumb(data){dispath({type:SET_BREADCRUMB,data:data})},
    reset() { dispath({ type: RESET }) }
}))
class DHeader extends Component {

    componentWillMount = _ => {
        let name='username';
        if (process.env.NODE_ENV == 'production') {
            name=`${process.env.ENV_NAME}_username`
        }
        console.log(!(process.env.NODE_ENV == 'production'))
        let username = localStorage.getItem(name)
        this.setState({ username })
        window.resetStore = this.props.reset;
    }

    state = {
        username: ''
    }

    quit = _ => {
        
        logout().then(res=>{
            if (res.success == 1) {
                // 清除缓存
                localStorage.clear();
                this.props.reset()
                hashHistory.replace('/login')
            }else {
                message.error(res.message)
            }
        })
    }

    changePass = _ => {
        let pane = {
            title: '修改密码',
            key: 'changepas',
            url: `changePassword`
        }
        this.props.add(pane)
    }

    showMessage = _ => {
        let pane = {
            title: '消息',
            key: 'message',
            url: `message`
        }
        this.props.add(pane)
    }
    render = _ => <Header
        className="header" style={{background:'#4876e7 url(static/images/topBG.png) 0 center no-repeat',backgroundSize: 'auto 102%'}}>
        {/* <div className={this.props.collapsed ? 'avatar-wrapper collaps' : 'avatar-wrapper'}>
            {<div className="logo">
                <Icon type="question-circle" className="icon" />
                <span className="username">LOGO</span>
            </div>}
        </div>
        <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.toggle} />
            <div style={{fontSize: "24px",color:"white",paddingLeft:"25px"}}>银信运维管理系统</div> */}
        {/* <Breadcrumb separator=">" style={{marginLeft: 25}}>
            {
                this.props.breadcrumb && this.props.breadcrumb.length && this.props.breadcrumb.map((item,index) => {
                    return <Breadcrumb.Item style={{fontWeight: 600}} key={index}>{item}</Breadcrumb.Item>
                })
            }
        </Breadcrumb> */}
        <div className="settingwrap">
            <img
                src="./static/images/avatar.png"
                className="avatar" />
            <span style={{ marginRight: 15 }}>欢迎，{this.state.username || '管理员'}</span>
            <Dropdown
                overlay={<Menu>
                    <Menu.Item onClick={this.showMessage}>消息中心</Menu.Item>
                    <Menu.Item onClick={this.changePass}>修改密码</Menu.Item>
                </Menu>}>
                <span>个人中心</span>
            </Dropdown>
            <span className="settings" onClick={this.quit}>退出</span>
        </div>
    </Header>
}

export default DHeader
