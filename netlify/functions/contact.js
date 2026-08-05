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

        const data = JSON.parse(event.body);

        const {

            name,

            email,

            phone,

            subject,

            message

        } = data;

        if (!name || !email || !message) {

            return {

                statusCode: 400,

                body: JSON.stringify({

                    message: "Required fields missing."

                })

            };

        }

        /* ===========================
           EMAIL TO TASTY KAAWA
        ============================ */

        const adminHtml = `

<h2>New Website Contact</h2>

<p><strong>Name:</strong> ${name}</p>

<p><strong>Email:</strong> ${email}</p>

<p><strong>Telephone:</strong> ${phone || "Not provided"}</p>

<p><strong>Subject:</strong> ${subject}</p>

<hr>

<p>${message}</p>

`;

        await resend.emails.send({

            from: "Tasty Kaawa <onboarding@resend.dev>",

            to: "tastykaawa@gmail.com",

            replyTo: email,

            subject: `Website Contact - ${subject}`,

            html: adminHtml

        });

        /* ===========================
           CUSTOMER CONFIRMATION
        ============================ */

        const customerHtml = `

<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

<h2>Thank You for Contacting Tasty Kaawa</h2>

<p>Dear <strong>${name}</strong>,</p>

<p>

Thank you for contacting Tasty Kaawa.

We have received your message and our team will respond as soon as possible.

</p>

<hr>

<p><strong>Your Subject:</strong></p>

<p>${subject}</p>

<p><strong>Your Message:</strong></p>

<p>${message}</p>

<hr>

<p>

Regards,<br>

<strong>Tasty Kaawa</strong>

</p>

</div>

`;

        await resend.emails.send({

            from: "Tasty Kaawa <onboarding@resend.dev>",

            to: email,

            subject: "We have received your message",

            html: customerHtml

        });

        return {

            statusCode: 200,

            body: JSON.stringify({

                success: true,

                message: "Message sent successfully."

            })

        };

    }

    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                success: false,

                message: error.message

            })

        };

    }

};