import React, { useMemo } from 'react';
import styled from '@emotion/styled';

const GridRender = ({ control, formConfig }) => {
  const { options } = control;

  return <div className={options.customClass}>GridRender</div>;
};

export default GridRender;
