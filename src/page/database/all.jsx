/***
 *  资料库--介质库管理--全部文件
 * @auth yyp
*/

import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Table, Icon, Progress } from 'antd'

// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

import { GetCOSFile } from '/api/cloudUpload.js'
import { GetFileCategories, GetFileLibrary, GetFileDownloadPower, GetFileApply, GetFileLike, GetFileCollect } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

import Pagination from '/components/pagination'
const { confirm } = Modal;
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("categorieName")) {
            list.title = list.categorieName;
        }
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}
// 标签集合
let fileLabelData = {}
// 下载队列集合
let downObj = {}
class All extends Component {
    SortTable = () => {
        setTimeout(() => {
            if (this.tableDom3) {
                let h3 = this.tableDom3.clientHeight - 155;
                this.setState({
                    h3: {
                        y: (h3)
                    }
                });
            }

        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.onresize = () => {
            this.SortTable();
        }
        this.props.onRef(this);
    }
    async componentWillMount() {
        // 查询左侧树
        this.GetFileTree()
        // 获取标签字典数据
        this.getDictInfo()
    }
    state = {
        // 表格默认滚动高度
        h3: { y: 240 },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 排序字段
        sortValue: "download_num",
        // 请求加锁 防止多次请求
        lock: false,
        //左侧角色树相关数据
        treeData: [],
        // 角色树选中项
        treeSelectInfo: null,
        //右侧table表格配置
        columns: [
            {
                title: '文件名',
                dataIndex: 'fileName',
                align: 'center',
                render: (t, r) => {
                    let style1 = r.isLike ? { margin: "0 3px 0 0", cursor: "pointer", color: "#7777f7" } : { margin: "0 3px 0 0", cursor: "pointer" }
                    let style2 = r.isCollect ? { margin: "0 3px 0 5px", cursor: "pointer", color: "#f56464" } : { margin: "0 3px 0 5px", cursor: "pointer" }
                    return <div>
                        <div>{t}</div>
                        <div style={{ color: "#bfb8b8" }}>
                            <Icon type="like" onClick={_ => this.addFileLike(r.id)} theme={r.isLike ? "filled" : "outlined"} style={style1} />{r.likeNum ? r.likeNum : 0}
                            <Icon type="heart" onClick={_ => this.addFileCollect(r.id)} theme={r.isCollect ? "filled" : "outlined"} style={style2} />{r.collectNum ? r.collectNum : 0}
                        </div>
                    </div>
                }

            },
            {
                title: '版本',
                dataIndex: 'fileVersion',
                align: 'center',
                render: (t, r) => {
                    return <div>
                        <div>{t}</div>
                        <div style={{ color: "#bfb8b8" }}>{r.downloadNum ? r.downloadNum : 0}次下载</div>
                    </div>
                }
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                align: 'center',
            },
            {
                title: '标签',
                dataIndex: 'fileLabel',
                align: 'center',
                render: (t, r) => {
                    return fileLabelData[t]
                }
            },

            {
                title: '资料类型',
                dataIndex: 'categorieName',
                align: 'center',
            },
            {
                title: '上传时间',
                dataIndex: 'uploadTime',
                align: 'center',
            },
            {
                title: '发布时间',
                dataIndex: 'publishTime',
                align: 'center',
            },
            {
                title: '资料级别',
                dataIndex: 'levelName',
                align: 'center',
            },
            {
                title: '币值',
                dataIndex: 'points',
                align: 'center',
            },
            {
                title: '资料下架日期',
                dataIndex: 'clearTime',
                align: 'center',
            },
            {
                title: '描述',
                dataIndex: 'description',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'isDownload',
                align: 'center',
                render: (t, r) => {
                    t.toString()
                    if (t == "1") {
                        return downObj[r.id] ? <Progress type="circle" percent={downObj[r.id].percent} width={40} /> : <a onClick={_ => this.downloadFile(r)} style={{ margin: "0 3px" }}>下载</a>
                    } else if (t == "0") {
                        return <a onClick={_ => this.applyFileDownload(r.id)} style={{ margin: "0 3px" }}>申请下载</a>
                    }
                }

            },

        ],
        //右侧table表格数据
        tableData: [],
        //右侧查询关键字
        searchKey: null,
        //表格选中项
        tableSelecteds: [],
        tableSelectedInfo: [],
        // 下载队列集合
        downObj: {}
    }
    // 获取数据字典-产品类别数据
    getDictInfo = async () => {
        GetDictInfo({ dictCode: "fileLabel" }).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                res.data.forEach(item => {
                    fileLabelData[item.itemCode] = item.itemValue
                })
                this.getTableData()
            }
        })
    }

    //组树数据查询
    GetFileTree = async () => {
        //请求组数据 右侧表格渲染第一列数据
        GetFileCategories()
            .then(res => {
                if (res.success != 1) {
                    message.error(res.message)
                    return
                } else {
                    assignment(res.data)
                    this.setState({
                        treeData: res.data
                    })
                }
            })
    }

    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        if (!info.selected) {
            this.setState({
                treeSelectInfo: null
            })
            return
        }
        let data = info.selectedNodes[0].props.dataRef
        this.setState({
            treeSelectInfo: data,
        }, () => {
            this.getTableData()
        })
    };


    // 获取全部文件列表数据
    getTableData = (obj = 1) => {
        let id = this.state.treeSelectInfo ? this.state.treeSelectInfo.id : ""
        let key = this.state.searchKey
        let order = this.state.sortValue == "file_name" ? {} : { order: "desc" }
        // 选中后请求文件数据
        let params = Object.assign({}, {
            categoriesId: id,
            fileName: key,
            queryType: "all",
            sort: this.state.sortValue,
            ...order
        })
        GetFileLibrary(this.state.pagination.pageSize, obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    pageSize: res.data.size,
                    current: res.data.current,
                    total: res.data.total,
                })
                this.setState({ tableData: res.data.records, pagination: pagination })
            } else {
                message.error(res.message)
            }
        })
    }
    // 列表排序
    getListBySort = (sortValue) => {
        this.setState({
            sortValue
        }, _ => {
            this.getTableData(0)
        })

    }
    //获取查询关键字选项
    getSearchKey = (e) => {
        this.setState({
            searchKey: e.target.value
        })
    }
    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { current });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
        })
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pagination = Object.assign({}, this.state.pagination, { pageSize });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
        })
    }


    // 文件下载校验
    downloadFile = (row) => {
        let key = row.id
        GetFileDownloadPower({ fileId: key, downloadType: "all" }).then(res => {
            if (!res.success) {
                message.destroy()
                message.error(res.message)
            } else {
                this.starDownloadFile(row)
            }
        })
    }
    // 文件下载
    starDownloadFile = (row) => {
        let name = row.fileName
        let key = row.id
        downObj[key] = {
            percent: 0,//上传进度
            speed: 0,//上传速率
        }
        this.setState({ downObj })
        GetCOSFile(name, key, this.getProgress).then((res) => {
            if (!res.success) {
                message.destroy()
                message.warning("下载失败!")
                delete downObj[key]
                this.setState({ downObj })
                return
            }
            let blobObj = new Blob([res.data], {
                type: res.data.headers.contentType
            });
            let url = window.URL.createObjectURL(blobObj);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = decodeURI(name);

            delete downObj[key]
            this.setState({ downObj })
            message.destroy()
            message.info("下载成功!")
            a.click();
            document.body.removeChild(a);
            this.getTableData()
        })
    }
    // 申请文件下载
    applyFileDownload = (key) => {
        let params = {
            fileId: key
        }
        GetFileApply(params).then(res => {
            if (res.success != 1) {
                message.destroy()
                message.warning(res.message)
            } else {
                message.success("该文件的下载申请已提交。")
                this.getTableData()
            }
        })
    }
    // 点赞
    addFileLike = (key) => {
        let params = {
            fileId: key
        }
        GetFileLike(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
            } else {
                this.getTableData()
                this.subpageChange()
            }
        })
    }
    // 收藏
    addFileCollect = (key) => {
        let params = {
            fileId: key
        }
        GetFileCollect(params).then(res => {
            if (res.success != 1) {
                message.error(res.message)
                return
            } else {
                this.getTableData()
                this.subpageChange()
            }
        })
    }
    // 子模块数据发生变化 通知子页面列表数据更新
    subpageChange = _ => {
        this.props.listUpdate()
    }
    // 获取文件下载进度
    getProgress = (key, progressData) => {
        downObj[key] = {
            percent: Number((progressData.percent * 100).toFixed(0)),//上传进度
            speed: Number((progressData.speed / 1024).toFixed(0)),//上传速率
        }
        console.log(key, progressData)
        console.log(downObj)
        this.setState({
            downObj
        })
    }
    render = _ => {
        const { h3 } = this.state;
        return <div style={{ height: '100%' }} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant treeData={this.state.treeData} selectedKeys={[this.state.treeSelectInfo ? this.state.treeSelectInfo.id : null]}
                        search={false} edit={false}
                        onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '0px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                    <Form style={{ width: '100%' }}>
                        <Row>
                            <Col span={12}>
                                <Input placeholder="请输入关键字" value={this.state.searchKey} onChange={this.getSearchKey} style={{ width: '200px', marginRight: "10px" }} />
                                <Button type="primary" onClick={_ => this.getTableData(0)}>查询</Button>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "20px" }}>
                            <div className="icons-list">
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "download_num" ? "red" : "" }} onClick={_ => this.getListBySort("download_num")}><Icon type="fire" theme="filled" />最热</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "like_num" ? "red" : "" }} onClick={_ => this.getListBySort("like_num")}><Icon type="like" theme="filled" />点赞</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "collect_num" ? "red" : "" }} onClick={_ => this.getListBySort("collect_num")}><Icon type="heart" theme="filled" />收藏</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "file_name" ? "red" : "" }} onClick={_ => this.getListBySort("file_name")}><Icon type="font-colors" />首字母</span>
                                <span style={{ marginLeft: "20px", cursor: "pointer", color: this.state.sortValue == "publish_time" ? "red" : "" }} onClick={_ => this.getListBySort("publish_time")}><Icon type="clock-circle" />更新时间</span>
                            </div>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom3 = el}>
                        <Table bordered dataSource={this.state.tableData} columns={this.state.columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} scroll={h3} size="small" />
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                    </div>


                </Col>
            </Row>

        </div>
    }

}
const Alls = Form.create()(All)
export default Alls













