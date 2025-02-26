import { ActionType } from "./action-type";
import { RoleName } from "./role-type";

export interface Message {
  id?: string;
  content: string;
  role?: RoleName;
  cause_by?: ActionType;
  instruct_content?: any;
  timestamp?: number;
  sent_from?: string;
  send_to?: string;
  references?: Message[];
}