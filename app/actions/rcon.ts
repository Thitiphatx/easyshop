'use server';
import { Rcon } from 'rcon-client';

export interface RconResult {
    success: boolean;
    response?: string;
    error?: string;
}

export async function sendMinecraftCommand(formData: FormData): Promise<RconResult> {
    const command = formData.get('command')?.toString().trim();

    if (!command) {
        return { success: false, error: 'Command cannot be empty' };
    }

    let rcon: Rcon | null = null;

    try {
        rcon = await Rcon.connect({
            host: process.env.RCON_HOST || 'localhost',
            port: Number(process.env.RCON_PORT) || 25575,
            password: process.env.RCON_PASSWORD || '',
            timeout: 5000,
        });

        const response = await rcon.send(command);
        return { success: true, response: response || 'Command executed successfully (no response)' };
    } catch (err: any) {
        return { success: false, error: err.message || 'Failed to execute command' };
    } finally {
        if (rcon) {
            await rcon.end();
        }
    }
}