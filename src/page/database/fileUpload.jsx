/***
 *  资料库--介质库管理--个人文件上传
 * @auth yyp
*/


import React, { Component } from 'react'
import { Modal, Form, Input, Button, Radio, Upload, message } from 'antd'
import SparkMD5 from 'spark-md5'

import { GetSignResult, PostFilePublish } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

let tokenName = 'token'
if (process.env.NODE_ENV == 'production') {
    tokenName = `${process.env.ENV_NAME}_${tokenName}`
}
let token = `${localStorage.getItem(tokenName) || ''}`;
let uploadUrl = `${process.env.API_URL}/fileLibrary/upload`,
class fileUpload extends Component {

    componentDidMount() {

    }

    componentWillMount() {
        this.getDictInfo()
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
        fileName: "",
        file: null,
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
            // action: '/fileLibrary/upload',
            action: uploadUrl,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            showUploadList: false,

        },
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
    // 文件上传前
    beforeUpload = (file) => {
        let params = Object.assign({}, this.state.params, { size: file.size })
        this.setState({
            fileName: file.name,
            params,
            file
        }, _ => {
            this.get_filemd5sum(file)
        })
        return false
    }
    // 文件加签提交接口
    getSignResult = async (data) => {
        return GetSignResult({ fileSignature: data })
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                } else {
                    if (res.status == 200) {
                        this.uploadFile()
                    } else {
                        message.error(res.message)
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
            console.warn('oops, something went wrong.');
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    }
    // 文件上传
    uploadFile = () => {
        var formData = new FormData();
        formData.append('file', this.state.file);
        fetch(uploadUrl, {
            method: 'POST',
            processData: false,
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                let params = Object.assign({}, this.state.params, { fileUrl: response.data.fileUrl })
                this.setState({
                    params,
                })
            });
    }
    // 上传文件发布
    publishFile = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            e.preventDefault();
            if (err) {
                return
            }
            if (!err) {

                let param = this.props.form.getFieldsValue()
                let data = Object.assign({}, this.state.params, param)
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

    render = _ => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return <Modal
            title='介质资料上传'
            visible={this.props.visible}
            onCancel={this.props.onCancel}
            onOk={this.publishFile}
            footer={[
                <Button disabled={this.state.params.fileUrl == ""} key="submit" type="primary" onClick={this.publishFile}>发布</Button>
            ]}
        > <div>
                <Form {...layout} name="nest-messages" >

                    <Form.Item label="选择文件">
                        <Upload {...this.state.uploadConf} beforeUpload={this.beforeUpload} onChange={this.afterUpload} >
                            <Button key="submit" type="primary">上传</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="文件名称">
                        {this.state.fileName}
                    </Form.Item>
                    <Form.Item label="版本号">
                        {getFieldDecorator('fileVersion', {
                            rules: [{ required: true, message: '请输入版本号！' }],
                        })(
                            <Input disabled={this.state.fileName == ""} />,
                        )}
                    </Form.Item>
                    <Form.Item label="资料类型">
                        {this.props.data.parentDir.join("/")}
                    </Form.Item>
                    <Form.Item label="标签">
                        {getFieldDecorator('fileLabel', {
                            rules: [{ required: true, message: '请选择对应标签' }],
                        })(
                            <Radio.Group disabled={this.state.fileName == ""}>
                                {
                                    this.state.fileLabelData.map((item) => {
                                        return <Radio key={item.itemCode} value={item.itemCode}>{item.itemValue}</Radio>
                                    })
                                }
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入文件相关描述' }],
                        })(
                            <Input disabled={this.state.fileName == ""} />,
                        )}
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    }

}
const fileUploads = Form.create()(fileUpload)
export default fileUploads













