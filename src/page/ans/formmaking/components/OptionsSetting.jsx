import React, { useEffect, useState } from 'react';
import { Input, Icon, Radio, Checkbox, Button, Select } from 'antd';
import { MenuOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { cloneDeep } from 'lodash';

import { getDictTypeList, getDictMap } from '@/api/dict'
import useDictMap from '@/page/ans/formmaking/hooks/useDictMap'
import useDictTypeList from '@/page/ans/formmaking/hooks/useDictTypeList'


const labelWrapper = css`
  margin: 5px 0 0 0;
`

const optionItem = css`
  margin: 5px 0 0 0;
  display: flex;
`
const flexItem = css`
  flex-growth: 1;
  margin: 0 5px 0 0;
`

const dragIcon = css`
  font-size: 16px;
  margin: 5px 3px 0 0;
`
const removeIcon = css`
  font-size: 16px;
  margin: 5px 3px 0 0;
  color: #F56C6C;
`

const OptionsSetting = ({
  options,
  updateOptions,
}) => {

  const dictTypeList = useDictTypeList()
  const dictMap = useDictMap()

  useEffect(() => {
    updateOptions({
      remoteFunc: 'func_' + Date.now(),
      remoteOption: 'option_' + Date.now()
    })
  }, [])


  const handlePropsChange = (key, value) => {
    updateOptions({ props: {
      ...options.props,
      [key]: value
    }})
  }

  const handleRemoteOptionChange = (e) => {
    if (options.remoteType === 'func') {
      updateOptions({ remoteFunc: e.target.value })
    } else {
      updateOptions({ remoteOption: e.target.value })
    }
  }

  const handleOptionValueChange = (index, value) => {
    const option = {
      ...options.options[index],
      value,
    }
    if (!options.showLabel) {
      option.label = value
    }

    updateOptions(options, options.options.splice(index, 1, option))
  }

  const handleOptionLabelChange = (index, label) => {
    updateOptions(options, options.options.splice(index, 1, {
      ...options.options[index],
      label,
    }))
  }

  const handleOptionRemove = (index) => {
    updateOptions(options, options.options.splice(index, 1))
  }

  return (
    <div >
      <Radio.Group defaultValue={options.remote}
        onChange={evt => updateOptions({ remote: evt.target.value })} buttonStyle="solid">
        <Radio.Button value={1}>静态数据</Radio.Button>
        <Radio.Button value={2}>动态数据</Radio.Button>
        <Radio.Button value={3}>数据字典</Radio.Button>
      </Radio.Group>
      {options.remote === 1 ? (
        <div>
          <div className={labelWrapper}>
            <Checkbox
              checked={options.showLabel}
              onChange={(e) => updateOptions({ showLabel: e.target.checked })}
            >
              是否显示标签
            </Checkbox>
          </div>

          <Radio.Group
            value={options.defaultValue}
            onChange={(e) => updateOptions({ defaultValue: e.target.value })}
          >
            {options.options.map((option, index) => {
              return (
                <div key={option.value + index} className={optionItem}>
                  <Radio value={option.value} />
                  <Input value={option.value} className={flexItem} onChange={e => handleOptionValueChange(index, e.target.value)}/>
                  {options.showLabel ? (
                    <Input value={option.label}
                      className={flexItem}
                      onChange={e => handleOptionLabelChange(index, e.target.value)}
                    />) : null}
                  <MenuOutlined className={dragIcon} />
                  <MinusCircleOutlined  className={removeIcon} onClick={() => handleOptionRemove(index)}/>
                </div>
              )
            })}
          </Radio.Group>
          <Button type="link" onClick={() => {
            updateOptions({ options: [...options.options, {
              value: 'Option' + options.options.length,
              label: 'Option' + options.options.length,
            }]});
          }}>添加选项</Button>
          <Button type="link" onClick={() => {
            updateOptions({
              defaultValue: ''
            });
          }}>重置选择</Button>

        </div>
      ): null }
      {options.remote === 2 ? (
        <div className="mt10">
          <Radio.Group
            value={options.remoteType}
            onChange={(e) => updateOptions({ remoteType: e.target.value })}
          >
            <Radio value="option">赋值变量</Radio>
            <Radio value="func">方法函数</Radio>
          </Radio.Group>
          <Input value={options.remoteType === 'func' ? options.remoteFunc : options.remoteOption} onChange={handleRemoteOptionChange} className="mt10"/>
          <Input addonBefore="值" value={options.props.value} onChange={e => handlePropsChange('value', e.target.value)} className="mt10"/>
          <Input addonBefore="标签" value={options.props.label} onChange={e => handlePropsChange('label', e.target.value)} className="mt10"/>
          <Input addonBefore="子选项" value={options.props.children} onChange={e => handlePropsChange('children', e.target.value)} className="mt10"/>
        </div>
      ): null }
      {options.remote === 3 ? (
        <div>
          <div className="mt10 mb10">字典类型：</div>
          <Select
            placeholder="请选择"
            style={{ width: 200}}
            onChange={value => updateOptions({ dictType: value })}
          >
            {dictTypeList.map(item => {
              return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
            })}
          </Select>

          <div className="mt10">
            默认值
            <div className="mt10">
              <Radio.Group
                value={options.defaultValue}
                onChange={(e) => updateOptions({ defaultValue: e.target.value })}
              >
                {dictMap[options.dictType] ? dictMap[options.dictType].map(item => {
                  return (
                    <div key={item.value}>
                      <Radio value={item.value}>{item.label}</Radio>
                    </div>
                  )
                }) : null}
              </Radio.Group>
            </div>
            <Button onClick={() => updateOptions({ defaultValue: '' })} className="mt10">清空</Button>
          </div>

        </div>
      ): null }
    </div>
  );
};

export default OptionsSetting
