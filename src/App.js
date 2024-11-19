import { useEffect } from 'react';
function App() {
  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions)=>{
          return actions.order.create({
            purchase_units:[{
              amount: {
                value: 500.00,
              }
            }]
          })
        },
        onApprove: function(data, actions){
          //capture the funds
          return actions.order.capture().then(function(details){
            //show transaction sucess message
            alert('Transaction completed by ' + details.payer.name.given_name);
          })
        }
      }).render('#paypal-button-container');
    }
  }, []);

  return (
    // Set up a container element for the button
    <div id="paypal-button-container"></div>
  );
}

export default App;
