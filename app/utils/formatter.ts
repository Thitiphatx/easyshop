export function formatDateTime(date: Date) {
    return date.toLocaleDateString()
}

export function formatCurrency(value: number) {
    return value.toLocaleString()
}

export interface EasySlipErrorMessage {
    client: string  // ข้อความสำหรับผู้ใช้ทั่วไป
    admin: string   // ข้อความทางเทคนิคสำหรับผู้ดูแลระบบ
}

export const EASYSLIP_ERROR: { [key: string]: EasySlipErrorMessage } = {
    // Bank Account API v2
    VALIDATION_ERROR: {
        client: 'สลิปไม่ถูกต้อง กรุณาใช้ภาพที่ได้จากแอปธนาคารเท่านั้น',
        admin: 'Request ไม่ผ่าน validation — ตรวจสอบชื่อฟิลด์และสาเหตุใน message',
    },
    INVALID_BANK_CODE: {
        client: 'รหัสธนาคารไม่ถูกต้อง กรุณาติดต่อแอดมินเพื่อตรวจสอบการตั้งค่า',
        admin: 'ไม่รองรับ bankCode ที่ส่งมา — ใช้รหัสธนาคารจาก GET /banks',
    },
    INVALID_EXTRA_VERIFY: {
        client: 'การตั้งค่าบัญชีธนาคารไม่ถูกต้อง กรุณาติดต่อแอดมินเพื่อแก้ไขข้อมูล',
        admin: 'extraVerify ไม่ตรงกับตัวเลือกของธนาคาร หรือไม่ได้ส่งค่าที่ธนาคารบังคับ',
    },
    BANK_ACCOUNT_NOT_FOUND: {
        client: 'ไม่พบบัญชีธนาคารที่ระบุ กรุณาติดต่อแอดมินเพื่อตรวจสอบการเชื่อมโยงบัญชี',
        admin: 'ไม่พบบัญชี หรือบัญชีไม่ได้เชื่อมโยงกับ Branch ของคุณ',
    },
    BANK_ACCOUNT_DUPLICATE: {
        client: 'บัญชีธนาคารนี้มีในระบบแล้ว กรุณาติดต่อแอดมินหากต้องการตรวจสอบ',
        admin: 'มีบัญชี bankCode + bankNumber เดียวกันอยู่แล้วใน Service',
    },

    // Authentication
    UNAUTHORIZED: {
        client: 'ไม่ได้รับอนุญาตให้เข้าใช้งาน กรุณาติดต่อแอดมิน',
        admin: 'API Key ไม่ถูกต้องหรือหมดอายุ — ตรวจสอบ API Key',
    },
    FORBIDDEN: {
        client: 'ไม่มีสิทธิ์เข้าถึงฟีเจอร์นี้ กรุณาติดต่อแอดมินเพื่อขอสิทธิ์',
        admin: 'ไม่มีสิทธิ์เข้าถึง Endpoint นี้ — ติดต่อแอดมินเพื่อตรวจสอบ API Key',
    },

    // Slip Verification
    INVALID_PAYLOAD: {
        client: 'ข้อมูล Payload ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
        admin: 'Payload ไม่ถูกต้อง — ตรวจสอบรูปแบบ Payload',
    },
    INVALID_IMAGE: {
        client: 'ไฟล์รูปภาพไม่ถูกต้องหรือไม่รองรับ กรุณาใช้ไฟล์ JPEG, PNG, GIF หรือ WebP',
        admin: 'รูปภาพไม่ถูกต้อง — ใช้รูปภาพที่รองรับ (JPEG, PNG, GIF, WebP)',
    },
    INVALID_URL: {
        client: 'URL ไม่ถูกต้อง กรุณาตรวจสอบลิงก์และลองใหม่อีกครั้ง',
        admin: 'URL ไม่ถูกต้อง — ตรวจสอบรูปแบบ URL',
    },
    IMAGE_SIZE_TOO_LARGE: {
        client: 'ไฟล์รูปภาพมีขนาดใหญ่เกินไป กรุณาใช้ไฟล์ที่มีขนาดไม่เกิน 4 MB',
        admin: 'รูปภาพใหญ่เกินไป — ลดขนาดให้ไม่เกิน 4 MB',
    },
    QRCODE_NOT_FOUND: {
        client: 'ไม่พบ QR Code ในรูปภาพ กรุณาใช้รูปสลิปที่ชัดเจนและมี QR Code ครบถ้วน',
        admin: 'ไม่พบ QR Code ในรูป — ใช้รูปที่มี QR Code ชัดเจน',
    },
    SLIP_NOT_FOUND: {
        client: 'ไม่พบข้อมูลสลิปนี้ อาจหมดอายุหรือถูกลบไปแล้ว กรุณาตรวจสอบสลิปอีกครั้ง',
        admin: 'ไม่พบข้อมูลสลิป — สลิปอาจหมดอายุหรือถูกลบ',
    },
    SLIP_PENDING: {
        client: 'สลิปธนาคารกรุงเทพอยู่ระหว่างดำเนินการ กรุณารอสักครู่แล้วลองใหม่ภายใน 5 นาที',
        admin: 'สลิปธนาคารกรุงเทพรอดำเนินการ — รอสักครู่แล้วลองใหม่ (ภายใน 5 นาที)',
    },
    SLIP_EXPIRED: {
        client: 'สลิปนี้หมดอายุแล้ว กรุณาใช้สลิปที่ยังไม่หมดอายุ',
        admin: 'สลิปหมดอายุ — ใช้สลิปที่ยังไม่หมดอายุ',
    },
    DUPLICATE_SLIP: {
        client: 'สลิปนี้ถูกใช้ยืนยันการชำระเงินไปแล้ว ไม่สามารถใช้ซ้ำได้',
        admin: 'สลิปถูกใช้แล้ว — สลิปนี้เคยตรวจสอบมาก่อน',
    },

    // QR Code
    INVALID_REQUEST: {
        client: 'คำขอไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
        admin: 'Request ไม่ถูกต้อง — ตรวจสอบพารามิเตอร์ที่ส่ง',
    },
    INVALID_TYPE: {
        client: 'ประเภท QR Code ไม่ถูกต้อง กรุณาติดต่อแอดมิน',
        admin: 'ประเภท QR ไม่ถูกต้อง — ใช้ PROMPTPAY, KSHOP, MAE_MANEE หรือ TUNGNGERN',
    },
    INVALID_MSISDN: {
        client: 'เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาตรวจสอบรูปแบบ (0xxxxxxxxx)',
        admin: 'เบอร์โทรศัพท์ไม่ถูกต้อง — ใช้รูปแบบ 0xxxxxxxxx',
    },
    INVALID_NATID: {
        client: 'เลขบัตรประชาชนไม่ถูกต้อง กรุณาตรวจสอบให้ครบ 13 หลัก',
        admin: 'เลขบัตรประชาชนไม่ถูกต้อง — ใช้เลข 13 หลัก',
    },
    INVALID_REF1: {
        client: 'Reference ไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่',
        admin: 'Reference 1 ไม่ถูกต้อง — ใช้ตัวอักษรพิมพ์ใหญ่ 1-20 ตัว',
    },

    // Quota
    QUOTA_EXCEEDED: {
        client: 'โควต้าการใช้งานหมดแล้ว กรุณาติดต่อแอดมินเพื่อเติมโควต้า',
        admin: 'โควต้าหมด — เติมโควต้าหรือรอรีเซ็ต',
    },

    // Rate Limit
    RATE_LIMIT_EXCEEDED: {
        client: 'มีการส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
        admin: 'เรียก API เกิน TPS ที่ใช้ได้ — รอตาม header Retry-After แล้วลองใหม่',
    },

    // Account Matching (v2)
    ACCOUNT_NOT_MATCH: {
        client: 'บัญชีธนาคารไม่ตรงกับข้อมูลในสลิป กรุณาตรวจสอบหมายเลขบัญชีที่ลงทะเบียน',
        admin: 'บัญชีไม่ตรงกัน — ตรวจสอบหมายเลขบัญชีที่ส่ง',
    },
    AMOUNT_NOT_MATCH: {
        client: 'จำนวนเงินในสลิปไม่ตรงกับยอดที่กำหนด กรุณาตรวจสอบจำนวนเงินอีกครั้ง',
        admin: 'จำนวนเงินไม่ตรงกัน — ตรวจสอบจำนวนเงินที่ส่ง',
    },
}

