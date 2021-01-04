import React, { Component } from 'react'
import { Input, Button } from 'antd'
import { viewChart, getReportSearch } from '/api/report'
import ReportSearchDom from '/components/report/reportSearch.jsx'

class ReportList extends Component{
	async componentWillMount () {
		let id = this.props.params.id
		this.setState({id})
		this.getSearchColumn(id)
	}

	componentDidMount() {
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: {},
		id: '',
		loading: true,
		tabledata: [],
		searchdoms: [],
		modalconf: {visible: false, item: {}},
		charObj: null
	})


	search = async _ => {
		if(this.state.charObj){
			this.state.charObj.clear();
			this.state.charObj.destroy();
		}
		await this.setState({loading: true, selected: {}})
		let search = Object.assign({rid09: this.state.id}, this.state.search)
		this.state.searchdoms.forEach(t => {
    	if(t.showType == 2){
    		if (search[t.arg]) search[t.arg] = search[t.arg].format('YYYY-MM-DD')
    	}
    })
		return viewChart(search)
		.then(res => {
			// let data = (f => f(f))(f => list => list.map(val => {
			// 	let baseItem = Object.assign({}, val, { key: val.lable })
			// 	baseItem.num = parseInt(baseItem.num)
			// 	return baseItem
			// }))(res.data.list)
			this.setState({
				tabledata: res.data.list, 
				loading: false
			})
			let charObj;
			if(res.data.type == 2){
				charObj = this.initChartZhu()
			}else if(res.data.type == 3){
				charObj =this.initChartBing()
			}else{
				charObj = this.initChartDuidieZhu()
			}
			this.setState({charObj});
		})
	}

	  //获得搜索条件
	getSearchColumn = id => {
		getReportSearch({id}).then(res => {
			// console.log(res.data)
			this.setState({searchdoms: res.data.map(t => {
				t.key = t.id
				return t
			})})
			res.data.forEach(t => {
				if ((t.showType == 3 || t.showType == 4) && t.dictCode){
					getDictSelect({dictcode: t.dictCode}).then(res => {
						let dict = this.state.dict
						dict[t.dictCode] = res.data
						this.setState({dict})
					})
				}
			})
		})
	}

	changeInput = (t, v) => {
		let obj = {}
		obj[t] = v
		let search = Object.assign({}, this.state.search, obj)
		this.setState({search})
	}

	initChartZhu = _ => { //柱状图
		// Step 1: 创建 Chart 对象
		let chart = new G2.Chart({
		  container: 'c1', // 指定图表容器 ID
		  width : 800, // 指定图表宽度
		  height : 500, // 指定图表高度
		  padding: [ 20, 90, 115, 80 ]
		});
		chart.legend({ 
			height: 300
		  //position: 'right-top', // 设置图例的显示位置
		  //itemGap: 20 // 图例项之间的间距
		});
		// Step 2: 载入数据源
		chart.source(this.state.tabledata);
		// Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
		chart.interval().position('lable*num').color('lable')
		// Step 4: 渲染图表
		chart.render();
		return chart;
	}

	initChartDuidieZhu = _ => { //堆叠柱状图
		//console.log(this.state.tabledata)
		let data = []
		for(let i=this.state.tabledata.length-1;i>=0;i--){
			let obj = this.state.tabledata[i]
			for(let prop in obj){
				if(prop != 'LABLE')
				data.unshift({
					label: obj.LABLE,
					type: prop,
					value: obj[prop]
				})
			}
		}
		var chart = new G2.Chart({
	    container: 'c1',
	    width : 1000, // 指定图表宽度
		  height : 500, // 指定图表高度
	    padding: [20, 70, 50, 50]
	  });
	  chart.source(data);
	  chart.intervalStack().position('label*value').color('type');
	  chart.render();
	  return chart;
	}


	initChartBing = _ => {// 饼图
		let total = 0
		this.state.tabledata.forEach(t => {
			total += t.num
		})
		let data = this.state.tabledata.map(item => {
			item.percent = (item.num/total)
			return item
		})
		console.log(data)
		// Step 1: 创建 Chart 对象
		let chart = new G2.Chart({
		  container: 'c1', // 指定图表容器 ID
		  width : 800, // 指定图表宽度
		  height : 500, // 指定图表高度
		  padding: [ 20, 90, 115, 80 ]
		});
		// Step 2: 载入数据源
		chart.source(data, {
	    percent: {
	      formatter: function formatter(val) {
	        val = parseInt(val * 100) + '%';
	        return val;
	      }
	    }
	  });
		// Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
		chart.coord('theta');
	  chart.tooltip({
	    showTitle: false
	  });
		chart.intervalStack().position('percent').color('lable').label('percent', {
			offset: -40,
	    textStyle: {
	      textAlign: 'center',
	      shadowBlur: 2,
	      shadowColor: 'rgba(0, 0, 0, .45)'
	    }
	  }).tooltip('lable*percent', function(lable, percent) {
	    percent = parseInt(percent * 100) + '%';
	    return {
	      name: lable,
	      value: percent
	    };
	  }).style({
	    lineWidth: 1,
	    stroke: '#fff'
	  });
		// Step 4: 渲染图表
		chart.render();
		return chart;
	}

	render = _ => <div className="mgrWrapper">
	<div className="mgrSearchBar">
			<ReportSearchDom dict={this.state.dict} searchdoms={this.state.searchdoms} search={this.state.search} changeInput={this.changeInput}  />
			{this.state.searchdoms.length > 0 ? <Button 
			onClick={this.search}
			type="primary" icon="search">搜索</Button> : null}
		</div>
	<div id='c1' style={{marginTop: '100px', marginLeft: '200px'	}}>
	</div></div>

}

export default ReportList