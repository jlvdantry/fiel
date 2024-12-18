const workboxBuild = require("workbox-build");
const version='v4'
const buildSW = () => {
  // The build is expected to fail if the
  // sw install rules couldn't be generated.
  // Add a catch block to handle this scenario.
  return workboxBuild
    .injectManifest({
      swSrc: "src/sw-custom.js", // custom sw rule

      swDest: "build/sw.js", // sw output file (auto-generated

      globDirectory: "build",

      globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      modifyURLPrefix: {
                '': `static/${version}/`, // Adjust the path based on your setup
      },
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    })
    .then(({ count, size, warnings }) => {
      warnings.forEach(console.warn);
      console.info(`${count} files will be precached_,
                  totaling ${size / (1024 * 1024)} MBs.`);
    });
};

buildSW();
