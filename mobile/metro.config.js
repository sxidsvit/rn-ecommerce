const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
// 1. Get the basic config from Sentry (it already includes Expo settings)
const config = getSentryExpoConfig(__dirname);

// 2. Enable Inline Requires (speeds up application launch)
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true, // Loads modules only when needed
  },
});

// 3. Optimize caching and ignore unnecessary files
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/, // Remove duplicates RN
  /android\/.*/, // Don't index native folders
  /ios\/.*/,
];

// 4. Setting up memory management (important for Windows and heavy projects)
config.maxWorkers = 4; // Leave 2 or 4 depending on PC power

module.exports = withNativeWind(config, { input: "./global.css" });