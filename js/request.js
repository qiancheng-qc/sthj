// 对接ios webViewJavascriptBridge 必备代码
function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge)
	}
	if (window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback)
	}
	window.WVJBCallbacks = [callback]
	var WVJBIframe = document.createElement('iframe')
	WVJBIframe.style.display = 'none'
	WVJBIframe.src = 'https://__bridge_loaded__'
	document.documentElement.appendChild(WVJBIframe)
	setTimeout(function () {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}

// 获取token
var token = sessionStorage.getItem('token')
if (!token) {
	setupWebViewJavascriptBridge(function (bridge) {
		bridge.registerHandler('sendtoken', function (data) {
			token = data.token
			alert(token)
			sessionStorage.setItem('token', token)
		})
	})
	if (!token) {
		token = window.android.getToken()
		sessionStorage.setItem('token', token)
	}
}

// var token =
// 	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'

// ajax请求方法
$.prototype.http = function (url, data, fn, type = 'POST') {
	$.ajax({
		url: 'http://t.company.sthjnet.com/' + url,
		type,
		headers: { token },
		data,
		complete: function (res) {
			if (res.code === 200) {
				fn(res)
			} else {
				mui.toast('请求失败，请重试')
			}
		}
	})
}
