const useLocalStorage = () => {
  return {
    store: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    fetch: (key) => {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      } else {
        return JSON.parse(item);
      }
    },
  };
};

export default useLocalStorage;
