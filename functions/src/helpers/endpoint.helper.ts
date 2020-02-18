class endpointHelper {

    private _endpointPrefix: string = '*';
    private _endpointVersion: string = 'api/v1';

    public createPublic(path: string): string {
        return this.createEndpoint('public', path);
    }

    public createRestricted(path: string): string {
        return this.createEndpoint('restricted', path);
    }

    public createPrivate(path: string): string {
        return this.createEndpoint('private', path);
    }

    private createEndpoint(type: string, path: string): string {
        return this._endpointPrefix + '/' + this._endpointVersion  + '/' +  type  + '/' +  path;
    }

}

export default endpointHelper;