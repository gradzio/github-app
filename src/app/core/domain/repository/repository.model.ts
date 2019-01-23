import { Contributor } from '../contributor/contributor.model';

export class Repository {
    private _organization : string;
    private _name         : string;
    private _contributors : Contributor[] = [];
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

    addContributors(contributors) {
        this._contributors = this._contributors.concat(contributors);
    }

    get contributors() {
        return this._contributors;
    }

    get contributorsUrl() {
        return `https://api.github.com/repos/${this._organization}/${this._name}/stats/contributors`;
    }
}
