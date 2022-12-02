import { uuid } from "../types";

export interface User {
  userId: uuid;
  firstName: string;
  lastName: string;
  isStaff?: boolean;
  isActive: boolean;
  isSuperuser?: boolean;
  lastLogin?: number;
  dateJoined?: number;
}
