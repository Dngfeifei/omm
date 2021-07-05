import { useMemo, useContext } from 'react'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

export default function useFieldBaseProps(
  control,
  formConfig,
  isDirectValue = false,
  inTable=false,
  onChange) {
  const { options } = control;
  const { updateValue } = useContext(formRenderContext);
  const changeFn = inTable ? onChange: updateValue
  const handleChange = evt => changeFn(control.model, isDirectValue ? evt : evt.target.value)

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

