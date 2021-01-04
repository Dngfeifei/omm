import React, { Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Icon, Select, Button } from 'antd';
import { getDictSelectMuti } from '/api/dict'

const EditableContext = React.createContext();
const TypeMap = [
  {k: '=', v: '等于'},
  {k: 'LIKE', v: '包含'},
  {k: '<', v: '小于'},
  {k: '<=', v: '小于等于'},
  {k: '>', v: '大于'},
  {k: '>=', v: '大于等于'}
]

const CompareMap = [
  {k: 'and', v: '并且'},
  {k: 'or', v: '或者'}
]

const columnMap = [
  {k: 'pk_project_code', v: '项目号'},
  {k: 'pk_project_name', v: '项目名称'},
  {k: 'vcontname', v: '合同名称'},
  {k: 'pk_cumanname', v: '客户'},
  {k: 'pk_servtype', v: '服务类别'},
  {k: 'ncontmny', v: '合同金额'},
  {k: 'eqname', v: '设备名称'},
  {k: 'province', v: '技术区域'},
  {k: 'isaccept', v: '验收报告'},
  {k: 'check_notice', v: '中标通知'},
  {k: 'dstartdate', v: '合同开始日期'},
  {k: 'denddate', v: '合同结束日期'}
]

//获得选择框的值
const getSelectValue = (k, tp) => {
    let d = tp.filter(e => e.k==k)
    return d && d[0] ? d[0].v : ''
  }
class EditableCell extends React.Component {

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      col,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(col.dataIndex, {
              rules: [
                {
                  required: col.required,
                  message: `${col.title} 不能为空`,
                },
              ],
              initialValue: record[col.dataIndex],
            })(col.getEdit(record))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  async componentWillMount () {
    await getDictSelectMuti({codeList: ['servtype', 'hytype']}).then(res => {
      this.setState({servtypelist: res.data.servtype, hytypelist: res.data.hytype})
    })
    this.setState({editingKey: 1});
  }
  constructor(props) {
    super(props);
    this.state = {
      hytypelist: [],
      servtypelist: [],
      data: this.props.data,
      editingKey: '',
      columns: [
      {
        title: '左括号',
        dataIndex: 'leftc',
        width: '8%',
        editable: true,
        getEdit: _ => <Input />,
      },
      {
        title: '字段',
        dataIndex: 'column',
        width: '20%',
        editable: true,
        render: t => getSelectValue(t, columnMap),
        required: true,
        getEdit: record => <Select onChange={e => {record.column = e}} style={{width: '100%'}}>
            {columnMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
      </Select>,
      },
      {
        title: '比较符',
        dataIndex: 'compare',
        width: '10%',
        editable: true,
        render: t => getSelectValue(t, TypeMap),
        required: true,
        getEdit: record => {
            let readonly = (record.column == 'pk_servtype' || record.column == 'isaccept' || record.column == 'check_notice')
            if(readonly && this.props.form.getFieldValue('compare')!='=') this.props.form.setFields({compare: {value: '='}})
            return <Select style={{width: 100}} disabled={readonly}>
            {TypeMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
            </Select>
          }
        
      },
      {
        title: '条件值',
        dataIndex: 'value',
        width: '20%',
        editable: true,
        required: true,
        render: (t,r) => {
          if(r.column == 'pk_servtype'){
            let objs = this.state.servtypelist.filter(e => e.code==t)
            return objs.length > 0 ? objs[0].name : ''
          }else if(r.column == 'check_notice'){
            return t == '1' ? '有' : '无';
          }else if(r.column == 'isaccept'){
            return t == 'Y' ? '有' : '无';
          }else{
            return t
          }
        },
        getEdit: record => {
          if(record.column == 'pk_servtype'){
              return <Select style={{ width: '100%'}}>
                {this.state.servtypelist.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
              </Select>
          }else if(record.column == 'isaccept'){
            return <Select style={{width: 100}}>
            <Option value='Y'>有</Option><Option value='N'>无</Option>
            </Select>
          }else if(record.column == 'check_notice'){
            return <Select style={{width: 100}}>
            <Option value='1'>有</Option><Option value='2'>无</Option>
            </Select>
          }else{
            return <Input />
          }
        },
      },
      {
        title: '右括号',
        dataIndex: 'rightc',
        width: '8%',
        editable: true,
        getEdit: _ => <Input />,
        required: false
      },
      {
        title: '逻辑值',
        dataIndex: 'logic',
        width: '10%',
        editable: true,
        render: t => getSelectValue(t, CompareMap),
        getEdit: _ => <Select style={{width: 100}}>
            {CompareMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
      </Select>,
      },
      {
        title: <a onClick={_ => this.addSearchDom()} type="primary"><Icon type="plus" style={{fontSize: '16px'}} /></a>,
        align: 'center',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
                <a onClick={() => this.cancel(record.key)} >取消</a>
            </span>
          ) : (<span>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>
              编辑
            </a>
            <a disabled={editingKey !== ''} onClick={() => this.delete(record.key)}>
              删除
            </a>
            </span>
          );
        },
      },
    ],
    };
  }


  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.props.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        this.props.data.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({data: this.props.data,editingKey: '' });
      } else {
        this.props.data.push(row);
        this.setState({data: this.props.data,editingKey: '' });
      }
    });
  }


  addSearchDom = async _ => {
    if(this.state.editingKey){
      await this.save(this.props.form, this.state.editingKey)
    }
    let index = -(this.props.data.length + 1);
    //console.log(index)
    this.props.data.push({key: index,leftc: '', column: '', compare: '', value: '', rightc: '', logic: ''})
    this.setState({data: this.props.data, editingKey: index})
  }

  edit(key) {
    //console.log(99,key)
    this.setState({ editingKey: key });
  }

  delete(key) {
    let index = this.props.data.findIndex(item => key === item.key);
    this.props.data.splice(index, 1)
    this.setState({data: this.props.data})
  }

    //清空高级搜索
  clearSearchprops = _ => {
    this.props.data = [{key: 1,leftc: '', column: '', compare: '', value: '', rightc: '', logic: ''}]
    this.setState({data: this.props.data})
    this.setState({editingKey: 1})
  }
  //高级搜索
  doHighSearch = async _ => {
    if(this.state.editingKey){
      await this.save(this.props.form, this.state.editingKey)
    }
    this.props.handler()
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          col,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
      <Button.Group>
          <Button type="primary" onClick={this.clearSearchprops}>
            <Icon type="stop" />
            重置
          </Button>
          <Button type="primary" onClick={this.doHighSearch}>
            <Icon type="search"/>
            搜索
          </Button>
        </Button.Group>
      <EditableContext.Provider value={this.props.form}>
        <Table
          size='small'
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          locale={{emptyText: '暂无数据'}}
          rowClassName="editable-row"
          pagination={false}
        />
      </EditableContext.Provider></div>
    );
  }
}

const SearchComHighTable = Form.create()(EditableTable);
export default SearchComHighTable