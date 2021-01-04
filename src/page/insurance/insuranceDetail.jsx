import React from 'react'
import {Input, Button, Modal, DatePicker, TreeSelect, Select, Upload, Icon, message} from 'antd'
const { MonthPicker } = DatePicker;
import { getInsuranceDetailList, deleteInsuranceDetail, importURL, exportDetailsTemplate } from '/api/insurance'
import { getPaperList } from '/api/global'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import InsuranceDetailForm from '/page/insurance/insuranceDetailForm.jsx'
import { handleTreeData } from '/api/tools'
import { dealBlob } from '/api/tools'


class InsuranceDetail extends Common{
    async componentWillMount () {
        this.search()
        getCompanys({}).then(res => {
            this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
        })
        let codeList = ['socialcities']
        getDictSelectMuti({codeList}).then(res => {
            codeList.forEach(key => {
                this.setState(res.data)
            })
        })
    }

    state = Object.assign({}, this.state, {
        search: Object.assign({condition: ''}, this.state.pageconf),
        socialcities: [],
        companys: [],
        columns: [{
            title: '公司',
            dataIndex: 'pkCorp',
            render: t => this.state.companys.length > 0 ?  this.state.companys.filter(e => e.key === t)[0].title : ''
        },{
            title: '缴纳地',
            dataIndex: 'city'
        },{
            title: '缴纳月份',
            dataIndex: 'month'
        },{
            title: '人员',
            dataIndex: 'name'
        },{
            title: '身份证号',
            dataIndex: 'idnum',
        },{
            title: '个人编号/社保号',
            dataIndex: 'insuranceno',
        },{
            title: '备注',
            dataIndex: 'remark'
        }],
        selected: {},
        loading: true,
        tabledata: [],
        modalconf: {visible: false, item: {}},
        uploadconf: {visible: false, fileList: []},
        fileList: [],
    })


    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        if(search.speriod) search.speriod = search.speriod.format('YYYY-MM')
        if(search.operiod) search.operiod = search.operiod.format('YYYY-MM')
        return getInsuranceDetailList(search)
            .then(res => {
                let data = (f => f(f))(f => list => list.map(val => {
                    let baseItem = Object.assign({}, val, { key: val.id })
                    return baseItem
                }))(res.data.records)
                this.setState({
                    tabledata: data,
                    loading: false,
                    pagination: Object.assign({}, this.state.pagination, {
                        total: res.data.total,
                        current: res.data.current
                    })
                })
            })
    }

    deleteback = _ => {
        this.search()
    }
    delete = _ => {
        this.handleOk(deleteInsuranceDetail, 'id', '删除', 'deleteback')
    }

    done = _ => {
        this.setState({modalconf: {visible: false, item: {}}})
        this.search()
    }
    //打开导入页面
    openupload = _ => {
        let token = localStorage.getItem('token') || ''
        this.setState({token, uploadconf: {visible: true, fileList: []}})
    }
    //下载模版
    downloadTemplate = _ => {
        exportDetailsTemplate().then(blob => {
            dealBlob(blob, '缴纳名单导入模版.xlsx')
        })
    }
    //导入
    handleChange = ({ file, fileList }) => {
        if(file.status == 'done'){
            if(file.response.data && file.response.data.length>0){
                message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
            }else{
                message.success('导入成功')
                this.search()
            }
        }
        this.setState({uploadconf: {visible: true, fileList}})
    }

    renderSearch = _ => <div>
        <div className="mgrSearchBar">
            <TreeSelect size='small'
                        style={{ width: 240 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.companys}
                        placeholder="请选择公司"
                        allowClear={true}
                        value={this.state.search.pkCorp}
                        onChange={e => this.changeSearch({pkCorp: e})}
                        treeDefaultExpandAll/>
            <Select size='small' style={{width: 140}}
                    showSearch
                    optionFilterProp="children"
                    placeholder="社保缴纳地"
                    allowClear={true}
                    value={this.state.search.city}
                    onChange={e => this.changeSearch({city: e})}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {this.state.socialcities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
            </Select>
            <MonthPicker placeholder="缴纳月份(起)" onChange={e => this.changeSearch({speriod: e})} style={{width: 140}} />
            <MonthPicker placeholder="缴纳月份(止)" onChange={e => this.changeSearch({operiod: e})} style={{width: 140}} />
            <Input
                style={{width: 140}}
                value={this.state.search.name}
                allowClear
                onChange={e => this.changeSearch({name: e.target.value})}
                addonBefore="缴纳人" />
            <ButtonGroup>
                <Button
                    onClick={this.search}
                    type="primary" icon="search">搜索</Button>
                <Button
                    onClick={_ => this.addmodal('modalconf', '添加缴纳名单')}
                    type="primary" icon="plus">添加</Button>
                <Button
                    onClick={_ => this.editmodal('modalconf', '编辑缴纳名单')}
                    type="primary" icon="edit">修改</Button>
                <Button
                    onClick={this.changemodel}
                    type="primary" icon="close">删除</Button>
                <Button
                    onClick={this.openupload}
                    type="primary" icon="import">导入</Button>
            </ButtonGroup>
        </div>
    </div>

    rendermodal = _ => <div><InsuranceDetailForm
        onCancel={_ => this.cancelform('modalconf')}
        done={_ => this.done()}
        dict={{companys: this.state.companys, socialcities: this.state.socialcities}}
        config={this.state.modalconf} />
        <Modal title="缴纳名单导入"
               visible={this.state.uploadconf.visible}
               footer={null}
               mask={true}
               width={500}
               onCancel={_ => this.setState({uploadconf: {visible: false}})}
        >
            <p>缴纳名单导入，<a onClick={this.downloadTemplate}>模版下载</a></p>
            <Upload className='attr-upload'
                    action={`${importURL}`}
                    headers={{Authorization: `Bearer ${this.state.token}`}}
                    onChange = {this.handleChange}
                    fileList = {this.state.uploadconf.fileList}
                    multiple={false} >
                <Button>
                    <Icon type="upload" /> 导入数据
                </Button>
            </Upload>
        </Modal>
        <Modal title="信息"
               visible={this.state.visible}
               onOk={this.delete}
               mask={false}
               width={400}
               onCancel={this.changemodel}
               okText="确认"
               cancelText="取消"
        >
            <p>是否删除？</p>
        </Modal></div>

}

export default InsuranceDetail