

import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';

const { confirm } = Modal;




const { Item } = Form
const { Provider, Consumer } = React.createContext()//组件之间传值


// 引入 API接口
import { } from '/api/systemParameter'
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'
// 引入省市地区数据
import address from '@/assets/js/address.js'

// 行内表单渲染
class EditableCell extends React.Component {

    state = {
        computerRegion: [],
        computerRegionValue:[],
        radioLock:false,    // 用于判断【主责区域】中是否已有选定的主责区域
    };

    componentWillMount() {
        this.state.computerRegion = this.FormatCity(address);


    }

    // form[区域]下拉事件
    handleComputerRegionChange = (value) => {
        this.setState({
            computerRegionValue: value
        })
    }

    // 获取省市地区中的省市数据集合
    FormatCity = (data) => {
        var newCity = [];
        data.forEach((item, index) => {
            newCity.push({
                value: item.name,
                label: item.name,
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

    onChange=(e)=>{
        // console.log(e)
        this.setState({
            value: e.target.value,
          });
    }

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing, dataIndex,initValue, title, Input, record, index, children,radioLock,
            ...restProps
        } = this.props;

        return (
            <td {...restProps} className='my-cell-td'>
                {editing ? (
                    dataIndex == 'area' ?
                        < Item style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `请输入 ${title}!`
                                }],
                                initialValue: (record[dataIndex].split("/"))
                            })(
                                // value={this.state.computerRegionValue}
                                <Cascader options={this.state.computerRegion} onChange={this.handleComputerRegionChange} placeholder="请选择区域" />
                            )}
                        </Item> : dataIndex == 'isMainDutyArea' ?
                            <Item style={{ margin: 0 }}>
                                {getFieldDecorator(dataIndex, {
                                    rules: [{
                                        required: true,
                                        message: `请输入 ${title}!`
                                    }],
                                    initialValue: (record[dataIndex]).toString()
                                })(
                                    <Radio.Group >
                                        <Radio value='1' disabled={radioLock}>是</Radio>
                                        <Radio value='0'>否</Radio>
                                    </Radio.Group>
                                )}

                            </Item>
                            : < Item style={{ margin: 0 }}>
                                {getFieldDecorator(dataIndex, {
                                    rules: [{ required: true, message: `请输入 ${title}!` }],
                                    initialValue: record[dataIndex],
                                })(
                                    <Input />
                                )}
                            </Item>
                ) : children
                }
            </td>
        );
    };
    render() {
        return <Consumer>{this.renderCell}</Consumer>;
    }
}



// 正式服务区域---渲染
class serviceArea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: '',
            data: [],
            count:0,
            // 省区联级选则数据
            computerRegion: [],
            computerRegionValue:'',
           
            radioLock:false,  
            selectedRowKeys:null,  //选中的table表格的id
        }
    }

    // 数据更新完成时触发的函数
    componentWillMount() {
        // let {radioLock} = this.state;
        // this.props.data.forEach((itex,index) => {
        //     radioLock =  this.props.data[index].isMainDutyArea ? true : false
        //     if(this.props.data[index].isMainDutyArea){
        //         radioLock = true;
        //         this.props.data[index].area = this.props.data[index].area.join("/") + '<span style="color:red">【主责区域】</span>'
        //     }
        // })
        // this.setState({
        //     data: this.props.data,
        //     count: this.props.data.length + 1,
        //     radioLock
        // })
        this.initData(this.props.data)
    }
    //@author  gl
    componentWillReceiveProps (nextprops) {
        let {data} = this.state;
        console.log(JSON.stringify(data) == JSON.stringify(nextprops.data))
        if(JSON.stringify(data) == JSON.stringify(nextprops.data)) return;
        if(!this.state.editingKey){
            this.initData(nextprops.data)
        }
	}
    initData = (data) => {
        let radioLock = false;//m初始化主责区域密钥
        data.forEach((item,index) => {
            if(!radioLock){
                radioLock =  item.isMainDutyArea == 1 ? true : false;//当已经有一个主责区域了就不再继续循环赋值了
            }
            if(!item.key){
                data[index].key = index+1;
            }
        })
        this.setState({
            data: data,
            count: data.length + 1,
            radioLock
        })
    }
    // 向父组件传递本页面数据集合
    updataToParent=()=>{
        this.props.onChange(this.state.data)
    }
    

    

    // 获取省市地区中的省市数据集合
    FormatCity = (data) => {
        var newCity = [];
        data.forEach((item, index) => {
            newCity.push({
                value: item.name,
                label: item.name,
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

    

    // 新增table表格一行
    handleAdd = () => {
        if (!this.state.editingKey) {
            const { count, data } = this.state;
            const newData = {
                key: count,
                // id: count,
                area: "",
                isMainDutyArea: "",
                address: '',
                serviceAreaNew:[]
            };

            const newSelectKey = []
            newSelectKey.push(newData.key)
            this.setState({
                data: [...data, newData],
                count: count + 1,
                editingKey: newData.key, //将当前新增的行放置到可编辑状态
                selectedRowKeys:newSelectKey,   // 将当前新增的行进行选中
                editLock: false
            });
            
        }else {
            message.warning('请先保存服务区域数据！')
        }
        

    };


    //判断是否可编辑
    isEditing = record => record.key == this.state.editingKey


    //是否展示编辑
    editable = (editable, editingKey, record) => {
        const ele = editable ? (
            <span style={{ display: 'block' }}>
                <Consumer>
                    {
                        form => (
                            <a onClick={() => this.save(form,record.id)} style={{ marginRight: 8 }}>
                                保存
                            </a>
                        )
                    }
                </Consumer>
                <Popconfirm title="是否取消修改?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                </Popconfirm>
            </span>
        ) : (
            <div>
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)} style={{ marginRight: '15px' }}>修改</a>
                <a disabled={editingKey !== ''} onClick={() => this.delete(record.id)}>删除</a>
            </div>
        );
        return ele
    }
    

    //取消
    cancel = () => {
        var id = this.state.selectedRowKeys[0];
        const data = [...this.state.data];
        // 判断  若是【新增】的取消功能，则刚刚新增数据删除；若是【修改】的取消功能 则是取消修改
        if (this.state.editLock) {   // 修改
            
            let index = data.findIndex((item) => id === item.key);
            let item = data[index];
            
           
            // 首先通过判断【是否是主责区域】，再去修改area属性(将数组修改为字符串)
            // if (item.isMainDutyArea == '1') {
            //     item.area = item.area.join("/") + '<span style="color:red">【主责区域】</span>'
            // }else if (item.isMainDutyArea == '0'){
            //     item.area = item.area.join("/");
            // }
            //item.area = item.area.join("/");
            this.setState({
                editingKey: '',
                editLock: false
            })
        }else {  // 新增
            let newData = data.filter(item => item.key !== id);
            this.setState({ 
                data: newData ,
                editingKey: '',
                count: newData.length + 1,
                selectedRowKeys:null
            },()=>{
                this.updataToParent();
            });
        }
       
    }

    // 初始化
    init = () => {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                editable: false,
                align:'center',
                width:'80px',
                //每一页都从1开始
                render:(text,record,index)=> `${index+1}`
            },
            {
                title: '服务区域',
                dataIndex: 'area',
                editable: true,
                render:(record,row)=>{
                 if(row.isMainDutyArea == 1){
                    record = record + '<span style="color:red">【主责区域】</span>'
                    return  <span dangerouslySetInnerHTML={{ __html: record }}></span>
                 }else{
                    return  <span dangerouslySetInnerHTML={{ __html: record }}></span>
                 }
                   
                }
            },
            {
                title: '是否是主责区域',
                dataIndex: 'isMainDutyArea',
                render: t => t == '1' ? '是' : '否',
                editable: true,
               
            },{
                title: '客户地址',
                dataIndex: 'address',
                editable: true,
            }
        ]
    }


    // 修改行内表格
    handleEdit=()=>{
        // console.log(this.state.selectedRowKeys);
        if (this.state.selectedRowKeys) {
            // console.log(this.state.selectedRowKeys)
             var ID = this.state.selectedRowKeys[0];

            this.setState({
                editingKey: ID,
                editLock:true,
            },()=>{
                // console.log(this.state)
            })
        }else {
            message.warning('请先选择一行服务区域数据！')
        }
    }

    // 删除--系统参数（单个删除）
    handlerDelete=()=>{
        var _this = this
        if (this.state.selectedRowKeys) {
            confirm({
                title: '删除',
                content: '您确定删除此服务区域数据？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    var ID = _this.state.selectedRowKeys[0]
                    const dataSource = [..._this.state.data];
                    _this.setState({ data: dataSource.filter(item => item.key !== ID), editingKey: '',selectedRowKeys:null },()=>{
                        // console.log(_this.state)
                        _this.updataToParent();
                    });
                },
                onCancel() {
                    message.info('取消删除！');
                },
            });
        } else {
            message.warning('请先选择一行服务区域数据！')
        }
    }

    // 保存
    save=(form)=>{
        var form = this.props.form;
        // 当前选中行的ID
        var id = this.state.selectedRowKeys[0];
        
        form.validateFields((error, row) => {
            if (error) {
                return
            }

            var params =JSON.parse( JSON.stringify(row));
            let newData = [...this.state.data];

            let index = newData.findIndex((item) => id === item.key);
            let item = newData[index];
            let {radioLock} = this.state;

            // 将【省市地区】的数据另外存储在serviceAreaNew数组变量中
            //item.serviceAreaNew = params.area;

            // 判断当前选中的区域是否为主责区域,前提是当前数据里没有主责区域选项
            // if(!this.state.radioLock && params.isMainDutyArea == 1){
            //         params.area = params.area.join("/") + '<span style="color:red">【主责区域】</span>';
            // }else{
            //     params.area = params.area.join("/");
            // }
            
             params.area = params.area.join("/");
            // 修改数据，进行赋值
            newData.splice(index, 1, {
                ...item,
                ...params
            });
            // console.log(this.state.radioLock,item,params,newData)
            this.setState({ data: newData, editingKey: '',selectedRowKeys:null},()=>{
                this.updataToParent();
            });

        })

    }

    // 单选框按钮---选中事件
    selectChangeArea = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ',selectedRowKeys, selectedRows);
        this.setState({ 
            selectedRowKeys:selectedRowKeys,
        });
    }
    // 选中行时就选中单选框按钮
    onRow = (record) => {
        return {
            onClick: () => {
                // let selectedKeys = [record.id];
                let selectedKeys = [record.key];
                this.setState({
                    selectedRowKeys: selectedKeys,
                })
            }
        }
    }


    render() {
        this.init()
        let { isEdit} = this.props;
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {

            if (isEdit && !col.editable) {
                return col;
            }
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    Input: Input,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    radioLock:this.state.radioLock
                }),
            };
        });

        const rowSelectionArea = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.selectChangeArea,
            type:'radio'
        };
        return (
            <div>
                <Row gutter={24} style={{textAlign:'right',visibility: !isEdit ? 'visible' : 'hidden'}}>
                    <Button style={{marginRight: '10px'}} onClick={this.handlerDelete}>删除</Button>
                    {
                        !this.state.editingKey ? <Button style={{marginRight: '10px'}} onClick={this.handleEdit}>修改</Button> : (
                            <Button style={{marginRight: '10px'}} disabled>取消</Button>
                        )
                    }
                    {
                        this.state.editingKey ? <Button style={{marginRight: '10px'}} onClick={this.cancel}>取消</Button> : (
                            <Button style={{marginRight: '10px'}} disabled>取消</Button>
                        )
                    }
                    {
                        this.state.editingKey ? <Button type="primary" style={{marginRight: '10px'}} onClick={this.save}>保存</Button> : (
                            <Button type="primary" style={{marginRight: '10px'}} disabled>保存</Button>
                        )
                    }

                    {
                        this.state.editingKey ? <Button type="primary" style={{marginRight: '10px'}} disabled>新增</Button> : (
                            <Button type="primary" style={{marginRight: '10px'}} onClick={this.handleAdd}>新增</Button>
                        )
                    }
                </Row>
                
                <Provider value={this.props.form}>
                    <Table
                        className="jxlTable"
                        onRow={this.onRow}
                        components={components}   //覆盖默认的 table 元素
                        bordered
                        rowKey={'key'}
                        rowSelection={!isEdit ? rowSelectionArea : null}  
                        dataSource={this.state.data}
                        columns={columns}
                        scroll={this.props.scroll}
                        rowClassName="editable-row"
                        pagination={false}
                        size={'small'}
                        style={{ marginTop: '16px', overflowY: 'auto' }}
                    />
                    {this.props.children}
                </Provider >
            </div>
           
        )
    }

}
const EditServiceAreaTable = Form.create()(serviceArea);
export default EditServiceAreaTable;
