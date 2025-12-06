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
