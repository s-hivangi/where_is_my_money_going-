import logging


def get_logger(name: str = "where_is_my_money_going") -> logging.Logger:
	logger = logging.getLogger(name)
	if logger.handlers:
		return logger

	handler = logging.StreamHandler()
	handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
	logger.addHandler(handler)
	logger.setLevel(logging.INFO)
	logger.propagate = False
	return logger
