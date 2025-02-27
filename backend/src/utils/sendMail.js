import axios from "axios";

const sendMail = async (email, name, subject, htmlContent) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  if (!brevoApiKey || !senderEmail) {
    console.error("❌ Missing API Key or Sender Email");
    return {
      success: false,
      message: "Server error: Missing email configuration",
    };
  }

  const data = {
    sender: { email: senderEmail, name },
    to: [{ email }],
    subject,
    htmlContent,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    return {
      success: false,
      message: error.message || "OTP sending failed",
    };
  }
};

const sendOrderConfirmationEmail = async (
  email,
  fullName,
  orderDetailsArray,
  finalProductImgs
) => {
  let Total = 0;
  let ordersHtml = "";

  orderDetailsArray.forEach((orderDetails, index) => {
    let orderHtml = `
    <div class="order-details">
    <div class="order-container">
    <img class="product-image" src="${finalProductImgs[index]}" alt="Final Product Image" />
                <div class="order-info">
  `;

    orderHtml += `<p><strong>Order ID:</strong> ${orderDetails._id}</p>`;
    orderHtml += `<p><strong>Product ID:</strong> ${orderDetails.ProductId}</p>`;

    if (orderDetails.Font) {
      orderHtml += `<p><strong>Font:</strong> ${orderDetails.Font}</p>`;
    }
    if (orderDetails.FontSize !== undefined) {
      orderHtml += `<p><strong>Font Size:</strong> ${orderDetails.FontSize}px</p>`;
    }
    if (orderDetails.Text) {
      orderHtml += `<p><strong>Text:</strong> ${orderDetails.Text}</p>`;
    }
    if (orderDetails.Color) {
      orderHtml += `<p><strong>Color:</strong> ${orderDetails.Color}</p>`;
    }
    if (orderDetails.Quantity) {
      orderHtml += `<p><strong>Quantity:</strong> ${orderDetails.Quantity}</p>`;
    }

    // Close the order-info div
    orderHtml += `
      </div>
    </div>
    <p><strong>Total Cost for this order:</strong> $${orderDetails.FinalCost}</p>
        </div>
  `;

    Total += orderDetails.FinalCost;
    ordersHtml += orderHtml;
  });

  const htmlContent = `
    <style>
        .order-details {
            margin: 0 5vw;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 3vh
        }
        .order-container{
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            display: flex;
            flex-wrap: wrap;        
        }

        .product-image{
            width: 350px;
            margin-right: 2vw;
        }

        .Total-cost{
            font-size: 20px;
        }

         @media (max-width: 768px) {
          .order-container{
             display: block;
          }
        }
        </style>
    <div class="email-container">
      <h1>Thank You for Your Orders, ${fullName}!</h1>
      <p>We are excited to let you know that your orders have been successfully placed. Here are your order details:</p>

      ${ordersHtml}
      <p class="Total-cost"><strong>Total Amount is: </strong> ${Total}</p>
      <p class="thank-you">Thank you for choosing WearMyArt! If you have any questions, feel free to contact us.</p>
    </div>
  `;

  const name = "WearMyArt Order Confirmation";
  const subject = "Thank You for Your Orders!";

  await SendMail(email, name, subject, htmlContent);
};

export { sendMail, sendOrderConfirmationEmail };
