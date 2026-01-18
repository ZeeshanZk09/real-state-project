// Email templates for property inquiries and notifications

export interface InquiryEmailData {
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone?: string;
  message: string;
  propertyUrl: string;
  propertyImage?: string;
}

export interface PropertyOwnerEmailData {
  ownerName: string;
  propertyTitle: string;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone?: string;
  message: string;
  dashboardUrl: string;
}

/**
 * Email template for property owners when they receive an inquiry
 */
export function createOwnerNotificationTemplate(
  data: PropertyOwnerEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Property Inquiry</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #3b82f6;
                margin: 0;
                font-size: 24px;
            }
            .content {
                margin-bottom: 30px;
            }
            .property-title {
                font-size: 20px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
            }
            .inquiry-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .contact-info {
                background: #e1f5fe;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }
            .button {
                display: inline-block;
                background: #3b82f6;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏠 New Property Inquiry</h1>
                <p>You've received a new inquiry from Hamid-Homes</p>
            </div>

            <div class="content">
                <p>Hello ${data.ownerName},</p>

                <p>Great news! You've received a new inquiry for your property:</p>

                <div class="property-title">
                    ${data.propertyTitle}
                </div>

                <div class="inquiry-details">
                    <h3>📝 Inquiry Details</h3>
                    <p><strong>Message:</strong></p>
                    <p style="font-style: italic; padding: 10px; background: white; border-left: 4px solid #3b82f6;">
                        "${data.message}"
                    </p>
                </div>

                <div class="contact-info">
                    <h3>👤 Contact Information</h3>
                    <p><strong>Name:</strong> ${data.inquirerName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${data.inquirerEmail}">${data.inquirerEmail}</a></p>
                    ${data.inquirerPhone ? `<p><strong>Phone:</strong> <a href="tel:${data.inquirerPhone}">${data.inquirerPhone}</a></p>` : ""}
                </div>

                <p>You can respond directly to this email or contact them using the information above.</p>

                <a href="${data.dashboardUrl}" class="button">View in Dashboard</a>
            </div>

            <div class="footer">
                <p>This email was sent by Hamid-Homes Real Estate Platform</p>
                <p>© 2026 Hamid-Homes. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

/**
 * Email template for inquirers confirming their inquiry was sent
 */
export function createInquiryConfirmationTemplate(
  data: InquiryEmailData,
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #10b981;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #10b981;
                margin: 0;
                font-size: 24px;
            }
            .success-icon {
                font-size: 48px;
                color: #10b981;
                margin-bottom: 10px;
            }
            .property-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #10b981;
            }
            .property-title {
                font-size: 20px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
            }
            .property-price {
                font-size: 18px;
                font-weight: bold;
                color: #059669;
                margin-bottom: 10px;
            }
            .button {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">✅</div>
                <h1>Inquiry Sent Successfully!</h1>
                <p>Thank you for your interest in this property</p>
            </div>

            <div class="content">
                <p>Hello ${data.inquirerName},</p>

                <p>Your inquiry has been successfully sent to the property owner. Here's a summary:</p>

                <div class="property-card">
                    ${data.propertyImage ? `<img src="${data.propertyImage}" alt="Property" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : ""}

                    <div class="property-title">
                        ${data.propertyTitle}
                    </div>

                    <div class="property-price">
                        $${data.propertyPrice.toLocaleString()}
                    </div>

                    <p><strong>📍 Location:</strong> ${data.propertyLocation}</p>
                </div>

                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Your message:</strong></p>
                    <p style="font-style: italic;">"${data.message}"</p>
                </div>

                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>The property owner will receive your inquiry</li>
                    <li>They'll contact you directly using the information you provided</li>
                    <li>You can view the property details anytime using the link below</li>
                </ul>

                <a href="${data.propertyUrl}" class="button">View Property Details</a>
            </div>

            <div class="footer">
                <p>Thank you for using Hamid-Homes Real Estate Platform</p>
                <p>Need help? Contact us at support@hamidestate.com</p>
                <p>© 2026 Hamid-Homes. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
