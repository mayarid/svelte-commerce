import cookie from 'cookie'
import {
	BIG_COMMERCE_BASE_URL,
	HTTP_ENDPOINT,
	bigcommerceHeaders,
	provider,
	woocommerceHeaders,
	MEDUSAJS_BASE_URL
} from '../config'

// import pkg from '@woocommerce/woocommerce-rest-api' // node v-18
// const WooCommerceRestApi = pkg.default // node v-16
import { WOO_COMMERCE_STORE_LINK, WOO_COMMERCE_KEY, WOO_COMMERCE_SECRET } from '../config'
import { serialize } from '.'

// const WooCommerce = new WooCommerceRestApi({
// 	url: WOO_COMMERCE_STORE_LINK,
// 	consumerKey: WOO_COMMERCE_KEY,
// 	consumerSecret: WOO_COMMERCE_SECRET,
// 	version: 'wc/v3'
// })

export async function postt(endpoint: string, data: any, ck?: any) {
	// ck need to be passed, because ck.set is used later bellow
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response: any = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `connect.sid=${ck.get('connect.sid')}`
		}
	})
	const sid: string | null = response.headers.get('set-cookie')
	if (sid) {
		const sidCookie: any = cookie.parse(sid)
		ck.set('connect.sid', sidCookie['connect.sid'], {
			path: '/'
		})
	}
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		console.log('Error 1')
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const delBySid = async (endpoint: string, sid?: any) => {
	const response = await fetch(HTTP_ENDPOINT + '/api/' + endpoint, {
		method: 'DELETE',
		credentials: 'include',
		headers: { cookie: `connect.sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (response?.status > 399) {
		console.log('Error 2')

		throw { status: response.status, message: response.statusText }
	} else {
		return res
	}
}

export async function postBySid(endpoint: string, data: any, sid?: string) {
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `connect.sid=${sid}`
		}
	})
	if (endpoint.includes('logout')) return true
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		console.log('Error 3')
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export async function gett(endpoint: string, ck?: any) {
	const ck1 = cookie.parse(ck || '')
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `connect.sid=${ck1['connect.sid']}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export const getBySid = async (endpoint: string, sid?: any) => {
	const response = await fetch(HTTP_ENDPOINT + '/api/' + endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `connect.sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (response?.status > 399) {
		console.log('Error 5')
		throw { status: response.status, message: response.statusText }
	} else {
		return res
	}
}

export const getBigCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	// console.log(BIG_COMMERCE_BASE_URL + '/' + endpoint)
	const response = await fetch(BIG_COMMERCE_BASE_URL + '/' + endpoint + '?' + serialize(query), {
		headers: bigcommerceHeaders
	})
	// const totalPages = res?.meta?.pagination?.total_pages
	// const totalItems = res?.meta?.pagination?.total

	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	// console.log(res)
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const postBigCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	const response = await fetch(BIG_COMMERCE_BASE_URL + '/' + endpoint + '?' + serialize(query), {
		method: 'POST',
		headers: bigcommerceHeaders
	})

	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const getMedusajsApi = async (endpoint: string, query: any, sid?: any) => {
	const response = await fetch(MEDUSAJS_BASE_URL + '/' + endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `connect.sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const postMedusajsApi = async (endpoint: string, data: any, sid?: any) => {
	const ep = MEDUSAJS_BASE_URL + '/' + endpoint
	const response = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `connect.sid=${sid}`
		}
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res.body.message }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const getWooCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	try {
		// const res = await WooCommerce.get(endpoint + '?' + serialize(query))
		// const response = await fetch(
		// 	`${WOO_COMMERCE_STORE_LINK}/wp-json/wc/v3/${endpoint + '?' + serialize(query)}`,
		// 	{
		// 		headers: woocommerceHeaders
		// 	}
		// )
		// const isJson = response.headers.get('content-type')?.includes('application/json')
		// console.log(res)
		// if (res?.status > 399) {
		// 	throw { status: res.status, message: res }
		// } else {
		// 	return res
		// }
	} catch (e) {
		// console.log('eeeeeeeeeeeeee', e.message)
	}
}

export const postWooCommerceApi = async (endpoint: string, query: any, sid?: any) => {
	try {
		// const res = await WooCommerce.get(endpoint + '?' + serialize(query))
		// const response = await fetch(
		// 	`${WOO_COMMERCE_STORE_LINK}/wp-json/wc/v3/${endpoint + '?' + serialize(query)}`,
		// 	{
		//		method: 'POST',
		// 		headers: woocommerceHeaders
		// 	}
		// )
		// const isJson = response.headers.get('content-type')?.includes('application/json')
		// console.log(res)
		// if (res?.status > 399) {
		// 	throw { status: res.status, message: res }
		// } else {
		// 	return res
		// }
	} catch (e) {
		// console.log('eeeeeeeeeeeeee', e.message)
	}
}

export const getMayarApi = async (endpoint: string) => {
	const response = await fetch('https://55f9-103-105-33-66.ngrok-free.app/v1' + '/' + endpoint, {
		method: 'GET',
		headers: {
			Authorization:
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNGUyOWU2Ni00NmNhLTQzZDctOWM4YS1mYWMwMTY2NzViZmYiLCJhY2NvdW50SWQiOiJiNDE3MWIyNy1jYWVkLTRiZGUtYjNkMi05ODZiYWNlMzkyMjciLCJjcmVhdGVkQXQiOiIxNjc2NTIyMTc4OTI2Iiwicm9sZSI6ImRldmVsb3BlciIsInN1YiI6ImRlbHZpZXJvbmlnZWxAZ21haWwuY29tIiwibmFtZSI6Im5pZ2VsZGVsdmllcm8iLCJsaW5rIjoibmlnZWwiLCJpc1NlbGZEb21haW4iOm51bGwsImlhdCI6MTY3NjUyMjE3OH0.dXZFa5kcMLjhPu7GaaLUsRoh5hLRF4QA78UT-iT2VbREev3mvEIsUqc-xKc6C9FQaiLHDAvwC-oD05wzFhmv3lQV1UVtXGoJG0GC4Eumb-UX3QR6-glHyQaIPj2USlPug6wrBo1CKoM5l7LiPiqVPcr3vro0zZJzrK-gFZ15CBDYcVdEWw-9VLnpNj21RUbbPEnLdv8o283XHJ0_KmHINH0JY2x2hHW-Mb77ZZcU3qwBkYpG8ZXDQeMsf4zeoOhbVAtGtFOK9EzjXrEU2hHNbaAdlA50019IAgC8P0NRj8odTi3CPnl6UOUTVQvh9D3UwO3yLUKQ0l_vnjDfZKao8w'
		}
	})

	// const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = await response.json()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}

export const postMayarApi = async (endpoint: string, body: any) => {
	const response = await fetch('https://55f9-103-105-33-66.ngrok-free.app/v1' + '/' + endpoint, {
		method: 'POST',
		headers: {
			Authorization:
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNGUyOWU2Ni00NmNhLTQzZDctOWM4YS1mYWMwMTY2NzViZmYiLCJhY2NvdW50SWQiOiJiNDE3MWIyNy1jYWVkLTRiZGUtYjNkMi05ODZiYWNlMzkyMjciLCJjcmVhdGVkQXQiOiIxNjc2NTIyMTc4OTI2Iiwicm9sZSI6ImRldmVsb3BlciIsInN1YiI6ImRlbHZpZXJvbmlnZWxAZ21haWwuY29tIiwibmFtZSI6Im5pZ2VsZGVsdmllcm8iLCJsaW5rIjoibmlnZWwiLCJpc1NlbGZEb21haW4iOm51bGwsImlhdCI6MTY3NjUyMjE3OH0.dXZFa5kcMLjhPu7GaaLUsRoh5hLRF4QA78UT-iT2VbREev3mvEIsUqc-xKc6C9FQaiLHDAvwC-oD05wzFhmv3lQV1UVtXGoJG0GC4Eumb-UX3QR6-glHyQaIPj2USlPug6wrBo1CKoM5l7LiPiqVPcr3vro0zZJzrK-gFZ15CBDYcVdEWw-9VLnpNj21RUbbPEnLdv8o283XHJ0_KmHINH0JY2x2hHW-Mb77ZZcU3qwBkYpG8ZXDQeMsf4zeoOhbVAtGtFOK9EzjXrEU2hHNbaAdlA50019IAgC8P0NRj8odTi3CPnl6UOUTVQvh9D3UwO3yLUKQ0l_vnjDfZKao8w',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})

	// const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = await response.json()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
