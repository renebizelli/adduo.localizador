import baseMongo from "./base.mongo";
import subscriptReceiptSchema from '../models/subscription-receipt.schema';
import receiptDto from "../dto/receipt.dto";
import modelToDtoParser from "../parsers/model-to-dto.parser";
import { receiptStatusString } from "../enum/subscription.enum";
import timeStampHelper from "../helpers/timestamp.helper";

class subscriptionReceiptMongo extends baseMongo {

    add = async (uid: string, receipt: receiptDto) => {

        let model = {
            _id:
            {
                uid: uid,
                transactionId: receipt.transactionId
            },
            platform: receipt.platform,
            receipt: receipt.data,
            status: receiptStatusString.waitForProcess,
            tryToSend: 0,
            error: [],
            createdAdt: timeStampHelper.get()
        };

        await (new subscriptReceiptSchema(model)).save();

    }

    addError = async (uid: string, transactionId: string, error: any) => {

        return this._updateOne(
            {
                _id:
                {
                    uid: uid,
                    transactionId: transactionId
                }
            },
            {
                $set: { status: receiptStatusString.error },
                $inc: { tryToSend: 1 },
                $push: {
                    'error': error
                }
            })

    }

    one = async (uid: string, transactionId: string) => {

        let model = await this._findOne({
            _id: {
                uid: uid,
                transactionId: transactionId
            }
        });

        let dto = null;

        if (model) {
            dto = modelToDtoParser.subscriptioReceipt(model);
        }

        return dto;
    }

    processedSuccessUpdate = async (uid: string, transactionId: string) => {
        return this._processedErrorUpdate(uid, transactionId, receiptStatusString.processed);
    }

    processedErrorUpdate = async (uid: string, transactionId: string) => {
        return this._processedErrorUpdate(uid, transactionId, receiptStatusString.error);
    }

    private _processedErrorUpdate = async (uid: string, transactionId: string, status: receiptStatusString) => {

        return this._updateOne({
            _id: {
                uid: uid,
                transactionId: transactionId
            }
        }, {
            $set: { status: status }
        }, { upsert: true })

    }


    private _findOne = async (query: any, projection?: any) => {
        return subscriptReceiptSchema.findOne(query, projection);
    }

    private _updateOne(query: any, data: any, options?: any) {

        let _options = {
        }

        Object.assign(_options, options);

        return subscriptReceiptSchema.updateOne(query, data);
    }



}

export default subscriptionReceiptMongo;