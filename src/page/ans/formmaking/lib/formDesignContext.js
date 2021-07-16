import React from 'react';
import { cloneDeep } from 'lodash';

export const defaultInputForm = {
  id: '',
  code: '',
  autoCreate: '1',
  dataSource: {
    id: 'master',
    name: '本地数据库',
    enName: 'master',
    dbType: '',
  },
  name: '',
  tableName: '',
  source: '',
  version: '',
  remarks: '',
};

export const getDefaultSource = () => ({
  list: [],
  config: {
    labelWidth: 100,
    labelPosition: 'right',
    size: 'small',
    customClass: '',
    customStyle:'',
    customJs: '',
    eventType: '1',
    ui: 'element',
    layout: 'horizontal',
    labelCol: 3,
    actions: [],
    width: '100%',
    hideLabel: false,
    hideErrorMessage: false,
    disabled: false,
    styleSheets: '',
  },
});

export const initState = () => {
  return {
    formModel: [],
    stack: [],
    stackIndex: 0,
    selectedControl: {},
    formConfig: getDefaultSource().config,
    deviceType: 'pc',
  };
};

export const updateFormModelReducer = (state, action) => {
  switch (action.type) {
    case 'update:form-model':
      const stack = [...state.stack, action.payload]
      state = {
        ...state,
        stack,
        stackIndex: stack.length - 1,
        formModel: action.payload
      };
      break;
    case 'update:form-model-undo':
      if (state.stack.length && 0 < state.stackIndex && state.stackIndex < state.stack.length) {
        const stackIndex = state.stackIndex - 1
        state = {
          ...state,
          formModel: state.stack[stackIndex],
          stackIndex,
        };
      }
      break;
    case 'update:form-model-redo':
      if (state.stack.length && 0 <= state.stackIndex && state.stackIndex < state.stack.length - 1) {
        const stackIndex = state.stackIndex + 1
        state = {
          ...state,
          formModel: state.stack[stackIndex],
          stackIndex,
        };
      }
      break;
    case 'update:selected-control':
      state = { ...state, selectedControl: action.payload };
      break;
    case 'update:form-config':
      state = { ...state, formConfig: action.payload };
      break;
    case 'update:device-type':
      state = { ...state, deviceType: action.payload };
      break;
    default:
      break;
  }
  return { ...state };
};

const FormDesignContext = React.createContext({
  state: initState(),
  dispatch: () => {},
});

export default FormDesignContext;
