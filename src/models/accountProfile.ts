export type AccountProfile = {
    id: number;
    account_id: number;
    first_name: string;
    last_name: string;
    phone: string | null;
    address: string | null;
    profile_pic: string;
    theme: string;
    company: string | null;
    title: string | null;
    business_phone: string | null;
    business_address: string | null;
}