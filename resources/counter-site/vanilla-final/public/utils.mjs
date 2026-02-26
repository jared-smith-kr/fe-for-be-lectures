export function debounce(wait, func) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const paramsToObj = (urlQueryParams, xforms = {}) => {
  return Array.from(urlQueryParams.entries()).reduce((accumulator, [key, value]) => {
    const result = key in xforms ? xforms[key](value) : value;
    // same key can show up more than once in query string
    if (key in accumulator) {
      if (!Array.isArray(accumulator[key])) {
        accumulator[key] = [accumulator[key]];
      }

      accumulator[key].push(result);
    } else {
      accumulator[key] = result;
    }

    return accumulator;
  }, {});
};
