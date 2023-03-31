import { addToCartService, fetchRefreshCart } from '$lib/services/CartService'
import { post } from '$lib/utils/server'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies }) => {
	let loading = false
	let cart = locals.cart
	const cartId = cookies.get('cartId')
	try {
		loading = true
		const res = await fetchRefreshCart({
			cartId
		})
		if (res) {
			console.log(res)
			// cookies.set('cartId', res.cartId, { path: '/' })
			// cookies.set('cartQty', res.qty, { path: '/' })
			// locals.cartId = res.cartId
			// locals.cartQty = res.qty
			locals.cart = res
		}
	} catch (e) {
		console.error(e)
		// console.log('Error at /cart/+page.server.ts page.....', e)
		// if (e?.status === 401) {
		// 	throw redirect(307, locals.store?.loginUrl || '/auth/login')
		// }
		// throw error(400, e?.message || e)
	} finally {
		loading = false
	}
	console.log({ loadingCart: loading, cart })
	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	const pid = data.get('pid')
	const cartId = cookies.get('cartId')
	console.log(cartId)

	// console.log(pid)
	// const vid = data.get('pid')
	// const linkedItems = JSON.parse(data.get('linkedItems'))
	// const options = JSON.parse(data.get('options')) //data.get('options') //
	// const customizedImg = data.get('customizedImg')
	const variant = data.get('variant')
	if (typeof pid !== 'string' || !pid) {
		return fail(400, { invalid: true })
	}
	try {
		let cart = await addToCartService({
			pid,
			qty: 1,
			cartId,
			variant
		})
		// console.log(`add to cart: ${JSON.stringify(cart, null, 2)}`)

		if (cart) {
			const cartObj = {
				cartId: cart?.cart_id,
				items: cart?.items,
				qty: cart?.qty,
				tax: cart?.tax,
				subtotal: cart?.subtotal,
				total: cart?.total,
				currencySymbol: 'Rp.'
				// discount: cart?.discount,
				// savings: cart?.savings,
				// selfTakeout: cart?.selfTakeout,
				// shipping: cart?.shipping,
				// unavailableItems: cart?.unavailableItems,
				// formattedAmount: cart?.formattedAmount
			}

			locals.cart = cartObj
			// locals.cartId = cartObj.cartId
			// locals.cartQty = cartObj.qty
			// cookies.set('cartId', cartObj.cartId, { path: '/' })
			// cookies.set('cartQty', cartObj.qty, { path: '/' })
			return cartObj
		} else {
			return {}
		}
	} catch (e) {
		return {}
	}
}

export const actions: Actions = { add }
