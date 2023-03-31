import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getMedusajsApi,
	getWooCommerceApi,
	postMedusajsApi,
	getMayarApi
} from '$lib/utils/server'
import {
	mapBigcommerceProducts,
	mapMedusajsProduct,
	mapMedusajsAllProducts,
	mapWoocommerceProducts
} from '$lib/utils'
import { provider } from '$lib/config'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type {
	AllProducts,
	Error,
	MayarAPI,
	MayarDetailProduct,
	MayarSearch,
	Product
} from '$lib/types'

// Search product

export const searchProducts = async ({
	origin,
	query,
	searchData,
	storeId,
	server = false,
	sid = null
}: any) => {
	try {
		let allProduct: AllProducts | {} = {}
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = ''
		let err = ''

		const res: MayarSearch = await getMayarApi(`product?search=${query}`)
		if (res.data.length > 0) {
			res.data.map((productItem) => {
				let product: Product = {
					id: productItem.id,
					_id: productItem.id,
					active: true,
					barcode: '',
					countryOfOrigin: '',
					description: productItem.description,
					discount: 0,
					ean: '',
					hasStock: productItem.qty > 0 ? true : false,
					height: 96,
					hsn: '',
					images: [],
					img: '',
					isCustomized: false,
					mrp: 0,
					name: productItem.name,
					new: true,
					price: productItem.amount,
					sku: '',
					slug: productItem.link,
					status: '',
					stock: productItem.qty,
					weight: 200,
					width: 75,
					categoryPool: undefined,
					tags: [],
					product: undefined
				}

				if (productItem.multipleImage.length > 0) {
					productItem.multipleImage.map((img) => {
						product.images.push(img.url)
					})
				}

				if (productItem.coverImage) {
					product.img = productItem.coverImage.url
				}

				products.push(product)
			})
		}

		allProduct = {
			count: res.data.length,
			currentPage: res.page,
			pageSize: res.pageSize,
			limit: res.pageCount,
			products: products,
			facets: []
		}

		count = res.pageCount
		pageSize = res.pageSize
		console.log({ products, count, facets, pageSize, err })
		return { products, count, facets, pageSize, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch all products

export const fetchProducts = async ({ origin, slug, id, server = false, sid = null }: any) => {
	try {
		const res: MayarAPI = await getMayarApi('product')

		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch single product

export const fetchProduct = async ({ slug }: { slug: string }) => {
	try {
		const res: MayarDetailProduct = await getMayarApi(`product/${slug}`)
		let product: Product | {} = {}

		product = {
			id: res.data.id,
			_id: res.data.id,
			active: true,
			barcode: '',
			countryOfOrigin: '',
			description: res.data.description,
			discount: 0,
			ean: '',
			hasStock: res.data.qty > 0 ? true : false,
			height: 96,
			hsn: '',
			images: res.data.multipleImage,
			img: res.data.coverImage,
			isCustomized: false,
			mrp: 0,
			name: res.data.name,
			new: true,
			price: res.data.amount,
			sku: '',
			slug: res.data.link,
			status: '',
			stock: res.data.qty,
			weight: 200,
			width: 75,
			variants: res.data.items
		}

		return product || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch products based on category

export const fetchProductsOfCategory = async ({
	origin,
	storeId,
	query,
	categorySlug,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		let products: Product[] = []
		let count = 0
		let facets = ''
		let pageSize = 0
		let category = ''
		let err = ''
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`es/products?categories=${categorySlug}&store=${storeId}&${query}`,
						sid
					)
				} else {
					res = await getAPI(
						`es/products?categories=${categorySlug}&store=${storeId}&${query}`,
						origin
					)
				}
				products = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				category = res?.category
				err = !res?.estimatedTotalHits ? 'No result Not Found' : null
				break
			case 'medusajs':
				res = await getMedusajsApi(`products`, {}, sid)
				count = res?.count
				products = res?.products.map((p) => mapMedusajsProduct(p))
				const offset = res?.offset
				const limit = res?.limit
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				category = res?.category
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				count = res?.count
				facets = res?.facets
				pageSize = res?.pageSize
				category = res?.category
				break
		}
		return { products, count, facets, pageSize, category, err }
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch next product

export const fetchNextPageProducts = async ({
	origin,
	storeId,
	categorySlug,
	server = false,
	nextPage,
	searchParams = {},
	sid = null
}: any) => {
	try {
		let nextPageData = []
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
						sid
					)
				} else {
					res = await getAPI(
						`es/products?categories=${categorySlug}&store=${storeId}&page=${nextPage}&${searchParams}`,
						origin
					)
				}
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
			case 'medusajs':
				res = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(
					`products?categories=${categorySlug}&page=${nextPage}&${searchParams}`,
					{},
					sid
				)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
			case 'woocommerce':
				res = await getWooCommerceApi(
					`products?categories=${categorySlug}&page=${nextPage}&${searchParams}`,
					{},
					sid
				)
				nextPageData = res?.data?.map((p) => {
					const p1 = { ...p._source }
					p1.id = p._id
					return p1
				})
				break
		}
		return {
			nextPageData: nextPageData || [],
			count: res.count,
			estimatedTotalHits: res.estimatedTotalHits,
			facets: res.facets
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

// Fetch related products

export const fetchRelatedProducts = async ({
	origin,
	storeId,
	categorySlug,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let relatedProductsRes: any = {}
		let relatedProducts: Product[] = []
		switch (provider) {
			case 'litekart':
				if (server) {
					relatedProductsRes = await getBySid(
						`es/products?categories=${categorySlug}&store=${storeId}`,
						sid
					)
				} else {
					relatedProductsRes = await getAPI(
						`es/products?categories=${categorySlug}&store=${storeId}`,
						origin
					)
				}

				relatedProducts = relatedProductsRes?.data.filter((p) => {
					return p._id !== pid
				})
				break
			case 'medusajs':
				relatedProducts = await getMedusajsApi(`customers/me`, {}, sid)
				break
			case 'bigcommerce':
				relatedProducts = await getBigCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
			case 'woocommerce':
				relatedProducts = await getWooCommerceApi(`products?categories=${categorySlug}`, {}, sid)
				break
		}
		return relatedProducts || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
