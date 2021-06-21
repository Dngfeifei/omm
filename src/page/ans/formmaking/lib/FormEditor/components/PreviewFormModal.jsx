import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import JSONModal from '@/page/ans/formmaking/lib/FormEditor/components/JSONModal'
import styled from '@emotion/styled'
import allComps from '@/page/ans/formmaking/lib/controls';
import FormRender from '@/page/ans/formmaking/lib/FormRender'
import { cloneDeep } from 'lodash';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 46px;
  right: 0;
  bottom: 0;
  margin: 10px;
  ${({ type }) => {
    if (type === 'pc') return ``;
    return `
      margin-left: auto;
      margin-right: auto;
      width:${type === 'pad' ? '568px' : '375px'}
    `;
  }};
`;

const PreviewFormModal = ({ formData, open, onCancel }) => {

  const [localData, setLocalData] = useState(cloneDeep(formData))
  const { formModel, formConfig, deviceType } = localData
  useEffect(() => {
    setLocalData(cloneDeep(formData))
  }, [formData])

  const handleReset = () => {
    formInstance.resetFields()
    // setLocalData(cloneDeep(formData))
  }

  const [disabled, setDisabled] = useState(false)
  const toggleDisabled = () => {
    setLocalData({
      ...localData,
      formConfig: {
        ...formConfig,
        disabled: !disabled,
      }
    })
    setDisabled(!disabled)
  }

  const handleExportData = () => {
    setJson(JSON.stringify(formInstance.getFieldsValue(), null, 2))
    setIsJsonOpen(true)
  }

  const [json, setJson] = useState('')
  const [isJsonOpen, setIsJsonOpen] = useState(false)

  const [formInstance, setFormInstance] = useState()

  return (
    <div>
      <Modal
        title="预览"
        visible={open}
        onCancel={onCancel}
        width={700}
        footer={[
          <Button key="export" type="primary" onClick={handleExportData}>获取数据</Button>,
          <Button key="reset" type="outlined" onClick={handleReset}>重置</Button>,
          <Button key="disabled" type="outlined" onClick={toggleDisabled}>禁用编辑</Button>,
          <Button key="close" type="outlined" onClick={onCancel}>关闭</Button>,
        ]}
      >
        <FormRender
          getForm={(form) => setFormInstance(form)}
          formInfo={{
            source: JSON.stringify({ list: formModel, config: formConfig })
          }}
        />

      </Modal>
      {isJsonOpen ? (
        <JSONModal
          json={json}
          open={isJsonOpen}
          onCancel={() => setIsJsonOpen(false)}
        />
      ): null}


    </div>
  );
};

export default PreviewFormModal
