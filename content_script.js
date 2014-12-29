"use strict";

// Register the message handler.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Check if a password field is selected.
    if (request.type === 'check') {
      var activeElement = document.activeElement;
      if (activeElement.tagName.toLowerCase() === 'input') {
        if (activeElement.type.toLowerCase() === 'password') {
          sendResponse({ type: 'password' });
          return;
        }
      }
      sendResponse({ type: 'not-password' });
      return;
    }

    // Fill in the selected password field.
    if (request.type === 'fill') {
      var activeElement = document.activeElement;
      if (activeElement.tagName.toLowerCase() === 'input') {
        if (activeElement.type.toLowerCase() === 'password') {
          activeElement.value = request.hash;
          sendResponse({ type: 'close' });
          return;
        }
      }
      sendResponse({ type: 'none' });
      return;
    }
  }
);
