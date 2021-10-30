/**
 * 用时约 50 分钟
 */

class Bus {
  constructor() {
    this.originalLog = console.log;
    this.eventMap = {};
    this.callStack = 0;
    this.triggerEvent = null;
    this.triggerCount = 0;
    this.maxCallStackSize = 10;
  }

  log(argv0, ...argv) {
    this.originalLog('--'.repeat(this.callStack) + argv0, ...argv);
  }

  listen(eventName, callback) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }
    this.eventMap[eventName].push(callback);
  }

  trigger(eventName, ...argv) {
    console.log = this.log.bind(this);
    console.log('event: ', eventName);
    this.callStack += 1;
    if (eventName !== this.triggerEvent) {
      this.triggerEvent = eventName;
      this.triggerCount = 1;
    } else {
      this.triggerCount += 1;
      if (this.triggerCount >= this.maxCallStackSize) {
        throw new Error('Maximum call stack size exceeded: ' + this.triggerCount);
      }
    }
    if (this.eventMap[eventName]) {
      const fn = this.eventMap[eventName].reduce((acc, cb) => {
        if (cb[Symbol.toStringTag] === 'AsyncFunction') {
          return async (...argv) => {
            if (acc[Symbol.toStringTag] === 'AsyncFunction') {
              await acc.call(this, argv);
            } else {
              acc.call(this, argv);
            }
            console.log('callback: ' + cb.name);
            this.callStack += 1;
            await cb.call(this, argv);
            this.callStack -= 1;
          };
        } else {
          return (...argv) => {
            if (acc[Symbol.toStringTag] === 'AsyncFunction') {
              acc.call(this, argv).then(() => {
                console.log('callback: ' + cb.name);
                this.callStack += 1;
                cb.call(this, argv);
                this.callStack -= 1;
              });
            } else {
              acc.call(this, argv);
              console.log('callback: ' + cb.name);
              this.callStack += 1;
              cb.call(this, argv);
              this.callStack -= 1;
            }
          };
        }
      }, () => {});
      fn.call(this, argv);
      // this.eventMap[eventName].forEach((cb) => {
      //   cb.call(this, argv);
      // });
    }
    if (eventName === this.triggerEvent) {
      this.triggerCount -= 1;
    }
    this.callStack -= 1;
  }

  unlisten(eventName, callback) {
    if (this.eventMap[eventName]) {
      this.eventMap[eventName] = this.eventMap[eventName].filter((cb) => cb !== callback);
    }
  }
}

const bus = new Bus();
bus.listen('testEvent', function callback1() {
  // do something
  this.trigger('testEvent2');
})
bus.listen('testEvent2', function callback2() {
  // do something
})
bus.trigger('testEvent');

// test maximum call stack size
bus.listen('testEvent3', function callback3() {
  bus.trigger('testEvent3');
});
bus.trigger('testEvent3');