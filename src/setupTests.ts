// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Add structuredClone function for Jest
if(!global.structuredClone){
    global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

//used for mocking localstorage functions
const localStorageMock = (function () {
    let store = {} as { [key: string]: string};
  
    return {
      getItem(key: string) {
        return store[key];
      },
  
      setItem(key: string, value: string) {
        store[key] = value;
      },
  
      clear() {
        store = {};
      },
  
      removeItem(key: string) {
        delete store[key];
      },
  
      getAll() {
        return store;
      },
    };
  })();
  
  Object.defineProperty(window, "localStorage", { value: localStorageMock });