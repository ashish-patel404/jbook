import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache'
});

export const unpkgPathPlugin = (inputCode: string) => {
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

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // check to see if we have already fecthed this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;

      });
    },
  };
};