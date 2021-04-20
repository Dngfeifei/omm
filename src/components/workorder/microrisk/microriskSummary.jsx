import React, { Component } from 'react'
import { Descriptions, Collapse  , Radio , Icon , Checkbox , Upload , message, List} from 'antd'
import '@/assets/less/pages/Micro.less'

// 引入--数据字典统一接口
import {getMicroRiskSum } from '/api/microrisk'

const { Panel } = Collapse;

class MicroSum extends Component{
    constructor(props) {
        super(props)
        let tokenName='token',header = {},actionUrl = '';
        if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
            actionUrl = process.env.API_URL
        }
        header.authorization = `Bearer ${localStorage.getItem(tokenName) || ''}`;
        this.state = {
            data: [
                {detail:'是，新项目增加',value:'1',detail2:'设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
                {detail:'是，续签项目新增设备',value:'2',detail2:'关联设备需求表设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
                {detail:'否，续签项目不需要申请',value:'3'},
                {detail:'否，新项目库存满足需求',value:'4'},
                {detail:'其他',value:5}
            ],
            dataSource:{
                baseId:90, //记录单号
                isApplySpare: '1,2',             //是否申请备机备件 1-是，新项目增加 2-是，续签项目新增设备 3-否，续签项目不需要申请 4-否，新项目库存满足需求 5-其他
                deviceDemand:'',         //设备需求
                firstInspectReportName:'', //首次巡检总结报告名称
                firstInspectReport:'',   //首次巡检总结报告地址
                configTemplateName:'',   //配置信息管理模板名称
                configTemplate:'',     //配置信息管理模板地址
                venturnReportName:'',   //风险提示报告名称
                venturnReport:''        //风险提示报告地址
                   
            },
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:"/biSqtBase/upload",
                headers: header,
                multiple: true,
            }
        };
    }
    componentDidMount () {
        //获取渲染数据
        // getMicroRiskSum({baseId:this.props.config.id}).then(res => {
        //         if (res.success == '1') {
        //             this.setState({
        //                 dataSource:res.data
        //             })
        //         }else if (res.success == '0') {
        //             message.error(res.message)
        //         }
        //     })
        }
    //回传数据使用
    handleClick = (e) => {
        let {isApplySpare} = this.state.dataSource;
        isApplySpare = isApplySpare.split(',');
        if(e.target.checked && isApplySpare.indexOf(e.target.value) == -1){
            isApplySpare.push(e.target.value)
        }else if(!e.target.checked && isApplySpare.indexOf(e.target.value) > -1){
            isApplySpare.splice(isApplySpare.indexOf(e.target.value),1)
        }
        this.changeCheck(isApplySpare.toString(),'isApplySpare')
    }
    //修改数据
    changeCheck = (value,typeName,typeUrl) => {
        const {dataSource} = this.state;
        if(typeName == 'isApplySpare'){ //是否申请备机备件
            dataSource[typeName] = value
        }
        if(typeName == 'deviceDemand'){//设备需求
            dataSource[typeName] = value
        }
        if(typeName == 'firstInspectReportName' || typeName == 'configTemplateName' || typeName == 'venturnReportName'){//首次巡检总结报告名称
            dataSource[typeName] = value [0] ? value[0].name : '';
            dataSource[typeUrl] = value[0] ? value[0].url : '';
            dataSource[typeName+'status'] = value[0] ? value[0].status : '';
        }
        this.setState({dataSource})
    }
    exportDom = (item) => {
        let {isApplySpare} = this.state.dataSource;
        isApplySpare = isApplySpare.split(',');
        return (<Checkbox value={item.value} checked={isApplySpare.indexOf(item.value) > -1 ? true : false} onChange={this.handleClick}>{item.detail}</Checkbox>)
    }
    // 附件上传-----上传前做限制判断
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
            message.error('上传文件大小不能超过30MB!');
        }
        return isLt2M;
    }
    //附件上传过程函数
    uploadChange=(info,typeName,typeUrl)=>{
        let fileList = [...info.fileList];
        // 1. 限制上载文件的数量---只显示最近上传的1个文件，旧文件将被新文件替换
        fileList = fileList.slice(-1);
        // 2.读取响应并显示文件链接
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
         this.changeCheck(fileList,typeName,typeUrl);
    }
    render () {
        const {data,dataSource} = this.state;
        let firstInspectReportList = [],configTemplateList = [],venturnReportList = [];
        const {firstInspectReportName,firstInspectReport,firstInspectReportNamestatus,configTemplateName,configTemplate,configTemplateNamestatus,venturnReportName,venturnReport,venturnReportNamestatus} = dataSource;
        if(firstInspectReportName){
            let obj = { uid: Math.random().toString().slice(-6), name: firstInspectReportName, status: firstInspectReportNamestatus ? firstInspectReportNamestatus : 'done', url: firstInspectReport }
            firstInspectReportList.push(obj)
        }
        if(firstInspectReportName){
            let obj = { uid: Math.random().toString().slice(-6), name: configTemplateName, status: configTemplateNamestatus ? configTemplateNamestatus : 'done', url: configTemplate }
            firstInspectReportList.push(obj)
        }
        if(firstInspectReportName){
            let obj = { uid: Math.random().toString().slice(-6), name: venturnReportName, status: firstInspectReportNamestatus ? venturnReportNamestatus : 'done', url: venturnReport }
            firstInspectReportList.push(obj)
        }
        return (
            <div className="micro">
                <p className="micro_title">微观风险汇总表</p>
                <Descriptions className="micro_dom" bordered column={1} size={'small'}>
                    <Descriptions.Item label="是否申请备机备件" span={1}>
                        <List
                            size="small"
                            bordered={false}
                            style={{margin:'-8px -16px'}}
                            dataSource={data}
                            renderItem={item => <List.Item style={{paddingLeft:10}}>{this.exportDom(item)}</List.Item>}>
                        </List>
                    </Descriptions.Item>
                    <Descriptions.Item label="首次巡检总结报告" span={1}>
                        <div className="upload">
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'firstInspectReportName','firstInspectReport')} fileList={firstInspectReportList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="配置信息管理模板" span={1}>
                        <div className="upload">
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'configTemplateName','configTemplate')} fileList={configTemplateList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="风险提示报告" span={1}>
                        <div className="upload">
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'venturnReportName','venturnReport')} fileList={venturnReportList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }

}
export default MicroSum