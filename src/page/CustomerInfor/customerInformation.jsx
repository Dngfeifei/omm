/***
 *  基础信息--客户信息详情页
 * @auth jxl
*/

import React, { Component } from "react";
import { Form, Input, Button, message, Select, Tooltip, Table, PageHeader , Tabs , Cascader ,} from 'antd'
const { Option } = Select;
const { TabPane } = Tabs;

import { connect } from 'react-redux'
import { REMOVE_PANE , ADD_PANE} from '/redux/action'

// 引入 API接口
import { biCustomerInfo , customerLevel , biCustomerPcRoom , biCustomerProject , biCustomerbiUser} from '/api/customerInfor'
import { getBiUser } from '/api/engineer'
// 引入页面CSS
import '@/assets/less/pages/custormerInfo.less'
// 引入省市地区数据
import address from '@/assets/js/address.js'


@connect(state => ({
	panes: state.global.panes,
    activeKey: state.global.activeKey,
}), dispath => ({
    remove(key){dispath({type: REMOVE_PANE, key})},
    add(pane) { dispath({type: ADD_PANE, data: pane})},
}))

class CustomerInfo extends Component{

    constructor(props) {
        super(props)

        this.state = {
            total: 0, // 分页器组件 总条数
            
            custormerId:null,   // 客户ID
            rankArray:[],  // 客户等级
            // 基本信息机Form
            newGroup:{
                custNum:'',
                custName:'',
                custLevel:''
            },
            // 底部tab标签title
            TitleLists:[{name:'机房地址信息'},{name:'项目信息'},{name:'工程师信息'}],
            // state中的activeType值来实现样式切换的效果
            activeType: 0,
            // 省区联级选则数据
            computerRegion: [],
            // 机房信息From
            computerRegionValue:[],
            // 机房地址信息区域---table表格
            ComputerRoomTabledata:[],
            // 机房地址信息区域---table表格的Columns
            ComputerRoomColumns:[{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '区域',
                dataIndex: 'province',
                ellipsis: {
                    showTitle: false,
                },
                width:'460px',
                render: (text,record) => `${record.province}/${record.city}`
            },{
                title: '机房名称',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '机房详细地址',
                dataIndex: 'address',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 项目信息区域---form表单中--项目状态数据
            projectStatusList:[],
            // 项目信息区域---form表单中--服务类别数据
            typeServiceList:[],
            //  项目信息区域---form表单数据
            ProjectInforRules:[{
                label: '项目号',
                key: 'projectNumber',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入项目号" />
            },{
                label: '项目名称',
                key: 'projectName',
                render: _ => <Input style={{ width: 200 }} placeholder="请输入项目名称" />
            },{
                label: '项目状态',
                key: 'projectStatus',
                render: _ => <Select style={{ width: 200 }} placeholder="请选择项目状态" allowClear={true}>
                    {
                        this.state.projectStatusList.map((items, index) => {
                            return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                        })
                    }
                </Select>
            },{
                label: '服务类别',
                key: 'serviceType',
                render: _ => <Select style={{ width: 200 }} placeholder="请选择服务类别" allowClear={true}>
                    {
                        this.state.typeServiceList.map((items, index) => {
                            return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                        })
                    }
                </Select>
            }],
            // 项目信息区域---table表格
            ProjectInforTabledata:[],
            // 项目信息区域---table表格的Columns
            ProjectInforColumns:[{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '项目号',
                dataIndex: 'projectNumber',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>
                    <span style={{ color: '#1890ff', cursor: 'pointer',display:'block',textAlign:'center' }} onClick={() => this.projectInforPreviewing(record.id)}>{text}</span>
                </Tooltip>
            },{
                title: '项目名称',
                dataIndex: 'projectName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '项目开始日期',
                dataIndex: 'startDate',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '项目结束日期',
                dataIndex: 'endDate',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '项目状态',
                dataIndex: 'projectStatus',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '服务类别',
                dataIndex: 'serviceType',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '销售',
                dataIndex: 'salesman',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            // 工程师信息区域---table表格
            EngineerInforTabledata:[],
            // 工程师信息区域---table表格的Columns
            EngineerInforColumns:[{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: '80px',
                // 第一种：每一页都从1开始
                render: (text, record, index) => `${index + 1}`
            },{
                title: '姓名',
                dataIndex: 'name',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>
                   <span style={{ color: '#1890ff', cursor: 'pointer',display:'block',textAlign:'center' }} onClick={() => this.EngineerInforPreviewing(record.id)}>{text}</span>
                </Tooltip>
                
            },{
                title: '所属部门',
                dataIndex: 'deptName',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '联系方式',
                dataIndex: 'mobile',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '级别',
                dataIndex: 'jobGrade',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            },{
                title: '服务本客户项目的数量',
                dataIndex: 'num',
                ellipsis: {
                    showTitle: false,
                },
                align:'center',
                render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            }],
            //  工程师信息区域---form表单
            EngineerInfor:{
                name:'', // 姓名
                deptName:'', //所属部门
                custLevel:''    //级别
            },
        }
    }

    componentWillMount(){
        var custormerID =  this.props.params.dataType.id;
        this.setState({
            custormerId:custormerID
        })
    }

    // 组件将要挂载完成后触发的函数
    componentDidMount() {
        // 获取数据字典各项--数据
        this.getCustLevel();

        // this.SortTable();
        // //窗口变动的时候调用
        // window.addEventListener("resize", ()=>{this.SortTable()}, false)
        console.log('*************************FormatCity************************************')
       
        console.log(address)

         console.log(this.FormatCity(address));
        // 如果存在custormerId代表着详情，则获取详情接口
        if (this.state.custormerId) {
            // 机房信息中的--区域
            this.state.computerRegion = this.FormatCity(address);
            // 基本信息
            this.getCustInfor(this.state.custormerId);
            // 机房信息列表接口
            this.getBiCustomerPcRoom();
            // 项目信息列表接口
            this.getBiCustomerProject();
            // 工程师信息列表接口
            this.getEngineerInfor();
        }

    }

    // 获取省市地区中的省市数据集合
    FormatCity=(data)=>{
        var newCity = [];
        data.forEach((item,index)=>{
            newCity.push({
                value:item.name,
                label:item.name,
            })
            if (item.hasOwnProperty("city")) {
                if (item.city.length > 0) {
                    newCity[index].children = [];
                    (newCity[index].children) = (this.FormatCity(item.city))
                }
            } else {
                return 
            }
        })
        return newCity
    }

    // 获取---机房信息列表
    getBiCustomerPcRoom=()=>{
        let newSearchForm = {
            custId:this.state.custormerId, // 客户id
            province:this.state.computerRegionValue==[]?'':this.state.computerRegionValue[0],  //省
            city:this.state.computerRegionValue==[]?'':this.state.computerRegionValue[0],  // 市
        }

        biCustomerPcRoom(newSearchForm).then(res => {
            if (res.success == 1) {
                this.setState({
                    ComputerRoomTabledata: res.data,
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }
    // 获取--项目信息列表
    getBiCustomerProject=()=>{
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            var values = {
                ...fieldsValue,
            };

            let newSearchForm = {
                custId:this.state.custormerId, // 客户id
                projectNumber: values.projectNumber, // 项目编号
                projectName: values.projectName,    // 项目名称
                serviceType: values.serviceType, // 服务类别
                projectStatus:values.projectStatus// 项目状态
            }

            biCustomerProject(newSearchForm).then(res => {
                if (res.success == 1) {
                    this.setState({
                        ProjectInforTabledata: res.data,
                    })
                } else if (res.success == 0) {
                    message.error(res.message);
                }
            })
        })
    }
    // 获取---工程师信息列表接口
    getEngineerInfor=()=>{
        
        biCustomerbiUser(this.state.EngineerInfor).then(res => {
            if (res.success == 1) {

                this.setState({
                    EngineerInforTabledata: res.data,
                    total: parseInt(res.data.total)
                })
            } else if (res.success == 0) {
                message.error(res.message);
            }
        })
    }
    // 获取数据字典各项数据  
    getCustLevel=()=>{
        // 客户级别--数据
        customerLevel({dictCode:'customerLevel'}).then(res=>{
            if (res.success == 1) {
                this.setState({
                    rankArray:res.data
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })

        // 服务类别
        customerLevel({dictCode:'serviceType'}).then(res=>{
            if (res.success == 1) {
                this.setState({
                    typeServiceList:res.data
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })

        // 项目状态
        customerLevel({dictCode:'projectStatus'}).then(res=>{
            if (res.success == 1) {
                this.setState({
                    projectStatusList:res.data
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })
    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            console.log(this.tableDom.offsetHeight);
            let h = this.tableDom.clientHeight + 250;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }

    // 获取客户信息详情
    getCustInfor=(Id)=>{
        biCustomerInfo(Id).then(res=>{
            if (res.success == 1) {
                /**   将客户等级id换成中文   **/
                var newCustLevel = res.data.custLevel;
                // 任务类型下拉列表数据
                var objCenter = this.state.rankArray; 

                for (var i = 0; i < objCenter.length; i++) {
                    if (newCustLevel.indexOf(objCenter[i].itemValue) >= 0) {
                        newCustLevel = objCenter[i].itemCode;
                    }
                }
                let custInfo = Object.assign({}, this.state.newGroup, { custNum: res.data.custNum, custName:res.data.custName, custLevel:newCustLevel})

                this.setState({
                    newGroup: custInfo
                })
            }else if(res.success == 0){
                message.error(res.message)
            }
        })
    }

    //基本信息---获取新增或修改后的客户级别
    handleChange = (value) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custLevel: value })
        this.setState({
            newGroup: newGroup
        })
    }
    //基本信息---获取新增或修改后的客户名称
    getdictName = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custName: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //基本信息---获取新增或修改后的客户编码
    getdictCode = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { custNum: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }

    // 机房信息区域-form[区域]下拉事件
    handleComputerRegionChange=(value)=>{
        this.setState({
            computerRegionValue:value
        })
    }

    // 工程师信息---获取新增或修改的姓名
    getEnginerName=(e)=>{
        let newGroup = Object.assign({}, this.state.EngineerInfor, { name: e.target.value })
        this.setState({
            EngineerInfor: newGroup
        })
    }
    // 工程师信息---获取新增或修改的所属部门
    getEnginerDictName=(e)=>{
        let newGroup = Object.assign({}, this.state.EngineerInfor, { deptName: e.target.value })
        this.setState({
            EngineerInfor: newGroup
        })
    }
    // 工程师信息区域-form[级别]下拉事件
    handleEngineerInforChange=(e)=>{
        let newEngineerInfor = Object.assign({}, this.state.EngineerInfor, { custLevel: e.target.value })
        this.setState({
            EngineerInfor: newEngineerInfor
        })
    }



    // 项目信息区域---table表格中【项目号】点击跳转事件
    projectInforPreviewing=(id)=>{
        let pane = {
            title: '项目档案',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'ProjectManage/ProjectInformation.jsx',
            params:{
                id:id
            }
        }
        this.props.add(pane)
    }
    //  工程师信息区域---table表格中【姓名】点击跳转事件
    EngineerInforPreviewing=(id)=>{
        let pane = {
            title: '工程师档案',
            key: Math.round(Math.random() * 10000).toString(),
            url: 'Engineer/formSearch.jsx',
            params:{
                id:id
            }
        }
        this.props.add(pane)
    }



    // 头部-返回上一页【回到：客户信息列表页面】
    remove = () => {
		this.props.remove(this.props.activeKey)
    }
    //  底部tab标签title切换
    handleSiblingsClick = (index) => {
        this.setState({
            activeType: index
        })

        
    }

    // 机房信息区域---查询按钮事件
    handleCompRoomSearch=(e)=>{
        e.preventDefault();
        // 机房列表接口
        this.getBiCustomerPcRoom();
    }
    //  项目信息区域---查询按钮事件
    handleProjectINfoSearch = (e) => {
        e.preventDefault();
        // 项目列表接口
        this.getBiCustomerProject();
    }
    // 项目信息区域---重置按钮事件
    handleResetProject=()=>{
        this.props.form.resetFields();
    }
    // 工程师信息区域---重置按钮事件
    handleResetEngineer=()=>{
        let newEngineerInfor = Object.assign({}, this.state.EngineerInfor, { custLevel: '',custNum:'',custName:'' })
        this.setState({
            EngineerInfor: newEngineerInfor
        })
    }

   

    render = _ => {

        const { getFieldDecorator } = this.props.form;

        const { h , } = this.state;

        // 节点渲染区域
        return (
            <div className="CustomerInforContent" style={{flex: '1 1 0%'}} id="logbookForm" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap',height:'100%' }}>
                <div className="top">
                    {/* <PageHeader onBack={this.remove} title="客户档案"style={{background:'#fff'}} /> */}
                    <div className='title activedTitle actived'>客户基础信息</div>
                    <div className="baseInfo">
                        <label style={{marginRight:'16px'}}>
                            <span style={{ display: "inline-block", textAlign: "right" }}>客户编码：</span>
                            <Input placeholder="请选择客户编码" value={this.state.newGroup.custNum} onChange={this.getdictCode} allowClear={true} style={{ width: "300px" }} disabled={this.state.custormerId ? true : false } />
                        </label>
                        <label style={{marginRight:'16px'}}>
                            <span style={{display: "inline-block", textAlign: "right" }}>客户名称：</span>
                            <Input placeholder="请选择客户名称" value={this.state.newGroup.custName} onChange={this.getdictName} allowClear={true} style={{ width: "300px" }} disabled={this.state.custormerId ? true : false} />
                        </label>
                        <label style={{marginRight:'16px'}}>
                            <span style={{ display: "inline-block", textAlign: "right" }}>客户级别：</span>
                            <Select style={{ width: 300 }} placeholder="请选择客户级别" allowClear={true} onChange={this.handleChange} value={this.state.newGroup.custLevel} disabled={this.state.custormerId ? true : false}>
                                {
                                    this.state.rankArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                                    })
                                }
                            </Select>
                        </label>
                   </div>

                    <div className="list-item">
                        {
                            this.state.TitleLists.map((item, i) => {
                                return (
                                    <div className={this.state.activeType == i ? 'title actived activedTitle' : 'title'} onClick={this.handleSiblingsClick.bind(this, i)} data-index={i} key={i}>{item.name}</div>
                                );
                            })
                        }
                    </div>
                </div>
                
                <div className="tableCertificates">
                    {/* 切换内容区域 */}
                    <div className="Switching" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                       {/* 机房地址信息---区域 */}
                        <div className="ComputerRoomAddress" style={{display:this.state.activeType==0?'block':'none'}}>
                            <div className="conputerForm">
                                <label style={{ marginRight: '16px' }}>
                                <span style={{ display: "inline-block", textAlign: "right" }}>区域：</span>
                                    <Cascader options={this.state.computerRegion} onChange={this.handleComputerRegionChange} placeholder="请选择区域" value={this.state.computerRegionValue} style={{width:'300px'}} />
                                </label>
                                <Button type="primary" className="computerRoomSearch" onClick={this.handleCompRoomSearch}>查询</Button>
                            </div>
                            <Table
                                className="jxlTable"
                                bordered
                                rowKey={record => record.id} //在Table组件中加入这行代码
                                dataSource={this.state.ComputerRoomTabledata}
                                columns={this.state.ComputerRoomColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>

                       {/* 项目信息---区域 */}
                        <div className="ProjectInfor" style={{ display: this.state.activeType == 1 ? 'block':'none' }}>
                            <div className="baseInfo">
                                <Form layout="inline">
                                    {
                                        this.state.ProjectInforRules.map((val, index) =>
                                            <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                                {getFieldDecorator(val.key, val.option)(val.render())}
                                            </Form.Item>)
                                    }
                                    <Form.Item>
                                        <Button type="primary" className="computerRoomSearch" onClick={this.handleProjectINfoSearch}>查询</Button>
                                        <Button className="computerRoomSearch" onClick={this.handleResetProject}>重置</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <Table
                                className="jxlTable"
                                bordered
                                rowKey={record => record.id} //在Table组件中加入这行代码
                                dataSource={this.state.ProjectInforTabledata}
                                columns={this.state.ProjectInforColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>

                       {/* 工程师信息----区域 */}
                        <div className="EngineerInfor" style={{ display: this.state.activeType == 2 ? 'block' : 'none' }}>
                            <div className="baseInfo">
                                <label style={{ marginRight: '16px' }}>
                                    <span style={{ display: "inline-block", textAlign: "right" }}>姓名：</span>
                                    <Input placeholder="请选择客户编码" value={this.state.EngineerInfor.name} onChange={this.getEnginerName} allowClear={true} style={{ width: "300px" }} />
                                </label>
                                <label style={{ marginRight: '16px' }}>
                                    <span style={{ display: "inline-block", textAlign: "right" }}>部门：</span>
                                    <Input placeholder="请选择客户名称" value={this.state.EngineerInfor.deptName} onChange={this.getEnginerDictName} allowClear={true} style={{ width: "300px" }} />
                                </label>
                                <label style={{ marginRight: '16px' }}>
                                    <span style={{ display: "inline-block", textAlign: "right" }}>级别：</span>
                                    <Select style={{ width: 300 }} placeholder="请选择客户级别" allowClear={true} onChange={this.handleEngineerInforChange} value={this.state.EngineerInfor.custLevel} >
                                        {
                                            this.state.rankArray.map((items, index) => {
                                                return (<Option key={index} value={items.itemValue}>{items.itemCode}</Option>)
                                            })
                                        }
                                    </Select>
                                </label>
                                <Button type="primary" className="computerRoomSearch">查询</Button>
                                <Button className="computerRoomSearch" onClick={this.handleResetEngineer}>重置</Button>
                            </div>
                            <Table
                                className="jxlTable"
                                bordered
                                rowKey={record => record.id} //在Table组件中加入这行代码
                                dataSource={this.state.EngineerInforTabledata}
                                columns={this.state.EngineerInforColumns}
                                pagination={false}
                                scroll={h}
                                size={'small'}
                                style={{ marginTop: '16px', padding: '0px 15px', height: h, overflowY: 'auto' }}
                            />
                        </div>
                    </div>
                    {/* 底部--分页组件 */}

                </div>
            </div>
        )
    }
}

const CustomerInforForm = Form.create()(CustomerInfo)
export default CustomerInforForm;

