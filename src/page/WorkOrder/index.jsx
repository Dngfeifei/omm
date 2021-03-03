import React, { Component } from 'react'
import { Modal, message, Button, Row, Col,Icon,Card,Input , Upload,List,Empty,Spin,TreeSelect,Form, Select, Table, DatePicker, TimePicker,Tooltip } from 'antd'
import ModalDom from '@/components/modal'
import { connect } from 'react-redux'
import { REMOVE_PANE,SET_WORKLIST} from '/redux/action'
import PostArea from '@/components/selector/engineerSelector.jsx'
import '@/assets/less/pages/workorder.less'
// 引入首页模块组件文件
import {comObj} from "@/utils/workorder";

const { TextArea } = Input;
const { Dragger } = Upload;
const { SHOW_PARENT } = TreeSelect;
function ModalSon (props){
    let Rdom = (<Select mode="multiple" dropdownStyle={{display:'none'}} placeholder="请选择人员" labelInValue allowClear onFocus={() =>{}} value={props.modal.selectedItems} style={{ width: '87%' }} onChange={props.handleChange} tokenSeparators={[',']}></Select>)
    let Reject = <Select placeholder="请选择流程节点" style={{ width: '90%' }}></Select>
    return (
    <div style={{display:'flex',flexDirection:'column'}}>
        <div className="operation_area" style={{display:'flex',alignItems:'center',marginBottom:15}}>
            <span style={{width:92,display:'inline-block'}}>请选择：</span>
            {props.modal.identification == 3 ?  Reject : Rdom }
            {props.modal.identification == 3 ? null : <Icon onClick={props.plus} style={{fontSize:22,marginLeft:10}} type="plus" /> }
        </div>
        <div style={{display:'flex'}}>
            <span style={{width:100,display:'inline-block'}}>请输入说明：</span>
            <TextArea onChange={props.setExplain} rows={4} />
        </div>
    </div>
    )
}
@connect(state => ({

}), dispath => ({
	setWorklist(data){dispath({ type: SET_WORKLIST,data})}
}))

//转办/加签人员选择
class workOrer extends Component {
    componentWillMount(){
        console.log(this.props)
    }

    backClick = () => {
        let resetwork = {key: this.props.params.pKey, switch:true};
        this.props.setWorklist(resetwork);
    }
    state = {
        swit: false,//右侧处理意见区域控制开关
        opinion: null, //处理意见,
        orderCompont:'HomeMoudle', //工单组件标识
        modal: {
            width: 700,//模态框宽度设置
            title:'',//模态框标题设置
            identification:0,//标识1，2，3分别代表加签、转办，驳回
            modalVisible:false,//模态框打开开关
            selectedItems:[],//已选择人员，数据样例{key: "010", label: "张总"}
            explain:'', //说明备注
            img:'' //图片路径
        },
        engineer: {    //工程师选择器弹框绑定数据
            title:'工程师选择器',
            modalVisible:false,//模态框打开开关
        },
        loading:false, //流程数据记录加载动画
        workControl: { //页面权限控制
            revoke: true, //撤销  
            reject: true, //驳回 
            flowChart: true, //查看流程图 
            transfer: true, //转办
            countersign: true, //加签
            approval: true, //审批
            submit: true, //提交
            save: true, //保存
            Inform: true, //知会
            opinion: true, //处理意见填写是否可操作
            upload: true, //附件上传区是否可操作
            opinionWarn: false, //处理意见填写是否可操作
        },
        fileList: [    //已伤上传附件信息数据
            {
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: 'http://www.baidu.com/xxx.png',
            },
          ],
        listData:[     //流程记录数据
            '李总进行了审批',
            '张总进行了驳回的审批意见',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            '张总进行了驳回的审批意见',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            '张总进行了驳回的审批意见',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
        ]
    }
    //绑定工单子组件
    bindRef = (ref)=>{
      console.log(ref)
      this.child = ref;
    }
    //点击展开右侧处理意见区域
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
    //文件上传
    upload = (info) => {
        console.log(123)
        let fileList = [...info.fileList];

        // 1. 限制上载文件的数量
        //只显示最近上传的两个文件，旧文件将被新文件替换
        fileList = fileList.slice(-2);

        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
        if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
        }
        return file;
        });

        this.setState({ fileList });
    }

    //转办、加签、驳回打开弹出框
    openModal = (title,identification) => {
        const {modal} = this.state;
        this.setState({modal:{...modal,identification,modalVisible:true,title}})
    }
     //点击关闭弹出框
     closeModal = (modalVisible)=>{
        const {modal} = this.state;
        this.setState({modal:{...modal,modalVisible}})
    }
    //人员选择改变操作
    handleChange = (selectedItems) => {
        console.log('onChange ', selectedItems);
        const {modal} = this.state;
        this.setState({modal:{...modal,selectedItems}},()=>{
            console.log(this.state.modal)
        });
    }
    //打开工程师选择器
    plus = () => {
        const {engineer}  = this.state;
        this.setState({engineer:{...engineer, modalVisible:true}})
    }
    //修改备注
    setExplain = (e) => {
        let explain = e.target.value;
        const {modal} = this.state;
        this.setState({modal:{...modal,explain}},()=>{
            console.log(this.state.modal)
        });
    } 
    //工程师选择保存
    postSave = (resultID,result) => {
        console.log(resultID,result)
        const {modal,engineer} = this.state;
        let selectedItems = result.map((item,index)=>{
            return {key:item.id,label:item.realName}
        })
        this.setState({modal:{...modal,selectedItems},engineer:{...engineer, modalVisible:false}},()=>{
            console.log(this.state.modal)
        });
    }
    //工程师选择器关闭方法
    postClose = ()=>{
        const {engineer}  = this.state;
        this.setState({engineer:{...engineer, modalVisible:false}})
    }
    //提交点击方法
    submit = (data) => {
        this.componentRef ? this.componentRef.change() : this.ref.change()
    }
    //数据提交统一接口（审批，提交，保存，驳回。。。。。）
    processing = (data) => {
        let {opinion,modal} = this.state;
        const upData = {
            opinion, //处理意见
            selectedItems: [...modal.selectedItems], //已选择人员信息
            explain: modal.explain //备注说明
        }
    }
    render = () => {
        const { swit,workControl,listData,orderCompont } = this.state;
        let OrderComponent = comObj[orderCompont];
        let style = swit ? {height:'100%',paddingBottom:5} : {width:'auto',flex:'auto',height:'100%',paddingBottom:5}
        return (
            <div className='work_order' style={{height: '100%',display:'flex',flexDirection:'column'}}>
                <Row style={{height:50}}>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{ paddingTop: 10, paddingLeft: 5, textAlign: 'left' }}>
                            {workControl.revoke ? <Button style={{ marginRight: 8 }} onClick={this.backClick}>撤销</Button> : null}
                           { workControl.reject ?<Button style={{ marginRight: 8 }} onClick={()=>this.openModal('驳回',3)}>驳回</Button> : null}
                            {workControl.flowChart ?<Button type="primary" onClick={()=>this.openModal('流程图查看',4)} style={{ marginRight: 8 }}>
                                查看流程图
                            </Button>:null}
                        </div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{paddingTop:10,paddingRight:5,textAlign:'right'}}>
                            {workControl.flowChart ?<Button type="primary" style={{marginRight:8}} onClick={()=>this.openModal('转办',2)}>
                                <Icon type="api" />
                                <span>转办</span>
                            </Button> : null}
                            {workControl.countersign ?<Button type="primary" onClick={()=>this.openModal('加签',1)} style={{marginRight:8}}>
                                加签
                            </Button>: null}
                            {workControl.approval ?<Button type="primary" style={{marginRight:8}}>
                                审批
                            </Button>: null}
                            {workControl.submit ?<Button onClick={this.submit} type="primary" style={{marginRight:8}}>
                                提交
                            </Button>: null}
                            {workControl.Inform ?<Button type="primary" style={{marginRight:8}}>
                                知会
                            </Button>: null}
                            {workControl.save ?<Button type="primary" style={{marginRight:8}}>
                                保存
                            </Button>: null}
                        </div>
                    </Col>
                </Row> 
                <Row gutter={8} type="flex" style={{flex:'auto',marginLeft:0,marginRight:0,height:10}}>
                    <Col className="gutter-row" span={this.state.swit ? 18 : null} style={style}>
                        <div className="gutter-box" style={{height:'100%',overflow:'auto',border: '1px solid rgb(240, 242, 245)'}}>
                            {OrderComponent ? <OrderComponent wrappedComponentRef={(ref)=>this.componentRef = ref} ref={(ref)=> this.ref = ref}/> :<Empty />}
                        </div>
                    </Col>
                    {
                        this.state.swit ? null : <div onClick={this.handleClick} style={{width:20,cursor:'pointer',height:'100%',backgroundColor:'#fafafa',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}><Icon type={ "double-left"} /><br />处<br />理<br />意<br />见</div>
                    }
                    <Col className="gutter-row" span={this.state.swit ? 6 : 0} style={{height:'100%',paddingBottom:5}}>
                        <div className="gutter-box" style={{height:'100%',overflowY:'auto',border: '1px solid rgb(240, 242, 245)'}}>
                            <div className="card_pra" style={{height:'100%'}}>
                            {workControl.opinion ? <Card size="small" title="处理意见" style={{maxHeight:'50%'}} bordered={false} extra={<Icon onClick={() => this.setState({swit: false})} type="double-right" />}>
                                <TextArea rows={4} placeholder="请输入" onChange={this.areaChange}/>
                                <p style={{fontSize:12,marginTop:2}}>填写内容不超过50个汉字{workControl.opinionWarn ? <span style={{color:'red',marginLeft:15}}>信息长度已超过最大显示</span> : null}</p>
                                {workControl.countersign ?
                                <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" onChange={this.upload} multiple fileList={this.state.fileList}>
                                    <Button>
                                    <Icon type="upload" /> 请上传需要的附件
                                    </Button>
                                </Upload> : null}
                            </Card> : null}
                            {workControl.countersign ? <Card loading={this.state.loading} size="small" title="流转记录" bordered={true} extra={<span></span>}>
            
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={listData}
                                        renderItem={item => <List.Item>{item}</List.Item>}
                                    />
                            </Card> : null}
                            </div>
                        </div>
                    </Col>
                </Row>
                <ModalDom title={this.state.modal.title} width={this.state.modal.width} destroyOnClose={true} visible={this.state.modal.modalVisible} onOk={() => this.closeModal(false)} onCancel={() => this.closeModal(false)}>
                    {this.state.modal.identification != 4 ? <ModalSon modal={this.state.modal} setExplain={this.setExplain} plus={this.plus} handleChange={this.handleChange}/> : <div>{this.state.modal.img ? <img src="" alt=""/> : <Empty />}</div>}
                </ModalDom>
                {/* <ModalDom title={this.state.engineer.title}  width={700} destroyOnClose={true} visible={this.state.engineer.modalVisible}>
                   
                </ModalDom> */}
                {this.state.engineer.modalVisible ? <PostArea type={this.state.modal.identification == 2 ? 'radio' : 'checkbox'} onOk={this.postSave} onCancel={this.postClose} /> : null}
            </div>
        )
    }
}
export default workOrer;