/***
 * 选择器组件------（目前此组件只应用于在了 产品选择器 部件选择器）
 * 
 * @author  gl
 */

 import React, { Component } from 'react'
 import { Input, Form, Row, Button, message, Card, Table, Select , Tooltip} from 'antd'
 const { Option } = Select;
 
 
 
 // 引入 分页组件
 import Pagination from '/components/pagination'
 // 引入 弹窗组件组件
 import ModalParant from "@/components/modal/index.jsx"
 // 引入 根据数据字典中查出------【服务类别、】API接口
 import { customerLevel} from '/api/customerInfor'
 // 引入 选择器 API接口
 import { getProductSelector} from '/api/selectorApi'
 
 
 
 class projectSelect extends Component {
     constructor(props) {
         super(props)
 
         this.state = {
             //设置表格的高度
             h: { y: 240 },
             total: 0, // 分页器组件 总条数
             // 此属性是适用于 表格的分页数据
             pageSize: 10,
             current: 0,
             // 此对象只是适用于分页查询
             pagination: {
                 limit: 10,
                 offset: 1
             },
             //表格加载太
             loading: false,  
             // 存放当前选中行的key
             selectedRowKeys:null,
             // 存放当前选中行的row数据
             selectedRows: null,   
 
             // 产品选择器情况下的----Columns、form表单
             projectParams:{
                 tableColumns:[{
                     title: '序号',
                     dataIndex: 'index',
                     align: 'center',
                     width: '80px',
                     // 第一种：每一页都从1开始
                     render: (text, record, index) => `${index + 1}`
                 },{
                     title: '产品类别',
                     dataIndex: 'projectNumber',
                     ellipsis: {
                         showTitle: false,
                     },
                     width: '240px',
                     render: (text, record)=> 
                         <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                 },{
                     title: '技术方向',
                     dataIndex: 'projectName',
                     ellipsis: {
                         showTitle: false,
                     },
                     render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                 },{
                     title: '品牌',
                     dataIndex: 'projectStatus',
                     ellipsis: {
                         showTitle: false,
                     },
                     render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                 },{
                    title: '产品线',
                    dataIndex: 'productLineName',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '产品等级',
                    dataIndex: 'productLevel',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }],
                 formRules:[{
                     label: '产品类别',
                     key: 'projectNumber',
                     render: _ => <Input allowClear style={{ width: 200 }} placeholder="请输入项目号" />
                 },{
                     label: '技术方向',
                     key: 'projectName',
                     render: _ => <Input allowClear style={{ width: 200 }} placeholder="请输入项目名称" />
                 },{
                     label: '品牌',
                     key: 'projectStatus',
                     render: _ => <Select style={{ width: 200 }} placeholder="请选择项目状态" allowClear={true}>
                         {
                             this.state.projectStatusList.map((items, index) => {
                                 return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                             })
                         }
                     </Select>
                 }]
             },
             //部件选择器
             partsParams:{
                tableColumns:[{
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: '80px',
                    // 第一种：每一页都从1开始
                    render: (text, record, index) => `${index + 1}`
                },{
                    title: 'fc',
                    dataIndex: 'projectNumber',
                    ellipsis: {
                        showTitle: false,
                    },
                    width: '240px',
                    render: (text, record)=> 
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '部件类别',
                    dataIndex: 'projectName',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },{
                    title: '描述',
                    dataIndex: 'projectStatus',
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                }],
                formRules:[{
                    label: 'fc',
                    key: 'projectNumber',
                    render: _ => <Input allowClear style={{ width: 200 }} placeholder="请输入" />
                },{
                    label: '部件类别',
                    key: 'projectStatus',
                    render: _ => <Select style={{ width: 200 }} placeholder="请选择" allowClear={true}>
                        {
                            this.state.projectStatusList.map((items, index) => {
                                return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                            })
                        }
                    </Select>
                }]
            },
             // 数据集合
             tabledata:[],
             // 服务类别
             projectStatusList:[],
 
             rules:null,
             columns:null,
 
                   
         }
     }
 
     // 挂载完成
     componentWillMount = () => {
         
         // 判别出 【项目选择器】下的数据 还是【客户选择器】
         if (this.props.title == '产品选择器') {
             this.setState({
                 rules:this.state.projectParams.formRules,
                 columns:this.state.projectParams.tableColumns
             })
         }else if(this.props.title == '部件选择器'){
            this.setState({
                rules:this.state.partsParams.formRules,
                columns:this.state.partsParams.tableColumns
            })
         }
 
        
     }
 
     componentDidMount(){
         this.init();
     }
 
 
     init = () => {
         this.getCustLevel();
 
         this.getLists();
     }
 
     // 获取数据字典各项数据  
     getCustLevel = () => {
         // 项目状态
         customerLevel({ dictCode: 'projectStatus' }).then(res => {
             if (res.success == 1) {
                 this.setState({
                     projectStatusList: res.data
                 })
             } else if (res.success == 0) {
                 message.error(res.message)
             }
         })
     }
 
     
 
 
     // 获取----table表格数据列表
     getLists = () => {
 
         this.props.form.validateFields((err, fieldsValue) => {
             if (err) {
                 return;
             }
 
             this.setState({ loading: true })
             var values = {
                 ...fieldsValue,
             };
 
 
             // 首先通过传递的title名称判断此时是【项目选择器】还是【客户选择器】
             if (this.props.title == '产品选择器') {
                getProductSelector(this.state.pageSize, this.state.current, values).then(res => {
                     if (res.success == 1) {
                         this.setState({
                             loading: false,
                             tabledata: res.data.records,
                             total: parseInt(res.data.total)
                         })
                     } else if (res.success == 0) {
                         message.error(res.message);
                     }
                 })
             } else if (this.props.title == '部件选择器') {
                getProjectSelector(this.state.pageSize, this.state.current, values).then(res => {
                    if (res.success == 1) {
                        this.setState({
                            loading: false,
                            tabledata: res.data.records,
                            total: parseInt(res.data.total)
                        })
                    } else if (res.success == 0) {
                        message.error(res.message);
                    }
                })
             }
 
 
 
            
         })
 
     }
 
     // 查询table表格列表---事件
     onSearch=()=>{
         this.getLists();
     }
 
     // 重置 头部form表单数据
     onReset=()=>{
         this.props.form.resetFields();
     }
 
     // 单选框按钮---选中事件
     onSelectChange=(selectedRowKeys,selectedRows)=>{
         this.setState({
             selectedRowKeys,
             selectedRows
         });
     }
     // 选中行时就选中单选框按钮
     onClickRow = (record) => {
         return {
             onClick: () => {
                 let selectedKeys = [record.id];
                 let selectedRows = [record]
                 this.setState({
                     selectedRowKeys: selectedKeys,
                     selectedRows
                 });
             },
         };
     }
 
 
     // 页码改变的回调，参数是改变后的页码及每页条数
     onPageChange = (page, pageSize) => {
         let data = Object.assign({}, this.state.pagination, { offset: page })
 
         this.setState({
             current: (page - 1) * pageSize,
             pagination: data
         }, () => {
             // 获取选择器列表（分页)
             this.getLists();
         })
     }
 
     // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
     onShowSizeChange = (current, pageSize) => {
         let data = Object.assign({}, this.state.pagination, { offset: 1, limit: pageSize })
 
         this.setState({
             current: 0,
             pageSize: pageSize,
             pagination: data
         }, () => {
             // 获取选择器列表（分页)
             this.getLists();
         })
 
 
     }
     
     // 确认--事件
     onSubmit=()=>{
         if(	this.state.selectedRowKeys.length > 0){
             // 向父组件传递当前选中的数据集合
             this.props.onOk(this.state.selectedRows[0]);
             // 父组件--关闭对话框
             this.props.onCancel();
         }else{
           message.destroy()
           message.error("未选择数据")
         }
     }
     
 
 
 
     render = _ => {
         const { getFieldDecorator } = this.props.form;
 
         const {selectedRowKeys } = this.state;
         const rowSelection = {
             selectedRowKeys,
             onChange: this.onSelectChange,
             type:'radio'
         };
 
 
         return (
             <div className="projectSelector">
                 <ModalParant title={this.props.title} destroyOnClose={true} visible={true} onOk={this.onSubmit} onCancel={this.props.onCancel} width={1080}>
                     <Form layout='inline' style={{ width: '100%', paddingTop: '24px', marginLeft: '15px' }} id="logbookForm">
                         {this.state.rules.map((val, index) =>
                             <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                 {getFieldDecorator(val.key, val.option)(val.render())}
                             </Form.Item>)}
                         <Form.Item>
                             <Button type="primary" style={{ marginLeft: '25px' }} onClick={this.onSearch}>查询</Button>
                             <Button style={{ marginLeft: '10px' }} onClick={this.onReset}>重置</Button>
                         </Form.Item>
                     </Form>
                     <Table
                         className="jxlTable"
                         bordered
                         rowKey={record => record.id} //在Table组件中加入这行代码
                         onRow={this.onClickRow}
                         rowSelection={rowSelection}
                         dataSource={this.state.tabledata}
                         columns={this.state.columns}
                         pagination={false}
                         scroll={this.state.h}
                         size={'small'}
                         style={{ marginTop: '16px', padding: '0px 15px', height: "280px" , overflowY: 'auto' }}
                         loading={this.state.loading}  //设置loading属性
                     />
                     {/* 分页器组件 */}
                     <Pagination total={this.state.total} pageSize={this.state.pagination.limit} current={(this.state.pagination.offset)} onChange={this.onPageChange} onShowSizeChange={this.onShowSizeChange}></Pagination>
                 </ModalParant>
             </div>
         )
     }
 }
 
 const projectSelectArea = Form.create()(projectSelect);
 export default projectSelectArea;