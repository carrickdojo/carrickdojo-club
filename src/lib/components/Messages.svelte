<script>
	import { Briefcase, ChevronsUpDown, Send, User2 } from 'lucide-svelte';
	import { form } from '../stores/stores';
	import { tick } from 'svelte';
	import { createMessage } from '../utils/api';

	/**
	 * @type {boolean}
	 */
	let showSecondForm;
	/**
	 * @type {HTMLButtonElement}
	 */
	let buttonElement;

	/**
	 * @type {HTMLSelectElement}
	 */
	let selectElement;

	function submitFirstForm() {
		if (!$form.firstname || !$form.lastname || !$form.email || !$form.phone) return;
		// trigger first form submission
		buttonElement.click();
		console.log('Form submitted');
	}

	async function handleFirstFormSubmission() {
		showSecondForm = true;
		await tick();
		selectElement.focus();

		setTimeout(() => {
			selectElement.scrollIntoView({ behavior: 'smooth' });
		}, 50);
	}

	async function sendForm() {
		console.log('Form sent');
		await createMessage($form);
	}
</script>

<section id="tickets">
	<div class="group">
		<h2>Tickets</h2>
		<div class="icon"><User2 /></div>
		<!-- svelte-ignore component_name_lowercase -->
		<form on:submit|preventDefault={handleFirstFormSubmission}>
			<input
				on:blur={submitFirstForm}
				bind:value={$form.firstname}
				placeholder="First name"
				required
			/>
			<input
				on:blur={submitFirstForm}
				bind:value={$form.lastname}
				placeholder="Last name"
				required
			/>
			<input
				on:blur={submitFirstForm}
				bind:value={$form.email}
				placeholder="Email"
				type="email"
				required
			/>
			<input on:blur={submitFirstForm} bind:value={$form.phone} placeholder="Phone" required />
			<button bind:this={buttonElement} type="submit" hidden>Send</button>
		</form>
		<span>Mark</span>
	</div>

	{#if showSecondForm}
		<div class="group group--2">
			<h2>How may I help you?</h2>
			<div class="icon"><Briefcase /></div>
			<!-- svelte-ignore component_name_lowercase -->
			<form on:submit|preventDefault={sendForm}>
				<select bind:this={selectElement} bind:value={$form.question} name="questions">
					<option value="contact">I just want to say hi!</option>
					<option value="logo">I want to create a logo</option>
					<option value="website">I need a new website</option>
					<option value="app">I want an app</option>
				</select>
				<div class="arrows">
					<ChevronsUpDown />
				</div>
				<textarea bind:value={$form.message} name="message" placeholder="Message" required
				></textarea>
				<button class="btn" type="submit"><Send /> Send form</button>
			</form>
			<span>Mark</span>
		</div>
	{/if}
</section>

<style>
	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 32px 16px;
		position: relative; /* align mark icon */
	}
	h2 {
		font-size: calc(24 / 16 * 1rem);
		padding-bottom: 8px;
		border-bottom: 2px solid var(--subtle);
		width: 100%;
	}
	.icon {
		height: 48px;
		width: 48px;
		background-color: var(--subtle);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	form {
		display: grid;
		grid-template-columns: repeat(2, 300px);
		gap: 20px;
		position: relative; /* alig arrows icon */
	}
	input,
	select,
	textarea {
		border: none;
		height: 60px;
		padding: 16px;
		border-radius: 4px;
		color: var(--text-1);
		opacity: 1;
	}
	::placeholder {
		font-family: var(--heading-font);
		color: var(--text-2);
	}
	.group--2 {
		margin-top: 60px;
	}
	select {
		grid-column: span 2;

		/* remove native browser arrow icon */
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
	}
	textarea {
		grid-column: span 2;
		height: 180px;
		resize: none; /* remove option to resize */
	}
	.arrows {
		position: absolute;
		top: 18px;
		right: 16px;
		pointer-events: none; /* select field instead of icon */
	}
</style>
