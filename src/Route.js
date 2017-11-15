import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom';
import asyncComponent from './js/component/AsyncComponent';
import './css/aaa.css';

const Home = asyncComponent(() => import('./js/home/index'));
const Index = asyncComponent(() => import('./js/index/index'));

export default class extends Component {
	render() {
		return (
      <HashRouter>
        <div>
          <Route exact path="/" component={Index} />
          <Route exact path="/home" component={Home} />
        </div>
      </HashRouter>
		);
	};
}
