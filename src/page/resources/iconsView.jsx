/***
 *  资料库--资源菜单图标选择窗口
 * @auth yyp
*/
import React, { Component } from 'react'
import { Button, message, Modal, Icon } from 'antd'

import { OMSIcons } from './icons'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2410657_j8b1224bdw.js', // 在 iconfont.cn 上生成
});

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
                    let from = icon.slice(0, 1)  //1 为antd内置图标库   2为第三方图标库
                    let iconStyle = currentIcon == icon ? { padding: "5px", margin: "5px", backgroundColor: "#1890ff" } : { padding: "5px", margin: "5px" };
                    if (from == 1) {
                        return <Icon onClick={_ => { this.setIcon(icon) }} style={iconStyle} key={i} type={icon.slice(2)} />
                    } else {
                        return <MyIcon onClick={_ => { this.setIcon(icon) }} style={iconStyle} key={i} type={icon.slice(2)} />
                    }
                })
            }
        </Modal>
    }
}
export default IconsView