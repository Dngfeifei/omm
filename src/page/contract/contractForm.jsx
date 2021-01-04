import React from 'react'
import {
  Form, Row, Col, Input, Button, Icon,
} from 'antd';
import { vbillMap,  iprojMap } from '/api/tools'

const labeldb = {
  vbillno: '合同号号',
  vcontname: '合同名称',
  pkProjectName: '项目名称',
  pkProjectCode: '项目号',
  pkDeptname: '部门',
  pkPsnname: '业务员',
  ncontmny: '合同金额',
  dsigndate: '签订日期',
  dstartdate: '起始日期',
  denddate: '结束日期',
  ncontlimit: '合同期限(月)',
  pkBusiname: '业务类型',
  pkHyname: '行业类型',
  pkServname: '服务类型',
  vbillstatus: '合同状态',
  iprojstatus: '项目状态',
  pkCumanname: '客户',
  ncontnum: '纸质合同份数',
  isaccept: '验收报告',
  checkNotice: '验收通知',
  customerlink: '联系人',
  customerphone: '客户电话',
  customeraddress: '地址',
  fileno: '归档号',
  remark: '备注'
}

class ContractForm extends React.Component {
  getFields() {
    let data = []
    for (let k in labeldb) {
      let value = this.props.item[k]
      if(k == 'vbillstatus') value = vbillMap[value]
      if(k == 'iprojstatus') value = iprojMap[value]
      if(k == 'isaccept') value = value == 'Y' ? '有' : '无'
      if(k == 'checkNotice') value = value == 1 ? '有' : '无'
      //if(k.indexOf('$') == 0 && this.props.item.projitem) value = this.props.item.projitem[k.substring(1)]  
      data.push({label: labeldb[k], value})
    }
    const children = [];
    for (let i = 0; i < data.length; i++) {
      children.push(
        <Col span={12} key={i} style={{ display: 'block' }}>
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
      </Form>
    );
  }
}


export default ContractForm