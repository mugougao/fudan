<script setup lang="ts">
import { cn } from "@/utils";

defineOptions({ name: "LabDesc", inheritAttrs: false });
</script>

<template>
  <div :class="cn('lab-desc flex flex-col', $attrs.class ?? '')">
    <UiSubTitle title="电镜中心介绍" class="mb-2" />
    <div class="flex-auto overflow-hidden pb-2">
      <div class="h-full overflow-y-auto px-3 text-[14px] leading-relaxed">
        <span class="float-left from-red to-white bg-gradient-to-b bg-clip-text text-[18px] text-transparent leading-none font-text-bold">复旦大学电镜中心</span>
        <p class="text-white/80">
          筹建于2022年，2024年12月正式揭牌成立。中心聚焦国家重大战略需求和世界一流大学学科建设，拥有<span class="mx-1 text-[18px] text-white font-text-bold">40</span>多台<span class="mx-1 text-[18px] text-white font-text-bold">500</span>万元以上的各类高端电镜，集中力量托举校内外高水平科技创新，为物质学科和生命医学等领域的基础研究和“产学研用”结合提供高水平特色支撑。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
