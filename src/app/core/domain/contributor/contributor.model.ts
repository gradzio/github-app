import { Repository } from '../repository/repository.model';

export class Contributor {
    private _id            : number;
    private _username      : string;
    private _contributions : number;
    private _followers     : number;
    private _gists         : number;
    private _repoCount     : number;
    private _repositories = new Array<Repository>();
    private _isLoaded = false;
    constructor(id, username, contributions) {
        this._id = id;
        this._username = username;
        this._contributions = contributions;
    }

    clone() {
        const clone = new Contributor(this._id, this._username, this._contributions);
        clone.mergeContributor(this);
        return clone;
    }

    isEqual(contributor: Contributor): boolean {
        return contributor && this._username == contributor.username;
    }

    merge(contributorDetail) {
        this._repoCount = contributorDetail.public_repos;
        this._gists = contributorDetail.public_gists;
        this._followers = contributorDetail.followers;
    }

    mergeContributor(contributor: Contributor) {
        if (!contributor.isNotComplete) {
            this._repoCount = contributor.repoCount;
            this._followers = contributor.followers;
            this._gists = contributor.gists;
        }
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get avatarUrl() {
        return `https://avatars3.githubusercontent.com/u/${this._id}?v=4&s=48`;
    }

    get isNotComplete() {
        return this._followers == null || this._gists == null || this._repoCount == null;
    }

    set contributions(contributions: number) {
        if (contributions < 0) {
            throw new Error('Negative number is not allowed');
        }
        this._contributions = contributions;
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

    addRepositories(repositories: Repository[]) {
        repositories.forEach(repository => this.addRepository(repository));
    }

    addRepository(repository: Repository) {
        this._repositories.push(repository);
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

    markLoaded() {
        this._isLoaded = true;
    }

    get isLoaded() {
        return this._isLoaded;
    }
}