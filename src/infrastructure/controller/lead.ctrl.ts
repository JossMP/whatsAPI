import { Request, Response } from "express";
import { LeadCreate } from "../../application/lead.create";

class LeadCtrl {
  constructor(private readonly leadCreator: LeadCreate) { }

  public sendCtrl = async ({ body }: Request, res: Response) => {
    const { message, phone } = body;
    const response = await this.leadCreator.sendMessageAndSave({ message, phone })
    res.send(response);
  };

  public sendMediaCtrl = async ({ body }: Request, res: Response) => {
    const { message, phone, mime, data } = body;
    if (typeof (mime) == "undefined" || typeof (data) == "undefined") {
      console.log('Sending normal message');
      const response = await this.leadCreator.sendMessageAndSave({ message, phone })
      res.send(response);
    }
    else {
      console.log('Sending media message');
      const response = await this.leadCreator.sendMediaMessageAndSave({ message, phone, mime, data })
      res.send(response);
    }
  };
}

export default LeadCtrl;
