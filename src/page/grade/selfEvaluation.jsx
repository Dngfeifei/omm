/***
 *  系统管理--工程师自评
 * @auth yyp
 */
import React, { Component } from 'react'
// 引入工程师自评工单组件
import ENG from '@/components/workorder/ENG/ENG.jsx'
class selfEvaluation extends Component {
    // 设置默认props
    static defaultProps = {
    }
    // 组件将要挂载前触发的函数
    async componentWillMount() {
    }
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render = _ => {
        return (
            <ENG ></ENG>
        )
    }
}

export default selfEvaluation;