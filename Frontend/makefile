
# Generate typescript-node client
gtn:
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
			-i https://3b7krqgdca.execute-api.ap-northeast-2.amazonaws.com/internal/docs/yaml \
			-g typescript-fetch \
			-o /local/src/api/client


# 3b7krqgdca