import psycopg2
import boto3
import json
import dbCursor as db


def main(event, context):
    with db.DatabaseCursor('./config.json') as cur:
        cur.execute('''SELECT * FROM "User"''')
        users = cur.fetchall()
    ret={
            'users': []
            }
    for user in users:
        userRet={
                'name': '{} {}'.format(user[2],user[3]),
                'id': user[0],
                'img': 'https://s3-us-west-2.amazonaws.com/sdhack/users/{}'.format(user[4])

                }
        ret["users"].append(userRet)

    return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                    },
                'body': json.dumps(ret, default = str)
                }

if __name__ == "__main__":
    event = {
            'queryStringParameters': {
                'photo': '3.jpg'
                }
            }
    context = None
    main(event, context)
