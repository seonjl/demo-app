ci:
	rm -rf node_modules
	yarn install --prod

clean:
	rm -rf node_modules
	rm -rf dist

build:
	rm -rf dist
	npx tsc

build-docs:
	rm -rf docs
	make build
	node scripts/build-docs.js

deploy:
	make build
	make build-docs
	serverless deploy \
		--stage production \
		--region ap-northeast-2 \
		--aws-profile personal

FUNCTION_NAME = v1_chat_list
FUNCTION_NAME = chatroom_table_stream_trigger

target:
	make build
	serverless deploy function \
		--function $(FUNCTION_NAME) \
		--stage production \
		--region ap-northeast-2 \
		--aws-profile personal \
		--force

TEMPLATE_FILE = cloudformation/template.yml

deploy-sam: 
	sam deploy \
		--template-file $(TEMPLATE_FILE)


# Makefile for deploying CloudFormation stacks

# Variables
STACK_PREFIX := tms-app
REGION := ap-northeast-2
TEMPLATE_DIR := cloudformation
BUCKET_NAME := dep-buckets

# Stack Names
DYNAMODB_STACK := $(STACK_PREFIX)-dynamodb
S3_SNS_STACK := $(STACK_PREFIX)-s3-sns
LAMBDA_ROLES_STACK := $(STACK_PREFIX)-security-groups
LIVE_STREAMING_STACK := $(STACK_PREFIX)-live-streaming

# AWS CLI Deploy Commands
deploy-dynamodb:
	aws cloudformation deploy \
		--stack-name $(DYNAMODB_STACK) \
		--template-file $(TEMPLATE_DIR)/dynamodb-resources.yml \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(REGION)
		
deploy-s3-sns:
	aws cloudformation deploy \
		--stack-name $(S3_SNS_STACK) \
		--template-file $(TEMPLATE_DIR)/s3-sns-resources.yml \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(REGION)

deploy-security-groups:
	aws cloudformation deploy \
		--stack-name $(LAMBDA_ROLES_STACK) \
		--template-file $(TEMPLATE_DIR)/security-groups.yml \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(REGION)

deploy-live-streaming:
	aws cloudformation deploy \
		--stack-name $(LIVE_STREAMING_STACK) \
		--template-file $(TEMPLATE_DIR)/live-streaming.yml \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(REGION) \
		--s3-bucket $(BUCKET_NAME)

# Deploy all stacks in the correct order
deploy-all: deploy-dynamodb deploy-s3-sns deploy-security-groups deploy

# Delete Commands
delete-dynamodb:
	aws cloudformation delete-stack \
		--stack-name $(DYNAMODB_STACK) \
		--region $(REGION)

delete-s3-sns:
	aws cloudformation delete-stack \
		--stack-name $(S3_SNS_STACK) \
		--region $(REGION)

delete-security-groups:
	aws cloudformation delete-stack \
		--stack-name $(LAMBDA_ROLES_STACK) \
		--region $(REGION)

# Delete all stacks
delete-all: delete-security-groups delete-s3-sns delete-dynamodb deploy

# Describe stack resources
describe-dynamodb:
	aws cloudformation describe-stacks \
		--stack-name $(DYNAMODB_STACK) \
		--region $(REGION)

describe-s3-sns:
	aws cloudformation describe-stacks \
		--stack-name $(S3_SNS_STACK) \
		--region $(REGION)

describe-security-groups:
	aws cloudformation describe-stacks \
		--stack-name $(LAMBDA_ROLES_STACK) \
		--region $(REGION)

describe-all: describe-dynamodb describe-s3-sns describe-security-groups

# Help Command
help:
	@echo "Usage:"
	@echo "  make deploy       Deploy the SAM application"
	@echo "  make package      Package the SAM application"
	@echo "  make clean        Clean up generated files"
	@echo "  make deploy-dynamodb         - Deploy the DynamoDB stack"
	@echo "  make deploy-s3-sns            - Deploy the S3 and SNS stack"
	@echo "  make deploy-security-groups      - Deploy the Lambda Roles stack"
	@echo "  make deploy-all               - Deploy all stacks in order"
	@echo "  make delete-dynamodb          - Delete the DynamoDB stack"
	@echo "  make delete-s3-sns            - Delete the S3 and SNS stack"
	@echo "  make delete-security-groups      - Delete the Lambda Roles stack"
	@echo "  make delete-all               - Delete all stacks"
	@echo "  make describe-dynamodb        - Describe the DynamoDB stack"
	@echo "  make describe-s3-sns          - Describe the S3 and SNS stack"
	@echo "  make describe-security-groups    - Describe the Lambda Roles stack"
	@echo "  make describe-all             - Describe all stacks"
	@echo "  make help                     - Display this help message"
