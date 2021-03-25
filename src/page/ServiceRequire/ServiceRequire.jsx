/**
 * 表格信息--测试
 * @author jxl
*/


import React, { Component } from 'react'
import { Descriptions, Badge, Form, Input, Select, DatePicker } from 'antd'

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


// 引入日期格式化
import moment from 'moment'
// 引入页面CSS
import '/assets/less/pages/servies.less'

// 引入--基本信息页面
import BasicInfor from './basicInfor.jsx'
// 引入--服务承诺页面
import PerformancePledge from "./performancePledge.jsx"
// 引入--服务区域表格组件
import EditTable from "./serviceArea.jsx"




class servies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
            // 【服务区域】的table表格数据
            serviceAreaTable:[],
            // 【服务承诺】组件的所有数据
            PerformanceData:{
                serviceMode:'111',  // 服务方式
                isReport:'11',  //是否提交验收报告
                remoteCycle:'1',  //远程巡检周期
                OnSiteCycle:'',      // 现场巡检周期
                patrolSpecialDesc:'xxxxxxxxxxx', //巡检特殊说明
                trainingTableData:[{
                    id: 1,
                    way: '1',
                    teachers: '',
                    courseDirection: '',
                    courses: '',
                    TrainingSessions: ''
                }],
                firstInspection:'0', //是否需要提供首次巡检服务
                isOnSiteService:'无驻场',   // 项目是否约定驻场服务
                persons:'1', //人数
                specialDesc:'', //特殊说明
                siCorrelationConfig:'0', // 是否收集相关配置信息
                configDesc:'',//不收集配置信息原因说明
                reportingCycle:'', //服务报告提交周期
                orderRequire:'', //服务单要求
                partsList:'',//合同承诺备机备件清单
                partsArrivalTime:'',//合同承诺备机备件到库时间
                isOutsourcing:'0',//是否有外包情况
                outsourcer:'', //外包商
                annexList:"",//上传外包合同设备清单附件
                //集成/备件销售项目（101、102）售后服务约定
                serverstartTime:'',
                serverendTime:'',
                otherImportant:'', //其他重要承诺及要求
                configTable:[{
                    id:'1',
                    leavel:'S1',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                },{
                    id:'2',
                    leavel:'S2',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                },{
                    id:'3',
                    leavel:'S3',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                },{
                    id:'4',
                    leavel:'S4',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                },{
                    id:'5',
                    leavel:'S5',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                },{
                    id:'6',
                    leavel:'S6',
                    response:'',
                    engineerParts:'',
                    spareParts:'',
                    resolutionTime:'',
                    notes:'',
                }]
            }
        }
    }

    componentWillMount() {
      
    }

    // 挂载完成
    componentDidMount = () => {
        this.init();



    }

    // 初始化接口
    init = () => {

    }


    //  接收到【服务承诺】子组件返回的数据  
    getChildrenData=(info)=>{
        console.log('****************       接收到【服务承诺】子组件返回的数据        ******************')
        console.log(info)
        this.setState({
            PerformanceData:info
        })
    }

    //  接收到【服务区域】子组件返回的数据  
    getAreaChildren=(info)=>{
        console.log('****************  接收到【服务区域】子组件返回的数据     ******************')
        console.log(info)
        this.setState({
            serviceAreaTable:info
        })
    }





    render = _ => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="ServiesContent">

                {/* 基本信息--区域 */}
                <div className="infor commTop">
                    <div className="navTitle">基本信息</div>
                    <BasicInfor></BasicInfor>
                </div>

                {/* 服务区域--区域 */}
                <div className="commTop">
                    <div className="navTitle">服务区域</div>
                    <EditTable data={this.state.serviceAreaTable} onChange={this.getAreaChildren}></EditTable>
                </div>

                {/* 服务承诺---区域 */}
                <div className="commTop">
                    <div className="navTitle">服务承诺</div>
                    <PerformancePledge data={this.state.PerformanceData} onChange={this.getChildrenData}></PerformancePledge>
                </div>

            </div>
        )
    }
}
const ServiesForm = Form.create()(servies)
export default ServiesForm