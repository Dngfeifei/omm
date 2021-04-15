/**
 * 服务需求表----服务承诺
 * @author  jxl
 */

import React, { Component } from 'react'
import { Descriptions, Table, Form, Input, Select, DatePicker, Popconfirm, Button , Radio , Icon , InputNumber , Upload , message} from 'antd'

const { TextArea } = Input  //多行文本域
const { Option } = Select        // 下拉选择器
const { MonthPicker, RangePicker, WeekPicker } = DatePicker    // 时间日期插件
const { Item } = Form

const { Provider, Consumer } = React.createContext()//组件之间传值
const dateFormat = 'YYYY-MM-DD';

let token = localStorage.getItem('token')


// 引入日期格式化
import moment from 'moment'

// 引入页面CSS
import '/assets/less/pages/performancePledge.less'
import '@/assets/less/pages/logBookTable.css'

// 引入--数据字典统一接口
import {customerLevel } from '/api/customerInfor'

// 行内表单渲染
const EditableRow = ({ form, index, ...props }) => (
    <Provider value={form}>
        <tr {...props} />
    </Provider>
);
const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            dataIndex == 'trainMode' ?
                <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `${title} 不能为空！`,
                            },
                        ],
                        initialValue: record[dataIndex].toString()
                    })(
                        <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true} showSearch ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}>
                            {
                                this.props.trainModeArray.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select>
                    )}
                </Form.Item> : dataIndex == 'trainTeachers' ? <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `${title} 不能为空！`,
                            },
                        ],
                        initialValue: record[dataIndex].toString(),
                    })(
                        <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true} showSearch ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}>
                            {
                                this.props.trainTeachersArray.map((items, index) => {
                                    return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                })
                            }
                        </Select>
                    )}
                </Form.Item> : <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `${title} 不能为空！`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
                    </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24,height:21}}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            trainModeArray,
            trainTeachersArray,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <Consumer>{this.renderCell}</Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}






class performance extends Component {
    constructor(props) {
        super(props)
        let tokenName='token',header = {},actionUrl = '';
        if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
            actionUrl = process.env.API_URL
        }
        header.authorization = `Bearer ${localStorage.getItem(tokenName) || ''}`;
        this.state = {
            editing: false,
            count: 0,
            //上传外包合同设备清单附件--上传配置
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                action:"/biSqtBase/upload",
                // 接受的文件类型
                // accept: '.xls,.xlsx,.doc,.txt,.PPT,.DOCS,.XLSX,.PPTX',
                headers: header,
                multiple: true,
            },
            //上传外包合同设备清单附件---已上传附件信息数据
            fileList:[],

            // 合同承诺备机备件清单---已上传附件信息数据
            ContractFileList: [],

            // 用于【培训方式】table控制给侧边操作按钮动态添加类名
            currentState:0,

            // 集成/备件销售项目（101、102）售后服务约定
            dateTime:{
                originalServiceParts_start:'',  // 原厂服务--部分项目周期---起始日期
                originalServiceParts_end:'', // 原厂服务--部分项目周期---结束日期
                originalServiceAll_start:'',     // 原厂服务--全部项目周期---起始日期
                originalServiceAll_end:'', // 原厂服务--全部项目周期---起始日期

                ourDriverParts_start:'',  // 我司服务--部分项目周期---起始日期
                ourDriverParts_end:'', // 我司服务--部分项目周期---结束日期
                ourDriverAll_start:'',     // 我司服务--全部项目周期---起始日期
                ourDriverAll_end:'', // 我司服务--全部项目周期---起始日期
            },

            // 整体--服务承诺页面的所有属性
            PerformanceData:null,

            // 项目是否约定驻场服务
            siteServiceArray:[],
            // 服务方式
            serviceModeArray:[],
            // 不收集配置信息原因说明
            notCollectReasonArray:[],
            // 服务报告提交周期
            serviceReportCycleArray:[],
            // 服务单要求
            serviceListRequireArray:[],
            // 远程巡检周期、现场巡检周期
            inspectionCycleArray:[],
            // 培训方式
            trainModeArray:[],
            // 培训师资
            trainTeachersArray:[],
        }
    }

    componentWillMount(){
        this.initData(this.props.data)
    }
    //@author  gl
    componentWillReceiveProps (nextprops) {
        let {PerformanceData} = this.state;
        if(JSON.stringify(PerformanceData) == JSON.stringify(nextprops.data)) return false;
        console.log(JSON.stringify(PerformanceData) == JSON.stringify(nextprops.data))
		this.initData(nextprops.data)
	}
    //初始化服务承诺接收数据  @author  gl
    initData = (data) => {
        // console.log(data)
        this.setState({
            PerformanceData: data,
            count: data.courseList ? data.courseList.length + 1 : 1,
        })
    }
    // 向父组件传递数据
    updataToParent=()=>{
        this.props.onChange(this.state.PerformanceData)
    }

    componentDidMount() {
        // 依赖于的数据字典--接口
        this.getDictItems();
    }

    // 初始化接口
    init = () => {
        this.columns = [
            {
                title: '培训方式',
                dataIndex: 'trainMode',
                render: t => t == 'online' ? '线上' : '线下',
                editable: true,
                align:'center'
            },
            {
                title: '培训师资',
                dataIndex: 'trainTeachers',
                render: t => t == '1' ? '原厂' : t == '2' ? '合作方' : '我司提供培训',
                editable: true,
                align:'center'
            },
            {
                title: '课程方向',
                dataIndex: 'courseDirection',
                editable: true,
                align:'center'
            }, {
                title: '培训课程',
                dataIndex: 'trainCourse',
                editable: true,
                align:'center'
            }, {
                title: '培训人次',
                dataIndex: 'oursePersonTimes',
                editable: true,
                align:'center'
            },
        ];

        // 底部table等级表格
        this.columnsLeavel = [
            {
                title: '等级',
                dataIndex: 'level',
                align:'center'
            },{
                title: '响应时限（小时）',
                dataIndex: 'respondTime',
                editable: true,
                align:'center'
            },{
                title: '工程师到场时限（小时）',
                dataIndex: 'engineerArriveTime',
                editable: true,
                align:'center'
            },{
                title: '备件到场时限（小时）',
                dataIndex: 'spareArriveTime',
                editable: true,
                align:'center'
            },{
                title: '解决时限（小时）',
                dataIndex: 'solveTime',
                editable: true,
                align:'center'
            },{
                title: '备注',
                dataIndex: 'remarks',
                editable: true,
                align:'center'
            }
        ]

       
    }

    getDictItems = () => {
        // 项目是否约定驻场服务--数据
        customerLevel({ dictCode: 'onsiteService' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    siteServiceArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 服务方式，数据字典
        customerLevel({ dictCode: 'serviceMode' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    serviceModeArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
        
        // 远程巡检周期、现场巡检周期
        customerLevel({ dictCode: 'inspectionCycle' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    inspectionCycleArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 服务单要求
        customerLevel({ dictCode: 'serviceListRequire' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    serviceListRequireArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 服务报告提交周期
        customerLevel({ dictCode: 'serviceReportCycle' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    serviceReportCycleArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
        // 不收集配置信息原因说明
        customerLevel({ dictCode: 'notCollectReason' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    notCollectReasonArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 培训方式
        customerLevel({ dictCode: 'trainMode' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    trainModeArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 培训师资
        customerLevel({ dictCode: 'trainTeachers' }).then(res => {
            if (res.success == 1) {
                this.setState({
                    trainTeachersArray: res.data
                })
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })

        // 等级---SLA等级列表
        customerLevel({ dictCode: 'slaLevel' }).then(res => {
            if (res.success == 1) {
                let slaLevelArray = [];
                let datas = res.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    slaLevelArray.push({
                        // id: index + 1,
                        level: element.itemCode,
                        respondTime: '',
                        engineerArriveTime: '',
                        spareArriveTime: '',
                        solveTime: '',
                        remarks: '',
                    })
                }
                var obj = Object.assign({}, this.state.PerformanceData, { slaList: slaLevelArray });
                this.setState({
                    PerformanceData: obj
                },()=>{
                    // console.log(this.state.PerformanceData)
                    this.updataToParent()
                })
                
            } else if (res.success == 0) {
                message.error(res.message)
            }
        })
    }


    // table表格新增一行--事件按钮
    handleAdd = (ID,Index) => {
        const { count, PerformanceData } = this.state;
        const courseList = PerformanceData.courseList
        const newData = {
            key: count,
            id: count,
            trainMode: 'online',  // 默认字段是 1-线上 0-线下
            trainTeachers: '1',    // 培训师资
            courseDirection: "",   // 课程方向
            trainCourse: "", // 培训课程
            oursePersonTimes:"",  // 培训人次
        };
        courseList.splice(Index+1,0,newData);
        this.setState({
            courseList: courseList,
            count: count + 1,
        },()=>{
            this.updataToParent()
        });

    };
    //  table表格删除一行--事件按钮
    handleDelete=(ID,Index)=>{
        let courseList = [...this.state.PerformanceData.courseList];
        this.setState({
            PerformanceData:{
                courseList: courseList.filter(item => item.id != ID)
            }
        },()=>{
            this.updataToParent()
        });
    }


    // 行内统一保存--事件
    handleSave = (row) => {
        // 首先判断--当前修改的是【培训方式】区域还是【等级相应】区域的table数据
        if (row.hasOwnProperty('trainMode')) {
            // 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据
            const oldcourseList = this.state.PerformanceData.courseList;
            const newData = [...oldcourseList];
            const index = newData.findIndex((item) => row.id === item.id);
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row
            });
            var obj = Object.assign({}, this.state.PerformanceData, { courseList: newData});
        } else {
            // 【等级、响应时限（小时）、工程师到场时限（小时）、备件到场时限（小时）、解决时限（小时）、备注】----表格数据
            const data = this.state.PerformanceData.slaList;
            const footerTable = [...data];
            const indexTable = footerTable.findIndex((item) => row.level === item.level);
            const itemTable = footerTable[indexTable];
            footerTable.splice(indexTable, 1, {
                ...itemTable,
                ...row
            });
            var obj = Object.assign({}, this.state.PerformanceData, { slaList:footerTable});
        }


        this.setState({
            PerformanceData:obj
        },()=>{
            this.updataToParent()
        });
        
    };


    // 保存(培训方式--表格)---- 鼠标移入行事件
    TrainingTableRow=(record)=>{
        return {
			onMouseEnter: (event)=>{
                this.setState({
                    currentState:record.id
                })

            },
            onMouseLeave: event => {
                this.setState({
                            currentState:0
                        })
                
            }
		}
    }
//鼠标移动到表格添加区域显示添加删除一行操作按钮
addMouseEnter = (record) => {
    this.setState({
        currentState:record.id
    })
}
addMouseLeave = (record) => {
    this.setState({
        currentState:0
    })
}

  
    



    // 集成/备件销售项目（101、102）售后服务约定 ---【原厂服务】单选框的点击事件-----1-原厂服务，2-我司服务
    changeRadioOriginal=()=>{
        // 修改 afterSaleAgreement 集成/备件销售项目（101、102）售后服务约定的数据
        let data = Object.assign({}, this.state.PerformanceData, { afterSaleAgreement: '1',cycleEnd : '',cycleStart : '' });
        this.setState({
            PerformanceData: data
        },()=>{
            //this.updataToParent();
        })
    }
    // 集成/备件销售项目（101、102）售后服务约定 ----【我司服务】单选框的点击事件
    changeRadioStatus = () => {
        // 修改 afterSaleAgreement 集成/备件销售项目（101、102）售后服务约定的数据
        let data = Object.assign({}, this.state.PerformanceData, { afterSaleAgreement: '2' ,cycleEnd : '',cycleStart : ''});
        this.setState({
            PerformanceData: data
        },()=>{
            //this.updataToParent();
        })
       
    }

    // 【原厂服务】下的【部分项目周期】单选框事件按钮
    changeOriginaPartsRadio=()=>{

       // 修改 projectCycleType 项目周期类型，1-部分项目周期，2-全部项目周期
       let data = Object.assign({}, this.state.PerformanceData, { projectCycleType: '1',cycleEnd : '',cycleStart : '' });
        this.setState({
            PerformanceData: data
        },()=>{
            this.updataToParent();
        })


        if (data.afterSaleAgreement!='1' && data.projectCycleType!='1') {
            return false;
        } else {
            // 现将所有时间清空格式化
            let formatTime = {
                originalServiceParts_start: '',  // 原厂服务--部分项目周期---起始日期
                originalServiceParts_end: '', // 原厂服务--部分项目周期---结束日期
                originalServiceAll_start: '',     // 原厂服务--全部项目周期---起始日期
                originalServiceAll_end: '', // 原厂服务--全部项目周期---起始日期

                ourDriverParts_start: '',  // 我司服务--部分项目周期---起始日期
                ourDriverParts_end: '', // 我司服务--部分项目周期---结束日期
                ourDriverAll_start: '',     // 我司服务--全部项目周期---起始日期
                ourDriverAll_end: '', // 我司服务--全部项目周期---起始日期
            }
           
            this.setState({
                dateTime: formatTime
            })
        }


    }
    // 【原厂服务】下的【全部项目周期】单选框事件按钮
    changeOriginaAllRadio = () => {
        // 修改 projectCycleType 项目周期类型，1-部分项目周期，2-全部项目周期
        let data = Object.assign({}, this.state.PerformanceData, { projectCycleType: '2',cycleEnd : '',cycleStart : '' });
        this.setState({
            PerformanceData: data
        }, () => {
            this.updataToParent();
        })
        if (data.afterSaleAgreement != '1' && data.projectCycleType != '2') {
            return false;
        }else{
            // 现将所有时间清空格式化
            let formatTime = {
                originalServiceParts_start: '',  // 原厂服务--部分项目周期---起始日期
                originalServiceParts_end: '', // 原厂服务--部分项目周期---结束日期
                originalServiceAll_start: '',     // 原厂服务--全部项目周期---起始日期
                originalServiceAll_end: '', // 原厂服务--全部项目周期---起始日期

                ourDriverParts_start: '',  // 我司服务--部分项目周期---起始日期
                ourDriverParts_end: '', // 我司服务--部分项目周期---结束日期
                ourDriverAll_start: '',     // 我司服务--全部项目周期---起始日期
                ourDriverAll_end: '', // 我司服务--全部项目周期---起始日期
            }
            this.setState({
                dateTime: formatTime
            })
        }
    }
    // 【我司服务】下的【部分项目周期】单选框事件按钮 
    changeOurPartsRadio=()=>{
        // 修改 projectCycleType 项目周期类型，1-部分项目周期，2-全部项目周期
        let data = Object.assign({}, this.state.PerformanceData, { projectCycleType: '1',cycleEnd : '',cycleStart : '' });
        this.setState({
            PerformanceData: data
        },()=>{
            this.updataToParent();
        })
        if(data.afterSaleAgreement!='2' && data.projectCycleType!='1'){
            return false;
        }else {
             // 现将所有时间清空格式化
             let formatTime = {
                originalServiceParts_start:'',  // 原厂服务--部分项目周期---起始日期
                originalServiceParts_end:'', // 原厂服务--部分项目周期---结束日期
                originalServiceAll_start:'',     // 原厂服务--全部项目周期---起始日期
                originalServiceAll_end:'', // 原厂服务--全部项目周期---起始日期

                ourDriverParts_start:'',  // 我司服务--部分项目周期---起始日期
                ourDriverParts_end:'', // 我司服务--部分项目周期---结束日期
                ourDriverAll_start:'',     // 我司服务--全部项目周期---起始日期
                ourDriverAll_end:'', // 我司服务--全部项目周期---起始日期
            }
            this.setState({
                dateTime:formatTime,
            })
        }
    }
    // 【我司服务】下的【全部项目周期】单选框事件按钮
    changeOurAllRadio=()=>{
        // 修改 projectCycleType 项目周期类型，1-部分项目周期，2-全部项目周期
        let data = Object.assign({}, this.state.PerformanceData, { projectCycleType: '2',cycleEnd : '',cycleStart : '' });
        this.setState({
            PerformanceData: data
        }, () => {
            this.updataToParent();
        })
        if(data.afterSaleAgreement != '2' && data.projectCycleType != '2'){
            return false;
        }else {
            // 现将所有时间清空格式化
            let formatTime = {
                originalServiceParts_start:'',  // 原厂服务--部分项目周期---起始日期
                originalServiceParts_end:'', // 原厂服务--部分项目周期---结束日期
                originalServiceAll_start:'',     // 原厂服务--全部项目周期---起始日期
                originalServiceAll_end:'', // 原厂服务--全部项目周期---起始日期

                ourDriverParts_start:'',  // 我司服务--部分项目周期---起始日期
                ourDriverParts_end:'', // 我司服务--部分项目周期---结束日期
                ourDriverAll_start:'',     // 我司服务--全部项目周期---起始日期
                ourDriverAll_end:'', // 我司服务--全部项目周期---起始日期
            }
            this.setState({
                dateTime:formatTime,
            })
        }
    }

    // 附件上传-----上传外包合同设备清单附件
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
            message.error('上传文件大小不能超过30MB!');
        }
        return isLt2M;
    }
    // 附件上传-----上传外包合同设备清单附件
    outiueChange=(info)=>{
        let fileList = [...info.fileList];
        // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
        fileList = fileList.slice(-3);

        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} 文件上传成功`);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} 文件上传失败.`);
        // }

        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
            // console.log(file)
            if (file.response) {
                if (file.response.success == 1) {
                    // let number = Math.random().toString().slice(-6);
                    // file.uid = number;
                    file.fileName = file.response.data.fileName,
                    file.fileUrl= file.response.data.fileUrl;
                } else if (file.response.success == 0) {
                    file.status = 'error';
                }
            }
            return file;
        });
        console.log(fileList);
        let data = Object.assign({}, this.state.PerformanceData, { equipmentFileList:fileList});
        this.setState({PerformanceData:data, fileList },()=>{this.updataToParent()});
        //this.setState({PerformanceData:{...this.state.PerformanceData,equipmentFileList:fileList }});
    }


    // 附件上传---合同承诺备机备件清单
    ContractChange=(info)=>{
        // console.log(info)
        let fileList = [...info.fileList];
        // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
        fileList = fileList.slice(-3);
        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
            if (file.response) {
                if (file.response.success == 1) {
                    // let number = Math.random().toString().slice(-6);
                    // file.uid = number;
                    file.fileName = file.response.data.fileName,
                    file.fileUrl= file.response.data.fileUrl;
                } else if (file.response.success == 0) {
                    file.status = 'error';
                }
            }
            return file;
        });
        let data = Object.assign({}, this.state.PerformanceData, { sparePartsFileList:fileList});
        this.setState({ ContractFileList:fileList , PerformanceData:data},()=>{this.updataToParent()});
       // this.setState({PerformanceData:{...this.state.PerformanceData,sparePartsFileList:fileList}})
    }




    // 所有【输入框以及下拉框】的onchange事件
    inputChange=(el,value)=>{
        let {PerformanceData}= this.state;
        PerformanceData[el]=value
        //使用setsatte方法改变类中属性
        let data = Object.assign({}, PerformanceData);

        this.setState({
            PerformanceData:data
        },()=>{
            this.updataToParent();
        })
    }

    // 所有【日期时间】的onchange事件
    timeChange=(el, date, dateString)=>{
         //console.log('----------------      所有【日期时间】的onchange事件         ---------------------',this.state)
        // console.log( dateString);
        // 判断 是【合同承诺备机备件到库时间】还是 【集成/备件销售项目（101、102）售后服务约】 时间日期选择器
        if (el == 'sparePartsTime') {
            let {PerformanceData}= this.state;
            PerformanceData[el] = dateString
            //使用setsatte方法改变类中属性
            let data = Object.assign({}, PerformanceData);
    
            this.setState({
                PerformanceData:data
            },()=>{
                this.updataToParent();
            })
        }else {
            // 第二步 正式修改 PerformanceData对象下的cycleStart、cycleEnd数据并且传递到父组件
            if (el.indexOf('start') > 1) {
                let data = Object.assign({}, this.state.PerformanceData,{cycleStart:dateString});

                this.setState({
                    PerformanceData: data
                }, () => {
                    this.updataToParent();
                })
            }else {
                let data = Object.assign({}, this.state.PerformanceData,{cycleEnd:dateString});
                this.setState({
                    PerformanceData: data
                }, () => {
                    this.updataToParent();
                })
            }
        }
    }
    render = _ => {
        this.init();
        let {isEdit} = this.props;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        // 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据
        const columns = this.columns.map(col => {
            if(isEdit){
                return col;
            }
            if (!col.editable) {  //判断权限为不可编辑时不能对服务承诺区域进行操作
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    trainModeArray:this.state.trainModeArray ? this.state.trainModeArray  : [],
                    trainTeachersArray:this.state.trainTeachersArray ? this.state.trainTeachersArray  : [],
                    handleSave: this.handleSave,
                }),
            };
        });
        // 【等级、响应时限（小时）、工程师到场时限（小时）、备件到场时限（小时）、解决时限（小时）、备注】----表格数据
        const columnsLeavel = this.columnsLeavel.map(col => {
            if(isEdit){
                return col;
            }
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        console.log(this.state.PerformanceData.sparePartsFileList,this.state.PerformanceData.equipmentFileList)
        return (
            <div className="performanceContent">
                <div className="formContent">
                    <Descriptions bordered column={5} size={'small'}>
                        <Descriptions.Item label="服务方式">
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择服务方式" allowClear={true} showSearch value={this.state.PerformanceData.serviceMode} onChange={(value) => this.inputChange('serviceMode', value)}>
                                {
                                    this.state.serviceModeArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label={<div>是否提交验收报告<span>*</span></div>}>
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择是否提交验收报告" allowClear={true} showSearch value={this.state.PerformanceData.isReceiveReport} onChange={(value) => this.inputChange('isReceiveReport', value)}>
                                {
                                    this.state.siteServiceArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode}>{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="远程巡检周期" span={1}>
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择远程巡检周期" allowClear={true} showSearch value={this.state.PerformanceData.longInspectionCycle} onChange={(value)=>this.inputChange('longInspectionCycle',value)}>
                                {
                                    this.state.inspectionCycleArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="现场巡检周期" span={1}>
                        <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择远程巡检周期" allowClear={true} showSearch value={this.state.PerformanceData.sceneInspectionCycle} onChange={(value)=>this.inputChange('sceneInspectionCycle',value)}>
                                {
                                    this.state.inspectionCycleArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="巡检特殊说明" span={2}>
                            <Input disabled={isEdit ? true : false} value={this.state.PerformanceData.inspectionDesc} onChange={({ target: { value } })=>this.inputChange('inspectionDesc',value)} />
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                {/* 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据 */}
                <div className="tableContent">
                    <div className="iconOperation" >
                        {
                            this.state.PerformanceData.courseList.map((item, i) => {
                                return (
                                    <div className="lists" onMouseEnter={(e) => this.addMouseEnter({id:item.id})} onMouseLeave={(e) => this.addMouseLeave({id:item.id})} key={i} id={item.id} style={{visibility: !isEdit ? (item.id===this.state.currentState) ? "visible" : "hidden" : "hidden"  }}>
                                        <span onClick={()=>this.handleAdd(item.id,i)}>+</span>
                                        <span onClick={()=>this.handleDelete(item.id,i)} style={{visibility: (i==0) ? "hidden" : "",paddingLeft:'3px'}}>-</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="tableOperation">
                        <Table
                            bordered
                            rowKey={(record, index) => `Training${record.id}${index}`}
                            size={'small'}
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={this.state.PerformanceData.courseList}
                            columns={columns}
                            pagination={false}
                            onRow={this.TrainingTableRow}
                        />
                    </div>
                    
                </div>
                <div className="config">
                    <Descriptions bordered column={4} size={'small'}>
                        <Descriptions.Item label="是否需要提供首次巡检服务">
                            <Select disabled={(!this.props.node || this.props.node == 1) ? (this.props.serviceType == '201' || this.props.serviceType == '212') ? false : true :isEdit ? true : false} showSearch style={{ width: '100%' }} value={this.state.PerformanceData.isFirstInspection +''} onChange={(value)=>this.inputChange('isFirstInspection',value)}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="项目是否约定驻场服务">
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} showSearch value={this.state.PerformanceData.onsiteService} onChange={(value)=>this.inputChange('onsiteService',value)}>
                                <Option value="长期驻场">长期驻场</Option>
                                <Option value="临时驻场">临时驻场</Option>
                                <Option value="无驻场">无驻场</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="人数">
                            <InputNumber disabled={isEdit ? true : false} min={1} max={999999} value={this.state.PerformanceData.peopleNum}  onChange={(value )=>this.inputChange('peopleNum',value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="特殊说明"><Input disabled={isEdit ? true : false} value={this.state.PerformanceData.specialDesc} onChange={({ target: { value } })=>this.inputChange('specialDesc',value)} /></Descriptions.Item>
                        <Descriptions.Item label="是否收集相关配置信息" span={2}>
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} value={this.state.PerformanceData.isCollectConfig+''} showSearch onChange={(value)=>this.inputChange('isCollectConfig',value)}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="不收集配置信息原因说明" span={2} className="mustFill">
                            
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择不收集配置信息原因说明" allowClear={true} showSearch value={this.state.PerformanceData.notCollectReason} onChange={(value)=>this.inputChange('notCollectReason',value)}>
                                {
                                    this.state.notCollectReasonArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="服务报告提交周期" span={2}>
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择服务报告提交周期" allowClear={true} showSearch value={this.state.PerformanceData.serviceReportCycle} onChange={(value)=>this.inputChange('serviceReportCycle',value)}>
                                {
                                    this.state.serviceReportCycleArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="服务单要求" span={2}>
                            <Select disabled={isEdit ? true : false} style={{ width: '100%' }} placeholder="请选择服务单要求" allowClear={true} showSearch value={this.state.PerformanceData.serviceListRequire} onChange={(value) => this.inputChange('serviceListRequire', value)}>
                                {
                                    this.state.serviceListRequireArray.map((items, index) => {
                                        return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                                    })
                                }
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="合同承诺备机备件清单" span={3}>
                            <div className="upload">
                                <Upload disabled={isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.ContractChange} fileList={this.state.PerformanceData.sparePartsFileList}>
                                    <Icon type="upload" />上传
                                </Upload>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="合同承诺备机备件到库时间">
                            <DatePicker disabled={isEdit ? true : false} style={{width:'100%'}}  value={this.state.PerformanceData.sparePartsTime?moment(this.state.PerformanceData.sparePartsTime, dateFormat):null} onChange={(date, dateString)=>this.timeChange('sparePartsTime',date, dateString)} format={dateFormat}></DatePicker>
                        </Descriptions.Item>
                        <Descriptions.Item label="是否有外包情况">
                            <Select disabled={isEdit ? true : false} value={this.state.PerformanceData.isOutsource+''} style={{ width: '100%' }} showSearch onChange={(value)=>this.inputChange('isOutsource',value)}>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                                <Option value="2">部分</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="外包商"><Input disabled={isEdit ? true : false} value={this.state.PerformanceData.outsourcer} onChange={({ target: { value } })=>this.inputChange('outsourcer',value)} /></Descriptions.Item>
                        <Descriptions.Item label="上传外包合同设备清单附件"  span={2}>
                            <div className="upload">
                                <Upload disabled={isEdit ? true : false} {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.outiueChange} fileList={this.state.PerformanceData.equipmentFileList}>
                                    <Icon type="upload" />上传
                                </Upload>
                            </div>
                            
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                {/* 售后服务约定---区域 */}
                <div className="ServiceAgreement">
                    <div className="row">
                        <div className="column">
                            <div className="key">集成/备件销售项目<br />（101、102）售后服务约定</div>
                            <div className="bigVal4">
                                <div className="radioContent">
                                    <div className="title">
                                        <Radio disabled={isEdit ? true : false} checked={this.state.PerformanceData.afterSaleAgreement=='1'?true:false} onClick={this.changeRadioOriginal}>原厂服务</Radio>
                                    </div>
                                    <div className="timeRight">
                                        <div className="partsProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='1'?true:false :false} onClick={this.changeOriginaPartsRadio} disabled={isEdit ? true : (this.state.PerformanceData.afterSaleAgreement != '1' || !this.state.PerformanceData.afterSaleAgreement) ? true:false}>部分项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='1'? this.state.PerformanceData.cycleStart?moment(this.state.PerformanceData.cycleStart, dateFormat):null :null:null} disabled={isEdit ? true :this.state.PerformanceData.afterSaleAgreement !='1'?true:this.state.PerformanceData.projectCycleType !='1'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceParts_start',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='1'?this.state.PerformanceData.cycleEnd? moment(this.state.PerformanceData.cycleEnd, dateFormat):null:null:null} disabled={isEdit ? true :this.state.PerformanceData.afterSaleAgreement!='1'?true:this.state.PerformanceData.projectCycleType !='1'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceParts_end',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                        <div className="allProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='2'?true:false : false} onClick={this.changeOriginaAllRadio} disabled={isEdit ? true :(this.state.PerformanceData.afterSaleAgreement != '1' || !this.state.PerformanceData.afterSaleAgreement)?true:false}>全部项目周期</Radio> 
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='2'?this.state.PerformanceData.cycleStart?moment(this.state.PerformanceData.cycleStart, dateFormat):null:null:null} disabled={isEdit ? true :this.state.PerformanceData.afterSaleAgreement !='1'?true:this.state.PerformanceData.projectCycleType !='2'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceAll_start',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='1' ? this.state.PerformanceData.projectCycleType=='2'?this.state.PerformanceData.cycleEnd?moment(this.state.PerformanceData.cycleEnd, dateFormat):null:null:null} disabled={isEdit ? true :this.state.PerformanceData.afterSaleAgreement !='1'?true:this.state.PerformanceData.projectCycleType !='2'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceAll_end',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="radioContent">
                                    <div className="title">
                                        <Radio disabled={isEdit ? true : false} checked={this.state.PerformanceData.afterSaleAgreement=='2'?true:false} onClick={this.changeRadioStatus}>我司服务</Radio>
                                    </div>
                                    <div className="timeRight">
                                    <div className="partsProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.PerformanceData.afterSaleAgreement=='2'? this.state.PerformanceData.projectCycleType=='1'?true:false :false} disabled={isEdit ? true : (this.state.PerformanceData.afterSaleAgreement != '2' || !this.state.PerformanceData.afterSaleAgreement) ? true:false} onClick={this.changeOurPartsRadio}>部分项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <DatePicker style={{ width: '100%' }} value={this.state.PerformanceData.afterSaleAgreement == '2' ? this.state.PerformanceData.projectCycleType == '1' ? this.state.PerformanceData.cycleStart ? moment(this.state.PerformanceData.cycleStart, dateFormat) : null : null : null} disabled={isEdit ? true : this.state.PerformanceData.afterSaleAgreement != '2' ? true : this.state.PerformanceData.projectCycleType != '1' ? true : false}
                                                            onChange={(date, dateString) => this.timeChange('originalServiceParts_start', date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <DatePicker style={{ width: '100%' }} value={this.state.PerformanceData.afterSaleAgreement == '2' ? this.state.PerformanceData.projectCycleType == '1' ? this.state.PerformanceData.cycleEnd ? moment(this.state.PerformanceData.cycleEnd, dateFormat) : null : null : null} disabled={isEdit ? true : this.state.PerformanceData.afterSaleAgreement != '2' ? true : this.state.PerformanceData.projectCycleType != '1' ? true : false}
                                                            onChange={(date, dateString) => this.timeChange('originalServiceParts_end', date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                        <div className="allProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.PerformanceData.afterSaleAgreement=='2'? this.state.PerformanceData.projectCycleType=='2'?true:false : false} disabled={isEdit ? true : (this.state.PerformanceData.afterSaleAgreement != '2' || !this.state.PerformanceData.afterSaleAgreement) ? true:false} onClick={this.changeOurAllRadio}>全部项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='2' ? this.state.PerformanceData.projectCycleType=='2'?this.state.PerformanceData.cycleStart?moment(this.state.PerformanceData.cycleStart, dateFormat):null:null:null} disabled={isEdit ? true : this.state.PerformanceData.afterSaleAgreement!='2'? true:this.state.PerformanceData.projectCycleType!='2'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverAll_start',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} value={this.state.PerformanceData.afterSaleAgreement=='2' ? this.state.PerformanceData.projectCycleType=='2'?this.state.PerformanceData.cycleEnd?moment(this.state.PerformanceData.cycleEnd, dateFormat):null:null:null} disabled={isEdit ? true : this.state.PerformanceData.afterSaleAgreement!='2'? true:this.state.PerformanceData.projectCycleType!='2'?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverAll_end',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 其他重要承诺及要求---区域 */}
                <div className="desc">
                    <div className="row">
                        <div className="column">
                            <div className="descKey">其他重要承诺及要求</div>
                            <div className="descValue">
                                <TextArea disabled={isEdit ? true : false} value={this.state.PerformanceData.otherPromise} onChange={({ target: { value } })=>this.inputChange('otherPromise',value)}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 【等级、响应时限（小时）、工程师到场时限（小时）、备件到场时限（小时）、解决时限（小时）、备注】----表格数据 */}
                <div className="configTable">
                    <Table
                        bordered
                        rowKey={(record, index) => `complete${record.id}${index}`}
                        size={'small'}
                        components={components}
                        rowClassName={() => 'editable-row1'}
                        dataSource={this.state.PerformanceData.slaList}
                        columns={columnsLeavel}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }
}









const PerformanceForm = Form.create()(performance)
export default PerformanceForm