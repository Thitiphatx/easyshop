

export async function verifyTurnstile(token: string): Promise<boolean> {
    if (!token) return false

    const secretKey = process.env.TURNSTILE_SECRET

    if (!secretKey) {
        console.error('Missing TURNSTILE_SECRET in environment variables')
        return false
    }

    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
            cache: 'no-store',
        })

        const data = await res.json()
        return data.success === true
    } catch (error) {
        console.error('Turnstile verification error:', error)
        return false
    }
}