/***
 *  资料库--介质库管理--个人文件上传
 * @auth yyp
*/


import React, { Component } from 'react'
import { Modal, Form, Input, Button, Radio, Upload, message, Spin, Progress, Checkbox } from 'antd'
const { TextArea } = Input;
const { confirm } = Modal;
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

import SparkMD5 from 'spark-md5'

// 引入 API接口
import { GetBaseData } from '/api/selfEvaluation'
import { GetSignResult, PostFilePublish, GetFilePonints } from '/api/mediaLibrary.js'
import { UploadCOSFile, DelCOSFile, CancelCOSFile, RestartCOSFile, GetFileList, PauseCOSFile } from '/api/cloudUpload.js'

import { GetDictInfo } from '/api/dictionary'  //数据字典api


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
// 网络连接状态
let netStatue = true;
window.addEventListener('online', (event) => {
    netStatue = true;
});
window.ononline = (event) => {
    netStatue = true;
};

window.addEventListener('offline', (event) => {
    netStatue = false;
});

window.onoffline = (event) => {
    netStatue = false;
};
// 去重方法
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var arrry = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].name]) {
            arrry.push(arr[i])
            obj[arr[i].name] = 1
        } else {
            obj[arr[i].name]++
        }
    }
    return arrry;
}
class fileUpload extends Component {
    componentDidMount() {

    }
    componentWillMount() {
        this.getDictInfo()
        this.getBaseData()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.data.type) {
            if (newProps.data.type.hasOwnProperty("id")) {
                let params = Object.assign({}, this.state.params, { categoriesId: newProps.data.type.id })
                this.setState({
                    params
                })
            }
        }
    }

    state = {
        netTimer: "",
        tokenTimer: "",
        file: null,  //上传文件数据 
        uploadStatus: 0,//0 未开始 1 查重中 2上传中 3上传成功  4上传失败 5网络异常
        percent: 0,//上传进度
        speed: "",//上传速率
        taskId: "",//文件上传任务ID（腾讯云返回）
        historyFileName: "",//已上传文件名称
        params: {
            fileUrl: "",
            size: "",
            fileVersion: "",
            fileLabel: "",
            fileSignature: "",
            categoriesId: "",
            description: "",
        },
        fileLabelData: [],
        uploadConf: {//上传配置
            name: 'file',
            // action: uploadUrl,
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // },
            showUploadList: false,
        },
        productLine: [],//所有产品线数据
        brand: [],//所有品牌数据
        brandId: "",//当前复选框选中品牌id,
        brandName: "",//当前复选框选中品牌名称,
        brandIndex: "",//当前复选框选中品牌索引,
        brandResult: [],//已选中的品牌结果数组
        productLineResult: [],//已选中的产品线结果二维数组
        brandItemStatus: true,//品牌结果校验状态 默认为true
        productLineItemStatus: true,//产品结果校验状态 默认为true
    }
    // 获取数据字典-产品类别数据
    getDictInfo = async () => {
        GetDictInfo({ dictCode: "fileLabel" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                this.setState({
                    fileLabelData: res.data
                })
            }
        })
    }
    // 请求下拉框基础数据方法
    getBaseData = () => {
        // 请求下拉框基础数据
        GetBaseData().then((res) => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                let { productLine, brand } = res.data
              
                let newBrand = brand.filter(item => {
                    return item.parentId == this.props.data.parentDirCode[1]
                })
                this.setState({ productLine, brand: newBrand })
            }
        })
    }
    // 文件上传前
    beforeUpload = (file) => {

        let params = Object.assign({}, this.state.params, { fileUrl: "", size: file.size })
        this.setState({
            file,
            percent: 0,
            params,
        }, _ => {
            // message.destroy()
            // if (file.size > 1024 * 1024 * 1024) {
            //     message.info("文件查重校验中，请稍等...")
            // }
            this.setState({ uploadStatus: 1 })
            this.get_filemd5sum(file)
        })
        return false
    }
    // 文件加签提交接口
    getSignResult = async (data) => {
        GetSignResult({ fileSignature: data, fileName: this.state.file.name })
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    this.setState({ uploadStatus: 0, file: null })
                } else {
                    if (res.status != 200) {
                        message.error(res.message)
                        this.setState({ uploadStatus: 0, file: null })
                    } else {

                        if (this.state.taskId) {
                            // 删除已上传无用文件
                            DelCOSFile(this.state.historyFileName)
                        }
                        this.setState({ uploadStatus: 2 }, _ => {
                            if (this.state.file.size > 1024 * 1024 * 1024) {
                                this.getNewToken()
                            }
                            UploadCOSFile(this.state.file, this.getTaskID, this.getProgress, this.uploadOk)
                        })
                    }
                }
            })
    }
    // 文件编译加签方法
    get_filemd5sum = async (ofile) => {
        let that = this;
        var file = ofile;
        var tmp_md5;
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 8097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = await function (e) {
            spark.append(e.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                tmp_md5 = spark.end();
                let params = Object.assign({}, that.state.params, { fileSignature: tmp_md5 })
                that.setState({ params })
                that.getSignResult(tmp_md5)
            }
        };

        fileReader.onerror = function () {
            // console.warn('oops, something went wrong.');
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    }
    // 获取文件上传任务ID 用于任务终止或取消
    getTaskID = (taskId) => {
        this.setState({ taskId })
    }
    // 文件上传进度设置
    getProgress = (progressData) => {
        this.setState({
            percent: Number((progressData.percent * 100).toFixed(0)),
            speed: Number((progressData.speed / 1024).toFixed(0)),
        })
    }
    // 文件上传完成
    uploadOk = (err, data) => {
        clearInterval(this.state.tokenTimer)
        //请求 token 结束
        if (err) {
            message.destroy()
            message.error(err.message)
            if (err.message == "CORS blocked or network error") {
                // this.setState({ uploadStatus: 5, taskId: err.UploadId, speed: 0 }, _ => {
                //     // 暂停上传
                //     // this.pauseUpload()
                //     // 网络异常中断  得网络正常时自动重启上传
                //     this.onAutoRestart()
                // })
                this.setState({ uploadStatus: 5, speed: 0 }, _ => {
                    // 暂停上传
                    // this.pauseUpload()
                    // 网络异常中断  得网络正常时自动重启上传
                    this.onAutoRestart()
                })
            } else {
                this.setState({ uploadStatus: 4, speed: 0 })
            }
        } else {
            let params = Object.assign({}, this.state.params, { fileUrl: data.Location })
            this.setState({
                params,
                uploadStatus: 3,
                speed: 0,
                historyFileName: this.state.file.name
            })
        }
    }
    // 上传文件发布
    publishFile = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            e.preventDefault();
            if (err) {
                return
            }
            let { brandResult, productLineResult, brandItemStatus, productLineItemStatus } = this.state
            if (!brandResult.length) {
                brandItemStatus = false
                this.setState({ brandItemStatus })
                return
            }
            productLineResult[0] ? "" : productLineResult[0] = []
            let productLine = productLineResult.reduce((acc, curr) => {  curr = curr && curr.length ? curr : []; return acc.concat(curr) })
            if (brandResult.length == 1 && brandResult[0] == "通用" && !productLine.length) {

            } else {
                if (!productLine.length) {
                    productLineItemStatus = false
                    this.setState({ productLineItemStatus })
                    return
                }
            }

            if (!err) {
                let param = this.props.form.getFieldsValue()
                let data = Object.assign({}, this.state.params, param, { fileName: this.state.file.name, brand: brandResult, productLine })
                PostFilePublish(data)
                    .then(res => {
                        if (res.success != 1) {
                            message.error(res.message)
                            return
                        } else {
                            this.props.onOk()
                        }
                    })
            }
        });
    }

    // 取消上传
    stopUpload = () => {
        this.state.taskId ? CancelCOSFile(this.state.taskId) : ""
    }
    // 暂停上传
    pauseUpload = () => {
        this.state.taskId ? PauseCOSFile(this.state.taskId) : ""
    }
    // 重新上传
    restartUpload = () => {
        this.state.taskId ? RestartCOSFile(this.state.taskId) : ""
    }
    // 关闭窗口
    onCloseModal = () => {
        // 若在上传 终止上传
        // 若有已上传  删除已上传
        let _this = this
        if (this.state.uploadStatus == 2) {
            confirm({
                title: '关闭',
                content: '文件上传中,确定要取消上传关闭窗口吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    _this.stopUpload()
                    _this.props.onCancel()
                },
            });
        } else if (this.state.uploadStatus == 3) {
            // 删除提示+删除操作   
            confirm({
                title: '关闭',
                content: '文件上传还未发布,确定要关闭窗口吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    DelCOSFile(_this.state.historyFileName)
                    _this.props.onCancel()
                },
            });
        } else {
            this.props.onCancel()
        }
        clearInterval(this.state.tokenTimer)
        clearInterval(this.state.netTimer)
    }
    // 自动重启上传
    onAutoRestart = () => {
        //循环获取当前网络状态 当网络正常时启动续传
        let netTimer = this.state.netTimer
        // console.log("自动重启轮询开始")
        // this.getNetWork()
        netTimer = setInterval(() => {
            // 执行监控当前网络的方法
            // console.log(netStatue, "轮询中网络状态")
            // netStatue 当前网络状态码  true 正常  false 异常
            if (netStatue) {
                // console.log("自动重启轮询结束")
                clearInterval(this.state.netTimer)
                this.restartUpload()
                this.setState({ uploadStatus: 2 })
            }
        }, 1000 * 2);
        this.setState({ netTimer })
    }

    // 提交简单请求 预防文件上传时间过长 后台token失效
    getNewToken = () => {
        let status = this.state.uploadStatus
        let tokenTimer = this.state.tokenTimer
        if (status != 2) {
            clearInterval(tokenTimer)
            return
        }
        //轮询请求开始
        tokenTimer = setInterval(() => {
            //请求最新token
            GetFilePonints()
        }, 1000 * 60 * 5);
        this.setState({ tokenTimer })
    }
    // brandHover
    // brandOver = (id) => {
    //     this.setState({
    //         brandHoverId: id
    //     })
    // }
    // brandOut = (id) => {
    //     let { brandHoverId } = this.state
    //     if (brandHoverId == id) {
    //         this.setState({
    //             brandHoverId: ""
    //         })
    //     }
    // }

    //品牌复选框选中
    onChangeBrand = (id, name, { checked }, i) => {
        let { productLineResult } = this.state
        // 如果为false  清空对应产品线数据
        if (!checked) {
            productLineResult[i] = []
            this.setState({
                brandId: id,
                brandName: name,
                brandIndex: i,
                productLineResult
            })
        } else {
            this.setState({
                brandId: id,
                brandName: name,
                brandIndex: i
            })
        }

    }
    // 品牌文字点击
    onSelectedBrand = (id, name, i) => {
        this.setState({
            brandId: id,
            brandName: name,
            brandIndex: i
        })
    }
    // 品牌复选框组选中 获取选中的品牌数据
    getBrands = (checkedValues) => {
        this.setState({
            brandResult: checkedValues
        })
    }
    // 产品线复选框组选中 获取选中的产品线数据
    getProductLines = (checkedValues) => {

        // 1 若当前checkedValues长度为0 说明当前品牌下不存在已选中的产品线    则已选中的品牌数组删除对应品牌
        // 2 若当前checkedValues长度不为0  说明当前品牌下存在已选中的产品线  则当前品牌必是已选中项
        let { brandName, brandResult } = this.state
        if (checkedValues.length) {
            if (brandResult.indexOf(brandName) > -1) {
            } else {
                brandResult.push(brandName)
            }
        } else {
            brandResult = brandResult.filter(item => {
                return item != brandName
            })
        }
        let { brandIndex, productLineResult } = this.state
        productLineResult[brandIndex] = checkedValues
        this.setState({
            brandResult,
            productLineResult
        })
    }
    render = _ => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        // 获取品牌下对应产品线
        let newProductLineS = this.state.productLine.filter(item => {
            return item.parentId == this.state.brandId
        })
        // 根据产品线名称去重
        newProductLineS = unique(newProductLineS)
        return <Modal
            title='介质资料上传'
            visible={this.props.visible}
            onCancel={_ => {
                this.onCloseModal()
            }}
            onOk={this.publishFile}
            maskClosable={false}
            footer={[
                <Button disabled={this.state.uploadStatus != 3} key="submit" type="primary" onClick={this.publishFile}>发布</Button>
            ]}
            width={1000}
        > <div>
                <Form {...layout} name="nest-messages" >
                    <Form.Item label="选择文件">
                        {/* <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.afterUpload}>
                            {this.state.params.fileUrl ? <Button key="submit" type="primary">重新上传</Button> : <Button key="submit" type="primary">上传</Button>}
                            {this.state.percent ? <span style={{ display: "inline-block", width: "200px", marginLeft: "10px" }}><Progress percent={this.state.percent} size="small" /></span> : ""}
                        </Upload> */}
                        <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.afterUpload}>
                            <Button disabled={this.state.uploadStatus == 2 || this.state.uploadStatus == 1 || this.state.uploadStatus == 5} style={{ marginRight: "20px" }} key="submit" type="primary">上传</Button>
                            {this.state.uploadStatus == 1 ? "正在验重上传资料，请耐心等待！" : ""}
                            {this.state.uploadStatus == 2 ? "文件上传中，请耐心等待！" : ""}
                            {this.state.uploadStatus == 3 ? "上传成功!" : ""}
                            {this.state.uploadStatus == 4 ? "上传失败!" : ""}
                            {this.state.uploadStatus == 5 ? "网络异常!" : ""}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="文件名称">
                        <div>
                            <div>{this.state.file ? this.state.file.name : ""}</div>
                            {this.state.uploadStatus != 0 && this.state.uploadStatus != 1 ? <div style={{ lineHeight: "20px" }}>
                                <span style={{ display: "flex", width: "300px", fontSize: "12px" }}>
                                    <Progress style={{ flex: "6", marginRight: "8px" }} percent={this.state.percent} size="small" />
                                    {this.state.uploadStatus == 2 ? <span style={{ flex: "1" }}>{"(" + this.state.speed + "KB/s)"}</span> : ""}
                                    {this.state.uploadStatus == 5 ? <span style={{ flex: "1" }}>{"(0KB/s)"}</span> : ""}
                                </span>
                            </div> : ""}
                        </div>
                    </Form.Item>
                    <Form.Item label="版本号">
                        {getFieldDecorator('fileVersion', {
                            rules: [{ required: true, message: '请输入版本号！' }],
                        })(
                            <Input maxLength={30} />,
                        )}
                    </Form.Item>
                    <Form.Item label="资料类型">
                        {this.props.data.parentDir.join(" > ")}
                    </Form.Item>
                    <Form.Item label="标签">
                        {getFieldDecorator('fileLabel', {
                            rules: [{ required: true, message: '请选择对应标签' }],
                        })(
                            <Radio.Group>
                                {
                                    this.state.fileLabelData.map((item) => {
                                        return <Radio key={item.itemCode} value={item.itemCode}>{item.itemValue}</Radio>
                                    })
                                }
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} validateStatus="error" help={this.state.brandItemStatus ? "" : "请选择品牌!"}>
                        <div className="ant-col ant-col-4 ant-form-item-label"><label htmlFor="fileLabel" className="ant-form-item-required" title="品牌">品牌</label></div>
                        <div className="ant-col ant-col-16 ant-form-item-control-wrapper">
                            <div className="ant-form-item-control">
                                <span className="ant-form-item-children">
                                    <Checkbox.Group value={this.state.brandResult} style={{ width: '100%', lineHeight: "38px" }} onChange={this.getBrands}>
                                        {
                                            this.state.brand.map((item, i) => {
                                                return <span key={item.id} style={{ display: "inline-block", marginRight: "10px" }}>
                                                    <Checkbox value={item.name} style={{ marginRight: "3px" }} onChange={(checkedValue) => this.onChangeBrand(item.id, item.name, checkedValue.target, i)}></Checkbox>
                                                    <span style={{ cursor: "pointer" }} onClick={_ => this.onSelectedBrand(item.id, item.name, i)}>{item.name}</span>
                                                </span>
                                            })
                                        }
                                    </Checkbox.Group>
                                </span></div></div>

                    </Form.Item>
                    <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} validateStatus="error" help={this.state.productLineItemStatus ? "" : "请选择产品线!"}>
                        <div className="ant-col ant-col-4 ant-form-item-label"><label htmlFor="fileLabel" className="ant-form-item-required" title="产品线">产品线</label></div>
                        <div className="ant-col ant-col-16 ant-form-item-control-wrapper">
                            <div className="ant-form-item-control">
                                <span className="ant-form-item-children">
                                    <Checkbox.Group style={{ width: '100%', lineHeight: "38px" }} value={this.state.productLineResult[this.state.brandIndex]} onChange={this.getProductLines}>
                                        {
                                            newProductLineS.map((item) => {
                                                return <Checkbox key={item.id} value={item.name}>{item.name}</Checkbox>
                                            })
                                        }

                                    </Checkbox.Group>
                                </span></div></div>
                    </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入文件相关描述' }],
                        })(
                            <TextArea placeholder="最多可输入50个字符" maxLength={50} />
                        )}
                    </Form.Item>
                    {/* <Form.Item label="按钮">
                        <button onClick={this.stopUpload}>取消上传</button>
                        <button onClick={this.restartUpload}>重新上传</button>
                        <button onClick={_ => GetFileList()}>获取上传文件列表</button>
                        <button onClick={this.getNetWork}>获取网络情况</button>
                    </Form.Item> */}
                </Form>
            </div>
        </Modal>
    }
}
const fileUploads = Form.create()(fileUpload)
export default fileUploads













