export const TMN_ERROR_MESSAGES: Record<string, string> = {
    SUCCESS: "ทำรายการสำเร็จ",
    BAD_PARAM: "ข้อมูลที่ส่งไปไม่ถูกต้อง กรุณาตรวจสอบลิงก์ซองของขวัญอีกครั้ง",
    VOUCHER_NOT_FOUND: "ไม่พบซองของขวัญนี้ หรือลิงก์ไม่ถูกต้อง",
    VOUCHER_OUT_OF_STOCK: "ซองของขวัญนี้ถูกใช้งานไปแล้ว หรือถูกรับจนหมดแล้ว",
    VOUCHER_EXPIRED: "ซองของขวัญนี้หมดอายุแล้ว",
    CANNOT_GET_OWN_VOUCHER: "ไม่สามารถเติมซองของขวัญของตัวเองได้",
    TARGET_USER_NOT_FOUND: "ไม่พบเบอร์โทรศัพท์ผู้รับในระบบ TrueMoney",
    TARGET_USER_REDEEMED: "คุณเคยรับซองของขวัญนี้ไปแล้ว",
    TARGET_USER_STATUS_INACTIVE: "บัญชี TrueMoney ผู้รับไม่พร้อมใช้งาน",
    INTERNAL_ERROR: "ระบบ TrueMoney ขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง",
    INVALID_INPUT: "ข้อมูลที่ระบุไม่ถูกต้อง กรุณาตรวจสอบลิงก์ซองของขวัญ",
    CONDITION_NOT_MET: "เงื่อนไขซองของขวัญไม่ตรงตามที่กำหนด",
    MAINTENANCE: "ระบบ TrueMoney อยู่ในช่วงปิดปรับปรุงชั่วคราว",
    NETWORK_ERROR: "ไม่สามารถเชื่อมต่อกับ TrueMoney ได้ กรุณาลองใหม่อีกครั้ง",
    TIMEOUT: "การเชื่อมต่อกับ TrueMoney ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง",
    INVALID_RESPONSE: "ระบบ TrueMoney ตอบกลับไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
};

export function getTmnErrorMessage(code: string, fallbackMessage?: string): string {
    return TMN_ERROR_MESSAGES[code] || fallbackMessage || "เกิดข้อผิดพลาดในการทำรายการ";
}
