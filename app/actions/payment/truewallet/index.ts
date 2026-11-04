"use server"

import { TmnVoucherClient } from "@prakrit_m/tmn-voucher";
import { ApiResponse } from "../../interface";
import { prisma } from "@/lib/prisma";
import { TopupChannel } from "@/app/generated/prisma/enums";
import { getPaymentError } from "../utils/errors";
import { authorizePayment, createTopup } from "../index";
import type { ITopupResult } from "../interface";

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

export async function redeem(voucherCode: string, turnstileToken: string): Promise<ApiResponse<ITopupResult>> {
    try {
        const authorization = await authorizePayment(turnstileToken)
        if (!authorization.success) return authorization

        const setting = await prisma.setting.findFirst({
            where: { id: 1 },
            select: { truewalletPhoneNumber: true, pointMultiplier: true }
        })

        if (!setting?.truewalletPhoneNumber) {
            return {
                success: false,
                error: {
                    code: 'WALLET_PHONE_NOT_FOUND',
                    message: getPaymentError('WALLET_PHONE_NOT_FOUND')
                }
            }
        }

        const client = createClient();
        const res = await client.redeemVoucher(setting.truewalletPhoneNumber, voucherCode);
        if (!res.success) {
            return {
                success: false,
                error: {
                    message: getPaymentError(res.code, res.message)
                },
            };
        }

        return createTopup({
            session: authorization.data,
            amount: res.data.amount,
            pointAmount: res.data.amount / 100,
            pointMultiplier: setting.pointMultiplier,
            channel: TopupChannel.TRUEWALLET,
            reference: voucherCode
        })
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: getPaymentError('NETWORK_ERROR')
            },
        };
    }
}

export async function checkStatus(): Promise<ApiResponse<undefined>> {
    try {
        const client = createClient();
        const res = await client.checkServerStatus();
        if (!res.success) {
            return {
                success: false,
                error: {
                    message: getPaymentError(res.code, res.message)
                }
            };
        }

        return {
            success: true,
            data: undefined
        };
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: getPaymentError('NETWORK_ERROR')
            },
        };
    }
}
