const parseEnvRules = [
  [value => value === "true" || value === "false", value => (value === "true")],
  [value => /^\d+$/.test(value), value => Number(value)],
  [value => value === "null", () => null],
  [value => value === "undefined", () => undefined],
];
export function parseEnv(env) {
  const envs = JSON.parse(JSON.stringify(env || {}));
  Object.entries(env).forEach(([key, value]) => {
    const rule = parseEnvRules.find(([rule]) => rule(value));
    if (rule)
      envs[key] = rule[1](value);
  });
  return envs;
}
