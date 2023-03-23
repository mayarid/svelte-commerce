import { error } from '@sveltejs/kit'
import { getMayarApi } from '$lib/utils/server'
import type { MayarAPI } from '$lib/types'

export const fetchHome = async () => {
	try {
		const res: MayarAPI = await getMayarApi('hl/v1/product')
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
