import React, { Component } from 'react'
import { Upload, Icon, Modal, Button, Switch,message } from 'antd'
import { uploadPaper, deletePaper, downloadZip } from '/api/global'
import { dealBlob, isImage } from '/api/tools'
const { confirm } = Modal;
const officeTypes = ['doc','docx','ppt','pptx','xls','xlsx']
class PreviewPublicWall extends Component {

  async componentWillReceiveProps(nextprops) {
    if (nextprops.config != this.props.config && nextprops.config.visible) {
      this.setState({ fileList: this.props.fileList })
      let token = localStorage.getItem('token') || ''
      this.setState({ token })
      if(this.props.listType){
        this.setState({listType: this.props.listType})
      }
    }
  }

  state = {
    token: null,
    previewVisible: false,
    uploaddir: false,
    uploadurl: uploadPaper,
    previewURL: '',
    isImage: true,
    suffix: '',
    fileName: '',
    listType: 'picture-card',
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    let arr = file.name.split('.')
    let suffix = arr[arr.length-1]
    if(officeTypes.indexOf(suffix) > -1){
      let url = encodeURI('http://toubiao.trustfar.cn' + file.url)
      window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
      return
    }
    this.setState({
      fileName: file.name,
      previewURL: file.url || file.thumbUrl,
      isImage: isImage(suffix),
      suffix: suffix,
      previewVisible: true,
    });

  }

  handleRemove = (file) => {
    const _this = this
    return new Promise((resolve, reject) => {
        confirm({
        title: '确定要删除该资料吗?',
        content: '点击确定按钮继续删除图片',
        onOk() {
          _this.handleRemoveDone(file)
          resolve()
        },
        onCancel() {
          return false
        }});
      }).catch(() => console.log('Oops errors!'));
  }

  handleRemoveDone = (file) => {
    if (file.uid.substr(0, 1) == '-') {// 上传成功的图片uid以-开始
        deletePaper({ uid: file.uid }).then(res => {
        if (res && res.code != 200) {
          message.error('图片删除失败')
        }
      })
    }
  }

  handleChange = ({ file, fileList }) => {
    if(!file.status){ return }
    if (file.status == 'done') {
      if(file.response.code == 500){
        message.error(file.response.message)
        return
      }else{
        fileList.forEach(o => {
          if (o.uid == file.uid && file.response.data) {
            o.uid = file.response.data
            o.key = o.uid
          }
        })
      }
    }
    this.setState({ fileList })
  }
  //j考验图片格式与大小 -- 暂时不使用
  beforeUpload = file => {
    if(this.props.mutitype){
      return true
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG、JPEG、PNG 格式图片!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 5 && file.size / 1024 / 1024 >= 3;
    // if (!isLt2M) {
    //   message.error('只能上传大小在3M-5M的图片!');
    // }
    if(!isJpgOrPng){
      const fileList = this.state.fileList.filter(e => e.uid !== file.uid)
      this.setState({fileList})
    }
    return isJpgOrPng;
  }

  handleOk = _ => {
    downloadZip({ type: this.props.type, bid: this.props.id }).then(blob => {
      dealBlob(blob, "电子资料文件.zip")
    })
  }
  //上传文件夹还是文件
  onSwitch = t => {
    if (t) {
      this.setState({ uploaddir: true })
    } else {
      this.setState({ uploaddir: false })
    }
  }
  //列表展示
  onTextSwitch = t => {
    if (t) {
      this.setState({ listType: 'text' })
    } else {
      this.setState({listType: 'picture-card'})
    }
  }

  getDirUpload = _ => {
    return <div>文件管理 
      <Switch checkedChildren="列表显示"
      unCheckedChildren="列表显示"
      style={{ position: 'absolute', left: '420px' }}
      onChange={this.onTextSwitch} />
    </div>
  }

  render() {
    return (
      <Modal title={this.getDirUpload()}
        onOk={this.handleOk}
        visible={this.props.config.visible}
        confirmLoading={this.state.loading}
        onCancel={this.props.onCancel}
        okText="下载全部"
        width={610}
        style={{ top: 50, marginBottom: 100 }}
        cancelText="取消">
        <div className="clearfix">
          <Upload
            directory={this.state.uploaddir}
            listType={this.state.listType}
            data={{ id: this.props.id, type: this.props.type, dirpath: this.props.path, thumb: this.props.thumb }}
            headers={{ Authorization: `Bearer ${this.state.token}` }}
            multiple={true}
            fileList={this.state.fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            showUploadList={{ showPreviewIcon: true,  showRemoveIcon:false }}
          >
          </Upload>
          <Modal visible={this.state.previewVisible} footer={null}
            onCancel={this.handleCancel}
            width={560}>
            {this.state.isImage ?
              <img alt={this.state.fileName} style={{ width: '100%' }} src={this.state.previewURL} />
              : <embed src={this.state.previewURL} style={{ width: '100%', minHeight: '600px' }} />
            }
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default PreviewPublicWall