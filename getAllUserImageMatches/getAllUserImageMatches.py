import boto3
import psycopg2
import dbCursor as db
import json


def main(event, context):
    user = event["queryStringParameters"]["user"].lower()
    s3 = boto3.client('s3')
    photos = []
    ret = { "match": []}
    for key in s3.list_objects(Bucket='sdhack')['Contents']:
        if len(key['Key'].split("/")) > 1:
            pass
        else:
            retImg = {
                    'img': 'https://s3-us-west-2.amazonaws.com/sdhack/{}'.format(key['Key']),
                    'key': key['Key']
                    }

            photos.append(retImg)
    client = boto3.client('rekognition')

    for photo in photos:
        resp = client.compare_faces(

                SourceImage={
                    'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': 'users/{}'.format(user[4])
                        }
                    },
                TargetImage={
                    'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': photo['key']
                        }
                    }
                )
        match = resp["FaceMatches"]
        if len(match) != 0:
            userRet={
                    'name': '{} {}'.format(user[2],user[3]),
                    'id': user[0]
                    }
            ret["matches"].append(userRet)

        

        return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                    },
                'body': json.dumps(ret, default = str)
                }
