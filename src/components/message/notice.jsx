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
        columns:[{
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
            dataIndex: 'projectName',
            align: 'center',
        },
        {
            title: '邮箱地址',
            dataIndex: 'projectName',
            align: 'center',
        }],
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
    render = _ =>
        <ModalDom title='消息通知' width={1000} destroyOnClose={true} visible={true} onOk={()=>this.handleClick(false)} onCancel={this.props.onCancel}>
            <Row className="sendBox">
                <Col className="senBoxSon" style={{height:60,cursor:'pointer',backgroundColor:'#03bf16',fontSize:18,color:'white',display:'flex',justifyContent:'center',alignItems:'center'}} xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span>我接收的</span>
                    <span style={{marginLeft:15}}>10</span>
                </Col>
                <Col className="senBoxSon" style={{height:60,cursor:'pointer',backgroundColor:'#02a7f0',fontSize:18,color:'white',display:'flex',justifyContent:'center',alignItems:'center'}} xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span>我发送的</span>
                    <span style={{marginLeft:15}}>10</span>
                </Col>
                <Col className="senBoxSon" style={{height:60,cursor:'pointer',backgroundColor:'#f2f2f2',fontSize:18,color:'#02a7f0',display:'flex',justifyContent:'center',alignItems:'center'}} xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <span>发送消息</span>
                </Col>
            </Row>
            <Tabs tabBarExtraContent={<Button>操作区</Button>}>
                <TabPane tab="未读（6）" key="1"></TabPane>
                <TabPane tab="已读（10）" key="2"></TabPane>
            </Tabs>
            <div className="tableParson">
                <Table bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "radio" }} dataSource={this.state.tableData} columns={this.state.columns} style={{ marginTop: '20px',maxHeight:'86%' }} rowKey={(record, index) => `key${index}`} pagination={false} scroll={{y:450}} size="small" />
                <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
            </div>
        </ModalDom>
}
export default Notice