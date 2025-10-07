import "@testing-library/jest-dom"; // <--- add this line

import fetchMock from "jest-fetch-mock";
import React from "react";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.React = React;

fetchMock.enableMocks();

Object.defineProperty(window, "localStorage", {
  value: (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (i) => Object.keys(store)[i] || null,
      get length() {
        return Object.keys(store).length;
      },
    };
  })(),
  writable: true,
});
