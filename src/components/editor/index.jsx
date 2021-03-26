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




class App extends Component {
    // 设置默认props
    static defaultProps = {
        getContent: () => {
            //获取富文本编辑器数据的方法
        }
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
        // tinymce.init({
        //     selector: '.tiny',
        //     plugins: ['paste', 'link'],
        //     language_url: '/static/tinymce/langs/zh_CN.js',//你下载的语言包的路径
        //     language: 'zh_CN',
        //     skin_url: '/static/tinymce/skins/ui/oxide',//主题
        // });
    }
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
                    // images_upload_url: '/demo/upimg.php',
                    // images_upload_base_path: '/demo',
                    // plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave   autoresize formatpainter ',
                    // toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                    // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                    // table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |   lineheight formatpainter ',
                    menubar: "",
                    statusbar: false, // 隐藏编辑器底部的状态栏
                    autosave_ask_before_unload: false,
                    height: 250, //编辑器高度
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

