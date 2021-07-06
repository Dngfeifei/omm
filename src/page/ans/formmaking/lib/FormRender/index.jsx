import React, {
  useEffect,
  useMemo,
  useReducer,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Form, Input, Button } from 'antd';
import { css } from '@emotion/css';
import FormRenderContext, {
  initState,
  updateFormRenderModelReducer,
} from './formRenderContext';
import allComps from '@/page/ans/formmaking/lib/controls';

const ItemCss = css`
  margin-bottom: 18px;
`;

const FormContent = ({ state, form }) => {
  const { getFieldDecorator } = form;

  return (
    <Form>
      {state.formModel.map((item, index) => {
        return (
          <div className={ItemCss} key={item.model}>
            <Form.Item>
              {getFieldDecorator(
                item.model,
                {}
              )(
                <div>
                  {React.createElement(allComps[`${item.type}-render`], {
                    control: item,
                    formConfig: state.formConfig,
                    form,
                  })}
                </div>
              )}
            </Form.Item>
          </div>
        );
      })}
    </Form>
  );
};
const WrappedForm = Form.create()(FormContent);

const FormRender = forwardRef(({ formModel, formConfig }, ref) => {
  const [state, dispatch] = useReducer(
    updateFormRenderModelReducer,
    initState(formModel, formConfig)
  );

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => {
      const formValues = {};
      state.formModel.forEach((item) => {
        formValues[item.model] = item.options.value;
        if (item.type === 'grid') {
          item.columns.forEach((column) => {
            column.list.forEach((t) => {
              formValues[t.model] = t.options.value || '';
            });
          });
        }
        if (item.type === 'tabs') {
          item.tabs.forEach((column) => {
            column.list.forEach((t) => {
              formValues[t.model] = t.options.value || '';
            });
          });
        }
      });
      return formValues;
    },

    resetFieldsValue: () => {
      dispatch({ type: 'reset:form-value', payload: formModel });
    },

    toggleDisabled: () => {
      const { disabled } = state.formConfig;
      dispatch({
        type: 'update:form-config',
        payload: { ...formConfig, disabled: !disabled },
      });
    },
  }));

  const updateValue = (field, value) => {
    dispatch({ type: 'update:form-value', payload: { field, value } });
  };

  return (
    <div>
      <FormRenderContext.Provider value={{ state, dispatch, updateValue }}>
        <WrappedForm state={state} />
      </FormRenderContext.Provider>
    </div>
  );
});

export default FormRender;
