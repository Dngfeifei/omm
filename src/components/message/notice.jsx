/*
    消息通知
*/
import React, { Component } from 'react'
import { Row,Col,Table,Tabs,Button,Tooltip,message,Input,Modal} from 'antd'
import ModalDom from '@/components/modal'
import Pagination from '/components/pagination'//分页组件
import { getNoticeTable,getDelete,getDoRead,getReadNum} from '/api/systemMessage.js'

// 引入 富文本编辑器组件
import Editor from "@/components/editor"
// const { TabPane } = Tabs;
const {TextArea} = Input;
const { confirm } = Modal;
class Notice extends Component {
    constructor (props){
        super(props)
        this.state = {
            detailsVisible:false,//消息详情展示框
            detailsMessage:'',//消息详情内容
            columnsreceive:[{
                title: '消息标题',
                dataIndex: 'msgTitle',
                width:130,
                align: 'center',
                render: (text,row,index) => {
                    let st = {};
                    if(row.isRead == 0){
                        // st['fontWeight'] = 600;
                        st['color'] = 'red';
                    }
                    return (<span>
                                <a onClick={(e) => this.onRead(e,row.id,row.msgContent)} style={st}>点击查看消息详情</a>
                            </span>)
                }
            },
            {
                title: '消息分类',
                dataIndex: 'msgType',
                align: 'center',
                render: text => {if(text == 1){return '系统消息'}else{return '邮件消息'}}
            },
            {
                title: '接收时间',
                dataIndex: 'receiveTime',
                align: 'center',
                render: this.fomatterRead
            },
            {
                title: '发送人姓名',
                dataIndex: 'realName',
                align: 'center',
                render: this.fomatterRead
            },
            {
                title: '系统账号',
                dataIndex: 'userName',
                align: 'center',
                render: this.fomatterRead
            },
            {
                title: '手机号码',
                dataIndex: 'mobilePhone',
                align: 'center',
                render: this.fomatterRead
            },
            {
                title: '邮箱地址',
                dataIndex: 'email',
                align: 'center',
                ellipsis: true,
                render: this.fomatterRead
            }],
            columnssend:[{
                title: '消息标题',
                dataIndex: 'msgTitle',
                width:130,
                align: 'center',
                render: (text,row,index) => {
                    return (<span>
                                <a onClick={(e) => this.onRead(e,row.id,row.msgContent,row.msgType)} >点击查看消息详情</a>
                            </span>)
                }
            },
            {
                title: '消息分类',
                dataIndex: 'msgType',
                align: 'center',
                render: text => {if(text == 1){return '系统消息'}else{return '邮件消息'}}
            },
            {
                title: '发送时间',
                dataIndex: 'sendTime',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },
            {
                title: '接收人姓名',
                dataIndex: 'realName',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },
            {
                title: '系统账号',
                dataIndex: 'userName',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },
            {
                title: '手机号码',
                dataIndex: 'mobilePhone',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },
            {
                title: '邮箱地址',
                dataIndex: 'email',
                align: 'center',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            selectType:'receive',//选择查看消息的类型 receive 是我接收的 send是我发送的
            tableData:[],
            tableLoading:true,
            tableSelecteds:[],
            modalVisible: false,
            // 分页传参配置
            pageConf:{
                offset:0,
                limit:10
            },
            // 分页配置
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
            //我发送的消息已读未读人数参数
            readParams:{
                type:undefined,
                readName: "",
                readNum: 0,
                unreadName: "杨晓峰,郭立",
                unreadNum: 0
            }
        }
    }
    //点击查看消息详情
    onRead = (e,id,msgContent,msgType) => {
        const {selectType} = this.state;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if(selectType == 'send'){
            let {readParams} = this.state;
            readParams.type = msgType;
            if(msgType == 1) return getReadNum({id}).then(res => {
                if (res.success == 1) {
                    readParams = Object.assign({}, readParams, res.data);
                    this.setState({
                        readParams,
                        detailsVisible:true,
                        detailsMessage:msgContent
                    })
                }else{
                    message.error(res.message)
                }
            })
            return this.setState({
                readParams,
                detailsVisible:true,
                detailsMessage:msgContent
            })
        }
        getDoRead({id}).then(res => {
            if (res.success == 1) {
                this.setState({
                    detailsVisible:true,
                    detailsMessage:msgContent
                })
                this.searchTable();
            }else{
                message.error(res.message)
            }
        })
    }
    //当页面加载完成获取表格数据
    componentDidMount () {
        this.searchTable();//
    }
    //格式化回显未读已读
    fomatterRead = (text,row,index) => {
        if(!row.isRead) {
            return <span style={{fontWeight:600}}>{text}</span>;
        }else{
            return text;
        }
    }
    //表格查询
    searchTable = () => {
        let {pageConf,selectType} = this.state;
        let newParams = Object.assign({}, pageConf, { type: selectType});
        console.log(pageConf)
        getNoticeTable(newParams).then(res => {
            if (res.success == 1) {
                // this.setState({tableData:res.data})
                let tableData = res.data.records ? res.data.records : [];
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total,
                    pageSize: res.data.size,
                    current: res.data.current,
                })
                let pageConf = Object.assign({},{
                    limit: res.data.size,
                    offset: (res.data.current - 1) * 10,
                })
                this.setState({ tableData, pagination: pagination, pageConf: pageConf,tableLoading:false })
            } else {
                message.error(res.message)
            }
        })
    }
    handleClick = (pa) => {
        let modalVisible = pa;
        this.setState({modalVisible});
    }
    //点击行选中选框
    onRow = (record,index) => {
        return {
            onClick: () => {
                let {tableSelecteds} = this.state;
                if(tableSelecteds.indexOf(record.id) > -1){
                    tableSelecteds.splice(tableSelecteds.indexOf(record.id),1);
                }else{
                    tableSelecteds.push(record.id);
                }
                this.onTableSelect(tableSelecteds);
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
            tableLoading:true
        },()=>{
            this.searchTable()
        })
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        this.setState({
            pageConf: pageConf,
            tableSelecteds: [],
            tableLoading:true
        },()=>{
            this.searchTable()
        })
    }
    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
        })
    };
    //切换显示我发送和我接收
    switch = (selectType) => {
        this.setState({
            selectType,
            tableSelecteds:[],
            pageConf:{
                offset:0,
                limit:10
            },
            tableLoading:true
        },()=>{
            this.searchTable();
        })
    }
    //删除表格数据
    delRoleTbale = () => {
        const {tableSelecteds,selectType} = this.state,_this = this;
        if (tableSelecteds.length == 0) {
            message.destroy()
            message.warning("没有选中数据,无法进行删除!")
            return;
        }
        confirm({
            title: '删除',
            content: '确认删除这些数据？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                getDelete({ids:tableSelecteds,type:selectType}).then(res => {
                    if (res.success == 1) {
                        _this.setState({
                            tableSelecteds: [],
                            tableLoading:true
                        },() => {
                            _this.searchTable();
                        })
                    }else{
                        message.error(res.message);
                    }
                })
            }
        })
        
    }
    //打开消息发送窗口
    openSendOut = () => {
        // console.log(this.props.openSendOut)
        if(this.props.openSendOut) this.props.openSendOut();
    }
    render = _ =>{
        let st = {boxShadow: '10px 10px 5px #888888',backgroundColor:'#4876e7',color:'white'}, columns = this.state[`columns${this.state.selectType}`];
        return (<ModalDom footer={null} title='消息通知' bodyStyle={{height:550}} width={1000} destroyOnClose={true} visible={true} onOk={() => this.handleClick(false)} onCancel={this.props.onCancel}>
            <Row className="sendBox">
                <Col className="senBoxSon" onClick={()=> this.switch('receive')} style={this.state.selectType == 'receive' ? st : {}} span={4}>
                    <span>我接收的</span>
                    {/* <span style={{ marginLeft: 15 }}>10</span> */}
                </Col>
                <Col className="senBoxSon" onClick={()=> this.switch('send')} style={this.state.selectType == 'send' ? st : {}} xs={{ span: 4, offset: 1 }}>
                    <span>我发送的</span>
                    {/* <span style={{ marginLeft: 15 }}>10</span> */}
                </Col>
                <Col className="senBoxSon" xs={{ span: 4, offset: 1 }}>
                    <a href="#" onClick={this.openSendOut}><span style={{marginRight:10}}>+</span><span>发送消息</span></a>
                </Col>
            </Row>
            {/* <Tabs tabBarExtraContent={<Button>操作区</Button>}>
                <TabPane tab="未读（6）" key="1"></TabPane>
                <TabPane tab="已读（10）" key="2"></TabPane>
            </Tabs> */}
            <Row style={{ marginTop: 10 }}>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="info" onClick={this.delRoleTbale}>删除</Button>
                </Col>
            </Row>
            <div className="tableParson">
                <Table loading={this.state.tableLoading} bordered onRow={this.onRow} rowSelection={{ onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds, type: "checkBox" }} dataSource={this.state.tableData} columns={columns} style={{ marginTop: 10, maxHeight: '86%' }} rowKey='id' pagination={false} scroll={{ y: 320 }} size="small" />
                <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
            </div>
            {/* 打开消息详情页面 */}
            {
                this.state.detailsVisible ? <ModalDom className="operation_notice" title='消息内容详情' width={700} footer={null} destroyOnClose={true} visible={true} onCancel={() => this.setState({detailsVisible:false,detailsMessage:''})}>
                    {/* <TextArea rows={10} disabled value={this.state.detailsMessage}/> */}
                    <Editor disabled value={this.state.detailsMessage} />
                    {this.state.selectType == "send" && this.state.readParams.type == 1? <Row className="sendBox" style={{ marginTop: 10 }}>
                        <Col className="senBoxSon2" xs={{ span: 4, offset: 15 }}>
                            <Tooltip placement="topLeft" title={this.state.readParams.unreadName}>
                                <span>未读人数</span>
                                <span style={{ marginLeft: 8 }}>{this.state.readParams.unreadNum}</span>    
                            </Tooltip>
                        </Col>
                        <Col className="senBoxSon2" xs={{ span: 4, offset: 1 }}>
                            <Tooltip placement="topLeft" title={this.state.readParams.readName}>
                                <span>已读人数</span>
                                <span style={{ marginLeft: 8 }}>{this.state.readParams.readNum}</span>
                            </Tooltip>
                        </Col>
                    </Row> : null}
                </ModalDom> : null
            }
        </ModalDom>)
    } 
}
export default Notice