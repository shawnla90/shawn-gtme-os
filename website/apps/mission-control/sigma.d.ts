declare module 'sigma' {
  import Graph from 'graphology'
  class Sigma {
    constructor(graph: Graph, container: HTMLElement, settings?: any)
    getCamera(): any
    getGraph(): Graph
    refresh(): void
    kill(): void
    on(event: string, callback: (...args: any[]) => void): void
    removeAllListeners(event: string): void
    getNodeDisplayData(key: string): any
  }
  export default Sigma
}
