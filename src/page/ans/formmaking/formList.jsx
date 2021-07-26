import React, { useEffect } from 'react'
import { Button, Input, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { ADD_PANE, GET_MENU, TOGGLE } from '/redux/action'
import { getFormList, deletMakeForm } from '/api/form'
import Common from '/page/common.jsx'
import ReactMkForming from '/page/ans/formmaking/lib/Container.jsx'
import FormMeta from '/page/ans/formmaking/lib/FormMeta'
import FormRelease from '/page/ans/formmaking/lib/FormRelease'
import styled from '@emotion/styled'

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
`

class FormList extends Common {
  componentWillMount() {
    this.search()
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.refreshData_demandList === 1) {
      this.search()
      this.props.resetRefresh({ refreshData_demandList: 0 })
    }
  }

  add = (item) => {
    let pane = {
      title: item.name,
      key: item.id,
      url: `ans/formmaking/FormPreview.jsx`,
      params: { aaa: 1 }
    }
    this.props.add(pane)
  }

  state = Object.assign({}, this.state, {
    isFormMetaOpen: false,
    isFormReleaseOpen: false,
    selectedFormId: '',
    search: Object.assign({
      name: ''
    }, this.state.pageconf),
    columns: [{
      title: '表单名称',
      width: 120,
      dataIndex: 'name',
      render: (t, r) => {
        return (
          <a key='1'
            style={{ display: 'inline-block', width: 60 }}
            onClick={_ => this.handleEditFormMeta(r.id)}
          >{t}</a>
        )
      }
    }, {
      title: '表名字',
      width: 220,
      dataIndex: 'tableName'
    }, {
      title: '表单key',
      width: 120,
      dataIndex: 'code'
    }, {
      title: '所属数据库',
      width: 120,
      dataIndex: ['dataSource', 'name']
    }, {
      title: '版本号',
      dataIndex: 'version',
      ellipsis: true,
      width: 120
    }, {
      title: '操作',
      dataIndex: 'operator',
      render: (t, r) => [
        <a key='1' style={{ display: 'inline-block', width: 60 }} onClick={_ => this.design(r.id)}>设计</a>,
        <Button key='2' type="link" onClick={() => this.handleDelete(r.id)}>删除</Button>,
        <Button key='3' type="link" onClick={() => this.add(r)}>预览</Button>,
        <Button key='4' type="link" onClick={() => this.handleRelease(r.id)}>发布</Button>,
      ]
    }],
    loading: false,
    selectedtable: true,
    editingId: '',
    pagesizechange: true
  })

  design = (id) => {
    this.setState({ formingVisible: true, editingId: id })
  };

  handleEditFormMeta = formId => {
    this.setState({
      selectedFormId: formId,
      isFormMetaOpen: true,
    })
  }

  handleReleaseForm = formId => {
    this.setState({
      selectedFormId: formId,
      isFormReleaseOpen: true,
    })
  }

  search = async _ => {
    await this.setState({ loading: true, selected: {} })
    let search = Object.assign({}, this.state.search)
    search.pageSize = search.limit
    search.pageNo = (search.offset/search.pageSize)+1
    return getFormList(search)
      .then(res => {
        let data = (f => f(f))(f => list => list.map(val => {
          let baseItem = Object.assign({}, val, { key: val.id })
          return baseItem
        }))(res.page.list)
        this.setState({
          tabledata: data,
          loading: false,
          pagination: Object.assign({}, this.state.pagination, {
            total: parseInt(res.page.count),
            current: search.offset/search.pageSize + 1
          })
        })
      })
  }

  handleDelete = (id) => {
    if (!id && (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length)) {
      message.warn('请选择表单')
      return
    }
    Modal.confirm({
      title: '确定要删除该选项吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return deletMakeForm({ ids: id ? [id] : this.state.selected.selectedKeys }).then(res => {
          message.success(res.msg)
          this.search()
        })
      },
    });
  }
  handleRelease = (id) => {
    const form = this.state.tabledata.find(item => {
      return item.id === id
    })
    console.log(form);
    if (!form.source) {
      message.warn('请先设计表单')
      return
    }
    this.setState({
      selectedFormId: id,
      isFormReleaseOpen: true,
    })
  }

  handleCloseModel = () => {
    this.setState({formingVisible: false}, this.search)
  }

  handleReset = () => {
    this.setState({
      search: {
        ...this.state.search,
        name: ''
      }
    }, this.search)
  }

  renderSearch = _ => (
    <div className="mgrSearchBar">
      <SearchWrap className="mb20">
        <div className="w200">
          <Input.Search
            width={200}
            enterButton="搜索"
            value={this.state.search.name}
            onChange={e => this.setState({
              search: {
                ...this.state.search,
                name: e.target.value,
              }
            })}
            onSearch={() => { this.search() }}
          />
        </div>
        <Button onClick={this.handleReset} style={{marginLeft: 20}}>重置</Button>
      </SearchWrap>
      <div className="mb20">
        <Button
          onClick={() => {
            this.setState({ isFormMetaOpen: true })
          }}
          type="primary"
          className="mr20"
        >新增</Button>
        <Button onClick={_ => this.handleDelete()}>删除</Button>
      </div>
    </div>
  )

  rendermodal = () => {
    const closeFormMeta = () => {
      this.setState({
        isFormMetaOpen: false,
        selectedFormId: '',
      })
      this.search()
    }
    return (
      <React.Fragment>
        {this.state.isFormMetaOpen ? (
          <FormMeta
            open={this.state.isFormMetaOpen}
            onOk={closeFormMeta}
            onCancel={closeFormMeta}
            id={this.state.selectedFormId}
          />
        ) : null}

        {this.state.isFormReleaseOpen ? (
          <FormRelease
            open={this.state.isFormReleaseOpen}
            id={this.state.selectedFormId}
            onOk={() => { this.setState({ isFormReleaseOpen: false }) }}
            onCancel={() => { this.setState({ isFormReleaseOpen: false }) }}
          />
        ) : null}


        <Modal title="表单设计" visible={this.state.formingVisible}
          onCancel={_ => this.setState({ formingVisible: false })}
          style={{ top: 0, paddingBottom: 0, height: '100%' }}
          width={window.innerWidth}
          className="form-edit-modal"
          footer={null}>
          {this.state.formingVisible && <ReactMkForming hideModal={this.handleCloseModel} id={this.state.editingId} />}
        </Modal>
      </React.Fragment>
    )
  }


}

export default connect(state => ({
  menu: state.global.menu,
  collapsed: state.global.collapsed,
  activeKey: state.global.activeKey,
}), dispath => ({
  add(pane) { dispath({ type: ADD_PANE, data: pane }) },
}))(FormList)
