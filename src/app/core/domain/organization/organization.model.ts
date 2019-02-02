import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _name        : string;
    private _contributors = {};
    private _contributorsWithDetails = {};
    private _repositories = {};
    private _reposWithContributors = {};
    constructor(name: string) {
        this._name = name;
    }

    isEqual(organization: Organization): boolean {
        return this._name == organization.name;
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
    get contributorNames(): string[] {
        return Object.keys(this._contributors);
    }

    private mergeContributors(contributor: Contributor) {
        if (this.hasContributor(contributor.username)) {
            const thisContributor = this.getContributor(contributor.username)
            thisContributor.incrementContributions(contributor.contributions);
            return thisContributor;
        }
        return contributor;
    }

    mergeContributorDetails(contributorDetails) {
        this.contributors.forEach(contributor => {
            const contributorDetail = contributorDetails[contributor.username];
            if (contributorDetail) {
                this.updateContributor(contributor.username, contributorDetail);
                this._contributorsWithDetails[contributor.username] = contributor;
            }
        });
    }

    private firstOrCreateContributor(contributorData) {
        return this.hasContributor(contributorData.login)
        ? this.getContributor(contributorData.login)
        : new Contributor(contributorData.id, contributorData.login, 0);
    }

    addRepoContributors(repository: Repository) {
        if (repository.organization === this._name) {
            repository.contributors.forEach(contributor => {
                const orgContributor = this.hasContributor(contributor.username) ? this.getContributor(contributor.username) : contributor;
                orgContributor.incrementContributions(contributor.contributions);
                this._contributors[orgContributor.username] = orgContributor;
            });
            this._reposWithContributors[repository.fullName] = repository;
        }
    }

    addContributor(contributorData) {
        const orgContributor = this.firstOrCreateContributor(contributorData);
        orgContributor.incrementContributions(contributorData.contributions);
        this._contributors[orgContributor.username] = orgContributor;
    }
    
    updateContributor(contributorUsername: string, contributorDetail) {
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

    get repositories(): Repository[] {
        return Object.values(this._repositories);
    }

    get reposLoadedCount(): number {
        return Object.values(this._reposWithContributors).length;
    }

    get hasLoadedAllrepos(): boolean {
        return this.reposLoadedCount > 0 && this.reposLoadedCount == this.repositories.length;
    }

    get contributorDetailsLoadedCount(): number {
        return Object.values(this._contributorsWithDetails).length;
    }

    get hasLoadedAlldetails(): boolean {
        return this.contributorDetailsLoadedCount > 0 && this.contributorDetailsLoadedCount == this.contributors.length;
    }

    addRepository(repository: Repository) {
        this._repositories[repository.name] = repository;
    }
}