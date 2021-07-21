import React, { useContext, useState, useEffect } from "react";
import { Upload, Button, message } from 'antd'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import {REMOTE_URL} from '@/page/ans/config'

const FileUpload = ({ control, formConfig, onChange }) => {
  const { options } = control;
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState([])

  const showUploadList = {
    showDownloadIcon: true,
    downloadIcon: 'download ',
    showRemoveIcon: true,
  }
  const onChange2 = (evt) => {
    setFileList(evt.fileList.map(t => ({
      name: t.name,
      percent: t.percent,
      status: t.status,
      uid: t.uid,
      url: t.response && t.response.url ? REMOTE_URL + t.response.url: ''
    })));
    onChange(evt.fileList.filter(t => t.status === 'done').map(t => ({
      key: t.key,
      percent: t.percent,
      status: t.status,
      name: t.name,
      ...t.response,
    })))
  };
  const action = REMOTE_URL + options.action
  const extraData = file => {
    const key = (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999)
    const fname = file.name
    file.key = key
    file.fname = fname
    return {
      key,
      fname
    }
  }

  return (
    <Upload
      fileList={fileList}
      onChange={onChange2}
      data={extraData}
      action={action}
      showUploadList={showUploadList}
      disabled={formConfig.disabled || options.disabled}
    >
      <Button loading={uploading}>点击上传</Button>
    </Upload>
  )
}

export default FileUpload
