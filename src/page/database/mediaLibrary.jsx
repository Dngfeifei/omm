/***
 *  资料库--介质库管理
 * @auth yyp
*/

import React, { Component } from 'react'
import { Tabs } from 'antd'
const { TabPane } = Tabs;
// 引入 个人文件组件
import Personal from "./personal"
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
    // 个人数据变化——>全部数据更新
    personalListUpdate = _ => {
        this.all.getTableData()
    }
    // 全部数据变化——>个人数据更新
    allListUpdate = _ => {
        this.personal.getTableData()
        this.personal.getTableData2()
    }
    render = _ => {
        let { monetaryValue } = this.state
        return <div style={{ height: '100%', padding: "0 10px" }} >
            <Tabs defaultActiveKey="1" animated={false}>
                <TabPane tab="个人文件管理" key="1">
                    <p style={{ marginLeft: "12px" }}>我的币值：{monetaryValue}</p>
                    <Personal onRef={c => this.personal = c} listUpdate={this.allListUpdate}></Personal>
                </TabPane>
                <TabPane tab="全部文件" key="2">
                    <p style={{ marginLeft: "12px" }}>我的币值：{monetaryValue}</p>
                    <All onRef={c => this.all = c} listUpdate={this.personalListUpdate}></All>
                </TabPane>
            </Tabs>

        </div>
    }

}
export default Medium













