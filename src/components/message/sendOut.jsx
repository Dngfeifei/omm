/*
    消息发送
*/
/*
    消息通知
*/
import React, { Component } from 'react'
import { Select,Icon,Input,Checkbox,message} from 'antd'
import ModalDom from '@/components/modal'
import PostArea from '@/components/selector/engineerSelector.jsx'//人员选择器
import { addMessage} from '/api/systemMessage.js'
let {Option} = Select
let {TextArea} = Input

class SendOut extends Component {
    state = {
        username: '',
        myVisible:false,
        params:{
            //人员
            msgUsers:[],
            //类型
            msgType:undefined,//消息分类，1-系统消息，2-邮件消息
            //标题
            msgTitle:undefined,
            //内容
            msgContent:undefined,
            //所有人
            isAll:'0',//是否发送所有人，1-是，0-否   
        }
    }
    //打开人员选择器
    handleClick = (pa) => {
        this.setState({myVisible:true});
    }
    //选择所有人
    onChecked = (info) => { 
        let {params} = this.state;
        if(info.target.checked){
            let msgUsers = [{key:'0000',label:'所有人'}]
            this.setState({params:{...params,isAll:1,msgUsers}})
        }else{
            let msgUsers = []
            this.setState({params:{...params,isAll:0,msgUsers}})
        }
    }
    //人员选择器保存
    postSave = (resultID,result) => {
         console.log(resultID,result)
        let {params} = this.state,{msgUsers} = params;
        let newSelectedItems = result.map((item,index)=>{
            return {key:item.id,label:item.realName,userId:item.id,email:item.email}
        })
        // msgUsers = msgUsers.length ? [...msgUsers,...newSelectedItems] : newSelectedItems;
        let newParams = Object.assign({}, params, { msgUsers: msgUsers.length ? [...msgUsers,...newSelectedItems] : newSelectedItems});
        this.setState({params});
    }
    //saveData
    saveData = () => {
        const {params} = this.state;
        // 验证
        // console.log(params,params.isAll);
        if(params.isAll == 0 && !params.msgUsers.length){
            message.warning('请选择发送人员');
        }else if(!params.msgType){
            message.warning('请选择消息类型');
        }else if(!params.msgTitle){
            message.warning('请填写消息标题');
        }else if(!params.msgContent){
            message.warning('请填写消息内容');
        }
        console.log(params,params.isAll);
        addMessage(params).then(res => {
            if (res.success == 1) {
                message.success(res.message);
                this.props.onCancel();
            }else{
                message.error(res.message);
            }
        })
    }
    render = _ =>
        <ModalDom title='消息发送' width={800} destroyOnClose={true} visible={true} onOk={this.saveData} onCancel={this.props.onCancel}>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15,position:'relative'}}>
                <span className="ant-form-item-required" style={{width:88,display:'inline-block'}}>发送人：</span>
                <Select disabled={this.state.params.isAll == 0 ? false : true} mode="multiple" dropdownStyle={{display:'none'}} placeholder="请选择人员" labelInValue value={this.state.params.msgUsers} onChange={(msgUsers)=>this.setState({params:{...this.state.params,msgUsers}})} style={{width:'75%'}}></Select>
                {this.state.params.isAll == 0 ? <Icon style={{position:'absolute',right: '15%',top: '50%',transform: 'translateY(-50%)' , cursor: 'pointer'}} onClick={this.handleClick} type="appstore" /> : null}
                <Checkbox style={{marginLeft:15}} onChange={this.onChecked}>所有人</Checkbox>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息分类：</span>
                <Select placeholder="请选择" value={this.state.params.msgType} style={{ width: '100%' }} onChange={(msgType) => this.setState({params:{...this.state.params,msgType}}) }>
                    <Option value="1">系统消息</Option>
                    <Option value="2">邮件消息</Option>
                </Select>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息标题：</span>
                <Input placeholder="请输入标题" value={this.state.params.msgTitle} onChange={({target:{value}}) => this.setState({params:{...this.state.params,msgTitle:value}})}/>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息内容：</span>
                <TextArea rows={6} value={this.state.params.msgContent} onChange={({target:{value}}) => this.setState({params:{...this.state.params,msgContent:value}})}/>
            </div>
            {/* 人员选择器 */}
            {this.state.myVisible ? <PostArea type={'checkbox'} title="人员选择器" onOk={this.postSave} onCancel={()=>this.setState({myVisible:false})} /> : null}
        </ModalDom>
}
export default SendOut