import React, {Component} from 'react';
import {render} from 'react-dom';
import Route from './Route';
import './css/index.css';

class App extends Component {
	render() {
		return (
			<Route />
		);
	}
}

render(<App/>, document.getElementById('app'));
