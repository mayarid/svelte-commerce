import { fetchRefreshCart } from '$lib/services'
import generateUUID from '$lib/utils/generateUUID'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		const cartId: string | undefined = event.cookies.get('cartId')
		const cartQty: string | undefined = event.cookies.get('cartQty')

		if (!cartId) {
			const uuid = generateUUID()
			event.cookies.set('cartId', uuid, { path: '/' })
		}
		if (cartId) event.locals.cartId = cartId
		if (cartQty) event.locals.cartQty = +cartQty

		const cartRes = await fetchRefreshCart({
			cartId
		})

		const cart = {
			cartId: cartRes.cart_id,
			items: cartRes.items,
			qty: cartRes.qty,
			tax: cartRes.tax,
			subtotal: cartRes.subtotal,
			total: cartRes.total,
			currencySymbol: 'Rp.',
			domain: cartRes.domain
			// discount: cartRes.discount,
			// selfTakeout: cartRes.selfTakeout,
			// shipping: cartRes.shipping,
			// unavailableItems: cartRes.unavailableItems,
			// formattedAmount: cartRes.formattedAmount
		}
		return cart
	} catch (e) {
		return null
	}
}
