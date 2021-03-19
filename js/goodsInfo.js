$(function () {
	var $businessTags = $('.business-type .tag')
	$businessTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
	})
	var $goodsTags = $('.goods-type .tag')
	$goodsTags.on('click', function () {
		$(this).removeClass('not-pick').addClass('pick').siblings().removeClass('pick').addClass('not-pick')
	})

	var $drop = $('.drop')
	var $picker = $('.picker')
	var $pickerBottom = $('.picker-bottom')
	$drop.on('click', function () {
		$picker.show()
	})
	$picker.on('click', function () {
		$picker.hide()
	})
	$pickerBottom.on('click', function (e) {
		e.stopPropagation()
	})

	var $options = $('.option')
	var $item1 = $('#item1')
	var $item2 = $('#item2')
	var $item3 = $('#item3')
	var text = $item1.children('.danwei')[0].innerText
	$options.on('click', function () {
		$(this).children('.option-inner').addClass('chosen')
		$(this).siblings().children('.option-inner').removeClass('chosen')
		text = $(this).children('.option-inner')[0].innerText
	})

	var $cancelBtn = $('#cancel-btn')
	var $confirmBtn = $('#confirm-btn')
	$cancelBtn.on('click', function () {
		$picker.hide()
	})
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
