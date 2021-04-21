import React, { Component } from 'react'
import { Descriptions, Collapse  , Radio , Icon , InputNumber , Upload , message, List} from 'antd'
import '@/assets/less/pages/Micro.less'

// 引入--数据字典统一接口
import {getMicroRisk } from '/api/microrisk'

const { Panel } = Collapse;

class Micro extends Component{
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
                {detail:'是，新项目增加',value:1,detail2:'设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
                {detail:'是，续签项目新增设备',value:2,detail2:'关联设备需求表设备需求表名称设备需求表名称设备需求表名称设备需求表名称设备需求表名称'},
                {detail:'否，续签项目不需要申请',value:3},
                {detail:'否，新项目库存满足需求',value:4},
                {detail:'其他',value:5}
            ],
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:"/biSqtBase/upload",
                headers: header,
                multiple: true,
            },
        };
    }
    
    //回传数据使用
    handleClick = (value) => {
        console.log(value)
        if(this.props.changeCheck) this.props.changeCheck(value,'isApplySpare');
    }
    exportDom = (item) => {
        const {isApplySpare} = this.props.dataSource;
        if(item.value == 1 || item.value == 2){
            return (<div style={{width:'100%',position:'relative',display: 'flex',alignItems: 'center'}}><span style={{display:'inline-block',width:'60%',verticalAlign:'top'}}><Radio  checked={isApplySpare == item.value ? true : false} onChange={()=>this.handleClick(item.value)}>{item.detail}</Radio></span><span style={{width:1,display:'inline-block',backgroundColor:'#e8e8e8',position:'absolute',top:0,bottom:0,margin:'-8px 0',left: '60%'}}></span><span style={{display:'inline-block',width:'40%',textAlign:'center'}}>{item.detail2}</span></div>)
        }else{
            return (<Radio checked={isApplySpare == item.value ? true : false} onChange={()=>this.handleClick(item.value)}>{item.detail}</Radio>)
        }
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
    render () {
        const {data} = this.state;
        // let firstInspectReportList = [],configTemplateList = [],venturnReportList = [];
        // const {firstInspectReportName,firstInspectReport,firstInspectReportNamestatus,configTemplateName,configTemplate,configTemplateNamestatus,venturnReportName,venturnReport,venturnReportNamestatus} = this.props.dataSource;
        // if(firstInspectReportName){
        //     let obj = { uid: Math.random().toString().slice(-6), name: firstInspectReportName, status: firstInspectReportNamestatus ? firstInspectReportNamestatus : 'done', url: firstInspectReport }
        //     firstInspectReportList.push(obj)
        // }
        // if(configTemplateName){
        //     let obj = { uid: Math.random().toString().slice(-6), name: configTemplateName, status: configTemplateNamestatus ? configTemplateNamestatus : 'done', url: configTemplate }
        //     configTemplateList.push(obj)
        // }
        // if(venturnReportName){
        //     let obj = { uid: Math.random().toString().slice(-6), name: venturnReportName, status: firstInspectReportNamestatus ? venturnReportNamestatus : 'done', url: venturnReport }
        //     venturnReportList.push(obj)
        // }
        return (
            <div className="micro">
                <p className="micro_title">微观风险</p>
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
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'firstInspectReportName','firstInspectReport')} fileList={this.props.dataSource.firstInspectReportNameList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="配置信息管理模板" span={1}>
                        <div className="upload">
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'configTemplateName','configTemplate')} fileList={this.props.dataSource.configTemplateNameList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="风险提示报告" span={1}>
                        <div className="upload">
                            <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'venturnReportName','venturnReport')} fileList={this.props.dataSource.venturnReportNameList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }

}
class MicroDom extends Component{
    state = {
        data:{
            baseId:90, //记录单号
            areaMicroRisks:[{
                    areaId: 45,              //区域id
                    area:'山东/济南',          //区域
                    isMainDutyArea:1,        //是否是主责区域，1-是，0-否
                    isApplySpare: 1,             //是否申请备机备件 1-是，新项目增加 2-是，续签项目新增设备 3-否，续签项目不需要申请 4-否，新项目库存满足需求 5-其他
                    deviceDemand:'',         //设备需求
                    firstInspectReportName:'', //首次巡检总结报告名称
                    firstInspectReport:'',   //首次巡检总结报告地址
                    configTemplateName:'',   //配置信息管理模板名称
                    configTemplate:'',     //配置信息管理模板地址
                    venturnReportName:'',   //风险提示报告名称
                    venturnReport:'',        //风险提示报告地址
                    firstInspectReportNameList:[
                        {
                            uid:'23232',
                            name:'xxx.txt',
                            status:'done',
                            url:'xxxxxx'
                        }
                    ],
                    configTemplateNameList:[],
                    venturnReportNameList:[],

                },
                {
                    isChecked: 2
                }
            ]
        }
    };
    componentDidMount () {
    //获取渲染数据
        getMicroRisk({baseId:this.props.config.id}).then(res => {
            if (res.success == '1') {
                const {data} = this.state;
                let dataPlus = this.setData(res.data);
                let dataMerge = {...data,...dataPlus};
                this.setState({
                    data: dataMerge
                })
                if(this.props.onChange) this.props.onChange(dataMerge);
            }else if (res.success == '0') {
                message.error(res.message)
            }
        })
    }
    //处理数据
    setData = (data) =>{
        data.areaMicroRisks.map((item,index) => {
            const {firstInspectReportName,firstInspectReport,firstInspectReportNamestatus,configTemplateName,configTemplate,configTemplateNamestatus,venturnReportName,venturnReport,venturnReportNamestatus} = item;
            data.areaMicroRisks[index].firstInspectReportNameList = item.firstInspectReportName ? [{ uid: Math.random().toString().slice(-6), name: firstInspectReportName, status: firstInspectReportNamestatus ? firstInspectReportNamestatus : 'done', url: firstInspectReport }] : [];
            data.areaMicroRisks[index].configTemplateNameList = item.configTemplateName ? [{ uid: Math.random().toString().slice(-6), name: configTemplateName, status: configTemplateNamestatus ? configTemplateNamestatus : 'done', url: configTemplate }] : [];
            data.areaMicroRisks[index].venturnReportNameList = item.venturnReportName ? [{ uid: Math.random().toString().slice(-6), name: venturnReportName, status: venturnReportNamestatus ? venturnReportNamestatus : 'done', url: venturnReport }] : [];
        })
       return data;
    }
    setPane = (data) => {
        return (
            <div style={{fontSize:18,fontWeight:600,color:'#02A7F0'}}>
                <span>{data.area}</span>
                {
                    data.isMainDutyArea ? <span style={{color:'red'}}>【 主责区域 】</span>: null
                }
            </div>
        )
    }
    //修改数据函数
    changeCheck = (value,index,typeName,typeUrl) => {
        const {data} = this.state;
        const {areaMicroRisks} = data;
        if(typeName == 'isApplySpare'){ //是否申请备机备件
            if(areaMicroRisks.length) areaMicroRisks[index][typeName] = value
        }
        if(typeName == 'deviceDemand'){//设备需求
            if(areaMicroRisks.length) areaMicroRisks[index][typeName] = value
        }
        if(typeName == 'firstInspectReportName' || typeName == 'configTemplateName' || typeName == 'venturnReportName'){//首次巡检总结报告名称
            if(areaMicroRisks.length){
                areaMicroRisks[index][typeName] = value [0] ? value[0].name : '';
                areaMicroRisks[index][typeUrl] = value[0] ? value[0].url : '';
                areaMicroRisks[index][typeName+'status'] = value[0] ? value[0].status : '';
                areaMicroRisks[index][typeName+'List'] = value;
            }
        }
        this.setState({data});
        if(this.props.onChange) this.props.onChange(data);
    }
    render () {
        const {data} = this.state;
        const customPanelStyle = {
            background: 'white',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
          };
        return (
            <Collapse className="microDom_parent" defaultActiveKey={data.areaMicroRisks.map((item,index) => index)} bordered={false} style={{paddingTop:15,height: '100%',overflow: 'auto'}} expandIconPosition="right" expandIcon={({ isActive }) => <span style={{color:'#4876e7'}}> {isActive ? '收起' : '展开'} </span>}>
                {
                    data.areaMicroRisks.map((Item,index) => {
                        return <Panel bordered={false} header={this.setPane(Item)} key={index} style={customPanelStyle}>
                            <Micro dataSource={Item} changeCheck={(value,typeName,typeUrl) => this.changeCheck(value,index,typeName,typeUrl)}></Micro>
                        </Panel>
                    })
                }
            </Collapse>
        )
    }

}

export default MicroDom