import React, { useMemo } from 'react'
import { Radio, Input, InputNumber, Button, Select } from 'antd'
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx'

const FormAttrSettings = ({ config, updateConfig }) => {
  const defaultClass = useMemo(() => config.customClass ? config.customClass.split(' ') : [], [config])

  return <div>
    <FormAttrItem label="表单宽度">
      <Input defaultValue={config.width} onBlur={
        e => updateConfig({ width: e.target.value })
      } allowClear />
    </FormAttrItem>

    <FormAttrItem label="标签对齐方式">
      <Radio.Group defaultValue={config.labelPosition} buttonStyle="solid" onChange={
        e => updateConfig({ labelPosition: e.target.value })
      }>
        <Radio.Button value="left">左对齐</Radio.Button>
        <Radio.Button value="right">右对齐</Radio.Button>
        <Radio.Button value="top">顶部对齐</Radio.Button>
      </Radio.Group>
    </FormAttrItem>

    <FormAttrItem label="表单标签宽度">
      <InputNumber min={0} max={200} precision={0} defaultValue={config.labelWidth} onChange={
        e => {
          let n = e || 0
          if (isNaN(n)) n = 0
          if (n > 200) n = 200
          if (n < 0) n = 0
          updateConfig({ labelWidth: n })
        }
      } />
    </FormAttrItem>

    <FormAttrItem label="组件尺寸">
      <Radio.Group defaultValue={config.size} buttonStyle="solid" onChange={
        e => updateConfig({ size: e.target.value })
      }>
        <Radio.Button value="medium">medium</Radio.Button>
        <Radio.Button value="small">small</Radio.Button>
        <Radio.Button value="mini">mini</Radio.Button>
      </Radio.Group>
    </FormAttrItem>

    <FormAttrItem label="表单样式表">
      <Button style={{ width: '100%' }}>设置</Button>
    </FormAttrItem>

    <FormAttrItem label="自定义Class">
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="请选择"
        defaultValue={defaultClass}
        onChange={
          value => updateConfig({ customClass: value.join(' ') })
        }
      >
      </Select>
    </FormAttrItem>

    <FormAttrItem label="自定义Js">
      <Input.TextArea
        rows={2}
        style={{ marginBottom: 5 }}
        defaultValue={config.customJs}
        onChange={
          e => updateConfig({ customJs: e.target.value })
        }
      />

      <Radio.Group defaultValue={config.eventType} onChange={
        e => updateConfig({ eventType: e.target.value })
      }>
        <Radio value={'1'}>保存前执行</Radio>
        <Radio value={'2'}>保存后执行</Radio>
      </Radio.Group>
    </FormAttrItem>
  </div>
}

export default FormAttrSettings