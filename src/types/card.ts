export interface Card {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bin: string;
  sub_bin: string;
  salary_monthly: number;
  suspicious: boolean;
  created_at: string | null;
}

export interface CardPayload {
  card_number: string;
  cvv: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  salary_monthly: number;
}