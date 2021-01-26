import React, { Component } from 'react'
import { Tree, Input, Button, message, Select, Form, Row, Col, Modal, Card } from 'antd'
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
		// 获取资源类型下拉框数据
		this.getSourceType()
	}
	state = Object.assign({}, {
		resourceType: [],
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
				render: _ => <Input disabled={!this.state.editable} style={{ width: 240 }} />
			},
			{
				label: '资源路径',
				key: 'resourcePath',
				option: {
					rules: [
						{ required: true, message: "请输入" },
					]
				},
				render: _ => <Input disabled={!this.state.editable} style={{ width: 240 }} />
			},
			{
				label: '是否可见',
				key: 'visible',
				option: {
					rules: [
						{ required: true, message: "请选择" },
					]
				},
				render: _ => <Select disabled={!this.state.editable}
					style={{ width: 240 }}
					placeholder="请选择"
				>
					<Option value={1}>是</Option>
					<Option value={0}>否</Option>
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
					style={{ width: 240 }}
					placeholder="请选择"
				>
					{
						this.state.resourceType.map(t => <Option key={t.id} value={t.id}>{t.itemValue}</Option>)
					}
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
					style={{ width: 240 }}
					placeholder="请选择"
				>
					<Option value={1}>本窗口</Option>
					<Option value={0}>新窗口</Option>
				</Select>
			},
			{
				label: '显示顺序',
				key: 'serialNumber',
				// option: {
				// 	rules: [
				// 		{
				// 			message: "请输入数字",
				// 			pattern: "^[0-9]*$",
				// 			trigger: "blur",
				// 		}
				// 	]
				// },
				render: _ => <Input disabled={!this.state.editable} style={{ width: 240 }} />
			},
			{
				label: '上级资源',
				key: 'parentResourceName',
				render: _ => <Input disabled style={{ width: 240 }} />
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
				render: _ => <TextArea disabled={!this.state.editable} rows={2} style={{ width: 360 }} />
			}
		],
	})
	// 获取资源类型下拉框数据
	getSourceType = () => {
		GetDictInfo({ dictCode: "resourceType" }).then(res => {
			if (res.success != 1) {
				message.error("资源类型未获取，服务器错误！")
			} else {
				this.setState({
					resourceType: res.data
				})
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
		this.setState({
			selected: {
				id: selectedKeys[0],//资源树当前选中项
				title: info.selectedNodes[0].props.title//当前选中项name
			},
			type: null, editable: false
		});
		//通过获取key值从资源树查询对应资源详情
		// let item = this.getDataByTree(this.state.treeData, selectedKeys[0]);
		this.getTreeNodeInfo(selectedKeys[0])
	}
	//查询tree节点详情
	getTreeNodeInfo = (id) => {
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
					// console.log(typeof item.openMethod)
					this.props.form.setFields({ openMethod: { value: Number(item.openMethod) } })
					this.props.form.setFields({ serialNumber: { value: item.serialNumber } })
					this.props.form.setFields({ parentResourceName: { value: item.parentResourceName } })
					this.props.form.setFields({ description: { value: item.description } })
				}
			})
	}
	//新增按钮
	addBtn = () => {
		this.setState({ type: 1, editable: true })
		//重置右侧表单
		this.reset()
		if (this.state.selected.id) {
			this.props.form.setFields({ parentResourceName: { value: this.state.selected.title } })
		}
	}
	//修改按钮
	editBtn = () => {
		let selected = this.state.selected.id;
		//1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
		if (selected == "" || selected == null) {
			message.warning('没有选中数据,无法进行修改!');
			return
		}
		this.setState({ type: 2, editable: true })
	}
	//删除按钮
	delBtn = async_ => {
		let selected = this.state.selected.id;
		//1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
		if (selected == "" || selected == null) {
			message.warning('没有选中数据,无法进行删除!');
			return
		}
		let _this = this
		confirm({
			title: '删除后不可恢复,确定删除吗？',
			onOk() {
				let params = _this.state.selected.id
				DelResource({ id: params })
					.then(res => {
						if (res.success != 1) {
							alert("删除请求错误")
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
					this.addSave(params)
				} else {
					console.log(params,666)
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
			content: '您是否要进行拖拽？',
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
						this.searchTree()
					} else {
						message.error('操作失败')
					}
				})
		}
	}
	render = _ => {
		const { getFieldDecorator } = this.props.form
		return (<div className="mgrWrapper" style={{ display: "flex", height: "100%" }}>
			<Card title="资源管理" style={{ flex: 3 }}>
				<div style={{ marginBottom: "10px" }}>
					<Button type="primary" onClick={this.addBtn}>新建</Button>
					<Button onClick={this.editBtn} style={{ margin: '0 10px' }} >修改</Button>
					<Button onClick={this.delBtn}>删除</Button>
				</div>
				<Tree
					className="draggable-tree"
					defaultExpandedKeys={this.state.expandedKeys}
					defaultExpandAll={true}
					draggable
					blockNode
					onDrop={this.onDrop}
					onSelect={this.onSelect}
					treeData={this.state.treeData}
				/>
			</Card>
			<Card style={{ flex: 8 }}>
				<Form
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
				>
					<Row gutter={24}>
						{this.state.rules.map((val, index) =>
							val.key == "description" ?
								<Col key={index} span={24} style={{ display: 'block' }}>
									<FormItem
										label={val.label} labelCol={{ span: 2 }}>
										{getFieldDecorator(val.key, val.option)(val.render())}
									</FormItem>
								</Col> : <Col key={index} span={12} style={{ display: 'block' }}>
									<FormItem
										label={val.label} labelCol={{ span: 4 }}>
										{getFieldDecorator(val.key, val.option)(val.render())}
									</FormItem>
								</Col>
						)}
					</Row>
					{
						(<div style={{ textAlign: "center" }}>
							<Button type="primary" disabled={!this.state.editable} onClick={this.save}>保存</Button>
						</div>)
					}
				</Form>
			</Card>
		</div>)
	}
}
const resourcesCom = Form.create()(resources)
export default resourcesCom