declare module 'useragent-generator' {
  /********************
   *  Google Chrome   *
   /*******************/
  export function chrome(opt: number | string | { version: string, os?: string }): string;
  export namespace chrome {
    function androidPhone(opt: number | string | { version: string, androidVersion?: string, device?: string }): string;
    function androidTablet(opt: number | string | { version: string, androidVersion?: string, device?: string })
      : string;
    function androidWebview(opt: number | string | { androidVersion: string, chromeVersion?: string, device?: string })
      : string;
    function chromecast(opt: number | string | { version: string }): string;
    function iOS(opt: number | string | { iOSVersion: string, chromeVersion?: string, device?: string }): string;
  }
  export function chromium(opt: number | string | { version: string, os?: string }): string;
  /***************
   *   Firefox   *
   /*************/
  export function firefox(opt: number | string | { version: string, os?: string }): string;
  export namespace firefox {
    function androidPhone(opt: number | string | { version: string, androidVersion?: string, device?: string }): string;
    function androidTablet(opt: number | string | { version: string, androidVersion?: string, device?: string })
      : string;
    function iOS(opt: number | string | { iOSVersion: string, device?: string }): string;
  }
  /**************
   *   Safari   *
   /************/
  export function safari(opt: number | string | { version: string, os?: string }): string;
  export namespace safari {
    function iOS(opt: number | string | { iOSVersion: string, safariVersion?: string, device?: string }): string;
    function iOSWebview(opt: number | string | { iOSVersion: string, safariVersion?: string, device?: string }): string;
  }
  /***********************
   *  Internet Explorer  *
   /*********************/
  export function ie(opt: number | string | { version: string, os?: string }): string;
  export namespace ie {
    function windowsPhone(opt: number | string | { version: string, device?: string }): string;
  }
  /**********************
   *   Microsoft Edge   *
   /********************/
  export function edge(opt: number | string | { version: string, chromeVersion?: string, os?: string }): string;
  /************************
   *  Search Engine Bots  *
   /**********************/
  export function googleBot(opt?: number | string | { version?: string }): string;
  export function bingBot(opt?: number | string | { version?: string }): string;
  export function yahooBot(): string;
}
