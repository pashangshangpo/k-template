import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom';
import asyncComponent from './js/component/AsyncComponent';

export default class extends Component {
	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={asyncComponent(() => import('./js/index/index'))} />
				</div>
			</HashRouter>
		);
	}
}
