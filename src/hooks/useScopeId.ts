import { getCurrentInstance, withScopeId } from "vue";

export function useScopeId() {
  const instance = getCurrentInstance();
  if (!instance) {
    // console.warn(`useScopeId is called without current active component instance.`);
    console.warn(`在没有当前活动组件实例的情况下调用useScopeId。`);
    return;
  }

  let scopeId = "";
  // eslint-disable-next-line no-cond-assign
  if ((scopeId = (instance.type as any).__scopeId)) {
    withScopeId(scopeId);
  }

  return scopeId;
}
