import { useMemo, useContext } from 'react'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

export default function useFieldBaseProps(control, formConfig, isDirectValue = false) {
  const { options } = control;
  const { updateValue } = useContext(formRenderContext);

  const baseProps = useMemo(() => {
    return {
      disabled: formConfig.disabled || options.disabled,
      defaultValue: options.defaultValue,
      style: { width: options.width },
      placeholder: options.placeholder,
      onChange: e => { updateValue(control.model, isDirectValue ? e : e.target.value)}
    }
  }, [control, formConfig])

  return baseProps
}

