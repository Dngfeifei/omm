import { useMemo, useContext, useEffect } from 'react'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';

export default function useFieldBaseProps(
  control,
  formConfig,
  isDirectValue = false,
  inTable=false,
  onChange) {
  const { options } = control;
  const { state, updateValue, dispatch } = useContext(formRenderContext);
  console.log(state);
  const changeFn = inTable ? onChange: updateValue
  const handleChange = evt => {
    const value = isDirectValue ? evt : evt.target.value
    changeFn(control.model, value)

    if (control.options.onChange && typeof control.options.onChange === 'string') {
      window.global.value = value
      try {
        window.eval(control.options.onChange)
      } catch (e) {

      }
    }
  }

  useEffect(() => {
    if (!window.global) {
      window.global = {}
    }
    window.global.updateValue = changeFn
    window.global.updateControl = (newCtrl) => {
      state.formModel = state.formModel.map(ctrl => {
        return ctrl.id === newCtrl.id ? newCtrl : ctrl
      })
      dispatch({ type: 'update:form-model', payload: [...state.formModel] });
    }
    window.global.getControl = (ctrlId) => {
      const flatFormModel = [state.formModel];

      for (const iterator of flatFormModel) {
        for (const [index, item] of iterator.entries()) {
          if (item.id === ctrlId) {
            return iterator[index]
            break;
          }
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (Array.isArray(item[key])) flatFormModel.push(item[key]);
            }
          }
        }
      }
    }
  }, [])
  return useMemo(() => {
    return {
      disabled: formConfig.disabled || options.disabled,
      defaultValue: options.defaultValue,
      style: { width: options.width },
      placeholder: options.placeholder,
      onChange: handleChange
    }
  }, [control, formConfig])
}

