import { Table, Input, InputNumber, Button, Popconfirm, Form, Modal, Row, Col, DatePicker, message } from 'antd';
import { minesave, getTrialInfo } from '/api/trial';
import moment from 'moment';
import TrialView from '/page/trial/trialView.jsx'

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e, t) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      if(t && values.date) values.date = t
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
        	rules: [
            {
              required: true,
              message: `${title} 不可以为空.`,
            },
          ],
          initialValue: dataIndex === 'date' ? moment(record[dataIndex], 'YYYY-MM-DD') : record[dataIndex],
        })(dataIndex === 'date' ? <DatePicker ref={node => (this.input = node)} allowClear={false} onChange={this.save} /> : 
        <InputNumber ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}


class EditableTable extends React.Component {

	async componentWillMount () {
		this.search()
	}

  constructor(props) {
    super(props);
    // console.log(props.params)
    // this.setState({proj: props.params})
    // let month2 = this.getNextNMonth(month1, 1)
    // let month3 = this.getNextNMonth(month2, 1)
    this.columns = [
    	{
        title: '序号',
        dataIndex: 'num',
        width: 80,
        editable: true,
      },
    	{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        editable: true,
      },
      {
        title: '收/付款比例(%)',
        dataIndex: 'percent',
        width: 200,
        editable: true,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        width: 200,
        editable: false,
      },
      {
        title: '删除',
        dataIndex: 'operator',
        width: 50,
        render: (t, r) => <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(r.key)}>
              <a>删除</a>
            </Popconfirm>
      }
    ];

    this.state = {
      trial: {},
      proj: props.params,
    	loading: false,
      dataSource: [],
      count: 0,
      modalconf: {visible: false, id: ''}
    };
  }

  search = async _ => {
		await this.setState({loading: true})	
		return getTrialInfo({jobcode: this.state.proj.jobcode})
		.then(res => {
      if(res.data.id){
        let trial = res.data
  			this.setState({trial, dataSource: trial.trialDetailList, loading: false})
      }else{
        this.setState({loading: false})
      }
		})
	}
  //保存
  handleSave = row => {
    const newData = [...this.state.dataSource];
    let tamount = row.type === 1 ? this.state.trial.xamount : this.state.trial.camount
    if(row.percent && tamount){
      row.amount = tamount * row.percent / 100
    }
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  //删除行
  handleDelete = key => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }
  //添加行--1
  handleAdd = type => {
    const { count, dataSource } = this.state;
    const tds = this.state.dataSource.filter(item => item.type === type)
    const newData = {
      key: count,
      num: tds.length + 1,
      date: '2020-01-01',
      percent: 0,
      amount: 0,
      type: type
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count - 1 
    })
  };

  //保存总金额
  changeTrial = val => {
    let trial = Object.assign({}, this.state.trial, val)
    this.setState({trial})
  }

  //保存数据
  mineSave = _ => {
    let trial = {...this.state.trial,
      jobcode: this.state.proj.jobcode,
      pkprojitem: this.state.proj.pkprojitem,
      name: this.state.proj.name,
      trialDetailList: this.state.dataSource }
    if(!this.checkLegal(trial)){
      return
    }
    minesave(trial).then(res => {
      if(res.code == 200){
        this.setState({trial: {...trial, id: res.data}})
        message.success('保存成功')
      }
    })
  }
  //测算
  showAccess = _ => {
    if(!this.state.trial.id){
      message.error('请先保存数据，再进行试算')
      return
    }
    this.setState({modalconf: {visible: true, id: this.state.trial.id}})
  }
  //校验数据是否合理
  checkLegal = t => {
    if(!t.xamount){
      message.error('请录入销售合同金额')
      return false
    }
    if(!t.cndate){
      message.error('请录入销售合同开始日期')
      return false
    }
    if(!t.cnlimit){
      message.error('请录入销售合同期限')
      return false
    }
    let xra = 0, cra = 0, wra = 0
    t.trialDetailList.forEach(r => {
      let amount = r.amount
      if(!amount || amount == 0){
        message.error('收付款明细中，金额不可以为0')
        return false
      }
      if(r.type == 1) xra += amount
      if(r.type == 2) cra += amount
      if(r.type == 3) wra += amount 
    })
    if((t.xamount || xra !=0) && t.xamount != xra ){
        message.error('销售合同总金额与收款明细不一致')
        return false
    }
    if((t.camount || cra !=0) && t.camount != cra ){
        message.error('采购合同总金额与付款明细不一致')
        return false
    }
    if((t.wamount || wra !=0) && t.wamount != wra ){
        message.error('外包合同总金额与付款明细不一致')
        return false
    }
    return true;
  }


  render() {
    // const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable || this.state.status === 2) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div style={{marginTop: 20, marginLeft: 10}}>
    	<Form>
        <Row gutter={24}>
          <Col span={12} style={{ display: 'block'}}>
          <Form.Item label='项目名称' labelCol={{span: 3}}> {this.state.proj.name} </Form.Item></Col>
          <Col span={12} style={{ display: 'block'}}>
          <Form.Item label='客户' labelCol={{span: 3}}> {this.state.proj.cumanname || '暂无数据'} </Form.Item></Col>
          <Col span={6} style={{ display: 'block'}}>
          <Form.Item label='项目编号' labelCol={{span: 6}}> {this.state.proj.jobcode} </Form.Item></Col>
          <Col span={6} style={{ display: 'block'}}>
          <Form.Item label='业务员' labelCol={{span: 6}}> {this.state.proj.psnname} </Form.Item></Col>
          <Col span={6} style={{ display: 'block'}}>
          <Form.Item label='业务类型' labelCol={{span: 6}}> {this.state.proj.businame} </Form.Item></Col>
          <Col span={6} style={{ display: 'block'}}>
          <Form.Item label='服务类型' labelCol={{span: 6}}> {this.state.proj.servname} </Form.Item></Col>
        </Row>
      </Form>
      <div style={{marginLeft: 10, marginTop: 20, width: '1000px'}}>
            <Input
              style={{width: '260px', marginTop: '10px'}}
              addonBefore="销售合同总金额"
              value={this.state.trial.xamount}
              onChange={e => this.changeTrial({xamount: e.target.value})} /> 
            <DatePicker onChange={e => this.changeTrial({cndate: e.format('YYYY-MM-DD')})} 
            value={this.state.trial.cndate ? moment(this.state.trial.cndate) : null}
            placeholder="合同开始日期" />
            <InputNumber
              style={{width: '200px'}}
              placeholder="合同期限(月)"
              value={this.state.trial.cnlimit}
              onChange={e => this.changeTrial({cnlimit: e})} />
              <span style={{color: 'red', fontSize: '12px', marginTop: '14px', marginLeft: '20px', display: 'inline-block'}}> 点击单元格，输入</span>
            <Button onClick={_ => this.handleAdd(1)} type="primary" style={{ marginBottom: 16, float: 'right' }}>
            添加一行
          </Button>
          <Table
          	size='small'
          	loading = {this.state.loading}	
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.state.dataSource.filter(item => item.type == 1)}
            columns={columns}
            pagination={false}
            locale = {{emptyText: '添加销售合同收款明细'}}
          />
        </div>
        <div style={{marginLeft: 10, marginTop: 20, width: '1000px'}}>
            <Input
              style={{width: '400px'}}
              addonBefore="采购合同总金额"
              value={this.state.trial.camount}
              onChange={e => this.changeTrial({camount: e.target.value})} /> 
            <Button onClick={_ => this.handleAdd(2)} type="primary" style={{ marginBottom: 16, float: 'right' }}>
            添加一行
          </Button>
          <Table
            size='small'
            loading = {this.state.loading}  
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.state.dataSource.filter(item => item.type == 2)}
            columns={columns}
            pagination={false}
            locale = {{emptyText: '添加采购合同付款明细'}}
          />
          </div>
        <div style={{marginLeft: 10, marginTop: 20, width: '1000px'}}>
        <Button onClick={this.showAccess} type="primary" style={{ marginRight: 0, float: 'right'}}>
            试算
          </Button>
        <Button onClick={this.mineSave} type="primary" style={{ marginRight: 30, float: 'right'}}>
            保存
          </Button>
        </div>    
          <TrialView onCancel={_ => this.setState({modalconf: {visible: false, id: ''}})}
          config={this.state.modalconf} />
      </div>
    );
  }
}

export default EditableTable