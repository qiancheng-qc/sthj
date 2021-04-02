// app交互代码
$(function () {
	var type = window.location.href.split('type=')[1].split('&')[0]
	console.log(type)
	// alert(type)
	function setupWebViewJavascriptBridge(callback) {
		if (type === 'ios') {
			if (window.WebViewJavascriptBridge) {
				return callback(WebViewJavascriptBridge)
			}
			if (window.WVJBCallbacks) {
				return window.WVJBCallbacks.push(callback)
			}
			window.WVJBCallbacks = [callback]
			var WVJBIframe = document.createElement('iframe')
			WVJBIframe.style.display = 'none'
			WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
			document.documentElement.appendChild(WVJBIframe)
			setTimeout(function () {
				document.documentElement.removeChild(WVJBIframe)
			}, 0)
		}
	}
	setupWebViewJavascriptBridge(function (bridge) {
		document.querySelector('.arrow').onclick = function () {
			bridge.registerHandler('backToApp', function () {
				alert('backToApp')
				console.log('backToApp')
			})
		}
		// $('.arrow').on('click', function () {
		// 	bridge.registerHandler('backToApp', function () {
		// 		alert('backToApp')
		// 		console.log('backToApp')
		// 	})
		// })
		bridge.callHandler('sendtoken', function (responseData) {
			console.log(responseData)
			alert(responseData)
		})
	})

	// sendtoken()

	// var ifCarList = window.location.href.indexOf('from')
	// if (ifCarList !== -1) {
	// 	var from = window.location.href.split('from=')[1].split('&')[0]
	// 	console.log(from)
	// }
	// var type = window.location.href.split('type=')[1].split('&')[0]
	// console.log(type)
	// 退出
	// $('.arrow').on('click', function () {
	// 	if (from) {
	// 		window.history.back()
	// 	} else {
	// 		backToApp()
	// 	}
	// })
	// function backToApp() {
	// 	console.log('back to app')
	// 	if (type === 'android') {
	// 		window.android.backToApp()
	// 	} else if (type === 'ios') {
	// 		console.log('ios')
	// 	}
	// }
	// $.prototype.backToApp = backToApp

	// // 跳转待提货页面
	// $('.header-right').on('click', function () {
	// 	waitTakeGoods()
	// })
	// function waitTakeGoods() {
	// 	console.log('待提货')
	// 	if (type === 'android') {
	// 		console.log('待提货android')
	// 	} else if (type === 'ios') {
	// 		console.log('待提货ios')
	// 	}
	// }
})
