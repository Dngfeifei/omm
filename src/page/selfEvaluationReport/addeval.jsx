/***
 *  工程师自评统计报表-工程师技能评价查看-导出工程师评定结果
 * @auth wangxinyue
 */

 import React, { Component } from "react";
 import { message, Button, Input, Row, Col, Form, Table, Tooltip } from "antd";
 import moment from "moment";
 import Common from "/page/common.jsx";
 // 引入 API接口
 import { getAssessLeaderReport } from "/api/selfEvaluationReport";
 // 引入 API工程师自评技能报表（分页）接口
 import { GetselectAssessReportList,GetselectAssessProableReportList} from "/api/evaluateInfo.js";
 //引入新增弹出框
 import MyModal from './addeval.jsx'
 // 分页组件
 import Pagination from "@/components/pagination/index";
 import { AutoScroll } from "sortablejs";
 // 引入页面CSS
 // import '/assets/less/pages/logBookTable.css'
 
 class AssessmentReport extends Component {
   // 挂载完成
   componentDidMount = () => {
     this.init();
     this.SortTable();
     //窗口变动的时候调用
     window.addEventListener(
       "resize",
       () => {
         this.SortTable();
       },
       false
     );
   };
 
   state = {
     h: { y: 450 }, //设置表格的高度
     visible: false, // 对话框的状态
     // 分页参数
 
     total: 0, // 分页器组件 总条数
     // 此属性是适用于 表格的分页数据
     pageSize: 10,
     current: 1,
     // 此对象只是适用于分页查询
     pagination: {
       limit: 10,
       offset: 1,
     },
     loading: false, //表格加载太
     //右侧角色表格数据
     tabledata: [],
 
     //右侧角色表格配置
     columns: [
       {
         title: "序号",
         dataIndex: "key",
         editable: false,
         align: "center",
         width: "80px",
         render: (text, record, index) => `${index + 1}`,
       },
       {
         title: "姓名",
         dataIndex: "realName",
         ellipsis: {
           showTitle: false,
         },
         render: (text, record) => (
           <Tooltip placement="topLeft" title={text}>
             <a
               style={{
                 color: "#1890ff",
                 cursor: "pointer",
                 display: "block",
               }}
               onClick={() => this.previewing(record)}
             >
               {text}
             </a>
             <MyModal
                    
                    onCancel={this.onCancel}            
                    >
                </MyModal>
           </Tooltip>
         ),
       },
       {
         title: "部门",
         dataIndex: "orgFullName",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "工作经验",
         dataIndex: "experienceName",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "沟通能力",
         dataIndex: "commskillsName",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "文档编写能力",
         dataIndex: "docskillsName",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "高级证书",
         dataIndex: "certLevelPrimaryCount",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "中级证书",
         dataIndex: "certLevelIntermediateCount",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "初级证书",
         dataIndex: "certLevelSeniorCount",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "等级",
         dataIndex: "comableLevelName",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
       {
         title: "成绩",
         dataIndex: "comableFraction",
         align: "center",
         render: (text) => (
           <Tooltip placement="topLeft" title={text}>
             {text}
           </Tooltip>
         ),
       },
     ],
     // 当前点击的姓名ID
     selectedRowKeys: null,
     tableId: null,
   };
 
   init = () => {
     //请求接口GetselectAssessReportList工程师自评技能报表（分页）
     GetselectAssessProableReportList().then((res) => {
       console.log(res);
    //    if (res.success == 1) {
    //      this.setState({
    //        loading: false,
    //        tabledata: res.data.records,
    //        total: parseInt(res.data.total),
    //        limit: res.data.size,
    //        offset: (res.data.current - 1) * res.data.size,
    //      });
    //      console.log(limit,offset)
    //    } else if (res.success == 0) {
    //      message.error(res.message);
    //    }
     });
   };
 
  
   // 获取表格高度
   SortTable = () => {
     setTimeout(() => {
       let h = this.tableDom.clientHeight;
       this.setState({
         h: {
           y: h,
         },
       });
     }, 0);
   };
 

   
 
   //   // 对话框---确认
   //   handleOk = e => {
   //     console.log(e);
   //     if (this.state.visibleStatus == 'previewing') {
   //         this.setState({
   //             visible: false,
   //         });
   //     } else {
   //         this.setState({
   //             visible: false,
   //         });
   //     }
   // };
 
 
 
   // // 关闭--详情---对话框
   // handleCancel = () => {
   //     this.setState({
   //         visible: false,
   //     });
   // };
 
   searchRoleFun = (id) => {
     // 2 发起查询请求 查询后结构给table赋值
     // 选中后请求角色数据
     // let params = Object.assign({}, {
     //     roleCategoryId: id,
     // }, this.state.pageConf, { offset: 0 })
     // GetRole(params).then(res => {
     //     if (res.success == 1) {
     //         let data = Object.assign({}, this.state.table, {
     //             rolesData: res.data.records
     //         })
     //         let pagination = Object.assign({}, this.state.pagination, {
     //             total: res.data.total,
     //             pageSize: res.data.size,
     //             current: res.data.current,
     //         })
     //         let pageConf = Object.assign({}, this.state.pagination, {
     //             limit: res.data.size,
     //             offset: (res.data.current - 1) * 10,
     //         })
     //         this.setState({ table: data, pagination: pagination, pageConf: pageConf })
     //     } else {
     //         message.error(res.message)
     //     }
     // })
   };
   render = (_) => {
     const { h, selectedRowKeys } = this.state;
     <Modal
     // key={Math.random()}
     title={this.props.title}
     visible={this.props.visible}
     onOk={this.handleOk}
     onCancel={this.handleCancel}
     className="quartersbox"
  />
     return (
       <div
         className="main_height"
         style={{
           display: "flex",
           flexDirection: "column",
           flexWrap: "nowrap",
           paddingTop: "20px",
         }}
       >
         <div style={{ width: "100%", margin: "0 auto" }}>
         
        
           <div
             className="tableParson"
             style={{ flex: "auto" }}
             ref={(el) => (this.tableDom = el)}
           >
             <Table
               bordered
               rowKey={(record) => record.id}
               onRow={this.onRow}
               // rowSelection={{
               //   onChange: this.onTableSelect,
               //   selectedRowKeys: this.state.tableSelecteds,
               //   type: "radio",
               // }}
               dataSource={this.state.tabledata}
               columns={this.state.columns}
               style={{
                 marginTop: "20px",
                 zoom: "1",
                 marginTop: "16px",
                 overflowY: "Auto",
                 padding: "0 15px",
               }}
              
               pagination={false}
               scroll={h}
               size="small"
               loading={this.state.loading}
             />
             {/* <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" /> */}
             <Pagination
               total={this.state.total}
               pageSize={this.state.pagination.pageSize}
            
               current={this.state.pagination.current}
               onChange={this.onPageChange}
               onShowSizeChange={this.onShowSizeChange}
             ></Pagination>
           </div>
         </div>
       </div>
     );
   };
 }
 export default AssessmentReport;
 