/*
    消息发送
*/
/*
    消息通知
*/
import React, { Component } from 'react'
import { Select,Icon,Input,Checkbox} from 'antd'
import ModalDom from '@/components/modal'
let {Option} = Select
let {TextArea} = Input

class SendOut extends Component {
    state = {
        username: '',
        params:{
            selectedItems:[
                {key: "010", label: "张总"},
                {key: "020", label: "礼总"},
                {key: "030", label: "无总"}
            ],
            messageType:undefined,
            selectedChecked:false,
        }
    }
    handleClick = (pa) => {
        let modalVisible = pa;
        this.setState({modalVisible});
    }
    render = _ =>
        <ModalDom title='消息发送' width={700} destroyOnClose={true} visible={true} onOk={()=>this.handleClick(false)} onCancel={this.props.onCancel}>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span style={{width:80,display:'inline-block'}}>发送人：</span>
                <Select mode="multiple" dropdownStyle={{display:'none'}} suffixIcon={<span>选择</span>} placeholder="请选择人员" labelInValue allowClear value={this.state.params.selectedItems} onChange={(selectedItems)=>this.setState({params:{...this.state.params,selectedItems}})} style={{width:'74%'}}></Select>
                <Checkbox style={{marginLeft:15}}>所有人</Checkbox>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span style={{width:92,display:'inline-block'}}>消息分类：</span>
                <Select placeholder="请选择" value={this.state.params.messageType} style={{ width: '100%' }} onChange={(messageType) => this.setState({params:{...this.state.params,messageType}}) }>
                    <Option value="lucy">
                        系统内
                    </Option>
                </Select>
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span style={{width:92,display:'inline-block'}}>消息标题：</span>
                <Input placeholder="请输入标题" />
            </div>
            <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
                <span style={{width:92,display:'inline-block'}}>消息内容：</span>
                <TextArea rows={4} />
            </div>
        </ModalDom>
}
export default SendOut