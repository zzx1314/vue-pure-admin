import { defineStore } from "pinia";
import { store } from "@/store";

export const useMessageStore = defineStore({
  id: "messageStore",
  state: () => ({
    handleMessage: false,
    deleteMessage: false
  }),
  getters: {
    getHandleMessage(state) {
      return state.handleMessage;
    },
    getDeleteMessage(state) {
      return state.deleteMessage;
    }
  },
  actions: {
    setHandleMessage(newValue: boolean): void {
      this.handleMessage = newValue;
    },
    setDeleteMessage(newValue: boolean): void {
      this.deleteMessage = newValue;
    }
  }
});

export function useMessageStoreHook() {
  return useMessageStore(store);
}
