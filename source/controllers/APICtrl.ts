import Cookies from 'universal-cookie'
import { tokenCookieName } from '../__env'

export const getToken = () => {
	const cookie = new Cookies()
	return cookie.get(tokenCookieName)
}

const protect = async (vip: Function) => {
	let validated
	try { validated = await vip() }
	catch (e) { validated = { error: "failed to connect" } }
	return validated
}

export const getApiJson = async (url: string, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		}
	})
	const responseJson = await response.json()
	return responseJson
})

export const postApiJson = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: JSON.stringify(data)
	})
	const responseJson = await response.json()
	return responseJson
})

export const patchApiJson = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: JSON.stringify(data)
	})
	const responseJson = await response.json()
	return responseJson
})

export const putApiJson = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: JSON.stringify(data)
	})
	const responseJson = await response.json()
	return responseJson
})

export const deleteApiJson = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: JSON.stringify(data)
	})
	const responseJson = await response.json()
	return responseJson
})

export const postApiFormData = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const formData = new FormData();
	
	for (const name in data) {
		// @ts-ignore
		formData.append(name, data[name]);
	}
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: formData
	})
	const responseJson = await response.json()
	return responseJson
})

export const patchApiFormData = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const formData = new FormData();
	for (const name in data) {
		// @ts-ignore
		formData.append(name, data[name]);
	}
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: formData
	})
	const responseJson = await response.json()
	return responseJson
})

export const putApiFormData = async (url: string, data = {}, token?: string, sessionToken?: string) => await protect(async () => {
	// check token
	token = token ? token : getToken()
	const formData = new FormData();
	for (const name in data) {
		// @ts-ignore
		formData.append(name, data[name]);
	}
	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
			// 'Common-API-Key': sessionToken ?? getSessionToken(),
		},
		body: formData
	})
	const responseJson = await response.json()
	return responseJson
})