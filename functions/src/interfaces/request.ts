import  requestContextDto   from '../dto/request-context.dto';

declare global {
    namespace Express {
        interface Request {
            context: requestContextDto
        }
    }
}
