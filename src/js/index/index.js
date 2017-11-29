import React, {Component} from 'react';

export default class Index extends Component {
	render() {
		return (
			<div>
        Index page
				<form id="fr">
					<input type="file" name="f" />
					<input type="text" name="t" />
				</form>
			</div>
		);
	}
}
