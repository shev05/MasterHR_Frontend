export {};

declare global {
  interface Window {
    extended: {
      [key: string]: string | undefined;
    };
  }
}
