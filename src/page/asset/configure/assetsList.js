import React, { Component } from 'react'
import { Row, Col,  Input, Select,  DatePicker,Upload,Form,Icon } from 'antd'
const { Option } = Select;
const FormItem = Form.Item
const { TextArea,Search} = Input;

export const baseData = {}

//查询条件
export const rules1= [
    {
        label: '模糊查询',
        key: 'x',
        // render: _this => <Input placeholder="请输入查询条件" />
        render: _this => {
            const options = _this.state.searchData.map(d => <Option key={d}>{d}</Option>);
            return <Select
                showSearch
                value={_this.state.searchX}
                placeholder="请输入查询"
                style={{minWidth:195}}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={_this.handleSearch}
                onChange={_this.handleChange}
                notFoundContent={null}
            >
                {options}
            </Select>
        }
    }
]
export const rules2= [
    {
        label: '项目号',
        key: 'a',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入项目号" onChange={({target:{value}}) => _this.onChangeSearch('a',value)}/>
    },
    {
        label: '项目名称',
        key: 'b',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入项目名称" onChange={({target:{value}}) => _this.onChangeSearch('b',value)}/>
       
    },{
        label: '服务区域',
        key: 'c',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入服务区域" onChange={({target:{value}}) => _this.onChangeSearch('c',value)}/>
    },{
        label: '品牌',
        key: 'd',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入品牌名称" onChange={({target:{value}}) => _this.onChangeSearch('d',value)}/>
       
    },{
        label: '数据库名称',
        key: 'f',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入产品线" onChange={({target:{value}}) => _this.onChangeSearch('f',value)}/>
       
    },{
        label: '数据库版本',
        key: 'g',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入产品型号" onChange={({target:{value}}) => _this.onChangeSearch('g',value)}/>
    },{
        label: 'OS版本',
        key: 'h',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入MODEL型号" onChange={({target:{value}}) => _this.onChangeSearch('h',value)}/>
    },{
        label: '客户名称',
        key: 'i',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入客户名称" onChange={({target:{value}}) => _this.onChangeSearch('i',value)}/>
    }
]
export const rules3= [
    {
        label: '项目号',
        key: 'a',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入项目号" onChange={({target:{value}}) => _this.onChangeSearch('a',value)}/>
    },
    {
        label: '项目名称',
        key: 'b',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入项目名称" onChange={({target:{value}}) => _this.onChangeSearch('b',value)}/>
       
    },{
        label: '服务区域',
        key: 'c',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入服务区域" onChange={({target:{value}}) => _this.onChangeSearch('c',value)}/>
    },{
        label: '品牌',
        key: 'd',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入品牌名称" onChange={({target:{value}}) => _this.onChangeSearch('d',value)}/>
       
    },{
        label: '中间件名称',
        key: 'f',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入产品线" onChange={({target:{value}}) => _this.onChangeSearch('f',value)}/>
       
    },{
        label: '客户名称',
        key: 'h',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入MODEL型号" onChange={({target:{value}}) => _this.onChangeSearch('h',value)}/>
    },{
        label: '版本',
        key: 'i',
        render: _this => <Input style={{ width: 200 }} placeholder="请输入客户名称" onChange={({target:{value}}) => _this.onChangeSearch('i',value)}/>
    }
]
function render(_this,type,selectData,itemCode,itemValue) {
    if(type == 'input1'){
        return <Input placeholder="请输入" />
    }else if(type == 'input2'){
        return <Input disabled placeholder="项目带入" />
    }else if(type == 'input3'){
        return <Input placeholder="请选择项目号" suffix={<Icon type="appstore" className="dateIcon" onClick={_this.openProject} />} />
    }else if(type == 'select'){
        return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                    {
                        _this.state.selectData[selectData] ? _this.state.selectData[selectData].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        }):[].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        })
                    }
                </Select>
    }else if(type == 'select1'){
        return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true} onChange={_this.onAreaChange}>
                    {
                        _this.state.selectData[selectData] ? _this.state.selectData[selectData].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        }):[].map((items, index) => {
                            return (<Option key={index} value={itemCode ? items[itemCode]:items.id} >{itemValue ? items[itemValue] : items.name}</Option>)
                        })
                    }
                </Select>
    }else if(type == 'textarea'){
        return <TextArea placeholder="请输入" rows={4}/>
    }else if(type == 'date'){
        return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
    }
}
function renderDom(obj) {
    return {
        key:obj.key,
        label:obj.title,
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:obj.inputType,
    }  
}
export const assetsListData = {
    //配置项名称
    'basedataTypeId':{
        key:'basedataTypeId',
        label:'配置项名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'select',
    },
    //项目号
    'projectNumber':{
        key:'projectNumber',
        label:'项目号',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: (_this) =>{
            return <Input placeholder="请选择项目号" suffix={<Icon type="appstore" className="dateIcon" onClick={_this.openProject} />} />;
        },
        render: render,
        type:'input3',
    },
    //项目名称
    'projectName':{
        key:'projectName',
        label:'项目名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //项目经理
    'projectManagerName':{
        key:'projectManagerName',
        label:'项目经理',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //客户名称
    'custId':{
        key:'custId',
        label:'客户名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render: render,
        type:'select',
    },
    //结束时间
    'projectEndDate':{
        label: '结束时间',
        key: 'projectEndDate',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
        render: render,
        type:'date',
    },
    //开始时间
    'projectStartDate':{
        label: '开始时间',
        key: 'projectStartDate',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:_=>  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
        render: render,
        type:'date',
    },
    //项目经理
    'projectManagerName':{
        key:'projectManagerName',
        label:'项目经理',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //项目销售
    'projectSalesmanName':{
        key:'projectSalesmanName',
        label:'项目销售',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Input placeholder="请选择项目号带入" />;
        },
        render: render,
        type:'input2',
    },
    //服务区域
    'projectAreaId':{
        key:'projectAreaId',
        label:'服务区域',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: render,
        type:'select1',
    },
    //机房地址
    'projectAreaAddress':{
        key:'projectAreaAddress',
        label:'机房地址',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        },
        render:render,
        type:'input1'
    },
    //机房管理员
    'custUserName':{
        key:'custUserName',
        label:'机房管理员',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="placeholder" />;
        },
        render:render,
        type:'input1'
    },
    //客户
    'custId':{
        key:'custId',
        label:'客户',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render:render,
        type:'select'
    },
    //客户管理员
    'custUserId':{
        key:'custUserName',
        label:'客户管理员',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //联系方式
    'custUserMobile':{
        key:'custUserMobile',
        label:'联系方式',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Input placeholder="请输入联系方式" />;
        },
        render:render,
        type:'input1'
    },
    //产品类别
    'serviceClassId':{
        key:'serviceClassId',
        label:'产品类别',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //技术方向
    'skillTypeId':{
        key:'skillTypeId',
        label:'技术方向',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //品牌
    'brandId':{
        key:'brandId',
        label:'品牌',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //产品线
    'productLineId':{
        key:'productLineId',
        label:'产品线',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: () =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //产品型号
    'productModelId':{
        key:'productModelId',
        label:'产品型号',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //产品等级
    'productLevel':{
        key:'productLevel',
        label:'产品等级',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: () =>{
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>;
        },
        render:render,
        type:'select'
    },
    //产品名称
    'productName':{
        key:'productName',
        label:'产品名称',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Input placeholder="请输入" />;
        },
        render:render,
        type:'input1'
    },
    //应用类别
    'appTypeId':{
        label: '应用类别',
        key: 'appTypeId',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>  {
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>
        },
        render:render,
        type:'select'
    },
    //风险等级
    'riskLevelId':{
        label: '风险等级',
        key: 'riskLevelId',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>  {
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>
        },
        render:render,
        type:'select'
    },
    //是否维护
    'isMroId':{
        label: '是否维护',
        key: 'isMroId',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            }
          ],
          render: _this =>  {
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>
        },
        render:render,
        type:'select'
    },
    //用途
    'usage':{
        key:'usage',
        label:'用途',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Input placeholder="请输入" />;
        },
        render:render,
        type:'input1'
    },
     //操作
    'operation':{
        key:'operation',
        label:'操作',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Input placeholder="请输入" />;
        },
        render:render,
        type:'input1'
    },
     //创建人
    'creatorName':{
        key:'creatorName',
        label:'创建人',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        
        render: _this =>{
            return <Input disabled/>;
        },
        render:render,
        type:'input1'
    },
    //修改时间
    'updateTime':{
        key:'updateTime',
        label:'修改时间',
        span:6,
        rules:[
            
          ],
        
        render: _this =>{
            return <Input disabled/>;
        },
        render:render,
        type:'input1'
    },
    //修改人
    'updaterName':{
        key:'updaterName',
        label:'修改人',
        span:6,
        rules:[
            
          ],
        
        render: _this =>{
            return <Input disabled/>;
        },
        render:render,
        type:'input1'
    },
    //状态
    'status':{
        label: '状态',
        key: 'status',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>  {
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>
        },
        render:render,
        type:'select'
    },
    //备注
    'description':{
        key:'description',
        label:'备注',
        span:24,
        rules:[
            
          ],
        
        render: _this =>{
            return <TextArea placeholder="请输入"/>;
        },
        render:render,
        type:'textarea'
    },
    //MODEL型号
    'strValue1':{
        label: 'MODEL型号',
        key: 'strValue1',
        span:6,
        rules:[
            {
              required: true,
              message: '该选项不能为空！',
            },
          ],
        render: _this =>  {
            return <Select style={{ width: '100%' }} placeholder="请选择" allowClear={true}>
                        {
                            [].map((items, index) => {
                                return (<Option key={index} value={items.itemCode} >{items.itemValue}</Option>)
                            })
                        }
                    </Select>
        },
        render:render,
        type:'select'
    },
    //序列号
    'strValue2':{
        key:'strValue2',
        label:'序列号',
        span:6,
        rules:[
            
          ],
        
        render: _this =>{
            return <Input disabled/>;
        },
        render:render,
        type:'input1'
    },
     //备机情况
     'strValue3':{
        key:'strValue3',
        label:'备机情况',
        span:6,
        rules:[
            
          ],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
     //控制器型号
     'strValue4':{
        key:'strValue4',
        label:'控制器型号',
        span:6,
        rules:[
            
          ],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
     //控制器数量
     'strValue5':{
        key:'strValue5',
        label:'控制器数量',
        span:6,
        rules:[
            
          ],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
    //硬盘/驱动器/SFP型号
    'strValue6':{
        key:'strValue6',
        label:'硬盘/驱动器/SFP型号',
        span:6,
        rules:[
            
          ],
        
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //硬盘/驱动器/SFP数量
    'strValue7':{
        key:'strValue7',
        label:'硬盘/驱动器/SFP数量',
        span:6,
        rules:[
            
          ],
        
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //控制器微码
    'strValue8':{
        key:'strValue8',
        label:'控制器微码',
        span:6,
        rules:[
            
          ],
        
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //Raid保护
    'strValue9':{
        key:'strValue9',
        label:'Raid保护',
        span:6,
        rules:[
            
          ],
        
          renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源风扇冗余
    'strValue10':{
        key:'strValue10',
        label:'电源风扇冗余',
        span:6,
        rules:[
            
          ],
        
          renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //风险规避意见
    'strValue11':{
        key:'strValue11',
        label:'风险规避意见',
        span:6,
        rules:[
            
          ],
        
          renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //HotSpare描述
    'strValue12':{
        key:'strValue12',
        label:'HotSpare描述',
        span:6,
        rules:[
            
          ],
        
          renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //raid级别
    'strValue13':{
        key:'strValue13',
        label:'raid级别',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'select'
    },
    //异步型号
    'strValue14':{
        key:'strValue14',
        label:'异步型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //异步数量
    'strValue15':{
        key:'strValue15',
        label:'异步数量',
        span:6,
        rules:[],
        render:render,
        renderDom:renderDom,
        type:'input1'
    },
    //内存型号
    'strValue16':{
        key:'strValue16',
        label:'内存型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //内存数量
    'strValue17':{
        key:'strValue17',
        label:'内存数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //磁带机型号
    'strValue18':{
        key:'strValue18',
        label:'磁带机型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //磁带机数量
    'strValue19':{
        key:'strValue19',
        label:'磁带机数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源型号
    'strValue20':{
        key:'strValue20',
        label:'电源型号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //电源数量
    'strValue21':{
        key:'strValue21',
        label:'电源数量',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //RootVG镜像
    'strValue22':{
        key:'strValue22',
        label:'RootVG镜像',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //单电运行
    'strValue23':{
        key:'strValue23',
        label:'单电运行',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //风险规避意见
    'strValue24':{
        key:'strValue24',
        label:'风险规避意见',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
    //配置项编号
    'strValue25':{
        key:'strValue25',
        label:'配置项编号',
        span:6,
        rules:[],
        renderDom:renderDom,
        render:render,
        type:'input1'
    },
}
const columnsBase = [{
    title: '配置项',
    dataIndex: 'basedataTypeName',
    ellipsis:true,
    key:"basedataTypeId",
    itemCode:'id',
    itemValue:'basedataTypeName',
    selectData:'basedataTypeList',
    width:200,
    align: 'center',
},
{
    title: '客户编号',
    dataIndex: 'custNum',
    key:"custId",
    selectData:'customerData',
    align: 'center'
},
{
    title: '客户名称',
    dataIndex: 'custName',
    ellipsis:true,
    align: 'center',
},
{
    title: '项目编号',
    dataIndex: 'projectNumber',
    key:"projectNumber",
    align: 'center',
},
{
    title: '项目名称',
    dataIndex: 'projectName',
    key:"projectName",
    align: 'center',
},
{
    title: '项目经理',
    dataIndex: 'projectManagerName',
    key:"projectManagerName",
    align: 'center',
},
{
    title: '服务大区',
    dataIndex: '4',
    key:"6",
    align: 'center',
},
{
    title: '服务区域',
    dataIndex: 'projectArea',
    key:"projectAreaId",
    selectData:'areaData',
    align: 'center',
},
{
    title: '机房地址',
    dataIndex: 'projectAreaAddress',
    key:"projectAreaAddress",
    align: 'center',
},
{
    title: '客户方管理员',
    dataIndex: 'custUserName',
    key:"custUserName",
    align: 'center',
},
{
    title: '联系方式',
    dataIndex: 'custUserMobile',
    key:"custUserMobile",
    align: 'center',
},
{
    title: '开始时间',
    dataIndex: 'projectStartDate',
    key:"projectStartDate",
    align: 'center',
},
{
    title: '结束时间',
    dataIndex: 'projectEndDate',
    key:"projectEndDate",
    align: 'center',
},
{
    title: '项目销售',
    dataIndex: 'projectSalesmanName',
    key:"projectSalesmanName",
    align: 'center',
},
{
    title: '产品类别',
    dataIndex: 'serviceClassName',
    key:"serviceClassId",
    align: 'center',
},
{
    title: '技术方向',
    dataIndex: 'skillTypeName',
    key:"skillTypeId",
    align: 'center',
},
{
    title: '品牌',
    dataIndex: 'brandName',
    key:"brandId",
    align: 'center',
}]
export const columns = [
    ...columnsBase,
{
    title: '产品线',
    dataIndex: 'productLineName',
    selectData:'productLineLevel',
    key:"productLineId",
    align: 'center',
},
{
    title: '产品型号',
    dataIndex: 'productModelName',
    selectData:'productType',
    key:"productModelId",
    align: 'center',
},
{
    title: '产品等级',
    dataIndex: 'productLevel',
    selectData:'productLevel',
    key:"productLevel",
    align: 'center',
},
{
    title: 'MODEL型号',
    dataIndex: 'strValue1',
    key:"strValue1",
    align: 'center',
},
{
    title: '序列号',
    dataIndex: 'strValue2',
    key:"strValue2",
    align: 'center',
},
{
    title: '应用类别',
    dataIndex: 'appTypeName',
    key:"appTypeId",
    selectData:'appType',
    align: 'center',
},
{
    title: '备机情况',
    dataIndex: 'strValue3',
    key:"strValue3",
    inputType:'input1',
    align: 'center',
},
{
    title: '风险等级',
    dataIndex: 'riskLevelName',
    selectData:'riskLevel',
    key:"riskLevelId",
    align: 'center',
}]

//输出面板信息
export const panes = [
    //磁带磁盘交换机
    {
        type:[23],
        rules:[...rules1],
        columns:[
           ...columns,
            {
                title: '控制器型号',
                dataIndex: 'strValue4',
                key:'strValue4',
                inputType:'input1',
                align: 'center',
            },
            {
                title: '控制器数量',
                dataIndex: 'strValue5',
                inputType:'input1',
                key:'strValue5',
                width:150,
                align: 'center',
            },
            {
                title: '硬盘/驱动器/SFP型号',
                dataIndex: 'strValue6',
                inputType:'select',
                key:'strValue6',
                align: 'center',
            },
            {
                title: '硬盘/驱动器/SFP数量',
                dataIndex: 'strValue7',
                inputType:'input1',
                key:'strValue7',
                align: 'center',
            },
            {
                title: '控制器微码',
                dataIndex: 'strValue8',
                inputType:'input1',
                key:'strValue8',
                align: 'center',
            },
            {
                title: 'Raid保护',
                dataIndex: 'strValue9',
                inputType:'input1',
                key:'strValue9',
                align: 'center',
            },
            {
                title: '电源风扇冗余',
                dataIndex: 'strValue10',
                inputType:'input1',
                key:'strValue10',
                width:150,
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue11',
                inputType:'input1',
                key:'strValue11',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: '32',
                key:'34',
                align: 'center',
            },
            {
                title: 'HotSpare描述',
                dataIndex: 'strValue12',
                inputType:'select',
                key:'strValue12',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroId',
                key:'isMroId',
                selectData:'maintained',
                align: 'center',
            },
            {
                title: 'raid级别',
                dataIndex: 'strValue13',
                key:'strValue13',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key:'description',
                width:150,
                align: 'center',
            }
            
        ],
        assetsListData:[...assetsListData]
    },
    //小型机
    {
        type:[24],
        rules:[...rules1],
        columns:[
            ...columns,
            {
                title: 'CPU型号',
                dataIndex: 'strValue4',
                key: 'strValue4',
                inputType:'select',
                align: 'center',
            },
            {
                title: 'CPU数量',
                dataIndex: 'strValue5',
                key: 'strValue5',
                inputType:'input1',
                align: 'center',
            },
            {
                title: '硬件型号',
                dataIndex: 'strValue6',
                key: 'strValue6',
                inputType:'select',
                align: 'center',
            },
            {
                title: '硬件数量',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                align: 'center',
            },
            {
                title: 'RAID卡型号',
                dataIndex: 'strValue8',
                inputType:'select',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: 'RAID卡数量',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: 'HBA卡型号',
                dataIndex: 'strValue10',
                inputType:'select',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: 'HBA卡数量',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                align: 'center',
            },
            {
                title: '网卡型号',
                dataIndex: 'strValue12',
                inputType:'select',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '网卡数量',
                dataIndex: 'strValue13',
                inputType:'select',
                key: 'strValue13',
                align: 'center',
            },
            {
                title: '异步型号',
                dataIndex: 'strValue14',
                inputType:'select',
                key: 'strValue14',
                align: 'center',
            },
            {
                title: '异步数量',
                dataIndex: 'strValue15',
                inputType:'input1',
                key: 'strValue15',
                align: 'center',
            },
            {
                title: '内存型号',
                dataIndex: 'strValue16',
                inputType:'select',
                key: 'strValue16',
                align: 'center',
            },
            {
                title: '内存数量',
                dataIndex: 'strValue17',
                inputType:'input1',
                key: 'strValue17',
                width:150,
                align: 'center',
            },
            {
                title: '磁带机型号',
                dataIndex: 'strValue18',
                inputType:'select',
                key: 'strValue18',
                align: 'center',
            },
            {
                title: '磁带机数量',
                dataIndex: 'strValue19',
                inputType:'input1',
                key: 'strValue19',
                align: 'center',
            },
            {
                title: '电源型号',
                dataIndex: 'strValue20',
                inputType:'select',
                key: 'strValue20',
                align: 'center',
            },
            {
                title: '电源数量',
                dataIndex: 'strValue21',
                inputType:'input1',
                key: 'strValue21',
                align: 'center',
            },
            {
                title: 'RootVG镜像',
                dataIndex: 'strValue22',
                inputType:'input1',
                key: 'strValue22',
                width:150,
                align: 'center',
            },
            {
                title: '单电运行',
                dataIndex: 'strValue23',
                inputType:'input1',
                key: 'strValue23',
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue24',
                inputType:'input1',
                key: 'strValue24',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: '44',
                key: '44',
                align: 'center',
            },
            {
                title: '配置项编号',
                dataIndex: 'strValue25',
                inputType:'select',
                key: 'strValue25',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key:'description',
                width:150,
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    },
    //X86
    {
        type:[25],
        rules:[...rules1],
        columns:[
            ...columns,
            {
                title: '应用描述',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: 'CPU内核编号',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                width:100,
                align: 'center',
            },
            {
                title: 'CPU数量',
                dataIndex: 'strValue6',
                inputType:'input1',
                key: 'strValue6',
                align: 'center',
            },
            {
                title: '硬盘型号',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                align: 'center',
            },
            {
                title: '硬盘数量',
                dataIndex: 'strValue8',
                inputType:'input1',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: 'SCSI/RAID卡型号',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: 'SCSI/RAID卡数量',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: 'HBA卡型号',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                width:100,
                align: 'center',
            },
            {
                title: 'HBA卡数量',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '网卡型号',
                dataIndex: 'strValue13',
                inputType:'input1',
                key: 'strValue13',
                align: 'center',
            },
            {
                title: '网卡数量',
                dataIndex: 'strValue14',
                inputType:'input1',
                key: 'strValue14',
                align: 'center',
            },
            {
                title: '电源型号',
                dataIndex: 'strValue15',
                inputType:'select',
                key: 'strValue15',
                align: 'center',
            },
            {
                title: '电源数量',
                dataIndex: 'strValue16',
                inputType:'input1',
                key: 'strValue16',
                align: 'center',
            },
            {
                title: '内存型号',
                dataIndex: 'strValue17',
                inputType:'input1',
                key: 'strValue17',
                width:150,
                align: 'center',
            },
            {
                title: '内存数量',
                dataIndex: 'strValue18',
                inputType:'input1',
                key: 'strValue18',
                align: 'center',
            },
            {
                title: '磁带机型号',
                dataIndex: 'strValue19',
                inputType:'input1',
                key: 'strValue19',
                align: 'center',
            },
            {
                title: '磁带机数量',
                dataIndex: 'strValue20',
                inputType:'input1',
                key: 'strValue20',
                align: 'center',
            },
            {
                title: 'VG镜像',
                dataIndex: 'strValue21',
                inputType:'input1',
                key: 'strValue21',
                align: 'center',
            },
            {
                title: '单电运行',
                dataIndex: 'strValue22',
                inputType:'input1',
                key: 'strValue22',
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue23',
                inputType:'input1',
                key: 'strValue23',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    },
    //网络安全（负载均衡）
    {
        type:[26],
        rules:[...rules1],
        columns:[
            ...columns,
            {
                title: '应用描述',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: '风扇型号',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                width:150,
                align: 'center',
            },
            {
                title: '风扇数量',
                dataIndex: 'strValue8',
                inputType:'input1',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: '引擎板型号',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: '引擎板数量',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: '业务母板型号',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                align: 'center',
            },
            {
                title: '业务母板数量',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '业务子板型号',
                dataIndex: 'strValue13',
                inputType:'input1',
                key: 'strValue13',
                width:150,
                align: 'center',
            },
            {
                title: '业务子板数量',
                dataIndex: 'strValue14',
                inputType:'input1',
                key: 'strValue14',
                align: 'center',
            },
            {
                title: '引擎板槽位',
                dataIndex: 'strValue15',
                inputType:'input1',
                key: 'strValue15',
                align: 'center',
            },
            {
                title: 'lisence信息',
                dataIndex: 'strValue17',
                inputType:'input1',
                key: 'strValue17',
                align: 'center',
            },
            {
                title: '电源数量',
                dataIndex: 'strValue16',
                inputType:'input1',
                key: 'strValue16',
                align: 'center',
            },
            {
                title: 'uptime',
                dataIndex: 'strValue19',
                inputType:'input1',
                key: 'strValue19',
                width:150,
                align: 'center',
            },
            {
                title: '内存数量',
                dataIndex: 'strValue18',
                inputType:'input1',
                key: 'strValue18',
                align: 'center',
            },
            {
                title: '管理IP',
                dataIndex: 'strValue20',
                inputType:'input1',
                key: 'strValue20',
                align: 'center',
            },
            {
                title: 'Version',
                dataIndex: 'strValue21',
                inputType:'input1',
                key: 'strValue21',
                align: 'center',
            },
            {
                title: 'Flash/Memory',
                dataIndex: 'strValue22',
                inputType:'input1',
                key: 'strValue22',
                align: 'center',
            },
            {
                title: '设备联系状况',
                dataIndex: 'strValue23',
                inputType:'input1',
                key: 'strValue23',
                width:150,
                align: 'center',
            },
            {
                title: '风险规避意见',
                dataIndex: 'strValue25',
                inputType:'input1',
                key: 'strValue25',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key:'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: 'updateTime',
                
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key:'description',
                width:150,
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    },
    //其他（硬件）
    {
        type:[27],
        rules:[...rules1],
        columns:[
            ...columns,
            {
                title: '是否正常状态',
                dataIndex: 'strValue4',
                inputType:'select',
                selectData:'maintained',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: '容量',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                width:150,
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                key: '0',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                key: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    },
    //中间件
    {
        type:[29],
        rules:[...rules1],
        columns:[
            ...columnsBase,
            {
                title: '中间件名称',
                dataIndex: 'strValue1',
                key: 'strValue1',
                align: 'center',
            },
            {
                title: '版本',
                dataIndex: 'strValue2',
                key: 'strValue2',
                align: 'center',
            },
            {
                title: '应用类别',
                dataIndex: 'appTypeName',
                key: 'appTypeId',
                align: 'center',
            },
            {
                title: '状态',
                dataIndex: 'strValue3',
                inputType:'input1',
                key: 'strValue3',
                align: 'center',
            },
            {
                title: '是否集群',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                key: '0',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                key: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    },
    //数据库（软件）
    {
        type:[28],
        rules:[...rules1],
        columns:[
            ...columnsBase,
            {
                title: '数据库名称',
                dataIndex: 'strValue1',
                key: 'strValue1',
                align: 'center',
            },
            {
                title: '实例名称',
                dataIndex: 'strValue2',
                key: 'strValue2',
                align: 'center',
            },
            {
                title: '应用类别',
                dataIndex: 'appTypeName',
                key: 'appTypeId',
                align: 'center',
            },
            {
                title: '数据库管理方式',
                dataIndex: 'strValue3',
                inputType:'input1',
                key: 'strValue3',
                align: 'center',
            },
            {
                title: '数据库用途',
                dataIndex: 'strValue4',
                inputType:'input1',
                key: 'strValue4',
                align: 'center',
            },
            {
                title: 'HA状况',
                dataIndex: 'strValue5',
                inputType:'input1',
                key: 'strValue5',
                align: 'center',
            },
            {
                title: '灾备状况',
                dataIndex: 'strValue6',
                inputType:'input1',
                key: 'strValue6',
                align: 'center',
            },
            {
                title: 'OS版本',
                dataIndex: 'strValue7',
                inputType:'input1',
                key: 'strValue7',
                align: 'center',
            },
            {
                title: '是否集群',
                dataIndex: 'strValue8',
                inputType:'input1',
                key: 'strValue8',
                align: 'center',
            },
            {
                title: '数据库版本',
                dataIndex: 'strValue9',
                inputType:'input1',
                key: 'strValue9',
                align: 'center',
            },
            {
                title: '最新补丁',
                dataIndex: 'strValue10',
                inputType:'input1',
                key: 'strValue10',
                align: 'center',
            },
            {
                title: '备份方式',
                dataIndex: 'strValue11',
                inputType:'input1',
                key: 'strValue11',
                align: 'center',
            },
            {
                title: '位数',
                dataIndex: 'strValue12',
                inputType:'input1',
                key: 'strValue12',
                align: 'center',
            },
            {
                title: '是否维护',
                dataIndex: 'isMroName',
                key: 'isMroId',
                align: 'center',
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
                width:150,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'updaterName',
                key: '0',
                align: 'center',
            },
            {
                title: '操作时间',
                dataIndex: '48',
                key: '48',
                align: 'center',
            },
            {
                title: '备注',
                dataIndex: 'description',
                key: 'description',
                width:150,
                align: 'center',
            }
        ],
        assetsListData:[...assetsListData]
    }
];