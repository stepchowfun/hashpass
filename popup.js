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

// The hashing difficulty.
// 2 ^ difficulty rounds of SHA-256 will be computed.
var difficulty = 16;

$(function() {
  // Get the current tab.
  chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var showError = function(err) {
        $('#domain').val('N/A').addClass('disabled');
        $('#domain').prop('disabled', true);
        $('#key').prop('disabled', true);
        $('#hash').prop('disabled', true);
        $('p:not(#message)').addClass('disabled');
        $('#message').addClass('error').text(err);
      };

      // Make sure we got the tab.
      if (tabs.length !== 1) {
        return showError('Unable to determine active tab.');
      }

      // Get the domain.
      var domain = null;
      var this_url = tabs[0].url
      if (tld.isValid(this_url)) {
        domain = tld.getDomain(this_url);
      } else {
        // Example cause: files served over the file:// protocol.
        return showError('Unable to determine the domain.');
      }
      if (/^http(?:s?):\/\/chrome\.google\.com\/webstore.*/.test(tabs[0].url)) {
        // Technical reason: Chrome prevents content scripts from running in the app gallery.
        return showError('Try Hashpass on another domain.');
      }
      $('#domain').val(domain);

      // Run the content script to register the message handler.
      chrome.tabs.executeScript(tabs[0].id, {
        file: 'content_script.js'
      }, function() {
        // Check if a password field is selected.
        chrome.tabs.sendMessage(tabs[0].id, {
            type: 'hashpassCheckIfPasswordField'
          }, function(response) {
            // Different user interfaces depending on whether a password field is in focus.
            var passwordMode = (response.type === 'password');
            if (passwordMode) {
              $('#message').html('Press <strong>ENTER</strong> to fill in the password field.');
              $('#hash').val('[hidden]').addClass('disabled');
            } else {
              $('#message').html('<strong>TIP:</strong> Select a password field first.');
            }

            // Called whenever the key changes.
            var update = function() {
              // Compute the first 16 base64 characters of iterated-SHA-256(domain + '/' + key, 2 ^ difficulty).
              var key = $('#key').val();
              domain = $('#domain').val().replace(/^\s+|\s+$/g, '').toLowerCase();

              var rounds = Math.pow(2, difficulty);
              var bits = domain + '/' + key;
              for (var i = 0; i < rounds; i += 1) {
                bits = sjcl.hash.sha256.hash(bits);
              }

              var hash = sjcl.codec.base64.fromBits(bits).slice(0, 16);
              if (!passwordMode) {
                $('#hash').val(hash);
              }
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
            };

            if (passwordMode) {
              // Listen for the Enter key.
              $('#domain, #key').keydown(function(e) {
                if (e.which === 13) {
                  // Try to fill the selected password field with the hash.
                  chrome.tabs.sendMessage(tabs[0].id, {
                      type: 'hashpassFillPasswordField',
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
              $('#domain, #key').bind('propertychange change keyup input paste', debouncedUpdate);

              // Update the hash right away.
              debouncedUpdate();
            }

            // Focus the text field.
            $('#key').focus();
          }
        );
      });
    }
  );
});
