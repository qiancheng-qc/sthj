$(function () {
	// 提交的内容
	var data = {
		unit: '吨',
		amount: 0,
		volume: 0,
		ton: 0,
		category: '0100',
		btc: '1002996',
		price: 0,
		name: ''
	}
	// 税率
	var rate = 0

	// 获取用户信息 （税率）
	function queryInfo() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/user/info',
			type: 'POST',
			headers: {
				token:
					'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'
			},
			data,
			success: function (res) {
				rate = res.result.company.rate / 100
			}
		})
	}
	queryInfo()

	var $businessTags = $('.business-type .tag') // 业务类型标签
	var $goodsTags = $('.goods-type .tag') // 货物类型标签
	// 标签点击变蓝 其他还原
	$businessTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
		data.btc = $(this).data('id')
	})
	$goodsTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
		data.category = $(this).data('id')
	})

	var $drop = $('.drop') // 发货数量单位下拉箭头
	var $picker = $('.picker') // 弹出
	var $pickerBottom = $('.picker-bottom') // 弹出的选择框
	$drop.on('click', function () {
		$picker.show() // 点击下拉弹出框出现

		// 选择框上滑特效
		var bottomVal = -280
		$pickerBottom.css('bottom', bottomVal + 'px')
		setInterval(function () {
			if (bottomVal < 0) {
				bottomVal += 14
				$pickerBottom.css('bottom', bottomVal + 'px')
			}
		}, 10)
	})
	$picker.on('click', function () {
		$picker.hide() // 点击关闭弹出框
	})
	$pickerBottom.on('click', function (e) {
		e.stopPropagation() // 阻止冒泡
	})

	var $options = $('.option') // 弹出框选择器option
	var $item1 = $('#item1') // 发货数量1
	var $item2 = $('#item2') // 发货数量2
	var $item3 = $('#item3') // 发货数量3
	var text = $item1.children('.danwei')[0].innerText // 发货数量1 单位
	// 选择选择器 边灰色 发货数量1单位改变
	$options.on('click', function () {
		$(this).children('.option-inner').addClass('chosen')
		$(this).siblings().children('.option-inner').removeClass('chosen')
		text = $(this).children('.option-inner')[0].innerText
		data.unit = text
	})

	var $cancelBtn = $('#cancel-btn') // 选择器取消按钮
	var $confirmBtn = $('#confirm-btn') // 选择器确定按钮
	// 取消按钮点击 直接关闭
	$cancelBtn.on('click', function () {
		$picker.hide()
	})
	// 确定按钮点击 改变发货数量样式
	$confirmBtn.on('click', function () {
		$item1.find('input').val('')
		$item2.find('input').val('')
		$item3.find('input').val('')
		data.amount = data.volume = data.ton = 0
		$item1.children('.danwei')[0].innerText = text
		subBtnColor()
		if (text === '吨') {
			$item2.hide()
			$item3.hide()
		} else if (text === '方') {
			$item2.hide()
			$item3.show()
		} else {
			$item2.show()
			$item3.show()
		}
		$picker.hide()
	})

	// 发货数量1
	$item1.find('input').on('input', function () {
		console.log($(this).val())
		data.amount = $(this).val()
		if (data.unit === '吨') {
			data.ton = $(this).val()
		} else if (data.unit === '方') {
			data.volume = $(this).val()
		}
		subBtnColor()
	})

	// 发货数量2
	$item2.find('input').on('input', function () {
		console.log($(this).val())
		data.volume = $(this).val()
		subBtnColor()
	})

	// 发货数量3
	$item3.find('input').on('input', function () {
		console.log($(this).val())
		data.ton = $(this).val()
		subBtnColor()
	})

	// 运费金额改动 运费总金额随之变动（乘以税率）
	var $price = $('#price') // 运费金额
	var $totalSum = $('.total_sum') // 运费总金额
	console.log($totalSum[0].innerText)
	$price.on('input', function () {
		data.price = $(this).val()
		subBtnColor()
		if ($(this).val()) {
			$totalSum[0].innerText = ($(this).val() * (1 + rate)).toFixed(2)
		} else {
			$totalSum[0].innerText = '0.00'
		}
	})

	// 货物名称
	var $goodsName = $('#goods_name')
	$goodsName.on('input', function () {
		data.name = $(this).val()
		subBtnColor()
	})

  // 提交按钮颜色
	function subBtnColor() {
		if ($item3.css('display') === 'none') {
			if (data.name && data.price && data.amount && data.ton) {
				$submitBtn.removeClass('gray').addClass('blue')
			} else {
				$submitBtn.removeClass('blue').addClass('gray')
			}
		} else {
			if (data.name && data.price && data.amount && data.ton && data.volume) {
				$submitBtn.removeClass('gray').addClass('blue')
			} else {
				$submitBtn.removeClass('blue').addClass('gray')
			}
		}
	}

	// 提交按钮
	var $submitBtn = $('#submit_btn')

	// 传递数据
	$submitBtn.on('click', function () {
    // 如果按钮灰色 直接return
		if ($submitBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		console.log(data)
		sessionStorage.setItem('goodsInfo', JSON.stringify(data))
	})
})
