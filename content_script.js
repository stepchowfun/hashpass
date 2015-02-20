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

// Register the message handler.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Trims the attribute and converts it to lowercase.
    var normalizeAttr = function(attr) {
      return attr.replace(/^\s+|\s+$/g, '').toLowerCase();
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
    if (request.type === 'check') {
      if (isPasswordInput(document.activeElement)) {
        sendResponse({ type: 'password' });
        return;
      }
      sendResponse({ type: 'not-password' });
      return;
    }

    // Fill in the selected password field.
    if (request.type === 'fill') {
      if (isPasswordInput(document.activeElement)) {
        document.activeElement.value = request.hash;
        sendResponse({ type: 'close' });
        return;
      }
      sendResponse({ type: 'fail' });
      return;
    }
  }
);
