import React, { Component } from 'react'
import {InboxMap} from '../assets/js/tabConfig'
import WaterMark from '/components/watermark/WaterMark.jsx'


class Inbox extends Component{

	async componentWillMount() {
		let path = this.props.pane.url.indexOf('?') != -1 ? this.props.pane.url.split('?')[0] : this.props.pane.url,pathParam = this.props.pane.url,type = this.props.pane.key, dataType=this.props.pane.params ? this.props.pane.params : {};
		let params = {type,pathParam,dataType}
	  await import(`/page/${path}`).then(doc => {
	    this.setState({ TheComponent: doc.default, params});
	  })
	}

	state = {
		TheComponent: null,
		params: {}
	}

	render = _ => {
		let TheComponent = this.state.TheComponent;
		return TheComponent == null ? <div></div> : <div className='container-div'><TheComponent  params={this.state.params} /></div>
	}
}

export default Inbox