import React, { Component } from 'react'

import { List, Spin} from 'antd'
// API
import { getnotices } from '/api/notice'
// 导入 卡片模板文件
import Card from "@/components/card/card";

class CardNotice extends Component {
    async componentWillMount () {
		// this.search()
	}

	state = {
		limit: 10,
		offset: 0,
		finish: false,
    	loading: false,
        data: [],
        dataList: [{
            content: "null  已入库",
            createtime: "2020-12-28 14:08:33",
            id: 254,
            title: "资质证书入库通知",
            type: 2
        }, {
            content: "测试  已入库",
            createtime: "2020-12-10 11:42:01",
            id: 253,
            title: "资质证书入库通知",
            type: 2
        }, {
            content: "法人身份证原件  已更新",
            createtime: "2020-09-11 16:08:15",
            id: 252,
            title: "资质证书更新通知",
            type: 2
        }, {
            content: "法人身份证原件  已更新",
            createtime: "2020-09-11 16:04:23",
            id: 251,
            title: "资质证书更新通知",
            type: 2
        }, {
            content: "法人身份证原件  已入库",
            createtime: "2020-09-11 15:59:56",
            id: 250,
            title: "资质证书入库通知",
            type: 2,
        }, {
            content: "浪潮商用机器-钻石牌合作伙伴  已入库",
            createtime: "2020-08-06 14:42:27",
            id: 249,
            title: "资质证书入库通知",
            type: 2,
        }, {
            content: "浪潮商用机器-最佳贡献奖  已入库",
            createtime: "2020-08-06 14:41:26",
            id: 248,
            title: "资质证书入库通知",
            type: 2
        }, {
            content: "ITSS全权成员单位  已入库",
            createtime: "2020-08-05 14:51:38",
            id: 247,
            title: "资质证书入库通知",
            type: 2
        }],

        // 控制当前页面的显示/隐藏--状态
        isShow:true,
        // 控制当前页面的刷新(加载)--状态
        loading: false,
    }
    
    search = async (offset = this.state.offset) => {
        this.setState({ loading: true })
        let data = this.state.data
        await getnotices({ limit: this.state.limit, offset }).then(res => {
            this.setState({ loading: false })
            data = res.data.records;
        })
        this.setState({
            data: data
        })
    }
    
    // 用于修改卡片的显示/隐藏
    change=()=>{
        this.setState({
            isShow:false
        })
    }


    // 用于修改卡片的加载态
    refresh=()=>{
        this.setState({
            loading:true
        })
        const timeoutID = setTimeout(()=>{
            //执行
            this.setState({
                loading:false
            })
            //清除
            clearTimeout(timeoutID);
        }, 1000)
        
    }

    render() {
      return (
        <Card className="card-content" title="系统公告" isShow={this.state.isShow}  change={this.change} refresh={this.refresh}>
              <Spin spinning={this.state.loading}>
                  <List itemLayout="horizontal" dataSource={this.state.data}
                      renderItem={item => (
                          <List.Item>
                              <List.Item.Meta
                                  title={item.title}
                                  description={item.content + '-' + item.createtime}
                              />
                          </List.Item>
                      )}
                  />
              </Spin>
        </Card>
      );
    }
  
}

export default CardNotice;