import { DOMAIN, IS_DEV } from '$lib/config'
import { getBySid } from '$lib/utils/server'
// @ts-ignore
export async function GET({ request, cookies, locals }) {
	// const uri = new URL(request.url)
	// console.log('zzzzzzzzzzzzzzzzzz', `init?domain=${IS_DEV ? DOMAIN : uri.host}`)
	// console.log('storeRes')
	// const storeRes = await getBySid(`init?domain=${IS_DEV ? DOMAIN : uri.host}`)
	// const { storeOne, settings, popularSearches, megamenu } = storeRes
	const store = {
		id: 1,
		domain: '',
		email: '',
		address: '',
		phone: '',
		otpLogin: '',
		loginUrl: '',
		websiteLegalName: 'Mayar Commerce',
		websiteName: 'Mayar Commerce',
		title: 'Mayar Commerce',
		description: '',
		keywords: '',
		stripePublishableKey: '',
		logo: 'https://framerusercontent.com/images/0aaSOxupKAsVA4ou30WbxLvSQo0.png',
		facebookPage: '',
		instagramPage: '',
		twitterPage: '',
		linkedinPage: '',
		pinterestPage: '',
		youtubeChannel: '',
		GOOGLE_CLIENT_ID: '',
		GOOGLE_ANALYTICS_ID: '',
		DOMAIN: '',
		closed: '',
		closedMessage: '',
		isFnb: false,
		searchbarText: '',
		adminUrl: '', // storeOne?.adminUrl used for arialmall
		currencySymbol: 'Rp.',
		currencyCode: 'IDR'
	}
	locals.store = store
	cookies.set('store', JSON.stringify(store), { path: '/' })
	return new Response()
}
