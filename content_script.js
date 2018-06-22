'use strict';

// Make sure we are in strict mode.
(function() {
  var strictMode = false;
  try {
    NaN = NaN;
  } catch (err) {
    strictMode = true;
  }
  if (!strictMode) {
    throw 'Unable to activate strict mode.';
  }
})();

// Make sure the content script is only run once on the page.
if (!window.hashpassLoaded) {
  window.hashpassLoaded = true;

  // Stores a document inside of which activeElement is located.
  var activeDocument = document;

  // Register the message handler.
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // Trims the attribute and converts it to lowercase.
      var normalizeAttr = function(attr) {
        return attr.replace(/^\s+|\s+$/g, '').toLowerCase();
      };

      // Checks if activeElement is inside iframe or not and returns correct document.
      var getActiveDocument = function() {
        var elem = document.activeElement;
        if (normalizeAttr(elem.tagName) === normalizeAttr('iframe')) {
          return elem.contentDocument;
        }
        return document;
      };

      // Returns whether elem is an input of type "password".
      var isPasswordInput = function(elem) {
        if (elem) {
          if (normalizeAttr(elem.tagName) === normalizeAttr('input')) {
            if (normalizeAttr(elem.type) === normalizeAttr('password')) {
              return true;
            }
          }
        }
        return false;
      };

      // Check if a password field is selected.
      if (request.type === 'hashpassCheckIfPasswordField') {
        activeDocument = getActiveDocument();
        if (activeDocument && isPasswordInput(activeDocument.activeElement)) {
          sendResponse({ type: 'password' });
          return;
        }
        sendResponse({ type: 'not-password' });
        return;
      }

      // Fill in the selected password field.
      if (request.type === 'hashpassFillPasswordField') {
        if (isPasswordInput(activeDocument.activeElement)) {
          activeDocument.activeElement.value = request.hash;
          sendResponse({ type: 'close' });
          return;
        }
        sendResponse({ type: 'fail' });
        return;
      }
    }
  );
}
