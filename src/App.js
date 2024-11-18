import { useEffect } from 'react';
function App() {
  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons().render('#paypal-button-container');
    }
  }, []);

  return (
    // Set up a container element for the button
    <div id="paypal-button-container"></div>
  );
}

export default App;
