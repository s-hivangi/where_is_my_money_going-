from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from dataclasses import dataclass

from config import settings


@dataclass(frozen=True)
class TokenPayload:
	sub: str
	exp: int


def _sign(payload: str, secret: str) -> str:
	digest = hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).digest()
	return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")


def create_access_token(sub: str, expires_in_minutes: int | None = None) -> str:
	expires_in_minutes = expires_in_minutes or settings.access_token_expire_minutes
	payload = TokenPayload(sub=sub, exp=int(time.time()) + expires_in_minutes * 60)
	payload_json = json.dumps(payload.__dict__, separators=(",", ":"), sort_keys=True)
	encoded_payload = base64.urlsafe_b64encode(payload_json.encode("utf-8")).decode("utf-8").rstrip("=")
	signature = _sign(encoded_payload, settings.secret_key)
	return f"{encoded_payload}.{signature}"


def verify_access_token(token: str) -> TokenPayload:
	try:
		encoded_payload, signature = token.split(".", 1)
		expected_signature = _sign(encoded_payload, settings.secret_key)
		if not hmac.compare_digest(signature, expected_signature):
			raise ValueError("Invalid token signature")

		padded = encoded_payload + "=" * (-len(encoded_payload) % 4)
		payload_data = json.loads(base64.urlsafe_b64decode(padded.encode("utf-8")).decode("utf-8"))
		payload = TokenPayload(**payload_data)
		if payload.exp < int(time.time()):
			raise ValueError("Token expired")
		return payload
	except Exception as exc:  # pragma: no cover - defensive boundary
		raise ValueError("Invalid access token") from exc
