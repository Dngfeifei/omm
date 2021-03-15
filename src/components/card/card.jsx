import React, { Component, PropTypes } from 'react'
import { Card, Menu, Dropdown, Button, Icon, Form, Modal, Select , } from 'antd'
// import { DownOutlined } from '@ant-design/icons'


class Cards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blockArray: [
                { name: '巡检管理', id: '1' },
                { name: '事件管理', id: '2' },
                { name: '用户回访管理', id: '3' },
                { name: '智能运维产品', id: '4' },
                { name: '数据采集处理任务调度平台(bridge)', id: '5' }
            ],
            visibleBlock: false, // 添加区域块---对话框状态
        }

    }

    // 挂载完成时
    componentDidMount() {


    }


    // 点击事件
    onClick = ({ key }) => {
        console.log(key)
        if (key == 'refresh') {
            this.onRefresh();
            console.log('***************     刷新当前页面     ***************')
        } else if (key == 'hidding') {

            this.onHidding();
            console.log('***************     隐藏当前页面     ***************')
        } else if (key == 'addZone') {
            console.log('***************     添加区快     ***************')
            this.showModal();
        } else if (key == 'default') {
            console.log('***************     恢复默认     ***************')
        }
    };


    // 添加区域块---事件按钮
    showModal = () => {
        this.setState({
            visibleBlock: true,
        });
    };

    //  确认--添加区域块 事件
    handleOk = e => {
        console.log(e);
        
        this.setState({
            visibleBlock: false,
        });
    };

    // 关闭添加区域块---事件按钮
    handleCancel = e => {
        console.log(e);
        this.setState({
            visibleBlock: false,
        });
    };


    // 当前用户点击某个指定卡片的刷新  事件
    onRefresh = () => {
        /* 通过父组件传进来的方法来修改数据 */
        this.props.refresh()
    }

    // 当前用户点击某个指定卡片的隐藏  事件
    onHidding = () => {
        this.props.change();
    }

    // 





    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div style={{ display: this.props.isShow === true ? 'block' : 'none' }}>
                <Card title={this.props.title} extra={<Dropdown overlay={
                    (
                        <Menu onClick={this.onClick.bind(this)}>
                            <Menu.Item key="refresh">刷新</Menu.Item>
                            <Menu.Item key="hidding">隐藏</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="addZone">添加区快</Menu.Item>
                            <Menu.Item key="default">恢复默认</Menu.Item>
                        </Menu>
                    )
                }
                ><a className="ant-dropdown-link" onClick={e => e.preventDefault()}><Icon type="dash" style={{ fontSize: '18px' }} /></a></Dropdown>} style={{ width: '100%' }}>
                    {this.props.children}
                </Card>

                {/* 添加区域块---对话框 */}
                <Modal title="添加区域块" visible={this.state.visibleBlock} onOk={this.handleOk} onCancel={this.handleCancel} >
                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 17 }}>
                        {/* {this.state.rules.map((val, index) =>
                            <Form.Item label={val.label} style={{ marginBottom: '8px' }} key={index}>
                                {getFieldDecorator(val.key, val.option)(val.render())}
                            </Form.Item>
                        )} */}
                        <Form.Item label="区块">
                            {getFieldDecorator('block', {
                                initialValue: '1',
                                rules: [{ required: true, message: '请选择添加的区块!', }],
                            })(
                                <Select placeholder="请选择添加的区块!" allowClear={true}>
                                    {
                                        this.state.blockArray.map((items, index) => {
                                            return (<Option key={items.id} value={items.id}>{items.name}</Option>)
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="位置">
                            {getFieldDecorator('position', {
                                initialValue: '0',
                                rules: [{ required: true, message: '请选择添加的区块!', }],
                            })(
                                <Select placeholder="请选择添加区块的位置！" allowClear={true}>
                                    <Option key='0' value='0'>左侧</Option>
                                    <Option key='1' value='1'>右侧</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

}

const CardsForm = Form.create()(Cards)
export default CardsForm;