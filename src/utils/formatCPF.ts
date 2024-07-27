/**
 * Formata um CPF adicionando pontos e traço.
 *
 * @param cpf - CPF como string ou número
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string | number): string => {
	// Converte o CPF para string e remove quaisquer caracteres que não sejam dígitos
	const cpfStr = cpf.toString().replace(/\D/g, '');

	// Verifica se o CPF possui exatamente 11 dígitos
	if (cpfStr.length !== 11) {
		throw new Error('CPF inválido. Deve conter 11 dígitos.');
	}

	// Formata o CPF adicionando pontos e traço
	return cpfStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
