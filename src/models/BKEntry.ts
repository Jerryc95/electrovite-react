import { BKExpense } from "./BKExpense";

export type BKEntry = {
    entry_name: string;
    bookkeeping_id: number;
    contact_id: number | null;
    account_id: number;
    total_amount: string;
    paid_amount: string;
    outstanding_amount: string;
    category: string;
    transaction_type: string;
    description: string;
    entry_date: Date;
    first_name: string | null;
    last_name: string | null;
    paid: boolean;
    next_payment_date: Date | null;
}