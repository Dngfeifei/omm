import React, { Component } from 'react'
import { Upload, Icon, Modal, Pagination } from 'antd'
import { uploadPaper, deletePaper, downloadZip } from '/api/global'
import { dealBlob, isImage } from '/api/tools'
import { Document, Page } from 'react-pdf'

class PreviewWall extends Component {

  async componentWillReceiveProps (nextprops) {
    if (nextprops.config != this.props.config && nextprops.config.visible) {
      this.setState({fileList: this.props.fileList})
      document.oncontextmenu = function(){
        return false
      }
    }else if (!nextprops.config.visible) {
      document.oncontextmenu = function(){
        return true
      }
    }
  }



  state = {
    previewVisible: false,
    previewURL: '',
    isImage: true,
    fileName: '',
    fileList: [],
    numPages: null,
    listType: 'picture-card',
    pageNumber: 1
  };

  handleCancel = () => this.setState({ previewVisible: false })

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  handlePreview = (file) => {
    //console.log(file)
    let suffix = file.name.split('.')[1]
    this.setState({
      fileName: file.name,
      previewURL: file.url,
      isImage: isImage(suffix),
      previewVisible: true,
    });

  }


  render() {
    const { pageNumber, numPages } = this.state
    return (
      <Modal title='文件管理'
    footer={null}
    visible={this.props.config.visible}
    confirmLoading={this.state.loading}
    onCancel={this.props.onCancel}
    width={610}
    style={{top: 50, marginBottom: 100}}>
      <div className="clearfix">
      <Upload
          action={`${uploadPaper}`}
          listType={this.state.listType}
          data={{id: this.props.id,type: this.props.type,dirpath: this.props.path,thumb: this.props.thumb}}
          multiple={true}
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          showUploadList={{showPreviewIcon:true, showRemoveIcon:false }}
        >
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} 
        onCancel={this.handleCancel}
        width={560}>
        { this.state.isImage ?
          <img alt={this.state.fileName} style={{ width: '100%' }} src={this.state.previewURL} />
          : <div width={560} style={{overflow: 'scroll', height: '600px'}}>
              <Document file={this.state.previewURL} onLoadSuccess={this.onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
                <Pagination defaultCurrent={pageNumber} defaultPageSize={1} total={numPages} onChange={t => this.setState({pageNumber: t})} />
              </Document>
              
            </div>
        }
        </Modal>
      </div>
      </Modal>
    );
  }
}

export default PreviewWall