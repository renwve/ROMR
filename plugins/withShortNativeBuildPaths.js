// Windows only: native modules build their C++ with CMake and Ninja, and the
// object files' paths repeat the project's full path, so from a project as deep
// as C:\Users\...\Coding_Projects\ROMR the SDK 58 libraries (Worklets,
// Reanimated's codegen) go past Windows' 260-character path limit.
//  - Builds every module with CMake 3.31.6, whose Ninja (1.12) can use long
//    paths (Windows' LongPathsEnabled must be on). The Android SDK installs it
//    with `sdkmanager "cmake;3.31.6"`.
//  - Puts each module's C++ build in a short folder, C:\rncxx, to keep well
//    under the limit anyway.
// Other platforms (and EAS's Linux builds) are left alone.
const { withProjectBuildGradle } = require('expo/config-plugins');

const MARKER = '// withShortNativeBuildPaths';
const CMAKE_VERSION = '3.31.6';

const SNIPPET = `
${MARKER}
if (System.getProperty('os.name').toLowerCase().contains('windows')) {
  subprojects { project ->
    ['com.android.library', 'com.android.application'].each { id ->
      project.plugins.withId(id) {
        project.android.externalNativeBuild.cmake.version = '${CMAKE_VERSION}'
        project.android.externalNativeBuild.cmake.buildStagingDirectory =
          new File("C:/rncxx/\${project.name}")
      }
    }
  }
}
`;

module.exports = function withShortNativeBuildPaths(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    // Drops an earlier copy of the snippet, if prebuild kept one: from the
    // marker to the if block's closing brace (the only unindented one).
    const contents = config.modResults.contents
      .replace(/\n?\/\/ withShortNativeBuildPaths\n[\s\S]*?\n\}\n/, '\n')
      .replace(/\n{3,}/g, '\n\n');
    // It has to come before the root plugins: React Native's evaluates the app
    // module straight away, after which its CMake version can't change.
    const anchor = contents.indexOf('apply plugin: "expo-root-project"');
    config.modResults.contents =
      anchor === -1
        ? contents + SNIPPET
        : contents.slice(0, anchor) + SNIPPET.trimStart() + '\n' + contents.slice(anchor);
    return config;
  });
};
