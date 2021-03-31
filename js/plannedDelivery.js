$(function () {
  $('.arrow').on('click', function() {
    backToApp()
  })
  function backToApp() {
    console.log('back to app')
  }
  $('.header-right').on('click', function() {
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
	var token
	token = window.location.href.split('token=')[1]
	console.log(token)
	// token =
	// 	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'
	sessionStorage.setItem('token', token)

	// 页面跳转
	$loadingAddress.on('click', function () {
		window.location.href = './loadingAddress.html?from=plannedDelivery'
	})
	$unloadGoods.on('click', function () {
		window.location.href = './unloadGoods.html?from=plannedDelivery'
	})
	$goodsInfo.on('click', function () {
		window.location.href = './goodsInfo.html?from=plannedDelivery'
	})

	// 获取用户信息 （税率）
	function queryRate() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/user/info',
			type: 'POST',
			headers: {
				token
			},
			success: function (res) {
				// console.log(res.result)
				rate = res.result.company.rate
				$rate[0].innerText = rate
			}
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

	$submitBtn.on('click', function () {
		// 如果按钮灰色 直接return
		if ($submitBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		var data = JSON.stringify(submitData)
		console.log(data)
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/order/planDelivery',
			type: 'POST',
			data: { body: data },
			headers: {
				token
			},
			success: function (res) {
				console.log(res)
        backToApp()
			}
		})
	})
})