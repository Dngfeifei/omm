import React from 'react'
import {
  Form, Row, Col, Input, Button, Icon,
} from 'antd';

const labeldb = {
  vbillno: '项目号',
  vprojname: '项目名称',
  dbilldate: '立项日期',
  pkBusiname: '业务类型',
  pkServname: '服务类别',
  pkHyname: '行业类别',
  pkCumanname: '客户',
  pkPsnname: '业务员',
  pkDeptname: '部门',
  vbillstatus: '单据状态',
  iprojstatus: '项目状态',
  vmemo: '备注'
}
const vbillMap = {
  8: '自由',
  1: '已审批',
  2: '正在审批中',
  0: '审批未通过',
  5: '关闭'
}
const iprojMap = {
  0: '立项',
  1: '已签约',
  2: '强制关闭',
  3: '丢单关闭',
  4: '验收关闭'
}
class ProjectForm extends React.Component {
  getFields() {
    let data = []
    for (let k in labeldb) {
      let value = this.props.item[k]
      if(k == 'vbillstatus') value = vbillMap[value]
      if(k == 'iprojstatus') value = iprojMap[value]  
      data.push({label: labeldb[k], value})
    }
    const children = [];
    for (let i = 0; i < data.length; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: 'block'}}>
          <Form.Item label={data[i].label}>
            <span>{data[i].value}</span>
          </Form.Item>
        </Col>
      );
    }
    return children;
  }

  render() {
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}></Col>
        </Row>
      </Form>
    );
  }
}


export default ProjectForm