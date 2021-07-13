import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { Row, Col } from 'antd';
import { cloneDeep } from 'lodash';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import ColDraggable from './ColumnDesign/ColDraggable';

const ContentCls = css`
  width: 100%;
  min-height: 50px;
  border: 2px inset rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
  position: relative;
`;


const ItemCls = css`
  width: 100%;
  flex: 1 1 0;
`;


const Container = styled.div`
  flex: 1 1 auto;
  min-height: 50px;
  padding: 5px;
  position: relative;
  box-sizing: border-box;
  border: 1px dashed #999;
  ${({ isSelected }) => {
    if (isSelected)
      return `outline: 2px solid #e6a23c;
    border: 1px solid #e6a23c;
    outline-offset: -1px;`;
  }}
  overflow: hidden;
  &:hover {
    background: #fdf6ec;
    outline: 2px solid #e6a23c;
    outline-offset: -1px;
  }
`;

const ColumnDesign = ({ gridControl, column }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  console.log('ColumnDesign', column);


  const isSelected = useMemo(
    () => state.selectedControl && state.selectedControl.id === column.id,
    [state, column]
  );

  const handleSelect = (e) => {
    dispatch({ type: 'update:selected-control', payload: cloneDeep(column) });
    e.stopPropagation();
  };

  return (
    // <Row style={{ width: '100%' }}>
    <div className={ItemCls}>
      <Row>
        <Col
          span={24}
          offset={column.options.offset}
          pull={column.options.pull}
          push={column.options.push}
        >
          <Container isSelected={isSelected} onClick={handleSelect}>
            <div className={ContentCls}>
              <ColDraggable column={column} />
            </div>
          </Container>
        </Col>
      </Row>

    </div>

    // </Row>
  );
};

export default ColumnDesign;
