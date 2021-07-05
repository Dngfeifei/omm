import {Button, Modal} from "antd";
import React, {useState} from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

const CustomOptions = ({options, onChange}) => {
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState(options)
    const handleChange = (editor, data, value) => setValue(value)
    const openModal = () => setVisible(true)
    const handleOk = () => {
        onChange(JSON.parse(value)) 
        setVisible(false)
    }
    const handleCancel = () => {
        setVisible(false)
    }
    return <div>
        <Button style={{ width: '100%' }} onClick={openModal}>设置</Button>
        <Modal title="自定义选项" 
         visible={visible}
         onOk={handleOk} 
         onCancel={handleCancel}>
            <CodeMirror
                value={value}
                options={{lineNumbers: true}}
                onChange={handleChange} />
        </Modal>
    </div>
}

export default CustomOptions
