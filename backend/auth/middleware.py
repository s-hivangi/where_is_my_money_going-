from starlette.middleware.base import BaseHTTPMiddleware

from auth.jwt import verify_access_token


class AuthMiddleware(BaseHTTPMiddleware):
	async def dispatch(self, request, call_next):
		authorization = request.headers.get("authorization", "")
		if authorization.lower().startswith("bearer "):
			token = authorization.split(" ", 1)[1].strip()
			try:
				request.state.token_payload = verify_access_token(token)
			except ValueError:
				request.state.token_payload = None
		else:
			request.state.token_payload = None

		return await call_next(request)
