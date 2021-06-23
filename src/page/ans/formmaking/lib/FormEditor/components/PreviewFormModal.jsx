import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import JSONModal from '@/page/ans/formmaking/lib/FormEditor/components/JSONModal';
import styled from '@emotion/styled';
import allComps from '@/page/ans/formmaking/lib/controls';
import FormRender from '@/page/ans/formmaking/lib/FormRender';
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
  const modelRef = useRef();
  const { formModel, formConfig, deviceType } = formData;

  const [json, setJson] = useState('');
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const handleReset = () => {
    modelRef.current.resetFieldsValue();
  };

  const toggleDisabled = () => {
    modelRef.current.toggleDisabled();
  };

  const handleExportData = () => {
    const formVal = modelRef.current.getFieldsValue();
    setJson(JSON.stringify(formVal, null, 2));
    setIsJsonOpen(true);
  };

  return (
    <div>
      <Modal
        title="预览"
        visible={open}
        onCancel={onCancel}
        width={700}
        footer={[
          <Button key="export" type="primary" onClick={handleExportData}>
            获取数据
          </Button>,
          <Button key="reset" type="outlined" onClick={handleReset}>
            重置
          </Button>,
          <Button key="disabled" type="outlined" onClick={toggleDisabled}>
            禁用编辑
          </Button>,
          <Button key="close" type="outlined" onClick={onCancel}>
            关闭
          </Button>,
        ]}
      >
        <FormRender
          ref={modelRef}
          formModel={formModel}
          formConfig={formConfig}
        />
      </Modal>
      {isJsonOpen ? (
        <JSONModal
          json={json}
          open={isJsonOpen}
          onCancel={() => setIsJsonOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default PreviewFormModal;
