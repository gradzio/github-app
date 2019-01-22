
export class Repository {
    private _organization : string;
    private _name         : string;
    constructor(fullName: string) {
        const split = fullName.split('/');
        this._organization = split[0];
        this._name = split[1];
    }

    get organization() {
        return this._organization
    }

    get name() {
        return this._name;
    }

    get contributorsUrl() {
        return `https://api.github.com/repos/${this._organization}/${this._name}/stats/contributors`;
    }
}
