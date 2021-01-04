import React from 'react'
import {Button, TreeSelect, Select, Input, DatePicker, message} from 'antd'
const { MonthPicker } = DatePicker;
import { getMyContApply } from '/api/contapply'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
import { downloadPathURL } from '/api/global'
import { listPerson, downloadByPerson } from '/api/insurance'
import { handleTreeData, downloadByUrl } from '/api/tools'


class InsurancePersonView extends Common{
    async componentWillMount () {
        // this.search()
        getCompanys({}).then(res => {
            this.setState({companys: handleTreeData(res.data, 'name', 'code', 'children')})
        })
        let codeList = ['socialcities']
        getDictSelectMuti({codeList}).then(res => {
            codeList.forEach(key => {
                this.setState(res.data)
            })
        })
        getMyContApply({type : 'allstaff'}).then(res => {
            this.setState({processes: res.data})
        })
    }

    state = Object.assign({}, this.state, {
        search: Object.assign({condition: ''}, this.state.pageconf),
        socialcities: [],
        companys: [],
        processes: [],
        columns: [{
            title: '公司',
            dataIndex: 'pkCorp',
            width: 260,
            render: t => this.state.companys.length > 0 ?  this.state.companys.filter(e => e.key === t)[0].title : ''
        },{
            title: '人员',
            width: 100,
            dataIndex: 'name',
        },{
            title: '缴纳地',
            width: 100,
            dataIndex: 'city'
        },{
            title: '缴纳月份（起）',
            width: 140,
            dataIndex: 'speriod'
        },{
            title: '缴纳月份（止）',
            dataIndex: 'operiod'
        }],
        selected: {},
        loading: false,
        tabledata: [],
        selecttype: 'checkbox',
        picLoading: false,
        modalconf: {visible: false, item: {}},
    })

    //多份资料打包下载
    downloadMuti = async _ => {
        if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
            this.setState({picLoading: true})
            downloadByPerson(this.state.selected.selectedItems).then(res => {
                const name = `社保资料.zip`
                this.setState({picLoading: false})
                let url = downloadPathURL + `?path=${res.data}&name=${name}&token=` + localStorage.getItem('token')
                downloadByUrl(url)
            })
        } else {
            message.warning('请至少选中表格中的一条记录！')
        }
    }

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        if(search.speriod) search.speriod = search.speriod.format('YYYY-MM')
        if(search.operiod) search.operiod = search.operiod.format('YYYY-MM')
        return listPerson(search)
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

    renderSearch = _ => <div>
        <div className="mgrSearchBar">
            <Select size='small' style={{width: 300}}
                    showSearch
                    optionFilterProp="children"
                    placeholder="人员申请流程"
                    allowClear={true}
                    dropdownMatchSelectWidth={false}
                    value={this.state.search.applyId}
                    onChange={e => this.changeSearch({applyId: e})}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {this.state.processes.map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
            </Select>
            <TreeSelect size='small'
                        style={{ width: 220 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.state.companys}
                        placeholder="请选择公司"
                        allowClear={true}
                        value={this.state.search.pkCorp}
                        onChange={e => this.changeSearch({pkCorp: e})}
                        treeDefaultExpandAll/>
            <Input
                style={{width: 140}}
                value={this.state.search.name}
                allowClear
                onChange={e => this.changeSearch({name: e.target.value})}
                addonBefore="缴纳人" />
            <MonthPicker placeholder="缴纳月份(起)" onChange={e => this.changeSearch({speriod: e})} style={{width: 140}} />
            <MonthPicker placeholder="缴纳月份(止)" onChange={e => this.changeSearch({operiod: e})} style={{width: 140}} />
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
            <Button
                onClick={this.search}
                type="primary" icon="search">搜索</Button>
            <Button type="primary" icon="download" loading={this.state.picLoading} onClick={this.downloadMuti}>
                打包下载
            </Button>
        </div>
    </div>

    rendermodal = _ => <div></div>

}

export default InsurancePersonView