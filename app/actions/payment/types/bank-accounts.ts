export interface IListBankAccountsRequest {
    type?: 'NATURAL' | 'JURISTIC'
    bankCode?: string
    page?: number
    limit?: number
}

export interface ListBankAccountsResponse {
    items: BankAccount[];
    total: number;
    page: number;
    limit: number;
};

export interface BankAccount {
    id: number;
    bankCode: string;
    bankNumber: string;
    nameTh: string;
    nameEn: string;
    type: 'NATURAL' | 'JURISTIC';
    extraVerify: string | null;
    createdAt: string;                   // ISO 8601
    updatedAt: string;                   // ISO 8601
}