import { expect } from 'chai';
import sinon from 'sinon';
import update from '../widget/update';
import * as load from '../widget/load';

describe('widget update', () => {
  afterEach(() => {
    if ('restore' in Math.random) {
      Math.random.restore(); // reset the Math.random fixture
    }
  });

  describe('randomly successful', () => {
    const widgets = [{}, { id: 2, color: 'Red' }];

    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.3);
    });

    afterEach(() => {
      if ('restore' in load.default) {
        load.default.restore();
      }
    });

    it('does not accept green widgets', async () => {
      sinon.stub(load, 'default').resolves(widgets);
      const clock = sinon.useFakeTimers();
      try {
        await Promise.all([update({ session: {}, body: { color: 'Green' } }), clock.tick(1500), clock.restore()]);
      } catch (err) {
        expect(err.color).to.equal('We do not accept green widgets');
      }
    });

    it('fails to load widgets', async () => {
      sinon.stub(load, 'default').rejects(new Error('Widget fail to load.'));
      const clock = sinon.useFakeTimers();
      try {
        await Promise.all([update({ session: {}, body: { color: 'Blue' } }), clock.tick(1500), clock.restore()]);
      } catch (err) {
        expect(err.message).to.equal('Widget fail to load.');
      }
    });

    it('updates a widget', async () => {
      sinon.stub(load, 'default').resolves(widgets);
      const clock = sinon.useFakeTimers();
      const widget = { id: 2, color: 'Blue' };
      const [res] = await Promise.all([update({ session: {}, body: widget }), clock.tick(1500), clock.restore()]);
      expect(res).to.deep.equal(widget);
      expect(widgets[1]).to.deep.equal(widget);
    });
  });

  describe('randomly unsuccessful', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.1);
    });

    it('rejects the call in 20% of the time', async () => {
      try {
        update();
      } catch (err) {
        expect(err).to.equal('Oh no! Widget save fails 20% of the time. Try again.');
      }
    });
  });
});
