$(function () {
	var $drivers = $('.drivers')
	var $searchInput = $('.search-box input') // 搜索框
	var $searchBtn = $('.search-box button') // 搜索按钮
	var $count = $('.bottom-left span') // 选中司机数量
	var $confirmBtn = $('.confirm-btn') // 右下角确定按钮
	var count = 0 // 选中司机数量
	var data = {
		curPage: 1,
		pageSize: 10,
		driverName: '',
		driverPhone: ''
	}
	var driversData = [] // 后台数据
	var submitData = [] // 提交的内容 数组
	var driversName = [] // 选中司机的名字 数组

	// 创建司机信息 class="driver-info"
	function createDriverInfo(id, name, phone, carNum, statusClass, statusName, authentication) {
		return `<div class="driver-info" data-id="${id}">
              <div class="radio">
                <input class="driver-input" type="checkbox" name="driver" id="input${id}" />
                <label class="mui-icon driver-label" for="input${id}"></label>
              </div>
              <div class="name-phone">
                <div class="name">${name}&nbsp;&nbsp;<span style="color: #5c5c5c; font-size: 12px; width: 45px; text-align: center; background-color: #FFDD3A; line-height: 18px; border-radius: 2px; display: inline-block">${authentication}</span></div>
                <div class="phone">${phone}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #0A41CD;">${carNum}</span></div>
              </div>
              <div class="driver-status">
                <div class="${statusClass}">${statusName}</div>
              </div>
            </div>`
	}

	// 将创建的司机信息渲染到页面
	function renderDrivers(arr) {
		arr.forEach(x => {
			var infoDiv = createDriverInfo(x.id, x.name, x.phone, x.carNum, x.statusClass, x.statusName, x.authentication)
			$drivers.append(infoDiv)
		})
	}

	// 搜索
	function searchDriverBy(val) {
		if (!val) {
			data.driverName = data.driverPhone = ''
		} else if (val.length === 11) {
			data.driverPhone = val
			data.driverName = ''
		} else {
			data.driverPhone = ''
			data.driverName = val
		}
		queryData()
	}

	// 确定按钮颜色
	function confirmBtnColor() {
		if (submitData.length) {
			$confirmBtn.removeClass('gray').addClass('blue')
		} else {
			$confirmBtn.removeClass('blue').addClass('gray')
		}
	}

	// 获取数据
	function queryData() {
		$.prototype.http('company/drive/driverFree', data, function (res) {
			console.log(res)
			res.result.content.forEach(x => {
				driversData.push({
					id: x.drive.id,
					name: x.drive.driver.name,
					phone: x.drive.driver.mobile,
					carNum: x.drive.truck.code,
					statusClass: x.cnt > 0 ? 'busy' : 'notBusy',
					statusName: x.cnt > 0 ? '已指派' : '空闲中',
					authentication: x.drive.state === 1 ? '未认证' : ''
				})
			})
			console.log(driversData)
			renderDrivers(driversData)
			driversData = []
		})
	}
	queryData()

	// 页面滚动加载
	var timer
	window.onscroll = function () {
		throttle()
	}
	function throttle() {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null
				var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight)
				//视窗的高度
				var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
				//隐藏的高度
				var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
				// console.log(pageHeight)
				// console.log(viewportHeight)
				// console.log(scrollHeight)
				if (pageHeight - viewportHeight - scrollHeight < 20) {
					//如果满足触发条件，执行
					data.curPage++
					queryData()
				}
			}, 1000)
		}
	}

	$searchBtn.on('click', function () {
		data.curPage = 1
		searchDriverBy($searchInput.val())
		$searchInput.val('')
		$drivers.empty()
		submitData = []
		driversName = []
		count = 0
		$count[0].innerText = count
		confirmBtnColor()
	})

	// 选中司机
	$drivers.on('click', '.driver-info', function () {
		// 司机空闲中点击可添加
		var statusClassName = $(this).find('.driver-status').children().attr('class')
		if (statusClassName === 'notBusy') {
			$(this).find('.driver-input')[0].checked = !$(this).find('.driver-input')[0].checked
			if ($(this).find('.driver-input')[0].checked) {
				count++
				submitData.push($(this).data('id'))
				var i2 = $.inArray($(this).find('.name')[0].innerText, driversName)
				driversName.push($(this).find('.name')[0].innerText)
				if (i2 !== -1) {
					count--
					driversName.splice(i2, 1)
					mui.toast('该司机已被选中')
					$(this).find('.driver-input')[0].checked = false
				}
				console.log(driversName)
			} else {
				count--
				var i = $.inArray($(this).data('id'), submitData)
				submitData.splice(i, 1)
				var i2 = $.inArray($(this).find('.name')[0].innerText, driversName)
				driversName.splice(i2, 1)
			}
		} else {
			$(this).find('.driver-input')[0].disabled = true
		}

		$count[0].innerText = count

		confirmBtnColor()
	})

	$confirmBtn.on('click', function () {
		// 如果按钮灰色 直接return
		if ($confirmBtn.css('background-color') === 'rgb(158, 158, 158)') {
			return
		}

		console.log(submitData)
		sessionStorage.setItem('driver', JSON.stringify(submitData))

		window.location.href = '../ordinary.html?type=ios&from=carlist'
	})
})
