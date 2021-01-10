import React, { Component } from 'react'
import {InboxMap} from '../assets/js/tabConfig'


class Inbox extends Component{

	async componentWillMount() {
		let path = this.props.pane.url
		let reqparam = {}
		if (path.indexOf('?') > 0) {
			reqparam = this.getParams(path.substring(path.indexOf('?') + 1))
			path = path.substring(0, path.indexOf('?'))
		}
		let params = Object.assign(reqparam, {grpath: path} ,this.props.pane.params)
		let name = InboxMap[path]
	  await import(`/page/${name}`).then(doc => {
	    this.setState({ TheComponent: doc.default, params});
	  })
	}

	getParams = s => {
		let search = {}
		let a = [s]
		if (s.length > 1 && s.indexOf('&') > 0 && s) {
			a = s.split('&')
		}
		a.forEach(val => {
			let b = val.split('=')
			search[b[0]] = b[1]
		})
		return search
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