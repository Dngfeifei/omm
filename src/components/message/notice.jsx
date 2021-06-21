/*
    消息通知
*/
import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Badge,message} from 'antd'
import ModalDom from '@/components/modal'

class Notice extends Component {

    componentWillMount = _ => {
        let name='realName';
        if (process.env.NODE_ENV == 'production') {
            name=`${process.env.ENV_NAME}_realName`
        }
        console.log(!(process.env.NODE_ENV == 'production'))
        let username = localStorage.getItem(name)
        this.setState({ username })
        window.resetStore = this.props.reset;
    }
    state = {
        username: '',
        modalVisible: false
    }
    handleClick = (pa) => {
        let modalVisible = pa;
        this.setState({modalVisible});
    }
    render = _ =>
        <ModalDom title='消息通知' width={700} destroyOnClose={true} visible={true} onOk={()=>this.handleClick(false)} onCancel={this.props.onCancel}>
          我是消息通知面板
        </ModalDom>
}
export default Notice