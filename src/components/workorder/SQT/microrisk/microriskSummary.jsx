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
                {detail:'是，新项目增加',value:'1',detail2:'设备需求表名称'},
                {detail:'是，续签项目新增设备',value:'2',detail2:'关联设备需求表'},
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
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:"/biSqtBase/upload",
                headers: header,
                multiple: true,
            }
        };
    }
    //默认静态属性
    static defaultProps = {
        power:{formControl:{microRiskSummary:{isEdit:true}}},
        onChange : null
    }
    componentDidMount () {
        //获取渲染数据
        getMicroRiskSum({baseId:this.props.power.id}).then(res => {
            if (res.success == '1') {
                const {dataSource} = this.state;
                if(!res.data) return;
                let data = this.setData(res.data);
                let dataMerge = {...dataSource,...data};
                this.setState({
                    dataSource: dataMerge
                })
                if(this.props.onChange){
                    let dataSource = this.vildteMicro(dataMerge);
                    this.props.onChange(dataSource);
                }
            }else if (res.success == '0') {
                message.error(res.message)
            }
        })
    }
    //处理数据
    setData = (data) =>{
        const {firstInspectReportName,firstInspectReport,firstInspectReportNamestatus,configTemplateName,configTemplate,configTemplateNamestatus,venturnReportName,venturnReport,venturnReportNamestatus} = data;
        data.firstInspectReportNameList = firstInspectReportName ? [{ uid: Math.random().toString().slice(-6), name: firstInspectReportName, status: firstInspectReportNamestatus ? firstInspectReportNamestatus : 'done', url: firstInspectReport }] : [];
        data.configTemplateNameList = configTemplateName ? [{ uid: Math.random().toString().slice(-6), name: configTemplateName, status: configTemplateNamestatus ? configTemplateNamestatus : 'done', url: configTemplate }] : [];
        data.venturnReportNameList = venturnReportName ? [{ uid: Math.random().toString().slice(-6), name: venturnReportName, status: venturnReportNamestatus ? venturnReportNamestatus : 'done', url: venturnReport }] : [];
        return data;
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
//验证最终提交数据是否正确
    vildteMicro = (data) => {
        let obj = {dataSource: data,info:{state:true,message:''}};
        if(data.baseId){
            let {isApplySpare,firstInspectReportNameList,configTemplateNameList,venturnReportNameList} = data;
            if(isApplySpare && firstInspectReportNameList && configTemplateNameList && venturnReportNameList){
                if(isApplySpare === ''){
                    obj.info.state = false,obj.info.message = `微观风险汇总附表区域是否申请备机备件未选择`;
                    return obj;
                }
                // else if(firstInspectReportNameList.length && firstInspectReportNameList[0].status != 'done'){
                //     obj.info.state = false,obj.info.message = `微观风险汇总附表区域首次巡检总结报告附件上传有误`;
                //     return obj;
                // }else if(configTemplateNameList.length && configTemplateNameList[0].status != 'done'){
                //     obj.info.state = false,obj.info.message = `微观风险汇总附表区域配置信息管理模板附件上传有误`;
                //     return obj;
                // }else if(venturnReportNameList.length && venturnReportNameList[0].status != 'done'){
                //     obj.info.state = false,obj.info.message = `微观风险汇总附表区域风险提示报告附件上传有误`;
                //     return obj;
                // }else if(!firstInspectReportNameList.length || !venturnReportNameList.length || !configTemplateNameList.length){
                //     obj.info.state = false,obj.info.message = `微观风险汇总附表区域附件上传有误`;
                //     return obj
                // }
            }else{
                obj.info.state = false,obj.info.message = `微观风险汇总附表区域填写有误`;
                return obj;
            }
        }else{
            obj.info.state = false,obj.info.message = `微观风险汇总附表区域填写有误，请联系管理员！`;
            return obj;
        }
        return obj;
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
            dataSource[typeName+'List'] = value;
        }
        this.setState({dataSource})
        if(this.props.onChange){
            let data = this.vildteMicro(dataSource);
            this.props.onChange(data);
        }
    }
    exportDom = (item) => {
        let {isApplySpare} = this.state.dataSource;
        isApplySpare = isApplySpare.split(',');
        return (<Checkbox disabled={this.props.power.formRead == 2 ? true : !this.props.power.formControl.microRiskSummary.isEdit ? true : false} value={item.value} checked={isApplySpare.indexOf(item.value) > -1 ? true : false} onChange={this.handleClick}>{item.detail}</Checkbox>)
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
    //处理个lable显示是否必填
    setRequired = (key) => {
        if(this.props.power.formRead == 2){
            return <span>{key}</span>
        }else{
            if(this.props.power.formControl.microRiskSummary.isEdit){
                return <span>{key}<span className='required'></span></span>
            }else{
                return <span>{key}</span>
            }
        }
    }
    render () {
        const {data} = this.state;
        return (
            <div className="micro">
                <p className="micro_title">微观风险汇总表</p>
                <Descriptions className="micro_dom" bordered column={1} size={'small'}>
                    <Descriptions.Item label={this.setRequired("是否申请备机备件")} span={1}>
                        <List
                            size="small"
                            bordered={false}
                            style={{margin:'-8px -16px'}}
                            dataSource={data}
                            renderItem={item => <List.Item style={{paddingLeft:10}}>{this.exportDom(item)}</List.Item>}>
                        </List>
                    </Descriptions.Item>
                    <Descriptions.Item label={this.setRequired("首次巡检总结报告")} span={1}>
                        <div className="upload">
                            <Upload disabled={this.props.power.formRead == 2 ? true : !this.props.power.formControl.microRiskSummary.isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'firstInspectReportName','firstInspectReport')} fileList={this.state.dataSource.firstInspectReportNameList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label={this.setRequired("配置信息管理模板")} span={1}>
                        <div className="upload">
                            <Upload disabled={this.props.power.formRead == 2 ? true : !this.props.power.formControl.microRiskSummary.isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'configTemplateName','configTemplate')} fileList={this.state.dataSource.configTemplateNameList}>
                                <Icon type="upload" />上传
                            </Upload>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label={this.setRequired("风险提示报告")} span={1}>
                        <div className="upload">
                            <Upload disabled={this.props.power.formRead == 2 ? true : !this.props.power.formControl.microRiskSummary.isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={(info) => this.uploadChange(info,'venturnReportName','venturnReport')} fileList={this.state.dataSource.venturnReportNameList}>
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