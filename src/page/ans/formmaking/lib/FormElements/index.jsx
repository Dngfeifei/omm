import React from 'react';
import $t from '../zh-CN.js';
import { ReactSortable } from 'react-sortablejs';
import { basicComps, advanceComps, layoutComps } from '../componentsConfig';
import MetaItem from './components/MetaItem';

const FormElements = () => {
  return (
    <div className="components-list">
      <div className="widget-cate">{$t.fm.components.basic.title}</div>
      <div className="form-edit-widget-box">
        <ReactSortable
          group={{ name: 'formDesign', pull: 'clone', put: false }}
          animation={200}
          list={basicComps}
          sort={false}
          setList={() => {}}
        >
          {basicComps.map((item) => (
            <MetaItem meta={item} key={item.type} />
          ))}
        </ReactSortable>
      </div>
      <div className="widget-cate">{$t.fm.components.advance.title}</div>
      <ReactSortable
        tag="div"
        group={{ name: 'formDesign', pull: 'clone', put: false }}
        animation={200}
        list={advanceComps}
        sort={false}
        setList={() => {}}
      >
        {advanceComps.map((item) => (
          <MetaItem meta={item} key={item.type} />
        ))}
      </ReactSortable>
      <div className="widget-cate">{$t.fm.components.layout.title}</div>
      <ReactSortable
        tag="div"
        group={{ name: 'formDesign', pull: 'clone', put: false }}
        animation={200}
        list={layoutComps}
        sort={false}
        setList={() => {}}
      >
        {layoutComps.map((item) => (
          <MetaItem meta={item} key={item.type} />
        ))}
      </ReactSortable>
    </div>
  );
};

export default FormElements;
