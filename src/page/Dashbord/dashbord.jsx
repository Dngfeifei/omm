import React, { Component } from 'react'
import { Button, Modal, Input, Icon, Select, message, Row, Col } from 'antd'

// 引入CSS文件样式
import './dashbord.css'
//组件内引入
import Sortable from 'sortablejs';

// 引入首页模块组件文件
import {comObj} from "@/utils/index";

class Dashbord extends Component {

    state = {
        leftComponts:[{name:'HomeMoudle'}],
        rightComponts:[{name:'CardNotice'}]
    }

    //在dom渲染后执行初始化
    componentDidMount() {
        this.draftSort();
    }


    draftSort = () => {
        let sortableOne = Sortable.create(document.getElementById('draggerOne'), {
            group: 'shared',
            animation: 150,
            filter: ".ant-card-body",  //不会导致拖动的选择器(字符串或函数)

        })

        let sortableTwo = Sortable.create(document.getElementById('draggerTwo'), {
            group: 'shared',
            animation: 150,
            filter: ".ant-card-body",  //不会导致拖动的选择器(字符串或函数)
            setData: function (dataTransfer, dragEl) {
                console.log(dragEl)
                dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
            },
        })

    }

    render() {

        return (
            <div className="content">
                <Row gutter={20} style={{ height: '100%' }} className="content-row">
                    <Col span={13} className="left" id="draggerOne" className="content-row left">
                        {
                            this.state.leftComponts.map((item, index) => {
                                const ComItem = comObj[item.name]
                                return <ComItem key="index" />
                            })
                        }
                    </Col>
                    <Col span={11} className="right" id="draggerTwo" className="content-row right">
                        {
                            this.state.rightComponts.map((item,index)=>{
                                const ComItem=comObj[item.name]
                                return <ComItem key="index" />
                            })
                        }
                    </Col>
                </Row>
            </div>
        );
    }


}

export default Dashbord;