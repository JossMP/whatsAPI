import fs from 'fs'
import cors from "cors"
import express from "express"
import WsWapi from './repositorio/WsWapi'
import path from 'path'

import * as emoji from 'node-emoji'

const app = express()
const port = process.env.PORT || 3001
const token = process.env.TOKEN || "RANDOM-TOKEN"

const whatsapp = new WsWapi();

app.use(cors())
app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ limit: '200mb', extended: true }))

app.use(express.static(path.join(__dirname, 'views')));

app.post('/send', async (req, res) => {

    const authorization = req.headers['authorization'];
    if (authorization !== token) return res.json({ success: false, message: "UNAUTHORIZED" });


    const { message, phone, mime, data, filename } = req.body;

    if (!whatsapp.getStatus) return res.json({ success: false, message: "WAIT_LOGIN" });
    if (message == undefined) return res.json({ success: false, message: "MESSAGE_UNDEFINED" });
    if (phone == undefined) return res.json({ success: false, message: "PHONE_UNDEFINED" });

    const parsedMessage = emoji.emojify(message);

    if (typeof (mime) == "undefined" || typeof (data) == "undefined") {
        const response = await whatsapp.sendMsg({ message: parsedMessage, phone })
        res.json(response);
    }
    else {
        const response = await whatsapp.sendMediaMsg({ message: parsedMessage, phone, mime, data, filename })
        res.json(response);
    }
})

app.post('/qr-json', async (req, res) => {
    if (whatsapp.getStatus()) return res.json({ success: false, message: "SESSION_EXISTS" });
    const response = await whatsapp.getQR();
    res.json(response);
})

app.get('/qr', async (req, res) => {
    if (whatsapp.getStatus()) return res.sendFile(path.join(__dirname, "views", "success.html"))

    const response = await whatsapp.getQR();
    if (response.success) {
        res.sendFile(path.join(__dirname, "views", "qr.html"))
        return;
    }
    else {
        res.sendFile(path.join(__dirname, "views", "success.html"))
        return;
    }
})


app.listen(port, () => {
    console.log(`on port ${port}`)
})