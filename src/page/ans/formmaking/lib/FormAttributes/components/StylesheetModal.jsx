import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const StylesheetModal = ({ stylesheet, open, onCancel, onOk }) => {
  console.log(stylesheet);

  const [stylesheetState, setStylesheetState] = React.useState(stylesheet || '')
  const handleChange = (editor, data, value) => setStylesheetState(value)


  return (
    <Modal
      title="表单样式表"
      visible={open}
      onCancel={onCancel}
      onOk={() => { onOk(stylesheetState)}}
    >
      <CodeMirror
        value={stylesheetState}
        options={{ lineNumbers: true }}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default StylesheetModal
