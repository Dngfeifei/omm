import React, { Component } from 'react'
import { Layout} from 'antd'
import {getMenu} from '@/api/global.js'
const {Footer} = Layout
class FooterD extends Component{
    async componentWillMount(){
        let massage = await getMenu();
        console.log(massage);
        this.setState({msg:'底部'})
    }
	state = {
		msg: ''
	}
	render = _ => {
       const {msg} = this.state;
       return (<Footer style={{height:46,borderTop:'1px solid rgba(204, 197, 197, 0.5)',margin:'5px 0px 0px 0px',backgroundColor:'#fafafa',padding:0,fontSize:'16px',fontWeight:'bold',textAlign:'center',lineHeight:'46px'}}>{msg}</Footer>)
    }
		
}

export default FooterD