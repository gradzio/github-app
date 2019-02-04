export class ContributorDetail {
    private _username;
    private _followers;
    private _repoCount;
    private _gists;

    constructor(username: string, followers: number, repoCount: number, gists: number) {
        this._username = username;
        this._followers = followers;
        this._repoCount = repoCount;
        this._gists = gists;
    }

    get username() {
        return this._username;
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