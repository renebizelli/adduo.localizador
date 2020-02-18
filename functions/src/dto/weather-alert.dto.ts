import baseDto from "./base.dto";

class weatherAlertDto extends baseDto {

    public _id: string = '';
    public expires: number = 0;
    public description: string = '';
    public instruction: string[] = [];
    public event: string = '';
    public urgency: string = '';
    public severity: string = '';
    public sender: string = '';
    public code: string = '';
    public createdAt: number = 0;
    
}

export default weatherAlertDto;