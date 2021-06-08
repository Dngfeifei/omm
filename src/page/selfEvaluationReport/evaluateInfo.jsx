/***
 *  工程师自评统计报表-工程师技能评价查看-导出工程师评定结果
 * @auth yyp
*/


import React, { Component } from 'react'
import { message, Button } from 'antd'
import moment from 'moment';

// 引入 API接口
import { getAssessLeaderReport } from '/api/selfEvaluationReport'

// 引入页面CSS
// import '/assets/less/pages/logBookTable.css'

// 文件下载ip地址
let urlPrefix = ""

class AssessmentReport extends Component {

    // 挂载完成
    componentWillMount = () => {
    }

    state = {

    }

    // 导出工程师技能评价报告
    downFile = () => {
        let currentDay = moment().format('YYYYMMDD');
        let fileName = "工程师技能评价报告_" + currentDay + ".xlsx"
        const hide = message.loading('报表数据正在检索中,请耐心等待。。。', 0);
        getAssessLeaderReport().then(res => {
            if (res.success == 1) {
                message.destroy()
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = res.data + "?filename=" + fileName;
                a.click();
                document.body.removeChild(a);
            } else if (res.success == 0) {
                message.destroy()
                message.error(res.message);
            }
        })
    }

    render = _ => {
        const { h } = this.state;
        return (
            <div className="main_height" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', paddingTop: "20px" }}>
                <div>
                    <Button type="primary" onClick={this.downFile} style={{ marginLeft: "30px" }}>导出工程师评定结果</Button>
                </div>
            </div>
        )
    }

}
export default AssessmentReport



