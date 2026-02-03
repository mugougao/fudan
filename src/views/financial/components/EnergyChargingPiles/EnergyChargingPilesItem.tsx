import type { FunctionalComponent } from "vue";
import mainBg from "@/assets/images_new/icon-bg-main.png";
import warnBg from "@/assets/images_new/icon-bg-warn.png";
import { cn, numberToThousands } from "@/utils";

const EnergyChargingPilesItem: FunctionalComponent<{
  timetype: "年" | "月" | "日";
  type: "use" | "money";
  value: string | number;
  unit: string;
}> = (props) => {
  const { type, timetype, value, unit } = props;

  return (
    <div
      class="energy-charging-piles-item flex items-center"
      style={{
        backgroundImage: `url(${type !== "use" ? warnBg : mainBg})`,
        backgroundPosition: "-35px center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <span
        class="energy-charging-piles-item-icon relative mr-2 inline-block h-[62px] w-[60px]"
      >
        <span class={cn(
          "absolute inline-flex items-center justify-center size-[17px] rounded-full bg-white text-[10px] font-text-bold left-2",
          type === "use" ? "text-[#CC1A1A]" : "text-[#A46F36]",
        )}
        >
          { timetype }
        </span>
        <span class="absolute left-7 top-3">
          <i class={type === "use" ? "i-svg-icon-raw-use" : "i-svg-icon-raw-money"}></i>
        </span>
      </span>
      <span class="flex flex-col gap-2 leading-none">
        <span class={cn(
          "empty-number text-[22px] font-number",
          "bg-gradient-to-b  to-white bg-clip-text text-transparent",
          type === "use" ? "from-[#FFC2C2]" : "from-[#F7C998]",
        )}
        >
          { numberToThousands(value) }
        </span>
        <span class="text-[12px] text-[#C6C6C6]">{ unit }</span>
      </span>
    </div>
  );
};

export default EnergyChargingPilesItem;
