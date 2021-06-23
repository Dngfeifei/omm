/*
    消息通知
*/
import React, { Component } from 'react'
import { Row,Col,Table,Tabs,Button} from 'antd'
import ModalDom from '@/components/modal'
import Pagination from '/components/pagination'//分页组件
const { TabPane } = Tabs;

class Notice extends Component {

    componentWillMount = _ => {
       
    }
    state = {
        columns0:[{
            title: '消息标题',
            dataIndex: 'custNum',
            align: 'center'
        },
        {
            title: '接收时间',
            dataIndex: 'projectNumber',
            align: 'center',
        },
        {
            title: '发送人姓名',
            dataIndex: 'custName',
            align: 'center',
        },
        {
            title: '系统账号',
            dataIndex: 'projectName',
            align: 'center',
        },
        {
            title: '手机号码',
            dataIndex: 'projectName1',
            align: 'center',
        },
        {
            title: '邮箱地址',
            dataIndex: 'projectName2',
            align: 'center',
        }],
        columns1:[{
            title: '消息标题',
            dataIndex: 'custNum',
            align: 'center'
        },
        {
            title: '发送时间',
            dataIndex: 'projectNumber1',
            align: 'center',
        },
        {
            title: '接收人姓名',
            dataIndex: 'custName1',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '系统账号',
            dataIndex: 'projectName1',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '手机号码',
            dataIndex: 'projectName2',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '邮箱地址',
            dataIndex: 'projectName3',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        }],
        selectType:'0',//选择查看消息的类型 0是我接收的 1是我发送的
        tableData:[],
        tableSelecteds:[],
        modalVisible: false,
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
    }
    handleClick = (pa) => {
        let modalVisible = pa;
        this.setState({modalVisible});
    }
    //点击行选中选框
    onRow = (record,index) => {
        return {
            onClick: () => {
                let selectedKeys = [`key${index}`], selectedItems = [record];
                this.onTableSelect(selectedKeys, selectedItems);
            }
        }
    }
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        // let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        },()=>{
            this.searchRoleFun(this.state.searchListID,1)
        })
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableSelectedInfo: []
        },()=>{
            this.searchRoleFun(this.state.searchListID,1)
        })
    }
    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info
        })
    };
    render = _ =>{
        let st = {boxShadow: '10px 10px 5px #888888'}, columns = this.state[`columns${this.state.selectType}`];
        return (<ModalDom title='消息通知' width={1000} destroyOnClose={true} visible={true} onOk={() => this.handleClick(false)} onCancel={this.props.onCancel}>
            <Row className="sendBox">
                <Col className="senBoxSon" onClick={()=> this.setState({selectType:'0'})} style={this.state.selectType == 0 ? st : {}} xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span>我接收的</span>
                    <span style={{ marginLeft: 15 }}>10</span>
                </Col>
                <Col className="senBoxSon" onClick={()=> this.setState({selectType:'1'})} style={this.state.selectType == 1 ? st : {}} xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span>我发送的</span>
                    <span style={{ marginLeft: 15 }}>10</span>
                </Col>
                <Col className="senBoxSon" xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span style={{marginRight:10}}>+</span><span>发送消息</span>
                </Col>
            </Row>
            {/* <Tabs tabBarExtraContent={<Button>操作区</Button>}>
                <TabPane tab="未读（6）" key="1"></TabPane>
                <TabPane tab="已读（10）" key="2"></TabPane>
            </Tabs> */}
            <Row style={{ marginTop: 10 }}>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="info" onClick={this.delRoleItem}>删除</Button>
                </Col>
            </Row>
            <div className="tableParson">
                <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.tableData} columns={columns} style={{ marginTop: 10, maxHeight: '86%' }} rowKey={(record, index) => `key${index}`} pagination={false} scroll={{ y: 450 }} size="small" />
                <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
            </div>
        </ModalDom>)
    } 
}
export default Notice