// // app交互代码 普通发货页面专属
// $(function () {
// 	var type = window.location.href.split('type=')[1].split('&')[0]
// 	var from = window.location.href.split('from=')[1].split('&')[0]
// 	console.log(type)
// 	console.log(from)

// 	// 退出
// 	$('.arrow').on('click', function () {
// 		backToApp()
// 	})
// 	function backToApp() {
// 		console.log('back to app')
// 		if (from === 'carlist') {
// 			window.history.back()
// 		} else {
// 			if (type === 'android') {
// 				window.android.backToApp()
// 			} else if (type === 'ios') {
// 				console.log('ios')
// 			}
// 		}
// 	}
// 	$.prototype.backToApp = backToApp

// 	// 跳转待提货页面
// 	$('.header-right').on('click', function () {
// 		waitTakeGoods()
// 	})
// 	function waitTakeGoods() {
// 		console.log('待提货')
// 		if (type === 'android') {
// 			console.log('待提货android')
// 		} else if (type === 'ios') {
// 			console.log('待提货ios')
// 		}
// 	}
// })
