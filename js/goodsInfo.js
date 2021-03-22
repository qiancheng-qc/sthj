$(function () {
	var $businessTags = $('.business-type .tag') // 业务类型标签
	var $goodsTags = $('.goods-type .tag') // 货物类型标签
	// 标签点击变蓝 其他还原
	$businessTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
    console.log($(this)[0].innerText)
    console.log($(this).attr('data-id'))
	})
	$goodsTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
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
	})

	var $cancelBtn = $('#cancel-btn') // 选择器取消按钮
	var $confirmBtn = $('#confirm-btn') // 选择器确定按钮
	// 取消按钮点击 直接关闭
	$cancelBtn.on('click', function () {
		$picker.hide()
	})
	// 确定按钮点击 改变发货数量样式
	$confirmBtn.on('click', function () {
		$item1.children('.danwei')[0].innerText = text
		if (text === '吨') {
			$item2.hide()
			$item3.hide()
		} else if (text === '方') {
			$item2.show()
			$item3.hide()
			$item2.children('.danwei')[0].innerText = '吨'
		} else {
			$item2.show()
			$item3.show()
			$item2.children('.danwei')[0].innerText = '方'
			$item3.children('.danwei')[0].innerText = '吨'
		}
		$picker.hide()
	})
})
