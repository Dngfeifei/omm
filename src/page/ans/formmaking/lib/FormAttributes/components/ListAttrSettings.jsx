import React, { useState, useRef, useEffect } from 'react'
import { Button, Checkbox, Modal, Icon } from 'antd'
import { css } from '@emotion/css'
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx'
import LinkSettings from './LinkSettings'

const MenuIconSpan = css`
  font-size: 16px;
`
const NameSpan = css`
  padding: 0 10px;
`

const EditIconSpan = css`
  display: inline-block;
  width: 22px;
  height: 22px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  color: #409EFF;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 50%;
`

const MinusIconSpan = css`
  display: inline-block;
  width: 22px;
  height: 22px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  color: #F56C6C;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 50%;
  margin-left: 10px;
`

let editIndex = undefined

const ListAttrSettings = ({ config, updateConfig }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = useRef()
  const [actions, setActions] = useState([])
  const [initialValues, setInitialValues] = useState({})

  const handleShowModal = () => {
    editIndex = undefined
    setIsModalVisible(true)
  }

  const handleOk = () => {
    const action = formRef.current.getFieldsValue()
    let newActions = [...actions]
    if (editIndex === undefined) {
      newActions.push(action)
    } else {
      newActions.splice(editIndex, 1, action)
    }
    updateConfig({ actions: newActions })
    setIsModalVisible(false)
  }

  const handleAfterClose = () => {
    editIndex = undefined
    setInitialValues({})
  }

  useEffect(() => {
    setActions(config.actions)
  }, [config])

  return <div>
    <FormAttrItem label="列属性 (字段)">
      <Checkbox.Group defaultValue={['a', 'b', 'c']} onChange={e => console.log(e)}>
        <Checkbox value="a">显示</Checkbox>
        <Checkbox value="b">排序</Checkbox>
        <Checkbox value="c">检索</Checkbox>
      </Checkbox.Group>
    </FormAttrItem>

    <FormAttrItem label="跳转配置 (全局)">
      <div>
        {actions.map((item, index) => {
          return <div key={index} style={{ margin: '10px auto' }}>
            <span className={MenuIconSpan}><Icon type="menu" /></span>
            <span className={NameSpan}>{item.name}</span>
            <span className={EditIconSpan} onClick={() => {
              editIndex = index
              setInitialValues(item)
              setIsModalVisible(true)
            }}><Icon type="edit" /></span>
            <span className={MinusIconSpan} onClick={() => {
              const newActions = [...actions]
              newActions.splice(index, 1)
              setActions(newActions)
            }}><Icon type="minus" /></span>
          </div>
        })}
      </div>
      <Button type="link" onClick={handleShowModal}>添加链接</Button>
    </FormAttrItem>
    <Modal
      title="添加按钮"
      width={720}
      visible={isModalVisible}
      maskClosable={false}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      afterClose={() => handleAfterClose()}
    >
      {isModalVisible && <LinkSettings ref={formRef} initialValues={initialValues} />}
    </Modal>
  </div>
}

export default ListAttrSettings