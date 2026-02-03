import { defineStore } from "pinia";
import { useState } from "@/hooks";

export const useCloudMapStore = defineStore("cloudMap", () => {
  const [zoom, setZoom] = useState(0);

  return { zoom, setZoom };
});
