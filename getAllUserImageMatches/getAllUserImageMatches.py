import boto3
import psycopg2
import dbCursor as db
import json


def main(event, context):
    user = event["queryStringParameters"]["user"].lower()
    s3 = boto3.client('s3')
    photos = []
    ret = { "matches": [], "name": user}
    for key in s3.list_objects(Bucket='sdhack')['Contents']:
        if len(key['Key'].split("/")) > 1:
            pass
        else:
            retImg = {
                    'img': 'https://s3-us-west-2.amazonaws.com/sdhack/{}'.format(key['Key']),
                    'key': key['Key']
                    }

            photos.append(retImg)
    print(photos)
    client = boto3.client('rekognition')

    for photo in photos:
        print(photo['key'])
        resp = client.compare_faces(SourceImage={
            'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': 'users/{}.jpg'.format(user)
                        }
                    },
                TargetImage={
                    'S3Object': {
                        'Bucket': 'sdhack',
                        'Name': photo['key']
                        }
                    }
                )
        print(resp)
        match = resp["FaceMatches"]
        print(match)
        if len(match) != 0:
            ret["matches"].append(photo['key'])

        

    return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                    },
                'body': json.dumps(ret, default = str)
                }


