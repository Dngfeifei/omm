import React, { Component } from 'react'
import {Row,Col,Checkbox,Empty   } from 'antd'
const assetsList = (props) => {
    let childrens = [];
    if(props.dataSource.length){
        props.dataSource.forEach((element,index) => {
            childrens.push(
                <div className="flex" style={{height:100,border:'1px solid black',marginBottom:15,border:'1px solid #e8e8e8'}} key={index}>
                    <Checkbox style={{margin:'0 10px'}} />
                    <p className="flex" style={{width:80,height:'80%',backgroundColor:'red',margin:'auto 0',justifyContent:'center'}}>1级</p>
                    <Row gutter={[5, 5]} style={{flex:'auto'}}>
                        <Col span={8}>序列号：0140617862</Col>
                        <Col span={8}>设备型号：16口串口管理设备ACS16</Col>
                        <Col span={8}>服务大区：服务交付华南大区</Col>
                        <Col span={16}>项目名称：(201051812343)中国移动通信集团福建有限公司第三方维保</Col>
                        <Col span={8}>省份：福建省 </Col>
                        <Col span={16}>客户名称：中国移动通信集团福建有限公司</Col>
                        <Col span={8}>项目经理：金枫</Col>
                    </Row>
                </div>,
            )
        });
    }else{
        childrens = <Empty />
    }
    return childrens;
}
export default assetsList;