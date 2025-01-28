export interface Job {
  id: string;
  company: string;
  title: string;
  description: string;
  company_logo: string;
  location: string;
  salary?: string;
  redirect_url: string;
}