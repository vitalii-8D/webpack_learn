// @babel/polyfill needed for async functions
export async function start() {
   return await Promise.resolve('Async is working')
}

// check eslint
// needed to install:  eslint-loader  babel-eslint  eslint
const unused = 42;

// @babel/plugin-proposal-class-properties  needed for build this
export class Util {
   static id = Date.now()
}
