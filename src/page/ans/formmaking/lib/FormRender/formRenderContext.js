import React from 'react';
import { cloneDeep } from 'lodash';

export const initState = (formModel, formConfig) => {
  return {
    formModel: cloneDeep(formModel),
    formConfig: cloneDeep(formConfig),
  };
};

export const updateFormRenderModelReducer = (state, action) => {
  switch (action.type) {
    case 'update:form-value':
      const { field, value } = action.payload;
      const schema = state.formModel;
      const newSchema = [...schema];
      for (const item of newSchema) {
        if (item.model && item.model === field) {
          item.options.value = value;
          break;
        } else {
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (Array.isArray(item[key])) {
                newSchema.push(...item[key]);
              }
            }
          }
        }
      }
      state = {
        ...state,
        formModel: [...schema],
      };
      break;

    case 'reset:form-value':
      state = {
        ...state,
        formModel: action.payload,
      };
      break;

    case 'update:form-config':
      state = {
        ...state,
        formConfig: action.payload,
      };
      break;

    default:
      break;
  }
  return { ...state };
};

const formRenderContext = React.createContext({
  state: initState([]),
  dispatch: () => {},
  updateValue: () => {},
});

export default formRenderContext;
