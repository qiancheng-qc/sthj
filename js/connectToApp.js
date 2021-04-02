// app交互代码
$(function () {
	var type = window.location.href.split('type=')[1].split('&')[0]
	console.log(type)
	console.log($('.arrow'))
	console.log($('.header-right'))
	$('.arrow').on('click', function () {
		backToApp()
	})
	function backToApp() {
		console.log('back to app')
		if (type === 'android') {
			window.android.backToApp()
		} else if (type === 'ios') {
			console.log('ios')
		}
	}
	$('.header-right').on('click', function () {
		waitTakeGoods()
	})
	function waitTakeGoods() {
		console.log('待提货')
		if (type === 'android') {
			console.log('待提货android')
		} else if (type === 'ios') {
			console.log('待提货ios')
		}
	}
})
