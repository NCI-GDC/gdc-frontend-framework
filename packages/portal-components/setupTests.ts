import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
