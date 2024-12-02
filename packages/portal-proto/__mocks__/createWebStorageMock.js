const mockStorage = {
  getItem: jest.fn((key) => Promise.resolve(null)),
  setItem: jest.fn((key, item) => Promise.resolve(item)),
  removeItem: jest.fn((key) => Promise.resolve()),
};

const createWebStorage = (arg) => mockStorage;
module.exports = createWebStorage;
