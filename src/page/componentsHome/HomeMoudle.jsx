import React, { Component, PropTypes } from 'react'
import { Row, Col, Spin } from 'antd'

// 导入 卡片模板文件
import Card from "@/components/card/card";


import '/assets/less/pages/homeMoudle.css'


class HomeMoudle extends Component {
  // 相当于构造函数
  constructor(props) {
    // 必须写
    super(props)
    this.state = {
      cartList: [{
        title: '我的待办',
        number: '10',
        icon: 'user-add'
      }, {
        title: '已完成',
        number: '11',
        icon: 'heart'
      }, {
        title: '进行中',
        number: '12',
        icon: 'share-alt'
      }, {
        title: '我的管理',
        number: '12',
        icon: 'share-alt'
      }],


      lists: [{
        name: '巡检管理'
      }, {
        name: '用户回访管理'
      }, {
        name: '事件管理'
      }, {
        name: '智能运维产品'
      }, {
        name: '数据采集处理任务调度平台(bridge)'
      }],


      // state中的activeType值来实现样式切换的效果
      activeType: 0,
      // 控制当前页面的刷新(加载)--状态
      loading: false,
      // 控制当前页面的显示/隐藏--状态
      isShow: true,
    };
  }


  handleSiblingsClick = (index) => {
    this.setState({
      activeType: index
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


  render() {
    return (
      <Card className="card-content" title="常用模块" isShow={this.state.isShow} change={this.change} refresh={this.refresh}>
        <Spin spinning={this.state.loading}>
          <Row gutter={20} style={{ height: '105px' }}>
            <Col span={8} className="left">
              <div className="list-item">
                {
                  this.state.lists.map((item, i) => {
                    return (
                      <div className={this.state.activeType == i ? 'items active' : 'items'} onClick={this.handleSiblingsClick.bind(this, i)} data-index={i} key={i}>{item.name}</div>
                    );
                  })
                }
              </div>
            </Col>
            <Col span={16} className="right">
              <div className="cart-list">
                {
                  this.state.cartList.map((item) => {
                    return (
                      <div className="cart-item cart-itembg" key={item.title}>
                        <div className="cart-item-content">
                          <div className="number">{item.number}</div>
                          <div className="title">{item.title}</div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </Col>
          </Row>
        </Spin>

      </Card>
    )
  }
}

export default HomeMoudle