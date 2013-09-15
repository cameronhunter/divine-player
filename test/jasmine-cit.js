function cit(condition, description, test) {
  if (condition) {
    it.call(this, description, test);
  } else {
    console.warn('A test was ignored');
    xit.call(this, description, test);
  }
}
