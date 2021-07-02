/***
 *  介质库--列表详情页面
 * @auth yyp
 */
import React, { Component } from 'react'
import { Form, Button } from 'antd'

// 引入 弹窗组件组件
import ModalParant from "@/components/modal/index.jsx"

import { GetDictInfo } from '/api/dictionary'  //数据字典api

let fileLabelData = {}

class Details extends Component {
    // 设置默认props
    static defaultProps = {
        data: {
            "applyId": "",
            "categorieName": "win81",
            "categoriesId": "15",
            "clearTime": "2021-10-23",
            "collectNum": 1,
            "collectTime": "",
            "cosUrl": "",
            "description": "ceshi",
            "downUserName": "",
            "downloadNum": 2,
            "fileLabel": "operSysImage",
            "fileLevelId": "3",
            "fileName": "win8-test.txt",
            "fileSignature": "",
            "fileSize": "46bytes",
            "fileVersion": "1.0",
            "id": "69",
            "isCollect": 1,
            "isCompleted": "",
            "isDownload": 0,
            "isLike": 0,
            "levelName": "3级",
            "likeNum": 1,
            "points": 5,
            "publishTime": "2021-06-23 17:02:15",
            "reviewStatus": "",
            "reviewUser": "",
            "uploadStatus": 1,
            "uploadTime": "2021-06-23 16:55:37",
            "uploadUser": "7760",
            "uploadUserName": "孙含含"
        },
        info: []
    }
    state = {
        fileLabelData: {}
    }
    componentWillMount() {
        this.getDictInfo()
    }

    state = {

    }
    // 获取数据字典-产品类别数据
    getDictInfo = async () => {
        GetDictInfo({ dictCode: "fileLabel" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                res.data.forEach(item => {
                    fileLabelData[item.itemCode] = item.itemValue
                })
                this.setState({ fileLabelData })
            }
        })
    }
    render = _ => {
        return <ModalParant
            title={"详情"}
            destroyOnClose={true}
            visible={true}
            onCancel={this.props.onCancel}
            width={1000}
            bodyStyle={{ padding: "0" }}
            footer={[
                <Button key="back" onClick={this.props.onCancel}>
                    关闭
                </Button>
            ]}
        >
            <Form layout='inline' className="form-error" style={{ padding: '10px 10px 0' }}>
                {/* {this.state.rules.map((val, index) =>
                    <Form.Item
                        label={val.label}
                        labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                        key={index}
                        style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                        {getFieldDecorator(val.key, val.option)(val.render())}
                    </Form.Item>)} */}
                <Form.Item
                    label={"文件名"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.fileName}
                </Form.Item>
                <Form.Item
                    label={"版本"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.fileVersion}
                </Form.Item>
                <Form.Item
                    label={"文件大小"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.fileSize}
                </Form.Item>
                <Form.Item
                    label={"标签"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {fileLabelData[this.props.data.fileLabel]}
                </Form.Item>
                <Form.Item
                    label={"资料级别"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.levelName}
                </Form.Item>
                <Form.Item
                    label={"资料类型"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.categorieName}
                </Form.Item>
                <Form.Item
                    label={"上传时间"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.uploadTime}
                </Form.Item>
                <Form.Item
                    label={"发布时间"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.publishTime}
                </Form.Item>
                <Form.Item
                    label={"币值"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.points}
                </Form.Item>
                <Form.Item
                    label={"下架日期"}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                    {this.props.data.clearTime}
                </Form.Item>
                {this.props.info.map((item, i) => {
                    return <Form.Item
                        key={i}
                        label={item.name}
                        labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                        style={{ marginRight: '0', width: "50%", marginBottom: "20px" }}>
                        {item.value}
                    </Form.Item>
                })}
                <Form.Item
                    label={"描述"}
                    style={{ marginRight: '0', width: "100%", marginBottom: "20px" }}
                    labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}
                >
                    {this.props.data.description}
                </Form.Item>
            </Form>
        </ModalParant >

    }
}
export default Details

