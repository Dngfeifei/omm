/**
 * 表格信息--测试
 * @author jxl
*/


import React, { Component } from 'react'
import { Descriptions, Badge , Form , Input , Select , DatePicker } from 'antd'

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


// 引入日期格式化
import moment from 'moment'
// 引入页面CSS
import '/assets/less/pages/servies.less'



class servies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // 系统账号人员
            username:'',
            // 描述列表数据
            descList:[{
                label:'记录单号',
                key:'',
                render: _ => <Input />
            },{
                label:'公司名称',
                key:'',
                render: _ => <Input />
            },{
                label:'填写时间',
                key:'',
                render: _ => moment().format('YYYY-MM-DD HH:mm:ss'),   // 自动填写当前的系统日期时间
            },{
                label:'填写人',
                key:'',
                render: _ => this.state.username,
            },{
                label:'填写部门',
                key:'',
                render: _ => <Input />
            },{
                label:'项目类别',
                key:'',
                render: _ => <Input />
            },{
                label:'项目号',
                key:'',
                render: _ => <Input />
            },{
                label:'项目名称',
                key:'',
                render: _ => <Input />
            },{
                label:'服务类别',
                key:'',
                render: _ => <Input />
            },{
                label:'客户编码',
                key:'',
                render: _ => <Input />
            },{
                label:'客户名称',
                key:'',
                render: _ => <Input />
            },{
                label:'所属行业',
                key:'',
                render: _ => <Input />
            },{
                label:'客户级别',
                key:'',
                render: _ => <Input />
            },{
                label:'项目销售',
                key:'',
                render: _ => <Input />
            },{
                label:'销售联系方式',
                render: _ => <Input />
            },{
                label:'是否有项目经理负责',
                    render: _ => <Select style={{ width: 260 }} placeholder="请选择是否有项目经理负责" allowClear={true} disabled={this.state.projectID ? true : false}>
                        <Option value='1'>是</Option>
                        <Option value='0'>否</Option>
                    </Select>
            },{
                label:'项目经理',
                key:'',
                render: _ => <Input />
            },{
                label:'项目经理联系方式',
                key:'',
                render: _ => <Input />
            },{
                label:'项目开始日期',
                key:'',
                span:2,
                render: _ => <DatePicker />
            },{
                label:'项目结束日期',
                key:'',
                span:2,
                render: _ => <DatePicker />
            },{
                label:'是否续签项目',
                key:'',
                render: _ => <Select style={{ width: 260 }} placeholder="请选择是否续签项目" allowClear={true} disabled={this.state.projectID ? true : false}>
                        <Option value='1'>是</Option>
                        <Option value='0'>否</Option>
                    </Select>
            },{
                label:'续签项目号',
                key:'',
                render: _ => <Input />
            },{
                label:'续签项目名称',
                key:'',
                render: _ => <Input />
            },{
                label:'是否转包项目',
                key:'',
                span:2,
                render: _ => <Select style={{ width: 260 }} placeholder="请选择是否转包项目" allowClear={true} disabled={this.state.projectID ? true : false}>
                <Option value='1'>是</Option>
                <Option value='0'>否</Option>
            </Select>
            },{
                label:'最终客户名称',
                key:'',
                span:2,
                render: _ => <Input />
            },{
                label:'是否有团建负责',
                key:'',
                span:2,
                render: _ => <Select style={{ width: 260 }} placeholder="请选择是否有团建负责" allowClear={true} disabled={this.state.projectID ? true : false}>
                <Option value='1'>是</Option>
                <Option value='0'>否</Option>
            </Select>
            },{
                label:'团建负责人',
                key:'',
                span:2,
                render: _ => <Input />
            }],


            // 描述列表数据集合

        }
    }

    componentWillMount(){
        let name='realName';
        if (process.env.NODE_ENV == 'production') {
            name=`${process.env.ENV_NAME}_realName`
        }
        console.log(!(process.env.NODE_ENV == 'production'))
        let username = localStorage.getItem(name)
        this.setState({ username })
    }

    // 挂载完成
    componentDidMount = () => {
        this.init();
        


    }

    // 初始化接口
    init = () => {

    }






    render = _ => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="ServiesContent">
                {/* 基本信息--区域 */}
                <Descriptions bordered size='small'>
                    {
                        this.state.descList.map((item,index)=>{
                            return (
                                <Descriptions.Item label={item.label} span={item.span} key={index}>
                                   { item.render()}
                                </Descriptions.Item>
                            )
                        })
                    }
                </Descriptions>
                {/* 服务区域--区域 */}
                <div className=""></div>


                {/* 服务承诺---区域 */}
                <div className=""></div>

                
            </div>
        )
    }
}
const ServiesForm = Form.create()(servies)
export default ServiesForm