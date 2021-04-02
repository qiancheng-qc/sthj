// app交互代码
$(function () {
	var ifCarList = window.location.href.indexOf('from')
	if (ifCarList !== -1) {
		var from = window.location.href.split('from=')[1].split('&')[0]
		console.log(from)
	}
	var type = window.location.href.split('type=')[1].split('&')[0]
	console.log(type)

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

	setupWebViewJavascriptBridge(function (bridge) {
		$('.arrow').on('click', function () {
			bridge.callHandler('backToApp', function (response) {
				alert(response)
			})
		})
		$('.header-right').on('click', function () {
			bridge.callHandler('waitTakeGoods', function (response) {
				alert(response)
			})
		})
		bridge.registerHandler('sendtoken', function (data) {
			alert(data.token)
		})
	})

	// 退出
	$('.arrow').on('click', function () {
		if (from) {
			window.history.back()
		} else {
			backToApp()
		}
	})
	function backToApp() {
		console.log('back to app')
		if (type === 'android') {
			window.android.backToApp()
		}
	}
	$.prototype.backToApp = backToApp

	// 跳转待提货页面
	$('.header-right').on('click', function () {
		waitTakeGoods()
	})
	function waitTakeGoods() {
    if (type === 'android') {
      console.log('待提货')
		}
	}
})
