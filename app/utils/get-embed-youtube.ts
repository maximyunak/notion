export function YouTubeGetID(url: string): string {
    let ID: string = '';
    let parts = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (parts[2] !== undefined) {
        ID = parts[2].split(/[^0-9a-z_\-]/i)[0] ?? '';
    } else {
        ID = url;
    }
    return ID;
}