import React, { useContext } from 'react';
import { cloneDeep } from 'lodash';
import { css } from '@emotion/css';
import FormDesignContext from '@/page/ans/formmaking/lib/formDesignContext.js';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';

const ItemCss = css`
  font-size: 12px;
  display: block;
  width: 48%;
  line-height: 26px;
  position: relative;
  float: left;
  left: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 1%;
  color: #333;
  border: 1px solid #f4f6fc;
  &:hover {
    color: #409eff;
    border: 1px dashed #409eff;
    .meta-name-box {
      color: #409eff;
    }
  }
  .meta-name-box {
    color: #333;
    display: block;
    cursor: move;
    background: #f4f6fc;
    border: 1px solid #f4f6fc;
    .icon {
      margin-right: 6px;
      margin-left: 8px;
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
`;

const DragItem = ({ meta }) => {
  const { state, dispatch } = useContext(FormDesignContext);

  const handleAddControl = () => {
    console.log(meta);
    const newFormModel = cloneDeep(state.formModel);
    const newControl = genNewCtrl(meta.type);
    newFormModel.push(newControl);
    dispatch({ type: 'update:form-model', payload: newFormModel });
    dispatch({
      type: 'update:selected-control',
      payload: cloneDeep(newControl),
    });
  };

  return (
    <div className={ItemCss} data-type={meta.type}>
      <div className="meta-name-box" onClick={handleAddControl}>
        <i className={meta.icon}></i>
        <span>{meta.name}</span>
      </div>
    </div>
  );
};

export default DragItem;
