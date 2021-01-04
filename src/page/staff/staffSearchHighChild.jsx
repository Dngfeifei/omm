import React from 'react'
import {Table, Input, Icon, Select, TreeSelect} from 'antd';
import { cities } from '/api/cities'

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
    {k: 'cert_name', v: '证书名称'},
    {k: 'cert_vender', v: '证书厂商'},
    {k: 'cert_nick', v: '证书简称'},
    {k: 'cert_level', v: '证书级别'},
    {k: 'certout', v: '证书是否过期', type: 'select', options: 'certouts'}
]

class HighSearchChild extends React.Component {
    async componentWillMount () {

    }
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            certouts:[{code: '0', name: '否'},{code: '1', name: '是'}],
            educationals: [],
            cities: cities,
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
                    render: (t, r) =>  this.getSelectDom(r)
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

    //获得比较值
    getSelectDom = obj => {
        const defaultDom = <Select onChange={e => {obj.compare = e}} style={{width: 100}}>
            {TypeMap.map((val, index) => <Option value={val.k} key={index}>{val.v}</Option>)}
        </Select>
        if(!obj || !obj.column) return defaultDom
        const r = columnMap.filter(o => o.k === obj.column)[0];
        if(r.k === 'cert_name' || r.k === 'cert_nick'){
            return <Select onChange={e => {obj.compare = e}} style={{width: 100}}>
                <Option value='LIKE'>包含</Option>
            </Select>
        }
        return defaultDom
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
        this.props.refresh(this.props.data)
    }

    render() {
        return (
                    <Table
                        title={_ => <div>拥有证书 </div>}
                        size='small'
                        bordered
                        dataSource={this.props.data}
                        columns={this.state.columns}
                        locale={{emptyText: '暂无数据'}}
                        pagination={false}
                    />
        );
    }
}

export default HighSearchChild