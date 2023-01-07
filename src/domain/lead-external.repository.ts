export default interface LeadExternal {
    sendMsg({ message, phone }: { message: string, phone: string }): Promise<any>
    sendMediaMsg({ message, phone, mime, data }: { message: string, phone: string, mime: string, data: string }): Promise<any>
}