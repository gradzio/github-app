export interface AvatarItem extends SimpleItem {
    avatarUrl: string;
}

export interface SimpleItem {
    name: string;
    description?: string;
    count?: number;
}

export class GithubVM implements AvatarItem {
    avatarUrl: string;
    name: string;
    constructor(item) {
        this.avatarUrl = `https://avatars3.githubusercontent.com/u/${item.id}?s=48`;
        this.name = item.name;
    }
}
