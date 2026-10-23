// One clock owns selection and progress so pauses never leave orphaned timers.
export function createLensCycle({ duration = 4500, onChange, now = () => performance.now(), schedule = setTimeout, cancel = clearTimeout }) {
  let index = 0, remaining = duration, started = 0, timer, running = false
  const emit = () => onChange({ index, remaining, duration, running })
  const clear = () => { if (timer !== undefined) cancel(timer); timer = undefined }
  const arm = () => {
    started = now()
    timer = schedule(() => { index = (index + 1) % 3; remaining = duration; arm(); emit() }, remaining)
  }
  return {
    resume(grace = 0) {
      if (running) return
      remaining = Math.max(remaining, grace); running = true; arm(); emit()
    },
    pause() {
      if (!running) return
      remaining = Math.max(0, remaining - (now() - started)); clear(); running = false; emit()
    },
    select(next) {
      clear(); index = next; remaining = duration
      if (running) arm()
      emit()
    },
    destroy() { clear(); running = false },
  }
}
