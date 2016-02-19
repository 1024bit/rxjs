import * as Rx from '../../dist/cjs/Rx';
import {hot, cold, expectObservable, expectSubscriptions} from '../helpers/marble-testing';
import {it, asDiagram} from '../helpers/test-helper';

const Observable = Rx.Observable;

describe('Observable.prototype.ignoreElements', () => {
  asDiagram('ignoreElements')('should ignore all the elements of the source', () => {
    const source = hot('--a--b--c--d--|');
    const subs =       '^             !';
    const expected =   '--------------|';

    expectObservable(source.ignoreElements()).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should allow unsubscribing early and explicitly', () => {
    const source = hot('--a--b--c--d--|');
    const subs =       '^      !       ';
    const expected =   '--------       ';
    const unsub =      '       !       ';

    const result = source.ignoreElements();

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should allow unsubscribing early and explicitly', () => {
    const source = hot('--a--b--c--d--|');
    const subs =       '^      !       ';
    const expected =   '--------       ';
    const unsub =      '       !       ';

    const result = source
      .mergeMap((x: string) => Observable.of(x))
      .ignoreElements()
      .mergeMap((x: string) => Observable.of(x));

    expectObservable(result, unsub).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should propagate errors from the source', () => {
    const source = hot('--a--#');
    const subs =       '^    !';
    const expected =   '-----#';

    expectObservable(source.ignoreElements()).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should support Observable.empty', () => {
    const source = cold('|');
    const subs =        '(^!)';
    const expected =    '|';

    expectObservable(source.ignoreElements()).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should support Observable.never', () => {
    const source = cold('-');
    const subs =        '^';
    const expected =    '-';

    expectObservable(source.ignoreElements()).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });

  it('should support Observable.throw', () => {
    const source = cold('#');
    const subs =        '(^!)';
    const expected =    '#';

    expectObservable(source.ignoreElements()).toBe(expected);
    expectSubscriptions(source.subscriptions).toBe(subs);
  });
});
