
import React from 'react'
import {
	hashHistory
} from 'react-router'

class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state={hasError:false}
    }

    componentDidCatch(error,info){
        this.setState({hasError:true});
        // logErrorToMyService(error,info);
    }
    handleClick = ()=>{
        hashHistory.push('/home') //开发模式下不经过改跳转
    }
    render(){
        if(this.state.hasError){
            return (
                <div>
                    <div style={{ textAlign: 'center', paddingTop: 60 }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 150, padding: 10,margin:0 }}>error</p>
                            <h2 style={{ fontSize: '1.5rem', lineHeight: '2rem', marginBottom: 10 }}>糟糕，页面出错了！</h2>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <a href="" style={{ color: '#636363' }}onClick={this.handleClick}>返回首页</a>
                    </div>
                </div>
            )
        }
        return this.props.children;
    }
}
export default ErrorBoundary