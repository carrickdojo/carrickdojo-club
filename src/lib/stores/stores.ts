import { writable } from 'svelte/store';

export const form = writable({
	firstname: '',
	lastname: '',
	email: '',
	phone: '',
	question: 'contact',
	message: ''
});
