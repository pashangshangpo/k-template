import React, {Component} from 'react';
import {render} from 'react-dom';
import Route from './Route';

class App extends Component {
	render() {
		return (
			<div>
				<Route />
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));