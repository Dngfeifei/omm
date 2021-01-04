import React, { Component } from 'react'
import {Table, Input, Icon, Select, Button, TreeSelect} from 'antd';
import { getDictSelectMuti, getCompanys } from '/api/dict'
import { getDeptSelect } from '/api/mtn'
import { handleTreeData } from '/api/tools'
import StaffSearchHighChild from '/page/staff/staffSearchHighChild.jsx'

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
    {k: 'pk_corp', v: '公司' , type: 'tree', options: 'companies'},
    {k: 'educational', v: '学历', type: 'select', options: 'educationals'},
    {k: 'province', v: '省份', type: 'select', options: 'provinces'},
    {k: 'city', v: '地市', type: 'select', options: 'cities'},
    {k: 'bussiyear', v: '工作年限'},
    {k: 'specialty', v: '所学专业'},
    {k: 'dept_id', v: '部门', type: 'tree', options: 'depts'},
    {k: 'parentDeptId', v: '上级部门', type: 'tree', options: 'depts'}
]

class HighSearch extends React.Component {
    async componentWillMount () {
        getCompanys({}).then(res => {
            this.setState({companies: handleTreeData(res.data, 'name', 'code', 'children')})
        })
        getDeptSelect({}).then(res => {
            this.setState({depts: handleTreeData(res.data, 'name', 'id', 'childrenDepts')})
        })
        let codeList = ['educationals', 'provinces']
        getDictSelectMuti({codeList}).then(res => {
            this.setState({educationals: res.data.educationals, provinces: res.data.provinces})
            const cities = []
            res.data.provinces.forEach(e => {
                cities.push(...e.children)
            })
            this.setState({cities})
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            certouts:[{code: '0', name: '否'},{code: '1', name: '是'}],
            educationals: [],
            cities: [],
            provinces: [],
            companies: [],
            depts: [],
            columns: [
                {
                    title: '左括号',
                    dataIndex: 'leftc',
                    width: '8%',
                    render: (t, r) => <Input onChange={e => {r.leftc = e.target.value}} defaultValue='(' />,
                },
                {
                    title: '字段',
                    dataIndex: 'column',
                    width: '20%',
                    render: (t, r) => <Select onChange={e => {r.column = e; this.props.refresh(this.props.data)}} style={{width: '100%'}}>
                        {columnMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
                    </Select>,
                },
                {
                    title: '比较符',
                    dataIndex: 'compare',
                    width: '10%',
                    render: (t, r) =>  <Select onChange={e => {r.compare = e}} style={{width: 100}}>
                        {TypeMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
                    </Select>
                },
                {
                    title: '条件值',
                    dataIndex: 'value',
                    width: '20%',
                    render: (t, r) => this.getValueDom(r)
                },
                {
                    title: '右括号',
                    dataIndex: 'rightc',
                    width: '8%',
                    render: (t, r) => <Input onChange={e => {r.rightc = e.target.value}} defaultValue=')' />,
                },
                {
                    title: '逻辑值',
                    dataIndex: 'logic',
                    width: '10%',

                    render: (t, r) => <Select onChange={e => {r.logic = e}} style={{width: 100}} defaultValue='and'>
                        {CompareMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
                    </Select>,
                },
                {
                    title: <a onClick={_ => this.addSearchDom()} type="primary"><Icon type="plus" style={{fontSize: '16px'}} /></a>,
                    align: 'center',
                    dataIndex: 'operation',
                    render: (text, record) =>  <a onClick={() => this.delete(record.key)}>删除</a>,
                },
            ],
        };
    }

    //获得备选值 -- DOM
    getValueDom = obj => {
        if(!obj || !obj.column) return null
        const r = columnMap.filter(o => o.k === obj.column)[0];
        if(r.type === 'tree'){
            return <TreeSelect size='small'
                               showSearch
                               optionFilterProp="children"
                               filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                               style={{ width: 200 }}
                               dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                               treeData={this.state[r.options]}
                               treeNodeFilterProp="title"
                               onChange={e => {obj.value = e}} />
        }else if(r.type === 'select'){
            return <Select onChange={e => {obj.value = e}} style={{width: 100}} showSearch
           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {this.state[r.options].map(t => <Option value={t.code} key={t.code}>{t.name}</Option>)}
            </Select>
        }else{
            return <Input onChange={e => {obj.value = e.target.value}} />
        }
    }

    addSearchDom = async _ => {
        if(this.state.editingKey){
            await this.save(this.props.form, this.state.editingKey)
        }
        let index = this.state.count + 1;
        this.props.data.push({key: index, leftc: '(', rightc: ')', logic: 'and'})
        this.setState({count: index})
    }

    delete(key) {
        let index = this.props.data.findIndex(item => key === item.key);
        this.props.data.splice(index, 1)
        this.props.refresh()
    }
    //添加-证书
    addChild = _ => {
        this.props.childs.push([{key: 0, leftc: '(', rightc: ')', logic: 'and'}])
        this.props.refreshChild()
    }

    //清空高级搜索
    clearSearchprops = _ => {
        this.props.data.splice(0, this.props.data.length)
        this.props.refresh()
        this.props.childs.splice(0, this.props.childs.length)
        this.props.refreshChild()
    }
    //高级搜索
    doHighSearch = async _ => {
        // console.log(this.props.data)
        this.props.handler()
    }

    render() {
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
                <p style={{display: 'block', width: '380px', float: 'right', color: 'red', fontSize: '12px'}}>
                    未选择公司时，默认查询北京银信长远科技股份有限公司的员工</p>
                    <Table
                        size='small'
                        bordered
                        dataSource={this.props.data}
                        columns={this.state.columns}
                        locale={{emptyText: '暂无数据'}}
                        pagination={false}
                    />
                <Button type="primary" size="small" onClick={_ => this.addChild()}>
                    <Icon type="plus" /> 同时拥有证书 </Button>
                {this.props.childs.map((e,i) =>
                    <StaffSearchHighChild data={e} key={i}
                      refresh={_ => this.props.refresh()}
                      refreshChild={_ => this.props.refreshChild()}
                    />
                )}
                </div>
        );
    }
}

export default HighSearch