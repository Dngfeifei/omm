/**
 * 服务需求表----服务承诺
 * @author  jxl
 */


import React, { Component , memo, useCallback, useState} from 'react'
import { Descriptions, Table, Form, Input, Select, DatePicker, Popconfirm, Button , Radio , Icon , InputNumber , Upload , message} from 'antd'

const { TextArea } = Input  //多行文本域
const { Option } = Select        // 下拉选择器
const { MonthPicker, RangePicker, WeekPicker } = DatePicker    // 时间日期插件
const { Item } = Form

const { Provider, Consumer } = React.createContext()//组件之间传值


let token = localStorage.getItem('token')
const dateFormat = 'YYYY/MM/DD'


// 引入日期格式化
import moment from 'moment'

// 引入页面CSS
import '/assets/less/pages/performancePledge.less'
import '@/assets/less/pages/logBookTable.css'


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
            dataIndex == 'way' ?
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
                        <Select style={{ width: 120 }} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}>
                            <Option value="0">线下</Option>
                            <Option value="1">线上</Option>
                        </Select>
                    )}
                </Form.Item> : dataIndex == 'teachers' ? <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `${title} 不能为空！`,
                            },
                        ],
                        initialValue: record[dataIndex].toString(),
                    })(
                        <Select style={{ width: 120 }} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} showSearch>
                            <Option value="原厂">原厂</Option>
                            <Option value="合作方">合作方</Option>
                            <Option value="我司提供培训">我司提供培训</Option>
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

        this.state = {
            editing: false,
            count: 0,
            // 单选框的属性，用于判断【我司服务】的展示状态
            radioStatus: true,
            // 【我司服务】单选框的属性，用于判断【部分项目周期】的展示状态
            OurPartsRadio: true,
            // 【我司服务】单选框的属性，用于判断【全部项目周期】的展示状态
            OurAllRadio: false,
            // 单选框的属性，用于判断【原厂服务】的展示状态
            radioStatusOriginal: false,
            // 【原厂服务】单选框的属性，用于判断【部分项目周期】的展示状态
            OriginaPartsRadio: true,
            // 【原厂服务】单选框的属性，用于判断【全部项目周期】的展示状态
            OriginaAllRadio:false,
            //上传外包合同设备清单附件--上传配置
            uploadConf: {
                // 发到后台的文件参数名
                name: 'file', 
                // 接受的文件类型
                accept: '.xls,.xlsx,.doc,.txt,.PPT,.DOCS,.XLSX,.PPTX',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                multiple: true,
                showUploadList: true,
            },
            //上传外包合同设备清单附件---已上传附件信息数据
            fileList:[],

            // 合同承诺备机备件清单---已上传附件信息数据
            ContractFileList:[],

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

            
        }
    }

    componentWillMount(){
        this.setState({
            PerformanceData: this.props.data,
            count: this.props.data.trainingTableData.length + 1,
        })
    }

    // 向父组件传递数据
    updataToParent=()=>{
        console.log('------------------      [服务承诺]] 向父组件传递数据     -------------------')
        this.props.onChange(this.state.PerformanceData)
    }



    // 初始化接口
    init = () => {
        this.columns = [
            {
                title: '培训方式',
                dataIndex: 'way',
                render: t => t == '1' ? '线上' : '线下',
                editable: true,
                align:'center'
            },
            {
                title: '培训师资',
                dataIndex: 'teachers',
                render: t => t == '原厂' ? '原厂' : t == '合作方' ? '合作方' : '我司提供培训',
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
                dataIndex: 'courses',
                editable: true,
                align:'center'
            }, {
                title: '培训人次',
                dataIndex: 'TrainingSessions',
                editable: true,
                align:'center'
            },
        ];

        // 底部table等级表格
        this.columnsLeavel = [
            {
                title: '等级',
                dataIndex: 'leavel',
                align:'center'
            },{
                title: '响应时限（小时）',
                dataIndex: 'response',
                editable: true,
                align:'center'
            },{
                title: '工程师到场时限（小时）',
                dataIndex: 'engineerParts',
                editable: true,
                align:'center'
            },{
                title: '备件到场时限（小时）',
                dataIndex: 'spareParts',
                editable: true,
                align:'center'
            },{
                title: '解决时限（小时）',
                dataIndex: 'resolutionTime',
                editable: true,
                align:'center'
            },{
                title: '备注',
                dataIndex: 'notes',
                editable: true,
                align:'center'
            }
        ]
    }


    // table表格新增一行--事件按钮
    handleAdd = (ID,Index) => {
        const { count, PerformanceData } = this.state;
        const trainingTableData = PerformanceData.trainingTableData
        const newData = {
            key: count,
            id: count,
            way: '0',  // 默认字段是 1-线上 0-线下
            teachers: '合作方',
            courseDirection: "",
            courses: "",
            TrainingSessions:"",
        };
        trainingTableData.splice(Index+1,0,newData);
        this.setState({
            trainingTableData: trainingTableData,
            count: count + 1,
        },()=>{
            this.updataToParent()
        });

    };
    //  table表格删除一行--事件按钮
    handleDelete=(ID,Index)=>{
        let training = this.state.PerformanceData.trainingTableData;
        const trainingTableData = [...training];
        this.setState({ 
            trainingTableData: trainingTableData.filter(item => item.id !== ID) 
        },()=>{
            this.updataToParent()
        });
    }


    // 行内统一保存--事件
    handleSave = (row) => {
        // 首先判断--当前修改的是【培训方式】区域还是【等级相应】区域的table数据
        if (row.hasOwnProperty('way')) {
            // 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据
            const oldTrainingTableData = this.state.PerformanceData.trainingTableData;
            const newData = [...oldTrainingTableData];
            const index = newData.findIndex((item) => row.id === item.id);
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row
            });
            var obj = Object.assign({}, this.state.PerformanceData, { trainingTableData: newData});
        } else {
            // 【等级、响应时限（小时）、工程师到场时限（小时）、备件到场时限（小时）、解决时限（小时）、备注】----表格数据
            const data = this.state.PerformanceData.configTable;
            const footerTable = [...data];
            const indexTable = footerTable.findIndex((item) => row.id === item.id);
            const itemTable = footerTable[indexTable];
            footerTable.splice(indexTable, 1, {
                ...itemTable,
                ...row
            });
            var obj = Object.assign({}, this.state.PerformanceData, { configTable:footerTable});
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
                // 将移出事件延迟一秒，避免侧边操作区域点击不到
                setTimeout(()=>{
                    this.setState({
                        currentState:0
                    })
                },1000)
                
            }
		}
    }







    // 【原厂服务】单选框的点击事件
    changeRadioOriginal=()=>{
        if(this.state.radioStatus){
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
                radioStatus:!this.state.radioStatus,
                radioStatusOriginal:false,
                dateTime:formatTime
            })
        }
    }
    // 【我司服务】单选框的点击事件
    changeRadioStatus=()=>{
        if(!this.state.radioStatusOriginal){
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
                radioStatusOriginal:!this.state.radioStatusOriginal,
                radioStatus:false,
                dateTime:formatTime
            })
        }
       
    }
    // 【原厂服务】下的【部分项目周期】单选框事件按钮
    changeOriginaPartsRadio=()=>{
        if(this.state.OriginaPartsRadio){
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
                OriginaPartsRadio:!this.state.OriginaPartsRadio,
                OriginaAllRadio:false,
                dateTime:formatTime
            })
        }
    }
    // 【原厂服务】下的【全部项目周期】单选框事件按钮
    changeOriginaAllRadio=()=>{
        if(!this.state.OriginaAllRadio){
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
                OriginaAllRadio:!this.state.OriginaAllRadio,
                OriginaPartsRadio:false,
                dateTime:formatTime
            })
        }
    }
    // 【我司服务】下的【部分项目周期】单选框事件按钮 
    changeOurPartsRadio=()=>{
        if(this.state.OurPartsRadio){
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
                OurPartsRadio:!this.state.OurPartsRadio,
                OurAllRadio:false,
                dateTime:formatTime
            })
        }
    }
    // 【我司服务】下的【全部项目周期】单选框事件按钮
    changeOurAllRadio=()=>{
        if(!this.state.OurAllRadio){
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
                OurAllRadio:!this.state.OurAllRadio,
                OurPartsRadio:false,
                dateTime:formatTime
            })
        }
    }

    // 附件上传-----上传外包合同设备清单附件
    beforeUpload = (file) => {
        console.log('*****************附件上传*****************')
        console.log(file)
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
            message.error('上传文件大小不能超过30MB!');
        }
        return isLt2M;
    }
    // 附件上传-----上传外包合同设备清单附件
    outiueChange=(info)=>{
        console.log(info)
        let fileList = [...info.fileList];
        // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
        fileList = fileList.slice(-3);

        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }

        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
            if (file.response) {
                if (file.response.success == 1) {
                    file.uid = file.response.data.attachId;
                    file.url = file.response.data.url;
                } else if (file.response.success == 0) {
                    file.status = 'error';
                }
            }
            return file;
        });
        this.setState({ ContractFileList:fileList });
    }


    // 附件上传---合同承诺备机备件清单
    ContractChange=(info)=>{
        console.log(info)
        let fileList = [...info.fileList];
        // 1. 限制上载文件的数量---只显示最近上传的3个文件，旧文件将被新文件替换
        fileList = fileList.slice(-3);

        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }

        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
            if (file.response) {
                if (file.response.success == 1) {
                    file.uid = file.response.data.attachId;
                    file.url = file.response.data.url;
                } else if (file.response.success == 0) {
                    file.status = 'error';
                }
            }
            return file;
        });
        this.setState({ fileList });
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
        console.log('----------------      所有【日期时间】的onchange事件         ---------------------')
        console.log( dateString);


        // 判断 是【合同承诺备机备件到库时间】还是 【集成/备件销售项目（101、102）售后服务约】 时间日期选择器
        if (el == 'partsArrivalTime') {
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
            /***
             *  说明: 因为此处是将每个时间日期选择器赋予不同的属性，避免填写混乱。而真正向父组件传递的是  PerformanceData对象下的serverstartTime:'',
             *        serverendTime:'',
            ***/
            // 第一步：先将本页面定义中对应属性进行实时变化
            let {dateTime}= this.state;
            dateTime[el]=dateString;
            //使用setsatte方法改变类中属性
            let data = Object.assign({}, dateTime);

            this.setState({
                dateTime:data
            })


            // 第二步 正式修改 PerformanceData对象下的serverstartTime、serverendTime数据并且传递到父组件
            if (el.indexOf('start') > 1) {
                let data = Object.assign({}, this.state.PerformanceData,{serverstartTime:dateString});

                this.setState({
                    PerformanceData: data
                }, () => {
                    this.updataToParent();
                })
            }else {
                let data = Object.assign({}, this.state.PerformanceData,{serverendTime:dateString});
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

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        // 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据
        const columns = this.columns.map(col => {
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
        // 【等级、响应时限（小时）、工程师到场时限（小时）、备件到场时限（小时）、解决时限（小时）、备注】----表格数据
        const columnsLeavel = this.columnsLeavel.map(col => {
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


        return (
            <div className="performanceContent">
                <div className="formContent">
                    <Descriptions bordered column={5} size={'small'}>
                        <Descriptions.Item label="服务方式">
                            <Input value={this.state.PerformanceData.serviceMode} onChange={({ target: { value } })=>this.inputChange('serviceMode',value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="是否提交验收报告">
                            <Input value={this.state.PerformanceData.isReport} onChange={({ target: { value } })=>this.inputChange('isReport',value)} /></Descriptions.Item>
                        <Descriptions.Item label="远程巡检周期">
                            <Input value={this.state.PerformanceData.remoteCycle} onChange={({ target: { value } })=>this.inputChange('remoteCycle',value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="现场巡检周期">
                            <Input value={this.state.PerformanceData.OnSiteCycle} onChange={({ target: { value } })=>this.inputChange('OnSiteCycle',value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="巡检特殊说明" span={2}>
                            <Input value={this.state.PerformanceData.patrolSpecialDesc} onChange={({ target: { value } })=>this.inputChange('patrolSpecialDesc',value)} />
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                {/* 【培训方式、培训师资、课程方向、培训课程、培训人次】----表格数据 */}
                <div className="tableContent">
                    <div className="iconOperation" >
                        {
                            this.state.PerformanceData.trainingTableData.map((item, i) => {
                                return (
                                    <div className="lists" key={i} id={item.id} style={{visibility: (item.id===this.state.currentState) ? "visible" : "hidden"}}>
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
                            rowKey={"id"}
                            size={'small'}
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={this.state.PerformanceData.trainingTableData}
                            columns={columns}
                            pagination={false}
                            onRow={this.TrainingTableRow}
                        />
                    </div>
                    
                </div>
                <div className="config">
                    <Descriptions bordered column={4} size={'small'}>
                        <Descriptions.Item label="是否需要提供首次巡检服务">
                            <Select showSearch style={{ width: '100%' }} value={this.state.PerformanceData.firstInspection} onChange={(value)=>this.inputChange('firstInspection',value)}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="项目是否约定驻场服务">
                            <Select style={{ width: '100%' }} showSearch value={this.state.PerformanceData.isOnSiteService} onChange={(value)=>this.inputChange('isOnSiteService',value)}>
                                <Option value="长期驻场">长期驻场</Option>
                                <Option value="临时驻场">临时驻场</Option>
                                <Option value="临时驻场">无驻场</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="人数">
                            <InputNumber min={1} max={999999} value={this.state.PerformanceData.persons}  onChange={({ target: { value } })=>this.inputChange('persons',value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="特殊说明"><Input value={this.state.PerformanceData.specialDesc} onChange={({ target: { value } })=>this.inputChange('specialDesc',value)} /></Descriptions.Item>
                        <Descriptions.Item label="是否收集相关配置信息" span={2}>
                            <Select style={{ width: '100%' }} value={this.state.PerformanceData.siCorrelationConfig} showSearch onChange={(value)=>this.inputChange('siCorrelationConfig',value)}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="不收集配置信息原因说明" span={2}>
                        <Select style={{ width: '100%' }} showSearch value={this.state.PerformanceData.configDesc} onChange={(value)=>this.inputChange('configDesc',value)}>
                                <Option value="无设备">无设备</Option>
                                <Option value="纯人力驻场">纯人力驻场</Option>
                                <Option value="非维保项目（101、102、202、203、205、206）">非维保项目（101、102、202、203、205、206）</Option>
                                <Option value="维保拆分驻场项目">维保拆分驻场项目</Option>
                                <Option value="其他">其他</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="服务报告提交周期" span={2}>
                            <Select style={{ width: '100%' }} showSearch value={this.state.PerformanceData.reportingCycle} onChange={(value)=>this.inputChange('reportingCycle',value)}>
                                <Option value="周">周</Option>
                                <Option value="月">月</Option>
                                <Option value="季度">季度</Option>
                                <Option value="半年">半年</Option>
                                <Option value="全年">全年</Option>
                                <Option value="服务期结束报告">服务期结束报告</Option>
                                <Option value="其他">其他</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="服务单要求" span={2}>
                            <Select style={{ width: '100%' }} showSearch value={this.state.PerformanceData.orderRequire} onChange={(value)=>this.inputChange('orderRequire',value)}>
                                <Option value="公司模版">公司模版</Option>
                                <Option value="客户方模版-需上传附件">客户方模版-需上传附件</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="合同承诺备机备件清单" span={3}>
                            <div className="upload">
                                <Upload {...this.state.uploadConf} action="" beforeUpload={this.beforeUpload} onChange={this.ContractChange} fileList={this.state.ContractFileList}>
                                    <Icon type="upload" />上传
                                </Upload>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="合同承诺备机备件到库时间">
                            <DatePicker style={{width:'100%'}} onChange={(date, dateString)=>this.timeChange('partsArrivalTime',date, dateString)}></DatePicker>
                        </Descriptions.Item>
                        <Descriptions.Item label="是否有外包情况">
                            <Select value={this.state.PerformanceData.isOutsourcing} style={{ width: '100%' }} showSearch onChange={(value)=>this.inputChange('isOutsourcing',value)}>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                                <Option value="2">部分</Option>
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="外包商"><Input value={this.state.PerformanceData.outsourcer} onChange={({ target: { value } })=>this.inputChange('outsourcer',value)} /></Descriptions.Item>
                        <Descriptions.Item label="上传外包合同设备清单附件"  span={2}>
                            <div className="upload">
                                <Upload {...this.state.uploadConf} action="" beforeUpload={this.beforeUpload} onChange={this.outiueChange} fileList={this.state.fileList}>
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
                                        <Radio checked={this.state.radioStatus} onClick={this.changeRadioOriginal}>原厂服务</Radio>
                                    </div>
                                    <div className="timeRight">
                                        <div className="partsProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.OriginaPartsRadio} disabled={!this.state.radioStatus} onClick={this.changeOriginaPartsRadio}>部分项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatus==false?true:this.state.OriginaPartsRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceParts_start',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatus==false?true:this.state.OriginaPartsRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceParts_end',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                        <div className="allProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.OriginaAllRadio} disabled={!this.state.radioStatus} onClick={this.changeOriginaAllRadio}>全部项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatus==false?true:this.state.OriginaAllRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceAll_start',date, dateString)}
                                                        />
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatus==false?true:this.state.OriginaAllRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('originalServiceAll_end',date, dateString)}
                                                        />
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="radioContent">
                                    <div className="title">
                                        <Radio checked={this.state.radioStatusOriginal} onClick={this.changeRadioStatus}>我司服务</Radio>
                                    </div>
                                    <div className="timeRight">
                                    <div className="partsProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.OurPartsRadio} disabled={!this.state.radioStatusOriginal} onClick={this.changeOurPartsRadio}>部分项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatusOriginal==false?true:this.state.OurPartsRadio==false?true:false} 
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverParts_start',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatusOriginal==false?true:this.state.OurPartsRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverParts_end',date, dateString)}
                                                        />
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                        <div className="allProject">
                                            <div className="title projectTitle">
                                                <Radio checked={this.state.OurAllRadio} disabled={!this.state.radioStatusOriginal} onClick={this.changeOurAllRadio}>全部项目周期</Radio>
                                            </div>
                                            <div className="projectTime">
                                                <Descriptions bordered column={1} size={'small'}>
                                                    <Descriptions.Item label="起始日期">
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatusOriginal==false?true:this.state.OurAllRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverAll_start',date, dateString)}
                                                        />
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="结束日期">
                                                        <div></div>
                                                        <DatePicker style={{width:'100%'}} disabled={this.state.radioStatusOriginal==false?true:this.state.OurAllRadio==false?true:false}
                                                            onChange={(date, dateString)=>this.timeChange('ourDriverAll_end',date, dateString)}
                                                        />
                                                        {/* <Icon type="calendar" theme="twoTone" style={{ position: 'absolute',right: '10px', top: '12px',cursor: 'pointer'}} /> */}
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
                                <TextArea value={this.state.PerformanceData.otherImportant} />
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
                        dataSource={this.state.PerformanceData.configTable}
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