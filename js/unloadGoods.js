$(function () {
	var $confirmBtn = $('.confirmBtn') // 页面最下方确定按钮
	var $areaDiv = $('#area') // 所在省市区一栏
	var $areaText = $('#areaText') // 所在省市区文本
	var $detailText = $('#detailText') // 详细地址输入框
	var region // 级联选择框的数据
	// 提交后台的数据
	var areaData = [
		{
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
		},
		{
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
	]
	// 信息维护接口获取的发货人信息
	var deliveryInfo = {
		name: '',
		mobile: '',
		idNo: '',
		name2: '',
		mobile2: '',
		idNo2: ''
	}
	// 省市区弹出框
	var picker = new mui.PopPicker({
		layer: 3
	})

	// 获取时间
	var time = new Date()
	areaData[0].time = areaData[1].time =
		time.getFullYear() +
		'-' +
		(time.getMonth() + 1 + '').padStart(2, 0) +
		'-' +
		(time.getDate() + '').padStart(2, 0) +
		' ' +
		(time.getHours() + '').padStart(2, 0) +
		':' +
		(time.getMinutes() + '').padStart(2, 0) +
		':' +
		(time.getSeconds() + '').padStart(2, 0)

	var $left = $('#left') // 历史地址容器
	var $right = $('#right') // 常用路线容器
	var historyAddress = [] // 获取的历史地址
	var hisAddr = [] // 获取的常用路线
	var chosenId // 历史地址选中的id
	var chosenId2 // 常用路线选中的id

	// 获取信息维护信息 （发货人 收货人 name,mobile,idNo）
	function queryInfo() {
		$.prototype.http('company/company/info', '', function (res) {
			console.log(res.result)
			deliveryInfo.name = res.result.startName
			deliveryInfo.mobile = res.result.startMobile
			deliveryInfo.idNo = res.result.startIdNo

			deliveryInfo.name2 = res.result.endName
			deliveryInfo.mobile2 = res.result.endMobile
			deliveryInfo.idNo2 = res.result.endIdNo
		})
	}

	// 获取历史地址
	function queryHistoryAddr() {
		$.prototype.http(
			'company/line/historyAddr',
			{
				curPage: 1,
				pageSize: 1000000
			},
			function (res) {
				if (res.result.content.length > 0) {
					$left.find('.empty').hide()
					historyAddress = res.result.content
					renderAddrs(historyAddress)
				}
			}
		)
	}

	// 获取常用路线
	function getList() {
		$.prototype.http(
			'company/line/getList',
			{
				curPage: 1,
				pageSize: 1000000
			},
			function (res) {
				console.log(res.result.content)
				if (res.result.content.length > 0) {
					$right.find('.empty').hide()
					hisAddr = res.result.content
					renderAddrs2(hisAddr)
				}
			}
		)
	}

	// 创建历史地址
	function createAddrInfo(id, location, detail) {
		return `<div class="popup-middle" data-id="location${id}">
              <image class="image" src="../images/ordinary/location.png" mode=""></image>
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

	// 创建常用路线
	function createAddrInfo2(id, location, detail, location2, detail2) {
		return `<div class="popup-middle" data-id="line${id}">
              <image class="image" src="../images/ordinary/location.png" mode=""></image>
              <div class="middle-content2">
                <div class="middle-text">${location}</div>
                <div class="middle-item">${detail}</div>
              </div>
              <div class="right_arrow"></div>
              <div class="middle-content2">
                <div class="middle-text">${location2}</div>
                <div class="middle-item">${detail2}</div>
              </div>
              <div class="chosenOne"></div>
            </div>`
	}

	// 将创建的常用路线渲染到页面
	function renderAddrs2(arr) {
		arr.forEach(x => {
			var location = ''
			var location2 = ''
			if (x.stProvince === x.stCity) {
				location = x.stProvince
			} else if (x.stCity === x.stArea) {
				location = x.stProvince + x.stCity
			} else {
				location = x.stProvince + x.stCity + x.stArea
			}
			if (x.destProvince === x.destCity) {
				location2 = x.destProvince
			} else if (x.destCity === x.destArea) {
				location2 = x.destProvince + x.destCity
			} else {
				location2 = x.destProvince + x.destCity + x.destArea
			}
			var infoDiv = createAddrInfo2(x.id, location, x.stAddress, location2, x.destAddress)
			$right.append(infoDiv)
		})
	}

	queryInfo() // 获取发货人 name,mobile,idNo
	queryHistoryAddr() // 获取历史地址
	getList() // 获取常用路线

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
	var sign = '历史地址'
	var $popupTop = $('.popup-top')
	var $lr = $('.lr')
	$popupTop.children().click(function () {
		sign = $(this)[0].innerText
		$(this).removeClass('caddress').addClass('laddress').siblings().removeClass('laddress').addClass('caddress')
		$lr.children().eq($(this).index()).show().siblings().hide()
	})

	// 点击历史地址 选中
	$left.on('click', '.popup-middle', function () {
		chosenId = $(this).data('id').split('location')[1]
		$(this).find('.chosenOne').show()
		$(this).siblings().find('.chosenOne').hide()
	})

	// 点击常用路线 选中
	$right.on('click', '.popup-middle', function () {
		chosenId2 = $(this).data('id').split('line')[1]
		$(this).find('.chosenOne').show()
		$(this).siblings().find('.chosenOne').hide()
	})

	var saveSign = false
	// 历史/常用路线弹出框底部确定按钮
	$popupConfirm.on('click', function () {
		console.log(sign)
		if (sign === '历史地址') {
			if (chosenId) {
				historyAddress.forEach(x => {
					if (x.id === +chosenId) {
						console.log(x)
						areaData[0].province = x.province
						areaData[0].city = x.city
						areaData[0].area = x.area
						areaData[0].pc = x.pc
						areaData[0].cc = x.cc
						areaData[0].ac = x.ac
						areaData[0].address = x.address
						areaData[0].name = x.name
						areaData[0].mobile = x.phone
						areaData[0].idNo = x.idNo
					}
				})

				console.log(areaData)

				saveSign = false

				// 赋值给详细地址input
				$detailText.val(areaData[0].address)

				// 修改所在省市区文字
				changeAreaText()
			}
		} else {
			if (chosenId2) {
				hisAddr.forEach(x => {
					console.log(x)
					if (x.id === +chosenId2) {
						console.log(x)
						areaData[1].province = x.stProvince
						areaData[1].city = x.stCity
						areaData[1].area = x.stArea
						areaData[1].pc = x.stProvinceCode
						areaData[1].cc = x.stCityCode
						areaData[1].ac = x.stAreaCode
						areaData[1].address = x.stAddress
						// 从信息维护接口获取的收货人信息
						areaData[1].name = deliveryInfo.name2
						areaData[1].mobile = deliveryInfo.mobile2
						areaData[1].idNo = deliveryInfo.idNo2

						areaData[0].province = x.destProvince
						areaData[0].city = x.destCity
						areaData[0].area = x.destArea
						areaData[0].pc = x.destProvinceCode
						areaData[0].cc = x.destCityCode
						areaData[0].ac = x.destAreaCode
						areaData[0].address = x.destAddress
						// 从信息维护接口获取的发货人信息
						areaData[0].name = deliveryInfo.name
						areaData[0].mobile = deliveryInfo.mobile
						areaData[0].idNo = deliveryInfo.idNo
					}
				})

				saveSign = false

				// 赋值给详细地址input
				$detailText.val(areaData[0].address)

				// 修改所在省市区文字
				changeAreaText()
			}
		}

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
			areaData[0].province = selectItems[0].text
			areaData[0].city = selectItems[1].text
			areaData[0].area = selectItems[2].text
			areaData[0].pc = selectItems[0].value
			areaData[0].cc = selectItems[1].value
			areaData[0].ac = selectItems[2].value
			console.log(areaData)

			// 清空详细地址
			$detailText.val('')
			areaData[0].address = ''

			saveSign = false

			// 从信息维护接口获取的发货人信息
			areaData[0].name = deliveryInfo.name
			areaData[0].mobile = deliveryInfo.mobile
			areaData[0].idNo = deliveryInfo.idNo

			// 修改所在省市区文字
			changeAreaText()
			// 底部按钮颜色
			confirmBtnColor()
		})
	}

	// 详细信息input值赋值给areaData.address
	$detailText.on('input', function () {
		areaData[0].address = $(this).val()
		saveSign = true
		confirmBtnColor()
	})

	// 修改所在省市区文字
	function changeAreaText() {
		if (areaData[0].province === areaData[0].city) {
			$areaText[0].innerText = areaData[0].province
		} else if (areaData[0].city === areaData[0].area) {
			$areaText[0].innerText = areaData[0].province + areaData[0].city
		} else {
			$areaText[0].innerText = areaData[0].province + areaData[0].city + areaData[0].area
		}
	}

	// 判断提交按钮颜色
	function confirmBtnColor() {
		if (areaData[0].address && areaData[0].province) {
			$confirmBtn.removeClass('bottomGray').addClass('bottomBlue')
		} else {
			$confirmBtn.removeClass('bottomBlue').addClass('bottomGray')
		}
	}
	confirmBtnColor()

	// 页面底部按钮 点击提交
	$confirmBtn.on('click', function () {
		if ($confirmBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		sessionStorage.setItem('saveSign', saveSign)
		sessionStorage.setItem('end', JSON.stringify(areaData[0]))
		if (sign === '常用路线') {
			sessionStorage.setItem('start', JSON.stringify(areaData[1]))
		}
		console.log(areaData)

		// 返回并刷新
		sessionStorage.setItem('history', true)
		window.history.back()
	})
})
