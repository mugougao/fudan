import type { MaybeRefOrGetter } from "vue";

// 组装 宿舍管理 - 宿舍区域面板 - 人员信息数据
export default function usePersonnelInformationData(data: MaybeRefOrGetter<any>) {
  // 总入住人数
  const total = computed(() => toValue(data)?.count);

  // 学历人员统计
  const educationData = computed(() => (toValue(data)?.xlfb || []).map((item: any) => ({
    name: item.name,
    value: item.value,
  })));

  // 性别人员统计
  const sexData = computed(() => (toValue(data)?.xbfb || []).map((item: any) => ({
    name: `${item.name}生`,
    value: item.value,
  })));

  // 院系
  const departmentData = computed(() =>
    (toValue(data)?.yxfb || [])
      .map((item: any) => ({ name: item.name, value: item.value }))
      .sort(({ value: a }, { value: b }) => b - a)
      .slice(0, 5),
  );

  // 入住时间
  const timeData = computed(() =>
    (toValue(data)?.rjsjfb || [])
      .map((item: any) => ({
        name: item.name,
        value: item.value,
      }))
      .sort(({ name: a }, { name: b }) => {
        const aNum = Number(a.match(/\d+/g)?.[0]);
        const bNum = Number(b.match(/\d+/g)?.[0]);
        return aNum - bNum;
      }),
  );

  return {
    total,
    educationData,
    sexData,
    departmentData,
    timeData,
  };
}
