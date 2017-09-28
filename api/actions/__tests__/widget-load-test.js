import { expect } from 'chai';
import sinon from 'sinon';
import load from '../widget/load';

describe('widget load', () => {
  afterEach(() => {
    if ('restore' in Math.random) {
      Math.random.restore(); // reset the Math.random fixture
    }
  });

  describe('successful', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.4);
    });

    it('uses the widgets from the session', async () => {
      const widgets = await load({ session: { user: {}, widgets: ['a', 'b', 'c'] } }, undefined);
      expect(widgets.length).to.equal(3);
    });

    it('initializes the widgets ', async () => {
      const widgets = await load({ session: { user: {} } }, undefined);
      expect(widgets.length).to.equal(4);
      expect(widgets[0].color).to.equal('Red');
    });
  });

  describe('unsuccessful', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.2);
    });

    it('rejects the call', async () => {
      try {
        await load({ session: { user: {} } }, undefined);
      } catch (err) {
        expect(err).to.equal('Widget load fails 33% of the time. You were unlucky.');
      }
    });
  });
});
