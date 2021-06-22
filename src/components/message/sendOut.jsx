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
let {Option} = Select
let {TextArea} = Input

class SendOut extends Component {
    state = {
        username: '',
        myVisible:false,
        params:{
            //人员
            selectedItems:[
                {key: "010", label: "张总"},
                {key: "020", label: "礼总"},
                {key: "021", label: "礼总"},
                {key: "022", label: "礼总"},
                {key: "023", label: "礼总"},
                {key: "024", label: "礼总"},
                {key: "025", label: "礼总"},
                {key: "026", label: "礼总"},
                {key: "027", label: "礼总"},
                {key: "030", label: "无总"}
            ],
            //类型
            messageType:undefined,
            //标题
            messageTitle:undefined,
            //内容
            messageContent:undefined,
            //所有人
            selectedChecked:false,
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
            this.setState({params:{...params,selectedChecked:true}})
        }else{
            this.setState({params:{...params,selectedChecked:false}})
        }
    }
    //人员选择器保存
    postSave = (resultID,result) => {
         console.log(resultID,result)
        let {selectedItems} = this.state.params;
        let newSelectedItems = result.map((item,index)=>{
            return {key:item.id,label:item.realName}
        })
        selectedItems = selectedItems.length ? [...selectedItems,...newSelectedItems] : newSelectedItems;
        this.setState({params:{selectedItems}});
    }
    //saveData
    saveData = () => {
        const {params} = this.state;
        // 验证
        if(!params.selectedItems.length){
            message.warning('请选择发送人员');
        }else if(!params.messageType){
            message.warning('请选择消息类型');
        }else if(!params.messageTitle){
            message.warning('请填写消息标题');
        }else if(!params.messageContent){
            message.warning('请填写消息内容');
        }
        console.log(params);
    }
    render = _ =>
        <ModalDom title='消息发送' width={700} destroyOnClose={true} visible={true} onOk={this.saveData} onCancel={this.props.onCancel}>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15,position:'relative'}}>
                <span className="ant-form-item-required" style={{width:86,display:'inline-block'}}>发送人：</span>
                <Select mode="multiple" dropdownStyle={{display:'none'}} placeholder="请选择人员" labelInValue value={this.state.params.selectedItems} onChange={(selectedItems)=>this.setState({params:{...this.state.params,selectedItems}})} style={{width:'73%'}}></Select>
                <Icon style={{position:'absolute',right: '15%',top: '50%',transform: 'translateY(-50%)' , cursor: 'pointer'}} onClick={this.handleClick} type="appstore" />
                <Checkbox style={{marginLeft:15}} onChange={this.onChecked}>所有人</Checkbox>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息分类：</span>
                <Select placeholder="请选择" value={this.state.params.messageType} style={{ width: '100%' }} onChange={(messageType) => this.setState({params:{...this.state.params,messageType}}) }>
                    <Option value="lucy">
                        系统内
                    </Option>
                </Select>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息标题：</span>
                <Input placeholder="请输入标题" value={this.state.params.messageTitle} onChange={({target:{value}}) => this.setState({params:{...this.state.params,messageTitle:value}})}/>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span className="ant-form-item-required" style={{width:100,display:'inline-block'}}>消息内容：</span>
                <TextArea rows={4} value={this.state.params.messageContent} onChange={({target:{value}}) => this.setState({params:{...this.state.params,messageContent:value}})}/>
            </div>
            {/* 人员选择器 */}
            {this.state.myVisible ? <PostArea type={'checkbox'} title="人员选择器" onOk={this.postSave} onCancel={()=>this.setState({myVisible:false})} /> : null}
        </ModalDom>
}
export default SendOut