# Remove any previous deployments
rm deploy.zip

# Zip everything
zip -X -r deploy.zip .

# Send zip to Lambda function
aws lambda update-function-code \
	--function-name getUsers \
      	--zip-file fileb://deploy.zip

# Remove deployment
rm deploy.zip
