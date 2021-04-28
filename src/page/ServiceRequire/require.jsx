/***
 * 信息管理---服务需求表
 * @author jxl
 */


import React , {Component} from 'react'
import { Button ,message} from 'antd';
const creatHistory = require("history").createHashHistory;
const history = creatHistory();//返回上一页这段代码

import { connect } from 'react-redux'
import { REMOVE_PANE , ADD_PANE,SET_WORKLIST} from '/redux/action'

// 引入服务需求表工单组件
import SQT from '@/components/workorder/SQT/SQT_1.jsx'
// import SQT from '@/components/workorder/SQT/microrisk/microrisk.jsx'
// import SQT from '@/components/workorder/SQT/microrisk/microriskSummary.jsx'


@connect(state => ({
	panes: state.global.panes,
    activeKey: state.global.activeKey,
    resetwork: state.global.resetwork,
}), dispath => ({
    remove(key){dispath({type: REMOVE_PANE, key})},
    add(pane) { dispath({type: ADD_PANE, data: pane})},
    setWorklist(data){dispath({ type: SET_WORKLIST,data})},
}))



class RequireSqt extends Component {
    // 设置默认props
    static defaultProps = {

    }
    // 组件将要挂载前触发的函数
    async componentWillMount() {
        // this.init();
    }
    constructor(props) {
        super(props)
        this.state = {
            disabled:false

        }
    }

    // 服务需求表  ---- 提交按钮事件
    handleSubmit = async (data) => {
        console.log('************       服务需求表  ---- 提交按钮事件        ***************')
         //调用组件进行通信
        //  this.refs.getSwordButton.submission().then(res => {
        //      if(res){
        //         message.success('操作成功！');
        //         let resetwork = { switch: !this.props.resetwork.switch};
        //         this.props.setWorklist(resetwork);
        //         this.handleBack();
        //      }
        //  })
        const {disabled} = this.state;
        this.setState({
            disabled: !disabled
        })
         let res = await this.refs.getSwordButton.submission();
         if(res){
            message.success('操作成功！');
            let resetwork = { switch: !this.props.resetwork.switch};
            this.props.setWorklist(resetwork);
            this.handleBack();
        }else{
            this.setState({
                disabled: false
            })
        }
        
    }
    //保存数据
    save = () =>{

    }
    handleBack = () => {
        this.props.remove(this.props.activeKey)
    }
    


    render = _ => {
        return (
            <div className="service" style={{height:'100%', padding: '0 15px',overflow:'hidden'}}>
                
                <SQT ref="getSwordButton" config={{id:90}}></SQT>
                {/* 提交按钮--区域 */}
                <div className="btnContent" style={{textAlign:'right',marginTop:'0px'}}>
                    <Button disabled={this.state.disabled} type="primary" style={{ marginRight: '30px' }} onClick={this.handleSubmit}>提交</Button>
                    <Button disabled={this.state.disabled} type="primary" style={{ marginRight: '30px' }} onClick={this.save}>提交</Button>
                    <Button onClick={this.handleBack}>返回</Button>
                </div>
            </div>

        )
    }
}

export default RequireSqt;