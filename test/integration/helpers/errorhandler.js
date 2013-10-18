window.onerror = function(error, url, lineNumber) {
  var obj = {error: error, url: url, lineNumber: lineNumber};

  if (console && console['error']) {
    console.error(obj);
  }

  var element = document.createElement('p');
  element.innerHTML = JSON.stringify(obj);
  document.body.appendChild(element);
};