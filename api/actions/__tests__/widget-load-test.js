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
      const clock = sinon.useFakeTimers();
      const [widgets] = await Promise.all([
        load({ session: { user: {}, widgets: ['a', 'b', 'c'] } }, undefined),
        clock.tick(1000),
        clock.restore()
      ]);
      expect(widgets.length).to.equal(3);
    });

    it('initializes the widgets ', async () => {
      const clock = sinon.useFakeTimers();
      const [widgets] = await Promise.all([
        load({ session: { user: {} } }, undefined),
        clock.tick(1000),
        clock.restore()
      ]);
      expect(widgets.length).to.equal(4);
      expect(widgets[0].color).to.equal('Red');
    });
  });

  describe('unsuccessful', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.2);
    });

    it('rejects the call', async () => {
      const clock = sinon.useFakeTimers();
      try {
        await Promise.all([load({ session: { user: {} } }, undefined), clock.tick(1000), clock.restore()]);
      } catch (err) {
        expect(err).to.equal('Widget load fails 33% of the time. You were unlucky.');
      }
    });
  });
});
