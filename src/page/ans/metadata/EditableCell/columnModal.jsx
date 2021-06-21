import React, { Component } from 'react'
import {Table, Input, Checkbox, Select, InputNumber, Modal, message} from 'antd';
const { TextArea } = Input;
import { PlusCircleOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { getLists, saveColumnList } from '/api/metaData'

class ColumnModal extends React.Component {
    async componentWillMount () {
        //获得元数据库表集合
        getLists({limit:999, offset: 0}).then(res => {
            this.setState({tables: res.data.records})
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            tables: [],
            inputVisible: false,
            inputValue: '',
            inputItem: {},
            columns: [
                {
                    title: '序号',
                    dataIndex: 'ind',
                    width: '3%',
                    align: 'center',
                    render: (t, r) => this.props.data.indexOf(r) + 1
                },
                {
                    title: '字段名称',
                    dataIndex: 'name',
                    align: 'center',
                    width: '10%',
                    render: (t, r) => this.props.disabled ? t : <Input size='small' value={t} onChange={e => this.refresh(r,'name',e.target.value)}  />,
                },
                {
                    title: '显示名称',
                    dataIndex: 'showName',
                    align: 'center',
                    width: '10%',
                    render: (t, r) => this.props.disabled ? t : <Input size='small' value={t} onChange={e => this.refresh(r,'showName',e.target.value)}  />,
                },
                {
                    title: '描述信息',
                    dataIndex: 'comment',
                    align: 'center',
                    width: '10%',
                    render: (t, r) => this.props.disabled ? t : <Input size='small' value={t} onChange={e => this.refresh(r,'comment',e.target.value)}  />,
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    align: 'center',
                    width: '6%',
                    render: (t, r) => this.props.disabled ? t : <Select style={{width: '100%'}} size='small' value={t} onChange={e => this.refresh(r,'type',e)}>
                        <Select.Option value='varchar'>字符</Select.Option>
                        <Select.Option value='number'>数字</Select.Option>
                        <Select.Option value='date'>日期</Select.Option>
                        <Select.Option value='datetime'>时间</Select.Option>
                        <Select.Option value='timestamp'>时间戳</Select.Option>
                    </Select>,
                },
                {
                    title: '默认值',
                    dataIndex: 'defaultValue',
                    align: 'center',
                    width: '8%',
                    render: (t, r) => this.props.disabled ? t : this.getDefautValueDom(t, r),
                },
                {
                    title: '长度',
                    dataIndex: 'len',
                    align: 'center',
                    width: '5%',
                    render: (t, r) => this.props.disabled ? t : <InputNumber size='small' style={{width: '100%'}} value={t} onChange={e => this.refresh(r,'len',e)} />,
                },
                {
                    title: '精度',
                    dataIndex: 'acc',
                    align: 'center',
                    width: '5%',
                    render: (t, r) => this.props.disabled ? t : <InputNumber size='small'  style={{width: '100%'}} value={t} onChange={e => this.refresh(r,'acc',e)} />,
                },
                {
                    title: '必填',
                    dataIndex: 'required',
                    align: 'center',
                    width: '4%',
                    render: (t, r) => this.props.disabled ? t : <Checkbox value={1} checked={t === 1} onChange={e => this.refresh(r,'required', e.target.checked ? 1 : 0)}></Checkbox>
                },
                {
                    title: '主键',
                    dataIndex: 'iskey',
                    align: 'center',
                    width: '4%',
                    render: (t, r) => this.props.disabled ? t : <Checkbox value={1} checked={t === 1} onChange={e => this.refresh(r,'iskey', e.target.checked ? 1 : 0)}></Checkbox>
                },
                {
                    title: '外键关联',
                    dataIndex: 'relationTable',
                    align: 'center',
                    width: '10%',
                    render: (t, r) => this.props.disabled ? t : <Select value={t} onChange={e => this.refresh(r,'relationTable',e)}
                        showSearch allowClear={true}
                        style={{width: '100%'}} size='small'
                        placeholder="选择关联表"
                        optionFilterProp="children"
                        dropdownStyle={{width: '300px'}} dropdownMatchSelectWidth={false}
                        filterOption={(input, option) => option.props.children.join().indexOf(input) >= 0}>
                        {this.state.tables.map(t => <Select.Option value={t.tableName} key={t.tableName}>{t.tableName}({t.name})</Select.Option>)}
                    </Select>
                },
                {
                    title: '启用',
                    dataIndex: 'status',
                    align: 'center',
                    width: '4%',
                    render: (t, r) => this.props.disabled ? t : <Checkbox value={1} checked={t === 1} onChange={e => this.refresh(r,'status', e.target.checked ? 1 : 0)}></Checkbox>
                },
                {
                    title: '主表外键',
                    dataIndex: 'isMainRelation',
                    align: 'center',
                    width: '4%',
                    render: (t, r) => this.props.disabled ? t : <Checkbox value={1} checked={t === 1} onChange={e => this.refresh(r,'isMainRelation', e.target.checked ? 1 : 0)}></Checkbox>
                },
                {
                    title: '显示',
                    dataIndex: 'isShow',
                    align: 'center',
                    width: '4%',
                    render: (t, r) => this.props.disabled ? t : <Checkbox value={1} checked={t === 1} onChange={e => this.refresh(r,'isShow', e.target.checked ? 1 : 0)}></Checkbox>
                },
                {
                    title: '数据范围',
                    dataIndex: 'scopeSql',
                    align: 'center',
                    width: '8%',
                    render: (t, r) => <div> {this.getSuffix(t)} {this.props.disabled ? null : <EditOutlined onClick={_ => this.setState({inputVisible: true, inputItem: r, inputValue: t})} />}</div>
                },
                {
                    title: '操作',
                    dataIndex: 'operator',
                    align: 'center',
                    width: '5%',
                    render: (t, r) => this.props.disabled ? '' :<div>
                        <PlusCircleOutlined onClick={_ => this.addRow(r.key)} />
                        <MinusCircleOutlined style={{paddingLeft: '6px'}} onClick={_ => this.deleteRow(r.key)} /></div>,
                },
            ],
        };
    }
    //获得缩略显示
    getSuffix = t => {
        if(!t || t.length < 6) return t
        return t.substr(0,5) + '...'
    }
    //获得默认值DOM
    getDefautValueDom = (t, r) => {
        return r.type === 'datetime' || r.type === 'timestamp' ? <Select style={{width: '100%'}} size='small' value={t} onChange={e => this.refresh(r,'defaultValue',e)}>
            <Select.Option value='CREATE_TIME'>创建时间</Select.Option>
            <Select.Option value='UPDATE_TIME'>更新时间</Select.Option>
        </Select> : <Input size='small' value={t} onChange={e => this.refresh(r,'defaultValue',e.target.value)}  />
    }

    refresh = (r, prop, value) => {
        r[prop] = value
        const details = [...this.props.data]
        this.props.refresh(details)
    }
    //添加一行
    addRow = key => {
        const row = {key: -(this.state.count++), status: 1}
        let index = this.props.data.findIndex(item => key === item.key) + 1
        const details = [...this.props.data]
        details.splice(index, 0, row)
        this.props.refresh(details)
    }
    //删除一行
    deleteRow = key => {
        if(this.props.data.length <= 1){
            return
        }
        let index = this.props.data.findIndex(item => key === item.key);
        const details = [...this.props.data]
        details.splice(index, 1)
        this.props.refresh(details)
    }
    //保存数据范围
    handleInputOk = _ => {
        const r = this.state.inputItem
        this.refresh(r,'scopeSql', this.state.inputValue)
        this.setState({inputVisible: false, inputValue: ''})
    }
    //保存数据
    handleOk = _ => {
        if(!this.state.loading) {
            let msgs = this.checkLegal()
            if(msgs && msgs.length > 0){
                message.error(msgs.map((t, i) => <p key={i}>{t}</p>))
                return
            }
            this.setState({loading: true})
            const obj = {id: this.props.tableId, metaDataList: this.props.data.map(e => {
                    e.id = e.key > 0 ? e.key : null
                    return e
                })}
            saveColumnList(obj).then(res => {
                this.setState({loading: false})
                if (res.code === 200) {
                    message.success('保存成功')
                    this.props.onCancel()
                }
            })
        }
    }
    //数据校验
    checkLegal = _ => {
        let msgs = []
        let key = 0
        this.props.data.forEach((e, ind) => {
            if(!e.name){
                msgs.push(`第${ind + 1}行，字段名称不可以为空`)
            }
            if(!e.showName){
                msgs.push(`第${ind + 1}行，显示名称不可以为空`)
            }
            if(!e.type){
                msgs.push(`第${ind + 1}行，类型不可以为空`)
            }
            if(e.iskey === 1){ key++ }
        })
        if(key !== 1){
            msgs.push('请选择唯一主键')
        }
        return msgs
    }

    render() {
        return (
            <Modal title={`字段明细：${this.props.title}`}
                   onOk={this.handleOk}
                   visible={this.props.visible}
                   confirmLoading={this.state.loading}
                   bodyStyle={{padding: 0}}
                   onCancel={_ => this.props.onCancel()}
                   okText="保存"
                   width='94%'
                   style={{top: 50, marginBottom: 100}}
                   cancelText="取消">
            <Table
                size='small'
                className='tinyEditTable'
                style={{width: '100%', margin: 'auto'}}
                bordered
                dataSource={this.props.data}
                columns={this.state.columns}
                locale={{emptyText: '暂无数据'}}
                pagination={false}
            />
                <Modal title="数据范围" visible={this.state.inputVisible}
                       onOk={this.handleInputOk}
                       onCancel={_ => this.setState({inputVisible: false})}
                       okText="保存"
                       width='400px'
                       cancelText="取消">
                    <TextArea rows={4} value={this.state.inputValue} onChange={e => this.setState({inputValue: e.target.value})}  />
                </Modal>
            </Modal>
        );
    }
}

export default ColumnModal