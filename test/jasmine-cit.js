/**
 * cit - Conditional It
 *
 * A Jasmin helper used in the same way as `it` and `xit`.
 * It will only run the test if the condition is true, otherwise
 * the test is ignored using `xit`.
 */
function cit(description, condition, test) {
  if (condition) {
    it.call(this, description, test);
  } else {
    console.warn('A test was ignored');
    xit.call(this, description, test);
  }
}
