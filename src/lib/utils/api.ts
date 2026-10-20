export async function createMessage(
	firstname: string,
	lastname: string,
	email: string,
	phone: string,
	question: string,
	message: string
) {
	// console.log('FORM:');
	// console.log(firstname, lastname, email, phone, question, message);
	const response = await fetch(`https://carrickdojo.wasmer.app/json/api/messages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			firstname: firstname,
			lastname: lastname,
			email: email,
			phone: phone,
			question: question,
			message: message
		})
	});
	// console.log('RESPONSE:');
	// console.log(response);

	const result = await response.json();
	// console.log('RESULT:');
	// console.log(result);

	return result;
}
