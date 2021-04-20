import React, { Component } from 'react'
import { Descriptions, Collapse ,Table, Form, Input, Select, DatePicker, Popconfirm, Button , Checkbox , Icon , InputNumber , Upload , message, List,Divider} from 'antd'
import '@/assets/less/pages/Micro.less'

const { Panel } = Collapse;

class Micro extends Component{
    state = {
        data: [
            {detail:'是，新项目增加',value:1,detail2:'设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
            {detail:'是，续签项目新增设备',value:2,detail2:'关联设备需求表设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
            {detail:'否，续签项目不需要申请',value:3},
            {detail:'否，新项目库存满足需求',value:4},
            {detail:'其他',value:5}
        ],
    };
    handleClick = (value) => {
        if(this.props.changeCheck) this.props.changeCheck(value);
    }
    exportDom = (item) => {
        const {isChecked} = this.props.dataSource;
        // if(item.value == 1 || item.value == 2){
        //     return (<div style={{width:'100%',position:'relative',display: 'flex',alignItems: 'center'}}><span style={{display:'inline-block',width:'60%',verticalAlign:'top'}}><Checkbox  checked={isChecked == item.value ? true : false} onChange={()=>this.handleClick(item.value)}>{item.detail}</Checkbox></span><span style={{width:1,display:'inline-block',backgroundColor:'#e8e8e8',position:'absolute',top:0,bottom:0,margin:'-8px 0',left: '60%'}}></span><span style={{display:'inline-block',width:'40%',textAlign:'center'}}>{item.detail2}</span></div>)
        // }else{
            return (<Checkbox checked={isChecked == item.value ? true : false} onChange={()=>this.handleClick(item.value)}>{item.detail}</Checkbox>)
        // }
    }
    render () {
        const {data} = this.state;
        return (
            <div className="micro">
                <p className="micro_title">微观风险</p>
                <Descriptions className="micro_dom" bordered column={1} size={'small'}>
                    <Descriptions.Item label="是否申请备机备件" span={1}>
                        <List
                            size="small"
                            bordered={false}
                            style={{margin:'-8px -16px'}}
                            dataSource={data}
                            renderItem={item => <List.Item style={{paddingLeft:10}}>{this.exportDom(item)}</List.Item>}>
                        </List>
                    </Descriptions.Item>
                    <Descriptions.Item label="首次巡检总结报告" span={1}>
                    <p style={{textAlign: 'center',margin:0,color:'#02A7F0'}}>附件名称</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="配置信息管理模板" span={1}>
                    <p style={{textAlign: 'center',margin:0,color:'#02A7F0'}}>附件名称</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="风险提示报告" span={1}>
                    <p style={{textAlign: 'center',margin:0,color:'#02A7F0'}}>附件名称</p>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }

}
export default Micro