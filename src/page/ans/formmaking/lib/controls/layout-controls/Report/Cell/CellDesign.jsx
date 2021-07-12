import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { Popover, Divider } from 'antd';
import { Icon } from 'antd';
import { cloneDeep } from 'lodash';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import ColDraggable from './CellDesign/ColDraggable';

import { MutationType } from '../utils.js';


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
  border: 1px dashed transparent;
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

const OpBox = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const IconCls = css`
  width: 26px;
  height: 26px;
  color: #fff;
  background-color: #e6a23c;
  line-height: 26px;
  text-align: center;
  cursor: pointer;
`;

const OpItem = styled.div`
  font-size: 13px;
  color: ${({ disabled }) => (disabled ? '#aaa' : '666')};
  line-height: 2.2;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 2px 14px;
  &: hover {
    ${({ disabled }) =>
      disabled ? '' : ' background-color: #ecf5ff; color: #66b1ff;'}
  }
`;

const overlayCls = css`
  .ant-popover-inner-content {
    padding-left: 0;
    padding-right: 0;
  }
`;

const CellDesign = ({ column, updateControl, rowIndex, columnIndex, onOperation }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  const isSelected = useMemo(
    () => state.selectedControl && state.selectedControl.id === column.id,
    [state, column]
  );

  const handleSelect = (e) => {
    dispatch({ type: 'update:selected-control', payload: cloneDeep(column) });
    e.stopPropagation();
  };

  const handleOp = (type) => {
    onOperation(type, rowIndex, columnIndex)
  };

  return (
    <div className={ItemCls}>
      <Container isSelected={isSelected} onClick={handleSelect}>
        <div className={ContentCls}>
          <ColDraggable column={column} updateControl={updateControl} />
        </div>
        {isSelected && (
          <OpBox>
            <Popover
              overlayClassName={overlayCls}
              placement="bottomRight"
              content={
                <div>
                  <OpItem
                    disabled={false}
                    onClick={() => handleOp(MutationType.prependColumn)}
                  >
                    左插入列
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.appendColumn)}>
                    右插入列
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.prependRow)}>
                    上插入行
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.appendRow)}>
                    下插入行
                  </OpItem>

                  <Divider style={{ margin: '4px auto' }} />
                  <OpItem onClick={() => handleOp(MutationType.mergeRight)}>
                    向右合并
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.mergeDown)}>
                    向下合并
                  </OpItem>

                  <Divider style={{ margin: '4px auto' }} />
                  <OpItem onClick={() => handleOp(MutationType.splitRow)}>
                    拆分成列
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.splitColumn)}>
                    拆分成行
                  </OpItem>

                  <Divider style={{ margin: '4px auto' }} />
                  <OpItem onClick={() => handleOp(MutationType.deleteRow)}>
                    删除当前列
                  </OpItem>
                  <OpItem onClick={() => handleOp(MutationType.deleteColumn)}>
                    删除当前行
                  </OpItem>
                </div>
              }
              trigger="click"
            >
              <div className={IconCls}>
                <Icon type="table" />
              </div>
            </Popover>
          </OpBox>
        )}
      </Container>
    </div>
  );
};

export default CellDesign;
