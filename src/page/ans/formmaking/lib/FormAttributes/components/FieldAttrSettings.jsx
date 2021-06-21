import React, { useContext, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { cloneDeep } from 'lodash';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import allComps from '@/page/ans/formmaking/lib/controls';

const SettingContainer = styled.div``;

const FieldAttributes = () => {
  const { state, dispatch } = useContext(FormDesignContenxt);
  const { selectedControl, formModel } = state;

  // 嵌套组件赋值  zgf...
  const updateFormModel = useCallback(
    (ctrl) => {
      const flatFormModel = [formModel];
      for (const iterator of flatFormModel) {
        for (const [index, item] of iterator.entries()) {
          if (item.id === ctrl.id) {
            iterator[index] = ctrl;
            break;
          }
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (Array.isArray(item[key])) flatFormModel.push(item[key]);
            }
          }
        }
      }
      dispatch({ type: 'update:form-model', payload: [...formModel] });
      dispatch({ type: 'update:selected-control', payload: cloneDeep(ctrl) });
    },
    [formModel]
  );

  return (
    <div>
      <SettingContainer>
        {selectedControl &&
          selectedControl.id &&
          React.createElement(allComps[`${selectedControl.type}-setting`], {
            control: selectedControl,
            updateFormModel,
          })}
      </SettingContainer>
    </div>
  );
};

export default FieldAttributes;
