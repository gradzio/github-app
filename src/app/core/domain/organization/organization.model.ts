import { Contributor, ContributorStats } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _name        : string;
    private _contributors = {};
    private _repositories = {};
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

    private mergeContributors(contributor: Contributor) {
        if (this.hasContributor(contributor.username)) {
            const thisContributor = this.getContributor(contributor.username)
            thisContributor.incrementContributions(contributor.contributions);
            return thisContributor;
        }
        return contributor;
    }

    private firstOrCreateContributor(contributorData) {
        return this.hasContributor(contributorData.login)
        ? this.getContributor(contributorData.login)
        : new Contributor(contributorData.id, contributorData.login, 0);
    }

    addContributor(contributorData) {
        const orgContributor = this.firstOrCreateContributor(contributorData);
        orgContributor.incrementContributions(contributorData.contributions);
        orgContributor.incrementRepoCount(1);
        this._contributors[orgContributor.username] = orgContributor;
    }
    
    updateContributor(contributorUsername: string, contributorDetail: ContributorStats) {
        const contributor = this._contributors[contributorUsername];
        contributor.merge(contributorDetail);
        this._contributors[contributorUsername] = contributor;
    }

    hasContributor(username: string): boolean {
        return username in this._contributors;
    }

    getContributor(username: string): Contributor | null {
        return this._contributors[username];
    }

    get repositories() {
        return Object.values(this._repositories);
    }

    addRepository(repository: Repository) {
        this._repositories[repository.name] = repository;
    }
}