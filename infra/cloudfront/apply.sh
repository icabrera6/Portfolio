#!/usr/bin/env bash
# Applies the CloudFront setup for icabrera-portfolio.com (distribution E34Z96GLOCBRS4):
#   1. CloudFront Function "portfolio-redirects" (www -> apex, /index.html -> /), tested before publishing
#   2. Response headers policy "portfolio-security-headers" (HSTS, CSP, nosniff, frame and referrer policies)
#   3. Distribution: attach both, and answer missing objects (S3 403/404) with /404.html and a real 404
# /404.html and /404.v1.css must already be deployed. Safe to re-run: it updates what already exists.
set -euo pipefail

DIST_ID=E34Z96GLOCBRS4
FN=portfolio-redirects
POLICY=portfolio-security-headers
DIR="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"

# 1. Redirect function
FN_CONFIG='Comment=www and /index.html redirects,Runtime=cloudfront-js-2.0'
if aws cloudfront describe-function --name "$FN" >/dev/null 2>&1; then
    ETAG=$(aws cloudfront describe-function --name "$FN" --query ETag --output text)
    aws cloudfront update-function --name "$FN" --if-match "$ETAG" \
        --function-config "$FN_CONFIG" --function-code "fileb://$DIR/redirects.js" >/dev/null
else
    aws cloudfront create-function --name "$FN" \
        --function-config "$FN_CONFIG" --function-code "fileb://$DIR/redirects.js" >/dev/null
fi
ETAG=$(aws cloudfront describe-function --name "$FN" --query ETag --output text)

cat > "$TMP/event.json" <<'EOF'
{"version": "1.0", "context": {"eventType": "viewer-request"}, "viewer": {"ip": "198.51.100.1"},
 "request": {"method": "GET", "uri": "/", "querystring": {}, "cookies": {},
             "headers": {"host": {"value": "www.icabrera-portfolio.com"}}}}
EOF
aws cloudfront test-function --name "$FN" --if-match "$ETAG" --stage DEVELOPMENT \
    --event-object "fileb://$TMP/event.json" --query 'TestResult.FunctionOutput' --output text \
    | grep -q '"statusCode":301' || { echo "Function test failed; nothing published." >&2; exit 1; }
aws cloudfront publish-function --name "$FN" --if-match "$ETAG" >/dev/null
FN_ARN=$(aws cloudfront describe-function --name "$FN" --stage LIVE \
    --query 'FunctionSummary.FunctionMetadata.FunctionARN' --output text)
echo "Function published: $FN_ARN"

# 2. Security headers policy
POLICY_ID=$(aws cloudfront list-response-headers-policies --type custom --output text \
    --query "ResponseHeadersPolicyList.Items[?ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name=='$POLICY'].ResponseHeadersPolicy.Id")
if [ -z "$POLICY_ID" ] || [ "$POLICY_ID" = "None" ]; then
    POLICY_ID=$(aws cloudfront create-response-headers-policy \
        --response-headers-policy-config "file://$DIR/response-headers-policy.json" \
        --query 'ResponseHeadersPolicy.Id' --output text)
else
    PETAG=$(aws cloudfront get-response-headers-policy --id "$POLICY_ID" --query ETag --output text)
    aws cloudfront update-response-headers-policy --id "$POLICY_ID" --if-match "$PETAG" \
        --response-headers-policy-config "file://$DIR/response-headers-policy.json" >/dev/null
fi
echo "Headers policy: $POLICY_ID"

# 3. Distribution (the previous config is kept in $TMP for rollback)
aws cloudfront get-distribution-config --id "$DIST_ID" > "$TMP/previous.json"
DETAG=$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1]))["ETag"])' "$TMP/previous.json")
python3 - "$TMP/previous.json" "$TMP/next.json" "$FN_ARN" "$POLICY_ID" <<'EOF'
import json, sys
cfg = json.load(open(sys.argv[1]))['DistributionConfig']
behaviour = cfg['DefaultCacheBehavior']
behaviour['FunctionAssociations'] = {'Quantity': 1, 'Items': [{'FunctionARN': sys.argv[3], 'EventType': 'viewer-request'}]}
behaviour['ResponseHeadersPolicyId'] = sys.argv[4]
cfg['CustomErrorResponses'] = {'Quantity': 2, 'Items': [
    {'ErrorCode': code, 'ResponsePagePath': '/404.html', 'ResponseCode': '404', 'ErrorCachingMinTTL': 60}
    for code in (403, 404)
]}
json.dump(cfg, open(sys.argv[2], 'w'))
EOF
aws cloudfront update-distribution --id "$DIST_ID" --if-match "$DETAG" \
    --distribution-config "file://$TMP/next.json" --query 'Distribution.Status' --output text
echo "Previous distribution config: $TMP/previous.json"
echo "Waiting for CloudFront to deploy (a few minutes)..."
aws cloudfront wait distribution-deployed --id "$DIST_ID"
echo "Deployed."
