const apiColor = state => ({
  color(colorOptions) {
    if (!colorOptions) {
      console.warn('color opt is null, either scheme or type is required');
      return;
    } else if (!colorOptions.type && !colorOptions.scheme) {
      console.warn('invalid color opt, either scheme or type is required');
      return;
    }

    if (colorOptions.type) {
      state._options.color.type = colorOptions.type;
    }

    if (colorOptions.scheme) {
      state._options.color.scheme = colorOptions.scheme;
    }
    state._color = state._composers.color(state._options.color);

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
