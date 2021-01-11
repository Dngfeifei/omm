import React ,{ Component, PropTypes}from 'react'
import { Card , Menu, Dropdown, Button, Icon} from 'antd'
// import { DownOutlined } from '@ant-design/icons'


class Cards extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
    
  }

  // 挂载完成时
  componentDidMount() {
   
   
  }

  // 点击事件
  onClick = ({ key }) => {
    console.log(key)
    if (key == 'refresh') {
      this.onRefresh();
      console.log('***************     刷新当前页面     ***************')
    } else if (key == 'hidding') {

      this.onHidding();
      console.log('***************     隐藏当前页面     ***************')
    } else if (key == 'addZone') {
      console.log('***************     添加区快     ***************')
    } else if (key == 'default') {
      console.log('***************     恢复默认     ***************')
    }
  };


  // 当前用户点击某个指定卡片的刷新  事件
  onRefresh=()=>{
    /* 通过父组件传进来的方法来修改数据 */
    this.props.refresh()
  }



  // 当前用户点击某个指定卡片的隐藏  事件
  onHidding=()=>{
    this.props.change();
  }

  // 





    render() {
        return (
            <div style={{ display: this.props.isShow === true ? 'block' : 'none' }}>
                <Card title={this.props.title} extra={<Dropdown overlay={
                    (
                        <Menu onClick={this.onClick.bind(this)}>
                            <Menu.Item key="refresh">刷新</Menu.Item>
                            <Menu.Item key="hidding">隐藏</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="addZone">添加区快</Menu.Item>
                            <Menu.Item key="default">恢复默认</Menu.Item>
                        </Menu>
                    )
                }
                ><a className="ant-dropdown-link" onClick={e => e.preventDefault()}><Icon type="dash" style={{ fontSize: '18px' }} /></a></Dropdown>} style={{ width: '100%' }}>
                    {this.props.children}
                </Card>
            </div>

        );
    }

}

export default Cards