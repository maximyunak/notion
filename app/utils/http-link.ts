export const getHttpLink = (url: string) => {
    if (!url.startsWith('http')) {
        return 'https://' + url;
    }
    return url
}