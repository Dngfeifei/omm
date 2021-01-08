import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import { TOGGLE, ADD_PANE, RESET, SET_BREADCRUMB } from '/redux/action'
const { Header } = Layout
import { hashHistory } from 'react-router'

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
        let username = localStorage.getItem('username')
        this.setState({ username })
    }

    state = {
        username: ''
    }

    quit = _ => {
        localStorage.setItem('token', '')
        localStorage.setItem('userid', '')
        localStorage.setItem('username', '')
        this.props.reset()
        hashHistory.replace('/login')
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
        className="header">
        <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.toggle} />
        {/* <Breadcrumb separator=">" style={{marginLeft: 25}}>
            {
                this.props.breadcrumb && this.props.breadcrumb.length && this.props.breadcrumb.map((item,index) => {
                    return <Breadcrumb.Item style={{fontWeight: 600}} key={index}>{item}</Breadcrumb.Item>
                })
            }
        </Breadcrumb> */}
        <div className="settingwrap">
            <img
                src="/static/images/avatar.png"
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