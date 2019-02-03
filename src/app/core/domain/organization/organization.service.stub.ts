import { of } from 'rxjs';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';

export class OrganizationServiceStub {
    getOrganizationContributors(organization: Organization) {
        // organization.addContributor(new Contributor(1, 'username1', 0));
        // organization.addContributor(new Contributor(2, 'username2', 0));
        return of(organization);
    }
}