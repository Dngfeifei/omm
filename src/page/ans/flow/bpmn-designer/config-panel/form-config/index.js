import React, { useState, useEffect, useRef, Fragment } from "react";
import { Radio, Divider, Button, Modal, Icon, Input, Checkbox } from "antd";
import { updateElementExtensions } from "../../utils";
import AddForm from "./AddForm";
import FormTable from "./FormTable";

export default function FormConfig(props) {
  const { bpmnInstance } = props;
  const [formType, setFormType] = useState("active");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formProperty, setFormProperty] = useState([]);
  const [eventListener, setEventListener] = useState([]);
  const [selectForm, setSelectForm] = useState({});
  const [extFormUrl, setExtFormUrl] = useState("");
  const [extFormReadable, setExtFormReadable] = useState(false);

  const formRef = useRef(null);
  const { bpmnElement = {}, modeling } = bpmnInstance;
  let formList = [];

  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      if (busObj.formKey) {
        const { formKey,formType, $attrs } = busObj;
        if (formType === '2') {
          setFormType("external");
          setExtFormUrl(formKey);
          initExtUrl(formKey);
          setExtFormReadable($attrs["flowable:formReadOnly"]);
        } else {
          setFormType("active");
          const listener = [];
          const list =
            (busObj.extensionElements &&
              busObj.extensionElements.values &&
              busObj.extensionElements.values.filter((ex) => {
                if (ex.$type.indexOf("FormProperty") !== -1) {
                  return true;
                }
                listener.push(ex);
              })) ||
            [];
          setEventListener(listener);
          setFormProperty(list);
          setSelectForm({
            id: formKey,
            name: $attrs["flowable:formName"],
            version: $attrs["flowable:formVersion"],
            fields: list,
          });
        }
      }
    }
  }, [bpmnElement.businessObject]);

  const handAddModalOk = () => {
    formRef.current.validateFields((err, values) => {
      if (!err) {
        const form = formList.filter((item) => item.id === values.id)[0];

        setSelectForm(form);

        modeling.updateProperties(bpmnElement, {
          "flowable:formKey": form.id,
          "flowable:formType": form.type,
          "flowable:formName": form.name,
          "flowable:formVersion": form.version,
        });

        const property = [];
        for (const field of form.fields) {
          property.push(
            bpmnInstance.moddle.create("flowable:FormProperty", field)
          );
        }
        updateElementExtensions([...property, ...eventListener], bpmnInstance);

        setAddModalVisible(false);
      }
    });
  };

  function onChangeProperty(value, key, record, index) {
    selectForm.fields[index][key] = value;
    setSelectForm(JSON.parse(JSON.stringify(selectForm)));

    for (const item of formProperty) {
      if (item.id === record.id) {
        item[key] = value;
        break;
      }
    }
    updateElementExtensions([...formProperty, ...eventListener], bpmnInstance);
  }

  function handDeleteModalOk() {
    setSelectForm({});
    setDeleteModalVisible(false);

    modeling.updateProperties(bpmnElement, {
      "flowable:formKey": null,
      "flowable:formType": "",
      "flowable:formName": "",
      "flowable:formVersion": "",
    });
    setFormProperty([]);
    updateElementExtensions([...eventListener], bpmnInstance);
  }

  function initExtUrl(value) {
    setExtFormUrl(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formKey": value,
      "flowable:formType": 2,
      "flowable:outFormKey": value,
      "flowable:formName": "",
      "flowable:formVersion": "",
    });
  }
  
  function onChangeExtUrl(e) {
    const value = e.target.value;
    setExtFormUrl(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formKey": value,
      "flowable:formType": 2,
      "flowable:outFormKey": value,
      "flowable:formName": "",
      "flowable:formVersion": "",
    });
  }

  function onChangeExtReadable(e) {
    const value = e.target.checked;
    setExtFormReadable(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formReadOnly": value,
    });
  }

  return (
    <Fragment>
      <Radio.Group
        onChange={(e) => setFormType(e.target.value)}
        value={formType}
      >
        <Radio value="active">动态表单</Radio>
        <Radio value="external">外置表单</Radio>
      </Radio.Group>
      <Divider />

      {formType === "active" && (
        <Fragment>
          <div className="config-btn">
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={selectForm.id}
            >
              添加
            </Button>
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={!selectForm.id}
            >
              修改
            </Button>
            <Button
              type="primary"
              onClick={() => setDeleteModalVisible(true)}
              disabled={!selectForm.id}
            >
              删除
            </Button>
          </div>
          <FormTable
            data={selectForm.id ? [selectForm] : []}
            onChangeProperty={onChangeProperty}
          />
        </Fragment>
      )}

      {formType === "external" && (
        <div className="base-form">
          <div>
            <span>表单地址</span>
            <Input value={extFormUrl} onChange={onChangeExtUrl} />
          </div>
          <div>
            <span style={{ marginLeft: -16 }}>表单只读</span>
            <Checkbox
              onChange={onChangeExtReadable}
              checked={extFormReadable}
              style={{ lineHeight: "32px" }}
            >
              勾选执行此审批节点时表单不可以修改
            </Checkbox>
          </div>
        </div>
      )}

      <Modal
        title="选择动态表单"
        visible={addModalVisible}
        onOk={handAddModalOk}
        onCancel={() => setAddModalVisible(false)}
        destroyOnClose
      >
        <AddForm
          ref={formRef}
          setFormList={(list) => (formList = list)}
          selectForm={selectForm}
        />
      </Modal>
      <Modal
        title="提示"
        visible={deleteModalVisible}
        onOk={handDeleteModalOk}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <Icon
          type="exclamation-circle"
          style={{ color: "#e6a23c", transform: "scale(1.3)", marginRight: 10 }}
        />
        确认删除动态表单吗？
      </Modal>
    </Fragment>
  );
}
