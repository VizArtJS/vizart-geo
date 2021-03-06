# vizart-geo

* [Demo](https://vizartjs.github.io/demo.html) quick reference with source code
* [Documentation](https://github.com/VizArtJS/vizart-geo/wiki)


## Usage:

1. Install

```
npm install vizart-geo --save
```

2. ES6 Usage

```
import 'vizart-geo/dist/vizart-geo.css';
import { choropleth } from 'vizart-geo';

const map = choropleth(domId, opt)....
```

## Three steps to use a chart
1. initialize a chart with domId and declarative options
```
let opt = {
  ...
};
const chart = new Chord('#chart', opt)
```
You only need to provide essential options. [Demo](https://vizartjs.github.io/demo.html) is a good place to check essential options for all charts. You may check up Documentation of each component for full option spec so as to control more chart behaviours.

2. Render a chart with data
```
chart.render(data) // this should be called only once
```
3. Change a chart on the fly (with options in a minimum)
```
// copy and update full options
const opt = chart.options();
opt.plots.opacityArea = o.4

// or in minimum
const opt = { plots: {opacityArea: 0.2 }};

// update options and redraw chart
chart.options(opt);
chart.update();

```


## Development
1. Clone repository
2. Run commands
```
npm install         // install dependencies
npm run dev         // view demos in web browser at localhost:3005
npm run build       // build
npm run test        // run tests only
npm run test:cover  // run tests and view coverage report
```

## API

* [Choropleth](https://github.com/VizArtJS/vizart-geo/wiki/choropleth)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
