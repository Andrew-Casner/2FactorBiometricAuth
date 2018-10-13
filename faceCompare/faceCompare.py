import psycopg2
import boto3
import json
import dbCursor as db


def main(event, context):
    client = boto3.client('rekognition')
    with db.DatabaseCursor('./config.json') as cur:
        cur.execute('''SELECT * FROM "User"''')
        users = cur.fetchall()
    ret={
            'users': []
            }
    for user in users:
        resp = client.compare_faces(
                SourceImage={
                    'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': user[4]
                        }
                    },
                TargetImage={
                    'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': event["queryStringParameters"]["photo"]
                        }
                    }
                )
        match = resp["FaceMatches"]
        if len(match) != 0:
            userRet={
                    'name': '{} {}'.format(user[2],user[3]),
                    'id': user[0]
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
