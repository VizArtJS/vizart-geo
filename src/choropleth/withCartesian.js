const getDimension = opt => opt.data.x;
const getMetric = opt => opt.data.y[0];
const getDimensionVal = opt => d => d[getDimension(opt).accessor];
const getMetricVal = opt => d => d[getMetric(opt).accessor];
const x = opt => d => getDimension(opt).scale(getDimensionVal(opt)(d));
const y = opt => d => getMetric(opt).scale(getMetricVal(opt)(d));

export { getMetric, getMetricVal, getDimension, getDimensionVal, x, y };
