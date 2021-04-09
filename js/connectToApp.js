// app交互代码

$(function () {
	// 是否从车辆管理页面跳转而来 （普通发货）
	var ifCarList = window.location.href.indexOf('from=')
	if (ifCarList !== -1) {
		var from = window.location.href.split('from=')[1].split('&')[0]
	}

	// 判断是ios还是android
	var type = window.location.href.split('type=')[1].split('&')[0]

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

	// 退出
	$('.arrow').on('click', function () {
		if (from) {
			window.history.back()
		} else {
			backToApp()
		}
	})
	function backToApp() {
		if (type === 'android') {
			window.android.backToApp()
		} else {
			setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler('backToApp', function (response) {
					alert(response)
				})
			})
		}
	}
	$.prototype.backToApp = backToApp
})
