export default class CustomEvent {
  eventMap = new Map<string, Array<(...args: any[]) => void>>();

  on(eventName: string, callback: (...args: any[]) => void) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
    }
    this.eventMap.get(eventName)?.push(callback);
  }

  off(eventName: string, callback?: (...args: any[]) => void) {
    if (!this.eventMap.has(eventName)) return;
    if (!callback) {
      this.eventMap.delete(eventName);
      return;
    }
    const index = this.eventMap.get(eventName)?.indexOf(callback);
    if (index && index !== -1) {
      this.eventMap.get(eventName)?.splice(index, 1);
    }
  }

  offAll() {
    this.eventMap.forEach((callbacks, eventName) => {
      this.off(eventName);
    });
  }

  once(eventName: string, callback: (...args: any[]) => void) {
    this.on(eventName, (...args) => {
      this.off(eventName, callback);
      callback(...args);
    });
  }

  emit(eventName: string, ...args: any[]) {
    if (!this.eventMap.has(eventName)) {
      return;
    }
    this.eventMap.get(eventName)?.forEach((callback) => {
      callback(...args);
    });
  }
}
