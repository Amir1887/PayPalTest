import { useEffect } from "react";

// Utility function to handle API calls
async function callServer(url, method = "POST", data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error calling server: ${error.message}`);
    throw error;
  }
}

function App() {
  useEffect(() => {
    // Ensure PayPal SDK is available
    if (window.paypal) {
      window.paypal
        .Buttons({
          // Step 1: Create the order
          createOrder: async (data, actions) => {
            console.log("Creating PayPal order...");
            try {
              const orderData = await callServer(
                "/demo/checkout/api/paypal/order/create/"
              );
              console.log("Order created:", orderData);
              return orderData.id; // Return server-created order ID
            } catch (error) {
              console.error("Failed to create order:", error);
              alert("Error creating order. Please try again.");
            }
          },

          // Step 2: Capture the transaction
          onApprove: async (data, actions) => {
            console.log("Capturing transaction for order:", data.orderID);
            try {
              const orderData = await callServer(
                `/demo/checkout/api/paypal/order/${data.orderID}/capture/`
              );

              // Check for errors
              const errorDetail =
                Array.isArray(orderData.details) && orderData.details[0];
              if (errorDetail) {
                if (errorDetail.issue === "INSTRUMENT_DECLINED") {
                  console.warn("Instrument declined, retrying...");
                  return actions.restart(); // Retry payment
                }
                throw new Error(
                  `Payment failed: ${errorDetail.description || "Unknown error"}`
                );
              }

              // Handle successful transaction
              const transaction =
                orderData.purchase_units[0].payments.captures[0];
              console.log("Transaction successful:", transaction);
              alert(
                `Transaction ${transaction.status}: ${transaction.id}\n\nSee console for details.`
              );

              // Optional: Redirect or update UI
              window.location.href = "/thank_you.html";
            } catch (error) {
              console.error("Transaction failed:", error);
              alert("Transaction failed. Please try again.");
            }
          },

          // Optional: Customize error handling
          onError: (error) => {
            console.error("PayPal button error:", error);
            alert("An unexpected error occurred. Please try again.");
          },
        })
        .render("#paypal-button-container");
    }
  }, []);

  return (
    // Set up a container element for the button
    <div id="paypal-button-container"></div>
  );
}

export default App;
