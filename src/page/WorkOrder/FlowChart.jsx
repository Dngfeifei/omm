import React, {Component} from 'react'
import {Button, Card, Row, Timeline, Col, Steps, Table, Cascader, Radio, Input} from 'antd'
import {css} from "@emotion/css";
import moment from 'moment';
import CustomModeler from "@/page/ans/flow/bpmn-designer/custom-modeler";
import flowableModdleDescriptor from "@/page/ans/flow/bpmn-designer/flow";
import "../ans/flow/bpmn-designer/bpmn-designer.less";
import { GetFlowChart } from '/api/initiate'


class FlowChart extends Component {

  constructor(props) {
    super(props)

    
    GetFlowChart({processDefId: this.props.data}).then(data => {

      this.bpmnModeler = new CustomModeler({
        container: "#canvas",
        additionalModules: [],
        moddleExtensions: {
          flowable: flowableModdleDescriptor, //添加flowable前缀
        },
      });

      const elementRegistry = this.bpmnModeler.get('elementRegistry');
      const modeling = this.bpmnModeler.get('modeling');

      var _this = this;
      this.bpmnModeler.importXML(data.bpmnXml, function(err) {
        if (err) {
          console.error(err)
        }

        _this.bpmnModeler.get('canvas').zoom('fit-viewport')

        if (data.activityIds) {
          var last = data.activityIds.pop();

          var elementToColor = _this.elementRegistry.get(last);

          if (!last.startsWith('EndEvent')) {
            _this.modeling.setColor([elementToColor], {
              'stroke': 'red',
              'stroke-width': '0.8px',
              'fill': 'white',
              'fill-opacity': '0.95'
            });
          } else {
            _this.modeling.setColor([elementToColor], {
              'stroke': 'rgb(64, 158, 255)',
              'stroke-width': '0.8px',
              'fill': 'white',
              'fill-opacity': '0.95'
            });
          }

          data.activityIds.forEach(function (activity) {
            var elementToColor = _this.elementRegistry.get(activity);

            _this.modeling.setColor([elementToColor], {
              'stroke': 'rgb(64, 158, 255)',
              'stroke-width': '0.8px',
              'fill': 'white',
              'fill-opacity': '0.95'
            });
          });

          if (data.flows) {
            data.flows.forEach(function (activity) {
              var elementToColor = _this.elementRegistry.get(activity);

              _this.modeling.setColor([elementToColor], {
                'stroke': 'rgb(64, 158, 255)',
                'stroke-width': '0.9px',
                'fill': 'white',
                'fill-opacity': '0.95'
              });
            });
          }
        }
      })
    })
  }

  render = _ => {


    return (
      <Card style={{marginTop:"10px",height:"700px",width: "100%"}}>

        <div className="containers">
          <div id="canvas" className="canvas" ></div>
        </div>
        
      </Card>
    )
  }

}

export default FlowChart

