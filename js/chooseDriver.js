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
	function createDriverInfo(id, name, phone, carNum, statusClass, statusName) {
		return `<div class="driver-info" data-id="${id}">
              <div class="radio">
                <input class="driver-input" type="checkbox" name="driver" id="input${id}" />
                <div class="label"><span class="mui-icon mui-icon-checkmarkempty"></span></div>
              </div>
              <div class="name-phone">
                <div class="name">${name}</div>
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
			var infoDiv = createDriverInfo(x.id, x.name, x.phone, x.carNum, x.statusClass, x.statusName)
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
			res.result.content.forEach(x => {
				driversData.push({
					id: x.drive.id,
					name: x.drive.driver.name,
					phone: x.drive.driver.mobile,
					carNum: x.drive.truck.code,
					statusClass: x.cnt > 0 ? 'busy' : 'notBusy',
					statusName: x.cnt > 0 ? '已指派' : '空闲中'
					// statusClass: 'notBusy',
					// statusName: '空闲中'
				})
			})
			renderDrivers(driversData)
			driversData = []
		})
	}
	queryData()

	// 页面滚动加载
	var timer
  throttle()
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
		count = 0
		$count[0].innerText = count
		confirmBtnColor()
	})

	// 选中司机
	$drivers.on('click', '.driver-info', function () {
		// 司机空闲中点击可添加
		var statusClassName = $(this).find('.driver-status').children().attr('class')
    var i = $.inArray($(this).data('id'), submitData)
    var i2 = $.inArray($(this).find('.name')[0].innerText, driversName)
		if (statusClassName === 'notBusy') {
			if ($(this).find('.driver-input')[0].checked) {
				$(this).find('.driver-input')[0].checked = false
				$(this).find('.mui-icon').hide()
				count--
				submitData.splice(i, 1)
				driversName.splice(i2, 1)
			} else {
				if (i2 === -1) {
					$(this).find('.driver-input')[0].checked = true
					$(this).find('.mui-icon').show()
					count++
					submitData.push($(this).data('id'))
					driversName.push($(this).find('.name')[0].innerText)
				} else {
					mui.toast('该司机已被选中')
				}
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

		sessionStorage.setItem('driver', JSON.stringify(submitData))

		// 返回并刷新
		sessionStorage.setItem('history', true)
		window.history.back()
	})
})
