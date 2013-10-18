/**
 * cit - Conditional It
 *
 * A Jasmin helper used in the same way as `it`.
 * It will only run the test if the condition is true, otherwise
 * the test is ignored using `xit`.
 */

function cit(description, condition, test) {
  if (condition) {
    it.call(this, description, test);
  } else {
    xit.call(this, description, test);
  }
}

function cdescribe(description, condition, test) {
  if (condition) {
    describe.call(this, description, test);
  } else {
    xdescribe.call(this, description, test);
  }
}

function when(description, condition, test) {
  cdescribe(description, condition, test);
}

function ignore(description, condition, test) {
  cdescribe(description, !condition, test);
}
