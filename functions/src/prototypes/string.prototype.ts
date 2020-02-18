interface String {
    stringFormat(params: any[]): string;
    naming(name: string): string;
    toObjectId(id:string) : any;
}



String.prototype.stringFormat = function (params) {

    let result = this.toString()

    for (let i = 0; i < params.length; i++) {
        var reg = new RegExp('\\{' + i + '\\}', 'g')
        result = result.replace(reg, params[i])
    }

    return result
}

String.prototype.naming = function (name) {
    let result = this.toString()
    var reg = new RegExp('\\{name\\}', 'g')
    return result.replace(reg, name)
}
