$(function () {
	var $drivers = $('.drivers')
	var $searchInput = $('.search-box input') // 搜索框
	var $searchBtn = $('.search-box button') // 搜索按钮
	var $count = $('.bottom-left span') // 选中司机数量
	var $confirmBtn = $('.confirm-btn') // 右下角确定按钮
	var count = 0 // 选中司机数量
	var axiosInfo // 后台数据

	// 创建司机信息 class="driver-info"
	function createDriverInfo(id, name, phone, status, statusName) {
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
      <div class="${status}">${statusName}</div>
    </div>
  </div>`
	}
	// 将创建的司机信息渲染到页面
	function renderDrivers(arr) {
		arr.forEach(x => {
			var infoDiv = createDriverInfo(x.id, x.name, x.phone, x.status, x.statusName)
			$drivers.append(infoDiv)
			$drivers.append(infoDiv)
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
			console.log(res)
			$driverInfo.remove()
			renderDrivers(res)
		} else {
			$driverInfo.remove()
			renderDrivers(axiosInfo)
		}
	}

	axiosInfo = [
		{ id: 1, name: '张三', phone: 13311111111, status: 'notBusy', statusName: '空闲中' },
		{ id: 2, name: '李四', phone: 13322222222, status: 'notBusy', statusName: '空闲中' },
		{ id: 3, name: '王五', phone: 13333333333, status: 'notBusy', statusName: '空闲中' },
		{ id: 4, name: '赵六', phone: 13344444444, status: 'busy', statusName: '已指派' },
		{ id: 5, name: '周七', phone: 13355555555, status: 'busy', statusName: '已指派' }
	]
	renderDrivers(axiosInfo)

  // 等司机信息渲染后再执行
  var $driverInfo = $('.driver-info')
  var $driverInputs = $('.driver-input')

	$searchBtn.on('click', function () {
		searchDriverBy($searchInput.val())
		$searchInput.val('')
	})

	// 选中司机
	$drivers.on('click', '.driver-info', function () {
		// 司机空闲中点击可添加
		var statusClassName = $(this).find('.driver-status').children().attr('class')
		if (statusClassName === 'notBusy') {
			$(this).find('.driver-input')[0].checked = !$(this).find('.driver-input')[0].checked
		}
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
				}
			}
		}
	})

	$confirmBtn.on('click', function () {
		console.log('确定')
	})
})
