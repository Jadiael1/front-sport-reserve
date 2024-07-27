/**
 * Formata um número de telefone no formato (XX) X XXXX-XXXX.
 *
 * @param phone - Telefone como string ou número
 * @returns Telefone formatado
 */
export const formatPhone = (phone: string | number): string => {
	// Converte o telefone para string e remove quaisquer caracteres que não sejam dígitos
	const phoneStr = phone.toString().replace(/\D/g, '').padEnd(11, '0');

	// Verifica se o telefone possui exatamente 11 dígitos
	if (phoneStr.length !== 11) {
		throw new Error('Número de telefone inválido. Deve conter 11 dígitos.');
	}

	// Formata o telefone adicionando parênteses, espaço e traço
	return phoneStr.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
};
