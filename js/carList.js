$(function () {
	$('.arrow').on('click', function () {
		backToApp()
	})
	function backToApp() {
		console.log('back to app')
	}

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

	// 创建司机信息 class="driver-info"
	function createDriverInfo(id, name, phone, carNum, statusClass, statusName) {
		return `<div class="driver-info" data-id="${id}">
              <div class="radio">
                <input class="driver-input" type="checkbox" name="driver" id="input${id}" />
                <label class="mui-icon driver-label" for="input${id}"></label>
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
		$.prototype.http('company/drive/list', data, function (res) {
			res.result.content.forEach(x => {
				driversData.push({
					id: x.id,
					name: x.driver.name,
					phone: x.driver.mobile,
					carNum: x.truck.code,
					// statusClass: x.cnt > 0 ? 'busy' : 'notBusy',
					// statusName: x.cnt > 0 ? '已指派' : '空闲中'
					statusClass: 'notBusy',
					statusName: '空闲中'
				})
			})
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

	// driversData = [
	// 	{ id: 1, name: '张三', phone: 13311111111, carNum: '皖A12345', statusClass: 'notBusy', statusName: '空闲中' },
	// 	{ id: 2, name: '李四', phone: 13322222222, carNum: '皖A12345', statusClass: 'notBusy', statusName: '空闲中' },
	// 	{ id: 3, name: '王五', phone: 13333333333, carNum: '皖A12345', statusClass: 'notBusy', statusName: '空闲中' },
	// 	{ id: 4, name: '赵六', phone: 13344444444, carNum: '皖A12345', statusClass: 'notBusy', statusName: '空闲中' },
	// 	{ id: 5, name: '周七', phone: 13355555555, carNum: '皖A12345', statusClass: 'notBusy', statusName: '空闲中' },
	// 	{ id: 6, name: '周八', phone: 13366666666, carNum: '皖A12345', statusClass: 'busy', statusName: '已指派' },
	// 	{ id: 7, name: '周九', phone: 13377777777, carNum: '皖A12345', statusClass: 'busy', statusName: '已指派' },
	// 	{ id: 8, name: '周十', phone: 13388888888, carNum: '皖A12345', statusClass: 'busy', statusName: '已指派' }
	// ]
	// renderDrivers(driversData)

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
		if (statusClassName === 'notBusy') {
			$(this).find('.driver-input')[0].checked = !$(this).find('.driver-input')[0].checked
			if ($(this).find('.driver-input')[0].checked) {
				count++
				console.log($(this).data('id'))
				submitData.push($(this).data('id'))
			} else {
				count--
				console.log($(this).data('id'))
				var i = $.inArray($(this).data('id'), submitData)
				submitData.splice(i, 1)
				console.log($.inArray($(this).data('id'), submitData))
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
