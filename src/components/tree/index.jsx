import React, { Component } from 'react'
import { Spin, Tree, Input, Icon, Button, Row, Col, Tooltip, Form } from 'antd'

// 参数类型
import PropTypes from 'prop-types'



// 定义节点树节点
const { TreeNode } = Tree;
// 定义搜索
const { Search } = Input;

// 引入Css
import "./tree.css";





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
        dataList.push({ key, title: node.title });
        if (node.children) {
            generateList(node.children);
        }
    }
};


class TreeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: [],//节点数据
            visible: true,//加载loading

            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true
        }

    }

    // 设置默认props
    static defaultProps = {
        // 是否自动展开父节点
        autoExpandParent: true,
        // 节点前添加 Checkbox 复选框
        checkable: false,
        // 默认选中复选框的树节点
        defaultCheckedKeys: [],
        // 默认展开所有树节点
        defaultExpandAll: true,
        // 默认展开指定的树节点
        defaultExpandedKeys: [],
        // 默认选中的树节点
        defaultSelectedKeys: [],
        // 设置节点可拖拽（IE>8）
        draggable: false,
        // 支持点选多个节点（节点本身）
        multiple: false,
        // 是否可选中 
        selectable: true,
        // 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式
        showIcon: false,
        // 是否展示连接线
        showLine: true,
        // 是否开启搜索功能（查）
        search: true,
        // 是否开启编辑功能（增删改）
        edit: true,
    }

    // 挂载完成时
    componentDidMount() {
        this.setState({
            treeData: this.props.treeData, //将传入的树  数据进行加载出来
            visible: false
        });

    };


    loop = data => data.map((item) => {
        let { searchValue } = this.state;
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title = index > -1 ? (
            <span>
                {beforeStr}
                <span style={{ color: '#4876e7', fontWeight: 'bold' }}>{searchValue}</span>
                {afterStr}
            </span>
        ) : <span>{item.title}</span>;
        if (item.children) {
            return (
                <TreeNode key={item.key} title={title} dataRef={item}>
                    {this.loop(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode dataRef={item} key={item.key} title={title} />;
    });



    // 输入框搜索节点
    searchChange = (value) => {
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.title, this.props.treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);


        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };



    render = () => {

        const { treeData, autoExpandParent, checkable, defaultCheckedKeys, defaultExpandAll, defaultExpandedKeys, defaultSelectedKeys, draggable, multiple, selectable, showIcon,
            showLine, onCheck, onDragEnd, onDrop, onExpand, onRightClick, onSelect, selectedKeys, search, edit

        } = this.props;
        // 进行数组扁平化处理
        generateList(treeData);

        return (
            <div className="TreeContent">
                <Spin tip="Loading..." spinning={this.state.visible}>
                    <Row>
                        {
                            search ? <Col span={12}>
                                <Search allowClear placeholder='请输入关键词' onSearch={this.searchChange} />
                            </Col> : ""
                        }

                        {
                            edit ? <div className="btn" style={{ position: 'absolute', right: '0px' }}>
                                <Tooltip placement="top" title='删除'>
                                    <Button onClick={this.props.deletetTree} icon="delete" />
                                </Tooltip>
                                <Tooltip placement="top" title='编辑'>
                                    <Button onClick={this.props.editTree} icon="edit" style={{ margin: '0 10px' }} />
                                </Tooltip>
                                <Tooltip placement="top" title='新增'>
                                    <Button type="primary" onClick={this.props.addTree} icon="plus" />
                                </Tooltip>
                            </div> : ""
                        }
                    </Row>
                    <div className="treeContantier">
                        <Tree
                            // style={{ paddingTop: '5px' }}
                            className="tree"
                            autoExpandParent={autoExpandParent}   // 是否自动展开父节点
                            checkable={checkable}  // 节点前添加 Checkbox 复选框
                            defaultCheckedKeys={defaultCheckedKeys}  // 默认选中复选框的树节点
                            defaultExpandAll={defaultExpandAll}  //  默认展开所有树节点
                            // treeData={treeData}   // 展示数据（array）
                            defaultExpandedKeys={defaultExpandedKeys}   // 默认展开指定的树节点
                            defaultSelectedKeys={defaultSelectedKeys} // 默认选中的树节点
                            selectedKeys={selectedKeys}
                            draggable={draggable}  // 设置节点可拖拽（IE>8）
                            multiple={multiple} // 支持点选多个节点（节点本身）
                            selectable={selectable} // 是否可选中 
                            showIcon={showIcon}  // 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式
                            showLine={showLine}     // 是否展示连接线
                            //以下是事件触发
                            onCheck={onCheck} // 点击复选框触发（跟treeData属性搭配）
                            onDragEnd={onDragEnd}  // dragend 触发时调用（跟treeData属性搭配）
                            onDrop={onDrop}  // drop 触发时调用（跟treeData属性搭配）
                            onExpand={onExpand}  // 展开/收起节点时触发
                            onRightClick={onRightClick} // 响应右键点击
                            onSelect={onSelect}  //点击树节点触发
                        >{this.loop(treeData)}</Tree>
                    </div>

                </Spin>
            </div>
        )
    }
}



// 设置props参数类型
TreeList.propTypes = {
    // 是否自动展开父节点
    autoExpandParent: PropTypes.bool,
    // 展示数据（array）
    treeData: PropTypes.array,
    // 节点前添加 Checkbox 复选框
    checkable: PropTypes.bool,
    // 默认选中复选框的树节点
    defaultCheckedKeys: PropTypes.array,
    // 默认展开所有树节点
    defaultExpandAll: PropTypes.bool,
    // 默认展开指定的树节点
    defaultExpandedKeys: PropTypes.array,
    // 默认选中的树节点
    defaultSelectedKeys: PropTypes.array,
    // 设置节点可拖拽（IE>8）
    draggable: PropTypes.bool,
    // 支持点选多个节点（节点本身）
    multiple: PropTypes.bool,
    // 是否可选中
    selectable: PropTypes.bool,
    // 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式
    showIcon: PropTypes.bool,
    // 是否展示连接线
    showLine: PropTypes.bool,
};

export default TreeList;