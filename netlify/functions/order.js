const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {

    try {

        if (event.httpMethod !== "POST") {

            return {

                statusCode: 405,

                body: JSON.stringify({

                    message: "Method Not Allowed"

                })

            };

        }

        const order = JSON.parse(event.body);

        if (!order.customer) {

            return {

                statusCode: 400,

                body: JSON.stringify({

                    message: "Customer information missing."

                })

            };

        }

        if (!order.items || order.items.length === 0) {

            return {

                statusCode: 400,

                body: JSON.stringify({

                    message: "No products supplied."

                })

            };

        }
                /* ==========================================
           BUILD ORDER TABLE
        ========================================== */

        let itemsHtml = "";

        let grandTotal = 0;

        order.items.forEach(item => {

            const lineTotal = item.unitPrice * item.quantity;

            grandTotal += lineTotal;

            itemsHtml += `

<tr>

<td style="padding:8px;border:1px solid #ddd;">

${item.name}

</td>

<td style="padding:8px;border:1px solid #ddd;">

${item.quantity}

</td>

<td style="padding:8px;border:1px solid #ddd;">

UGX ${Number(item.unitPrice).toLocaleString()}

</td>

<td style="padding:8px;border:1px solid #ddd;">

UGX ${Number(lineTotal).toLocaleString()}

</td>

</tr>

`;

        });

        const adminHtml = `

<h2>New Coffee Order</h2>

<p>

<b>Order Number:</b>

${order.orderNumber}

</p>

<p>

<b>Name:</b>

${order.customer.name}

</p>

<p>

<b>Email:</b>

${order.customer.email}

</p>

<p>

<b>Phone:</b>

${order.customer.phone}

</p>

<p>

<b>Location:</b>

${order.customer.location}

</p>

<p>

<b>Customer Type:</b>

${order.customer.customerType}

</p>

<table
style="border-collapse:collapse;width:100%;">

<thead>

<tr>

<th>Product</th>

<th>Qty</th>

<th>Unit Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${itemsHtml}

</tbody>

</table>

<h3>

Grand Total:

UGX ${Number(grandTotal).toLocaleString()}

</h3>

<p>

<b>Notes:</b>

${order.customer.notes || "None"}

</p>

`;
        /* ==========================================
           SEND ADMIN EMAIL
        ========================================== */

        await resend.emails.send({

            from: "Tasty Kaawa <onboarding@resend.dev>",

            to: "tastykaawa@gmail.com",

            replyTo: order.customer.email,

            subject: `☕ New Coffee Order - ${order.orderNumber}`,

            html: adminHtml

        });


        /* ==========================================
           CUSTOMER CONFIRMATION EMAIL
        ========================================== */

        const customerHtml = `

<div style="font-family:Arial,sans-serif;
max-width:650px;
margin:auto;">

<h2 style="color:#5A3A22;">

Thank You for Your Order

</h2>

<p>

Dear ${order.customer.name},

</p>

<p>

Thank you for your interest in
<strong>Tasty Kaawa</strong>.

We have successfully received your
coffee order inquiry.

</p>

<p>

<strong>Order Number:</strong>

${order.orderNumber}

</p>

<p>

Our sales team will review your request
and contact you shortly with pricing,
availability and delivery information.

</p>

<h3>

Order Summary

</h3>

<table
style="width:100%;
border-collapse:collapse;">

<thead>

<tr>

<th align="left">

Product

</th>

<th>

Qty

</th>

</tr>

</thead>

<tbody>

${order.items.map(item=>`

<tr>

<td>

${item.name}

</td>

<td align="center">

${item.quantity}

</td>

</tr>

`).join("")}

</tbody>

</table>

<p>

Thank you for choosing

<strong>Tasty Kaawa</strong>.

</p>

<hr>

<p style="font-size:12px;color:#777;">

Tasty Kaawa

Premium Ugandan Fine Robusta Coffee

Email:

tastykaawa@gmail.com

</p>

</div>

`;

        await resend.emails.send({

            from: "Tasty Kaawa <onboarding@resend.dev>",

            to: order.customer.email,

            subject: `Order Confirmation - ${order.orderNumber}`,

            html: customerHtml

        });
                /* ==========================================
           SUCCESS RESPONSE
        ========================================== */

        return {

            statusCode: 200,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                success: true,

                message: "Order submitted successfully.",

                orderNumber: order.orderNumber

            })

        };

    }

    catch (error) {

        console.error("Order Function Error:", error);

        return {

            statusCode: 500,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                success: false,

                message: "Failed to send order.",

                error: error.message

            })

        };

    }

};