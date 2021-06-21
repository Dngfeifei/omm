import React, { useState, useEffect } from "react";
import { Input } from "antd";

/**
 *基本设置
 */
export default function BaseConfig(props) {
  const { bpmnInstance } = props;
  const [baseInfo, setBaseInfo] = useState({});
  const {
    modeling,
    bpmnElement = {},
    elementRegistry,
    bpmnFactory,
  } = bpmnInstance;

  // 读取已有配置
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const {
        id,
        name,
        documentation = [],
      } = bpmnElement.businessObject;

      if(bpmnElement.businessObject.$type.slice(5) === 'Process'){
        // 初始化id和name
        const initId = id ? id : "Process_" + new Date().getTime();
        const initName = name ? name : "流程_" + new Date().getTime();
        if (!id) {
          modeling.updateProperties(bpmnElement, {
            id: initId,
            di: { id: initId },
          });
        }
        if (!name) {
          modeling.updateProperties(bpmnElement, {name:initName});
        }
        setBaseInfo({
          id:initId,
          name:initName,
          documentation: documentation[0] && documentation[0].text,
        });
      }else{
        setBaseInfo({
          id:id,
          name:name,
          documentation: documentation[0] && documentation[0].text,
        });
      }



    }
  }, [bpmnElement.businessObject]);

  // 改变配置信息
  const baseInfoChange = (value, key) => {
    setBaseInfo({ ...baseInfo, [key]: value });
    const attrObj = Object.create(null);
    attrObj[key] = value;
    switch (key) {
      case "id":
        modeling.updateProperties(bpmnElement, {
          id: value,
          di: { id: value },
        });
        break;
      case "name":
        modeling.updateProperties(bpmnElement, attrObj);
        break;
      case "documentation":
        const element = elementRegistry.get(baseInfo.id);
        const documentation = bpmnFactory.create("bpmn:Documentation", {
          text: value,
        });
        modeling.updateProperties(element, {
          documentation: [documentation],
        });
    }
  };

  return (
      <div className="base-form">
        <div>
          <span>ID</span>
          <Input
              value={baseInfo.id}
              onChange={(e) => baseInfoChange(e.target.value, "id")}
          />
        </div>
        <div>
          <span>名称</span>
          <Input
              value={baseInfo.name}
              onChange={(e) => baseInfoChange(e.target.value, "name")}
          />
        </div>
        <div>
          <span>描述信息</span>
          <Input.TextArea
              value={baseInfo.documentation}
              onChange={(e) => baseInfoChange(e.target.value, "documentation")}
          />
        </div>
      </div>
  );
}
