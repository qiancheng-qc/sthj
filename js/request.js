// // webViewJavascriptBridge 必备代码
// function setupWebViewJavascriptBridge(callback) {
// 	if (window.WebViewJavascriptBridge) {
// 		return callback(WebViewJavascriptBridge)
// 	}
// 	if (window.WVJBCallbacks) {
// 		return window.WVJBCallbacks.push(callback)
// 	}
// 	window.WVJBCallbacks = [callback]
// 	var WVJBIframe = document.createElement('iframe')
// 	WVJBIframe.style.display = 'none'
// 	WVJBIframe.src = 'https://__bridge_loaded__'
// 	document.documentElement.appendChild(WVJBIframe)
// 	setTimeout(function () {
// 		document.documentElement.removeChild(WVJBIframe)
// 	}, 0)
// }

// var token
// var tokenStorage
// var tokenIOS
// var tokenAndroid

// // 获取token
// var tokenStorage = sessionStorage.getItem('token')
// token = tokenStorage
// if (!tokenStorage) {
// 	setupWebViewJavascriptBridge(function (bridge) {
// 		bridge.registerHandler('sendtoken', function (data) {
// 			tokenIOS = data.token
// 			token = tokenIOS
// 			sessionStorage.setItem('token', token)
// 		})
// 	})
// 	if (!tokenIOS) {
// 		tokenAndroid = window.android.getToken()
// 		token = tokenAndroid
// 		sessionStorage.setItem('token', token)
// 	}
// }

// ajax请求方法
$.prototype.http = function (url, data, fn, type = 'POST') {
	$.ajax({
		url: 'http://t.company.sthjnet.com/' + url,
		type: type,
		headers: {
			token:
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'
		},
		data: data,
		success: fn
	})
}
