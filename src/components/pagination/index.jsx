import React, {Component} from 'react';
import ReactDOM from 'react-dom';

//引入Antd分页组件：
import { Pagination } from 'antd';


class Paginations extends Component {

    // 挂载完成
    componentDidMount=()=>{
        console.log(this.props)
    }

    showTotal=()=>{
        return '共 ' + this.props.total + ' 条数据'; 
    }


    
    render=()=>{
        return (
            <div className="pageContent" style={{marginTop: '15px',textAlign: 'right', marginRight: '15px'}}>
                <Pagination showSizeChanger showQuickJumper showTotal={this.showTotal} pageSize={this.props.pageSize}  current={this.props.current} total={this.props.total} onChange={this.props.onChange} onShowSizeChange={this.props.onShowSizeChange}/>
            </div>
            
        )
    }
}


export default Paginations;