const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for cjs files
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
