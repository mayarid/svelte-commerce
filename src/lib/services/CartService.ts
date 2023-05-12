import { provider } from '$lib/config'
import type {
	Error,
	MayarAPI,
	MayarAddToCart,
	MayarCart,
	MayarDetailProduct,
	MayarProduct,
	Product
} from '$lib/types'
import { del, getAPI, post } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getMayarApi,
	getMedusajsApi,
	getWooCommerceApi,
	postBySid,
	postMayarApi,
	postt
} from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchCartData = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`cart?store=${storeId}`, sid)
				} else {
					res = await getAPI(`cart?store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`cart`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`cart`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data.message)
	}
}

export const fetchRefreshCart = async ({ cartId }: any) => {
	try {
		if (!cartId) {
			console.log('cartId undefined')
		}
		const getCart: MayarCart = await getMayarApi(`cart?sessionId=${cartId}`)
		console.log(`Cart: ${JSON.stringify(getCart, null, 2)}`)
		const res = {
			cart_id: cartId,
			items: getCart.data.productItems,
			qty: getCart.data.items,
			tax: 0,
			subtotal: 0,
			total: getCart.data.amountTotal,
			currencySymbol: 'Rp.',
			domain: getCart.data.domain
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}

export const fetchMyCart = async ({ origin, storeId, server = false, sid = null }: any) => {
	console.log('fetchMyCart')
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`carts/my?store=${storeId}`, sid)
					// res = await getBySid(`carts/my?store=${storeId}`, sid)
				} else {
					res = await getAPI(`carts/my?store=${storeId}`, origin)
				}
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`carts/my`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`carts/my`, {}, sid)
				break
		}
		return res || {}
	} catch (err) {
		const e = err as Error
		throw error(e.status, e.data?.message)
	}
}

export const addToCartService = async ({ from, pid, qty, cartId, variant }: any) => {
	try {
		let res: any = {}
		let req: any = {}

		if (!cartId) {
			console.log('cartId undefined')
		}

		// const getCart: MayarCart = await getMayarApi(`hl/v1/cart?sessionId=${cartId}`)

		if (from === 'product') {
			const detailPrdoduct: MayarDetailProduct = await getMayarApi(`product/${pid}`)
			req = {
				id: pid,
				qty: qty,
				sessionId: cartId,
				item: {
					sku: variant,
					name: detailPrdoduct.data.name
				}
			}
		} else {
			req = {
				id: pid,
				qty: qty,
				sessionId: cartId,
				item: {
					sku: variant.sku,
					name: variant.name
				}
			}
		}

		console.log(req)
		const postCart: MayarCart = await postMayarApi(`cart/add`, req)

		// const existingItem = postCart.data.productItems.find((item) => item.product.id === pid)

		// if (existingItem) {
		// 	const productIndex = postCart.data.productItems.findIndex((i) => i.product.id === pid)
		// 	let product = {
		// 		cart_id: cartId,
		// 		items: postCart.data.productItems,
		// 		qty: postCart.data.items,
		// 		tax: 0,
		// 		subtotal: 0,
		// 		total: postCart.data.amountTotal,
		// 		currencySymbol: 'Rp.'
		// 	}
		// 	product.items[productIndex].qty++
		// 	product.qty++
		// 	product.total = product.total + detailPrdoduct.data.amount
		// 	return product
		// }

		res = {
			cart_id: cartId,
			items: postCart.data.productItems,
			qty: postCart.data.items,
			tax: 0,
			subtotal: 0,
			total: postCart.data.amountTotal,
			currencySymbol: 'Rp.'
		}

		return res
	} catch (e) {
		console.error(e.messages)
		throw error(e.status, e.data?.message || e.message)
	}
}

export const removeCart = async ({ pid, qty, cartId, variant: { sku, name } }: any) => {
	try {
		let res: any = {}
		console.log(cartId)

		if (!cartId) {
			console.log('cartId undefined')
		}

		const getCart: MayarAddToCart = await postMayarApi(`cart/remove`, {
			id: pid,
			qty: qty,
			sessionId: cartId,
			item: {
				sku: sku,
				name: name
			}
		})

		res = {
			cart_id: cartId,
			items: getCart.data.productItems,
			qty: getCart.data.items,
			tax: 0,
			subtotal: 0,
			total: getCart.data.amountTotal,
			currencySymbol: 'Rp.'
		}

		return res
	} catch (e) {
		console.error(e.messages)
		throw error(e.status, e.data?.message || e.message)
	}
}

export const applyCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`apply-coupon`,
					{
						code,
						store: storeId
					},
					origin
				)
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`apply-coupon`, {})
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`apply-coupon`, {})
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const removeCouponService = async ({
	code,
	origin,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await del(`remove-coupon?code=${code}&store=${storeId}`, origin)
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`remove-coupon`, {})
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`remove-coupon`, {})
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
