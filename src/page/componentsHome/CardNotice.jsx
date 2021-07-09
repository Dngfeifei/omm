import React, { Component } from 'react'
import { connect } from "react-redux";

import { List, Spin, Tag, Icon } from 'antd'

import { GetSysNotice } from '/api/systemBulletin'
// 导入 卡片模板文件
import Card from "@/components/card/card";

import CardInfo from "./noticeInfo";
//202158点击新增按钮页面
import { ADD_PANE } from "/redux/action";
@connect(
    (state) => ({}),
    (dispath) => ({
        add(pane) {
            dispath({ type: ADD_PANE, data: pane });
        },
    })
)
class CardNotice extends Component {
    async componentWillMount() {
        this.search()

    }

    state = {
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        finish: false,
        loading: false,
        data: [],
        // 控制当前页面的显示/隐藏--状态
        isShow: true,
        // 控制当前页面的刷新(加载)--状态
        loading: false,
        // 公告详情页弹窗显示/隐藏--状态
        visible: false,
        modolInfo: {}
    }

    search = async () => {
        let params = {
            limit: this.state.pagination.pageSize,
            offset: (this.state.pagination.current - 1) * this.state.pagination.pageSize,
            status: 1,
        }
        GetSysNotice(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                // let pagination = Object.assign({}, this.state.pagination, {
                //     pageSize: res.data.size,
                //     current: res.data.current,
                //     total: res.data.total,
                // })
                // this.setState({  loading: false,data: res.data.records, pagination: pagination })

                this.setState({ loading: false, data: res.data.records })
            }
        })
    }

    // 用于修改卡片的显示/隐藏
    change = () => {
        this.setState({
            isShow: false
        })
    }


    // 用于修改卡片的加载态
    refresh = () => {
        this.setState({
            loading: true
        })
        const timeoutID = setTimeout(() => {
            //执行
            this.setState({
                loading: false
            })
            //清除
            clearTimeout(timeoutID);
        }, 1000)

    }
    // 公告详情页展示方法
    showDetails = (item) => {
        this.setState({
            modolInfo: item,
            visible: true
        })
    }
    // 公告详情弹窗页关闭方法
    closeDetails = (item) => {
        this.setState({
            modolInfo: {},
            visible: false
        })
    }

    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { current: current });
        this.setState({
            pagination,
            selectedKeys: [],
            selectedInfo: [],
        }, _ => {
            this.gettableData()
        })
    }

    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { pageSize: pageSize });
        this.setState({
            pagination,
            selectedKeys: [],
            selectedInfo: [],
        }, _ => {
            this.gettableData()
        })
    }
    // 查看更多
    seeMore = () => {
        let pane = {
            title: "更多系统公告",
            key: "更多系统公告",
            url: "componentsHome/noticeMore.jsx",
        };
        this.props.add(pane);
    }
    render() {
        return (
            <Card className="card-content" title="系统公告" isShow={this.state.isShow} change={this.change} refresh={this.refresh}>
                <Spin spinning={this.state.loading}>
                    <List itemLayout="horizontal" dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item>
                                <div style={{ width: "55%" }} onClick={_ => this.showDetails(item)}>
                                    <span style={item.isTop == 1 ? { color: '#1890ff', cursor: 'pointer', fontWeight: "bold" } : { color: '#1890ff', cursor: 'pointer' }}>
                                        {item.noticeTitle}
                                        {item.noticeFiles.length ? <Icon type="paper-clip" style={{ marginLeft: "5px" }} /> : ""}
                                    </span>
                                </div>
                                <div style={{
                                    width: "25%", overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }} > {item.noticeType.split(",").map((tag, i) => (
                                    tag != "" ? <Tag color="blue" key={i}>
                                        {tag}
                                    </Tag> : ""

                                ))}</div>
                                <div style={{ width: "20%" }}>{item.publishTime}</div>
                            </List.Item>
                        )}
                    />
                </Spin>
                {!this.state.visible ? "" : <CardInfo onCancel={this.closeDetails} data={this.state.modolInfo} />}
                <p style={{ textAlign: "right", paddingTop: "8px" }}><a onClick={this.seeMore}>{`查看更多 >>`}</a></p>
            </Card>
        );
    }

}

export default CardNotice;