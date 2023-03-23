import { provider } from '$lib/config'
import type { Error, MayarAddToCart, MayarCart, Product } from '$lib/types'
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
	console.log('fetchCartData')
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
	console.log('fetchRefreshCart')
	console.log(cartId)

	try {
		const getCart: MayarCart = await getMayarApi(`hl/v1/cart?sessionId=${cartId}`)
		if (!cartId) {
			console.log('cartId undefined')
		}

		const res = {
			cart_id: cartId,
			items: getCart.data.productItems,
			qty: getCart.data.items,
			tax: 0,
			subtotal: 0,
			total: getCart.data.amountTotal,
			currencySymbol: 'Rp.'
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

export const addToCartService = async ({ pid, cartId }: any) => {
	try {
		let res: any = {}
		console.log(cartId)

		if (!cartId) {
			console.log('cartId undefined')
		}

		const getCart: MayarAddToCart = await postMayarApi(`hl/v1/cart/add`, {
			id: pid,
			sessionId: cartId
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
