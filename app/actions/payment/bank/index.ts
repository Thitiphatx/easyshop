"use server"
import { TopupChannel, TopupStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";
import { ApiResponse } from "../../interface";
import { getSession } from "../../session";
import type { ITopupResult, VerifyBankData } from "../interface";
import { IBank, IListBankAccountsRequest } from "../types/bank-accounts";
import { getPaymentError } from "../utils/errors";

async function devTopup(devMode: string): Promise<ApiResponse<VerifyBankData>> {

    if (devMode == "fail") {
        return {
            success: false,
            error: {
                code: 'SLIP_NOT_FOUND',
                message: getPaymentError('SLIP_NOT_FOUND')
            }
        }
    }

    const data: VerifyBankData = {
        isDuplicate: devMode == "duplicate",
        rawSlip: {
            payload: "00000000000000000000000000000000000000000000000",
            transRef: "68370160657749I376388B35",
            date: "2024-01-15T14:30:00+07:00",
            countryCode: "TH",
            amount: {
                amount: 1500.00,
                local: {
                    amount: 1500.00,
                    currency: "THB"
                }
            },
            fee: 0,
            sender: {
                bank: {
                    id: "004",
                    name: "กสิกรไทย",
                    short: "KBANK"
                },
                account: {
                    name: {
                        th: "นาย ผู้โอน ทดสอบ",
                        en: "MR. SENDER TEST"
                    },
                    bank: {
                        type: "BANKAC",
                        account: "123-4-xxxxx-5"
                    }
                }
            },
            receiver: {
                bank: {
                    id: "014",
                    name: "ไทยพาณิชย์",
                    short: "SCB"
                },
                account: {
                    name: {
                        th: "นาย รับเงิน ทดสอบ"
                    },
                    bank: {
                        type: "BANKAC",
                        "account": "xxx-x-x5678-x"
                    }
                }
            }
        }
    }
    return {
        success: true,
        data: data
    }
}

export async function topupBank(base64: string, devMode: string, turnstileToken: string): Promise<ApiResponse<ITopupResult>> {
    try {
        const turnstile = await verifyTurnstile(turnstileToken)
        if (!turnstile) {
            return {
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: getPaymentError('FORBIDDEN')
                }
            }
        }

        // require easyslip api 
        // const { data } = await easyslip.post<ApiResponse<VerifyBankData>>('/verify/bank', {
        //     base64
        // })

        const res = await devTopup(devMode)

        if (!res.success) {
            return {
                success: false,
                error: res.error
            }
        }
        const data = res.data

        if (data.isDuplicate) {
            return {
                success: false,
                error: {
                    code: 'DUPLICATE_SLIP',
                    message: getPaymentError('DUPLICATE_SLIP')
                }
            }
        }
        const setting = await prisma.setting.findFirst({
            where: { id: 1 },
            select: { pointMultiplier: true }
        })

        if (!setting) {
            return {
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'ไม่พบข้อมูลการตั้งค่า'
                }
            }
        }

        const receivePoint = data.rawSlip.amount.amount * setting.pointMultiplier
        const session = await getSession()
        if (!session || !session.username) {
            return {
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'กรุณาเข้าสู้ระบบก่อนทำรายการ'
                }
            }
        }

        const account = await prisma.$transaction(async (tx) => {
            const updatedAccount = await tx.authMe.update({
                where: { username: session.username },
                data: {
                    playerPoints: {
                        update: {
                            points: {
                                increment: receivePoint
                            }
                        }
                    }
                },
                select: {
                    playerPoints: {
                        select: {
                            points: true
                        }
                    }
                }
            })

            await tx.topup.create({
                data: {
                    userId: session.id,
                    amount: data.rawSlip.amount.amount,
                    channel: TopupChannel.BANK,
                    status: TopupStatus.SUCCESS,
                    reference: data.rawSlip.transRef,
                    pointsAdded: receivePoint,
                }
            })

            return updatedAccount
        })

        return {
            success: true,
            data: {
                receivePoint: receivePoint,
                totalPoint: account.playerPoints.points
            }
        }

    } catch (error: any) {
        // if (error.response) {
        //     const errorCode = error.response.data.error.code as string
        //     const errorMessage = getErrorByCode(errorCode.toUpperCase())
        //     return {
        //         success: false,
        //         error: {
        //             code: error.response.data.error.code,
        //             message: errorMessage.client
        //         }
        //     }
        // }
        console.log(error)
        return {
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้'
            }
        }
    }
}

export async function getBankInfo(request?: IListBankAccountsRequest): Promise<ApiResponse<IBank>> {
    try {
        return await getBankInfoDev()
        // const { data } = await easyslip.get<ApiResponse<ListBankAccountsResponse>>('/bank-accounts', {
        //     params: request,
        // })
        // if (data.success) {
        //     const first = data.data.items.find(item => item.bankCode !== 'TRUEMONEYWALLET') ?? null
        //     if (!first) {
        //         return {
        //             success: false,
        //             error: {
        //                 code: 'NOT_FOUND',
        //                 message: 'ไม่พบข้อมูลธนาคาร'
        //             }
        //         }
        //     }
        //     return {
        //         success: true,
        //         data: {
        //             ...first,
        //             bankNameTh: getBankNameByCode(first.bankCode).nameTh,
        //         }
        //     }
        // }
        // return {
        //     success: false,
        //     error: data.error
        // }
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

async function getBankInfoDev(): Promise<ApiResponse<IBank>> {
    return {
        success: true,
        data: {
            id: 0,
            bankCode: '002',
            bankNumber: '123456789',
            nameTh: 'ทดสอบ',
            nameEn: 'TEST',
            type: 'NATURAL',
            extraVerify: null,
            createdAt: '',
            updatedAt: '',
            bankNameTh: 'ทดสอบ'
        }
    }
}