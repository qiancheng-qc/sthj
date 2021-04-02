$.prototype.http = function (url, data, fn, type = 'POST') {
	$.ajax({
		url: 'http://t.company.sthjnet.com/' + url,
		type: type,
		headers: {
			token:
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNjE2NTc1NDU1LCJjb21wYW55SWQiOjE3LCJjdXN0b21lcklkIjoxNiwibW9iaWxlIjoiMTU2OTg1NjkzMjUiLCJleHAiOjE2MTY1NzcyNTV9.RpcmSNP4RXMXthwT67zTsCcGdhA5jvZ_XFRYcxHvzIM'
		},
		data: data,
		success: fn
	})
}
