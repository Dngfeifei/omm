import React, {useState, useEffect} from 'react'
import {GetBpmnXml} from '/api/design'
import {Modal, Spin} from 'antd'
import BpmnDesigner from "./bpmn-designer"


export default function PageDraw (props) {
    const {config={},onCancel=()=>{}} = props
    const [spinning, setSpinning] = useState(true)
    const [modelId,setModelId] = useState('')
    const [xml,setXml] = useState('')
    const [type,setType] = useState('')
    const [category,setCategory] = useState('')

    useEffect(()=>{
       
        if(config.type === 'edit' && config.visible === true) {
          
            GetBpmnXml({id: config.primary}).then(res => {
                setXml(res)
                setSpinning(false)
                setType(config.type)
                setModelId(config.primary)
                setCategory(config.category === undefined?"未设置":config.category)
            })
        }else if(config.type === 'add' && config.visible === true) {
            setXml("")
            setSpinning(false)
            setType(config.type)
            setCategory("未设置")
        }
    }, [config])

    function handelCancel() {
        setType("");
        setXml("");
        onCancel()
    }

    return <Modal title={config.title}
                  maskClosable={false}
                  visible={config.visible}
                  onCancel={handelCancel}
                  width={1400}
                  style={{top: 20, marginBottom: 50}}
                  footer={null}
                  bodyStyle={{padding: '10px'}}
                  destroyOnClose={true}
    >
        <Spin spinning={spinning}>
            <div style={{ width: "100%", height: "88vh" }}>
                <BpmnDesigner xml={xml} modelId={modelId} type={type} category={category}></BpmnDesigner>
            </div>
        </Spin>
    </Modal>
}
