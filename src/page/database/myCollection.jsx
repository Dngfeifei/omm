/***
 *  资料库--我的收藏
 * @auth yyp
*/


import React, { Component } from 'react'

import { Form, message, Button, Row, Col, Input, Table, Icon, Spin, Progress } from 'antd'

import { GetCOSFile } from '/api/cloudUpload.js'
import { GetFileLibrary, GetFileDownloadPower, GetFileApply, GetFileLike, GetFileCollect } from '/api/mediaLibrary.js'
import { GetDictInfo } from '/api/dictionary'  //数据字典api

import Details from "./details"
import Pagination from '/components/pagination'

// 标签字典对象集合
let fileLabelData = {}
// 下载队列集合
let downObj = {}
class DownloadAudit extends Component {
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.onresize = () => {
            this.SortTable();
        }
    }
    componentWillMount() {
        this.getDictInfo()
    }
    state = {
        // 表格默认滚动高度
        h: { y: 240 },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 请求加锁 防止多次请求
        lock: false,
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
                        <div><a onClick={_=>{this.showDetails(r)}}>{t}</a></div>
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
            // {
            //     title: '标签',
            //     dataIndex: 'fileLabel',
            //     align: 'center',
            //     render: (t, r) => {
            //         return fileLabelData[t]
            //     }
            // },
            // {
            //     title: '资料类型',
            //     dataIndex: 'categorieName',
            //     align: 'center',
            // },
            // {
            //     title: '上传时间',
            //     dataIndex: 'uploadTime',
            //     align: 'center',
            // },
            // {
            //     title: '发布时间',
            //     dataIndex: 'publishTime',
            //     align: 'center',
            // },
            {
                title: '资料级别',
                dataIndex: 'levelName',
                align: 'center',
            },
            // {
            //     title: '币值',
            //     dataIndex: 'points',
            //     align: 'center',
            // },
            // {
            //     title: '下架日期',
            //     dataIndex: 'clearTime',
            //     align: 'center',
            // },
            // {
            //     title: '描述',
            //     dataIndex: 'description',
            //     align: 'center',
            // },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'isDownload',
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
        // 下载队列集合
        downObj: {},
        // 当前要展示的详情数据
        details: {},
        detailsModalvisible: false
    }
    // 获取标签字典数据
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
    // 获取收藏列表数据
    getTableData = (obj = 1) => {
        let key = this.state.searchKey
        // 2 发起查询请求 查询后结构给table赋值
        // 选中后请求文件数据
        let params = Object.assign({}, {
            fileName: key,
            queryType: "collect"
        })

        GetFileLibrary(this.state.pagination.pageSize, obj ? (this.state.pagination.current - 1) * this.state.pagination.pageSize : 0, params).then(res => {
            if (res.success == 1) {
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total
                })
                this.setState({ tableData: res.data.records, pagination })
            } else {
                message.error(res.message)
            }
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
        let pagination = Object.assign({}, this.state.pagination, { current: current });
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
        let pagination = Object.assign({}, this.state.pagination, { pageSize: pageSize });
        this.setState({
            pagination,
            tableSelecteds: [],
            tableSelectedInfo: []
        }, _ => {
            this.getTableData()
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
            } else {
                this.getTableData()
            }
        })
    }
    // 文件下载校验
    downloadFile = (row) => {
        let key = row.id
        GetFileDownloadPower({ fileId: key, downloadType: "collect" }).then(res => {
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
            }
        })
    }
    // 获取文件下载进度
    getProgress = (key, progressData) => {
        downObj[key] = {
            percent: Number((progressData.percent * 100).toFixed(0)),//上传进度
            speed: Number((progressData.speed / 1024).toFixed(0)),//上传速率
        }
        this.setState({
            downObj
        })
    }
    // 展示详情
    showDetails = (r) => {
        this.setState({
            details: r,
            detailsModalvisible: true
        })
    }
    // 关闭详情
    closeDetails = () => {
        this.setState({
            details: {},
            detailsModalvisible: false
        })
    }
    render = _ => {
        const { h } = this.state;
        return <div style={{ height: "100%", padding: '20px 10px', }}>
            <div className="main_height" style={{ boxSizing: "border-box", backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
                <Form style={{ width: '100%' }}>
                    <Row>
                        <Col span={12}>
                            <Input allowClear placeholder="请输入关键字" value={this.state.searchKey} onChange={this.getSearchKey} style={{ width: '200px', marginRight: "10px" }} />
                            <Button type="primary" onClick={_ => this.getTableData(0)}>查询</Button>
                        </Col>
                    </Row>
                </Form>
                <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                    <Table bordered dataSource={this.state.tableData} columns={this.state.columns} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} scroll={h} size="small" />
                    <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} size="small" />
                </div>
            </div>
            {/* 详情 */}
            {this.state.detailsModalvisible ? <Details onCancel={this.closeDetails} data={this.state.details}></Details> : ""}
        </div>
    }

}
export default DownloadAudit













