import baseDto from './base.dto';
import monitoringMonitorableDto from './monitoring-monitorable.dto';

class monitoringSummaryDto extends baseDto {

    public monitorable: monitoringMonitorableDto[] = []
    public numberOfLicenses: number = 0;

}

export default monitoringSummaryDto;