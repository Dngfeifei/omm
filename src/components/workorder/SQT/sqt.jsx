/***
 * 信息管理系统---服务需求表
 * 
 */


import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SET_WORKLIST } from '/redux/action'

import { Form, Tabs, Button, Select, message, Tooltip, Modal } from 'antd'

const { TabPane } = Tabs;

// 引入less
import '@/assets/less/pages/servies.less'
// 引入主表信息组件
import ServicesMain from '/components/workorder/SQT/masterList/ServiceRequire.jsx'

class Sqt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabsList:[{
                name:'主表信息'
            },{
                name:'服务区域'
            }],


            // 总体数据
            paramsObj: {
                "afterSaleAgreement": "",
                "areaList": [
                    {
                        "address": "济南市高新区齐鲁软件园",
                        "area": "山东/济南",
                        "areaId": "8",
                        "isMainDutyArea": 1
                    },
                    {
                        "address": "青岛市市南区开发基地",
                        "area": "山东/青岛",
                        "areaId": "9",
                        "isMainDutyArea": 0
                    }
                ],
                "companyName": "",
                "courseList": [
                    {
                        "courseDirection": "",
                        "coursePersonTimes": "",
                        "trainCourse": "",
                        "trainMode": "online",
                        "trainTeachers": "1"
                    }
                ],
                "custLevel": "1",
                "custName": "北京银信长远科技股份有限公司",
                "custNum": "10010110",
                "cycleEnd": "2021-12-11",
                "cycleStart": "2021-03-26",
                "endDate": "2021-04-02",
                sparePartsFileList:[{
                    fileName: "服务需求表--分析要点.txt",
                    fileUrl: "http://172.16.100.81/group1/M00/00/01/rBBkUWBj09uAQ-k1AAAAghB5_ug755.txt"
                }],// 合同承诺备机备件清单
                equipmentFileList:[{
                    fileName: "服务需求表--分析要点.txt",
                    fileUrl: "http://172.16.100.81/group1/M00/00/01/rBBkUWBj09uAQ-k1AAAAghB5_ug755.txt"
                }], // 上传外包合同设备清单附件
                "equipmentList": "[{\"fileName\":\"外包.txt\",\"fileUrl\":\"waibao/pef/fe/dfsa.txt\"},{\"fileName\":\"外包2.txt\",\"fileUrl\":\"waibao2/pef2/fe2/dfsa2.txt\"}]",
                "finalCustName": "",
                "id": "5",
                "industry": "",
                "inspectionDesc": "",
                "isCollectConfig": "",
                "isFirstInspection": "",
                "isLeagueBuild": "",
                "isOutsource": 0,
                "isReceiveReport": "",
                "isRenewal": 0,
                "isSubcontract": 0,
                "leagueBuildName": "",
                "longInspectionCycle": "",
                "managerId": "4223",
                "managerName": "",
                "managerPhone": "",
                "managerType": "1",
                "notCollectReason": "",
                "onsiteService": "",
                "orderNum": "5555555",
                "otherPromise": "",
                "outsourcer": "",
                "peopleNum": "",
                "projectCycleType": "",
                "projectId": "3",
                "projectName": "华夏银行2019年运维平台建设项目",
                "projectNumber": "010101",
                "projectType": "1",
                "renewalName": "",
                "renewalNumber": "",
                "salesmanId": "",
                "salesmanName": "张三",
                "salesmanPhone": "",
                "sceneInspectionCycle": "",
                "serviceListRequire": "",
                "serviceMode": "",
                "serviceReportCycle": "",
                "serviceType": "1",
                "slaList": [
                    {
                        "engineerArriveTime": 2,
                        "level": "S1",
                        "remarks": "",
                        "respondTime": 1,
                        "solveTime": 3,
                        "spareArriveTime": 1
                    },
                    {
                        "engineerArriveTime": 3,
                        "level": "S2",
                        "remarks": "",
                        "respondTime": 2,
                        "solveTime": 4,
                        "spareArriveTime": 2
                    }
                ],
                "sparePartsList": "[{\"fileName\":\"测试.txt\",\"fileUrl\":\"aoa/pef/fe/dfsa.txt\"},{\"fileName\":\"测试2.txt\",\"fileUrl\":\"aoa2/pef2/fe2/dfsa2.txt\"}]",
                "sparePartsTime": "",
                "specialDesc": "",
                "startDate": "2021-03-01",
                "writeDept": "",
                "writeTime": "2021-03-26 15:02:03.0",
                "writeUserId": "4228",
                "writeUserName": "孙含含"
            },

            paramsObj1:{}
        }
    }


    

    // 页面初始化方法(回显数据)
    init = () => {

    }

    // 定义方法,向父组件传递数据
    dream = (dat) => {
        console.log('父组件调用子组件方法', dat)
    }


    render = _ => {
        return (
            <div className="SqtContent">
                <Tabs defaultActiveKey="0" tabPosition={'top'} style={{ overflowY:'auto' }}>
                    {this.state.tabsList.map((item,index) => (
                        <TabPane tab={item.name} key={index}>
                           <ServicesMain></ServicesMain>
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        )
    }
}
export default Sqt;