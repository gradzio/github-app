import { of } from 'rxjs';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';

export class OrganizationServiceStub {
    getOrganizationContributors(organization: Organization) {
        return of(organization);
    }
}