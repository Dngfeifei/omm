import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const LinkSettings = ({ form, initialValues }) => {
  const { getFieldDecorator } = form

  useEffect(() => {
    form.setFieldsValue(initialValues)
    return () => form.setFieldsValue({})
  }, [initialValues])

  return (
    <div>
      <Form layout="horizontal">
        <Form.Item label="按钮名称" {...formItemLayout}>
          {
            getFieldDecorator('name', {
              initialValue: ''
            })(<Input placeholder="请填写按钮名称" />)
          }
        </Form.Item>

        <Form.Item label="链接" {...formItemLayout}>
          {
            getFieldDecorator('link', {
              initialValue: ''
            })(<Input placeholder="请填写链接, 外部URL请用'http://'或者'https://开头，内部路由用'/'开头" />)
          }
        </Form.Item>

        <Form.Item label="参数名" {...formItemLayout}>
          {
            getFieldDecorator('paramKey', {
              initialValue: ''
            })(<Input placeholder="请填写参数名" />)
          }
        </Form.Item>

        <Form.Item label="参数值" {...formItemLayout}>
          {
            getFieldDecorator('paramValue', {
              initialValue: ''
            })(<Input placeholder="常量可以直接传参，支持通过el表达式（例如:${row.id}) 获取数据行的属性作为动态参数" />)
          }
        </Form.Item>

        <Form.Item label="按钮显示位置" {...formItemLayout}>
          {
            getFieldDecorator('position', {
              initialValue: []
            })(
              <Checkbox.Group>
                <Checkbox value="1">工具栏</Checkbox>
                <Checkbox value="2">操作列</Checkbox>
              </Checkbox.Group>
            )
          }
        </Form.Item>

        <Form.Item label="权限标志" {...formItemLayout}>
          {
            getFieldDecorator('auth', {
              initialValue: ''
            })(<Input placeholder="如果要控制是否显示按钮，请填写权限标志，并在菜单中配置权限规则，然后在角色中进行授权。" />)
          }
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create()(LinkSettings)
