from contextlib import contextmanager
from pathlib import Path
import sqlite3

from config import settings


def _sqlite_path() -> str:
	prefix = "sqlite:///"
	if settings.database_url.startswith(prefix):
		return settings.database_url.removeprefix(prefix)
	return settings.database_url


@contextmanager
def get_connection():
	database_path = _sqlite_path()
	connection = sqlite3.connect(database_path)
	connection.row_factory = sqlite3.Row
	try:
		yield connection
		connection.commit()
	finally:
		connection.close()


def initialize_database() -> None:
	database_path = Path(_sqlite_path())
	if database_path.parent and not database_path.parent.exists():
		database_path.parent.mkdir(parents=True, exist_ok=True)

	with get_connection() as connection:
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS statements (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				filename TEXT NOT NULL,
				uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS transactions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				statement_id INTEGER,
				description TEXT NOT NULL,
				amount REAL NOT NULL,
				category TEXT NOT NULL,
				occurred_at TEXT NOT NULL,
				FOREIGN KEY(statement_id) REFERENCES statements(id)
			)
			"""
		)
