export class ContributorDetail {
    private _followers;
    private _repoCount;
    private _gists;

    constructor(followers: number, repoCount: number, gists: number) {
        this._followers = followers;
        this._repoCount = repoCount;
        this._gists = gists;
    }

    get followers() {
        return this._followers;
    }

    get repoCount() {
        return this._repoCount;
    }

    get gists() {
        return this._gists;
    }
}