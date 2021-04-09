/**
 * 表格信息--测试
 * @author jxl
*/


import React, { Component } from 'react'
import { Button, Form } from 'antd'

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
import { configConsumerProps } from 'antd/lib/config-provider'

class servies extends Component {
    constructor(props) {
        super(props)

        this.state = {

            basicInfor: {
                orderNum: '',  //记录单号
                companyName: '', //公司名称
                writeTime: '', //填写时间
                writeUserName: '',//填写人
                writeDept: '', //填写部门
                projectType: '', //项目类别
                projectNumber: '',//项目号
                projectName: '',//项目名称
                serviceTypeName: '',//服务类别
                custNum: '',//客户编码
                custName: '',//客户名称
                industry: '',//所属行业
                custLevel: '',//客户级别
                salesmanName: '',//项目销售
                salesmanPhone: '',//销售联系方式
                managerType: '',//项目经理类型
                managerName: '',//项目经理
                managerPhone: '',//项目经理联系方式
                startDate: '',//项目开始日期
                endDate: '',//项目结束日期
                isRenewal: '1',// 是否续签项目,1是，0-否
                renewalNumber: '',//续签项目号
                renewalName: '',//续签项目名称
                isSubcontract: '1',// 是否转包项目,1是，0-否
                finalCustName: '',//最终客户名称
                isLeagueBuild: '1',//是否有团建负责，1是，0否
                leagueBuildName: '',//团建负责人
            },
            // 【服务区域】的table表格数据
            areaList: [],
            // 【服务承诺】组件的所有数据
            performancePledge: {
                serviceMode: '',  // 服务方式
                isReceiveReport: '',  // 是否提交验收报告1-是，0-否
                longInspectionCycle: '',  //远程巡检周期
                sceneInspectionCycle: '',      // 现场巡检周期
                inspectionDesc: '', //巡检特殊说明
                courseList: [{
                    id: 1,
                    trainMode: 'online',  // 默认字段是 1-线上 0-线下
                    trainTeachers: '1',    // 培训师资
                    courseDirection: "",   // 课程方向
                    trainCourse: "", // 培训课程
                    oursePersonTimes: "",  // 培训人次
                }],
                isFirstInspection: '0', // 是否需要提供首次巡检服务，1-是，0-否
                onsiteService: '',   // 项目是否约定驻场服务
                peopleNum: '1', //人数
                specialDesc: '', //特殊说明
                isCollectConfig: '0', // 是否收集相关配置信息，1-是，0-否
                notCollectReason: '',    // 不收集配置信息原因说明
                serviceReportCycle: '', // 服务报告提交周期
                serviceListRequire: '', // 服务单要求
                partsList: '',//合同承诺备机备件清单
                sparePartsTime: '',// 合同承诺备机备件到库时间
                isOutsource: '0',// 是否有外包情况（1-是，0-否，2-部分）
                outsourcer: '', //外包商
                sparePartsFileList: [],// 合同承诺备机备件清单
                equipmentFileList: [], // 上传外包合同设备清单附件
                afterSaleAgreement: '1', // 集成/备件销售项目（101、102）售后服务约定 1-原厂服务，2-我司服务
                projectCycleType: '1',// 项目周期类型，1-部分项目周期，2-全部项目周期
                cycleStart: '',  // 周期开始日期
                cycleEnd: '', // 周期结束日期
                otherPromise: '', //其他重要承诺及要求
                slaList: []



            },
            // 判断 是否是从【自行创建服务计划表】的情况下进入；
            isSelfCreation: true,
            isEdit:false //默认所有权限为可编辑

        }
    }

    componentWillMount() {
        

    }
    //@author  gl
    componentWillReceiveProps (nextprops) {
       // if(nextprops.power.sign == 1 && !nextprops.swich){
            this.initData(nextprops)
       // }
    }
initData = (nextprops) => {
    
    console.log(nextprops)
    let {power} = nextprops;
    let {isEdit} = this.state;
    // 判断 是否是从【自行创建服务计划表】的情况下进入；true代表是  
    // this.setState({
    //     isSelfCreation: this.props.params ? this.props.params.dataType.isSelfCreation : true
    // })
    //判断工作流
    if (power.formRead == 1) {
        // 若为1 所有页面可编辑
        isEdit = !power.formControl.masterList.isEdit;
    } else if(power.formRead == 2){
        // 若为2 所有只读
        isEdit = true;
    }
    // 先判断paramsObj是否有数据
    var arr = Object.keys(nextprops.paramsObj ? nextprops.paramsObj : {});
    if (arr.length != 0) { //false


        // 进行【基本信息、服务区域、服务承诺】页面组件的赋值
        let basicInfor = this.setInfo(nextprops.paramsObj, this.state.basicInfor);
        let areaList = nextprops.paramsObj.areaList;
        let performancePledge = this.setInfo(nextprops.paramsObj, this.state.performancePledge);



        // 将【服务承诺】中附件数据加上uid 事件处理

        let ContractFileList = performancePledge.sparePartsFileList;    // 合同承诺备机备件清单---已上传附件信息数据
        let FileList = performancePledge.equipmentFileList;  //上传外包合同设备清单附件---已上传附件信息数据


        //获取 合同承诺备机备件清单-----到回传的已上传附件列表
        ContractFileList = ContractFileList.length ? ContractFileList.map(item => {
            let number = Math.random().toString().slice(-6);
            return { uid: number, name: item.fileName, status: 'done', url: item.fileUrl }
        }) : [...ContractFileList]

        // 上传外包合同设备清单附件---到回传的已上传附件列表
        FileList = FileList.length ? FileList.map(item => {
            let number = Math.random().toString().slice(-6);
            return { uid: number, name: item.fileName, status: 'done', url: item.fileUrl }
        }) : [...FileList]

        let data = Object.assign({}, performancePledge, { sparePartsFileList: ContractFileList, equipmentFileList: FileList });


        // 先进行key值和serviceAreaNew；因为在编辑操作会使用到

        for (let index = 0; index < areaList.length; index++) {
            const element = areaList[index];
            element.key = index + 1;
            element.serviceAreaNew = (element.area).split('/');
        }
        this.setState({
            basicInfor,
            areaList,
            performancePledge: data,
            isEdit,
            isSelfCreation: this.props.power.sign ? false : true
        })


    }
}

    /**
    *  自定义封装---用于一个对象给另一个对象赋值。
    * params: 第一个对象==赋值    第二个对象===取值 (意思就是：data给params赋值 返回的是params)
    */
    setInfo = (data, params) => {
        var obj = {};
        Object.keys(params).forEach(key => {
            if (data[key]) {
                obj[key] = data[key] || null;
            }
        });
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                params[key] = obj[key]
                //使用setsatte方法改变类中属性
            }
        }
        var newData = Object.assign({}, params);
        return newData
    };

    //  接收到【基本信息】子组件返回的数据  
    getChildrenInfo = (info) => {
        //@author gl
        let {basicInfor,performancePledge,areaList}=this.state
        if(info.serviceTypeName !=basicInfor.serviceTypeName){
            if((this.props.power.masterList == 1 || this.props.power.masterList == 3 || !this.props.power.masterList )){
                if(info.serviceTypeName == '支持与维护服务' || info.serviceTypeName == '软件支持与维护服务'){
                   performancePledge = {...performancePledge,isFirstInspection:'1'};
                }else{
                //    console.log(performancePledge)
                   performancePledge = {...performancePledge,isFirstInspection:'0'};
                }
           }
        }
         //@author gl
        this.setState({
            basicInfor: info,
            performancePledge
        }, () => {
            //向父组件【SQT页面】传递数据
             let {basicInfor,areaList,performancePledge}=this.state
            let result=Object.assign({},basicInfor,performancePledge,{areaList})
            this.props.onChangeData(result);
        })
    }


    //  接收到【服务区域】子组件返回的数据  
    getAreaChildren = (info) => {
        this.setState({
            areaList: info
        }, () => {
             // 向父组件【SQT页面】传递数据
             let {basicInfor,performancePledge,areaList}=this.state
             let result=Object.assign({},basicInfor,performancePledge,{areaList})
             this.props.onChangeData(result);
        })
    }

    //  接收到【服务承诺】子组件返回的数据  
    getChildrenData = (info) => {
        this.setState({
            performancePledge: info
        }, () => {
          // 向父组件【SQT页面】传递数据
          let {basicInfor,areaList,performancePledge}=this.state
           let result=Object.assign({},basicInfor,performancePledge,{areaList})
          this.props.onChangeData(result);
        })
    }


    //  接收到【基本信息】子组件中【选择器】返回的数据  
    onGetChangeSelect = (data) => {
        // 当选择器中的数据有返回时，将【服务区域、服务承诺】组件中需要带入的数据进行带入
        let newPerformance = this.setInfo(data, this.state.performancePledge),{areaList} = this.state;
        this.setState({
            performancePledge: newPerformance,
            areaList: [...areaList,...data.areaList]
        })
    }


    render = _ => {
        return (
            <div className="ServiesContent">

                {/* 基本信息--区域 */}
                <div className="infor commTop">
                    <div className="navTitle">基本信息</div>
                    <BasicInfor isEdit={this.state.isEdit} node={this.props.power.masterList ? this.props.power.masterList : 0} data={this.state.basicInfor} onChangeInfo={this.getChildrenInfo} isSelfCreation={this.state.isSelfCreation} onGetChange={this.onGetChangeSelect}></BasicInfor>
                </div>

                {/* 服务区域--区域 */}
                <div className="commTop">
                    <div className="navTitle">服务区域</div>
                    <EditTable isEdit={this.state.isEdit} data={this.state.areaList} onChange={this.getAreaChildren}></EditTable>
                </div>

                {/* 服务承诺---区域 */}
                <div className="commTop">
                    <div className="navTitle">服务承诺</div>
                    <PerformancePledge isEdit={this.state.isEdit} serviceTypeName={this.state.basicInfor.serviceTypeName} node={this.props.power.masterList ? this.props.power.masterList : 0} data={this.state.performancePledge} onChange={this.getChildrenData}></PerformancePledge>
                </div>

            </div>
        )
    }
}
const ServiesForm = Form.create()(servies)
export default ServiesForm