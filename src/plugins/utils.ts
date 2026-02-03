import type { App, Component, DefineComponent } from "vue";

export function validateComponent(component: any) {
  if (!component || typeof component !== "object") {
    throw new Error("app._component is not a valid component object");
  }
}

export function wrapperApp(app: App, componentFn:((appRender: any) => DefineComponent | Component)) {
  validateComponent(app._component);
  const _componentRender = (app._component as any)?.render;
  (app._component as any).render = function (...args: Parameters<typeof _componentRender>) {
    // eslint-disable-next-line ts/no-this-alias
    const that = this;
    const _appRender = _componentRender.apply(that, args);
    return h(componentFn(_appRender));
  };
}
