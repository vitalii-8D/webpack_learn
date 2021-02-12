import React from 'react';
import {render} from 'react-dom';

import * as $ from 'jquery';
import Post from '@models/Post';
import json from './assets/json.json'

import WebpackLogo from './assets/webpack-logo.png';
import xml from './assets/data.xml'
import csv from './assets/data.csv'
import {start, Util} from "@/babel";

import './styles/styles.css'
import './styles/less.less'
import './styles/scss.scss'

const App = () => (
   <div className="container">
      <h1>Webpack Course</h1>
      <hr/>
      <div className="logo"/>
      <hr/>
      <pre/>
      <hr/>
      <div className="box">
         <h2>Less</h2>
      </div>
      <hr/>
      <div className="card">
         <h2>Less</h2>
      </div>
   </div>
)

render(<App/>, document.getElementById('app'))


const post = new Post('Web Pack post title', WebpackLogo)

$('pre').html(post.toString())

console.log('Post to string: ', post.toString());
start().then(console.log)
console.log(Util.id);

// lodash - бібліотека для динамічних імпортів (лейзі лоадінг)
/*import('lodash').then(_ => {
   console.log('Lodash', _.random(0, 42, true))
})*/

// console.log('JSON ', json);
// console.log('XML ', xml);
// console.log('CSV ', csv);
