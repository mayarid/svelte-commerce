import { error } from '@sveltejs/kit'
import { getMayarApi } from '$lib/utils/server'
import type { MayarAPI } from '$lib/types'

export const fetchHome = async () => {
	try {
		let products = []
		const res: MayarAPI = await getMayarApi('product')
		res.data.map((product) => {
			if (product.type === 'physical_product') {
				return products.push(product)
			}
		})

		return products || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
