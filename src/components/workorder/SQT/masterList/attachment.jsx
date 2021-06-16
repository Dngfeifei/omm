

import React from 'react';
import { Row,Table, Icon, message, Select, Upload,Button} from 'antd';


// 引入 API接口
import {getByCode} from '/api/systemParameter'
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'

let {Option} = Select;


// 附件上传---渲染
class AttachmentTable extends React.Component {
    constructor(props) {
        super(props)
        let tokenName='token',header = {},actionUrl = '';
        if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
            actionUrl = process.env.API_URL
        }
        header.authorization = `Bearer ${localStorage.getItem(tokenName) || ''}`;
        this.state = {
            contractTypes:[],
            columns : [
                {
                    title: '附件类型',
                    dataIndex: 'acc_type',
                    width:200,
                    editable: true,
                    render: (value, row, index) => {
                        return <Select disabled={props.edit} bordered={props.edit} style={{ width: "100%" }} value={value} onChange={(value) => this.onSelectContactType(value,index)}>
                            {/* <Option key={index} value={"1"}>职级主管</Option>
                            <Option key={index} value={"2"}>技术联系人</Option> */}
                            {
                                this.state.contractTypes.map((item) => {
                                    return <Option key={item.itemCode} index={index} value={item.itemCode}>{item.itemValue}</Option>
                                })
                            }
                        </Select>;
                    },
                },
                {
                    title: '上传附件',
                    dataIndex: 'upload',
                    render: (value, row, index) => {
                        //  console.log(value)
                        //  let fileList = row['acc_name'] && row['acc_path'] ? [{ uid: index + '', name: row['acc_name'], status: 'done', url: row['acc_path'] }] : [];
                        return <div className="upload">
                                <Upload disabled={this.props.isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,index)} fileList={value}>
                                    <Icon type="upload" />上传
                                </Upload>
                            </div>
                    },
                   
                }
            ],
            data: this.props.data ? this.props.data : [{
                key:'1',
                contractType:1,
                // uploadList: [{uid:111, url:'11111111',name:'xxx.txt'}]
                fileName:'xxx.txt',
                fileUrl: 'xxxxxxxxxxxxxxxxxxxxxxxx'
            }],
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:"/biSqtBase/upload",
                headers: header,
                multiple: true,
            },
            selectedRowKeys:null,  //选中的table表格的id
        }
    }

    // 数据更新完成时触发的函数
    componentWillMount() {
        this.initData(this.props.data);
        this.init();
    }
    //@author  gl
    componentWillReceiveProps (nextprops) {
        this.initData(nextprops.data)
	}
    initData = (data) => {
        // this.setUpload(data);
        this.setState({
            data: data,
        })
    }
    //处理数据
    setUpload = (data = []) => {
        data.forEach((item,index) => {
            let upload = item['acc_name'] ? [{ uid: index + '', name: item['acc_name'], status: 'done', url: item['acc_path'] }] : []
            data[index].upload = upload;
        })
        return data;
    }
    // 向父组件传递本页面数据集合
    updataToParent=()=>{
        this.props.onChange(this.state.data)
    }

    // 新增table表格一行
    handleAdd = () => {
        if (!this.state.editingKey) {
            const { count, data } = this.state;
            const newData = {
                acc_type: undefined,
                acc_name: '',
                acc_path: '',
                upload:[]
            };

            const newSelectKey = []
            newSelectKey.push(newData.key)
            this.setState({
                data: [...data, newData]
            },()=>{this.updataToParent()});
            
        }else {
            message.warning('请先保存服务区域数据！')
        }
        

    };
    //附件类型
    onSelectContactType = (value,index) => {
        let {data} = this.state;
        data[index]['acc_type'] = value;
        this.setState({data},()=>{this.updataToParent()});
    }
    //附件上传过程函数
    uploadChange=(info,index)=>{
        let fileList = [...info.fileList];
        console.log(fileList,"1词")
        // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (file.response) {
                if (file.response.success == 1) {
                    console.log(file.response.data)
                    file.url = file.response.data.fileUrl;
                } else if (file.response.success == 0) {
                    file.status = 'error';
                }
            }
            return file;
        });
        let {data} = this.state;//Object.assign({}, this.state.data, {customerModelName:fileList[0] && fileList[0].status !='error' ? fileList[0].fileName:'',customerModelPath:fileList[0] && fileList[0].status !='error' ? fileList[0].fileUrl : '', clientFileList:fileList});
        data[index]['acc_name'] = fileList[0] && fileList[0].status !='error' ? fileList[0].name:'';
        data[index]['acc_path'] = fileList[0] && fileList[0].status !='error' ? fileList[0].url:'';
        data[index]['upload'] = fileList;
        this.setState({data},()=>{this.updataToParent()});
    }
    // 初始化
    init = () => {
        getByCode({dictCode:'accessoryType'}).then(res => {
            if (res.success == 1) {
                this.setState({
                    contractTypes: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
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
    //处理是否可编辑权限
    setJurisdiction = (isEdit,formRead,node,special) => {
        if(formRead != 2){
            if( node != 3 && node != special){
                return isEdit
            }else{
                return false;
            }
        }else{
            return true;
        }
    }

    render() {
        let { isEdit,formRead,node} = this.props;
        const rowSelectionArea = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.selectChangeArea,
            type:'radio'
        };
        return (
            <div className="AttachmentList">
                <Row gutter={24} style={{textAlign:'right',visibility:  this.setJurisdiction(isEdit,formRead,node) ? 'hidden' : 'visible'}}>
                    <Button style={{marginRight: '10px'}} onClick={this.handlerDelete} disabled={isEdit ? true : false}>删除</Button>
                    {
                        this.state.editingKey ? <Button type="primary" style={{marginRight: '10px'}} disabled>新增</Button> : (
                            <Button type="primary" style={{marginRight: '10px'}} disabled={isEdit ? true : false} onClick={this.handleAdd}>新增</Button>
                        )
                    }
                </Row>
                <Table
                    className="jxlTable"
                    onRow={this.onRow}
                    // components={components}   //覆盖默认的 table 元素
                    bordered
                    rowKey={(record,index) => index}
                    rowSelection={this.setJurisdiction(isEdit,formRead,node) ? null : rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.state.columns}
                    // scroll={this.props.scroll}
                    // rowClassName="editable-row"
                    pagination={false}
                    size={'small'}
                    style={{ marginTop: '16px', overflowY: 'auto' }}
                />
            </div>
           
        )
    }

}
export default AttachmentTable;