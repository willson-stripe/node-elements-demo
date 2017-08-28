var pk = document.getElementById("elements").getAttribute("data-pk");
var stripe = Stripe(pk);
var elements = stripe.elements();

var card = elements.create('card', {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});
card.mount('#card-element');


// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});

// Send token to be charged
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');

  // add token to form
  var hiddenTokenInput = document.createElement('input');
  hiddenTokenInput.setAttribute('type', 'hidden');
  hiddenTokenInput.setAttribute('name', 'stripeToken');
  hiddenTokenInput.setAttribute('value', token.id);
  form.appendChild(hiddenTokenInput);

  // Submit the form
  form.submit();
}