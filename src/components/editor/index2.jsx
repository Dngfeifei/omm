import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react';

// Import TinyMCE
import tinymce from 'tinymce/tinymce';

// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';

// A theme is also required
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';


// 引入 API接口
import { ImportFile, GetIP } from '/api/systemBulletin'


function example_image_upload_handler(blobInfo, success, failure, progress) {
    let token, tokenName = 'token';
    if (process.env.NODE_ENV == 'production') {
        tokenName = `${process.env.ENV_NAME}_${tokenName}`
    }
    token = localStorage.getItem(tokenName) || '';
    // console.log(blobInfo,blobInfo.blob(), "file")
    // let obj = blobInfo.blob()
    // // 原生上传
    // let fd = new FormData();
    // fd.append("file", obj);
    // setTimeout(() => {
    //     ImportFile(fd).then(res => {
    //         console.log(res, 2)
    //     })
    // }, 0)

    var xhr, formData;
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', `${process.env.API_URL}'/sysNotice/upload'`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = function (e) {
        progress(e.loaded / e.total * 100);
    };

    xhr.onload = function () {
        var json;

        if (xhr.status === 403) {
            failure('HTTP Error: ' + xhr.status, { remove: true });
            return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
            failure('HTTP Error: ' + xhr.status);
            return;
        }

        json = JSON.parse(xhr.responseText);
        console.log(json, json.data, "999")
        if (!json || typeof json.data != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
        }
        success(json.data);
    };

    xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
};

class App extends Component {
    // 设置默认props
    static defaultProps = {
        getContent: () => {
            //获取富文本编辑器数据的方法
        },
        height: 250
    }
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }
    handleEditorChange = (e) => {
        let content = e.target.getContent();
        this.props.getContent(content, this.props.name)
    }
    componentWillMount = () => {
        let { value } = this.props
        this.setState({
            value
        })
    }
    componentDidMount = () => {
        tinymce.init({
            selector: '.tiny',
            plugins: ['paste', 'link'],
            language_url: '/static/tinymce/langs/zh_CN.js',//你下载的语言包的路径
            language: 'zh_CN',
            skin_url: '/static/tinymce/skins/ui/oxide',//主题
        });
    }
    // componentWillReceiveProps = (props) => {
    //     this.setState({
    //         value: props.value
    //     })
    // }
    render() {
        let { disabled } = this.props;
        return (
            <Editor
                disabled={disabled}
                initialValue={this.state.value}
                init={{
                    language_url: 'static/tinymce/langs/zh_CN.js',//你下载的语言包的路径
                    language: 'zh_CN',
                    skin_url: 'static/tinymce/skins/ui/oxide',//主题
                    base_url: 'static/tinymce',
                    images_upload_handler: example_image_upload_handler,
                    // images_upload_url: '/demo/upimg.php',
                    // images_upload_base_path: '/demo',
                    // plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave   autoresize ',
                    // toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                    // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                    // table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |   lineheight formatpainter ',
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | image ',
                    menubar: "",
                    statusbar: false, // 隐藏编辑器底部的状态栏
                    autosave_ask_before_unload: false,
                    height: this.props.height, //编辑器高度
                    min_height: 200,
                    //通过属性初始化
                    // setup: (editor) => {
                    //     editor.on('init', (e) => {
                    //         console.log(value, "value")
                    //         editor.setContent(value)
                    //     })
                    // },
                }}

                onChange={this.handleEditorChange}
            />
        );
    }
}

export default App;

