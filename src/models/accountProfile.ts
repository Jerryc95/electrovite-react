export type AccountProfile = {
    id: number;
    account_id: number;
    first_name: string;
    last_name: string;
    profile_pic: string;
    theme: string;
    company: string | null;
    title: string | null;
}