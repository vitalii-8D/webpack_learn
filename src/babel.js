// @babel/polyfill needed for async functions
export async function start() {
   return await Promise.resolve('Async is working')
}

// @babel/plugin-proposal-class-properties  needed for build this
export class Util {
   static id = Date.now()
}
