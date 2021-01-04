import React from 'react'
import {Button, DatePicker, TreeSelect, Select, message} from 'antd'
const { MonthPicker } = DatePicker;
import { getInsuranceList, downloadByCity } from '/api/insurance'
import { downloadPathURL } from '/api/global'
import { getDictSelectMuti, getCompanys } from '/api/dict'
import Common from '/page/common.jsx'
import { handleTreeData, downloadByUrl } from '/api/tools'


class InsuranceCityView extends Common{
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
        }],
        selected: {},
        selecttype: 'checkbox',
        loading: false,
        tabledata: [],
        picLoading: false,
        modalconf: {visible: false, item: {}},
    })

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        if(search.speriod) search.speriod = search.speriod.format('YYYY-MM')
        if(search.operiod) search.operiod = search.operiod.format('YYYY-MM')
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
    //多份资料打包下载
    downloadMuti = async _ => {
        if (this.state.selected.selectedKeys && this.state.selected.selectedKeys.length) {
            this.setState({picLoading: true})
            downloadByCity(this.state.selected.selectedKeys).then(res => {
                const name = `社保资料.zip`
                this.setState({picLoading: false})
                let url = downloadPathURL + `?path=${res.data}&name=${name}&token=` + localStorage.getItem('token')
                downloadByUrl(url)
            })
        } else {
            message.warning('请至少选中表格中的一条记录！')
        }
    }


    renderSearch = _ => <div>
        <div className="mgrSearchBar">
            <TreeSelect size='small'
                        style={{ width: 220 }}
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

export default InsuranceCityView