/***
 *  系统管理--公告编辑页面
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, Button, message, Select, Input, Modal, DatePicker, Upload, Icon } from 'antd'
const { Option } = Select;

// 引入日期格式化
import moment from 'moment'


// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"

// 引入 富文本编辑器组件
import Editor from "@/components/editor/index2.jsx"

// 引入 API接口
import { AddSysNotice, EditSysNotice, GetFilesIp, DelNoticeFile } from '/api/systemBulletin'



class Notice extends Component {
    // 设置默认props
    static defaultProps = {
        type: "add",
        data: {
            noticeTitle: '',
            noticeType: '',
            status: '',
            isTop: "",
            noticeType: '',
            publishTime: null,
            noticeContent: "",
            noticeFiles: []
        }
    }
    componentWillMount() {
        // 初始化界面数据
        this.init()
    }
    componentDidMount() {
        let data = this.props.data;
        let type = this.props.type;
        if (type == "edit" || type == "previewing") {
            this.props.form.setFieldsValue({
                noticeTitle: data.noticeTitle,
                noticeType: data.noticeType,
                status: data.status,
                isTop: data.isTop,
                publishTime: moment(data.publishTime, "'YYYY-MM-DD HH:mm:ss'"),
            });
        }
    }

    state = {
        // 请求加锁
        actionLock: true,
        rules: [{
            label: '标题',
            key: 'noticeTitle',
            option: {
                rules: [this.props.type != "previewing" ? {
                    required: true, message: '请输入标题!',
                } : {}]
            },
            render: _ => {
                return <Input disabled={this.props.type != "previewing" ? false : true} style={{}} placeholder="请输入标题" />
            }
        }, {
            label: '状态',
            key: 'status',
            option: {
                rules: [this.props.type != "previewing" ? {
                    required: true, message: '请输入标题!',
                } : {}],
            },
            render: () => {
                return <Select disabled={this.props.type != "previewing" ? false : true} placeholder="请选择">
                    <Option value={1}>发布</Option>
                    <Option value={0}>草稿</Option>
                </Select>
            }
        }, {
            label: '关键字',
            key: 'noticeType',
            // option: {
            //     rules: [{
            //         required: true, message: '请输入关键字!',
            //     }]
            // },
            render: _ => <Input disabled={this.props.type != "previewing" ? false : true} placeholder="请输入关键字，多个关键字请用逗号隔开" />
        }, {
            label: '是否置顶',
            key: 'isTop',
            option: {
                rules: [this.props.type != "previewing" ? {
                    required: true, message: '请选择是否置顶!',
                } : {}]
            },
            render: _ => {
                return <Select disabled={this.props.type != "previewing" ? false : true} placeholder="请选择">
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                </Select>
            }
        }, {
            label: '发布时间',
            key: 'publishTime',
            option: {
                rules: [this.props.type != "previewing" ? {
                    required: true, message: '请选择发布时间!',
                } : {}]
            },
            render: _ => {
                return <DatePicker disabled={this.props.type != "previewing" ? false : true} showTime placeholder="请选择发布时间" style={{ width: "100%" }} />
            }
        }],
        notice: {
            noticeTitle: '',
            noticeType: '',
            status: '',
            isTop: "",
            noticeType: '',
            publishTime: '',
            noticeContent: "",
            noticeFiles: []
        },
        titleMap: {
            add: '新增',
            edit: '修改',
            previewing: '查阅'
        },
        type: "add",
        obtained: false//是否已经获取ip

    }
    // 界面数据初始化
    init = _ => {
        let { type, data } = this.props;
        let newData = { type }
        if (type == "edit" || type == "previewing") {
            newData["notice"] = data
            GetFilesIp().then(res => {
                let content = newData["notice"].noticeContent
                newData["notice"].noticeContent = content.replace(/\${fileHost}/g, res.data.parameterValue)

                newData["notice"].noticeFiles.forEach((el, i) => {
                    el.uid = i
                    el.name = el.fileName
                    el.url = el.fileUrl + "?filename=" + el.fileName
                });
                newData["obtained"] = true
                console.log(newData, "newData")
                this.setState(newData)
            })
        } else {
            this.setState({ obtained: true })
        }
    }

    //获取富文本数据
    getContent = (content, key) => {
        let notice = this.state.notice;
        notice["noticeContent"] = content
        this.setState({ notice })
    }
    // 保存
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = this.props.form.getFieldsValue()
                let notice = Object.assign({}, this.state.notice, param)
                notice.publishTime = notice.publishTime ? moment(notice.publishTime).format('YYYY-MM-DD HH:mm:ss') : notice.publishTime
                notice.noticeType = notice.noticeType ? notice.noticeType.replace(/，/g, ",") : notice.noticeType
                if (!this.state.actionLock) {
                    return
                }
                this.state.actionLock = false
                if (this.state.type == "add") {
                    AddSysNotice(notice).then(res => {
                        if (res.success != 1) {
                            message.destroy()
                            message.error(res.message)
                        } else {
                            this.props.onOk()
                        }
                        this.state.actionLock = true
                    })
                } else if (this.state.type == "edit") {
                    EditSysNotice(notice).then(res => {
                        if (res.success != 1) {
                            message.destroy()
                            message.error(res.message)
                        } else {
                            this.props.onOk()
                        }
                        this.state.actionLock = true
                    })
                }
            }
        });
    }
    uploadFile = (file) => {
        let token, tokenName = 'token';
        if (process.env.NODE_ENV == 'production') {
            tokenName = `${process.env.ENV_NAME}_${tokenName}`
        }
        token = localStorage.getItem(tokenName) || '';

        var formData = new FormData();
        formData.append('file', file);
        fetch(`${process.env.API_URL}'/sysNotice/upload'`, {
            method: 'POST',
            body: formData,
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .catch(error => {
                message.destroy()
                message.error(error)
            })
            .then(res => {
                if (res.success != 1) {
                    message.destroy()
                    message.error(res.message)
                } else {
                    let fileObj = { uid: file.uid, name: file.name, url: res.data + "?filename=" + file.name, fileName: file.name, fileUrl: res.data }
                    console.log(file, fileObj)
                    let { notice } = this.state
                    notice.noticeFiles.push(fileObj)
                    this.setState({ notice })
                }
            });
    }
    downLoad = (file) => {
        console.log(file, "999")
        var a = document.createElement("a");
        document.body.appendChild(a);

        a.href = file.url + (file.url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment';
        a.download = decodeURI(file.fileName);
        a.target = "_blank"
        a.click();
        document.body.removeChild(a);
    }
    render = _ => {
        const { getFieldDecorator } = this.props.form;

        const props = {
            action: '/sysNotice/upload',
            multiple: true,
            beforeUpload: file => {
                this.uploadFile(file)
                return false;
            },
            onRemove: file => {
                console.log(file, "file")
                let params = ""
                if (file.hasOwnProperty('noticeId')) {
                    params += "noticeId=" + file['noticeId'] + "&"
                }
                if (file.hasOwnProperty('id')) {
                    params += "id=" + file['id'] + "&"
                }
                params += "fileUrl=" + file['fileUrl']
                DelNoticeFile(params).then(res => {
                    if (res.success != 1) {
                        message.destroy()
                        message.error(res.message)
                        return
                    }
                    this.setState(state => {
                        let index = state.notice.noticeFiles.indexOf(file);
                        let newFileList = state.notice.noticeFiles.slice();
                        newFileList.splice(index, 1);
                        let notice = this.state.notice
                        notice.noticeFiles = newFileList
                        return {
                            notice
                        };
                    });
                })

            },
        };
        return <ModalParant
            title={this.state.titleMap[this.state.type]}
            destroyOnClose={true}
            visible={true}
            onOk={this.onSubmit}//若无选中数据 执行关闭方法
            onCancel={this.props.onCancel}
            width={1000}
            bodyStyle={{ padding: "0" }}
            footer={this.props.type == "previewing" ? [
                <Button key="back" onClick={this.props.onCancel}>
                    关闭
                </Button>
            ] : [
                <Button key="back" onClick={this.props.onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={this.onSubmit}>
                    保存
                </Button>,
            ]}
        >
            <Form layout='inline' className="form-error" style={{ padding: '10px 10px 0' }}>
                {this.state.rules.map((val, index) =>
                    <Form.Item
                        label={val.label}
                        labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                        key={index}
                        style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                        {getFieldDecorator(val.key, val.option)(val.render())}
                    </Form.Item>)}
                {
                    this.state.type != "previewing" ? <Form.Item
                        label={"附件"}
                        labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}
                        style={{ marginRight: '0', width: "100%", marginBottom: "20px" }}>
                        <Upload {...props} fileList={this.state.notice.noticeFiles}>
                            <Button>选择附件</Button>
                        </Upload>
                    </Form.Item> : <Form.Item
                        label={"附件"}
                        labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}
                        style={{ marginRight: '0', width: "100%", marginBottom: "20px" }}>
                        <div style={{ paddingTop: "5px" }}>
                            {
                                this.state.notice.noticeFiles.map((item, i) => {
                                    console.log(decodeURI(item.fileName), "999")
                                    return <p style={{ margin: 0, lineHeight: "30px" }} key={i}><Icon type="paper-clip" style={{ marginRight: "10px" }} />
                                        <a onClick={_ => this.downLoad(item)}>{item.fileName}</a>
                                    </p>
                                })
                            }</div>
                    </Form.Item>
                }
            </Form>
            <div style={{ padding: '0 50px 10px' }}>
                {
                    this.state.obtained ? <Editor disabled={this.props.type == "previewing" ? true : false} height={500} getContent={this.getContent} value={this.state.notice.noticeContent} /> : ""
                }
            </div>

        </ModalParant >

    }
}

const Notices = Form.create()(Notice)
export default Notices

