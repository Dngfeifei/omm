import React, { useEffect, useState, useContext } from 'react';
import { Select, Modal, Button, Input } from 'antd';

const OnChangeSetting = ({
  options,
  updateOptions,
}) => {

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [value, setValue] = useState(options.onChange)

  return (
    <React.Fragment>
      <Button style={{ width: '100%' }} onClick={() => { setIsEditorOpen(true)}}>设置</Button>
      {isEditorOpen ? (
        <Modal
          title="onChange代码"
          visible={isEditorOpen}
          onCancel={() => setIsEditorOpen(false)}
          onOk={() => {
            updateOptions({ onChange: value })
            setIsEditorOpen(false)
          }}
        >
          <Input.TextArea
            value={value}
            autoSize={{ minRows: 10 }}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
        </Modal>
      ) : null}
    </React.Fragment>

  );
};

export default OnChangeSetting
