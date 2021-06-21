/*
 * 调用后端接口
 */

import React, { Component } from 'react'
import {message, notification, Icon} from "antd"
import {
  SaveAndPush, FLowQueryByUserId, FLowDepartList, FLowUserList, FLowPostList,
  FLowRoleList, FLowQueryByRoleId, FLowQueryByPostId, FLowQueryByDepartId,
  FLowRestModel, FlowSaveModel, FlowTaskDefExtension, FlowNodeSetting, 
  FlowDeployModel,FlowNewModel,GetBpmnXml
} from '/api/design'
import {BiListenerList} from '/api/listener'
import {BiButtonList} from '/api/button'
import {BiConditionList} from '/api/condition'
import { Type_Script_Is, getBusinessObject } from "./utils"


/*顶部操作按钮接口*/

// 保存并发布
function saveBpmnXml(modifyXml, modelId, modeler,deployFn) {

  return new Promise((resolve) => {

    var root = modeler.get('canvas').getRootElement().businessObject;
    
    if(modelId === '' || modelId === undefined){
      
        let modelParams = {
          modelType: 0,
          key: root.id,
          name: root.name,
          description: root.documentation && root.documentation[0] && root.documentation[0].text ? root.documentation[0].text : ''
        }
        
        FlowNewModel(modelParams).then(res => {
           handleInside(modifyXml, res.id, modeler,deployFn)
        })
        
     }else{
      handleInside(modifyXml, modelId, modeler,deployFn)
    }
  });
}

function handleInside(modifyXml, modelId, modeler,deployFn){
  
  var root = modeler.get('canvas').getRootElement().businessObject;

  FLowRestModel(modelId).then(restLine => {
    console.log(restLine)
    let modelParam = {
      modeltype: 'model',
      json_xml: modifyXml,
      key: root.id,
      name: root.name,
      description: root.documentation && root.documentation[0] && root.documentation[0].text ? root.documentation[0].text : '',
      newversion: false,
      comment: '',
      lastUpdated: restLine.lastUpdated
    }

    FlowSaveModel(modelId, modelParam).then(model => {
      if (model.id) {

        saveExtension(modeler);

        if (deployFn) {
          setTimeout(function () {

            let depParams = {
              id: modelId,
              category: '未设置'
            }
            FlowDeployModel(depParams).then(res => {
              //resolve()
              message.info(res.msg)
            })
          }, 2000);
        } else {
          //resolve()
          message.info("保存草稿成功")
        }

      }
    })
  })
}

function saveExtension(modeler) {

  var root = modeler.get('canvas').getRootElement().businessObject;
  var processDefId = root.id;
  var nodeSettingList = [];
  var taskDefExtensionList = [];
  var errorMsg = [];
  root.flowElements.forEach(function (flowElement) {
    if (Type_Script_Is(flowElement, 'bpmn:UserTask') || Type_Script_Is(flowElement, 'bpmn:SequenceFlow')) {
      var taskDefId = flowElement.id;

      var flowButtonList = [];   // 处理button
      var flowAssigneeList = []; // 处理assginee
      var flowConditionList = []; // 处理condition
      
      if (flowElement.extensionElements && flowElement.extensionElements.values !== undefined) {

        flowElement.extensionElements.values.forEach(function (element) {
          if (Type_Script_Is(element, 'flowable:Button')) {
            var obj = {
              code: element.code,
              isHide: element.isHide,
              id: '',
              'taskDef.id': '',
              name: element.name,
              sort: element.sort,
              next: element.next
            };
            flowButtonList.push(obj);
          }

          if (Type_Script_Is(element, 'flowable:Assignee')) {
            var _obj = {
              type: element.type,
              value: element.value,
              id: '',
              'taskDef.id': '',
              condition: element.condition,
              sort: element.sort,
              operationType: element.operationType
            };
            flowAssigneeList.push(_obj);
          }

          if (Type_Script_Is(element, 'flowable:Condition')) {
            var _obj2 = {
              field: element.field,
              compare: element.compare,
              id: '',
              'taskDef.id': '',
              value: element.value,
              sort: element.sort,
              logic: element.logic
            };
            flowConditionList.push(_obj2);
          }
        });

        if (Type_Script_Is(flowElement, 'bpmn:UserTask')) {
          if (flowAssigneeList.length === 0) {
            errorMsg.push("节点【".concat(flowElement.name || flowElement.id, "】没有指定办理人。<br/>"));
          }

          if (flowButtonList.length === 0) {
            errorMsg.push("节点【".concat(flowElement.name || flowElement.id, "】没有配置按钮。<br/>"));
          }
        }

        if ((flowAssigneeList.length > 0 || flowConditionList.length > 0 || flowButtonList.length > 0) && taskDefId) {
          taskDefExtensionList.push({
            processDefId: processDefId,
            taskDefId: taskDefId,
            flowButtonList: flowButtonList,
            flowConditionList: flowConditionList,
            flowAssigneeList: flowAssigneeList
          });
        }
      } else {
        if (Type_Script_Is(flowElement, 'bpmn:UserTask')) {
          errorMsg.push("节点【".concat(flowElement.name || flowElement.id, "】没有指定办理人。<br/>"));
          errorMsg.push("节点【".concat(flowElement.name || flowElement.id, "】没有配置按钮。<br/>"));
        }
      }
    }

    if (Type_Script_Is(flowElement, 'bpmn:StartEvent') && !Type_Script_Is(flowElement.parent, 'bpmn:SubProcess') || Type_Script_Is(flowElement, 'bpmn:UserTask')) {
      var _taskDefId = flowElement.id;
      var bo = getBusinessObject(flowElement);
      var formReadOnly = bo.get('flowable:formReadOnly');
      var formType = bo.get('flowable:formType');

      if (!bo.get('flowable:formKey')) {
        errorMsg.push("节点【".concat(flowElement.name || flowElement.id, "】没有配置表单。<br/>"));
      }

      if (_taskDefId) {
        nodeSettingList.push({
          processDefId: processDefId,
          taskDefId: _taskDefId,
          key: 'formReadOnly',
          value: formReadOnly
        });
        nodeSettingList.push({
          processDefId: processDefId,
          taskDefId: _taskDefId,
          key: 'formType',
          value: formType
        });
      }
    }

    if (Type_Script_Is(flowElement, 'bpmn:SequenceFlow')) {
      var _taskDefId2 = flowElement.id;
      var bo = getBusinessObject(flowElement);
      var conditionType = bo.get('flowable:conditionType');

      if (conditionType) {
        nodeSettingList.push({
          processDefId: processDefId,
          taskDefId: _taskDefId2,
          key: 'conditionType',
          value: conditionType
        });
      }
    }
  });

  FlowTaskDefExtension(taskDefExtensionList).then(res => {
  })


  FlowNodeSetting(nodeSettingList).then(res => {
  })


  if (errorMsg.length > 0) {

    notification['warning']({
      message: '提示',
      description: <div dangerouslySetInnerHTML={{ __html:errorMsg.join('') }} />,
      style: {
        width: 600,
      }
    });

  }
}



// 保存草稿
function saveBpmnXmlDraft(param) {
  return new Promise((resolve) => {
    resolve();
  });
}

/*右侧属性面板接口*/
// 获取常用监听器列表
function getListenerList(param) {
  return new Promise((resolve) => {
    BiListenerList(param).then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })

  });
}

// 获取表单列表
function getFormList(param) {
  const data = [
    {
      name: "工单申请",
      version: "3",
      id: "1",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本2",
          readable: true,
          writable: true,
        },
      ],
    },
    {
      name: "工单申请2",
      version: "3",
      id: "2",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本3",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本4",
          readable: true,
          writable: true,
        },
      ],
    },
  ];
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取按钮列表
function getButtonList(param) {
  return new Promise((resolve) => {
    BiButtonList(param).then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })
  });
}

// 获取用户列表
function getUserList(param) {

  return new Promise((resolve) => {

    FLowUserList(param).then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })
  });
}

// 根据用户id获取用户信息
function getUserInfoById(param) {

  return new Promise((resolve) => {
    FLowQueryByUserId(param).then(res => {
      resolve(res.user);
    })
  });
}

// 获取角色列表
function getRoleList(param) {

  return new Promise((resolve) => {
    FLowRoleList(param).then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })
  });
}

// 根据角色id获取角色信息
function getRoleInfoById(param) {

  return new Promise((resolve) => {
    FLowQueryByRoleId(param).then(res => {
      resolve(res.role);
    })
  });
}

// 获取岗位列表
function getPostList(param) {

  return new Promise((resolve) => {
    FLowPostList(param).then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })
  });
}

// 根据id获取岗位信息
function
getPostInfoById(param) {

  return new Promise((resolve) => {
    FLowQueryByPostId(param).then(res => {
      resolve(res.post);
    })
  });
}

// 获取部门列表
function getDepartList() {
  return new Promise((resolve) => {

    FLowDepartList().then(res => {
      resolve(res.treeData[0]);
    })

  });
}

// 根据id获取部门信息
function getDepartInfoById(param) {
  return new Promise((resolve) => {
    FLowQueryByDepartId(param).then(res => {
      resolve(res.office);
    })
  });
}

// 获取流转条件表单字段
function getConditionField() {
  const data = [
    {
      name: "编码",
      id: "2323",
    },
    {
      name: "姓名",
      id: "23232",
    },
  ];
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取流程表达式
function getConditionExpress() {
  return new Promise((resolve) => {
    BiConditionList().then(res => {
      resolve({list: res.page.list, count: res.page.count});
    })
  });
}

export {
  getListenerList,
  getFormList,
  saveBpmnXml,
  saveBpmnXmlDraft,
  getButtonList,
  getDepartList,
  getUserList,
  getUserInfoById,
  getRoleInfoById,
  getRoleList,
  getDepartInfoById,
  getPostInfoById,
  getPostList,
  getConditionField,
  getConditionExpress
};
