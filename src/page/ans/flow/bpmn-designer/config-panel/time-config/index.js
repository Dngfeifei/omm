import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";

const { Option } = Select;

export default function TimeConfig(props) {
  const { bpmnInstance } = props;
  const [type, setType] = useState(null);
  const [value, setValue] = useState(null);
  const [instance, setInstance] = useState(null);
  const { modeling, bpmnElement = {}, moddle } = bpmnInstance;

  useEffect(() => {
    if (
      bpmnElement.businessObject &&
      bpmnElement.businessObject.eventDefinitions &&
      bpmnElement.businessObject.eventDefinitions.length
    ) {
      const info = bpmnElement.businessObject.eventDefinitions[0];
      if (info.timeDate) {
        setType("timeDate");
        setValue(info.timeDate.body);
      } else if (info.timeDuration) {
        setType("timeDuration");
        setValue(info.timeDuration.body);
      } else if (info.timeCycle) {
        setType("timeCycle");
        setValue(info.timeCycle.body);
      }

      setInstance(info);
    }
  }, [bpmnElement.businessObject]);

  function updateInstance(type, value) {
    const obj = moddle.create("bpmn:FormalExpression", {
      body: value,
    });
    modeling.updateModdleProperties(bpmnElement, instance, { [type]: obj });
  }

  function onChangeType(type) {
    setType(type);
    updateInstance(type, value);
  }

  function onChangeValue(e) {
    const value = e.target.value;
    setValue(value);
    updateInstance(type, value);
  }

  return (
    <div className="base-form">
      <div>
        <span>定时类型</span>
        <Select style={{ width: "100%" }} onChange={onChangeType} value={type}>
          <Option value="timeDate">Date(采用ISO-8601日期时间)</Option>
          <Option value="timeDuration">Duration(持续时间)</Option>
          <Option value="timeCycle">Cycle(时间周期)</Option>
        </Select>
      </div>
      <div>
        <span>值</span>
        <Input value={value} onChange={onChangeValue} />
      </div>
    </div>
  );
}
