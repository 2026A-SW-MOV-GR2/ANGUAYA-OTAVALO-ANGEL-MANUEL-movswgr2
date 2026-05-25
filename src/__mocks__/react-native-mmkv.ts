let store: Record<string, string> = {};

const createMMKV = () => ({
  set: (k: string, v: string) => { store[k] = v; },
  getString: (k: string) => store[k] ?? undefined,
  delete: (k: string) => { delete store[k]; },
  _clear: () => { store = {}; },
});

export { createMMKV };