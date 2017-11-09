module.exports = {
	replace: (html, obj) => {
		for (let key in obj) {
			html = html.replace(new RegExp(`@${key}@`, 'g'), obj[key]);
		}

		return html;
	}
};