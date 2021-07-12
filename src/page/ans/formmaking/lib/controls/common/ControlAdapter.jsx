import React, { useEffect } from 'react';
import { TableHeaderCls, TableCellCls } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const ControlAdapter = ({ control, formConfig, inTable = false, isDesign = false, onChange, children }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  useEffect(() => {
    if (!isDesign) {
      baseProps.onChange(options.defaultValue)
    }
  }, [])

  return (
    <React.Fragment>
      {isDesign && inTable ? (
        <div>
          <div className={TableHeaderCls}>{control.name}</div>
          <div className={TableCellCls}>
            {children}
          </div>
        </div>
      ) : !isDesign && options.hidden ? null : children}
    </React.Fragment>
  );
};

export default ControlAdapter;
