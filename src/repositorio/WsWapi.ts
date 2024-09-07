import fs from 'fs'
import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import IWapi from "../interface/IWapi";
//const qrcode = require('qrcode-terminal');
/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsWapi extends Client implements IWapi {
    private status = false;

    constructor() {
        super({
            authStrategy: new LocalAuth(),
            puppeteer: { headless: true, args: ['--no-sandbox'] },
            webVersionCache: {
                type: "remote",
                remotePath:
                    "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
            }
        });

        try {
            this.on("authenticated", () => {
                this.status = true;
                console.log("LOGIN SUCCESS...");
            });

            this.on("auth_failure", () => {
                this.status = false;
                console.log("LOGIN FAIL...");
            });

            this.on("qr", (qr) => {
                console.log('QR GENERATED...');
                this.generateImage(qr);
                this.status = false;
            });
        } catch (e: any) {
            console.log(e);
        }

        // try {
        //     this.on("ready", () => {
        //         //this.status = true;
        //         console.log("LOGIN SUCCESS...");
        //     });
        // } catch (e: any) {
        //     console.log("ready...: " + e);
        // }

        // this.on("auth_failure", () => {
        //     this.status = false;
        //     console.log("LOGIN FAIL...");
        // });

        // this.on("qr", (qr) => {
        //     console.log('QR GENERATED...');
        //     this.generateImage(qr);
        //     // qrcode.generate(qr, { small: true }, function (qrcode?: any) {
        //     // console.log(qrcode)
        //     // });
        // });

        console.log("Iniciando....");
        this.initialize();
    }

    async sendMsg(lead: { message: string; phone: string }): Promise<any> {
        try {
            const { message, phone } = lead;
            const response = await this.sendMessage(`${phone}@c.us`, message);
            return { success: true, id: response.id.id };

        } catch (e: any) {
            return Promise.resolve({ success: false, error: e.message });
        }
    }
    async sendMediaMsg(lead: { message: string; phone: string, mime: string, data: string, filename?: string }): Promise<any> {
        try {
            const { message, phone, mime, data, filename } = lead;
            const media = new MessageMedia(mime, data, filename);
            const response = await this.sendMessage(`${phone}@c.us`, media, { caption: message });
            return { success: true, id: response.id.id };
        } catch (e: any) {
            return Promise.resolve({ success: false, error: e.message });
        }
    }

    getStatus(): boolean {
        return this.status;
    }

    private generateImage = (base64: string) => {
        const path = 'tmp'; //`${process.cwd()}/tmp`;
        let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
        qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
        console.log(`El codigo QR se actualiza cada minuto`);
    };

    async getQR(): Promise<any> {
        const path = 'tmp';
        try {
            let qr_svg = fs.readFileSync(`${path}/qr.svg`);
            return { success: true, qr: qr_svg.toString() };
        } catch (e: any) {
            return Promise.resolve({ success: false, error: e.message });
        }
    }
}

export default WsWapi;
