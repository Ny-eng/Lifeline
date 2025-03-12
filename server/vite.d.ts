import "vite";

declare module "vite" {
  interface ServerOptions {
    // Allow allowedHosts to also accept a boolean value
    allowedHosts?: boolean | true | string[];
  }
}
