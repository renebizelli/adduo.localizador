interface Array<T> {
    max(): any;
    min(): any;
    contains(i: any): boolean;
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

Array.prototype.contains = function (i: any): boolean {
    return this.indexOf(i) > -1;
};