import baseParser from "./base.parser";
import locationDto from "../dto/location.dto";

class dtoToFirebaseParser extends baseParser {

    static toUser(): any {

        return {
            authorized: [],
            changing: {
                currentSmartphone: 0,
                photo: 0,
                subscription: 0,
                receipt: 0
            } 
        }

    }

    static toLocation(uid: string): any {

        return {
            params: {
                battery: 0,
                accuracyState: 0
            },
            location: {
                accuracy: 0,
                altitude: 0,
                direction: 0,
                lat: 0,
                lng: 0,
                speed: 0,
                updatedAt: 0,
            },
            userUid: uid
        }

    }

    static dtoToLocation(dto: locationDto): any {

        return {
            accuracy: dto.accuracy,
            altitude: dto.altitude,
            direction: dto.direction,
            lat: dto.location.lat,
            lng: dto.location.lng,
            speed: dto.speed,
            updatedAt: dto.updatedAt,
        };

    }

    static dtoToRoot(dto: locationDto): any {

        return {
            userUid: dto.uid,
            params: {
                battery: dto.battery,
                accuracyState: dto.accuracyState
            },
            location:
            {
                accuracy: dto.accuracy,
                altitude: dto.altitude,
                direction: dto.direction,
                lat: dto.location.lat,
                lng: dto.location.lng,
                speed: dto.speed,
                updatedAt: dto.updatedAt,
            }
        };

    }

    static dtoToParams(dto: locationDto): any {

        return {
            battery: dto.battery,
            accuracyState: dto.accuracyState
        };

    }



}

export default dtoToFirebaseParser;