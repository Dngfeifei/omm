/***
 *  资料库--资源菜单图标选择窗口
 * @auth yyp
*/
import React, { Component } from 'react'
import { Button, message, Modal, Icon } from 'antd'

import { OMSIcons } from './icons'

class IconsView extends Component {
    static defaultProps = {
        // icon:"",
        // visible: false,
        // onOk: (icon) => {},
        // onCancel: () => {},
    }
    componentWillMount() {
        this.setState({
            visible: this.props.visible
        })
    }
    componentWillReceiveProps(nextProps, preProps) {
        if (nextProps != preProps) {
            this.setState({
                visible: nextProps.visible,
                icon: nextProps.icon
            })
        }
    }
    state = {
        icon: "",
        visible: true
    }
    setIcon = (icon) => {
        this.setState({
            icon: icon
        })
    }
    onSubmit = _ => {
        this.props.onOk(this.state.icon)
    }
    render = _ => {
        let currentIcon = this.state.icon
        return <Modal
            title="导航图标设置"
            visible={this.state.visible}
            onOk={this.onSubmit}
            onCancel={this.props.onCancel}
            width={800}
            bodyStyle={{ height: "600px", overflowY: "auto" }}
        >
            {
                OMSIcons.map((icon, i) => {
                    let iconStyle = currentIcon == icon ? { padding: "5px", margin: "5px", backgroundColor: "#1890ff" } : { padding: "5px", margin: "5px" };
                    return <Icon onClick={_ => { this.setIcon(icon) }} style={iconStyle} key={i} type={icon} />
                })
            }
        </Modal>
    }
}
export default IconsView