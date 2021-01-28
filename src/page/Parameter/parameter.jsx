// 系统管理----系统参数

import React, { Component } from 'react'
import { Button, Row, Col, Tree, Input, Table, Modal, message, Form} from 'antd'


const { TreeNode } = Tree;
const { Search } = Input;
const { confirm } = Modal;

// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

// 行内编辑表格组件
import EditTable from "./EditableCell/editableCell.jsx";
// 分页组件
import Pagination from "@/components/pagination/index";


// 引入 API接口
import { getSystemTree, getLists,getInfoTree, addTree, updateTree, deleteTree} from '/api/systemParameter'





const getParentKey = (title, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.title === title)) {
                parentKey = node.key;
            } else if (getParentKey(title, node.children)) {
                parentKey = getParentKey(title, node.children);
            }
        }
    }
    return parentKey;
};

const dataList = [];

const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({key, title: node.title});
        if (node.children) {
            generateList(node.children);
        }
    }
};


class Parameter extends Component {
    state = {
        // 对话框
        treeVisible: false,
        middleStatus:'addTree',
        middle:{
            addTree:'新增参数类别',
            editTree:'编辑参数类别'
        },
        selectedTreeId: null, //选中当前的喜人类型ID集合

        categoryParentId:null,  //当前选中的系统类别的父级ID
        treeData:[],
        form:{
            limit:10,
            offset:1,
            parameterCategoryId:''
        },
        total:0,  //表格分页---设置显示一共几条数据
        pageSize:10,
        current:0,
        loading:false,  //表格加载太
        selectedKeys:[],
        selectedKeyss:[],
        columns: [
            {
                title: '参数名称',
                dataIndex: 'paramterName'
            }, {
                title: '参数值',
                dataIndex: 'parameterValue'
            }, {
                title: '参数描述',
                dataIndex: 'description',
            }, {
                title: '状态',
                dataIndex: 'status',
                render: t => t == '1' ? '启用' : '禁用'
            }, {
                title: '操作',
                dataIndex: 'action',
                render: () => <div> <a style={{marginRight: '15px'}} onClick={this.edit} >修改</a> <a onClick={this.delete}>删除</a></div>
                // render: () => <div><Button type="primary" onClick={this.edit} style={{marginRight: '15px'}}>修改</Button><Button type="danger" onClick={this.delete}>删除</Button></div>,
            }
        ],
        tabledata: [],

        addrules:[{
            label: '参数类别名称',
            key: 'parameterCategoryName',
            option: {
                rules: [{
                    required: true, message: '参数类别名称不能为空',
                }]
            },
            render: _ => <Input style={{ width:250 }} />
        },{
            label: '上级分类',
            key: 'parentName',
            render: _ => <Input disabled style={{ width:250 }} />
        }],
        h:{y:240},  //设置表格的高度
    }


    async componentDidMount() {
       
        //  获取系统参数类型树
        this.init();

        // 获取系统参数列表
        this.getTableList(this.state.form)


        this.SortTable();
        //窗口变动的时候调用
        // window.onresize = () => {
        //     this.SortTable();
        // }
        window.addEventListener("resize", ()=>{this.SortTable()}, false)

    }

    // 获取表格高度
    SortTable = () => {
        setTimeout(() => {
            console.log(this.tableDom.offsetHeight);
            let h = this.tableDom.clientHeight - 180;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }


    // 修改数据默认的 key  title
    assignment = (data) => {
        data.forEach((list, i) => {
            list.key = list.id;
            if (list.hasOwnProperty("parameterCategoryName")) {
                list.title = list.parameterCategoryName;
            }
            if (list.hasOwnProperty("children")) {
                if (list.children.length > 0) {
                    this.assignment(list.children)
                }
            } else {
                return
            }
        });
        return data;
    }



    init=()=>{

        // 获取系统参数类型树
        getSystemTree({parameterCategoryName:this.state.searchValue}).then(res => {
            if (res.success == 1) {
                this.setState({treeData:this.assignment(res.data)})
                // 默认选中第一个
                // this.setState({ selectedTreeId: selectedKeys ,selectedKeyss})
            }else {
                message.error(res.message);
            }
        })
    }
    // 获取系统参数列表
    getTableList=(form)=> {
        getLists(form).then(res => {
            if (res.success == 1) {
                this.setState({
                    tabledata: res.data.records,
                    total: parseInt(res.data.total)
                })
            } else {
                message.error(res.message);
            }
        })

    }

    // 获取参数类别详情
    getInfo=(id)=> {
        getInfoTree({id:id}).then(res => {
            if (res.success == 1) {
                if (this.state.middleStatus == 'addTree'){
                    this.props.form.setFieldsValue({
                        parameterCategoryName:'',
                        parentName:res.data.parentName
                    })
                }else if (this.state.middleStatus == 'editTree') {
                    this.props.form.setFieldsValue({
                        parameterCategoryName:res.data.parameterCategoryName,
                        parentName:res.data.parentName
                    })
                }
               
                this.setState({
                    categoryParentId:parseInt(res.data.parentId)
                })
            } else {
                message.error(res.message);
            }
        })

    }

    
    /****************************       左侧--节点树相关逻辑函数        *******************************/

    // 新增节点---分类
    addTree=()=>{
        if (this.state.selectedTreeId) {
            var id = parseInt(this.state.selectedTreeId[0]);
            // 获取系统类别详情
            this.getInfo(id);

            this.setState({
                treeVisible:true,
                middleStatus:'addTree'
            })
        } else {
            message.warning('请先选择系统参数类别！')
        }
    }

    // 编辑节点--类别
    editTree=()=>{
        if (this.state.selectedTreeId) {
            var id = parseInt(this.state.selectedTreeId[0]);
            // 获取系统类别详情
            this.getInfo(id);

            this.setState({
                treeVisible:true,
                middleStatus:'editTree'
            })
        } else {
            message.warning('请先选择系统参数类别！')
        }
    }

    // 删除节点--类别
    deletetTree=()=>{
        var _this = this;
        if (this.state.selectedTreeId) {
            var id = parseInt(_this.state.selectedTreeId[0]);
            confirm({
                title: '删除',
                content: '您确定删除此系统类别？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    
                    // 走删除接口
                    deleteTree({ id: id }).then(res => {
                        if (res.success == 1) {
                            message.success(res.message);
                            //  获取系统参数类型树
                            _this.init();
                        } else if (res.success == 0) {
                            message.error(res.message);
                        }
                    })
                },
                onCancel() {
                    message.info('取消删除！');
                },
            });

        } else {
            message.warning('请先选择系统参数类别！')
        }
    }

    // 关闭对话框
    handleCancel=()=>{
        this.setState({
            treeVisible:false,
        })
    }

    // 树选中后
    onSelect = (selectedKeys, info) => {
        let {selectedKeyss} = this.state;
        
        if(selectedKeys.length) {
            selectedKeyss = [...selectedKeys]
        }
        var id = parseInt(selectedKeyss[0]);

        this.setState({ selectedTreeId: selectedKeyss ,selectedKeyss})
        let data = Object.assign({}, this.state.form, { parameterCategoryId: id })
        
        this.setState({
            form: data
        },()=>{
            // 调用接口
            this.getTableList(this.state.form)
        })
    };



    //拖拽左侧--系统类别节点树
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
                pid = ar[ar.length - 1].parentId;
            } else {
                ar.splice(i + 1, 0, dragObj);
                pid = ar[0].parentId;
            }
        }
        


        //发起拖拽变更请求
        let _this = this
        confirm({
            content: '您是否要进行拖拽？',
            onOk() {
                _this.treeNodeChange({
                    id: dragObj.id,
                    parentId: pid
                })
            },
        });

    };
    // 拖拽节点变更
	treeNodeChange = async (dropParams) => {
		if (dropParams.hasOwnProperty("id") && dropParams.hasOwnProperty("parentId")) {
            updateTree(dropParams).then(res => {
                if (res.success == 1) {
                    this.init()
                } else {
                    message.error(res.message)
                }
            })
		}
	}


    // 展开/收起节点时触发
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };



    //获取表单数据
    getFormData = _ => {
        let params;
        this.props.form.validateFieldsAndScroll(null, {}, (err, val) => {
            if (!err || !Object.getOwnPropertyNames(err).length) {//校验完成执行的逻辑 获取合并后的表单数据
                params = Object.assign({}, val)
            }
        })
        return params;
    }


    // 确定修改系统类别--事件按钮
    handleOk = () => {
        let id = parseInt(this.state.selectedTreeId[0]);

        let paramsName = this.getFormData().parameterCategoryName;
        let param = {
            parentId:this.state.categoryParentId,
            id:id,
            parameterCategoryName:paramsName
        }
        
        if (this.state.middleStatus == 'addTree') {
            addTree(param).then(res=>{
                if (res.success == 1) {
                    message.success(res.message);
                    // 关闭对话框
                    this.handleCancel()
                    //  获取系统参数类型树
                    this.init();
                }else if (res.success == 0){
                    message.error(res.message);
                }
               
            })
        }else if (this.state.middleStatus == 'editTree') {
            updateTree(param).then(res=>{
                if (res.success == 1) {
                    message.success(res.message);
                    // 关闭对话框
                    this.handleCancel()
                     //  获取系统参数类型树
                     this.init();
                }else if (res.success == 0){
                    message.error(res.message);
                }
            })
        }
    };



    /****************************       右侧--表格 相关逻辑函数        *******************************/
    // 页码改变的回调，参数是改变后的页码及每页条数
    onPageChange = (page, pageSize) => {
        let data = Object.assign({}, this.state.form, { offset: page })

        this.setState({
            current: (page - 1) * pageSize,
            form: data
        }, () => {
            // 调用接口
            this.getTableList(this.state.form)
        })
    }

    // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
    onShowSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.form, { offset: 1, limit: pageSize })

        this.setState({
            current: 0,
            pageSize: pageSize,
            form: data
        }, () => {
           // 调用接口
           this.getTableList(this.state.form)
        })


    }

    handleChange=()=>{
         // 获取系统参数列表
         this.getTableList(this.state.form)
    }




    render=()=>{
        // 节点树对话框中的Form
        const { getFieldDecorator } = this.props.form;
        
        const { autoExpandParent, treeData,h} = this.state;
        
       
        // 进行数组扁平化处理
        generateList(treeData);

        
        const data = this.assignment(this.state.treeData)


        return (
            <div style={{ border: '0px solid red', background: ' #fff',height:'100%' }} >
                <Row gutter={24} className="main_height">
                    <Col span={5} className="gutter-row" style={{ backgroundColor: 'white',paddingTop:'16px',height:'99.7%',borderRight:'5px solid #f0f2f5'}}>
                        <TreeParant treeData={data} draggable={true} showLine={true}
                            addTree={this.addTree} editTree={this.editTree} deletetTree={this.deletetTree} 
                            onDrop={this.onDrop} onExpand={this.onExpand} onSelect={this.onSelect} selectedKeys={this.state.selectedKeyss}  //点击树节点触发事件
                        ></TreeParant>
                    </Col>
                    <Col span={19} className="gutter-row main_height" style={{ padding: '0 10px 0', backgroundColor: 'white',display:'flex',flexDirection:'column',flexWrap:'nowrap'}}>
                        {/* 表格行内编辑--模板 */}
                        <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                            <EditTable scroll={h} style={{ marginTop: '16px', padding: '0px 15px',height:h,overflowY:'auto'}} parentValueID={this.state.form.parameterCategoryId} data={this.state.tabledata} handleChange={this.handleChange}>
                                <Pagination total={this.state.total} pageSize={this.state.form.limit} current={(this.state.form.offset)} onShowSizeChange={this.onShowSizeChange} onChange={this.onPageChange}></Pagination>
                            </EditTable>
                        </div>
                        
                        {/* 分页组件 */}
                        {/* <Pagination total={this.state.total} pageSize={this.state.form.limit} current={this.state.form.offset} onChange={this.onPageChange}></Pagination> */}
                    </Col>
                </Row>

                {/* 对话框 */}
                <Modal title={this.state.middle[this.state.middleStatus]} visible={this.state.treeVisible} onCancel={this.handleCancel} onOk={this.handleOk}>
                    {<Form>
                        <Row gutter={24}>
                            {this.state.addrules.map((val, index) =>
                                <Col key={index} style={{ display: 'block' }}>
                                    <Form.Item
                                        label={val.label} labelCol={{ span: 6 }}>
                                        {getFieldDecorator(val.key, val.option)(val.render())}
                                    </Form.Item>
                                </Col>)}
                        </Row>
                    </Form>}
                </Modal>
            </div>
        )
    }
}

const ParameterForm = Form.create()(Parameter)
export default ParameterForm;