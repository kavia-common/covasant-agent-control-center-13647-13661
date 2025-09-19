/* eslint-disable no-undef */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Prevent real network calls; each test should mock fetch as needed.
beforeAll(() => {
  if (!global.fetch) {
    global.fetch = jest.fn();
  }
});

afterEach(() => {
  if (global.fetch?.mockClear) global.fetch.mockClear();
});
