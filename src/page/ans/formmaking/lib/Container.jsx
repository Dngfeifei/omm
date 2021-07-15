import React, { useEffect, useReducer, useState } from 'react';
import { Button, message } from 'antd';
import FormDesignContext, {
  initState,
  updateFormModelReducer,
  defaultInputForm,
} from './formDesignContext';
import { compatData } from '@/page/ans/formmaking/lib/utils';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import { getFormItem, saveFormSourceMakeForm } from '/api/form';
import FormElements from './FormElements';
import FormAttributes from './FormAttributes';
import FormEditor from './FormEditor';
import './theme/index.less';
import { recover } from './utils';

let inputForm = defaultInputForm;

export default ({ id, hideModal }) => {
  const [state, dispatch] = useReducer(updateFormModelReducer, initState());

  useEffect(() => {
    if (!id) {
      return;
    }
    getFormItem({ id }).then((data) => {
      inputForm = recover(defaultInputForm, data.form);
      if (inputForm.source) {
        const { list, config } = JSON.parse(inputForm.source);
        const newList = compatData(list);
        dispatch({ type: 'update:form-config', payload: config });
        dispatch({ type: 'update:form-model', payload: newList });
      }
    });
  }, []);

  const [pending, setPending] = useState(false)

  const handleSubmit = () => {
    const { formModel: list, formConfig: config } = state;
    if (pending) {
      return
    }
    if (!id) {
      console.log({ list, config });
      return;
    }
    const params = {
      ...inputForm,
      source: JSON.stringify({ list, config }),
    };
    setPending(true)

    saveFormSourceMakeForm(params).then((data) => {
      if (data && data.success) {
        message.success(data.msg);
        hideModal();
      }
      setPending(false)
    }).catch(() => setPending(false));
  };

  return (
    <FormDesignContext.Provider value={{ state, dispatch }}>
      <div className="jp-container">
        <div className="jp-container__layout">
          <div className="jp-container__layout-left">
            <FormElements />
          </div>
          <div className="jp-container__layout-center">
            <FormEditor />
          </div>
          <div className="jp-container__layout-right">
            <FormAttributes />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <Button type="primary" onClick={() => handleSubmit()}>
          确定
        </Button>
      </div>
    </FormDesignContext.Provider>
  );
};
