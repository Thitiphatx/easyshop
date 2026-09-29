// Static bank code map from EasySlip
// Reference: https://document.easyslip.com/en/reference/bank-codes

import { IBankCode } from "../interface"

export const BANK_CODES: Record<string, IBankCode> = {
    '002': { nameTh: 'ธนาคารกรุงเทพ', nameEn: 'Bangkok Bank', shortCode: 'BBL' },
    '004': { nameTh: 'ธนาคารกสิกรไทย', nameEn: 'Kasikorn Bank', shortCode: 'KBANK' },
    '006': { nameTh: 'ธนาคารกรุงไทย', nameEn: 'Krungthai Bank', shortCode: 'KTB' },
    '011': { nameTh: 'ธนาคารทหารไทยธนชาต', nameEn: 'TMBThanachart Bank', shortCode: 'TTB' },
    '014': { nameTh: 'ธนาคารไทยพาณิชย์', nameEn: 'Siam Commercial Bank', shortCode: 'SCB' },
    '017': { nameTh: 'ธนาคารซิตี้แบงก์', nameEn: 'Citibank', shortCode: 'CITI' },
    '020': { nameTh: 'ธนาคารสแตนดาร์ดชาร์เตอร์ด', nameEn: 'Standard Chartered Bank', shortCode: 'SCBT' },
    '022': { nameTh: 'ธนาคาร CIMB ไทย', nameEn: 'CIMB Thai Bank', shortCode: 'CIMBT' },
    '024': { nameTh: 'ธนาคารยูโอบี', nameEn: 'United Overseas Bank', shortCode: 'UOBT' },
    '025': { nameTh: 'ธนาคารกรุงศรีอยุธยา', nameEn: 'Bank of Ayudhya', shortCode: 'BAY' },
    '026': { nameTh: 'ธนาคารเมกะ สากลพาณิชย์', nameEn: 'Mega International Commercial Bank', shortCode: 'MEGA' },
    '027': { nameTh: 'ธนาคารแห่งอเมริกา', nameEn: 'Bank of America', shortCode: 'BOA' },
    '030': { nameTh: 'ธนาคารออมสิน', nameEn: 'Government Savings Bank', shortCode: 'GSB' },
    '033': { nameTh: 'ธนาคารอาคารสงเคราะห์', nameEn: 'Government Housing Bank', shortCode: 'GHB' },
    '034': { nameTh: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร', nameEn: 'Bank for Agriculture and Agricultural Cooperatives', shortCode: 'BAAC' },
    '039': { nameTh: 'ธนาคารมิซูโฮ คอร์ปอเรต', nameEn: 'Mizuho Corporate Bank', shortCode: 'MHCB' },
    '045': { nameTh: 'ธนาคารบีเอ็นพี พารีบาส์', nameEn: 'BNP Paribas', shortCode: 'BNP' },
    '052': { nameTh: 'ธนาคารแห่งประเทศจีน', nameEn: 'Bank of China', shortCode: 'BOC' },
    '065': { nameTh: 'ธนาคารทิสโก้', nameEn: 'TISCO Bank', shortCode: 'TISCO' },
    '066': { nameTh: 'ธนาคารเกียรตินาคินภัทร', nameEn: 'Kiatnakin Phatra Bank', shortCode: 'KKP' },
    '067': { nameTh: 'ธนาคารไอซีบีซี (ไทย)', nameEn: 'ICBC (Thai)', shortCode: 'ICBCT' },
    '069': { nameTh: 'ธนาคารไทยเครดิต', nameEn: 'Thai Credit Bank', shortCode: 'TCD' },
    '070': { nameTh: 'ธนาคารแลนด์ แอนด์ เฮ้าส์', nameEn: 'Land and Houses Bank', shortCode: 'LHBANK' },
    '071': { nameTh: 'ธนาคารซูมิโตโม มิตซุย', nameEn: 'Sumitomo Mitsui Banking Corporation', shortCode: 'SMBC' },
    '073': { nameTh: 'ธนาคารทหารไทย', nameEn: 'TMB Bank', shortCode: 'TMB' },
    '098': { nameTh: 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม', nameEn: 'SME Development Bank', shortCode: 'SMEBANK' },
    'TRUEWALLET': { nameTh: 'ทรูมันนี่ วอลเล็ท', nameEn: 'TrueMoney Wallet', shortCode: 'TRUEWALLET' },
}

export function getBankNameByCode(bankCode: string): IBankCode {
    return BANK_CODES[bankCode] ?? { nameTh: bankCode, nameEn: bankCode, shortCode: bankCode }
}
