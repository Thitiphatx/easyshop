"use server"

import { TmnVoucherClient } from "@prakrit_m/tmn-voucher";
import { IActionResponse } from "../interface";
import { getTmnErrorMessage } from "./utils";

function createCookieJarFetch() {
    const cookieJar = new Map<string, string>();

    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const headers = new Headers(init?.headers);

        if (cookieJar.size > 0) {
            const cookieStr = Array.from(cookieJar.entries())
                .map(([k, v]) => `${k}=${v}`)
                .join("; ");
            headers.set("Cookie", cookieStr);
        }

        const response = await fetch(input, { ...init, headers, cache: 'no-store' });

        const setCookies: string[] = typeof (response.headers as any).getSetCookie === "function"
            ? (response.headers as any).getSetCookie()
            : (response.headers.get("set-cookie")?.split(/,\s*(?=[A-Za-z0-9_+-]+=)/) || []);

        for (const sc of setCookies) {
            if (!sc) continue;
            const pair = sc.split(";")[0];
            const eqIdx = pair.indexOf("=");
            if (eqIdx > 0) {
                const key = pair.substring(0, eqIdx).trim();
                const val = pair.substring(eqIdx + 1).trim();
                if (key && val) {
                    cookieJar.set(key, val);
                }
            }
        }

        // กรณี TrueMoney ตอบกลับเป็น HTTP 400 พร้อม JSON Error Payload แมปให้ Lib สกัดข้อความภาษาไทยเดิมของ TrueMoney ได้
        if (!response.ok && response.status < 500) {
            try {
                const text = await response.text();
                const json = JSON.parse(text);
                if (json && typeof json === "object" && (json.status || json.code)) {
                    return new Response(text, {
                        status: 200,
                        headers: response.headers,
                    });
                }
                return new Response(text, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                });
            } catch {
                return response;
            }
        }

        return response;
    };
}

function createClient() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return new TmnVoucherClient({
        baseApiUrl: `${baseUrl}/tmn-api`,
        fetch: createCookieJarFetch(),
    });
}

const phone = process.env.TRUEWALLET_PHONE as string

export async function redeem(voucherCode: string): Promise<IActionResponse<number>> {
    try {
        const client = createClient();
        const res = await client.redeemVoucher(phone, voucherCode);
        if (!res.success) {
            return {
                success: false,
                error: getTmnErrorMessage(res.code, res.message),
            };
        }

        return {
            success: true,
            data: res.data.amount,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ TrueMoney",
        };
    }
}

export async function checkStatus(): Promise<IActionResponse<void>> {
    try {
        const client = createClient();
        const res = await client.checkServerStatus();
        if (!res.success) {
            return {
                success: false,
                error: getTmnErrorMessage(res.code, res.message),
            };
        }

        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error?.message || "เกิดข้อผิดพลาดในการเช็คสถานะ TrueMoney",
        };
    }
}
