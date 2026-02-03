import { defineStore } from "pinia";
import { CampusId } from "@/enums";

// 校区
export const useCampusStore = defineStore("campus", () => {
  // 当前校区id
  /**
   * { id: "0", title: "概览" },
   * { id: "4", title: "邯郸" },
   * { id: "3", title: "江湾" },
   * { id: "2", title: "枫林" },
   * { id: "1", title: "张江" },
   */
  const activeCampusId = useLocalStorage<CampusId>("campusId", CampusId.HanDan);
  const setActiveCampusId = (id: CampusId) => {
    activeCampusId.value = id;
  };

  return { activeCampusId, setActiveCampusId };
});
