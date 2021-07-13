import React, {Component} from 'react'
import {Button, Card, Row, Timeline, Col, Steps, Table, Cascader, Radio, Input} from 'antd'
const { Step } = Steps;
import {css} from "@emotion/css";
import moment from 'moment';

const boxCard = css`
    height: 100%;
  .ant-card-body{
    padding: 10px 20px;
    height: 80%;
  }
  .item{
    border-bottom: 1px solid #e8e8e8;
    padding: 10px 0;
  }
  .ant-steps-item-description{
    font-size: 5px;
  }
`;

const headerSot = css`
  padding: 18px 20px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

class FlowStep extends Component {

  constructor(props) {
    super(props)

    
    let nodeArra = []
    props.datas.forEach((arra) => {
      let obj = {activityName: '', time: '', assigneeName: ''};

      Object.keys(arra).forEach(function(trait){
        if(trait === "histIns"){
          obj.activityName = arra[trait].activityName
          obj.time  += (!arra[trait].startTime ? '--' : moment(arra[trait].startTime).format('YYYY-MM-DD HH:mm:ss'))
        }else if(trait === "assigneeName"){
          obj.assigneeName =  (arra[trait] || '') + ','
        }
      });
      nodeArra.push(obj)
    })

    this.state = {
      historicTaskMap: nodeArra
    }
    
  }

  // 初始化
  initColumns = () => {
    this.columns = [
      {
        title: '执行环节',
        dataIndex: 'histIns.activityName',
        align:'center',
        width:'180px',
      },
      {
        title: '执行人',
        dataIndex: 'assigneeName',
        align:'center',
        width:'180px',
      },
      {
        title: '开始时间',
        dataIndex: 'histIns.startTime',
        align:'center',
      },
      {
        title: '结束时间',
        dataIndex: 'histIns.endTime',
        align:'center',
      },
      {
        title: '办理状态',
        dataIndex: 'comment.status',
        align:'center',
      },
      {
        title: '审批意见',
        dataIndex: 'comment.message',
        align:'center',
      },
      {
        title: '任务历时',
        dataIndex: 'durationTime',
        align:'center',
        render: t => t == '' ? '0秒' : t,
      },
      
    ]
  }

  render = _ => {

    let {historicTaskMap} = this.state
    let {historicTaskList} = this.state
    
    this.initColumns()
    return (
      <div>
        <Card className={boxCard} shadow="hover" style={{marginTop:"5px"}}>
          <div className={headerSot} >
            <span>流转记录</span>
          </div>

          { <Steps current={Object.keys(historicTaskMap).length}>
            { historicTaskMap.map((node,index) =>
              <Step
                key={index}
                title={node.activityName}
                description={node.assigneeName + node.time} />
            )}
          </Steps>}

          <Table size="small"  
                 columns={this.columns} 
                 style={{width: "100%", marginTop: '16px', overflowY: 'auto' }}
                 dataSource={this.props.datas}
                 rowKey={'key'}>
          </Table>
        </Card>
      </div>
    )
  }

}

export default FlowStep

