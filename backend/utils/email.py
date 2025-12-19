import os
import asyncio
import logging
import mailtrap as mt

logger = logging.getLogger(__name__)


async def send_prereg_email(to_email: str, name: str):
    """Send a preregistration email using Mailtrap template API.

    Uses `MAILTRAP_PASS` from env as API token and `MAIL_FROM` as sender.
    The template UUID must exist in your Mailtrap account.
    """
    token = os.getenv("MAILTRAP_PASS")
    if not token:
        logger.error("MAILTRAP_PASS is not set")
        raise ValueError("MAILTRAP_PASS required")

    sender_email = os.getenv("MAIL_FROM", "info@hackthebias.dev")

    # Build unsubscribe URL (override with UNSUBSCRIBE_BASE env var if needed)
    unsubscribe_base = os.getenv("UNSUBSCRIBE_BASE", "https://hackthebias.dev/unsubscribe")
    unsubscribe_url = f"{unsubscribe_base}?email={to_email}"

    # Prepare List-Unsubscribe header (mailto and https form)
    list_unsub_header = f"<mailto:unsubscribe@{os.getenv('MAIL_DOMAIN','hackthebias.dev')}>, <{unsubscribe_url}>"
    headers = {"List-Unsubscribe": list_unsub_header}

    # Build the MailFromTemplate payload
    mail = mt.MailFromTemplate(
        sender=mt.Address(email=sender_email, name="Hack The Bias Team"),
        to=[mt.Address(email=to_email)],
        template_uuid=os.getenv("MAILTRAP_TEMPLATE_UUID", "f3cf0bf7-b6e0-4803-aa5e-4400b3d94b59"),
        template_variables={"name": name, "unsubscribe_url": unsubscribe_url},
        headers=headers,
    )

    client = mt.MailtrapClient(token=token)

    # client.send is synchronous (uses requests). Run it in executor to avoid blocking.
    loop = asyncio.get_running_loop()
    try:
        resp = await loop.run_in_executor(None, client.send, mail)
        logger.info("Mailtrap send response: %s", resp)
        return resp
    except Exception as e:
        logger.exception("Mailtrap send failed: %s", e)
        raise


async def send_google_signup_email(to_email: str, name: str):
    """Send a welcome email to users who signed up via Google OAuth.

    Uses Mailtrap API to send custom HTML email.
    """
    token = os.getenv("MAILTRAP_PASS")
    if not token:
        logger.error("MAILTRAP_PASS is not set")
        raise ValueError("MAILTRAP_PASS required")

    sender_email = os.getenv("MAIL_FROM", "info@hackthebias.dev")

    # Plain text version
    text_content = f"""
Hi {name},

Thank you for signing up for Hack the Bias 2026!

Please complete your registration by visiting our website when you get the chance.

Complete Your Registration: https://www.hackthebias.dev/

Best,
The Hack the Bias Team
    """.strip()

    # HTML version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #153166;">Thank you for signing up for Hack the Bias 2026!</h2>

        <p>Hi {name},</p>

        <p>Please complete your registration by visiting our website when you get the chance.</p>

        <p><a href="https://www.hackthebias.dev/" style="display: inline-block; padding: 12px 24px; background: #153166; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete Your Registration</a></p>

        <div style="margin-top: 30px; font-size: 0.9em; color: #666;">
            <p>Best,<br>The Hack the Bias Team</p>
        </div>
    </div>
</body>
</html>
    """.strip()

    # Build the Mail payload (not template-based)
    mail = mt.Mail(
        sender=mt.Address(email=sender_email, name="Hack The Bias Team"),
        to=[mt.Address(email=to_email)],
        subject="Welcome to Hack the Bias 2026!",
        text=text_content,
        html=html_content,
    )

    client = mt.MailtrapClient(token=token)

    loop = asyncio.get_running_loop()
    try:
        resp = await loop.run_in_executor(None, client.send, mail)
        logger.info(f"Google signup welcome email sent to {to_email}: {resp}")
        return {"success": True, "email": to_email}
    except Exception as e:
        logger.exception("Failed to send Google signup email: %s", e)
        raise
