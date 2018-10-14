import psycopg2
from boto3 import client
import json
import dbCursor as db


def main(event, context):
    conn = client('s3')
    ret = {
            'photos': []
            }
    for key in conn.list_objects(Bucket='sdhack')['Contents']:
        if len(key['Key'].split("/")) > 1:
            pass
        else:
            retImg = {
                    'img': 'https://s3-us-west-2.amazonaws.com/sdhack/{}'.format(key['Key']),
                    'key': key['Key']
                    }
            ret["photos"].append(retImg)

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
