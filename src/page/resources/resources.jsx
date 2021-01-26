import React, { Component } from 'react'
import { Tree, Input, Button, message, Select, Form, Row, Col, Modal, Card, Tooltip } from 'antd'
import { GetResourceTree, AddResource, EditResource, DelResource, GetResourceInfo } from '/api/resources'
import { GetDictInfo } from '/api/dictionary'
const FormItem = Form.Item
const { Option } = Select
const { TextArea, Search } = Input
const { confirm } = Modal;
const { TreeNode } = Tree;
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
// 获取父级节点
const getParentKey = (key, tree) => {
	let parentKey;
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (node.children) {
			if (node.children.some(item => item.key === key)) {
				parentKey = node.key;
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children);
			}
		}
	}
	return parentKey;
};
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
			resourceType: [],
			visible: [],
			openMethod: []
		},
		//资源数数据
		treeData: [],
		treeDataList: [],
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
					<Option value={"1"}>固定子菜单</Option>
					<Option value={"2"}>工作台左侧portalet</Option>
					<Option value={"3"}>工作台右侧portalet</Option>
					<Option value={"4"}>外部链接</Option>
					<Option value={"5"}>普通按钮</Option>
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
				// option: {
				// 	rules: [
				// 		{
				// 			message: "请输入数字",
				// 			pattern: "^[0-9]*$",
				// 			trigger: "blur",
				// 		}
				// 	]
				// },
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
				render: _ => <TextArea disabled={!this.state.editable} />
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
					this.generateList(res.data)
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
		console.log(info,254)
		this.setState({
			selected: {
				id: selectedKeys[0],//资源树当前选中项
				title: info.selectedNodes[0].props.name//当前选中项name
			},
			type: null, editable: false
		});
		//通过获取key值从资源树查询对应资源详情
		// let item = this.getDataByTree(this.state.treeData, selectedKeys[0]);
		console.log(info.selectedNodes,125)
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
	// tree搜索
	onSearchTree = value => {
		const expandedKeys = this.state.treeDataList
			.map(item => {
				if (item.title.indexOf(value) > -1) {
					return getParentKey(item.key, this.state.treeData);
				}
				return null;
			})
			.filter((item, i, self) => item && self.indexOf(item) === i);
		console.log(expandedKeys, 999)
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true,
		});
	};
	// tree数据扁平化处理方法
	generateList = data => {
		for (let i = 0; i < data.length; i++) {
			const node = data[i];
			const { key, title } = node;
			this.state.treeDataList.push({ key, title: title });
			if (node.children) {
				this.generateList(node.children);
			}
		}
	}
	//新增按钮
	addBtn = () => {
		this.setState({ type: 1, editable: true })
		//重置右侧表单
		this.reset()
		if (this.state.selected.id) {
			this.props.form.setFields({ parentResourceName: { value: this.state.selected.title }, visible: { value: 1 } })
		}
	}
	//修改按钮
	editBtn = () => {
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
		let selected = this.state.selected.id;
		//1 判断角色组tree是否有选中 如无选中提示无选中数据无法修改
		if (selected == "" || selected == null) {
			message.destroy()
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
					this.addSave(params)
				} else {
					console.log(params, 666)
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
		const { searchValue, expandedKeys, } = this.state;
		const loopNode = data =>
			data.map(item => {
				const index = item.title.indexOf(searchValue);
				const beforeStr = item.title.substr(0, index);
				const afterStr = item.title.substr(index + searchValue.length);
				const title =
					index > -1 ? (
						<span>
							{beforeStr}
							<span style={{ color: '#f50' }}>{searchValue}</span>
							{afterStr}
						</span>
					) : (
							<span>{item.title}</span>
						);
				if (item.children) {
					return (
						<TreeNode key={item.key} name={item.resourceName} title={title}>
							{loopNode(item.children)}
						</TreeNode>
					);
				}
				return <TreeNode key={item.key}  name={item.resourceName}  title={title} />;
			});
		return (<div className="mgrWrapper" style={{ display: "flex", height: "100%" }}>
			<Card style={{ flex: 3 }}>
				<div style={{ marginBottom: "10px" }}>
					<Row>
						<Col span={12}>
							<Search
							    allowClear
								placeholder="请输入资源名称"
								onSearch={this.onSearchTree} />
						</Col>
						<Col span={12} style={{ textAlign: "right" }}>
							<Button title="删除" type="info" icon="delete" onClick={this.delBtn}></Button>
							<Button title="修改" type="info" icon="edit" onClick={this.editBtn} style={{ margin: '0 10px' }}></Button>
							<Button title="新增" type="primary" icon="plus" onClick={this.addBtn}></Button>
						</Col>
					</Row>
				</div>
				<Tree
					className="draggable-tree"
					defaultExpandAll={true}
					draggable
					blockNode
					expandedKeys={expandedKeys}
					onExpand={this.onExpand}
					onDrop={this.onDrop}
					onSelect={this.onSelect}
				>
					{loopNode(this.state.treeData)}
				</Tree>
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
					<Row >
						<Col span={21} style={{ display: 'block', textAlign: "right" }}>
							<Button type="primary" disabled={!this.state.editable} onClick={this.save}>保存</Button>
						</Col>
					</Row>
				</Form>
			</Card>
		</div >)
	}
}
const resourcesCom = Form.create()(resources)
export default resourcesCom