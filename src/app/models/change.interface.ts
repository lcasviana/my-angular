export interface ChangeRecord {
  id?: number;
  type: string;
  data: unknown;
  timestamp: string;
}
