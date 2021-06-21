import React, { useCallback, useState, useContext, useMemo } from 'react'
import { css, cx } from '@emotion/css'
import { cloneDeep } from 'lodash'
import FormDesignContext from '@/page/ans/formmaking/lib/formDesignContext.js'
import FieldAttrSettings from "./components/FieldAttrSettings";
import FormAttrSettings from "./components/FormAttrSettings";
import ListAttrSettings from "./components/ListAttrSettings";

const ContentStyle = css`
  height: 46px;
  display: flex;
`
const TabStyle = css`
  line-height: 46px;
  flex: 1;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #eee;
`
const TabActiveStyle = css`
  border-bottom: 2px solid #409eff;
`
const AttrConStyle = css`
  padding: 10px;
`

const tabs = ['字段属性', '表单属性', '列表属性']

const FormAttributes = () => {
  const [active, setActive] = useState(0)
  const { state, dispatch } = useContext(FormDesignContext)

  const { formConfig } = state
  const config = useMemo(() => {
    return cloneDeep(formConfig)
  }, [formConfig])

  const updateConfig = useCallback((params) => {
    const payload = {
      ...config,
      ...params
    }
    dispatch({ type: 'update:form-config', payload })
  }, [dispatch])


  return <div className="jp-form-attributes-global">
    <div className={ContentStyle}>
      {tabs.map((item, index) => {
        return <div
          key={index}
          className={cx(TabStyle, index === active ? TabActiveStyle : '')}
          onClick={() => setActive(index)}
        >{item}</div>
      })}
    </div>
    <div className={AttrConStyle}>
      <div style={{ display: active === 0 ? 'block' : 'none' }}>
        <FieldAttrSettings />
      </div>
      <div style={{ display: active === 1 ? 'block' : 'none' }}>
        <FormAttrSettings config={config} updateConfig={updateConfig} />
      </div>
      <div style={{ display: active === 2 ? 'block' : 'none' }}>
        <ListAttrSettings config={config} updateConfig={updateConfig} />
      </div>
    </div>
  </div>
}

export default FormAttributes
