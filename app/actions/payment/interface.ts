// --------------- Bank --------------- //

export interface VerifyBankRequest {
    // ต้องระบุอย่างใดอย่างหนึ่ง
    payload?: string;      // QR payload (1-128 ตัวอักษร)
    image?: File;          // ไฟล์รูปภาพ (multipart/form-data)
    base64?: string;       // รูปภาพเข้ารหัส Base64
    url?: string;          // URL ของรูปภาพ (1-2048 ตัวอักษร)

    // พารามิเตอร์เสริม
    remark?: string;       // 1-255 ตัวอักษร
    matchAccount?: boolean;
    matchAmount?: number;
    checkDuplicate?: boolean;
}

export interface VerifyBankData {
    remark?: string;
    isDuplicate: boolean;
    matchedAccount: MatchedAccount | null;
    amountInOrder?: number;
    amountInSlip: number;
    isAmountMatched?: boolean;
    rawSlip: RawSlip;
}

interface MatchedAccount {
    bank: {
        nameTh: string;
        nameEn: string;
        code: string;
        shortCode: string;
    };
    nameTh: string;
    nameEn: string;
    type: 'PERSONAL' | 'JURISTIC';
    bankNumber: string;
}

interface RawSlip {
    payload: string;
    transRef: string;
    date: string;              // ISO 8601
    countryCode: string;
    amount: Amount;
    fee: number;
    ref1: string;
    ref2: string;
    ref3: string;
    sender: Party;
    receiver: Party & { merchantId?: string | null };
}

interface Amount {
    amount: number;
    local: {
        amount: number;
        currency: string;
    };
}

interface Party {
    bank: {
        id: string;
        name: string;
        short: string;
    };
    account: {
        name: {
            th?: string;
            en?: string;
        };
        bank?: {
            type: 'BANKAC' | 'TOKEN' | 'DUMMY';
            account: string;
        };
        proxy?: {
            type: 'NATID' | 'MSISDN' | 'EWALLETID' | 'EMAIL' | 'BILLERID';
            account: string;
        };
    };
}

// --------------- TrueWallet --------------- //