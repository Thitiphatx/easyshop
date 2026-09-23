import { ApiResponse } from "../../interface";
import { easyslip } from "../easyslip";

export interface TrueWalletVerifyOptions {
    checkDuplicate?: boolean;
}

export async function verifyTruewallet(base64: string, options?: TrueWalletVerifyOptions): Promise<ApiResponse<any>> {
    try {
        const { data } = await easyslip.post<ApiResponse<any>>('/verify/truewallet', {
            base64,
            options: {
                checkDuplicate: options?.checkDuplicate ?? true,
            },
        })
        return data
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้'
            }
        }
    }
}
