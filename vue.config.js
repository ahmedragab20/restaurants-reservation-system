const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: "https://api.foodics.dev/v5",
  },
  // devServer: {
  //   proxy: {
  //     "/v5": {
  //       target: "https://api.foodics.dev",
  //       changeOrigin: true,
  //       logLevel: "debug",
  //       onProxyReq: (proxyReq, req) => {
  //         console.log(
  //           `Proxying ${req.method} ${req.path} to ${proxyReq.protocol}://${proxyReq.host}${proxyReq.path}`
  //         );
  //       },
  //       onProxyRes: (proxyRes, req) => {
  //         console.log(
  //           `Proxying ${req.method} ${req.path} to ${proxyRes.statusCode}`
  //         );
  //       },
  //     },
  //   },
  // },
});
