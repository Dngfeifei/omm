import React from 'react'
import { Form, Row, Col, Input, Button, Icon, Modal, Table, Divider } from 'antd';
import { getinvoicedetails } from '/api/invoice'

const labeldb = {
  invoiceMsg: '发票信息',
  invoiceCode: '发票号码',
  invoiceNo: '发票代码',
  invoiceDate: '开票日期',
  amountout: '合计金额',
  tax: '合计税额',
  buyerMsg: "购买方信息",
  amountin: '价税合计',
  buyerName: '购方名称',
  buyerNo: '购方纳税人号',
  buyerLinked: '购方地址电话',
  buyerBankno: '购方开户行',
  sellerMsg: "销方信息",
  sellerName: '销方名称',
  sellerNo: '销方纳税号',
  sellerLinked: '销方地址电话',
  sellerBankno: '销方开户行',
  receivablesMsg: "收款信息",
  payee: '收款人',
  reviewer: '复核人',
  drawer: '开票人',
  invoceType: '发票类型',
  invoiceflag: '开票标识',
  isseal: '是否有红章',
  remark: '备注',

  // amountch: '价税合计大写',
  // snum: '联数',
  // printcode: '印刷代码',
  // printno: '印刷号码',
  // mulcode: '综合发票代码',
  // mulno: '综合发票号码',
  // checkcode: '校验码',
}

class InvoiceDetail extends React.Component {

  async componentWillReceiveProps(nextprops) {
    if (nextprops.config != this.props.config && nextprops.config.visible) {
      this.search(nextprops.config.item.id)
    }
  }

  state = {
    columns: [{
      title: '货物或应税劳务、服务名称',
      dataIndex: 'goods'
    }, {
      title: '规格型号',
      dataIndex: 'model'
    }, {
      title: '单位',
      dataIndex: 'unit'
    }, {
      title: '数量',
      dataIndex: 'count'
    }, {
      title: '单价',
      dataIndex: 'price'
    }, {
      title: '金额',
      dataIndex: 'amount'
    }, {
      title: '税率',
      dataIndex: 'ratio'
    }, {
      title: '税额',
      dataIndex: 'taxamount'
    }],
    tabledata: []
  }

  getFields() {
    if (!this.props.config || !this.props.config.item) return
    let data = []
    for (let k in labeldb) {

      switch (k) {
        case "buyerMsg":
        case "sellerMsg":
        case "receivablesMsg":
        case "invoiceMsg":
          data.push({ label: labeldb[k], k })
          break;
        default:
          let value = this.props.config.item[k]
          data.push({ label: labeldb[k], value })
      }

    }
    const children = [];
    for (let i = 0; i < data.length; i++) {
      switch (data[i].k) {
        case "buyerMsg":
        case "sellerMsg":
        case "receivablesMsg":
        case "invoiceMsg":
          children.push(
            <p><Divider>{(data[i].label)}</Divider></p>
          );
          break;
        default:
          children.push(
            <Col span={8} key={i} style={{ display: 'block' }}>
              <Form.Item label={data[i].label}>
                <span>{data[i].value}</span>
              </Form.Item>
            </Col>
          );
      }
    }
    return children;
  }

  search = id => {
    console.log(id)
    getinvoicedetails({ id }).then(res => {
      let tabledata = res.data.map(val => Object.assign({}, val, { key: val.id }))
      this.setState({ tabledata })
    })
  }


  render() {
    return (
      <Modal title='发票明细'
        visible={this.props.config.visible}
        onCancel={this.props.onCancel}
        width={1200}
        style={{ top: 50, marginBottom: 100 }}
        footer={null} >
        <Form className="ant-advanced-search-form">
          <Row gutter={24}>{this.getFields()}</Row>
        </Form>
        <Table
          size='small'
          bordered
          columns={this.state.columns}
          pagination={false}
          dataSource={this.state.tabledata} />
      </Modal>
    );
  }
}


export default InvoiceDetail