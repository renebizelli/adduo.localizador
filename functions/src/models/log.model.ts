interface logModel {
    userUid: String,
    function: String,
    params: any,
    body: any,
    idType: string,
    type: String,
    message: String,
    stack: String,
    headers: any,
    endpoint: logEndpointModel
}


interface logEndpointModel {
    url: String,
    method: String 
}

export default logModel;
