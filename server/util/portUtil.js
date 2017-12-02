const net = require('net');

/**
 * 检测端口是否被占用
 * port: 端口
 * isTrue: 端口被占用时,是否尝试重新获取一个可用的端口
 * cb: 回调函数
 */
module.exports = portIsOccupied = (port, isTrue, cb) => {
	port = Math.ceil(port);

	if (typeof isTrue === 'function') {
		cb = isTrue;
		isTrue = false;
	}

	// 创建服务并监听该端口
	const server = net.createServer().listen(port);

	// 端口未被占用
	server.on('listening', () => {
		server.once('close', () => {
			cb(port);
		});

		server.close();
	});

	// 端口被占用
	server.on('error', err => {
		if (err.code === 'EADDRINUSE') {
			if (isTrue) {
				portIsOccupied(port + 1, isTrue, cb);
			} else {
				cb();
			}
		}
	});
};
