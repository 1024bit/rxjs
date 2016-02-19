import * as Rx from '../dist/cjs/Rx';
import {expectObservable} from './helpers/marble-testing';
import {it, DoneSignature} from './helpers/test-helper';

const Notification = Rx.Notification;

describe('Notification', () => {
  it('should exist', () => {
    expect(Notification).toBeDefined();
    expect(typeof Notification).toBe('function');
  });

  describe('createNext', () => {
    it('should return a Notification', () => {
      const n = Notification.createNext('test');
      expect(n instanceof Notification).toBe(true);
      expect(n.value).toBe('test');
      expect(n.kind).toBe('N');
      expect(typeof n.exception).toBe('undefined');
      expect(n.hasValue).toBe(true);
    });
  });

  describe('createError', () => {
    it('should return a Notification', () => {
      const n = Notification.createError('test');
      expect(n instanceof Notification).toBe(true);
      expect(typeof n.value).toBe('undefined');
      expect(n.kind).toBe('E');
      expect(n.exception).toBe('test');
      expect(n.hasValue).toBe(false);
    });
  });

  describe('createComplete', () => {
    it('should return a Notification', () => {
      const n = Notification.createComplete();
      expect(n instanceof Notification).toBe(true);
      expect(typeof n.value).toBe('undefined');
      expect(n.kind).toBe('C');
      expect(typeof n.exception).toBe('undefined');
      expect(n.hasValue).toBe(false);
    });
  });

  describe('toObservable', () => {
    it('should create observable from a next Notification', () => {
      const value = 'a';
      const next = Notification.createNext(value);
      expectObservable(next.toObservable()).toBe('(a|)');
    });

    it('should create observable from a complete Notification', () => {
      const complete = Notification.createComplete();
      expectObservable(complete.toObservable()).toBe('|');
    });

    it('should create observable from a error Notification', () => {
      const error = Notification.createError('error');
      expectObservable(error.toObservable()).toBe('#');
    });
  });

  describe('static reference', () => {
    it('should create new next Notification with value', () => {
      const value = 'a';
      const first = Notification.createNext(value);
      const second = Notification.createNext(value);

      expect(first).not.toBe(second);
    });

    it('should create new error Notification', () => {
      const first = Notification.createError();
      const second = Notification.createError();

      expect(first).not.toBe(second);
    });

    it('should return static next Notification reference without value', () => {
      const first = Notification.createNext(undefined);
      const second = Notification.createNext(undefined);

      expect(first).toBe(second);
    });

    it('should return static complete Notification reference', () => {
      const first = Notification.createComplete();
      const second = Notification.createComplete();

      expect(first).toBe(second);
    });
  });

  describe('do', () => {
    it('should invoke on next', () => {
      const n = Notification.createNext('a');
      let invoked = false;
      n.do((x: string) => {
        invoked = true;
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        throw 'should not be called';
      });

      expect(invoked).toBe(true);
    });

    it('should invoke on error', () => {
      const n = Notification.createError();
      let invoked = false;
      n.do((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        invoked = true;
      }, () => {
        throw 'should not be called';
      });

      expect(invoked).toBe(true);
    });

    it('should invoke on complete', () => {
      const n = Notification.createComplete();
      let invoked = false;
      n.do((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        invoked = true;
      });

      expect(invoked).toBe(true);
    });
  });

  describe('accept', () => {
    it('should accept observer for next Notification', () => {
      const value = 'a';
      let observed = false;
      const n = Notification.createNext(value);
      const observer = Rx.Subscriber.create((x: string) => {
        expect(x).toBe(value);
        observed = true;
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        throw 'should not be called';
      });

      n.accept(observer);
      expect(observed).toBe(true);
    });

    it('should accept observer for error Notification', () => {
      let observed = false;
      const n = Notification.createError();
      const observer = Rx.Subscriber.create((x: string) => {
        throw 'should not be called';
      }, (err: any) => {
        observed = true;
      }, () => {
        throw 'should not be called';
      });

      n.accept(observer);
      expect(observed).toBe(true);
    });

    it('should accept observer for complete Notification', () => {
      let observed = false;
      const n = Notification.createComplete();
      const observer = Rx.Subscriber.create((x: string) => {
        throw 'should not be called';
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        observed = true;
      });

      n.accept(observer);
      expect(observed).toBe(true);
    });

    it('should accept function for next Notification', () => {
      const value = 'a';
      let observed = false;
      const n = Notification.createNext(value);

      n.accept((x: string) => {
        expect(x).toBe(value);
        observed = true;
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        throw 'should not be called';
      });
      expect(observed).toBe(true);
    });

    it('should accept function for error Notification', () => {
      let observed = false;
      const error = 'error';
      const n = Notification.createError(error);

      n.accept((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        expect(err).toBe(error);
        observed = true;
      }, () => {
        throw 'should not be called';
      });
      expect(observed).toBe(true);
    });

    it('should accept function for complete Notification', () => {
      let observed = false;
      const n = Notification.createComplete();

      n.accept((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        observed = true;
      });
      expect(observed).toBe(true);
    });
  });

  describe('observe', () => {
    it('should observe for next Notification', () => {
      const value = 'a';
      let observed = false;
      const n = Notification.createNext(value);
      const observer = Rx.Subscriber.create((x: string) => {
        expect(x).toBe(value);
        observed = true;
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        throw 'should not be called';
      });

      n.observe(observer);
      expect(observed).toBe(true);
    });

    it('should observe for error Notification', () => {
      let observed = false;
      const n = Notification.createError();
      const observer = Rx.Subscriber.create((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        observed = true;
      }, () => {
        throw 'should not be called';
      });

      n.observe(observer);
      expect(observed).toBe(true);
    });

    it('should observe for complete Notification', () => {
      let observed = false;
      const n = Notification.createComplete();
      const observer = Rx.Subscriber.create((x: any) => {
        throw 'should not be called';
      }, (err: any) => {
        throw 'should not be called';
      }, () => {
        observed = true;
      });

      n.observe(observer);
      expect(observed).toBe(true);
    });
  });
});
