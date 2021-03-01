import React, { Component } from 'react'
import { Modal, message, Button, Row, Col,Icon,Card,Input , Form, Select, Table, DatePicker, TimePicker,Tooltip } from 'antd'
import ModalDom from '@/components/modal'
import { connect } from 'react-redux'
import { REMOVE_PANE,SET_WORKLIST} from '/redux/action'

const { TextArea } = Input;
@connect(state => ({
	
}), dispath => ({
	setWorklist(data){dispath({ type: SET_WORKLIST,data})}
}))
class workOrer extends Component {
    componentWillMount(){
        console.log(this.props)
    }

    backClick = () => {
        let resetwork = {key:this.props.params.pKey,switch:true};
        this.props.setWorklist(resetwork);
    }
    state = {
        modalVisible: false,
        swit: false,
        opinion: null //处理意见
    }
    handleClick = ()=>{
        this.setState({swit: true})
    }
    //处理意见区内容绑定
    areaChange=(e)=>{
        console.log(e.target.value)
        let {opinion} = this.state;
        opinion = e.target.value;
        this.setState({opinion});
    }
    render = () => {
        const { swit } = this.state;
        let style = swit ? {height:'100%',paddingBottom:5} : {width:'auto',flex:'auto',height:'100%',paddingBottom:5}
        return (
            <div className='work_order' style={{height: '100%',display:'flex',flexDirection:'column'}}>
                <Row style={{height:50}}>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{ paddingTop: 10, paddingLeft: 5, textAlign: 'left' }}>
                            <Button style={{ marginRight: 8 }} onClick={this.backClick}>撤销</Button>
                            <Button style={{ marginRight: 8 }} onClick={this.backClick}>驳回</Button>
                            <Button type="primary" style={{ marginRight: 8 }}>
                                查看流程图
                            </Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{paddingTop:10,paddingRight:5,textAlign:'right'}}>
                            <Button type="primary" style={{marginRight:8}}>
                                <Icon type="api" />
                                <span>转办</span>
                            </Button>
                            <Button type="primary" style={{marginRight:8}}>
                                加签
                            </Button>
                            <Button type="primary" style={{marginRight:8}}>
                                审批
                            </Button>
                            <Button type="primary" style={{marginRight:8}}>
                                提交
                            </Button>
                            <Button type="primary" style={{marginRight:8}}>
                                保存
                            </Button>
                        </div>
                    </Col>
                </Row> 
                <Row gutter={8} type="flex" style={{flex:'auto',marginLeft:0,marginRight:0}}>
                    <Col className="gutter-row" span={this.state.swit ? 16 : ''} style={style}>
                        <div className="gutter-box" style={{height:'100%',overflow:'auto',border: '1px solid rgb(240, 242, 245)'}}>我是工单展示区</div>
                    </Col>
                    {
                        this.state.swit ? null : <div onClick={this.handleClick} style={{width:20,cursor:'pointer',height:'100%',backgroundColor:'#fafafa',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}><Icon type={ "double-left"} /><br />处<br />理<br />意<br />见</div>
                    }
                    <Col className="gutter-row" span={this.state.swit ? 8 : 0} style={{height:'100%',paddingBottom:5}}>
                        <div className="gutter-box" style={{height:'100%',overflowY:'auto',border: '1px solid rgb(240, 242, 245)'}}>
                            <div className="card_pra">
                            <Card size="small" title="处理意见" bordered={false} extra={<a href="#">More</a>}>
                                <TextArea rows={4} defaultValue="请填写意见" onChange={this.areaChange}/>
                                <p style={{fontSize:12,marginTop:2}}>填写内容不超过50个汉字</p>
                            </Card>
                            <Card size="small" title="流转记录" bordered={false} extra={<a href="#">More</a>}>
                                
                            </Card>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ModalDom title='头部对话框' width={700} visible={this.state.modalVisible} onOk={() => this.handleClick(false)} onCancel={() => this.handleClick(false)}>
                    <img src="" alt=""/>
                </ModalDom>
            </div>
        )
    }
}
export default workOrer;