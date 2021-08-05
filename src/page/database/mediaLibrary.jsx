/***
 *  资料库--介质库管理
 * @auth yyp
*/

import React, { Component } from 'react'
import { Tabs } from 'antd'
const { TabPane } = Tabs;
// 引入 个人文件上传组件
import PersonalUpload from "./personalUpload"
// 引入 个人文件下载组件
import PersonalDownload from "./personalDownload"
// 引入 个人文件收藏组件
import MyCollection from "./myCollection"
// 引入 全部文件组件
import All from "./all"

//引入api接口
import { GetFilePonints } from '/api/mediaLibrary.js'

class Medium extends Component {
    async componentWillMount() {
        // 获取币值数据
        this.GetFilePonint()
        setInterval(() => {
            this.GetFilePonint()
        }, 300000);
        window.onresize = () => {
            this.SortTable();
        }
    }
    //resetView
    SortTable = () => {
        if (this.PersonalUpload) this.PersonalUpload.SortTable();
        if (this.PersonalDownload) this.PersonalDownload.SortTable();
        if (this.MyCollection) this.MyCollection.SortTable();
        if (this.All) this.All.SortTable();
    }
    state = {
        monetaryValue: 0   //币值
    }
    //获取币值数据
    GetFilePonint = async () => {
        GetFilePonints()
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    return
                } else {
                    this.setState({
                        monetaryValue: res.data.points
                    })
                }
            })
    }
    // 全部数据变化——>个人数据更新
    listUpdate = _ => {

        this.PersonalUpload ? this.PersonalUpload.getTableData() : ""
        this.PersonalDownload ? this.PersonalDownload.getTableData2() : ""
        this.MyCollection ? this.MyCollection.getTableData() : ""
        this.All ? this.All.getTableData() : ""
    }
    render = _ => {
        let { monetaryValue } = this.state
        const operations = <span style={{ paddingRight: "50px" }}>我的币值：{monetaryValue}</span>;
        return <div style={{ height: '100%', padding: "0 10px" }} >
            <Tabs defaultActiveKey="1" animated={false} tabBarExtraContent={operations} onTabClick={(key, event) => {
                this.SortTable();
            }}>
                <TabPane tab="我的上传" key="1">
                    <PersonalUpload onRef={c => this.PersonalUpload = c} listUpdate={this.listUpdate}></PersonalUpload>
                </TabPane>
                <TabPane tab="我的下载" key="2">
                    <PersonalDownload onRef={c => this.PersonalDownload = c} listUpdate={this.listUpdate}></PersonalDownload>
                </TabPane>
                <TabPane tab="我的收藏" key="3">
                    <MyCollection onRef={c => this.MyCollection = c} listUpdate={this.listUpdate}></MyCollection>
                </TabPane>
                <TabPane tab="全部文件" key="4">
                    <All onRef={c => this.All = c} listUpdate={this.listUpdate}></All>
                </TabPane>
            </Tabs>
        </div>
    }

}
export default Medium













