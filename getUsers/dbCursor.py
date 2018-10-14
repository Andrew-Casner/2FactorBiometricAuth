import psycopg2
import json

class DatabaseCursor(object):

    def __init__(self, conn_config_file):
        with open(conn_config_file) as config_file:
            self.conn_config = json.load(config_file)

    def __enter__(self):
        self.conn = psycopg2.connect(
            "dbname='" + self.conn_config['dbname'] + "' " +
            "user='" + self.conn_config['user'] + "' " +
            "host='" + self.conn_config['host'] + "' " +
            "password='" + self.conn_config['password'] + "' " +
            "port=" + self.conn_config['port'] + " "
        )
        self.cur = self.conn.cursor()
        self.cur.execute("SET search_path TO " + self.conn_config['schema'])

        return self.cur

    def __exit__(self, exc_type, exc_val, exc_tb):
        # some logic to commit/rollback
        self.conn.commit()
        self.conn.close()
