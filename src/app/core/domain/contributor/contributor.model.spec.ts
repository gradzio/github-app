import { Contributor } from "./contributor.model";
import { Repository } from '../repository/repository.model';

describe('Contributor', () => {
    let contributor;

    beforeEach(() => {
        contributor = new Contributor(1, 'username');
    });

    it('should create default contributor', () => {
        expect(contributor.id).toEqual(1);
        expect(contributor.username).toEqual('username');
    });

    it('should throw error on negative contribution count', () => {
        expect(() => contributor.contributions = -1).toThrowError('Negative number is not allowed');
    });

    it('should set 0 contribution count', () => {
        contributor.contributions = 0;

        expect(contributor.contributions).toEqual(0);
    });

    it('should set contribution count', () => {
        contributor.contributions = 1;

        expect(contributor.contributions).toEqual(1);
    });

    it('should throw error on negative followers count', () => {
        expect(() => contributor.followers = -1).toThrowError('Negative number is not allowed');
    });

    it('should set 0 followers count', () => {
        contributor.followers = 0;

        expect(contributor.followers).toEqual(0);
    });

    it('should set followers count', () => {
        contributor.followers = 1;

        expect(contributor.followers).toEqual(1);
    });

    it('should have 0 repos by default', () => {
        expect(contributor.repositories.length).toEqual(0);
    });

    it('should set repo', () => {
        contributor.addRepository(new Repository(contributor.name + '/name'));

        expect(contributor.repositories.length).toEqual(1);
    });

    it('should throw error on negative gists count', () => {
        expect(() => contributor.gists = -1).toThrowError('Negative number is not allowed');
    });

    it('should set 0 gists count', () => {
        contributor.gists = 0;

        expect(contributor.gists).toEqual(0);
    });

    it('should set gists count', () => {
        contributor.gists = 1;

        expect(contributor.gists).toEqual(1);
    });
});