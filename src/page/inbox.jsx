import React, { Component } from 'react'
import {InboxMap} from '../assets/js/tabConfig'
import WaterMark from '/components/watermark/WaterMark.jsx'


class Inbox extends Component{

	async componentWillMount() {
		let path = this.props.pane.url;
		let params = {}
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