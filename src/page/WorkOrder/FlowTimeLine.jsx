import React, {Component} from 'react'
import {Button, Input, Select, Card, Row, TimePicker, Tooltip, Tabs, Icon, Form, Tag, Timeline,Col} from 'antd'
import {css} from "@emotion/css";


const resetCss = css`
  .item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 8px;
    .label {
        display: inline-block;
        height: 100%;
        width: 70px;
        font-size: 14px;
        color: #5e6d82;
  
        text-align: end;
        vertical-align: top;
      &::after {
          display: inline-block;
          width: 100%;
          content: '';
          height: 0;
        }
      }
    .value {
        padding-left: 10px;
        font-size: 14px;
        max-width: calc(100% - 90px);
        color: #5e6d82;
        display: inline-block;
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis
      }
    }
  }
`;

const tip = css`
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
`;

class FlowTimeLine extends Component {

  constructor(props) {
    super(props)
    
    let map = new Map()
    props.datas.forEach((act) => {
      let key = act.histIns.activityId + parseInt(act.histIns.startTime / 1000)
      let val = map.get(key)
      if (val) {
        val.push(act)
      } else {
        var array = []
        array.push(act)
        map.set(key, array)
      }
    })

    this.state = {
      historicTaskMap: map
    }
  }

  render = _ => {

    let { historicTaskMap } = this.state
    
    return (
      <div>
        <Card shadow="hover">
          
          <div style={{marginBottom:'20px'}}>
            <span>流程信息</span>
          </div>

          { historicTaskMap.size && <Timeline reverse="true">

          { [...historicTaskMap].map((arra,index) =>
            // rowKey="id"
            <Timeline.Item color="#3f9eff" key={index} placement="top"> 
              <Card className={resetCss}>
                <h4>{arra[1][0].histIns.activityName}</h4>
                <Row gutter={24}>
                  { arra[1].map(act =>

                      <Col className={tip} style={{marginLeft:"10px"}} span={11}>
                        <div className="item">
                          <span className="label">审批人 : </span>
                          <span className="value">{act.assigneeName}</span>

                        </div>
                        <div className="item">
                          <span className="label">办理状态 : </span>
                          <span className="value">
                               <Tag  size="small">{act.comment.status} </Tag>
                           </span>
                        </div>
                        <div className="item">
                          <span className="label">审批意见 : </span>
                          <Tooltip  placement="topRight">
                                <span className="value">
                                 {act.comment.message}
                              </span>
                          </Tooltip>
                        </div>
                        <div className="item">
                          <span className="label">开始时间 : </span>
                          <span className="value">
                            {act.histIns.startTime }
                        </span>
                        </div>
                        <div className="item">
                          <span className="label">结束时间 : </span>
                          <span className="value">
                           {act.histIns.endTime }
                        </span>
                        </div>
                        <div className="item">
                          <span className="label">用时 : </span>
                          <span className="value">{act.durationTime || '0秒'}</span>
                        </div>
                      </Col>
                  )}
                </Row>
              </Card>
            </Timeline.Item>
          )}
        </Timeline>}
        </Card>
      </div>
    )
      ;
  }

}

export default FlowTimeLine

