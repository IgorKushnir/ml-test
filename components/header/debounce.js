export const debounce = (func, delay=500) => {
  
    let timeoutId;
    
    return function(...args) {
      const context = this;
  
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
}