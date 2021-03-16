
import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react';

class App extends Component {
    // 设置默认props
    static defaultProps = {
        getContent: () => {
              //获取富文本编辑器数据的方法
        }
    }
    constructor(props) {
        super(props);
    }
    handleEditorChange = (e) => {
        let content = e.target.getContent();
        this.props.getContent(content, this.props.name)
    }

    render() {
        let { value, disabled } = this.props;
        return (
            <Editor
                apiKey='4czmdjk6j44t366hslzbk59jbuvnc0z2gp7jatyirjybwv96'
                disabled={disabled}
                init={{
                    language: 'zh_CN',
                    // plugins: 'image',
                    // toolbar: 'image',
                    images_upload_url: '/demo/upimg.php',
                    images_upload_base_path: '/demo',
                    plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave   autoresize formatpainter ',
                    toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                    table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |   lineheight formatpainter ',
                    height: 450, //编辑器高度
                    min_height: 200,
                    statusbar: false, // 隐藏编辑器底部的状态栏
                    autosave_ask_before_unload: false,
                    //通过属性初始化
                    setup: (editor) => {
                        editor.on('init', (e) => {
                            editor.setContent(value)
                        })
                    },
                }}

                onChange={this.handleEditorChange}
            />
        );
    }
}

export default App;

