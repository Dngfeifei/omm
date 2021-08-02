import React, { useState, useEffect, useRef, Fragment } from "react";
import { Radio, Divider, Button, Modal, Icon, Input, Checkbox } from "antd";
import { updateElementExtensions } from "../../utils";
import AddForm from "./AddForm";
import FormTable from "./FormTable";
import { GetFormRenderContent } from '/api/initiate'


export default function FormConfig(props) {
  const { bpmnInstance } = props;
  const [formType, setFormType] = useState("1");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formProperty, setFormProperty] = useState([]);
  const [childField, setChildField] = useState([]);
  const [eventListener, setEventListener] = useState([]);
  const [selectForm, setSelectForm] = useState({});
  const [extFormUrl, setExtFormUrl] = useState("");
  const [extFormReadable, setExtFormReadable] = useState(false);

  const formRef = useRef(null);
  const { bpmnElement = {}, modeling,modeler } = bpmnInstance;
  let formList = [];

  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      if (busObj.formKey) {
        const { formKey, formType, $attrs, formReadOnly, id } = busObj;
        if (formKey.length !== 32 && formKey.length !== 19) {
          setFormType("2");
          setExtFormUrl(formKey);
          setExtFormReadable(formReadOnly);

          modeling.updateProperties(bpmnElement, {
            "flowable:formType": 2,
          });

          
        } else {
          setFormType("1");
          const listener = [];
          let childFieldList = []
          let mainList =
            (busObj.extensionElements &&
              busObj.extensionElements.values &&
              busObj.extensionElements.values.filter((ex) => {
                if (ex.$type.indexOf("FormProperty") !== -1) {
                  return true;
                }
                if (ex.$type.indexOf("ChildField") !== -1) {
                  childFieldList.push(ex);
                }
                listener.push(ex);
              })) ||
            [];

          mainList = mainList.map((item) => {
            item.readable = item.readable === undefined ? "true" : item.readable;
            item.writable = item.writable === undefined ? "true" : item.writable;
            return item;
          });


          childFieldList = childFieldList.map((item) => {
            item.readable = item.readable === undefined ? "true" : item.readable;
            item.writable = item.writable === undefined ? "true" : item.writable;

            return item;
          });

          mainList = mainList.map((item) => {
             item.readable = item.readable === "true";
              item.writable = item.writable === "true";
              return item;
          });

          childFieldList = childFieldList.map((item) => {
            item.readable = item.readable === "true";
            item.writable = item.writable === "true";
            return item;
          });
          
          
          
          
          setEventListener(listener);

          if(childFieldList.length > 0){
            childFieldList.map((childAtr,index) =>{
               var findLine = mainList.find((item) => item.id === childAtr.parentId);
               if(findLine){
                 
                 if(findLine.children !== undefined){
                   const index = findLine.children.findIndex((child) => child.id === childAtr.id);
                   if(index > -1){
                     return;
                   }
                 }
                
                 if(findLine.children === undefined){
                   findLine.children = new Array(childAtr);
                 }else {
                   findLine.children.push(childAtr);
                 }
               }
            })
          }

          setFormProperty(mainList);
          setChildField(childFieldList)

          GetFormRenderContent({id: formKey}).then( data =>{
            setSelectForm({
              id: formKey,
              name: data.form.name,
              version: data.form.version,
              fields: mainList,
            });
          })

          modeling.updateProperties(bpmnElement, {
            "flowable:formType": 1,
          });
          
        }
      } else {
        setFormType("1");
        setEventListener([]);
        setFormProperty([]);
        setChildField([])
        setSelectForm({});
        setExtFormUrl("");
        setExtFormReadable(false);
      }
    }
  }, [bpmnElement.businessObject]);

  const handAddModalOk = () => {
    formRef.current.validateFields((err, values) => {
      if (!err) {
        let form = formList.filter((item) => item.id === values.id)[0];

        form.fields = form.fields.map((item) => {
          item.readable = item.readable === "true";
          item.writable = item.writable === "true";
          return item;
        });
        
        setSelectForm(form);

        modeling.updateProperties(bpmnElement, {
          "flowable:formKey": form.id,
          "flowable:formType": form.type,
          "flowable:formName": form.name,
          "flowable:formVersion": form.version,
        });

        let property = [];
        let childProperty = [];
        for (const field of form.fields) {
            setChildField(childProperty)
            if(field.children !== undefined) {
              
                field.children.map(field => {
                  property.push(
                      bpmnInstance.moddle.create("flowable:ChildField", field)
                   );

                  childProperty.push(
                    bpmnInstance.moddle.create("flowable:ChildField", field)
                  );
                });
            }

          property = property.map((item) => {
            item.readable = item.readable === "true";
            item.writable = item.writable === "true";
            return item;
          });
            
            setFormProperty(property);
            
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
        item[key] = value ;
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
    setChildField([])
    updateElementExtensions([...eventListener], bpmnInstance);
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

  // 改变表单类型
  function changeFormType(e) {
    setFormType(e.target.value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formType": e.target.value,
    });
  }

  return (
    <Fragment>
      <Radio.Group onChange={changeFormType} value={formType}>
        <Radio value="1">动态表单</Radio>
        <Radio value="2">外置表单</Radio>
      </Radio.Group>
      <Divider />

      {formType.toString() === "1" && (
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

      {formType.toString() === "2" && (
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
