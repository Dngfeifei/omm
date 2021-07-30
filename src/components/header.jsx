import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Badge,message} from 'antd'
import { connect } from 'react-redux'
import { TOGGLE, ADD_PANE, RESET, SET_BREADCRUMB ,GET_MENU} from '/redux/action'
const { Header } = Layout
import { hashHistory } from 'react-router'
import Notice from '@/components/message/notice'//消息通知
import SendOut from '@/components/message/sendOut'//消息发送

import {logout} from '@/api/login.js'
import {getUnreadNum} from '@/api/systemMessage.js'

@connect(state => ({
    collapsed: state.global.collapsed,
    breadcrumb: state.global.breadcrumb,
    loginStatus: state.global.loginStatus
}), dispath => ({
    toggle(key) {dispath({ type: TOGGLE })},
    add(pane) { dispath({type: ADD_PANE, data: pane})},
    setBreadcrumb(data){dispath({type:SET_BREADCRUMB,data:data})},
    reset() { dispath({ type: RESET }) }
}))
class DHeader extends Component {

    componentWillMount = _ => {
        let name='realName';
        if (process.env.NODE_ENV == 'production') {
            name=`${process.env.ENV_NAME}_realName`
        }
        // console.log(!(process.env.NODE_ENV == 'production'))
        let username = localStorage.getItem(name)
        this.setState({ username })
        window.resetStore = this.props.reset;
        this.getSysMessage()
    }

    state = {
        username: '',
        modalVisible: false,
        notice:false,//消息通知
        sendOut:false,//消息发送
        noticeNUm:0 //未读消息数量
    }
    getSysMessage = () => {
        let name =  '';
        if(process.env.NODE_ENV == 'production'){
            name = process.env.ENV_NAME+'_'
        }
        let status = localStorage.getItem(`${name}token`) //判断token是否存在验证是否已经登录
        // console.log(status)
        if( status && !this.state.notice){
            getUnreadNum().then(res => {
                if(res.success == 1){
                    let {noticeNUm} = this.state;
                    noticeNUm = res.data.msgCount ? res.data.msgCount - 0 : 0;
                    this.setState({noticeNUm});
                }else{
                    //message.error(res.message);
                }
            })
        }
        setTimeout(this.getSysMessage,60000);//60000
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
        // 跳转到【重置密码】页面  
		hashHistory.push('/initPassForm')
    }

    showMessage = _ => {
        let pane = {
            title: '消息',
            key: 'message',
            url: `message`
        }
        this.props.add(pane)
    }
    handleClick = (pa) => {
        let modalVisible = pa;
        this.setState({modalVisible});
    }
    //刷新消息通知数据
    resetNotice = () => {
        // console.log(this.noticeRef)
        if(this.noticeRef) this.noticeRef.searchTable();
    }
    render = _ => <Header
        className="header" style={{background:'#4876e7 url(static/images/topBG.png) 0 center no-repeat',backgroundSize: 'auto 102%'}}>
        <div className="settingwrap">
            {/* 消息通知 */}
            <Badge count={this.state.noticeNUm} className="messages-receiving" style={{cursor:'pointer'}}  onClick={()=> this.setState({notice:true,noticeNUm:0})}>
                <span className="head-example">
                    <Icon type="bell" theme="filled" style={{ fontSize: 30, color: '#eee',cursor:'pointer'}} />
                </span>
            </Badge>
            {/* 消息发送 */}
            <Badge count={0} className="messages-push" style={{cursor:'pointer'}}  onClick={()=> this.setState({sendOut:true})}>
                <span className="head-example">
                    <Icon type="message" theme="outlined" style={{ fontSize: 30, color: '#eee',cursor:'pointer'}} />
                </span>
            </Badge>
            <img
                src="./static/images/avatar.png"
                className="avatar" />
            <span style={{ marginRight: 15}}>欢迎，{this.state.username || '管理员'}</span>
            <Dropdown
                overlay={<Menu>
                    {/* onClick={this.showMessage} */}
                    <Menu.Item >消息中心</Menu.Item>
                    <Menu.Item onClick={this.changePass}>修改密码</Menu.Item>
                </Menu>}>
                <span>个人中心</span>
            </Dropdown>
            <span className="settings" onClick={this.quit}>退出</span>
        </div>
        {/* 消息通知 */}
        {
            this.state.notice ? <Notice ref={ref => this.noticeRef = ref} onCancel={()=>{this.setState({notice:false})}} openSendOut={()=> this.setState({sendOut:true})}></Notice> : null
        }
        {/* 消息发送 */}
        {
            this.state.sendOut ? <SendOut onCancel={()=>{this.setState({sendOut:false})}} resetData={this.resetNotice}></SendOut> : null
        }
    </Header>
}

export default DHeader
