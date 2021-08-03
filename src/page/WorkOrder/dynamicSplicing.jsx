import React, { Component } from 'react'
import {Modal, message, Button, Row, Col, Input, Select, Card, DatePicker, TimePicker, Tooltip, Tabs, Form, Spin, Empty} from 'antd'
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;
import '@/assets/less/pages/workorder.less'
import {css} from "@emotion/css";
import { connect } from 'react-redux'
import { REMOVE_PANE,SET_WORKLIST,SET_PANE,SET_WORKSTATUS} from '/redux/action'

import loadable from '@loadable/component'


import { DoAddSignAction,SaveGenerateForm,GetFormWithAuthority,SuspensionStateAction,HandleStartTask,GetFlowChart,DoStopAction,GetHistoricTaskList,QueryByDefIdAndTaskId,DoBackAction,DoAuditAction,GetBackNodes,DoTransferAction,DoDelegateAction } from '/api/initiate'
import FlowTimeLine from "@/page/WorkOrder/FlowTimeLine";
import FlowStep from "@/page/WorkOrder/FlowStep";
import TaskBackNodes from "@/page/WorkOrder/TaskBackNodes";
import FlowChart from "@/page/WorkOrder/FlowChart";
import UserSelectDialog from "@/page/WorkOrder/UserSelectDialog";
import AddSignTaskDialog from "@/page/WorkOrder/AddSignTaskDialog";
import FormRender from '@/page/ans/formmaking/lib/FormRender';
import FormDesignContenxt, {initState} from '@/page/ans/formmaking/lib/formDesignContext';
import {Assign} from "@/api/tools";




const resetCss = css`
  .ant-tabs-content {
    height: unset !important;
  }
`;


@connect(state => ({
  resetwork: state.global.resetwork,
}), dispath => ({
  setWorklist(data){dispath({ type: SET_WORKLIST,data})},
  remove(key){dispath({type: REMOVE_PANE, key})},
  setKey(key){dispath({type: SET_PANE, data: key})},
  updatePane(data){dispath({type: SET_WORKSTATUS, data: data})},
}))

class DynamicSplicingPage extends Component {

  modelRef = React.createRef();

  state = {
    Imulation: null,
    historicTaskList:null,
    buttons:{},
    loadButton: false,//加载loading
    taskBackNodesConf: {visible: false, taskId: {}},
    transferUserConf: {visible: false},
    delegateUserConf: {visible: false},
    addSignTaskConf: {visible: false},
    auditForm: {
      message: '',
      type: '',
      status: '',
      userIds: null,
      assignee: null
    },
    formModel:null
  }

  async componentWillMount () {
    console.info("this.props.params:::::::::::::::"+JSON.stringify(this.props.params))

    let record = this.props.params.dataType.record;
    if(record.formType === '2') {

      const loadSimulation = loadable((props) => import(`./` + record.formUrl))
      this.setState({Imulation: loadSimulation});

    }else{

      //获取动态表单内容和布局
      await GetFormWithAuthority({
        formUrl: record.formUrl,
        procDefKey: record.procDefId.split(":")[0],
        taskDefKey: record.taskDefKey
      }).then(data => {
        if (data.success) {
          this.setState({formModel: JSON.parse(data.form), loadButton: true});
        }
      })

    }

    if (record.status === 'start' && record.routerNum === '6') {

      this.setState({buttons:[{code: '_flow_start', name: '启动', isHide: '0'}],loadButton: true})

    } else if (record.procDefId && record.taskDefKey && record.routerNum === '0') {

      // 读取按钮 
      QueryByDefIdAndTaskId({
        processDefId: record.procDefId.split(":")[0],
        taskDefId: record.taskDefKey
      }).then(data => {
        if (data.success) {
          this.setState({buttons: data.taskDefExtension.flowButtonList, loadButton: true});
        }
      })
    }else{
      this.setState({loadButton: true});
    }


    // 读取历史任务列表
    GetHistoricTaskList({procInsId: record.procInstId}).then(data => {
      this.setState({
        historicTaskList:data.historicTaskList
      })
    })
  }


  submit = async (currentBtn, buttons) => {
    let vars = {} // 存储流程变量

    // 把当前操作对应的自定义按钮(以_flow_开头的是系统按钮，排除在外）的编码，存储为对应的流程变量，值设置为true，其余自定义按钮编码对应的流程变量值为false。
    buttons.forEach((btn) => {
      if (btn.code && !btn.code.startsWith('_flow_')) {
        vars[btn.code] = false
      }
    })

    if (currentBtn.code && !currentBtn.code.startsWith('_flow_')) {
      vars[currentBtn.code] = true
    }

    vars.title = this.props.params.dataType.record.processTitle // 标题
    vars.assignee = "" // 指定的下一步骤处理人


    await this.setState({
      auditForm: {
        type: currentBtn.code,  // 提交类型
        status: currentBtn.name // 按钮文字
      }
    })


    switch (currentBtn.code) {
      case '_flow_start': // 自动流程
        this.startProces(vars)
        break
      case '_flow_save': // 保存草稿
        this.save()
        break
      case '_flow_agree': // 同意
        this.agree()
        break
      case '_flow_reject': // 驳回
        this.reject()
        break
      case '_flow_back': // 驳回到任意步骤
        this.turnBack()
        break
      case '_flow_add_multi_instance': // 加签
        this.addMultiInstance()
        break
      case '_flow_del_multi_instance': // 减签
        this.delMultiInstance()
        break
      case '_flow_transfer': // 转办
        this.transfer()
        break
      case '_flow_delegate':// 外派
        this.delegate()
        break
      case '_flow_stop':// 终止
        this.stop()
        break
      case '_flow_print':// 打印
        this.print()
        break
      case '_flow_activation_pending':// 激活 or 挂起
        this.activationPending()
        break
      default:
        this.commit(vars) // 自定义按钮提交
    }
  }

  // 暂存草稿
  save = () => {

  }

  // 同意
  agree = (vars) => {
    this.commit(vars) // 同意
  }

  commit = (vars) =>{

    if(this.props.params.dataType.record.formUrl === "2"){ // 外置表单

      this.Imulation.saveForm((businessTable, businessId) =>{

        DoAuditAction({
          taskId: this.props.params.dataType.record.taskId,
          taskDefKey: this.props.params.dataType.record.taskDefKey,
          procInsId: this.props.params.dataType.record.procInstId,
          procDefId: this.props.params.dataType.record.procDefId,
          "vats.assignee": vars.assign,
          "vars.title": vars.title,
          // vars: vars,
          "comment.message": this.state.auditForm.message,
          "comment.type": this.state.auditForm.type,
          "comment.status": this.state.auditForm.status,
          "comment.userIds":this.state.auditForm.userIds,
          assignee: ""
        }).then( data => {
          if (data.success) {
            message.success(data.msg)

            this.goInitialPage()
          }
        })

      })
    } else { // 动态表单
    }
  }

  // 驳回
  reject = () => {

    var _this = this
    confirm({
      title: '提示',
      content: '确定驳回流程吗？',
      okText: '确定',
      okType: 'warning',
      cancelText: '取消',
      onOk() {
        GetBackNodes({taskId: _this.props.params.dataType.record.taskId,..._this.state.auditForm}).then(data => {
          let backNodes = data.backNodes
          if (backNodes.length > 0) {
            let backTaskDefKey = backNodes[backNodes.length - 1].taskDefKey
            _this.back(backTaskDefKey)
          }
        })
      }
    })



  }

  // 驳回到任意节点
  turnBack = () =>  {

    let conf = {}
    conf["taskBackNodesConf"] = {
      visible: true,
      taskId: this.props.params.dataType.record.taskId
    }
    this.setState(conf)

  }


  // 回退到任意节点
  back = (backTaskDefKey) => {

    if(backTaskDefKey !== undefined){
      DoBackAction({
        taskId: this.props.params.dataType.record.taskId,
        backTaskDefKey: backTaskDefKey,
        ...this.state.auditForm
      }).then(data => {
        if (data.success) {
          message.success(data.msg)
          this.goInitialPage()
        }
      })
    }

    let config = {}
    config.taskBackNodesConf = { visible: false, taskId: {} }
    this.setState(config)

  }

  // 加签
  addMultiInstance = () => {
    let conf = {}
    conf["addSignTaskConf"] = {
      visible: true
    }
    this.setState(conf)
  }
  // 减签
  delMultiInstance = () => {

  }

  // 转办
  transfer = () => {

    let conf = {}
    conf["transferUserConf"] = {
      visible: true
    }
    this.setState(conf)
  }

  selectUsersToTransferTask = (userId) => {

    if(userId !== undefined) {
      DoTransferAction({taskId: this.props.params.dataType.record.taskId, userId: userId}).then(data => {
        message.success(data.msg)

        this.goInitialPage()
      })
    }

    let config = {}
    config.transferUserConf = { visible: false }
    this.setState(config)
  }


  addSignTask = (params) => {

    if(params !== undefined) {

      DoAddSignAction({ taskId:this.props.params.dataType.record.taskId, 
                        userIds:params.userIds,
                        comment:params.comment, 
                        flag:params.signType
                      }).then(data => {
        message.success(data.msg)

        this.goInitialPage()
      })
      
    }

    let config = {}
    config.addSignTaskConf = { visible: false }
    this.setState(config)
  }



  // 委托
  delegate = () => {

    let conf = {}
    conf["delegateUserConf"] = {
      visible: true
    }
    this.setState(conf)
  }

  selectUsersToDelateTask = (userId) => {

    if(userId !== undefined) {

      DoDelegateAction({taskId: this.props.params.dataType.record.taskId, userId: userId}).then(data => {
        message.success(data.msg)

        this.goInitialPage()
      })
    }

    let config = {}
    config.transferUserConf = { visible: false }
    this.setState(config)
  }



  // 激活 or 挂起
  activationPending = () =>  {
    let {suspensionState} = this.props.params.dataType.record;
    let suspensionString  = "";

    if(suspensionState){
      suspensionString = "激活"
    }else {
      suspensionString = "挂起"
    }

    var _this = this
    confirm({
      title: '提示',
      content: '确定'+suspensionString+'流程吗？',
      okText: '确定',
      okType: 'warning',
      cancelText: '取消',
      onOk() {
        SuspensionStateAction({
          defId: _this.props.params.dataType.record.procDefId,
          instId: _this.props.params.dataType.record.procInstId,
          taskId: _this.props.params.dataType.record.taskId,
          operate:suspensionState,
        }).then(data => {
          message.success(data.msg)

          _this.goInitialPage()
        })
      }
    })
  }

  // 终止
  stop = () =>  {
    var _this = this
    confirm({
      title: '提示',
      content: '确定终止流程吗？',
      okText: '确定',
      okType: 'warning',
      cancelText: '取消',
      onOk() {
        DoStopAction({id: _this.props.params.dataType.record.procInstId, ..._this.state.auditForm}).then(data => {
          message.success(data.msg)

          _this.goInitialPage()
        })
      }
    })
  }

  // 打印
  print = () => {

  }

  //启动流程
  startProces = () => {

    if(this.props.params.dataType.record.formType === '2'){ // 外置表单

      //处理外置表单数据，外置表单需要有saveForm方法
      this.Imulation.saveForm((businessTable, businessId) =>{

        let params = {
          procDefKey: this.props.params.dataType.record.procDefId,
          businessTable: businessTable,
          businessId: businessId,
          title: this.props.params.dataType.record.processTitle,
        }

        HandleStartTask(params).then(data => {
          if (data.success) {
            message.success(data.msg)

            this.goInitialPage()
          }
        })
      })
    }else{  //动态表单

      const formParameter = this.modelRef.current.getFieldsValue();
      console.info("formVal",JSON.stringify(formParameter, null, 2));
      let formInner = JSON.stringify(formParameter, null, 2);

      //保存表单数据   
      SaveGenerateForm({formId:this.props.params.dataType.record.formUrl, data:formInner}).then(data => {
        if (data.success) {

          let params = {
            procDefKey: this.props.params.dataType.record.procDefId,
            title: this.props.params.dataType.record.processTitle,
            formParameter:formInner
          }

          HandleStartTask(params).then(data => {
            if (data.success) {
              message.success(data.msg)

              this.goInitialPage()
            }
          })
          
        }
      })
    }
  }

  //监控文本框的change事件
  messageChange = (e)=>{
    const newVal = e.target.value
    this.setState({auditForm:{message:newVal}})
  }



  goInitialPage = _ => {
    let resetwork = {key: backKey, switch: !this.props.resetwork.switch};
    this.props.setWorklist(resetwork);

    let nowKey = this.props.params.type,backKey = this.props.params.dataType.reset;
    this.props.remove(nowKey)    //关闭当前标签页
    this.props.setKey(backKey) //跳回到初始页面
  }


  render = _ => {

    let {Imulation,loadButton,buttons,formModel} = this.state;
    let { record } = this.props.params.dataType;

    let buttonList = [];
    if (Object.keys(buttons).length >0 && loadButton) {

      buttons.forEach((btn,index) => {

        if(btn.isHide === '0'){

          if(btn.code === '_flow_activation_pending'){
            if(record.suspensionState === true){
              buttonList.push(<Button type="primary" style={{marginRight:"10px"}} key={index} onClick={() => this.submit(btn, buttons) }>激活</Button>)
            }else if(record.suspensionState === false){
              buttonList.push(<Button type="primary" style={{marginRight:"10px"}} key={index} onClick={() => this.submit(btn, buttons) }>挂起</Button>)
            }
          }else if(btn.code !== '_flow_print'){
            buttonList.push(<Button type="primary" style={{marginRight:"10px"}} key={index} onClick={() => this.submit(btn, buttons) }>{btn.name}</Button>)
          }else if(btn.code === '_flow_print'){
            buttonList.push(<Button type="primary"  v-print="printObj" style={{marginRight:"10px"}} key={index} onClick={() => this.submit(btn, buttons)}>{btn.name}</Button>)
          }

        }
      })
    }

    return (
      <div className="jp-center">

        <Card className={resetCss}>
          <Tabs defaultActiveKey="form" type="line">
            <TabPane tab="表单信息" key="form" style={{marginTop:"10px"}}>

              {/*加载外部表单  */}
              {Imulation !== null && <Imulation onRef={c => this.Imulation = c}/>}

              {/*1417769248956145666*/}
              {formModel !== null && <FormRender
                ref={this.modelRef}
                formModel={formModel}
                formConfig={initState().formConfig}
              />
              }

            </TabPane>

            
            {record.procInstId && <TabPane tab="流程信息" key="process">
              <FlowTimeLine datas={this.state.historicTaskList}/>
            </TabPane>}


            <TabPane tab="流程图" key="chat">
             
              <FlowChart data={record.procDefId}/>
              
            </TabPane>

            {record.procInstId && <TabPane tab="流转信息" key="forth">
              <FlowStep datas={this.state.historicTaskList} />
            </TabPane>}

          </Tabs>
        </Card>

        { (record.routerNum === '6' || record.routerNum === '0' ) &&
        <Card style={{marginTop: "10px"}}>

          {!record.procInstId  && <Row>

            <label style={{justifyContent: "center", marginRight: "5px"}}>流程标题:</label>

            <Input
              value={record.processTitle}
              style={{width: 800}}
              allowClear
              placeholder="流程标题"/>
          </Row>}


          {record.taskId && <Row>

            <label style={{
              textAlign: "justify",
              display: "inline-block",
              verticalAlign: "top",
              marginRight: "5px"
            }}>审批信息:</label>

            <TextArea
              id="message"
              onChange={(e) => this.messageChange(e)}
              value={this.state.auditForm.message}
              style={{width: 800}}
              allowClear
              rows={3}
              placeholder="请输入审批意见"/>
          </Row>}

        </Card>
        }

        <div className="FlowFormFooter">

          <Spin tip="Loading..." spinning={!loadButton}/>
          {buttonList}

        </div>

        <TaskBackNodes config={this.state.taskBackNodesConf} backAction={this.back}/>
        <UserSelectDialog config={this.state.transferUserConf} transferAction={this.selectUsersToTransferTask}/>
        <UserSelectDialog config={this.state.delegateUserConf} transferAction={this.selectUsersToDelateTask}/>
        <AddSignTaskDialog config={this.state.addSignTaskConf} addSignAction={this.addSignTask}/>
      </div>
    );
  }

}

export default DynamicSplicingPage
