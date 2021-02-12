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


const post = new Post('Web Pack post title', WebpackLogo)

$('pre').html(post.toString())

console.log('Post to string: ', post.toString());
start().then(console.log)
console.log(Util.id);

// console.log('JSON ', json);
// console.log('XML ', xml);
// console.log('CSV ', csv);
