import { Contributor } from '../contributor/contributor.model';

export class Repository {
    private _organization : string;
    private _name         : string;
    private _contributors = {};
    constructor(fullName: string) {
        const split = fullName.split('/');
        this._organization = split[0];
        this._name = split[1];
    }

    isEqual(repo: Repository): boolean {
        return this.fullName == repo.fullName;
    }

    get organization() {
        return this._organization
    }

    get name() {
        return this._name;
    }

    get fullName() {
        return this._organization + '/' + this._name;
    }

    addContributors(contributors) {
        contributors.forEach(contributor => this.addContributor(contributor));
    }

    addContributor(contributor: Contributor) {
        this._contributors[contributor.username] = contributor;
    }

    get contributors(): Contributor[] {
        return Object.values(this._contributors);
    }

    get contributorsUrl() {
        return `https://api.github.com/repos/${this._organization}/${this._name}/stats/contributors`;
    }
}
