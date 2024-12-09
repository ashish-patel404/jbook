import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      //Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://www.unpkg.com' + args.resolveDir + '/').href
        }
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {

        return { namespace: 'a', path: `https://www.unpkg.com/${args.path}` };

        // else if (args.path === 'tiny-test-pkg') {
        //   return { path: 'https://www.unpkg.com/tiny-test-pkg@1.0.0/index.js', namespace: 'a' }
        // }

      });
    },
  };
};