import React, { Component, PropTypes } from 'react'
import { Row, Col, Spin, Icon, Modal, Button, Form, Input, Select ,message } from 'antd'

// 导入 卡片模板文件
import Card from "@/components/card/card";


import '/assets/less/pages/homeMoudle.css'


class HomeMoudle extends Component {
  // 相当于构造函数
    constructor(props) {
        // 必须写
        super(props)
        this.state = {
            visible: false,  // 对话框的状态
            Modal: {
                addModules: '添加模块',
                delModules: '删除模块',
            },
            titleStatus: 'addModules',
            // 添加模块数据   
            blockArray: [{ name: '巡检管理', id: '1' }, { name: '事件管理', id: '2' }, { name: '用户回访管理', id: '3' }, { name: '智能运维产品', id: '4' }, { name: '数据采集处理任务调度平台(bridge)', id: '5' }],
            // 模块对应的待办等各项指标数据   
            cartList: [
                {
                    title: '我的待办',
                    number: '0',
                    icon: 'user-add'
                }, {
                    title: '已完成的',
                    number: '0',
                    icon: 'heart'
                }, {
                    title: '进行中的',
                    number: '0',
                    icon: 'share-alt'
                }, {
                    title: '我管理的',
                    number: '0',
                    icon: 'share-alt'
                }
            ],
            cartListImage: ['url(static/images/toDoBanner.png)', 'url(static/images/progressBanner.png)', 'url(static/images/doneBannder.png)', 'url(static/images/manageBanner.png)'],

            //  要展示的模块数据(已添加)   
            lists: [],

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

    // 添加常用模块项--事件
    showModal = () => {
        const len = this.state.cartList.length;
        //   先判断常用模块数据是否超过或等于5(此功能要求：常用模块不能超过5个)
        if (len >= 4) {
            message.error('常用模块数量不能超过5个！')
        } else {
            this.setState({
                visible: true,
                titleStatus: 'addModules',
            });
        }

    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
            titleStatus: 'addModules',
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
            titleStatus: 'addModules',
        });
    };


  render() {
    const { getFieldDecorator } = this.props.form;

    // 常用模块已添加的数据
    const len = this.state.lists.length;

    return (
      <div className="homeModules">
        <Card className="card-content" title="常用模块" isShow={this.state.isShow} change={this.change} refresh={this.refresh}>
          <Spin spinning={this.state.loading}>
            <Row gutter={20}>
              <Col span={10} className="left">
                {
                  len > 0 ? (
                    <div>
                      <div className="list-item">
                        {
                          this.state.lists.map((item, i) => {
                            return (
                              <div className={this.state.activeType == i ? 'items active' : 'items'} onClick={this.handleSiblingsClick.bind(this, i)} data-index={i} key={i}>{item.name}</div>
                            );
                          })
                        }
                      </div>
                      <div className="Operation">
                        <Icon type="minus" />
                        <Icon type="plus" onClick={this.showModal} />
                      </div>
                    </div>
                  ) : (
                      // onClick={this.showModal}
                      <div className="noData"><Icon type="plus" /></div>
                    )
                }
              </Col>
              <Col span={14} className="right">
                <div className="cart-list">
                  {
                    this.state.cartList.map((item,index) => {
                      return (
                        <div className="cart-item cart-itembg" key={item.title} style={{background:this.state.cartListImage[index],backgroundSize:'100% 100%'}}>
                          <div className="cart-item-content">
                            <div className="number">{item.title}</div>
                            <div className="title">{item.number}</div>
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

        {/*添加对话框 */}
        <Modal title={this.state.Modal[this.state.titleStatus]} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} className="login-form">
            <Form.Item label="模块名称">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请选择要添加的模块!' }],
              })(
                <Select placeholder="请选择要添加的模块!" allowClear={true}>
                  {
                    this.state.blockArray.map((items, index) => {
                      return (<Option key={items.id} value={items.id}>{items.name}</Option>)
                    })
                  }
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const HomeMoudleForm = Form.create()(HomeMoudle)
export default HomeMoudleForm;