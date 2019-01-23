import { Organization } from "./organization.model";
import { Contributor } from '../contributor/contributor.model';

describe('Organization', () => {
    let organization;

    beforeEach(() => {
        organization = new Organization('org');
    });

    it('should make simple organization', () => {
        expect(organization.name).toEqual('org');
    });

    it('should have no contributors', () => {
        expect(organization.contributors.size).toEqual(0);
    });

    it('should have single contributor', () => {
        organization.addContributor(new Contributor(1, 'username'));
        expect(organization.contributors.size).toEqual(1);
    });

    it('should get contributor', () => {
        organization.addContributor(new Contributor(1, 'username'));
        const contributor = organization.getContributor('username');
        expect(contributor.id).toEqual(1);
        expect(contributor.username).toEqual('username');
    });

    it('should not duplicate same contributors', () => {
        organization.addContributor(new Contributor(1, 'username1'));
        organization.addContributor(new Contributor(2, 'username2'));
        organization.addContributor(new Contributor(1, 'username1'));
        expect(organization.contributors.size).toEqual(2);
    });
});