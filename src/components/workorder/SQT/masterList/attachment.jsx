

import React from 'react';
import { Row,Table, Icon, message, Select, Upload,Button} from 'antd';


// 引入 API接口
import {} from '/api/systemParameter'
// 引入页面CSS
import '/assets/less/pages/logBookTable.css'




// 正式服务区域---渲染
class AttachmentTable extends React.Component {
    constructor(props) {
        super(props)
        let tokenName='token',header = {},actionUrl = '';
        if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
            actionUrl = process.env.API_URL
        }
        this.state = {
            contractTypes:[],
            columns : [
                {
                    title: '附件类型',
                    dataIndex: 'contractType',
                    editable: true,
                    render: (value, row, index) => {
                        return <Select disabled={props.edit} bordered={props.edit} style={{ width: "100%" }} value={value} onSelect={this.onSelectContactType}>
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
                    dataIndex: 'fileName',
                    render: (value, row, index) => {
                        return <div className="upload">
                                <Upload disabled={this.props.isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'configTemplateName','configTemplate')}>
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
        this.initData(this.props.data)
    }
    //@author  gl
    componentWillReceiveProps (nextprops) {
        this.initData(nextprops.data)
	}
    initData = (data) => {

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
//附件上传过程函数
uploadChange=(info,typeName,typeUrl)=>{
    let fileList = [...info.fileList];
    // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
    fileList = fileList.slice(-1);
    // 2.读取响应并显示文件链接
    // if(info.file.status == 'uploading'){
    //     debugger
    //     this.props.changeCheck(fileList,typeName,typeUrl);
    // }
    fileList = fileList.map(file => {
        if (file.response) {
            if (file.response.success == 1) {
                file.url = file.response.data.fileUrl;
            } else if (file.response.success == 0) {
                file.status = 'error';
            }
        }
        return file;
    });
    if(this.props.changeCheck) this.props.changeCheck(fileList,typeName,typeUrl);
}
    // 初始化
    init = () => {
        
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
        this.init()
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