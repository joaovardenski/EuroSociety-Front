//Verifica se o email é válido, e retorna um sinalizador booleano
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// Verifica se o email bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getEmailError(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "Email é obrigatório";
  if (trimmed.length < 5) return "Email muito curto";
  if (trimmed.length > 100) return "Email muito longo";
  if (!isValidEmail(trimmed)) return "Formato de email inválido";
  return "";
}

// Verifica se a senha bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getSenhaError(senha: string): string {
  const trimmed = senha.trim();
  if (!trimmed) return "Senha é obrigatória";
  if (trimmed.length < 6) return "Senha deve ter pelo menos 6 caracteres";
  if (trimmed.length > 50) return "Senha muito longa";

  const hasLetter = /[a-zA-Z]/.test(trimmed);
  const hasNumber = /\d/.test(trimmed);
  if (!hasLetter || !hasNumber) return "A senha deve conter letras e números";

  return "";
}

// Verifica se o nome bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getNomeError(nome: string): string {
  const trimmed = nome.trim();
  if (!trimmed) return "Nome é obrigatório";
  if (trimmed.length < 2) return "Nome muito curto";
  if (trimmed.length > 100) return "Nome muito longo";
  const onlyLetters = /^[A-Za-zÀ-ÿ\s]+$/u.test(trimmed);
  if (!onlyLetters) return "Nome deve conter apenas letras e espaços";

  return "";
}

