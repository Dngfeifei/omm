import React, { useEffect, useMemo } from 'react'
import { Form, Input, Button } from 'antd'
import { css } from '@emotion/css'
import allComps from '@/page/ans/formmaking/lib/controls'

const ItemCss = css`
  margin-bottom: 18px;
`

const FormRender = ({ formInfo, getForm, form: formInstance }) => {
  console.log('formrender', formInfo);
  const { getFieldDecorator } = formInstance
  const { source = '{list:[],config:{}}' } = formInfo
  const formModel = useMemo(() => {
    const { list } = JSON.parse(source)
    return list
  }, [source])
  const formConfig = useMemo(() => {
    const { config } = JSON.parse(source)
    return config
  }, [source])

  useEffect(() => {
    getForm(formInstance)
  }, [])

  return <div>
    <Form>
      {formModel.map((item, index) => {
        return (
          <div className={ItemCss} key={item.model}>
            <Form.Item>
              {getFieldDecorator(item.model, {})(
                <div>
                  {React.createElement(allComps[`${item.type}-render`], {
                    control: item,
                    formConfig
                  })}
                </div>,
              )}
            </Form.Item>
          </div>
        )
      })}
    </Form>
  </div>
}

const WrappedForm = Form.create()(FormRender)

export default WrappedForm
