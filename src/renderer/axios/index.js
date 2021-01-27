import axios from 'axios'
axios.defaults.baseURL = "http://www.await.site/music/";
axios.defaults.withCredentials = true// 允许跨域设置，不然可能因为拿不到cookie而报错
axios.defaults.baseURL = "http://www.await.site/music/";
/*请求拦截*/
axios.interceptors.request.use(
	config => {
		if (config.meth === 'post' && !(config.data instanceof FormData)) {
			config.headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			config.data = qs.stringify(config.data, { arrayFormat: 'repeat' }) /*这里是，后端要求传数组的时候做的设置，以前出过错*/
		}
		return config
	}, error => {
		return Promise.reject(error)
	}
)
/* 响应拦截 */
axios.interceptors.response.use(
	response => {
		/*可在这里根据返回的状态码做一些拦截操作*/
		return response.data
	}, error => {
		if (error.request) {
			console.log(error.request)
		} else if (error.response) {
			console.log(error.response.data);
			console.log(error.response.status);
		}
		if (error && error.response) {
			switch (error.response.status) {
				case 400: error.message = '请求错误(400)';
					break;
				case 401: error.message = '未授权，请重新登录(401)';
					break;
				case 403: error.message = '拒绝访问(403)';
					break;
				case 404: error.message = '请求出错(404)';
					break;
				case 408: error.message = '请求超时(408)';
					break;
				case 500: error.message = '服务器错误(500)';
					break;
				case 501: error.message = '服务未实现(501)';
					break;
				case 502: error.message = '网络错误(502)';
					break;
				case 503: error.message = '服务不可用(503)';
					break;
				case 504: error.message = '网络超时(504)';
					break;
				case 505: error.message = 'HTTP版本不受支持(505)';
					break;
				default: error.message = `连接出错(${error.response.status})!`;
			}
		} else {
			error.message = '连接服务器失败!'
		}
		return Promise.resolve(error)
	}
)

export default axios