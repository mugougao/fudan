const parseEnvRules: [(value: string) => boolean, (value: string) => boolean | number | undefined | null][] = [
  [(value: string) => value === "true" || value === "false", (value: string) => (value === "true")],
  [(value: string) => /^\d+$/.test(value), (value: string) => Number(value)],
  [(value: string) => value === "null", () => null],
  [(value: string) => value === "undefined", () => undefined],
];

export function parseEnv(env: Record<string, any>): IViteEnv {
  const envs: any = JSON.parse(JSON.stringify(env || {}));

  Object.entries(env).forEach(([key, value]) => {
    const rule = parseEnvRules.find(([rule]) => rule(value));
    if (rule)
      envs[key] = rule[1](value);
  });
  return envs;
}
