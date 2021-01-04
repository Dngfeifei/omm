import React, { Component } from 'react'
import { Table, Input, Form, Icon, Select } from 'antd';

const EditableContext = React.createContext();
const TypeMap = {
  1: '跳转到报表',
  2: '跳转到页面'
}
class EditableCell extends React.Component {
  getInput = () => {
    if(this.props.dataIndex == 'type'){
      return <Select style={{width: 160}}>
          <Option value={1}>跳转到报表</Option>
           <Option value={2}>跳转到页面</Option>
      </Select>
    }else{
      return <Input />;
    }
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} 不能为空`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
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
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      editingKey: '',
      columns: [
      {
        title: '字段',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: '30%',
        editable: true,
        render: t => TypeMap[Number(t)]
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: '30%',
        editable: true,
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


  addSearchDom = _ => {
    let index = -(this.props.data.length + 1);
    //console.log(index)
    this.props.data.push({key: index, name: '', type: '', content: ''})
    this.setState({data: this.props.data, editingKey: index})
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(key) {
    //let newData = [...this.props.data];
    let index = this.props.data.findIndex(item => key === item.key);
    //console.log(index)
    this.props.data.splice(index, 1)
    //console.log(this.props.data)
    this.setState({data: this.props.data})
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
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          title={_ => <p>报表穿透</p>}
          size='small'
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          locale={{emptyText: '暂无数据'}}
          rowClassName="editable-row"
          pagination={false}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable