import { CampusId } from "@/enums";
import { useCampusStore } from "@/stores/campus.ts";

// 监听校区ID 切换页面
export default function useWatchCampusIdForSwitchPages() {
  const campusStore = useCampusStore();
  const { activeCampusId } = storeToRefs(campusStore);
  const router = useRouter();

  watch(
    () => activeCampusId.value,
    () => {
      console.log("=>(useWatchCampusId.ts:18) activeCampusId", activeCampusId.value);
      if (activeCampusId.value === CampusId.Overview) {
        return router.replace("/lifeServices");
      }
      // campusId 校区ID
      router.push({ path: "/lifeServices/campus", query: { campusId: activeCampusId.value } });
    },
  );
}
