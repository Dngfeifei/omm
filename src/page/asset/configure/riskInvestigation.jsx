
/***
 *    配置库配置---风险排查组件
 *   @author gl
 */
import React from 'react';
import { Table, Form, Input, Modal, message, Select, Button, Row, Popconfirm,Tooltip ,Cascader , Radio} from 'antd';

const { confirm } = Modal;
const { Option } = Select;

import {setComNode} from './assetsList.js'//获取页面渲染配置项

// 引入 API接口
import {getRiskList,getBaseData,getMinInvent} from '/api/assets.js'


// 正式服务区域---渲染
class RiskInvestigation extends React.Component {
    constructor(props) {
        console.log(props.baseData.configRisks);
        super(props)
        this.state = {
            data: props.baseData.configRisks ? [...props.baseData.configRisks] : [], //数据包
            selectedRowKeys:null,  //选中的table表格的id,
            seleLabel:[], //选择类型数据
            selectValue: undefined, //选择类型数据
            selectData:{
                rcSourceList:[]
            }
        }
        if(setComNode) setComNode('risk',this);
        if(this.props.setSon) this.props.setSon(this);
    }
    // 数据更新完成时触发的函数
    componentWillMount() {
        // console.log('风险排查加载')
        this.init()
    }
    componentWillReceiveProps(nextprops) {
        if(this.props.searchListID !== nextprops.searchListID){
            this.getInitData(nextprops);
            this.getMinInvent(nextprops.searchListID);
        }
    }
    //处理数据扁平化
    sortData = (data) => {
        if(data instanceof Array){
            data.forEach((item,index) => {
               data[index].rcId = item.riskConfigurationId,
               data[index].rcName = item.riskConfigurationName;
            })
        }
        return data;
    }
    //处理数据扁平化
    sortData2 = (data1,data2) => {
        if(data1 instanceof Array && data2 instanceof Array){
            data1.forEach((item,index) => {
                data2.forEach((item1,index1) =>{
                    if((item.riskConfigurationId == item1.rcId)){
                        data1[index] = {...item,...item1}
                    }
                })
            })
        }
        return data1;
    }
    //获取风险排查列表显示数据
    getInitData = (props,otherId) => {
        const {roleWindow,searchListID} = props;
        getRiskList({skillTypeId:searchListID,otherId:otherId ? otherId :''}).then(res => {
            if (res.success == 1) {
                let {data} = this.state;
                if(!roleWindow.roleModalType){
                     //处理数据
                    data = this.sortData(res.data);
                    console.log(data)
                }else{
                    //处理数据
                     data = this.sortData2(res.data,data);
                }
                
                this.setState({data})
            } else {
                // message.error(res.message)
            }
        })
    }
    //获取中间件等服务类型下拉数据
    getMinInvent = (id) => {
        getMinInvent(id).then(res => {
            if (res.success == 1) {
                let {seleLabel} = this.state;
                this.setState({seleLabel: res.data ? res.data : [],selectValue:undefined })
            } else {
                // message.error(res.message)
            }
        })
    }
    // 初始化
    init = (xxx) => {
        //初始化表格数据
        this.getInitData(this.props);
        this.getMinInvent(this.props.searchListID);
        //系统类别
        getBaseData({basedataTypeCode:'crSource', xxx: xxx ? xxx : ''}).then(res => {
            if (res.success == 1) {
                let {selectData} = this.state;
                selectData = Object.assign({}, selectData, { rcSourceList: res.data});
                this.setState({selectData})
            } else {
                message.error(res.message)
            }
        })
    }
    //表格表单写入
    onFormChange = (index,type,value,select,option) => {
        const {data} = this.state,item = option ? option.props.appitem : {};
        data[index][type] = value;
        if(select == 'rcSource'){
            data[index][select] = item.name
        }else if(select == 'rcValue'){
            data[index][select] = item.currentRiskName
        }
        this.setState({data})
    }
     //提交函数
    onSubmit = () => {
        const {data} = this.state;
        //校验
        for(let i of data){
            if(!i.rcId || !i.rcName){
                message.error('请检查风险排查信息是否填写正确,当前风险！');
                return false;
            }
        }
        return data;
    }
    hanldChange = (value,option) => {
        // this.setState({selectValue:value});
        this.getInitData(this.props,value);
    }
    render() {
        return (
            <div>
                {
                    this.state.seleLabel.length ? <Row gutter={24} style={{textAlign:'right',visibility:'visible',padding:'0 4px',marginRight:0}}>
                    <Select placeholder={`请选择${this.props.searchListName}`} style={{ width: 220 }} onChange={this.hanldChange}>
                        {
                             this.state.seleLabel.map((items, index) => {
                                return (<Option key={index} value={items.id}>{items.name}</Option>)
                            })
                        }
                    </Select>
                </Row> : null
                }
                <Table
                    className="jxlTable"
                    onRow={this.onRow}
                    bordered
                    rowKey={(recode,index) => index}
                    // rowSelection={rowSelectionArea}  
                    dataSource={this.state.data}
                    columns={this.props.panes.riskColumns}
                    scroll={{y:400}}
                    pagination={false}
                    size={'small'}
                    style={{marginTop:16}}
                />
            </div>
           
        )
    }

}
export default RiskInvestigation;
