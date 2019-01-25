import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _name        : string;
    private _contributors = {};
    private _repositories: Map<string, Repository> = new Map();
    constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get reposUrl() {
        return `https://api.github.com/orgs/${this._name}/repos`;
    }

    get contributors(): Contributor[] {
        return Object.values(this._contributors);
    }

    private mergeContributors(contributor) {
        if (contributor.username in this._contributors) {
            contributor.contributions += this._contributors[contributor.username].contributions;
        }
        return contributor;
    }

    addContributor(contributor: Contributor) {
        this._contributors[contributor.username] = this.mergeContributors(contributor);
    }

    getContributor(username): Contributor {
        return this._contributors[username];
    }

    get repositories() {
        return this._repositories;
    }

    addRepository(repository: Repository) {
        this._repositories.set(repository.name, repository);
    }
}