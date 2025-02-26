export interface Role {
  name: string;
  state: string;
  desc: string;
}

export interface Memory {
  content: string;
  role: string;
  cause_by: string;
  timestamp: string;
}