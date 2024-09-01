export default interface IWapi {
    sendMsg({ message, phone }: { message: string, phone: string }): Promise<any>
    sendMediaMsg({ message, phone, mime, data, filename }: { message: string, phone: string, mime: string, data: string, filename?: string }): Promise<any>
}