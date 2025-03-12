const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for the @ alias pointing to the root folder
config.resolver.alias = {
    '@': path.resolve(__dirname),  // Resolve to the root folder
};

module.exports = config;