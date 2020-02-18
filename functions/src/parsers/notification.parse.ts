import baseParser from './base.parser';
import notificationQueueDto from '../dto/notification-queue.dto';
import { notificationTypesString } from '../enum/notification.enum';
import notificationAlertDto from '../dto/notification-alert.dto';
import { alertPriority } from '../enum/alert.enum';
import userTokenDto from '../dto/user-token.dto';
import { platformsString } from '../enum/platform.enum';

class notificationParser extends baseParser {

    static fence(uids: string[], title: string, body: string, occurredAt: number, priority: number, monitorableUid: string, idType: string): notificationQueueDto[] {
        return notificationParser.base(uids, title, body, occurredAt, notificationTypesString.fence, priority, monitorableUid, idType);
    }

    static accept(uids: string[], title: string, body: string, occurredAt: number, monitoredUid: string): notificationQueueDto[] {
        return notificationParser.base(uids, title, body, occurredAt, notificationTypesString.accept, alertPriority.default, monitoredUid);
    }

    static blockedUser(uids: string[], title: string, body: string, occurredAt: number): notificationQueueDto[] {
        return notificationParser.base(uids, title, body, occurredAt, notificationTypesString.blockedUser);
    }

    static weatherAlert(uids: string[], title: string, body: string, monitoredUid: string, occurredAt: number): notificationQueueDto[] {
        return notificationParser.base(uids, title, body, occurredAt, notificationTypesString.weatherAlert, alertPriority.default, monitoredUid);
    }

    static generic(uid: string, title: string, body: string, occurredAt: number, type: notificationTypesString, priority?: number, monitoredUid?: string, idType?: string): notificationQueueDto[] {
        return notificationParser.base([uid], title, body, occurredAt, type, priority, monitoredUid);
    }

    private static base(uids: string[], title: string, body: string, occurredAt: number, type: notificationTypesString, priority?: number, monitoredUid?: string, idType?: string): notificationQueueDto[] {

        let queues: notificationQueueDto[] = [];

        for (let uid of uids) {
            queues.push(<notificationQueueDto>{
                uid: uid,
                title: title,
                body: body,
                occurredAt: occurredAt,
                type: type,
                priority: priority || "0",
                monitoredUid: monitoredUid || '0',
                idType: idType || "0",
                try : 0
            })
        }

        return queues;
    }

    static toPush(queue: notificationQueueDto, userTokenDto: userTokenDto): any {

        let push: any = {
            key: queue.key,
            payload: {
                token: userTokenDto.token,
                notification: {
                    title: queue.title,
                    body: queue.body
                },
                data: {
                    uid: queue.monitoredUid,
                    type: queue.type,
                    idType: queue.idType.toString(),
                    occurredAt: queue.occurredAt.toString()
                }
            }
        };

        if (userTokenDto.platform == platformsString.apple) {

            push.payload['apns'] = {
                headers: {
                    "apns-priority": "10"
                },
                payload: {
                    "content-available": 1,
                    "aps": {
                        "badge": 1,
                        "alert": {
                            "title": queue.title,
                            "body": queue.body
                        }
                    }
                }
            }
        }
        else if (userTokenDto.platform == platformsString.google) {

            push.payload['android'] = {
                priority: "high",
            }

        }

        return push;
    }

    static toAlert(queues: notificationQueueDto[]): notificationAlertDto[] {

        let alerts: notificationAlertDto[] = [];

        for (let queue of queues) {

            alerts.push(<notificationAlertDto>{
                uid: queue.uid,
                monitoredUid: queue.monitoredUid,
                userUid: queue.monitoredUid,
                title: queue.title,
                body: queue.body,
                type: queue.type,
                idType: queue.idType.toString(),
                occurredAt: queue.occurredAt,
                priority: queue.priority
            });
        }

        return alerts;
    }


}

export default notificationParser;