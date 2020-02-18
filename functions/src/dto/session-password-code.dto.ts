import baseDto from './base.dto';

class sessionPasswordCodeDto extends baseDto {
    public code: string = ''
    public password: string = ''
    public confirmPassword: string = '';
}

export default sessionPasswordCodeDto;