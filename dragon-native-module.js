export const dragonNative = ((_) => {
  if (typeof window === 'undefined') {
    // SSR일 때 작동하지 않도록 방어
    return;
  }
  const iOSHandlerName = 'dragon';
  const iOSDomain = 'leisure';
  const iOSHandler = ((_) => {
    let tWebkit;
    let tHandler;
    let tiOSHandler;
    if (
      !!(tWebkit = window['webkit']) &&
      !!(tHandler = tWebkit.messageHandlers) &&
      !!(tiOSHandler = tHandler[iOSHandlerName])
    ) {
      return tiOSHandler;
    }
  })();
  const isNativeIOS = !!iOSHandler;
  const iOSAdapter = {
    type: 'IOS',
    requestSNSLogin: (param) => {
      iOSHandler.postMessage({ command : "requestSNSLogin", value : param});
    },
  };

  const androidHandlerName = 'dragon';
  const androidHandler = ((_) => {
    let tAndroidHandler;
    if (!!(tAndroidHandler = window[androidHandlerName])) {
      return tAndroidHandler;
    }
  })();
  const isNativeAndroid = !!androidHandler;
  const andoidAdapter = {
    type: 'ANDROID',
    requestSNSLogin: (param) => {
      androidHandler.requestSNSLogin(param);
    },
  };

  const webAdapter = {
    type: 'WEB',
    kinesis: (param) => {
      // 웹 클라이언트는 별거 없음
      console.log(param);
    },
  };

  let tDelegate;
  return new class {
    constructor(delegate) {
      tDelegate = delegate;
      console.log(`tDelegate.type: ${tDelegate.type}`);
    }
    get type() {
      if (!!tDelegate) return tDelegate.type;
      return 'WEB';
    }
    kinesis(param) {
      if (!!tDelegate) tDelegate.kinesis(param);
    }
  }(!!window ? isNativeIOS ? iOSAdapter : isNativeAndroid ? andoidAdapter : webAdapter : webAdapter);
});            
