import { Globals } from 'vizart-core';

const getDimension = opt => opt.data.x;
const getMetric = opt => opt.data.y[0];
const getDimensionVal = opt => d => d[getDimension(opt).accessor];
const getMetricVal = opt => d => d[getMetric(opt).accessor];
const x = opt => d => getDimension(opt).scale(getDimensionVal(opt)(d));
const y = opt => d => getMetric(opt).scale(getMetricVal(opt)(d));
const c = opt => d => {
  if (d.color !== null && d.color !== undefined) {
    return d.color;
  }

  switch (opt.color.type) {
    case Globals.ColorType.CATEGORICAL:
      return opt._color(getDimensionVal(opt)(d));
    case Globals.ColorType.GRADIENT:
    case Globals.ColorType.DISTINCT:
      return opt._color(getMetricVal(opt)(d));
    default:
      return opt._color(getMetricVal(opt)(d));
  }
};

export { getMetric, getMetricVal, getDimension, getDimensionVal, x, y, c };
