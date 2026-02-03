let task: (() => void)[] = [];

// 设置任务
export function setTask(t: () => void) {
  task.push(t);
}

// 关闭任务
export function clearTask() {
  task = [];
}

// 运行任务
export function runTask() {
  if (!task.length) return;
  while (task.length) {
    task.shift()?.();
  }
}

export function removeTask(t: () => void) {
  const index = task.findIndex(_t => _t === t);
  if (index !== -1)
    task.splice(index, 1);
}
