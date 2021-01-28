import React, { Component } from 'react'
import { Tree, Input, Button, message, Select, Form, Row, Col, Modal, Card, Tooltip } from 'antd'

// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

import { GetResourceTree, AddResource, EditResource, DelResource, GetResourceInfo } from '/api/resources'
import { GetDictInfo } from '/api/dictionary'
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input
const { confirm } = Modal;

const assignment = (data) => {
	data.forEach((list, i) => {
		list.key = list.id;
		list.value = list.id;
		list.title = list.resourceName;
		if (list.hasOwnProperty("children")) {
			if (list.children.length > 0) {
				assignment(list.children)
			}
		} else {
			return
		}
	});
}
class resources extends Component {
	async componentWillMount() {
		// 获取数据字典树数据
		this.searchTree()
		// 获取下拉框数据
		this.getDictData()
	}
	state = Object.assign({}, {
		// tree节点搜索高亮配置
		expandedKeys: [],
		searchValue: '',
		autoExpandParent: true,
		// 资源类型
		comboBox: {
			visible: [],
			openMethod: []
		},
		resourceType: [
			{ itemCode: "1", itemValue: "菜单" },
			{ itemCode: "2", itemValue: "工作台左侧Portalet" },
			{ itemCode: "3", itemValue: "工作台右侧Portalet" },
			{ itemCode: "4", itemValue: "外部链接" },
			{ itemCode: "5", itemValue: "普通按钮" },
		],
		resourceType2: [
			{ itemCode: "1", itemValue: "菜单" },
			{ itemCode: "2", itemValue: "工作台左侧Portalet" },
			{ itemCode: "3", itemValue: "工作台右侧Portalet" },
			{ itemCode: "4", itemValue: "外部链接" },
			{ itemCode: "5", itemValue: "普通按钮" },
		],
		resourceType3: [
			{ itemCode: "1", itemValue: "菜单" },
			{ itemCode: "2", itemValue: "工作台左侧Portalet" },
			{ itemCode: "3", itemValue: "工作台右侧Portalet" },
		],
		//资源数数据
		treeData: [],
		//资源树被选中项
		selected: {
			id: null,
			title: null
		},
		//当前表单类型  1新增 2编辑
		type: null,
		//当前表单信息是否可编辑
		editable: true,
		//表单配置和校验配置
		rules: [
			{
				label: '资源名称',
				key: 'resourceName',
				option: {
					rules: [
						{ required: true, message: "请输入" },
					]
				},
				render: _ => <Input disabled={!this.state.editable} />
			},
			{
				label: '资源路径',
				key: 'resourcePath',
				option: {
					rules: [
						{ required: true, message: "请输入" },
					]
				},
				render: _ => <Input disabled={!this.state.editable} />
			},
			{
				label: '是否可见',
				key: 'visible',
				option: {
					rules: [
						{ required: true, message: "请选择" },
					],
				},
				render: _ => <Select disabled={!this.state.editable}
					placeholder="请选择"
				>
					{
						this.state.comboBox.visible.map(t => <Option key={Number(t.itemCode)} value={Number(t.itemCode)}>{t.itemValue}</Option>)
					}
				</Select>
			},
			{
				label: '资源类型',
				key: 'resourceCategoryId',
				option: {
					rules: [
						{ required: true, message: "请选择" },
					]
				},
				render: _ => <Select disabled={!this.state.editable}
					placeholder="请选择"
				>
					{this.state.resourceType.map(t => <Option key={t.itemCode} value={t.itemCode}>{t.itemValue}</Option>)}
				</Select>
			},
			{
				label: '打开方式',
				key: 'openMethod',
				option: {
					rules: [
						{ required: true, message: "请选择" },
					]
				},
				render: _ => <Select disabled={!this.state.editable}
					placeholder="请选择"
				>
					{
						this.state.comboBox.openMethod.map(t => <Option key={t.itemCode.toString()} value={t.itemCode.toString()}>{t.itemValue}</Option>)
					}
				</Select>
			},
			{
				label: '显示顺序',
				key: 'serialNumber',
				option: {
					rules: [
						{
							message: "请输入数字",
							pattern: /^[0-9]{0,}$/,
							trigger: "blur",
						}
					]
				},
				render: _ => <Input disabled={!this.state.editable} />
			},
			{
				label: '上级资源',
				key: 'parentResourceName',
				render: _ => <Input disabled />
			},
			{
				label: '备注',
				key: 'description',
				option: {
					rules: [
						{
							message: "字符限制",
							pattern: "^.{0,200}$",
							trigger: "blur",
						}
					]
				},
				render: _ => <TextArea autoSize={{ minRows: 4, maxRows: 6 }} disabled={!this.state.editable} />
			}
		],
	})
	// 获取资源类型下拉框数据
	getDictData = () => {
		GetDictInfo({ dictCode: "visible" }).then(res => {
			if (res.success != 1) {
				message.error("是否可见下拉框资源未获取，服务器错误！")
			} else {
				let comboBox = Object.assign({}, this.state.comboBox, {
					visible: res.data
				})
				this.setState({ comboBox: comboBox })
			}
		})
		GetDictInfo({ dictCode: "openMethod" }).then(res => {
			if (res.success != 1) {
				message.error("打开方式下拉框资源未获取，服务器错误！")
			} else {
				let comboBox = Object.assign({}, this.state.comboBox, {
					openMethod: res.data
				})
				this.setState({ comboBox: comboBox })
			}
		})
	}
	//资源树查询
	searchTree = async () => {
		GetResourceTree()
			.then(res => {
				if (res.success != 1) {
					alert("请求错误")
					return
				} else {
					//给tree数据赋值key title
					assignment(res.data)
					this.setState({
						treeData: res.data,
					})
				}
			})
	}
	//资源树被选事件
	onSelect = (selectedKeys, info) => {
		if (info.event != "select") {
			return;
		}
		if (!info.selected) {
			this.setState({
				selected: {
					id: null,//资源树当前选中项
					title: null//当前选中项name
				},
				type: null, editable: false
			});
			return
		}
		// 选中数据详情
		let source = info.selectedNodes[0].props.dataRef
		this.setState({
			selected: source,
			type: null, editable: false
		}, _ => {
			this.getTreeNodeInfo()
		});
		//通过获取key值从资源树查询对应资源详情
		// let item = this.getDataByTree(this.state.treeData, selectedKeys[0]);

	}
	//查询tree节点详情
	getTreeNodeInfo = () => {
		let id = this.state.selected.id;
		GetResourceInfo(id)
			.then(res => {
				if (res.success != 1) {
					message.error('请求数据错误')
					return
				} else {
					let item = res.data
					//详情表单数据渲染
					this.props.form.setFields({ resourceName: { value: item.resourceName } })
					this.props.form.setFields({ resourcePath: { value: item.resourcePath } })
					this.props.form.setFields({ visible: { value: item.visible } })
					this.props.form.setFields({ resourceCategoryId: { value: item.resourceCategoryId } })
					this.props.form.setFields({ openMethod: { value: item.openMethod } })
					this.props.form.setFields({ serialNumber: { value: item.serialNumber } })
					this.props.form.setFields({ parentResourceName: { value: item.parentResourceName } })
					this.props.form.setFields({ description: { value: item.description } })
				}
			})
	}
	// 打开节点
	onExpand = expandedKeys => {
		this.setState({
			expandedKeys,
			autoExpandParent: false,
		});
	};


	//新增按钮
	addBtn = () => {
		let row = this.state.selected;
		if (row.hasOwnProperty("resourceCategoryId")) {
			if (row.resourceCategoryId == 4 || row.resourceCategoryId == 5) {
				message.destroy()
				message.warning("外部链接和普通按钮下不能新建资源")
				return
			}
		}
		this.setState({ type: 1, editable: true })
		//重置右侧表单
		this.reset()
		if (this.state.selected.id) {
			this.props.form.setFields({ parentResourceName: { value: this.state.selected.title }, visible: { value: 1 } })
		}
	}
	//修改按钮
	editBtn = () => {
		let row = this.state.selected;
		if (row.hasOwnProperty("children")) {
			if (row.children.length) {
				this.setState({
					resourceType: this.state.resourceType3
				})
			} else {
				this.setState({
					resourceType: this.state.resourceType2
				})
			}
		}
		// if(row.hasOwnProperty("c")){
		// 	if( row.resourceCategoryId==4||row.resourceCategoryId==5){
		// 		message.destroy()
		// 		message.warning("外部链接和普通按钮下不能新建资源")
		// 		return
		// 	}
		// }
		let selected = this.state.selected.id;
		//1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
		if (selected == "" || selected == null) {
			message.destroy()
			message.warning('没有选中数据,无法进行修改!');
			return
		}
		this.setState({ type: 2, editable: true })
	}
	//删除按钮
	delBtn = async_ => {
		let selected = this.state.selected;
		console.log(this.state.selected, 4564)

		//1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
		if (selected.id == "" || selected.id == null) {
			message.destroy()
			message.warning('没有选中数据,无法进行删除!');
			return
		}
		if (selected.children && selected.children.length) {
			message.destroy()
			message.warning('选中资源下存在子资源项,请先删除子资源再进行此项操作!');
			return
		}
		let _this = this
		confirm({
			title: '删除',
			content: '删除后不可恢复,确定删除吗？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				let params = _this.state.selected.id
				DelResource({ id: params })
					.then(res => {
						if (res.success != 1) {
							message.error(res.message)
						} else {
							_this.searchTree()
							_this.reset()
							_this.setState({
								selected: {
									id: null,
									title: null
								}
							})
						}
					})
			},
		});

	}
	//获取表单数据=>提交请求
	getFormData = _ => {
		let params;
		this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
			if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 获取合并后的表单数据
				params = Object.assign({}, val)
				if (this.state.type == 1) {
					params = Object.assign({}, params, { parentResourceId: this.state.selected.id })
					console.log(params, 111)
					this.addSave(params)
				} else {
					params = Object.assign({}, params, { parentResourceId: this.state.selected.parentResourceId })
					this.editSave(params);
				}
			}
		})
		return params;
	}
	//查询表单重置
	reset = _ => {
		this.props.form.resetFields()
	}
	//保存
	save = _ => {
		this.getFormData();
	}
	cancel = _ => {
		// this.setState({ editable: false })
		let type = this.state.type;
		if (type == 1) {
			this.addBtn()
		} else if (type == 2) {
			this.getTreeNodeInfo()
		}
		this.setState({ editable: false })
	}
	//新增保存
	addSave = async (params) => {
		AddResource(params)
			.then(res => {
				if (res.success == 1) {
					this.setState({ editable: false })
					this.searchTree()
					message.success('操作成功')
				} else {
					message.error('操作失败')
				}
			})
	}
	//编辑保存
	editSave = async (params) => {
		params = Object.assign({}, params, { id: this.state.selected.id })
		EditResource(params)
			.then(res => {
				if (res.success == 1) {
					this.setState({ editable: false })
					this.searchTree()
					message.success('操作成功')
				} else {
					message.error('操作失败')
				}
			})
	}

	//拖拽逻辑
	onDrop = info => {
		const dropKey = info.node.props.eventKey;
		const dragKey = info.dragNode.props.eventKey;
		const dropPos = info.node.props.pos.split('-');
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

		const loop = (data, key, callback) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i], i, data);
				}
				if (data[i].children) {
					loop(data[i].children, key, callback);
				}
			}
		};
		const data = [...this.state.treeData];

		// Find dragObject
		let dragObj, pid;
		loop(data, dragKey, (item, index, arr) => {
			arr.splice(index, 1);
			dragObj = item;
		});

		if (!info.dropToGap) {
			// Drop on the content
			loop(data, dropKey, item => {
				item.children = item.children || [];
				// where to insert 示例添加到头部，可以是随意位置
				item.children.unshift(dragObj);
				pid = item.id;
			});
		} else if (
			(info.node.props.children || []).length > 0 && // Has children
			info.node.props.expanded && // Is expanded
			dropPosition === 1 // On the bottom gap
		) {
			loop(data, dropKey, item => {
				item.children = item.children || [];
				// where to insert 示例添加到头部，可以是随意位置
				item.children.unshift(dragObj);
				pid = item.id;
				// in previous version, we use item.children.push(dragObj) to insert the
				// item to the tail of the children
			});
		} else {
			let ar;
			let i;
			loop(data, dropKey, (item, index, arr) => {
				ar = arr;
				i = index;
			});
			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj);
				pid = ar[ar.length - 1].parentResourceId;
			} else {
				ar.splice(i + 1, 0, dragObj);
				pid = ar[0].parentResourceId;
			}
		}
		// this.setState({
		// 	treeData: data,
		// });
		//发起拖拽变更请求
		let _this = this
		confirm({
			title: '删除',
			content: '您是否要进行拖拽？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				_this.treeNodeChange({
					id: dragObj.id,
					parentResourceId: pid
				})
			},
		});

	};
	// 拖拽节点变更
	treeNodeChange = async (dropParams) => {
		if (dropParams.hasOwnProperty("id") && dropParams.hasOwnProperty("parentResourceId")) {
			EditResource(dropParams)
				.then(res => {
					if (res.success == 1) {
						this.searchTree();
						this.getTreeNodeInfo(this.state.selected.id)
					} else {
						message.error('操作失败')
					}
				})
		}
	}
	render = _ => {
		const { getFieldDecorator } = this.props.form
		return (<div style={{ border: '0px solid red', background: ' #fff', height: '100%' }} >
			<Row gutter={24} className="main_height">
				<Col span={5} className="gutter-row" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
					<TreeParant treeData={this.state.treeData} draggable={true}
						addTree={this.addBtn} editTree={this.editBtn} deletetTree={this.delBtn}  selectedKeys={[this.state.selected.id]}
						onDrop={this.onDrop} onExpand={this.onExpand} onSelect={this.onSelect}  //点击树节点触发事件
					></TreeParant>
				</Col>
				<Col span={19} className="gutter-row main_height" style={{ padding: '30px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>


					<Row gutter={24}>
						<Form
							labelCol={{ span: 4 }}
							
							layout="horizontal"
						>
							{this.state.rules.map((val, index) =>
								val.key == "description" ?
									<Col key={index} span={24} style={{ display: 'block' }}>
										<FormItem
											label={val.label} labelCol={{ span: 2 }} wrapperCol={{ span: 19 }}>
											{getFieldDecorator(val.key, val.option)(val.render())}
										</FormItem>
									</Col> : <Col key={index} span={12} style={{ display: 'block' }}>
										<FormItem
											label={val.label} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
											{getFieldDecorator(val.key, val.option)(val.render())}
										</FormItem>
									</Col>
							)}
						</Form>

					</Row>
					<Row >
						<Col span={21} style={{ display: 'block', textAlign: "right" }}>
							<Button type="info" disabled={!this.state.editable} onClick={this.cancel} style={{ marginRight: "18px" }}>取消</Button>
							<Button type="primary" disabled={!this.state.editable} onClick={this.save}>保存</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</div >)
	}
}
const resourcesCom = Form.create()(resources)
export default resourcesCom
