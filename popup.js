"use strict";

// The hashing difficulty.
// 2 ^ difficulty rounds of SHA-256 will be computed.
var difficulty = 16;

// This fixes a bug in Chrome where the popup is not sized correctly.
function fixSize() {
  setInterval(function() {
    var width = $('#container').width();
    var height = $('#container').height();
    $('#container').width(width);
    $('#container').height(height);
  }, 100);
}

$(function() {
  // Get the current tab.
  chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      // Make sure we got the tab.
      if (tabs.length !== 1) {
        $('#controls').addClass('hidden');
        $('#error').removeClass('hidden').text('Unable to determine active tab.');
        $('#container').removeClass('hidden');
        fixSize();
        return;
      }

      // Get the domain.
      var domain = null;
      var matches = tabs[0].url.match(/^http(?:s?):\/\/([^/]*)/);
      if (matches) {
        domain = matches[1].toLowerCase();
      } else {
        // Example cause: files served over the file:// protocol.
        $('#controls').addClass('hidden');
        $('#error').removeClass('hidden').text('Unable to determine the domain.');
        $('#container').removeClass('hidden');
        fixSize();
        return;
      }
      if (/^http(?:s?):\/\/chrome\.google\.com\/webstore.*/.test(tabs[0].url)) {
        // Technical reason: Chrome prevents content scripts from running in the app gallery.
        $('#controls').addClass('hidden');
        $('#error').removeClass('hidden').text('Hashpass cannot run in the Chrome Web Store.');
        $('#container').removeClass('hidden');
        fixSize();
        return;
      }
      $('#domain').text(domain);

      // Run the content script to register the message handler.
      chrome.tabs.executeScript(tabs[0].id, {
        file: 'content_script.js'
      }, function() {
        // Check if a password field is selected.
        chrome.tabs.sendMessage(tabs[0].id, {
            type: 'check'
          }, function(response) {
            // Different user interfaces depending on whether a password field is in focus.
            var passwordMode = (response.type === 'password');
            if (passwordMode) {
              $('.password-mode-off').addClass('hidden');
              $('.password-mode-on').removeClass('hidden');
            } else {
              $('.password-mode-off').removeClass('hidden');
              $('.password-mode-on').addClass('hidden');
            }
            $('#error').addClass('hidden');
            $('#container').removeClass('hidden');
            fixSize();

            // Called whenever the key changes.
            var update = function() {
              // Compute the first 16 base64 characters of iterated-SHA-256(domain + '/' + key, 2 ^ difficulty).
              var key = $('#key').val();

              var rounds = Math.pow(2, difficulty);
              var bits = domain + '/' + key;
              for (var i = 0; i < rounds; i += 1) {
                bits = sjcl.hash.sha256.hash(bits);
              }

              var hash = sjcl.codec.base64.fromBits(bits).slice(0, 16);
              $('#hash').val(hash);
              return hash;
            };

            // A debounced version of update().
            var timeout = null;
            var debouncedUpdate = function() {
              if (timeout !== null) {
                clearInterval(timeout);
              }
              timeout = setTimeout((function() {
                update();
                timeout = null;
              }), 100);
            }

            if (passwordMode) {
              // Listen for the Enter key.
              $('#key').keydown(function(e) {
                if (e.which === 13) {
                  // Try to fill the selected password field with the hash.
                  chrome.tabs.sendMessage(tabs[0].id, {
                      type: 'fill',
                      hash: update()
                    }, function(response) {
                      // If successful, close the popup.
                      if (response.type === 'close') {
                        window.close();
                      }
                    }
                  );
                }
              });
            }

            if (!passwordMode) {
              // Register the update handler.
              $('#key').bind('propertychange change click keyup input paste', debouncedUpdate);
            }

            // Update the hash right away.
            debouncedUpdate();

            // Focus the text field.
            $('#key').focus();
          }
        );
      });
    }
  );
});
