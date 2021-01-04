import React from 'react'
import { Button, Modal, Input, Icon, message, Select, Upload, Divider, Carousel, DatePicker } from 'antd'
import { getinvoicelist, importURL } from '/api/invoice'
import { getPaperList } from '/api/global'
import Common from '/page/common.jsx'
import PaperWall from '/components/PaperWall.jsx'
import Contselect from '/page/invoice/contselect.jsx'
import Invoicedetail from '/page/invoice/invoicedetail.jsx'


class Invoice extends Common {
	async componentWillMount() {
		let type = Number(this.props.params.type)
		await this.changeSearch({ type })
		this.search()
	}

	state = Object.assign({}, this.state, {
		search: Object.assign({}, this.state.pageconf),
		ncsynctime: '',
		columns: [{
			title: '发票号码',
			dataIndex: 'invoiceCode'
		}, {
			title: '发票代码',
			dataIndex: 'invoiceNo'
		}, {
			title: '开票日期',
			dataIndex: 'invoiceDate'
		}, {
			title: '发票类型',
			dataIndex: 'invoceType'
		}, {
			title: '类型',
			dataIndex: 'type',
			render: t => t == 1 ? '销项发票' : '采购发票'
		}, {
			title: '本方名称',
			width: 180,
			dataIndex: 'sellerName',
			render: (t, r) => r.type == 1 ? r.sellerName : r.buyerName
		}, {
			title: '对方名称',
			width: 180,
			dataIndex: 'pkCumanname',
			render: (t, r) => r.type == 1 ? r.buyerName : r.sellerName
		}, {
			title: '验核状态',
			dataIndex: 'isCheck',
			render: (t, r) => r.isCheck === 1 ? '验核成功' : (r.isCheck === 2 ? '验核失败' : '验核成功')
		}, {
			title: '是否关联',
			dataIndex: 'flag',
			render: t => t == 0 ? '否' : '是'
		}, {
			title: ' 操作 ',
			dataIndex: 'operate',
			align: 'center',
			render: (t, r) => <div style={{width: 160}}>
				<a style={{ display: 'inline-block', width: 40 }} onClick={async _ => { this.setState({ detailConf: { visible: true, item: r } }) }}>查看</a><Divider type="vertical" />
				<a style={{ display: 'inline-block', width: 40 }} onClick={async _ => { this.openItemPic(r) }}>照片</a><Divider type="vertical" />
				<a style={{ display: 'inline-block', width: 40 }} onClick={async _ => { this.selectCont(r) }}>关联</a>
			</div>
		}],
		selectedtable: false,
		loading2: false,
		modalConf: { visible: false, item: {} },
		uploadconf: { visible: false, fileList: [] },
		id: 'invoice2020',
		type: 'invoice',
		path: 'invoice',
		thumb: 'invoice',
		fileList: [],
		picmodelConf: { visible: false, item: {} },
		contConf: { visible: false, item: {} },
		detailConf: { visible: false, item: {} },
		picconf: { visibles: false, items: [] }
	})

	search = async _ => {
		await this.setState({ loading: true, selected: {} })
		let search = Object.assign({}, this.state.search)
		return getinvoicelist(search)
			.then(res => {
				let data = res.data.records.map(val => Object.assign({}, val, { key: val.id }))
				this.setState({
					tabledata: data,
					loading: false,
					pagination: Object.assign({}, this.state.pagination, {
						total: Number(res.data.total),
						current: Number(res.data.current)
					})
				})
			})
	}
	//打开图片
	openItemPic = (r) => {
		getPaperList({ bid: r.id, type: 'invoice' }).then(res => {
			if (res.code == 200) {
				if (res.data.length > 0) {
					console.log(res.data)
					this.setState({ picconf: { visible: true, items: res.data } })
				} else {
					message.error('没有上传发票照片')
				}
			}
		})
	}

	done = async _ => {
		let modalConf = { visible: false, item: {} }
		await this.setState({ modalConf })
		this.research()
	}
	//打开导入页面
	openupload = _ => {
		let token = localStorage.getItem('token') || ''
		this.setState({ token, uploadconf: { visible: true, fileList: [] } })
	}
	//导入数据
	handleChange = ({ file, fileList }) => {
		if (file.status == 'done') {
			if (file.response.data && file.response.data.length > 0) {
				message.error(file.response.data.map((t, i) => <p key={i}>{t}</p>))
			} else {
				message.success('导入成功')
				this.setState({ uploadconf: { visible: false } })
				this.search()
			}
		}
		this.setState({ uploadconf: { visible: true, fileList } })
	}
	//关联
	selectCont = r => {
		this.setState({ contConf: { visible: true, item: r } })
	}
	//
	linkDone = _ => {
		const tabledata = this.state.tabledata.map(e => {
			if (e.key === this.state.contConf.item.key) {
				e.flag = 1
			}
			return e
		})
		this.setState({ tabledata, contConf: { visible: false, item: {} } })
	}

	renderSearch = _ => <div className="mgrSearchBar">
		<Input
			value={this.state.search.invoiceCode}
			allowClear
			onChange={e => this.changeSearch({ invoiceCode: e.target.value })}
			style={{ width: 300 }}
			addonBefore="发票号码" placeholder="发票号码" />
		<Input
			value={this.state.search.invoiceNo}
			allowClear
			onChange={e => this.changeSearch({ invoiceNo: e.target.value })}
			style={{ width: 300 }}
			addonBefore="发票代码" placeholder="发票代码" />
		<Input
			value={this.state.search.dname}
			allowClear
			onChange={e => this.changeSearch({ dname: e.target.value })}
			style={{ width: 300 }}
			addonBefore="本方名称" placeholder="本方名称" />
		<Input
			value={this.state.search.cname}
			allowClear
			onChange={e => this.changeSearch({ cname: e.target.value })}
			style={{ width: 300 }}
			addonBefore="对方名称" placeholder="对方名称" />

		{/* <Select style={{ width: 120 ,display: "none"}}
			defaultValue="销项发票"
			onChange={e => this.changeSearch({ type: e })}
			placeholder="选择类型">
			<Option value={1}>销项发票</Option>
			<Option value={2}>采购发票</Option>
		</Select> */}
		<Select style={{ width: 120 }}
		 	allowClear
			onChange={e => this.changeSearch({ flag: e })}
			placeholder="是否关联">
			<Option value={0}>未关联</Option>
			<Option value={1}>已关联</Option>
		</Select>
		<Select style={{ width: 120 }}
		 	allowClear
			onChange={e => this.changeSearch({ isCheck: e })}
			placeholder="核验状态">
			<Option value={0}>未核验</Option>
			<Option value={1}>已核验</Option>
			<Option value={2}>核验失败</Option>
		</Select>
		<DatePicker onChange={e => this.changeSearch({ fromDate: e })} placeholder="开票日期起" />
		<DatePicker onChange={e => this.changeSearch({ toDate: e })} placeholder="开票日期止" />
		<Button
			onClick={this.search}
			type="primary" icon="search">搜索</Button>
		<Button
			onClick={this.openupload}
			type="primary" icon="upload">导入EXCEL</Button>
		<Button
			onClick={_ => this.setState({ picmodelConf: { visible: true, item: {} } })}
			type="primary" icon="upload">导入图片</Button>
	</div>

	rendermodal = _ => <div>
		<PaperWall onCancel={_ => this.cancelform('picmodelConf')}
			id={this.state.id}
			type={this.state.type}
			path={this.state.path}
			thumb={this.state.thumb}
			fileList={this.state.fileList}
			config={this.state.picmodelConf} />
		<Invoicedetail
			onCancel={_ => this.setState({ detailConf: { visible: false, item: {} } })}
			config={this.state.detailConf}
		/>
		<Contselect
			onCancel={_ => this.setState({ contConf: { visible: false, item: {} } })}
			done={this.linkDone}
			config={this.state.contConf}
		/>
		<Modal title="图片查看"
			visible={this.state.picconf.visible}
			footer={null}
			mask={true}	
			width={600}
			onCancel={_ => this.setState({ picconf: { visible: false, items: [] } })}
		>
			<Carousel style={{ height: 600, width: 760, background: '#364d79', textAlign: 'center' }}>
				{typeof (this.state.picconf.items) == "undefined" ? console.log("undefined") : this.state.picconf.items.map(e => <div style={{ width: 500, height: 500, background: '#364d79' }}>
					<img alt={e.name} style={{ width: "98%",height:'auto' }} src={e.url} />
					<style>
						{`
							.ant-carousel .slick-dots li button {
								width: 25px;
								height: 10px;
								color: #fffb6f;
								background: #ff9186;
							}
							.ant-carousel .slick-dots li.slick-active button {
								background: #e5951d;
							}
						`}
					</style>
					</div>)}
			</Carousel>
		</Modal>
		<Modal title="导入"
			visible={this.state.uploadconf.visible}
			footer={null}
			mask={true}
			width={500}
			onCancel={_ => this.setState({ uploadconf: { visible: false } })}
		>
			<p>发票信息导入</p>
			<Upload className='attr-upload'
				action={`${importURL}`}
				headers={{ Authorization: `Bearer ${this.state.token}` }}
				onChange={this.handleChange}
				fileList={this.state.uploadconf.fileList}
				multiple={false} >
				<Button>
					<Icon type="upload" /> 导入数据
						</Button>
			</Upload>
		</Modal>
	</div>

}

export default Invoice