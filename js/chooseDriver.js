$(function () {
	var $drivers = $('.drivers')
	$drivers.on('click', '.driver-info', function () {
		// console.log($(this).find('.driver-status').children().attr('class'))
		$(this).find('.driver-input')[0].checked = true
	})
	function createDriverInfo(id, name, phone, status, statusName) {
		return `<div class="driver-info">
    <div class="radio">
      <input class="driver-input" type="radio" name="driver" id="input${id}" />
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
	var axiosInfo
	axiosInfo = [
		{ id: 1, name: '张三', phone: 13311111111, status: 'notBusy', statusName: '空闲中' },
		{ id: 2, name: '李四', phone: 13322222222, status: 'notBusy', statusName: '空闲中' },
		{ id: 3, name: '王五', phone: 13333333333, status: 'notBusy', statusName: '空闲中' },
		{ id: 4, name: '赵六', phone: 13344444444, status: 'busy', statusName: '已指派' },
		{ id: 5, name: '周七', phone: 13355555555, status: 'busy', statusName: '已指派' }
	]
	function renderDrivers(arr) {
		arr.forEach(x => {
			var infoDiv = createDriverInfo(x.id, x.name, x.phone, x.status, x.statusName)
			$drivers.append(infoDiv)
		})
	}
	renderDrivers(axiosInfo)
	var $searchInput = $('.search-box input')
	var $searchBtn = $('.search-box button')
	$searchBtn.on('click', function () {
		searchDriverBy($searchInput.val())
		$searchInput.val('')
	})
	function searchDriverBy(val) {
		var res = []
		axiosInfo.forEach(x => {
			if (x.name === val || x.phone === +val) {
				res.push(x)
			}
		})
		console.log(res)
    $('.driver-info').remove()
    renderDrivers(res)
	}
})
