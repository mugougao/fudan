import { watch } from "vue";
import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

interface IUseWatchCampusIdPushRouteOptions {
  overviewRouteName: string;
  campusRouteName: string;
  watchCallback?: (campusId: CampusId, oldCampusId: CampusId) => void;
  enterOverviewCallback?: () => void;
  enterCampusCallback?: () => void;
}

export default function useWatchCampusIdPushRoute(options: IUseWatchCampusIdPushRouteOptions) {
  const { overviewRouteName, campusRouteName } = options;

  const router = useRouter();
  const route = useRoute();
  const campusStore = useCampusStore();

  const campusId = computed(() => campusStore.activeCampusId);

  onMounted(() => {
    campusStore.setActiveCampusId(
      route.query.campusId !== undefined
        ? route.query.campusId as CampusId
        : CampusId.Overview,
    );
  });

  watch(
    () => campusStore.activeCampusId,
    (campusId, oldCampusId) => {
      options.watchCallback?.(campusId, oldCampusId);
      if (oldCampusId === CampusId.Overview && campusId !== CampusId.Overview) {
        options.enterOverviewCallback?.();
      }
      else if (campusId !== CampusId.Overview && oldCampusId === CampusId.Overview) {
        options.enterCampusCallback?.();
      }
      if (campusId === CampusId.Overview) {
        router.push({ name: overviewRouteName });
      }
      else {
        router.push({
          name: campusRouteName,
          query: {
            ...route.query,
            campusId: campusStore.activeCampusId,
          },
        });
      }
    },
  );

  return { campusId };
}
