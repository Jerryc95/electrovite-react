export type Account = {
  id: number;
  email: string;
  createdAt: Date;
  two_factor_enabled: boolean;
  is_deleted: boolean;
  deleted_at: Date | null;
};
