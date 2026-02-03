import type { FunctionalComponent } from "vue";

const LineTitle: FunctionalComponent<{
  title: string;
}> = (props) => {
  const { title } = props;
  return (
    <div class="line-title flex items-center justify-center gap-1">
      <span class="relative block h-[1px] flex-1 bg-[#518B90]"><span class="absolute left-0 top-[-1px] block size-[2px] bg-[#32E5DB]"></span></span>
      <span class="line-title-text shrink-0 text-[16px] font-text-medium">{ title }</span>
      <span class="relative block h-[1px] flex-1 bg-[#518B90]"><span class="absolute right-0 top-[-1px] block size-[2px] bg-[#32E5DB]"></span></span>
    </div>
  );
};

export default LineTitle;
