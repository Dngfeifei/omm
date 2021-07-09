/***
 *  系统管理--公告编辑页面
 * @auth yyp
 */
import React, { Component } from 'react'
import { Button, Select, Tag, Modal, Form, Icon } from 'antd'
const { Option } = Select;

// 引入日期格式化
import moment from 'moment'


// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"
// 引入 API接口
import { GetFilesIp } from '/api/systemBulletin'

// 引入 富文本编辑器组件
// import Editor from "@/components/editor"

// 引入 API接口
// import { AddSysNotice, EditSysNotice } from '/api/systemBulletin'



class NoticeInfo extends Component {
    // 设置默认props
    static defaultProps = {
        data: {
            // id: "65465",
            // noticeTitle: '公告标题',
            // noticeType: '你好,我好,大家好',
            // status: '1',
            // isTop: "1",
            // publishTime: '2021-06-28 12:25:33',
            // noticeContent: "<p>测试数据而已</p>",
        }
    }
    componentWillMount() {
        this.init()
    }
    // 界面数据初始化
    init = _ => {
        let { type, data } = this.props;
        let newData = { type }
        newData["notice"] = data
        GetFilesIp().then(res => {
            let content = newData["notice"].noticeContent
            newData["notice"].noticeContent = content.replace(/\${fileHost}/g, res.data.parameterValue)
            newData["obtained"] = true
            newData["notice"].noticeFiles.forEach((el, i) => {
                el.uid = i
                el.name = el.fileName
                el.url = el.fileUrl + "?filename=" + el.fileName
            });
            this.setState(newData)
        })

    }

    state = {
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
        obtained: false//是否已经获取ip
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
        console.log(this.props, "props")
        let notice = this.state.notice
        console.log(notice)
        return <ModalParant
            title={"查阅"}
            destroyOnClose={true}
            visible={true}
            onOk={this.props.onCancel}//若无选中数据 执行关闭方法
            onCancel={this.props.onCancel}
            width={1000}
            bodyStyle={{ padding: "20px" }}
            footer={[
                <Button key="back" onClick={this.props.onCancel}>
                    关闭
                </Button>
            ]}
        >
            <div style={{ height: "600px", overflowY: "auto", position: "relative" }}>
                <h2 style={{ textAlign: "center" }}>{notice.noticeTitle}</h2>
                <div style={{ textAlign: "right", marginRight: "30px", padding: "10px 0" }}>
                    <span style={{ marginRight: "20px" }}>{"关键字:" + notice.noticeType}</span>
                    <span>{"发布时间:" + notice.publishTime}</span>
                </div>
                {this.state.obtained ? <div style={{ padding: '20px 30px 30px', minHeight: "420px" }} dangerouslySetInnerHTML={{ __html: notice.noticeContent }}></div> : ""}

                {
                    notice.noticeFiles.length ? <div style={{ borderTop: "2px solid #000", paddingTop: "10px", }}>
                        <Form layout='inline' className="form-error">
                            <Form.Item
                                label={"附件"}
                                labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}
                                style={{ marginRight: '0', width: "100%" }}>
                                <div style={{ paddingTop: "5px" }}>
                                    {
                                        notice.noticeFiles.map((item, i) => {
                                            return <p style={{ margin: 0, lineHeight: "30px" }} key={i}>
                                                <Icon type="paper-clip" style={{ marginRight: "10px" }} />
                                                <a onClick={_ => this.downLoad(item)}>{item.fileName}</a>
                                            </p>
                                        })
                                    }
                                </div>
                            </Form.Item>
                        </Form>
                    </div> : ""
                }

            </div>

        </ModalParant >

    }
}

export default NoticeInfo

