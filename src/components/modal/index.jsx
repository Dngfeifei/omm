import React ,{ Component}from 'react'
import { Modal} from 'antd'

// 参数类型
import PropTypes from 'prop-types'


class ModalDom extends Component {
    constructor(props) {
        super(props);
    }

    // 设置默认props
    static defaultProps = {
        // body样式设置
        bodyStyle:{},
        //关闭时销毁 Modal 里的子元素
        destroyOnClose:false,
        // 支持键盘esc关闭弹框
        keyboard:true,
        // 是否展示遮罩
        mask:true,
        // 确认按钮文字
        okText:'确认',
        // 弹框标题
        title:'对话框',
        // 宽度设置
        width:520,
        //弹框是否弹出
        visible:false,
        //点击确定按钮时的回调
        onOk:null,
        //点击关闭时的回调
        onCancel:null,
        //是否全居中显示（垂直）
        centered:true,
        //点击遮罩层是否允许关闭
        maskClosable:false
    }

    // 挂载完成时
    componentDidMount() {

    };

    render=()=>{

        // const {bodyStyle,destroyOnClose,keyboard,mask,okText,title,width,visible} = this.props;
        return (
            <Modal {...this.props}>
                {this.props.children ? this.props.children : null}
            </Modal>
        )
    }
}



// 设置props参数类型
ModalDom.propTypes = {
    // 是否弹出弹框
    modalVisible:PropTypes.bool,
    // 是否添加遮罩层
    mask: PropTypes.bool,
    //是否在关闭弹框时销毁弹框里的内容
    destroyOnClose:PropTypes.bool
};

export default ModalDom;