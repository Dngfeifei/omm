import React, { useContext, useState } from 'react';
import { Tooltip, Modal, Button } from 'antd';
import styled from '@emotion/styled';

import {
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import JSONModal from '@/page/ans/formmaking/lib/FormEditor/components/JSONModal'
import PreviewFormModal from '@/page/ans/formmaking/lib/FormEditor/components/PreviewFormModal'

const Container = styled.div`
  display: flex;
  height: 46px;
  border-bottom: 2px solid #eee;
  padding: 0 10px;
  background-color: #fff;
  > .bar-left {
    flex: 1;
  }
  .icon-btn {
    overflow: hidden;
    margin-top: 7px;
    display: inline-block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    color: #666;
    margin-right: 4px;
    &:hover {
      background-color: #f2f2f2;
    }
  }
  .split-line {
    width: 1px;
    height: 30px;
    margin-top: 8px;
    background-color: #ccc;
    display: inline-block;
    margin-right: 4px;
  }
  .bar-right {
    .icon-btn {
      margin-left: 10px;
      width: unset;
      font-size: 13px;
      color: #1890ff;
      &:hover {
        background-color: transparent;
        opacity: 0.8;
      }
    }
  }
`;

const activeStyle = {
  color: ' #1890ff',
  backgroundColor: '#eee',
};

const ToolsBar = () => {
  const { state, dispatch } = useContext(FormDesignContenxt);
  const { formModel, formConfig, deviceType } = state

  const [isJsonModalOpen, setIsJsonModalOpen] = React.useState(false)

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)

  const updateActive = (type) => {
    dispatch({ type: 'update:device-type', payload: type });
  };

  const handleClear = () => {
    dispatch({ type: 'update:form-model', payload: [] });
    dispatch({ type: 'update:selected-coontrol', payload: {} });
  }

  const handleUndo = () => {
    dispatch({ type: 'update:form-model-undo'});
  }
  const handleRndo = () => {
    dispatch({ type: 'update:form-model-redo' });
  }


  return (
    <Container>
      <div className="bar-left">
        <span
          className="icon-btn"
          style={deviceType === 'pc' ? activeStyle : {}}
          onClick={() => updateActive('pc')}
        >
          <DesktopOutlined />
        </span>
        <span
          className="icon-btn"
          style={deviceType === 'pad' ? activeStyle : {}}
          onClick={() => updateActive('pad')}
        >
          <TabletOutlined />
        </span>
        <span
          className="icon-btn"
          style={deviceType === 'mobile' ? activeStyle : {}}
          onClick={() => updateActive('mobile')}
        >
          <MobileOutlined />
        </span>
        <span className="split-line"></span>
        <Tooltip placement="bottom" title="撤销">
          <span className="icon-btn" onClick={handleUndo}>
            <LeftOutlined />
          </span>
        </Tooltip>
        <Tooltip placement="bottom" title="重做">
          <span className="icon-btn" onClick={handleRndo}>
            <RightOutlined />
          </span>
        </Tooltip>
      </div>
      <div className="bar-right">
        <span className="icon-btn" onClick={handleClear}>
          <DeleteOutlined /> 清空
        </span>
        <span className="icon-btn" onClick={() => setIsPreviewOpen(true)}>
          <EyeOutlined /> 预览
        </span>
        <span className="icon-btn" onClick={() => setIsJsonModalOpen(true)}>
          <FileTextOutlined /> 生成JSON
        </span>
      </div>

      {isJsonModalOpen ? (
        <JSONModal
          json={JSON.stringify({ list: state.formModel, config: state.formConfig }, null, 2)}
          open={isJsonModalOpen}
          onCancel={() => setIsJsonModalOpen(false)}
        />
      ) : null}


      <PreviewFormModal formData={{
        formModel,
        formConfig,
        deviceType,
      }} open={isPreviewOpen} onCancel={() => setIsPreviewOpen(false)}/>

    </Container>
  );
};

export default ToolsBar;
