import httpStatus from "./http-status.helper";

class firebaseHelper {

    static parserErrorToHttpStatus(error: any) {

        let errorHttp = {}

        switch (error.code) {
            case 'auth/invalid-email':
                errorHttp = httpStatus.badRequest('error:user.form.email');
                break;

            case 'auth/invalid-phone-number':
                errorHttp = httpStatus.badRequest('error:user.form.phone');
                break;

            case 'auth/invalid-disabled-field':
                errorHttp = httpStatus.badRequest('error:user.form.invalid-disabled-field');
                break;

            case 'auth/phone-number-already-exists':
                errorHttp = httpStatus.badRequest('error:user.form.phone-already-exists');
                break;

            case 'auth/email-already-exists':
                errorHttp = httpStatus.badRequest('error:user.form.email-already-exists');
                break;

            case 'auth/wrong-password':
                errorHttp = httpStatus.badRequest('error:auth.invalid-auth');
                break;

            case 'auth/user-not-found':
                errorHttp = httpStatus.notFound('error:user.notFound');
                break;

            case 'auth/argument-error':
            case 'auth/id-token-expired':
                errorHttp = httpStatus.unauthorized();
                break;

            case 'auth/id-token-revoked':
                errorHttp = httpStatus.locked();
                break;

            case 'auth/expired-action-code':
            case 'auth/invalid-action-code':
                errorHttp = httpStatus.unauthorized('error:user.changePasswordInvalidCode');
                break;

            default:
                errorHttp = httpStatus.internalError('error:unprocessable', error);
        }

        return errorHttp

    }

}

export default firebaseHelper;