import React, { useState, useRef, useEffect, Fragment } from "react";
import { Button, Modal } from "antd";
import ListenerForm from "./ListenerForm";
import SelectListenerTable from "./SelectListenerTable";
import ListenerTable from "./ListenerTable";
import { updateElementExtensions, createListenerObject } from "../../utils";

export default function ListenerConfig(props) {
  const { bpmnInstance, type = "Execution" } = props;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [eventListener, setEventListener] = useState([]);
  const [otherListener, setOtherListener] = useState([]);
  const [listenerIndex, setListenIndex] = useState(-1);
  const [record, setRecord] = useState({});
  const [selectedRow, setSelectedRow] = useState([]);
  const formRef = useRef(null);
  const { bpmnElement = {} } = bpmnInstance;

  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      const other = [];
      const event =
        (busObj.extensionElements &&
          busObj.extensionElements.values &&
          busObj.extensionElements.values.filter((ex) => {
            if (ex.$type.indexOf(type + "Listener") !== -1) {
              return true;
            }
            other.push(ex);
          })) ||
        [];
      setOtherListener(other);
      setEventListener(event);
    }
  }, [bpmnElement.businessObject]);

  const deleteListener = (index) => {
    eventListener.splice(index, 1);
    setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
    updateElementExtensions([...otherListener, ...eventListener], bpmnInstance);
  };

  const handAddModalOk = () => {
    formRef.current.validateFields((err, values) => {
      if (!err) {
        const listenerObject = createListenerObject(
          values,
          type === "Task",
          bpmnInstance
        );
        if (listenerIndex === -1) {
          eventListener.push(listenerObject);
        } else {
          eventListener.splice(listenerIndex, 1, listenerObject);
        }
        setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
        updateElementExtensions(
          [...otherListener, ...eventListener],
          bpmnInstance
        );
        setAddModalVisible(false);
        setListenIndex(-1);
        setRecord({});
        formRef.current.resetFields();
      }
    });
  };

  const handSelectModalOk = () => {
    for (const item of selectedRow) {
      let { event, valueType, value } = item;

      if(valueType === '1'){
        valueType = "class";
      }else if(valueType === '2'){
        valueType = "expression";
      }else{
        valueType = "delegateExpression";
      }
      
      const obj = {
        event: event,
        listenerType: valueType,
        [valueType]: value,
      };
      const listenerObject = createListenerObject(
        obj,
        type === "Task",
        bpmnInstance
      );
      eventListener.push(listenerObject);
      setEventListener(JSON.parse(JSON.stringify(eventListener))); // 深拷贝一下才会触发子组件ListenerTable更新
      updateElementExtensions(
        [...otherListener, ...eventListener],
        bpmnInstance
      );
      setSelectModalVisible(false);
    }
  };

  const selectListener = (selectedRow) => {
    setSelectedRow(selectedRow);
  };

  const editListener = (record, index) => {
    setAddModalVisible(true);
    setRecord(record);
    setListenIndex(index);
  };

  function handAddModalCancel() {
    setRecord({});
    setAddModalVisible(false);
  }

  return (
    <Fragment>
      <div className="config-btn">
        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          添加
        </Button>
        <Button type="primary" onClick={() => setSelectModalVisible(true)}>
          选择
        </Button>
      </div>
      <ListenerTable
        editListener={editListener}
        listener={eventListener}
        deleteListener={deleteListener}
      />
      <Modal
        title={type === "Task" ? "添加任务监听器" : "添加执行监听器"}
        visible={addModalVisible}
        onOk={handAddModalOk}
        onCancel={handAddModalCancel}
      >
        <ListenerForm ref={formRef} record={record} />
      </Modal>
      <Modal
        title="选择常用监听器"
        visible={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <SelectListenerTable selectListener={selectListener} type={type} />
      </Modal>
    </Fragment>
  );
}
