export default function waitFor(condition: () => boolean) {
  return new Promise<void>((resolve) => {
    const checkCondition = () => {
      if (condition()) {
        resolve();
      }
      else {
        setTimeout(checkCondition, 100);
      }
    };
    checkCondition();
  });
}
