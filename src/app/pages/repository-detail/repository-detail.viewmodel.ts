import { CardItemVM } from 'src/app/shared/presentation-components/business-card/card-item.viewmodel';
import { SortableCollection } from 'src/app/shared/presentation-components/sortable-table/sortable.collection';
import { Repository } from 'src/app/core/domain/repository/repository.model';

export class RepositoryDetailVM {
    private _card: CardItemVM;
    private _collection = new SortableCollection({active: 'contributions', direction: 'desc'});
    constructor(repository: Repository) {
      this._card = this.makeCard(repository);
      this._collection.items = repository.contributors;
    }

    private makeCard(repository) {
        const details = [
            'Total Contributions: ' + repository.total('contributions'),
            'Total Followers: ' + repository.total('followers'),
            'Total Repositories: ' + repository.total('repoCount'),
            'Total Gists: ' + repository.total('gists')
        ];
      return {title: repository.organization, subtitle: repository.name, details}
    }
  
    get card(): CardItemVM {
      return this._card;
    }
  
    get collection(): SortableCollection {
      return this._collection;
    }
  }