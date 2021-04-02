$(function () {
	$('.arrow').on('click', function () {
		backToApp()
	})
	function backToApp() {
		console.log('back to app')
	}
	$('.header-right').on('click', function () {
		waitTakeGoods()
	})
	function waitTakeGoods() {
		console.log('待提货')
	}
	var $loadingAddress = $('.loading_address')
	var $unloadGoods = $('.unload_goods')
	var $goodsInfo = $('.goods_info')
	var $goodsText = $('#goods_text')
	var $plannedNum = $('#planned_num')
	var $price = $('#price')
	var $rate = $('#rate')
	var $submitBtn = $('#submit_btn')
	var loadingAddressStorage // 从sessionStorage 获取装货地址
	var unloadGoodsStorage // 从sessionStorage 获取卸货地址
	var goodsInfoStorage // 从sessionStorage 获取货物信息
	var rate = 0 // 税率
	// 提交的data
	var submitData = {
		transportWay: 1,
		tstc: '1'
	}

	// 返回并刷新
	window.onpageshow = function () {
		var historyStorage = sessionStorage.getItem('history')
		if (historyStorage === 'true') {
			sessionStorage.setItem('history', false)
			window.location.reload()
		}
	}

	// 页面跳转
	$loadingAddress.on('click', function () {
		window.location.href = './loadingAddress.html'
	})
	$unloadGoods.on('click', function () {
		window.location.href = './unloadGoods.html'
	})
	$goodsInfo.on('click', function () {
		window.location.href = './goodsInfo.html'
	})

	// 获取用户信息 （税率）
	function queryRate() {
		$.prototype.http('company/user/info', '', function (res) {
			rate = res.result.company.rate
			$rate[0].innerText = rate
		})
	}
	queryRate()

	// 从sessionStorage获取数据并处理
	function checkLoadingAddress() {
		loadingAddressStorage = JSON.parse(sessionStorage.getItem('start'))
		console.log(loadingAddressStorage)

		if (loadingAddressStorage) {
			submitData.start = loadingAddressStorage
			// 修改卸货地址文本
			if (loadingAddressStorage.province === loadingAddressStorage.city) {
				$loadingAddress[1].innerText = loadingAddressStorage.province + loadingAddressStorage.address
			} else if (loadingAddressStorage.city === loadingAddressStorage.area) {
				$loadingAddress[1].innerText = loadingAddressStorage.province + loadingAddressStorage.city + loadingAddressStorage.address
			} else {
				$loadingAddress[1].innerText = loadingAddressStorage.province + loadingAddressStorage.city + loadingAddressStorage.area + loadingAddressStorage.address
			}
		}
	}
	function checkUnloadGoods() {
		unloadGoodsStorage = JSON.parse(sessionStorage.getItem('end'))
		console.log(unloadGoodsStorage)

		if (unloadGoodsStorage) {
			submitData.end = unloadGoodsStorage
			// 修改卸货地址文本
			if (unloadGoodsStorage.province === unloadGoodsStorage.city) {
				$unloadGoods[1].innerText = unloadGoodsStorage.province + unloadGoodsStorage.address
			} else if (unloadGoodsStorage.city === unloadGoodsStorage.area) {
				$unloadGoods[1].innerText = unloadGoodsStorage.province + unloadGoodsStorage.city + unloadGoodsStorage.address
			} else {
				$unloadGoods[1].innerText = unloadGoodsStorage.province + unloadGoodsStorage.city + unloadGoodsStorage.area + unloadGoodsStorage.address
			}
		}
	}
	function checkGoodsInfo() {
		goodsInfoStorage = JSON.parse(sessionStorage.getItem('goodsInfo'))

		if (goodsInfoStorage) {
			submitData.amount = +goodsInfoStorage.amount
			submitData.btc = goodsInfoStorage.btc.toString()
			submitData.category = goodsInfoStorage.category.toString()
			submitData.name = goodsInfoStorage.name
			submitData.price = +goodsInfoStorage.price
			submitData.ton = +goodsInfoStorage.ton
			submitData.unit = +goodsInfoStorage.unit
			submitData.volume = +goodsInfoStorage.volume

			var totalPrice = goodsInfoStorage.totalPrice
			if (totalPrice) {
				$price[0].innerText = totalPrice
			} else {
				$price[0].innerText = '0.00'
			}
			$goodsText[0].innerText = '已选择'
		} else {
			$goodsText[0].innerText = '运费、货物类型'
		}
	}

	// 判断提交按钮颜色
	function submitBtnColor() {
		if (loadingAddressStorage && unloadGoodsStorage && goodsInfoStorage && submitData.num) {
			$submitBtn.removeClass('gray').addClass('blue')
		} else {
			$submitBtn.removeClass('blue').addClass('gray')
		}
	}

	$plannedNum.on('input', function () {
		submitData.num = $(this).val()
		submitBtnColor()
	})

	checkLoadingAddress()
	checkUnloadGoods()
	checkGoodsInfo()
	submitBtnColor()

	var saveSign = sessionStorage.getItem('saveSign')
	console.log(saveSign)

	$submitBtn.on('click', function () {
		// 如果按钮灰色 直接return
		if ($submitBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		if (saveSign === 'true') {
			mui.confirm('是否保存地址', '提示', ['取消', '确认'], saveAddress, 'div')
		} else {
			delivery()
		}
	})
	function delivery() {
		var data = JSON.stringify(submitData)
		console.log(data)
    $.prototype.http('company/order/planDelivery', { body: data }, function (res) {
			console.log(res)
			backToApp()
		})
	}
	function saveAddress(e) {
		if (e.index === 1) {
			$.prototype.http('company/line/historyAddrAdd', submitData.start, function (res) {
				delivery()
				console.log(res)
			})
			$.prototype.http('company/line/historyAddrAdd', submitData.end, function (res) {
				delivery()
				console.log(res)
			})
		} else {
			delivery()
		}
	}
})
