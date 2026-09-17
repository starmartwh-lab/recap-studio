import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const startRender = async () => {
  const bundleLocation = await bundle(path.resolve("./src/index.jsx"));
  
  // Choose aspect configurations dynamically based on runtime platform flags
  // TikTok Profile: width: 1080, height: 1920
  // YouTube Profile: width: 1920, height: 1080
  const composition = await selectComposition({
    bundleLocation,
    id: "RecapComposition",
    inputProps: { segments: require("./assets/pipeline.json") }
  });

  await renderMedia({
    composition,
    bundleLocation,
    outputLocation: "./output/final_recap.mp4",
    codec: "h264",
  });
  console.log("Render completed perfectly.");
};

startRender();
