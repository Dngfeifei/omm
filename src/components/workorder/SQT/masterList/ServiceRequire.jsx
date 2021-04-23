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
    state = {
        basicInfor: {
            orderNum: '',  //记录单号
            companyName: '广发', //公司名称
            writeTime: '', //填写时间
            writeUserName: '',//填写人
            writeDept: '销售部', //填写部门
            projectType: '1', //项目类别
            projectNumber: '',//项目号
            projectName: '',//项目名称
            serviceType: '201',//服务类别
            custNum: '',//客户编码
            custName: '',//客户名称
            industry: '广发',//所属行业
            custLevel: '0',//客户级别
            salesmanName: '张懿哲',//项目销售
            salesmanPhone: '13701202583',//销售联系方式
            managerType: '2',//项目经理类型
            managerName: '张懿哲',//项目经理
            managerPhone: '13701202583',//项目经理联系方式
            startDate: '',//项目开始日期
            endDate: '',//项目结束日期
            isRenewal: 0,// 是否续签项目,1是，0-否
            renewalNumber: '',//续签项目号
            renewalName: '',//续签项目名称
            isSubcontract: '1',// 是否转包项目,1是，0-否
            finalCustName: '宋波',//最终客户名称
            isLeagueBuild: '1',//是否有团建负责，1是，0否
            leagueBuildName: '宋波',//团建负责人
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
            isFirstInspection: '', // 是否需要提供首次巡检服务，1-是，0-否
            onsiteService: '',   // 项目是否约定驻场服务
            peopleNum: '1', //人数
            specialDesc: '', //特殊说明
            isCollectConfig: '', // 是否收集相关配置信息，1-是，0-否
            notCollectReason: '',    // 不收集配置信息原因说明
            serviceReportCycle: '', // 服务报告提交周期
            serviceListRequire: '', // 服务单要求
            partsList: '',//合同承诺备机备件清单
            sparePartsTime: '',// 合同承诺备机备件到库时间
            isOutsource: '',// 是否有外包情况（1-是，0-否，2-部分）
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
        swich:true,
        isEdit:false, //默认所有权限为可编辑
        formRead:1

    }
    // componentWillMount() {
    //     //this.initData(this.props)
    // }
    //@author  gl
    componentWillReceiveProps (nextprops) {
        console.log(nextprops.power.sign == 1 && !nextprops.swich && this.state.swich)
       if(nextprops.power.sign == 1 && !nextprops.swich && this.state.swich){
            this.initData(nextprops)
            this.setState({swich:false})
       }
    }
initData = (nextprops) => {
    
    let {power} = nextprops;
    //处理权限信息
    // if (power.formRead == 1) {
    //     // 若为1 所有页面可编辑
    //     isEdit = !power.formControl.masterList.isEdit;
    // } else if(power.formRead == 2){
    //     // 若为2 所有只读
    //     isEdit = true;
    // }
    // 先判断paramsObj是否有数据
    var arr = Object.keys(nextprops.paramsObj);
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
            return { uid: number, name: item.fileName,fileName:item.fileName,fileUrl:item.fileUrl, status: 'done', url: item.fileUrl }
        }) : [...ContractFileList]

        // 上传外包合同设备清单附件---到回传的已上传附件列表
        FileList = FileList.length ? FileList.map(item => {
            let number = Math.random().toString().slice(-6);
            return { uid: number, name: item.fileName,fileName:item.fileName,fileUrl:item.fileUrl, status: 'done', url: item.fileUrl }
        }) : [...FileList]

        let data = Object.assign({}, performancePledge, { sparePartsFileList: ContractFileList, equipmentFileList: FileList });


        // 先进行key值和serviceAreaNew；因为在编辑操作会使用到

        for (let index = 0; index < areaList.length; index++) {
            const element = areaList[index];
            element.key = index + 1;
            element.serviceAreaNew = (element.area).split('/');
        }
        // console.log()
        this.setState({
            basicInfor,
            areaList,
            performancePledge: data,
            formRead: power.formRead,
            isEdit:!power.formControl.masterList.isEdit,
            isSelfCreation: power.sign ? false : true
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
            if (data[key] != undefined) {
                obj[key] = data[key];
                if((!data[key] && key == 'projectCycleType' || key == 'afterSaleAgreement')) obj[key] = '1'
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
//处理是否需要首次巡检
setIsFirstInspection = (info,performancePledge)=>{
    // console.log(info.serviceType)
        if((!this.props.power.formControl || this.props.power.formControl.masterList.nodes == 3)){
            if(info.serviceType == '201' || info.serviceType == '212'){
               performancePledge = {...performancePledge,isFirstInspection:'1'};
            }else{
               performancePledge = {...performancePledge,isFirstInspection:'0'};
            }
       }
    return performancePledge
}
    //  接收到【基本信息】子组件返回的数据  
    getChildrenInfo = (info) => {
        // console.log('基本信息')
        //@author gl
        let {basicInfor,performancePledge,areaList}=this.state
        performancePledge = this.setIsFirstInspection(info,performancePledge);
        // console.log(performancePledge)
         //@author gl
        this.setState({
            basicInfor: info,
            performancePledge
        }, () => {
            //向父组件【SQT页面】传递数据
            let {basicInfor,areaList,performancePledge}=this.state
            console.log(performancePledge)
            let result=Object.assign({},basicInfor,performancePledge,{areaList})
            this.props.onChangeData(result);
        })
    }


    //  接收到【服务区域】子组件返回的数据  
    getAreaChildren = (info) => {
        // console.log('服务区域')
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
        // console.log('服务承诺')
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
        // console.log(data)
        // 当选择器中的数据有返回时，将【服务区域、服务承诺】组件中需要带入的数据进行带入
        let newPerformance = this.setInfo(data, this.state.performancePledge),{areaList} = this.state;
        newPerformance = this.setIsFirstInspection(data,newPerformance);
        this.setState({
            performancePledge: newPerformance,
            areaList: data.areaList
        },()=>{
            let {basicInfor,areaList,performancePledge}=this.state
            let result=Object.assign({},basicInfor,performancePledge,{areaList})
            this.props.onChangeData(result);
        })
    }


    render = _ => {
        let {power} = this.props;
        const node = power.formControl ? power.formControl.masterList.nodes ? power.formControl.masterList.nodes : 100 : 0;
        return (
            <div className="ServiesContent">

                {/* 基本信息--区域 */}
                <div className="infor commTop">
                    <div className="navTitle">基本信息</div>
                    <BasicInfor isEdit={this.state.isEdit} formRead={this.state.formRead} node={node} data={this.state.basicInfor} onChangeInfo={this.getChildrenInfo} isSelfCreation={this.props.power.sign} onGetChange={this.onGetChangeSelect}></BasicInfor>
                </div>

                {/* 服务区域--区域 */}
                <div className="commTop">
                    <div className="navTitle">服务区域</div>
                    <EditTable isEdit={this.state.isEdit} formRead={this.state.formRead} data={this.state.areaList} onChange={this.getAreaChildren} node={node}></EditTable>
                </div>

                {/* 服务承诺---区域 */}
                <div className="commTop">
                    <div className="navTitle">服务承诺</div>
                    <PerformancePledge isEdit={this.state.isEdit} formRead={this.state.formRead} serviceType={this.state.basicInfor.serviceType} node={node} sign={power.sign ? power.sign : 0} data={this.state.performancePledge} onChange={this.getChildrenData}></PerformancePledge>
                </div>

            </div>
        )
    }
}
const ServiesForm = Form.create()(servies)
export default ServiesForm