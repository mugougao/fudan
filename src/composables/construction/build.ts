import to from "await-to-js";
import { fetchBuildList, fetchBuildQueryOptions } from "@/api/construction/build.ts";
import { useCampusStore } from "@/stores/campus";

export function useBuildListParamsOptions() {
  const { activeCampusId } = useCampusStore();

  const { state, execute } = useAsyncState<{
    areaOptions: { label: string; value: string }[];
    typeOptions: { label: string; value: string }[];
  }>(
    async () => {
      const [err, res] = await to(fetchBuildQueryOptions(activeCampusId));
      if (err) return { areaOptions: [], typeOptions: [] };
      const { area = [], type = [] } = res?.resultData || {};
      return {
        areaOptions: area.map(item => ({ label: item, value: item })),
        typeOptions: type.map(item => ({ label: item, value: item })),
      };
    },
    { areaOptions: [], typeOptions: [] },
    { immediate: true },
  );

  watch(() => activeCampusId, () => execute());

  const { areaOptions, typeOptions } = toRefs(toReactive(state));

  return {
    areaOptions,
    typeOptions,
    execute,
  };
}

export function useBuildList() {
  const params = ref<{ name: string; area: string | undefined; type: string | undefined }>({ name: "", area: undefined, type: undefined });
  const current = ref<number>(1);

  const { activeCampusId } = useCampusStore();
  const { state, execute } = useAsyncState(
    async () => {
      const [err, res] = await to(fetchBuildList({ xq: activeCampusId, pageNum: current.value, pageSize: 10, ...params.value }));
      if (err) return { list: [], total: 0 };
      const { list, total } = res?.resultData || {};
      return { list: list || [], total: total || 0 };
    },
    { list: [], total: 0 },
    { immediate: true, resetOnExecute: false },
  );

  const search = () => {
    current.value = 1;
    execute();
  };

  watch(() => current.value, () => execute());
  watch(() => activeCampusId, () => search());

  const { list, total } = toRefs(toReactive(state));

  return { params, list, total, search, current, execute };
}
