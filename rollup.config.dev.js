import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss'
import localResolve from 'rollup-plugin-local-resolve';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    plugins: [
        json({
            exclude: [ 'node_modules' ],
            preferConst: true,
        }),
        localResolve(),
        postcss({ extract: 'dist/vizart-geo.css' }),
        babel(babelrc()),
        resolve({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
            extensions: ['.js']
        }),
        commonjs({
            namedExports: {
                'node_modules/leaflet': [ 'LatLng', 'Map', 'tileLayer'],
            }
        }),
        serve({
            open: true,
            verbose: true,
            contentBase: ['demo', 'dist'],
            historyApiFallback: false,
            host: 'localhost',
            port: 3004
        }),
        livereload({
            watch: ['demo', 'dist'],
            verbose: false
        })
    ],
    external: ['leaflet'],
    output: [
        {
            file: 'dist/vizart-geo.standalone.js',
            format: 'umd',
            name: 'VizArtGeo',
            sourcemap: true
        }
    ]
};
