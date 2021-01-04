import React, { Component } from 'react'
import { Tabs, Spin } from 'antd'
const TabPane = Tabs.TabPane
import InsuranceCityView from '/page/insurance/insuranceCityView.jsx'
import InsurancePersonView from '/page/insurance/insurancePersonView.jsx'

class InsuranceIndex extends Component{

    state = {
        active: 1,
    }


    render = _ => <div style={{padding: '0 15px', height: '100%'}}>
            <Tabs
                className={'goodTabs'}
                defaultActiveKey="1">
                <TabPane tab="按人员下载" key="1">
                    <div style={{paddingBottom: 76}}>
                        <InsurancePersonView  />
                    </div>
                </TabPane>
                <TabPane tab="按缴纳地下载" key="2">
                    <div style={{paddingBottom: 76}}>
                        <InsuranceCityView  />
                    </div>
                </TabPane>
            </Tabs>
    </div>
}

export default InsuranceIndex