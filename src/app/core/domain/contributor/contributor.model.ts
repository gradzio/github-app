import { Repository } from '../repository/repository.model';

export interface ContributorStats {
    repoCount     : number;
    followers     : number;
    gists         : number;
}

export class Contributor {
    private _id            : number;
    private _username      : string;
    private _contributions : number;
    private _followers     : number;
    private _gists         : number;
    private _repoCount     : number = 0;
    private _repositories = new Array<Repository>();
    constructor(id, username, contributions) {
        this._id = id;
        this._username = username;
        this._contributions = contributions;
    }

    merge(contributorDetail: ContributorStats) {
        this._repoCount = contributorDetail.repoCount;
        this._gists = contributorDetail.gists;
        this._followers = contributorDetail.followers;
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get avatarUrl() {
        return `https://avatars3.githubusercontent.com/u/${this._id}?v=4`;
    }

    set contributions(contributions: number) {
        if (contributions < 0) {
            throw new Error('Negative number is not allowed');
        }
        this._contributions = contributions;
    }

    incrementContributions(contributions) {
        this._contributions += contributions;
    }

    get contributions() {
        return this._contributions;
    }

    set followers(followers: number) {
        if (followers < 0) {
            throw new Error('Negative number is not allowed');
        }
        this._followers = followers;
    }

    get followers() {
        return this._followers;
    }

    set repoCount(repoCount: number) {
        this._repoCount = repoCount;
    }

    get repoCount() {
        return this._repoCount;
    }

    addRepository(repository: Repository) {
        this._repositories.push(repository);
        this.incrementRepoCount(1);
    }

    incrementRepoCount(repoCount: number) {
        this._repoCount += repoCount;
    }

    get repositories() {
        return this._repositories;
    }

    set gists(gists: number) {
        if (gists < 0) {
            throw new Error('Negative number is not allowed');
        }
        this._gists = gists;
    }

    get gists() {
        return this._gists;
    }
}