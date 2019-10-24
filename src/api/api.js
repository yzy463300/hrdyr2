import Vue from 'vue'
import config from '../config/index.js'
import { Toast, Dialog } from 'vant';
import axios from 'axios'

const ajax = axios.create({
	baseURL: config.baseUrl,
	withCredentials: true,
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	transformRequest: [function (data) {
		let ret = ''
		for (let it in data) {
			ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
		}
		return ret
	}]
})
const api = {
	check_auth(params) {
		loading()
		return ajax.get(`hapi.php?act=check_auth`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else if (res.data.error_no == 10001) {
				location.replace(`http://zs.yunyuh5.com/hrxxds2/hapi/auth.php?front_url=${location.href}`)
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	upload(params) {
		Toast.loading({
			message: '可能需要较长时间,请稍等...',
			loadingType: 'spinner',
			duration: 0,
		});
		let formdate = new FormData()
		formdate.append('img', params.img)

		return axios.post(`${config.baseUrl}hapi.php?act=upload`, formdate, {
			withCredentials: true,

		}).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	submit(params) {
		Toast.loading({
			message: '可能需要较长时间,请稍等...',
			loadingType: 'spinner',
			duration: 0,
		});
		return ajax.post(`hapi.php?act=submit`, params).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				// Dialog.alert({
				//   message: res.data.msg
				// })
				return res.data
			}
		})
	},
	player_list(params) {
		return ajax.get(`hapi.php?act=player_list`, { params }).then(res => {
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	player_detail(params) {
		loading()
		return ajax.get(`hapi.php?act=player_detail`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	vote(params) {
		loading()
		return ajax.get(`hapi.php?act=vote`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	buyBigOrder(params) {
		loading()
		return ajax.get(`hapi.php?act=buyBigOrder`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	city_list(params) {
		// loading()
		return ajax.get(`hapi.php?act=city_list`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	branch_list(params) {
		// loading()
		return ajax.get(`hapi.php?act=branch_list`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	get_oss_info(params) {
		// loading()
		Toast.loading({
			message: '可能需要较长时间,请稍等...',
			loadingType: 'spinner',
			duration: 0,
		});
		return ajax.get(`hapi.php?act=get_oss_info`, { params }).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				Dialog.alert({
					message: res.data.msg
				})
				return false
			}
		})
	},
	submit2(params) {
		// loading()
		Toast.loading({
			message: '可能需要较长时间,请稍等...',
			loadingType: 'spinner',
			duration: 0,
		});
		return ajax.post(`hapi.php?act=submit2`, params).then(res => {
			Toast.clear();
			if (res.data.error_no == 0) {
				return res.data
			} else {
				// Dialog.alert({
				//   message: res.data.msg
				// })
				return res.data
			}
		})
	},
	OSSupload(params) {
		Toast.loading({
			message: '可能需要较长时间,请稍等...',
			loadingType: 'spinner',
			duration: 0,
		});
		console.log(params)
		const formData = new FormData()
		formData.append("key", params.key);
		formData.append("OSSAccessKeyId", params.OSSAccessKeyId);
		formData.append("policy", params.policy);
		formData.append('signature', params.signature);	//oss签名
		formData.append('success_action_status', '200');	//oss签名
		formData.append('file', params.file);	//要上传的文件对象
		return axios.post(params.host, formData).then(res => {
			Toast.clear();
			return true
		}).catch(err => {
			return false
		})
	}
}

function loading() {
	return Toast.loading({
		message: '加载中...',
		loadingType: 'spinner',
		duration: 0,
	});
}

export default api