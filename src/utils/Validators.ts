//Verifica se o email é válido, seguindo o padrão geral de emails
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // (xxx@yyy.zzz)
  return regex.test(email.trim());
}

// Verifica se a string contém apenas letras e espaços
export function isOnlyLettersAndSpaces(input: string): boolean {
  const regex = /^[A-Za-zÀ-ÿ\s]+$/u;
  return regex.test(input.trim());
}

// Verifica se o email bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getEmailError(email: string): string {
  if (!email) return "Email é obrigatório";
  if (email.length < 5) return "Email muito curto";
  if (email.length > 100) return "Email muito longo";
  if (!isValidEmail(email)) return "Formato de email inválido";
  return "";
}

// Verifica se a senha bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getSenhaError(senha: string): string {
  if (!senha) return "Senha é obrigatória";
  if (senha.length < 6) return "Senha deve ter pelo menos 6 caracteres";
  if (senha.length > 64) return "Senha muito longa";

  const hasLetter = /[a-zA-Z]/.test(senha);
  const hasNumber = /\d/.test(senha);
  if (!hasLetter || !hasNumber) return "A senha deve conter letras e números";

  return "";
}

// Verifica se o nome bate com todos os critérios de validação, retornando o erro específico ou uma string vazia se não houver erro
export function getNomeError(nome: string): string {
  if (!nome) return "Nome é obrigatório";
  if (nome.length < 2) return "Nome muito curto";
  if (nome.length > 80) return "Nome muito longo";
  if (!isOnlyLettersAndSpaces(nome)) return "Nome deve conter apenas letras e espaços";

  return "";
}

