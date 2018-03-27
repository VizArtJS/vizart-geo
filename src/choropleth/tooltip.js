import { getDimensionVal, getMetric, getMetricVal } from './withCartesian';

const tooltipMarkup = (d, state, _c) =>
  `
    <div class="tooltip-content" style="border-color: ${_c(d)};">
        <div class="tooltip-header">${getDimensionVal(state)(d)}</div>
        <div class="tooltip-row">
            <div class="col">${getMetric(state).name} </div>
            <div class="col">${getMetricVal(state)(d)} </div>
        </div>
    </div>
    `;

export default tooltipMarkup;
