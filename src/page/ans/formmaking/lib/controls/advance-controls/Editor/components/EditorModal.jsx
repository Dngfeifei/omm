import {Button, Modal} from "antd";
import React, {useState} from "react";
import {EditorModules, EditorFormats} from "./editor-config";
import ReactQuill from "react-quill";

const EditorModal = ({defaultValue, onChange}) => {
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState(defaultValue)
    const openModal = () => setVisible(true)
    const handleChange = value => {
        setValue(value)
    }
    const handleOk = () => {
        onChange(value)
        setVisible(false)
    }
    const handleCancel = () => {
        setVisible(false)
    }
    return <div>
        <Button style={{ width: '100%' }} onClick={openModal}>设置</Button>
        <Modal title="默认值" visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <ReactQuill theme="snow"
                        value={value}
                        onChange={handleChange}
                        modules={EditorModules}
                        formats={EditorFormats} />
        </Modal>
    </div>
}

export default EditorModal
