/***
 * 信息管理---服务需求表
 * @author jxl
 */


import React , {Component} from 'react'
import { Button } from 'antd';
const creatHistory = require("history").createHashHistory;
const history = creatHistory();//返回上一页这段代码



// 引入服务需求表工单组件
import SQT from '@/components/workorder/SQT/sqt.jsx'
class selfSQT extends Component {
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

    // 服务需求表  ---- 提交按钮事件
    handleSubmit = () => {
        console.log('************       服务需求表  ---- 提交按钮事件        ***************')
        if (this.ChildPage) {
            this.ChildPage.dream('哈哈') //调用子组件的dream方法
        }
    }

    handleBack = () => {
        // 返回登录页，重新登录
        history.goBack();
    }


    render = _ => {
        return (
            <div className="service" style={{height:'100%', padding: '0 15px'}}>
                {/*  把子组件的this指针挂载成父组件的一个变量 */}
                <SQT onRef={c=>this.ChildPage=c}></SQT>
                {/* 提交按钮--区域 */}
                <div className="btnContent" style={{textAlign:'right',marginTop:'10px'}}>
                    <Button type="primary" style={{ marginRight: '30px' }} onClick={this.handleSubmit}>提交</Button>
                    <Button onClick={this.handleBack}>返回</Button>
                </div>
            </div>

        )
    }
}

export default selfSQT;