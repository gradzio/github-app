import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

export class Organization {
    private _id : number;
    private _name        : string;
    private _contributors = {};
    private _contributorsWithDetails = {};
    private _repositories = {};
    private _reposWithContributors = {};
    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    // TODO: Move to VM
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
        // const debugUsername = 'gradzio';
        this.repositories.forEach(repository => {
            repository.contributors.forEach(contributor => {
                // if (contributor.username == debugUsername) {
                    // console.log(repository.fullName, contributor.contributions);
                // }
                let contributions = 0;
                if (contributionMap[contributor.username]) {
                    contributions = <number>contributionMap[contributor.username];
                }
                contributionMap[contributor.username] = contributions + <number>contributor.contributions;
                contributors[contributor.username] = contributor;
            });
        });
        // console.log(contributionMap[debugUsername], this.repositories.length);
        return Object.values(contributors).map((contributor: Contributor) => {
            const clone = contributor.clone();
            clone.contributions = contributionMap[contributor.username];
            return clone;
        });
    }

    get contributorsWithoutDetailNames(): string[] {
        return this.repoContributors.filter(contributor => contributor.isNotComplete).map(contributor => contributor.username);
    }

    // private mergeContributors(contributor: Contributor) {
    //     if (this.hasContributor(contributor.username)) {
    //         const thisContributor = this.getContributor(contributor.username)
    //         // thisContributor.incrementContributions(contributor.contributions);
    //         return thisContributor;
    //     }
    //     return contributor;
    // }

    mergeContributorDetails(contributorDetails) {
        this.repositories.forEach((repository: Repository) => {
            repository.mergeContributorDetails(contributorDetails);
        });
        // this.repoContributors.forEach(contributor => {
        //     const contributorDetail = contributorDetails[contributor.username];
        //     if (contributorDetail) {
        //         this.updateContributor(contributor.username, contributorDetail);
        //         this._contributorsWithDetails[contributor.username] = contributor;
        //     }
        // });
    }

    // private firstOrCreateContributor(contributorData) {
    //     return this.hasContributor(contributorData.login)
    //     ? this.getContributor(contributorData.login)
    //     : new Contributor(contributorData.id, contributorData.login, 0);
    // }

    addRepoContributors(repository: Repository) {
        if (repository.organization === this._name) {
            repository.contributors.forEach(contributor => {
                const orgContributor = this.hasContributor(contributor.username) ? this.getContributor(contributor.username) : contributor;
                // orgContributor.incrementContributions(contributor.contributions);
                this._contributors[orgContributor.username] = orgContributor;
            });
            this._reposWithContributors[repository.fullName] = repository;
        }
    }

    // addContributor(contributorData) {
    //     const orgContributor = this.firstOrCreateContributor(contributorData);
    //     // orgContributor.incrementContributions(contributorData.contributions);
    //     this._contributors[orgContributor.username] = orgContributor;
    // }
    
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
        return this.repositories.filter((repository: Repository) => repository.isLoaded).length;
    }

    get hasLoadedAllRepos(): boolean {
        return this.reposLoadedCount > 0 && this.reposLoadedCount == this.repositories.length;
    }

    get contributorDetailsLoadedCount(): number {
        return Object.values(this._contributorsWithDetails).length;
    }

    get hasLoadedAllDetails(): boolean {
        return this.contributorDetailsLoadedCount > 0 && this.contributorDetailsLoadedCount == this.repoContributors.length;
    }

    addRepository(repository: Repository) {
        this._repositories[repository.name] = repository;
    }
}