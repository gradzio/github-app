import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _id : number;
    private _name        : string;
    private _contributorsWithDetails = {};
    private _repositories = {};
    private _isLoaded = false;
    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    get avatarUrl() {
        return `https://avatars3.githubusercontent.com/u/${this._id}?s=48`;
    }

    isEqual(organization: Organization): boolean {
        return this._name == organization.name;
    }

    get name() {
        return this._name;
    }

    get repoContributors(): Contributor[] {
        const contributors = {};
        const contributionMap = {};
        this.repositories.forEach(repository => {
            repository.contributors.forEach(contributor => {
                let contributions = 0;
                if (contributionMap[contributor.username]) {
                    contributions = <number>contributionMap[contributor.username];
                }
                contributionMap[contributor.username] = contributions + <number>contributor.contributions;
                contributors[contributor.username] = contributor;
            });
        });
        return Object.values(contributors).map((contributor: Contributor) => {
            const clone = contributor.clone();
            clone.contributions = contributionMap[contributor.username];
            return clone;
        });
    }

    get contributorsWithoutDetailNames(): string[] {
        return this.repoContributors.filter(contributor => contributor.isNotComplete).map(contributor => contributor.username);
    }

    mergeContributorDetails(contributorDetails) {
        this.repositories.forEach((repository: Repository) => {
            repository.mergeContributorDetails(contributorDetails);
        });
    }

    get repositories(): Repository[] {
        return Object.values(this._repositories);
    }

    get reposLoadedCount(): number {
        return this.repositories.filter((repository: Repository) => repository.isLoaded).length;
    }

    get hasLoadedAllRepos(): boolean {
        return this.reposLoadedCount > 0 && this.reposLoadedCount == this.repositories.length;
    }

    get isLoaded() {
        return this._isLoaded;
    }

    addRepositories(repositories: Repository[]) {
        repositories.forEach(repository => this.addRepository(repository));
        this._isLoaded = true;
    }

    addRepository(repository: Repository) {
        this._repositories[repository.name] = repository;
    }

    mergeRepository(repository: Repository) {
        const orgRepo = this._repositories[repository.name]
        ? this._repositories[repository.name].merge(repository) : repository;

        this.addRepository(orgRepo);
    }
}