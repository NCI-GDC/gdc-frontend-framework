/* eslint @typescript-eslint/no-unused-vars: 0 */
// Credit to: https://github.com/vercel/next.js/discussions/15687
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const sessionStorage =
  typeof window !== "undefined"
    ? createWebStorage("session")
    : createNoopStorage();

export default storage;
