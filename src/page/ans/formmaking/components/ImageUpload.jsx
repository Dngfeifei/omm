import React, { useState } from 'react'
import { Upload, Icon, Modal } from 'antd';
const REMOTE_URL = 'http://152.136.121.201:8080/jeeplus-vue'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const ImageUpload = ({ control, formConfig, onChange }) => {
  const { options } = control;
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const handleCancel = () => setPreviewVisible(false)
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  };

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

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onChange2}
        data={extraData}
        action={action}
        onPreview={handlePreview}
        disabled={formConfig.disabled || options.disabled}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default ImageUpload
