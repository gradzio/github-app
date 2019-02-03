import { CardItemVM } from 'src/app/shared/presentation-components/business-card/card-item.viewmodel';
import { SortableCollection } from 'src/app/shared/presentation-components/simple-list/sortable.collection';
import { Repository } from 'src/app/core/domain/repository/repository.model';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

export class RepositoryDetailVM {
    private _card: CardItemVM;
    private _collection = new SortableCollection<Contributor>({active: 'contributions', direction: 'desc'});
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
  
    get collection(): SortableCollection<Contributor> {
      return this._collection;
    }
  }