import React, { Component } from 'react'
import {Button, Icon, message, Upload} from 'antd'
import { uploadDir } from '/api/staff'

class Idphoto extends Component{
    async componentWillMount () {
        let token = localStorage.getItem('token') || ''
        this.setState({ token })
    }

    state = Object.assign({}, this.state, {
        token: ''
    })

    beforeUpload = file => {
        if(this.props.mutitype){
            return true
        }
        // console.log(file.type);
        const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG 格式图片!');
        }
        const isLt2M = file.size / 1024 <= 200 && file.size / 1024 >= 60
        if (!isLt2M) {
          message.error('图片文件大小60KB~200KB!');
        }
        return isJpgOrPng;
    }

    handleChange = ({ file }) => {
        if (file.status === 'done') {
            if (file.response.code === 500) {
                message.error(file.response.message)
            } else {
                message.success('上传成功')
            }
        }
    }


    render = _ => <div style={{margin: 20}}>
        <div>
            <p> 请上传或采集正面免冠照，露出眼睛和眉毛；</p>
            <p> 图片文件支持.jpg格式；</p>
            <p> 图片瞳距大于40；</p>
            <p> 图片分辨率大于640*480小于1080*1920；</p>
            <p> 图片文件大小60KB~200KB；</p>
            </div>
        <Upload headers={{Authorization: `Bearer ${this.state.token}`}}
                data={{idnum: this.props.idnum}}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                action={uploadDir}>
            <Button>
                <Icon type="upload" /> 上传图片
            </Button>
        </Upload>
    </div>
}

export default Idphoto