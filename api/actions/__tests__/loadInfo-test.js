import { expect } from 'chai';
import sinon from 'sinon';
import loadInfo from '../loadInfo';

let clock;

describe('loadInfo', () => {
  it('loads the current date', () => {
    const now = Date.now();
    clock = sinon.useFakeTimers({ now });

    expect(loadInfo()).to.deep.equal({ time: now, message: 'This came from the api server' });

    clock.restore();
  });
});
