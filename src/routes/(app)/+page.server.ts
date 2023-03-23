import { DOMAIN, HTTP_ENDPOINT } from '$lib/config'
// import { redis } from '$lib/server/redis'
import { fetchDeals } from '$lib/services/DealsService'
import { fetchHome } from '$lib/services/HomeService'
import { error } from '@sveltejs/kit'

export async function load() {
	try {
		const home = await fetchHome()
		const deals = [] //await fetchDeals({ storeId: store?.id, server: true })
		if (home) {
			return { home: home, deals: deals || {} }
		}
	} catch (e) {
		console.log('Error Home')

		throw error(
			404,
			`Store Not Found @Page
			<br/>DOMAIN(env):${DOMAIN}
			<br/>HTTP_ENDPOINT(env):${HTTP_ENDPOINT}`
		)
	}
}
