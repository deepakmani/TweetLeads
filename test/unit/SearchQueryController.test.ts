import { expect } from 'chai';
import { SearchQueriesController } from '../../dist/controllers/searchQueriesController';


describe("SearchQueriesController" () => {
    it('can be initialized without an initializer', () => {
        let search_query_controller = new SearchQueriesController();
        
        expect(s.size()).to.equal(0);
    });
});