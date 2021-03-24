import React, { Component } from 'react'
import { Modal, message, Button, Row, Col,Icon,Card,Input , Upload,List,Empty,Spin,TreeSelect, Select,Timeline,Tooltip } from 'antd'
import ModalDom from '@/components/modal'
import { connect } from 'react-redux'
import { REMOVE_PANE,SET_WORKLIST,SET_PANE,SET_WORKSTATUS} from '/redux/action'
import PostArea from '@/components/selector/engineerSelector.jsx'
import '@/assets/less/pages/workorder.less'
// 引入首页模块组件文件
import {comObj} from "@/utils/workorder";

//引入接口
import { getOperation,getBackTask ,getTransfer,getEndorse,getUnpass,getSubmit,getProcessImg,getDeleteAttachment,getRetrieve,getFinish,getReview} from '/api/workspace'

const { TextArea } = Input;
const { Dragger } = Upload;
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;

//新增icon
const MyIcon = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_2410657_6wyd1gyezqb.js', // 在 iconfont.cn 上生成
});

function ModalSon (props){
    let Rdom = (<Select mode="multiple" dropdownStyle={{display:'none'}} placeholder="请选择人员" labelInValue allowClear onFocus={() =>{}} onChange={(selectedItems)=>props.handleChange(selectedItems,2)} value={props.modal.selectedItems} style={{ width: '87%' }} tokenSeparators={[',']}></Select>)
    let Reject = <Select placeholder="请选择流程节点" autoFocus  onChange={(selectedItems)=>props.handleChange(selectedItems,3)} style={{ width: '90%' }}>{props.modal.selecteds.map( (item)=>{return <Option key={item.taskDefKey} value={item.taskDefKey}>{item.taskName+' | '+item.userRealName}</Option>})}</Select>
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
    resetwork: state.global.resetwork,
}), dispath => ({
	setWorklist(data){dispath({ type: SET_WORKLIST,data})},
    remove(key){dispath({type: REMOVE_PANE, key})},
	setKey(key){dispath({type: SET_PANE, data: key})},
    updatePane(data){dispath({type: SET_WORKSTATUS, data: data})},
}))

//转办/加签人员选择
class workOrer extends Component {
   async componentWillMount(){
        this.stateReset = {...this.state};
        //  console.log(this.props.params.dataType)
        this.init();
        
    }
    //监控
    // componentDidCatch(error, info) {
    //     console.log(error,info)
    // }
    //初始化页面
    init = async () => {
        let {workControl,fileList,formControl,businessKey,formKey,listData,ticketId} = this.state;
        let data = await getOperation({procInstId: this.props.params.dataType.record.procInstId,taskId:this.props.params.dataType.record.taskId}) //调用接口获取页面初始化必须数据
       console.log(data)

        if(data.success != 1) {
             message.error(data.message);
             this.setState({spinning:false});
             return false;
        };
        listData = data.data.messages ? data.data.messages : [];
        businessKey = data.data['businessKey.code'] ? data.data['businessKey.code']: '';
        // formKey = data.data.formKey ? data.data.formKey : '';
        ticketId = data.data.ticketId
        workControl = {...workControl,...data.data['businessKey.permission'].consolePermission} ;//获取到回传的按钮权限
        formControl =  {...formControl,...data.data['businessKey.permission'].formPermission}; //获取工单权限
    //    workControl = {...workControl,...bussinessPermission}; 
       fileList = data.data && data.data.attrData.length ? data.data.attrData.map(item => {//获取到回传的已上传附件列表
            return {uid:item.attachId,name:item.fileName,status:'done',url:item.url}
       }) : [...fileList] ; 
       
       //获取token值，为后续上传附件设置请求头使用
       let tokenName='token',header = {};
       if(process.env.NODE_ENV == 'production'){
		    tokenName = `${process.env.ENV_NAME}_${tokenName}`
        }
        header.authorization = `Bearer ${localStorage.getItem(tokenName) || ''}`;
        //获取token值，为后续上传附件设置请求头使用

       this.setState({workControl,header,fileList,formControl,listData,businessKey,spinning:false,ticketId},()=>{  //重置状态数据
            console.log(this.state)
       })
    }
    //刷新工单列表数据
    backClick = () => {
        let nowKey = this.props.params.type,backKey = this.props.params.dataType.reset;
        let resetwork = {key: backKey, switch: !this.props.resetwork.switch};
        this.props.setWorklist(resetwork);
        // this.props.setWorklist({key:null,switch:false})
        this.props.remove(nowKey)    //关闭当前标签页
        // this.props.setKey(backKey)   //设置回到入口标签页
    }
    state = {
        swit: false,//右侧处理意见区域控制开关
        opinion: null, //处理意见,
        spinning:true,//加载效果
        header:{},//上传附件的头部信息
        businessKey:'',//储存工单组件的名称以及工单参数ID
        formKey:'',//储存工单组件的名称以及工单参数ID,优先级高
        ticketId:null,//工单当前状态是否为只读
        modal: {
            width: 700,//模态框宽度设置
            title:'',//模态框标题设置
            identification:0,//标识1，2，3,4,5分别代表加签、转办，驳回,查看流程图，提交
            modalVisible:false,//模态框打开开关
            selectedItems:[],//已选择人员，数据样例{key: "010", label: "张总"}
            selecteds:[{taskDefKey: "010", taskName: "张总"},{taskDefKey: "011", taskName: "张总"}],//历史任务节点存放
            explain:'', //说明备注,
            selected:'',//驳回选择框使用
            img:'', //图片路径,
            spinning:true,//加载效果
            imgPass: false
        },
        engineer: {    //工程师选择器弹框绑定数据
            title:'工程师选择器',
            modalVisible:false,//模态框打开开关
        },
        loading:false, //流程数据记录加载动画
        workControl: { //页面权限控制
            revoke: 1, //撤销  
            revokeName: '撤销', //撤销文字名称  
            reject: 1, //驳回 
            rejectName: '驳回', //驳回文字名称
            flowChart: 1, //查看流程图 
            flowChartName: '查看流程图', //查看流程图文字名称
            transfer: 1, //转办
            transferName: '转办', //转办文字名称
            countersign: 1, //加签
            countersignName: '加签', //加签文字名称
            engReview: 0, //二线专家复评
            engReviewName:'二线专家复评', 
            submit: 1, //提交 
            submitName: '提交', //提交文字名称
            save: 1, //保存
            saveName: '保存', //保存文字名称
            engFinish: 0, //结束
            engFinishName:'结束', 
            opinion: 1, //处理意见填写是否可操作0，不显示，1可上传删除，2仅显示不可上传删除
            upload: 1, //附件上传区是否可操作0，不显示，1可上传删除，2仅显示不可上传删除
            circulation: 1,//流转记录
            formRead: 1,   //表单权限
            opinionWarn: 0, //处理意见填写不正确提示显示否
        },
        formControl:{},  //工单内容操作权限
        fileList: [    //已伤上传附件信息数据
            // {
            //   uid: '-1',
            //   name: 'xxx.png',
            //   status: 'done',
            //   url: 'http://www.baidu.com/xxx.png',
            // },
            // {
            //     uid: '-111',
            //     name: 'xxx.png',
            //     status: 'done',
            //     url: 'http://www.baidu.com/xxx.png',
            //   }
          ],
        listData:[     //流程记录数据
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // },
            // {
            //     comment: "",
            //     date: "21-03-16",
            //     sourceUserRealName: "常二帅",
            //     taskAction: "提交申请"
            // }
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
        console.log(info)
        let fileList = [...info.fileList];

        // 1. 限制上载文件的数量
        //只显示最近上传的两个文件，旧文件将被新文件替换
        fileList = fileList.slice(-2);

        // 2.读取响应并显示文件链接
        fileList = fileList.map(file => {
        if (file.response) {
            if (file.response.success == 1) {
                file.uid = file.response.data.attachId;
                file.url = file.response.data.url;
            } else if (file.response.success == 0) {
                file.status = 'error';
            }
        }
        return file;
        });
        this.setState({ fileList });
    }
    reMove = async (file) => {
        console.log(file)
        if(file.status == 'error') return true;
        let param = {attachId:file.uid}
        let data = await getDeleteAttachment(param);
        console.log(data)
        if(data.success == 1){
            return true
        }else if (data.success == 0){
            message.error(data.message);
            return false;
        }
    }
    //重置state状态数据
    resetState = (res) => {
        if (res.success == 1) {
            this.resetFn();   //调用重置状态方法
            this.backClick();
            message.success(res.message);
        } else if (res.success == 0) {
            message.error(res.message);
        }
    }
    //重置方法
    resetFn = () => {
        const {businessKey,formKey,workControl,formControl,swit,spinning,listData} = this.state;
        this.setState({...this.stateReset,formKey,businessKey,workControl,formControl,swit,spinning,listData},()=>{
            console.log(this.state)
        })
    }
    //点击关闭弹出框
    closeModal = (modalVisible)=>{
        // const {modal,businessKey,formKey,workControl,formControl} = this.state;
        // this.setState({modal:{...modal,modalVisible}})
        // this.setState({...this.stateReset,modal:{swit:true},businessKey,formKey,workControl,formControl},()=>{
        //     console.log(this.state)
        // })
        this.resetFn();
    }
    //转办、加签、驳回打开弹出框
    openModal = async (title,identification) => {
        const {modal} = this.state;
        let selecteds = [],img = '',modalWidth = 700;
        if(identification == 3){ //判断点击为驳回按钮时获取历史流程节点数据
            let data = await getBackTask({taskId: this.props.params.dataType.record.taskId})
            console.log(data)
            selecteds = data.data;
        }else if(identification == 4){ //获取流程图
            //  let data = {key: this.props.params.type,data:{key:'100000',title:"我是更新后的标签",url:this.props.params.pathParam}};
            // this.props.updatePane(data)
            // return;
            getProcessImg({procInstId: this.props.params.dataType.record.procInstId}).then(res => {
                const {modal} = this.state;
                if(res.success == 1){
                    img = res.data;
                    this.setState({modal:{...modal,spinning:false,img}})
                }else if(res.success == 0){
                    this.setState({modal:{...modal,spinning:false,imgPass:true}})
                }
                
            })
            // console.log(data)
            // img = data.data;
            modalWidth = 1000;
        }
        this.setState({modal:{...modal,identification,modalVisible:true,title,selecteds,width:modalWidth}})
    }
     //点击弹出框确定按钮
    deterMine = (data)=>{
        const upData = this.processing();
        const {modal} = this.state;
        if(modal.identification == 1){  //加签
            getEndorse(upData).then(res=>{
                this.resetState(res);
            })
        }else if(modal.identification == 2){  //转办
            getTransfer(upData).then(res=>{
                this.resetState(res);
            })
        }else if(modal.identification == 3){ //驳回
            getUnpass(upData).then(res => {
                this.resetState(res);
            })

        }else if(modal.identification == 5){
            getReview(upData).then(res => {
                this.resetState(res);
            })
        }else{
            this.setState({modal:{...modal,modalVisible:false}})
        }
    }
    
    //弹出框选择器改变操作
    handleChange = (selected,num) => {
        console.log('onChange ', selected);
        const {modal} = this.state;
        num == 3 ? modal.selected = selected : modal.selectedItems = selected;
        this.setState({modal:{...modal}},()=>{
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
        if(this.state.workControl.formRead == 1){
           this.ref.submission();
        }else{
            this.submission(true);
        }
        
    }
    submission = (data)=>{
        if(!data) return false;
        let upData = this.processing()
        getSubmit(upData).then(res => {
            this.resetState(res);
        })
    }
    //撤销操作
    retrieve =() => {
        let upData = this.processing()
        getRetrieve(upData).then(res => {
            this.resetState(res);
        })
    }
    //结束流程
    gameOver = () => {
        let upData = this.processing()
        getFinish(upData).then(res => {
            this.resetState(res);
        })
    }
    //数据提交统一接口（审批，提交，保存，驳回。。。。。）
    processing = (data) => {
        let {opinion,modal} = this.state;
        const user_list = modal.selectedItems.map((item)=>{return Number(item.key)});
        const userId = modal.selectedItems[0] ? Number(modal.selectedItems[0].key) : '';
        return {
            taskId: this.props.params.dataType.record.taskId,//流程单ID
            taskDefKey: modal.selected,//驳回流程单选择节点ID
            comment:opinion, //处理意见
            procInstId: this.props.params.dataType.record.procInstId, //工程单id
            assigneeUserId: userId, //已选择人员信息
            userIds: user_list,
            userId
        }
    }
    render = () => {
        const { swit,workControl,listData,businessKey,formKey,spinning,ticketId} = this.state;
        const orderCompont = businessKey;
        let OrderComponent = comObj[orderCompont];
        let style = swit ? {height:'100%',paddingBottom:5} : {width:10,flex:'auto',height:'100%',paddingBottom:5},
        modalStyle = this.state.modal.identification == 4 ? {height: 500,overflowX:'auto' }:{height: 'auto'},
        params = {formRead:this.state.workControl.formRead,id: ticketId,formControl:this.state.formControl,sign:1};
        return (
            <div className='work_order' style={{height: '100%',display:'flex',flexDirection:'column'}}>
                <Spin spinning={spinning} size="large">
                <div style={{height: '100%',display:'flex',flexDirection:'column'}}>

                <Row style={{height:50}}>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{ paddingTop: 10, paddingLeft: 5, textAlign: 'left' }}>
                            {workControl.revoke ? <Button style={{ marginRight: 8 }} onClick={this.retrieve}>
                                <MyIcon type="iconchexiao" />
                                <span>撤销</span>
                            </Button> : null}
                           { workControl.reject ?<Button style={{ marginRight: 8 }} onClick={()=>this.openModal('驳回',3)}>
                               <MyIcon type="iconbohui" />
                                <span>驳回</span>
                            </Button> : null}
                            {workControl.flowChart ?<Button type="primary" onClick={()=>this.openModal('流程图查看',4)} style={{ marginRight: 8 }}>
                                <MyIcon type="iconliuchengtu" />
                                <span>查看流程图</span>
                            </Button>:null}
                        </div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <div className="button_group" style={{paddingTop:10,paddingRight:5,textAlign:'right'}}>
                            {workControl.transfer ?<Button type="primary" style={{marginRight:8}} onClick={()=>this.openModal('转办',2)}>
                                <MyIcon type="iconzhuanban_line" />
                                <span>转办</span>
                            </Button> : null}
                            {workControl.countersig ?<Button type="primary" onClick={()=>this.openModal('加签',1)} style={{marginRight:8}}>
                                <MyIcon type="iconqianjiaqian" />
                                <span>加签</span>
                            </Button>: null}
                            {workControl.submit ? <Button onClick={this.submit} type="primary" style={{marginRight:8}}>
                                <MyIcon type="icontijiao" />
                                <span>提交</span>
                            </Button> : null}
                            {workControl.engReview ?<Button type="primary" style={{marginRight:8}} onClick={()=>this.openModal('提交',5)}>
                                <MyIcon type="iconshenpi" />
                                <span>提交复评</span>
                            </Button>: null}
                            {workControl.engFinish ?<Button type="primary" style={{marginRight:8}} onClick={this.gameOver}>
                                结束
                            </Button>: null}
                            {workControl.save ?<Button type="primary" style={{marginRight:8}}>
                                <MyIcon type="iconbaocun" />
                                <span>保存</span>
                            </Button>: null}
                        </div>
                    </Col>
                </Row> 
                <Row gutter={8} type="flex" style={{flex:'auto',marginLeft:0,marginRight:0,height:10}}>
                    <Col className="gutter-row" span={this.state.swit ? 18 : null} style={style}>
                        <div className="gutter-box work" style={{height:'100%',border: '1px solid rgb(240, 242, 245)'}}>
                            {OrderComponent ? <OrderComponent setRef={ref => this.ref = ref} submission={this.submission} config={params}/> :<Empty description={JSON.stringify(params)} />}
                        </div>
                    </Col>
                    {
                        this.state.swit ? null : <div onClick={this.handleClick} style={{width:20,cursor:'pointer',height:'100%',backgroundColor:'#fafafa',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}><Icon type={ "double-left"} /><br />处<br />理<br />意<br />见</div>
                    }
                    <Col className="gutter-row" span={this.state.swit ? 6 : 0} style={{height:'100%',paddingBottom:5}}>
                        <div className="gutter-box" style={{height:'100%',overflowY:'auto',border: '1px solid rgb(240, 242, 245)'}}>
                            <div className="card_pra" style={{height:'100%'}}>
                            {workControl.opinion ? <Card size="small" title="处理意见" style={{maxHeight:'50%'}} bordered={false} extra={<Icon onClick={() => this.setState({swit: false})} type="double-right" />}>
                                <TextArea rows={4} placeholder="请输入" disabled={workControl.opinion==2?true:false} onChange={this.areaChange}/>
                                <p style={{fontSize:12,marginTop:2}}>填写内容不超过50个汉字{workControl.opinionWarn ? <span style={{color:'red',marginLeft:15}}>信息长度已超过最大显示</span> : null}</p>
                            </Card> : <Card size="small" title="处理意见" style={{maxHeight:'50%'}} bordered={false} extra={<Icon onClick={() => this.setState({swit: false})} type="double-right" />}><Empty /></Card>}
                            {workControl.upload ?
                                <Upload action="/process/uploadAttachment" disabled={workControl.upload == 1 ? false : true} className="work_upload" headers={this.state.header} onRemove={this.reMove} data={{taskId:this.props.params.dataType.record.taskId}} onChange={this.upload} multiple fileList={this.state.fileList}>
                                    <Button>
                                    <Icon type="upload" /> 请上传需要的附件
                                    </Button>
                                </Upload> : null}
                            {workControl.circulation ? <Card loading={this.state.loading} className="circulation" size="small" title="流转记录" style={{padding:0}} bodyStyle={{paddingTop: 15}} bordered={false} extra={<span style={{visibility:'hidden'}}>1</span>}>
                                {this.state.listData.length ? <Timeline>
                                    {
                                        this.state.listData.map((item,index) => {
                                            return (
                                                <Timeline.Item  key={index}>
                                                    <p>{item.sourceUserRealName + ' ' + item.taskAction + ' ' + (item.targetUserRealName ? item.targetUserRealName : '')}</p>
                                                    <p>{item.comment}</p>
                                                    <p>{item.date}</p>
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline> : <Empty />}
                                    {/* <List
                                        size="small"
                                        bordered={false}
                                        dataSource={listData}
                                        renderItem={item => <List.Item>{item}</List.Item>}
                                    /> */}
                            </Card> : null}
                            </div>
                        </div>
                    </Col>
                </Row>
                </div>
                <ModalDom className={this.state.modal.identification == 4 && 'no_footer'} bodyStyle={modalStyle} title={this.state.modal.title} width={this.state.modal.width} destroyOnClose={true} visible={this.state.modal.modalVisible} onOk={() => this.deterMine()} onCancel={() => this.closeModal(false)}>
                    {this.state.modal.identification != 4 ? <ModalSon modal={this.state.modal} setExplain={this.areaChange} plus={this.plus} handleChange={this.handleChange}/> : <div>{!this.state.modal.imgPass ? <Spin size="large" spinning={this.state.modal.spinning}><img src={'data:image/jpg;base64,'+ this.state.modal.img} alt=""/></Spin> : <Empty />}</div>}
                </ModalDom>
                {/* <ModalDom title={this.state.engineer.title}  width={700} destroyOnClose={true} visible={this.state.engineer.modalVisible}>
                   
                </ModalDom> */}
                {this.state.engineer.modalVisible ? <PostArea type={this.state.modal.identification != 1 ? 'radio' : 'checkbox'} onOk={this.postSave} onCancel={this.postClose} /> : null}
                </Spin>
            </div>
        )
    }
}
export default workOrer;