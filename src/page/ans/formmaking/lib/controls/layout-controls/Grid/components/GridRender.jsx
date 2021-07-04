import React  from 'react';
import {Row, Col} from 'antd';
import allComps from "@/page/ans/formmaking/lib/controls";

const GridRender = ({ control, formConfig }) => {
  const { options } = control;

  return <Row
    className={options.customClass}
    type={options.flex ? 'flex': ''}
    gutter={options.gutter||0}
    justify={options.justify}
    align={options.align}
  >
    {control.columns.map((item,key) =>
      <Col
        key={key}
        xs={options.responsive ? item.xs||0: item.span || 0}
        sm={options.responsive ? item.sm||0: item.span || 0}
        md={options.responsive ? item.md||0: item.span || 0}
        lg={options.responsive ? item.lg||0: item.span || 0}
        xl={options.responsive ? item.xl||0: item.span || 0}
      >
        <div>test</div>
        {item.list.map((col, k2) => React.createElement(allComps[`${col.type}-render`], {
          control: col,
          formConfig,
          key: `${key}-${k2}`
        }))}
    </Col>)}
  </Row>;
};

export default GridRender;
