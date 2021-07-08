import React, {Component} from 'react'
import {Button, Radio, Modal , Select} from 'antd'
const { Option } = Select;

import { GetBackNodes } from '/api/initiate'


class TaskBackNodes extends Component {


  state = {
    backNodes: null,
    backTaskDefKey: '',
    loading: false,
  }
  

   componentWillReceiveProps (nextprops) {
    if (nextprops.config != this.props.config && nextprops.config.visible) {
     
        let taskId = nextprops.config.taskId

        GetBackNodes({taskId: taskId}).then(data => {
          this.setState({backNodes:data.backNodes,loading:true})
        })
      }
  }


  doConfirm = () => {
    this.props.backAction(this.state.backTaskDefKey)
  }

  handleCancel = e => {
    this.props.backAction()
  }

  handleChange = (value) =>{
    
    this.setState({
      backTaskDefKey: value
    })
  }
  
  
  render = _ => {
    
    let optionList = [];

    if(this.state.loading){
      this.state.backNodes.map((node,index) => {
        optionList.push(<Option key={node.taskDefKey} index={index} value={node.taskDefKey}>{node.taskName}</Option>);
      })
    }
    
    return(
        <Modal title="退回任务"
               destroyOnClose={true}
               confirmLoading={!this.state.loading}
               visible={this.props.config.visible}
               onOk={this.doConfirm}
               onCancel={this.handleCancel}>
    
    
            <Select  style={{width: "100%"}} onChange={this.handleChange} placeholder="请选择驳回节点">
              {optionList}
            </Select>
              
        </Modal>
    )
  }

}

export default TaskBackNodes

