import { CardItemVM } from 'src/app/shared/presentation-components/business-card/card-item.viewmodel';
import { SortableCollection } from 'src/app/shared/presentation-components/sortable-table/sortable.collection';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

export class ContributorDetailVM {
    private _card: CardItemVM;
    private _collection = new SortableCollection({active: 'name', direction: 'asc'});
    constructor(contributor: Contributor) {
      this._card = this.makeCard(contributor);
      this._collection.items = contributor.repositories;
    }
  
    private makeCard(contributor: Contributor): CardItemVM {
      const details = [];
      if (contributor.followers) {
        details.push('Followers: ' + contributor.followers);
      }
      if (contributor.repoCount) {
        details.push('Repositories: ' + contributor.repoCount);
      }
      if (contributor.gists) {
        details.push('Gists: ' + contributor.gists);
      }
      return {image: contributor.avatarUrl, title: contributor.username, details}
    }
  
    get card(): CardItemVM {
      return this._card;
    }
  
    get collection(): SortableCollection {
      return this._collection;
    }
  }