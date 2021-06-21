import React, { useContext } from 'react';
import { Modal, Button } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const JSONModal = ({ json, open, onCancel }) => {

  const [jsonState, setJsonState] = React.useState(json)
  const handleJsonChange = (editor, data, value) => setJsonState(value)

  const handleCopy = () => { }
  const handleExport = () => {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json));
    pom.setAttribute('download', Date.now() + '.json');
    pom.click();
  }

  return (
    <Modal
      title="生成JSON"
      visible={open}
      onCancel={onCancel}
      footer={[
        <CopyToClipboard
          text={jsonState}
          onCopy={handleCopy}
          key="copy"
        >
          <Button key="copy" type="primary">复制</Button>
        </CopyToClipboard>
        ,
        <Button key="export" type="primary" onClick={handleExport}>
          导出
          </Button>
      ]}
    >
      <CodeMirror
        value={jsonState}
        options={{ lineNumbers: true }}
        onChange={handleJsonChange}
      />
    </Modal>
  );
};

export default JSONModal
