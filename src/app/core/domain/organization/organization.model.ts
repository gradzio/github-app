import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _name        : string;
    private _contributors: Map<string, Contributor> = new Map();
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

    get contributors() {
        return this._contributors;
    }

    addContributor(contributor: Contributor) {
        this._contributors.set(contributor.username, contributor);
    }

    getContributor(username): Contributor {
        return this._contributors.get(username);
    }

    get repositories() {
        return this._repositories;
    }

    addRepository(repository: Repository) {
        this._repositories.set(repository.name, repository);
    }
}