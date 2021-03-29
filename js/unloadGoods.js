$(function () {
	var $confirmBtn = $('.confirmBtn') // 页面最下方确定按钮
	var $areaDiv = $('#area') // 所在省市区一栏
	var $areaText = $('#areaText') // 所在省市区文本
	var $detailText = $('#detailText') // 详细地址输入框
	var region // 级联选择框的数据
	// 提交后台的数据
	var areaData = {
		province: '',
		city: '',
		area: '',
		pc: '',
		cc: '',
		ac: '',
		address: '',
		name: '',
		mobile: '',
		idNo: '',
		time: ''
	}
	// 信息维护接口获取的收货人信息
	var deliveryInfo = {
		name: '',
		mobile: '',
		idNo: ''
	}
	// 省市区弹出框
	var picker = new mui.PopPicker({
		layer: 3
	})

	// 获取时间
	var time = new Date()
	areaData.time = time.getFullYear() + '-' + (time.getMonth() + 1 + '').padStart(2, 0) + '-' + time.getDate()

	var token
	token =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'

	var $left = $('#left') // 历史地址容器
	var historyAddress = [] // 获取的历史地址
	var chosenId // 历史地址选中的id

	// 获取信息维护信息 （发货人 收货人 name,mobile,idNo）
	function queryInfo() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/company/info',
			type: 'POST',
			headers: {
				token
			},
			success: function (res) {
				console.log(res.result)
				deliveryInfo.name = res.result.startName
				deliveryInfo.mobile = res.result.startMobile
				deliveryInfo.idNo = res.result.startIdNo
			}
		})
	}

	// 获取历史地址
	function queryHistoryAddr() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/company/line/historyAddr',
			type: 'POST',
			headers: {
				token
			},
			data: {
				curPage: 1,
				pageSize: 1000000
			},
			success: function (res) {
				if (res.result.content.length === 0) {
					$left.find('.empty').show()
				} else {
					historyAddress = res.result.content
					renderAddrs(historyAddress)
				}
			}
		})
	}

	// 创建历史地址
	function createAddrInfo(id, location, detail) {
		return `<div class="popup-middle" data-id="location${id}">
              <image class="image" src="../images/ordinary/地址.png" mode=""></image>
              <div class="middle-content">
                <div class="middle-text">${location}</div>
                <div class="middle-item">${detail}</div>
              </div>
              <div class="chosenOne"></div>
            </div>`
	}

	// 将创建的历史地址渲染到页面
	function renderAddrs(arr) {
		arr.forEach(x => {
			var location = ''
			if (x.province === x.city) {
				location = x.province
			} else if (x.city === x.area) {
				location = x.province + x.city
			} else {
				location = x.province + x.city + x.area
			}
			var infoDiv = createAddrInfo(x.id, location, x.address)
			$left.append(infoDiv)
		})
	}

	queryInfo() // 获取收货人 name,mobile,idNo
	queryHistoryAddr() // 获取历史地址

	var $contentRoad = $('.contentRoad') // 历史/常用路线 按钮
	var $popup = $('#popup') // 历史/常用路线弹出框弹出
	var $popupBottom = $('.popup-bottom') // 历史/常用路线弹出框
	var $popupConfirm = $('#popup_confirm') // 历史/常用路线弹出框底部按钮

	// 点击跳出历史/常用路线弹出框弹出框
	$contentRoad.on('click', function () {
		$popup.show()

		// 选择框上滑特效
		var bottomVal = -340
		$popupBottom.css('bottom', bottomVal + 'px')
		setInterval(function () {
			if (bottomVal < 0) {
				bottomVal += 17
				$popupBottom.css('bottom', bottomVal + 'px')
			}
		}, 10)
	})
	// 点击关闭历史/常用路线弹出框弹出框
	$popup.on('click', function () {
		$popup.hide()
	})
	// 阻止冒泡
	$popupBottom.on('click', function (e) {
		e.stopPropagation()
	})

	// 历史/常用切换
	var $popupTop = $('.popup-top')
	var $lr = $('.lr')
	$popupTop.children().click(function () {
		$(this).removeClass('caddress').addClass('laddress').siblings().removeClass('laddress').addClass('caddress')
		$lr.children().eq($(this).index()).show().siblings().hide()
	})

	// 点击历史地址 选中
	$left.on('click', '.popup-middle', function () {
		chosenId = $(this).data('id').split('location')[1]
		$(this).find('.chosenOne').show()
		$(this).siblings().find('.chosenOne').hide()
	})

	// 历史/常用路线弹出框底部确定按钮
	$popupConfirm.on('click', function () {
		console.log(historyAddress)
		historyAddress.forEach(x => {
			if (x.id === +chosenId) {
				console.log(x)
				areaData.province = x.province
				areaData.city = x.city
				areaData.area = x.area
				areaData.pc = x.pc
				areaData.cc = x.cc
				areaData.ac = x.ac
				areaData.address = x.address
				areaData.name = x.name
				areaData.mobile = x.phone
				areaData.idNo = x.idNo
			}
		})

		// 赋值给详细地址input
		$detailText.val(areaData.address)

		// 修改所在省市区文字
		changeAreaText()
		// 底部按钮颜色
		confirmBtnColor()
		// 弹出框关闭
		$popup.hide()
	})

	// 获取省市区json数据
	function queryData() {
		$.ajax({
			url: 'http://t.company.sthjnet.com/region.json',
			type: 'GET',
			success: function (res) {
				region = res
				// 处理数据
				region.forEach(x => {
					x.value = x.code
					x.text = x.name

					if (!x.list) {
						x.children = [
							{
								code: x.code,
								name: x.name,
								value: x.value,
								text: x.text
							}
						]
					} else {
						x.children = x.list
					}

					x.children.forEach(y => {
						y.value = y.code
						y.text = y.name
						if (!y.list) {
							y.children = [
								{
									value: y.value,
									text: y.text
								}
							]
						} else {
							y.children = y.list
							y.children.forEach(z => {
								z.value = z.code
								z.text = z.name
							})
						}
					})
				})
				picker.setData(region)
			}
		})
	}
	queryData()

	// 修改级联选择框样式
	var $muiPoppicker = $('.mui-poppicker')
	$muiPoppicker.append('<div class="picker_title">所在省市区</div>')
	var $muiBg = $('.mui-pciker-rule-bg')
	$muiBg.append('<div class="blue"></div>')

	// 级联选择框显示
	$areaDiv.on('click', function () {
		areaShow()
	})
	function areaShow() {
		picker.show(function (selectItems) {
			console.log(selectItems)

			// 给areaData中赋值
			areaData.province = selectItems[0].text
			areaData.city = selectItems[1].text
			areaData.area = selectItems[2].text
			areaData.pc = selectItems[0].value
			areaData.cc = selectItems[1].value
			areaData.ac = selectItems[2].value
			console.log(areaData)

			// 清空详细地址
			$detailText.val('')
			areaData.address = ''

			// 从信息维护接口获取的收货人信息
			areaData.name = deliveryInfo.name
			areaData.mobile = deliveryInfo.mobile
			areaData.idNo = deliveryInfo.idNo

			// 修改所在省市区文字
			changeAreaText()
			// 底部按钮颜色
			confirmBtnColor()
		})
	}

	// 详细信息input值赋值给areaData.address
	$detailText.on('input', function () {
		areaData.address = $(this).val()
		confirmBtnColor()
	})

	// 修改所在省市区文字
	function changeAreaText() {
		if (areaData.province === areaData.city) {
			$areaText[0].innerText = areaData.province
		} else if (areaData.city === areaData.area) {
			$areaText[0].innerText = areaData.province + areaData.city
		} else {
			$areaText[0].innerText = areaData.province + areaData.city + areaData.area
		}
	}

	// 判断提交按钮颜色
	function confirmBtnColor() {
		if (areaData.address && areaData.province) {
			$confirmBtn.removeClass('bottomGray').addClass('bottomBlue')
		} else {
			$confirmBtn.removeClass('bottomBlue').addClass('bottomGray')
		}
	}
	confirmBtnColor()

	var to = window.location.href.split('from=')[1]

	// 页面底部按钮 点击提交
	$confirmBtn.on('click', function () {
		if ($confirmBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		sessionStorage.setItem('end', JSON.stringify(areaData))
		console.log(areaData)

		window.location.replace(to + '.html')
	})
})
