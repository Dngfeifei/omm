import React from 'react'
import {Button, Modal, Divider, TreeSelect, Select} from 'antd'
import { getInsuranceList, deleteInsurance } from '/api/insurance'
import { getPaperList } from '/api/global'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
const ButtonGroup = Button.Group
import InsuranceForm from '/page/insurance/insuranceForm.jsx'
import { handleTreeData } from '/api/tools'
import PaperWall from '/components/PaperWall.jsx'


class InsuranceList extends Common{
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
            title: '缴纳月份（起）',
            dataIndex: 'speriod'
        },{
            title: '缴纳月份（止）',
            dataIndex: 'operiod'
        },{
            title: '是否代理',
            dataIndex: 'isagent',
            render: t => t === 1 ? '是' : '否'
        },{
            title: '备注',
            dataIndex: 'remark'
        },{
            title: ' 影像资料 ',
            width: 300,
            dataIndex: 'operate',
            render: (t, r) => <div>
                <a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r, r.id, `voucher${r.id}`, `thumb_voucher${r.id}`,'insurance_voucher')}}>社保凭证</a>
                <Divider type="vertical" />
                <a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r, r.id, `provec${r.id}`, `thumb_provec${r.id}`, 'insurance_prove_c')}}>社保(企业)证明</a>
                <Divider type="vertical" />
                <a style={{display: 'inline-block'}} onClick={async _ => {this.openPicModel(r, r.id, `provep${r.id}`, `thumb_provep${r.id}`, 'insurance_prove_p')}}>社保(个人)证明</a>
            </div>
        }],
        selected: {},
        loading: true,
        tabledata: [],
        id: null,
        type: '',
        path: '',
        thumb: '',
        fileList: [],
        picmodelConf: {visible: false, item: {}},
        modalconf: {visible: false, item: {}},
    })
    //上传影像资料
    openPicModel = (item, id, path, thumb, type) => {
        this.setState({type})
        let pdfLegal = false
        if(item.city === '武汉'){
            pdfLegal = true
        }
        getPaperList({bid: id, type: type}).then(res => {
            if(res.code == 200){
                this.setState({id, path, thumb, fileList: res.data, picmodelConf: {visible: true, pdfLegal: pdfLegal}})
            }
        })
    }

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        return getInsuranceList(search)
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
        this.handleOk(deleteInsurance, 'id', '删除', 'deleteback')
    }

    done = _ => {
        this.setState({modalconf: {visible: false, item: {}}})
        this.search()
    }

    renderSearch = _ => <div>
        <div className="mgrSearchBar">
            <TreeSelect size='small'
                        style={{ width: 260 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.companys}
                        placeholder="请选择公司"
                        allowClear={true}
                        value={this.state.search.pkCorp}
                        onChange={e => this.changeSearch({pkCorp: e})}
                        treeDefaultExpandAll/>
            <Select size='small' style={{width: 200}}
                    showSearch
                    optionFilterProp="children"
                    placeholder="社保缴纳地"
                    allowClear={true}
                    value={this.state.search.city}
                    onChange={e => this.changeSearch({city: e})}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {this.state.socialcities.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
            </Select>
            <ButtonGroup>
                <Button
                    onClick={this.search}
                    type="primary" icon="search">搜索</Button>
                <Button
                    onClick={_ => this.addmodal('modalconf', '添加社保记录')}
                    type="primary" icon="plus">添加</Button>
                <Button
                    onClick={_ => this.editmodal('modalconf', '编辑社保记录')}
                    type="primary" icon="edit">修改</Button>
                <Button
                    onClick={this.changemodel}
                    type="primary" icon="close">删除</Button>
            </ButtonGroup>
        </div>
    </div>

    rendermodal = _ => <div><InsuranceForm
        onCancel={_ => this.cancelform('modalconf')}
        done={_ => this.done()}
        dict={{companys: this.state.companys, socialcities: this.state.socialcities}}
        config={this.state.modalconf} />
        <PaperWall onCancel={_ => this.cancelform('picmodelConf')}
                   id={this.state.id}
                   type={this.state.type}
                   path={this.state.path}
                   thumb={this.state.thumb}
                   fileList={this.state.fileList}
                   config={this.state.picmodelConf} />
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

export default InsuranceList