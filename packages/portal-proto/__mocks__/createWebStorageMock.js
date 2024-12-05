/* global jest */

const mockStorage = {
  getItem: jest.fn((_key) => Promise.resolve(null)),
  setItem: jest.fn((_key, item) => Promise.resolve(item)),
  removeItem: jest.fn((_key) => Promise.resolve()),
};

const createWebStorage = (_arg) => mockStorage;
module.exports = createWebStorage;
