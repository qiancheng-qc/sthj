$(function () {
	var $drivers = $('.drivers')
	var $searchInput = $('.search-box input') // 搜索框
	var $searchBtn = $('.search-box button') // 搜索按钮
	var $count = $('.bottom-left span') // 选中司机数量
	var $confirmBtn = $('.confirm-btn') // 右下角确定按钮
	var count = 0 // 选中司机数量
	var data = [] // 提交的内容 数组
	var axiosInfo // 后台数据

	// 创建司机信息 class="driver-info"
	function createDriverInfo(id, name, phone, statusClass, statusName) {
		return `<div class="driver-info">
              <div class="radio">
                <input class="driver-input" type="checkbox" name="driver" id="input${id}" />
                <label class="mui-icon driver-label" for="input${id}"></label>
              </div>
              <div class="name-phone">
                <div class="name">${name}</div>
                <div class="phone">${phone}</div>
              </div>
              <div class="driver-status">
                <div class="${statusClass}">${statusName}</div>
              </div>
            </div>`
	}
	// 将创建的司机信息渲染到页面
	function renderDrivers(arr) {
		arr.forEach(x => {
			var infoDiv = createDriverInfo(x.id, x.name, x.phone, x.statusClass, x.statusName)
			$drivers.append(infoDiv)
		})
	}
	// 搜索
	function searchDriverBy(val) {
		var res = []
		if (val) {
			axiosInfo.forEach(x => {
				if (x.name === val || x.phone === +val) {
					res.push(x)
				}
			})
			$drivers.empty()
			renderDrivers(res)
		} else {
			$drivers.empty()
			renderDrivers(axiosInfo)
		}
	}

	axiosInfo = [
		{ id: 1, name: '张三', phone: 13311111111, statusClass: 'notBusy', statusName: '空闲中' },
		{ id: 2, name: '李四', phone: 13322222222, statusClass: 'notBusy', statusName: '空闲中' },
		{ id: 3, name: '王五', phone: 13333333333, statusClass: 'notBusy', statusName: '空闲中' },
		{ id: 4, name: '赵六', phone: 13344444444, statusClass: 'notBusy', statusName: '空闲中' },
		{ id: 5, name: '周七', phone: 13355555555, statusClass: 'notBusy', statusName: '空闲中' },
		{ id: 6, name: '周八', phone: 13366666666, statusClass: 'busy', statusName: '已指派' },
		{ id: 7, name: '周九', phone: 13377777777, statusClass: 'busy', statusName: '已指派' },
		{ id: 8, name: '周十', phone: 13388888888, statusClass: 'busy', statusName: '已指派' }
	]
	renderDrivers(axiosInfo)

	$searchBtn.on('click', function () {
		searchDriverBy($searchInput.val())
		$searchInput.val('')
		data = []
		count = 0
		$count[0].innerText = count
	})

	// 选中司机
	$drivers.on('click', '.driver-info', function () {
    // 司机空闲中点击可添加
		var statusClassName = $(this).find('.driver-status').children().attr('class')
		if (statusClassName === 'notBusy') {
      $(this).find('.driver-input')[0].checked = !$(this).find('.driver-input')[0].checked
		} else {
      $(this).find('.driver-input')[0].disabled = true
		}

    var $driverInputs = $('.driver-input')
		data = []
		count = 0
		var i = 0
		// 遍历所有多选框
		for (let key in $driverInputs) {
			if (i < $driverInputs.length) {
				i++
				if ($driverInputs[key].checked) {
					count++
					// 渲染选中司机数
					$count[0].innerText = count
					data.push($driverInputs[key].id.split('t')[1])
				}
			}
		}
	})

	$confirmBtn.on('click', function () {
		console.log(data)
	})
})
