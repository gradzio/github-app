import { Contributor } from '../contributor/contributor.model';
import { ContributorDetail } from '../contributor-details/contributor-detail.model';
import { Organization } from '../organization/organization.model';

export class Repository {
    private _organization : string;
    private _name         : string;
    private _contributors = {};
    private _contributorsWithDetails = {};
    constructor(fullName: string) {
        const split = fullName.split('/');
        this._organization = split[0];
        this._name = split[1];
    }

    isEqual(repo?: Repository): boolean {
        return repo && this.fullName == repo.fullName;
    }

    isPartOfOrganization(organization: Organization): boolean {
        return this.organization === organization.name;
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

    mergeContributorDetails(contributorDetails) {
        this.contributors
            .filter(contributor => contributorDetails[contributor.username])
            .forEach(contributor => {
                this._contributors[contributor.username].merge(contributorDetails[contributor.username]);
                this._contributorsWithDetails[contributor.username] = contributor;
            });
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

    get contributorsWithoutDetailNames(): string[] {
        return Object.keys(this._contributors).filter(contributorName => Object.keys(this._contributorsWithDetails).indexOf(contributorName));
    }

    get contributorDetailsLoadedCount() {
        return Object.values(this._contributorsWithDetails).length;
    }

    get hasLoadedAllDetails(): boolean {
        return this.contributorDetailsLoadedCount > 0 && this.contributorDetailsLoadedCount == this.contributors.length;
    }
}
