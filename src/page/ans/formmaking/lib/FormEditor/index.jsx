import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { Droppable } from 'react-beautiful-dnd';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import ToolsBar from './components/ToolsBar';
import DragControl from './components/DragControl';

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
const EditorBox = css`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
  overflow: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
`;
const EmptyText = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: #ccc;
`;

const FormEditor = () => {
  const { state } = useContext(FormDesignContenxt);
  const { deviceType } = state;

  return (
    <div>
      <ToolsBar />
      <Container type={deviceType}>
        <div className={EditorBox}>
          <DragControl formModel={state.formModel} />
          {!state.formModel.length && (
            <EmptyText>从左侧拖拽或点击来添加字段</EmptyText>
          )}
        </div>
      </Container>
    </div>
  );
};

export default FormEditor;
