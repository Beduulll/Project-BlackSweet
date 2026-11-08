export interface AuthUser {
  id: number;
  username: string;
  full_name: string;
}

export interface RegisterInput {
  full_name: string;
  username: string;
  password: string;
  security_question: string;
  security_answer: string;
}
