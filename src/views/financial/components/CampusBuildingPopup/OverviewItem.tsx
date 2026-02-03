import { get } from "lodash";
import { cn } from "@/utils";

export default function OverviewItem(props: {
  select?: boolean; // 可选的
  checked?: boolean; // 选中的
  title: string;
  icon: string;
  options: { label: string; field: string; unit: string }[];
  data: any;
}) {
  const { select, checked, title, options, data, icon } = props;
  return (
    <div class={cn("overview-item", select && "cursor-pointer", checked && "checked")}>
      <span class="overview-item-icon">
        <i class={cn(icon, "bg-gradient-to-b from-[#FFC2C2] to-white")}></i>
        <span class="text-[12px] font-text-medium">{ title }</span>
      </span>
      <div class="overview-item-content">
        <div class="h-full flex items-center justify-evenly">
          {
            options.map(({ label, field, unit }) => (
              <div key={field} class="flex flex-col items-center">
                <span class="overview-item-content-label text-[12px] font-text-medium">{ label }</span>
                <span class="overview-item-content-value">
                  <span class="text-[20px] leading-none font-number">{ get(data, field, 0) }</span>
                  <span class="text-[12px] leading-none">{ unit }</span>
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
