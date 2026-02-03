import type { FunctionalComponent } from "vue";

interface Props {
  deg?: number;
  colors: string | string[] | Record<number, string>;
  baseColor?: string;
  text?: string | number;
  className?: string;
}

const GradientText: FunctionalComponent<Props> = (props, { slots }) => {
  const { deg, colors, text, baseColor = "#FFF", className = "" } = props;
  const colorsType = Object.prototype.toString.call(colors);
  let style = {};
  switch (colorsType) {
    case "[object String]":
      style = { color: colors };
      break;
    case "[object Array]":
      style = {
        backgroundImage: `linear-gradient(${deg || 0}deg, ${(colors as string[])
          .map((color, index) => `${color} ${(index * 100) / (colors as string[]).length - 1}%`)
          .join(",")})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      };
      break;
    case "[object Object]":
      style = {
        backgroundImage: `linear-gradient(${deg || 0}deg, ${Object.entries(colors as Record<number, string>)
          .map(([key, value]) => `${value} ${key}%`)
          .join(",")})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      };
      break;
  }

  return (
    <div class={`gradient-text relative ${className}`}>
      <span style={{ color: baseColor }}>
        {slots.default ? slots.default() : text}
      </span>
      <span style={style} class="absolute left-0 top-0 h-full w-full">
        {slots.default ? slots.default() : text}
      </span>
    </div>
  );
};

export default GradientText;
