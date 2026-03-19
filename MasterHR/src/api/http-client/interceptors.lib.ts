type RefreshCallback = () => void;

type ObserverApi = {
  isRefreshing: boolean;
  refreshSubscribers: Array<RefreshCallback>;
  subscribeToRefresh: (cb: RefreshCallback) => void;
  notifyRefreshed: RefreshCallback;
};

export const observerApi: ObserverApi = {
  isRefreshing: false,
  refreshSubscribers: [],

  subscribeToRefresh: (callback: RefreshCallback) => {
    observerApi.refreshSubscribers.push(callback);
  },

  notifyRefreshed: () => {
    observerApi.refreshSubscribers.forEach((callback) => callback());
    observerApi.refreshSubscribers = [];
  },
};
