const apiColor = state => ({
  color(colorOptions) {
    state._options.color = colorOptions;
    state._color = state._composers.color(colorOptions);

    const { _svg, _options, _c } = state;
    _svg
      .selectAll('.path')
      .transition()
      .duration(_options.animation.duration.quickUpdate)
      .delay((d, i) => i * 50)
      .attr('fill', _c);
  },
});

export default apiColor;
