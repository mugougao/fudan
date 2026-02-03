import type { Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import to from "await-to-js";
import {
  getApprove,
  getAreaSupervisorCount,
  getDormitoryAreaData,
  getDormitoryAreaEnergy,
} from "@/api/lifeServices";
import usePersonnelInformationData from "@/composables/lifeServices/usePersonnelInformationData.ts";

export function useCampusParkData() {
  // 宿舍区 ID
  const dormitoryAreaId = useRouteQuery("dormitoryAreaId", "") as unknown as Ref<string>;

  // 园区基本概况
  const { state, execute } = useAsyncState(async () => {
    const [err, res] = await to(getDormitoryAreaData(dormitoryAreaId.value));
    if (err) return { gl: {}, tj: {} };
    return res?.resultData || { gl: {}, tj: {} };
  }, { gl: {}, tj: {} }, { resetOnExecute: false });
    // 宿舍区面板-督导员数量
  const { state: totalSupervisor, execute: supervisorExecute } = useAsyncState(async () => {
    const [err, res] = await to(getAreaSupervisorCount(dormitoryAreaId.value));
    if (err) return 0;
    return res?.resultData || 0;
  }, 0, { resetOnExecute: false });

  // 人员基本信息
  const personnelInformationData = usePersonnelInformationData(computed(() => state.value.tj));

  // 审批数据
  const { state: approvalData, execute: approvalExecute } = useAsyncState(async () => {
    const [err, res] = await to(getApprove(dormitoryAreaId.value));
    if (err) return {};
    return res?.resultData || {};
  }, { }, { resetOnExecute: false });

  const defaultEnergyInfo = {
    energyUseData: { count: 0, data: [] },
    energyPurchaseData: { count: 0, data: [] },
  };

  // 能耗情况
  const { state: energyInfo, execute: energyInfoExecute } = useAsyncState(
    async () => {
      const [err, res] = await to(getDormitoryAreaEnergy(dormitoryAreaId.value));
      if (err) return defaultEnergyInfo;
      const { ndgdl = [], zrydl = 0, ndydl = [], zrgdl = 0 } = (res?.resultData || {});
      return {
        energyUseData: {
          count: zrydl,
          data: ndydl as { name: string; value: number }[],
        },
        energyPurchaseData: {
          count: zrgdl,
          data: ndgdl as { name: string; value: number }[],
        },
      };
    },
    defaultEnergyInfo,
    { resetOnExecute: false },
  );

  watch(dormitoryAreaId, () => {
    execute();
    energyInfoExecute();
    approvalExecute();
    supervisorExecute();
  });

  return {
    // 园区基本概况
    state,
    totalSupervisor,
    // 人员基本信息
    personnelInformationData,
    // 审批数据
    approvalData,
    // 能耗情况
    energyInfo,
  };
}
