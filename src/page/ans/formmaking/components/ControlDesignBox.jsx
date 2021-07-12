import React, { useContext } from 'react';
import { Icon } from 'antd';
import { cloneDeep } from 'lodash';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import { genNonDuplicateId } from '@/page/ans/formmaking/lib/utils';
import allComps from '@/page/ans/formmaking/lib/controls';

const ControlBox = styled.div`
  position: relative;
  background-color: ${({ isHidden, isLayout }) => {
    if (isHidden) return '#fef0f0';
    if (isLayout) return 'rgba(253,246,236,.3)';
    return '#f9fcff';
  }};
  margin: 2px;
  overflow: hidden;
  min-height: 50px;
  border: ${({ isSelected, isLayout }) => {
    if (isLayout)
      return isSelected
        ? '1px solid #e6a23c'
        : '1px dashed hsla(0,0%,66.7%,.5)';

    return isSelected ? '1px solid #409eff' : '1px dashed hsla(0,0%,66.7%,.5)';
  }};
  outline: ${({ isSelected, isLayout }) => {
    if (isLayout)
      return isSelected ? '2px solid #e6a23c' : '1px solid transparent';
    return isSelected ? '2px solid #409eff' : '1px solid transparent';
  }};
  &:hover {
    background: #ecf5ff;
    background: ${({ isLayout }) => {
      if (isLayout) return '#fdf6ec';
      return '#ecf5ff';
    }};
    outline: ${({ isSelected, isLayout }) => {
      if (isLayout)
        return isSelected ? '2px solid #e6a23c' : '1px solid #e6a23c';
      return isSelected ? '2px solid #409eff' : '1px solid #409eff';
    }};
    outline-offset: 0;
  }
`;
const MaskBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

const ControlOutCss = css`
  position: relative;
`;
const ControlId = styled.div`
  position: absolute;
  top: 2px;
  right: 3px;
  font-size: 12px;
  color: #67c23a;
  z-index: 9;
  font-weight: 500;
`;
const ButtonsBox = styled.div`
  height: 28px;
  background-color: ${({ isLayout }) => (isLayout ? '#e6a23c' : '#409eff')};
  position: absolute;
  right: 0;
  bottom: 0;
  > span {
    padding: 0 5px;
    line-height: 30px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
`;
const MoveHandle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: move !important;
  line-height: 24px;
  background: #409eff;
  background: ${({ isLayout }) => (isLayout ? '#e6a23c' : '#409eff')};
  font-size: 16px;
  color: #fff;
  text-align: center;
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
`;

const ControlDesignBox = ({
  itemList,
  itemControl,
  dataIndex,
  inTable = false,
  isDesign = true,
  inReport = false,
  updateFormModel,
}) => {
  const { state, dispatch } = useContext(FormDesignContenxt);
  const { formConfig } = state;

  const isLayout = ['grid', 'tabs', 'report', 'table'].includes(itemControl.type);
  const isSelected =
    state.selectedControl && state.selectedControl.id === itemControl.id;

  const controlProps = {
    updateFormModel,
    control: itemControl,
    formConfig,
    inTable,
    isDesign,
  };


  const handleControlSelect = (e, control, index) => {
    dispatch({ type: 'update:selected-control', payload: cloneDeep(control) });
    e.stopPropagation();
  };

  const handleDeleteControl = (index) => {
    itemList.splice(index, 1);
    dispatch({ type: 'update:form-model', payload: [...state.formModel] });
    dispatch({ type: 'update:selected-control', payload: {} });
  };

  const handleCopyControl = (index) => {
    const current = cloneDeep(itemList[index]);
    current.model = current.id = `${current.type}_${genNonDuplicateId()}`;
    itemList.push(current);
    dispatch({ type: 'update:form-model', payload: [...state.formModel] });
  };

  // 添加grid布局列
  const handleAddColumn = (id) => {
    console.log(id);
  };

  //添加report 布局行
  const handleAddRow = (control) => {
    console.log('addRow:', control);
  };
  return (
    <div>
      <ControlBox
        isHidden={itemControl.options.hidden}
        isSelected={isSelected}
        isLayout={isLayout}
        onClick={(e) => handleControlSelect(e, itemControl, dataIndex)}
      >
        <div className={ControlOutCss}>
          {React.createElement(
            allComps[`${itemControl.type}-design`],
            controlProps
          )}
        </div>
        {!isLayout && <MaskBlock />}
        {!isLayout && <ControlId>{itemControl.model}</ControlId>}
        <MoveHandle
          className="formDesignDragHandle"
          isSelected={isSelected}
          isLayout={isLayout}
        >
          <Icon type="drag" />
        </MoveHandle>

        {isSelected && (
          <ButtonsBox isLayout={isLayout}>
            {itemControl.type === 'grid' && (
              <span onClick={() => handleAddColumn(itemControl.id)}>
                <Icon type="plus" />
              </span>
            )}
            {itemControl.type === 'report' && (
              <span onClick={() => handleAddRow(itemControl)}>
                <Icon type="plus" />
              </span>
            )}
            <span onClick={() => handleCopyControl(dataIndex)}>
              <Icon type="copy" />
            </span>
            <span onClick={() => handleDeleteControl(dataIndex)}>
              <Icon type="delete" />
            </span>
          </ButtonsBox>
        )}
      </ControlBox>
    </div>
  );
};

export default ControlDesignBox;
