$(function () {
	var $loadingAddress = $('.loading_address')
	var $unloadGoods = $('.unload_goods')
	var $goodsInfo = $('.goods_info')
	var $driver = $('.driver')
	var $goodsText = $('#goods_text')
	var $driverText = $('#driver_text')
	var $price = $('#price')
	var $rate = $('#rate')
	var $submitBtn = $('#submit_btn')
	var loadingAddressStorage // 从sessionStorage 获取装货地址
	var unloadGoodsStorage // 从sessionStorage 获取卸货地址
	var goodsInfoStorage // 从sessionStorage 获取货物信息
	var driverStorage // 从sessionStorage 获取承运司机
	var rate = 0 // 税率
	// 提交的data
	var submitData = {
		transportWay: 1,
		tstc: '1',
		start: {
			province: '北京市',
			city: '东城区',
			area: '东城区',
			address: 'xxx',
			pc: '110000',
			cc: '110101',
			ac: '110101',
			name: '丁总',
			mobile: '15357159182',
			idNo: '342401199611054470',
			time: '2020-01-01'
		},
		end: {
			province: '天津市',
			city: '和平区',
			area: '和平区',
			address: 'xxx',
			pc: '120000',
			cc: '120101',
			ac: '120101',
			name: '丁总',
			mobile: '15357159182',
			idNo: '342401199611054470',
			time: '2020-01-01'
		}
	}
	var token
	token =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'

	// 页面跳转
	$loadingAddress.on('click', function () {
		window.location.href = './loadingAddress.html'
	})
	$unloadGoods.on('click', function () {
		window.location.href = './unloadGoods.html'
	})
	$goodsInfo.on('click', function () {
		window.location.href = './goodsInfo.html?from=ordinary'
	})
	$driver.on('click', function () {
		window.location.href = './chooseDriver.html'
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
				rate = res.result.company.rate
				$rate[0].innerText = rate
			}
		})
	}
	queryRate()

	// 获取信息维护信息 （发货人 收货人 name,mobile,idNo）
	function queryInfo() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/company/info',
			type: 'POST',
			headers: {
				token
			},
			success: function (res) {
				// submitData.start.name = res.result.startName
				// submitData.start.mobile = res.result.startMobile
				// submitData.start.idNo = res.result.startIdNo
				// submitData.end.name = res.result.endName
				// submitData.end.mobile = res.result.endMobile
				// submitData.end.idNo = res.result.endIdNo
			}
		})
	}
	queryInfo()

	// 从sessionStorage获取数据并处理
	function checkLoadingAddress() {}
	function checkUnloadGoods() {}
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
	function checkDriver() {
		driverStorage = JSON.parse(sessionStorage.getItem('driver'))

		if (driverStorage) {
			submitData.driver = driverStorage
			$driverText[0].innerText = '已选择'
		} else {
			$driverText[0].innerText = '可选择司机'
		}
	}

	// 判断提交按钮颜色
	function submitBtnColor() {
		if (goodsInfoStorage && driverStorage) {
			$submitBtn.removeClass('gray').addClass('blue')
		} else {
			$submitBtn.removeClass('blue').addClass('gray')
		}
	}

	checkLoadingAddress()
	checkUnloadGoods()
	checkGoodsInfo()
	checkDriver()
	submitBtnColor()

	$submitBtn.on('click', function () {
		// 如果按钮灰色 直接return
		if ($submitBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		var data = JSON.stringify(submitData)
		console.log(data)
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/order/delivery',
			type: 'POST',
			data: { body: data },
			headers: {
				token
			},
			success: function (res) {
				console.log(res)
			}
		})
	})
})
