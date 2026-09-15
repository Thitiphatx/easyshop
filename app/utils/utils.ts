export function getLastWeekRange(): { startOfWeek: Date, endOfWeek: Date } {
    const now = new Date();

    // Snap to local midnight first, then use getDay() which respects local time
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat (local)

    // Days since last Monday (local)
    const diffToMonday = day === 0 ? 6 : day - 1;

    // This week's Monday (local midnight)
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - diffToMonday);

    // Last week: Mon and Sun
    const startOfWeek = new Date(thisMonday);
    startOfWeek.setDate(thisMonday.getDate() - 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64 string'));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};