import cloneDeep from "lodash/cloneDeep";

function parseEnv(env: any): ImportMetaEnv {
  if (env == null)
    return {} as ImportMetaEnv;
  const envs = cloneDeep(env);

  Object.entries(envs).forEach(([key, value]) => {
    if (value === "true" || value === "false")
      envs[key] = value === "true";
    else if (/^\d+$/.test(value as string))
      envs[key] = Number(value);
    else if (value === "null")
      envs[key] = null;
    else if (value === "undefined")
      envs[key] = undefined;
  });
  return envs;
}

export const env: ImportMetaEnv = parseEnv(import.meta.env);

export const isDev = import.meta.env.DEV;
