#!/bin/bash

# === Editable section ===
BODY='{"prompt":"A boy is playing football at sky and scored a goal and celebrated goal like messi"}'
SECRET="9ab8253b556bbb1b3c4346b8ecb39a0ef840a2dd56800f6441f1b4bd7f37602e"
URL="http://localhost:3000/media/generate-image"
# ========================

# ✅ Reliable millisecond timestamp for macOS
TIMESTAMP=$(($(date +%s)*1000))

# Generate HMAC signature
SIGNATURE=$(echo -n "$BODY|$TIMESTAMP" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Print debug info
echo "🟡 Body:         $BODY"
echo "🕓 X-Timestamp:  $TIMESTAMP"
echo "🔐 X-Signature:  $SIGNATURE"
echo "🌐 API URL:      $URL"
echo "------------------------------------"

# Send request with curl
RESPONSE=$(curl -s -w "\n\n✅ HTTP %{http_code}\n" -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-Timestamp: $TIMESTAMP" \
  -H "X-Signature: $SIGNATURE" \
  --data "$BODY")

# Show the response
echo "$RESPONSE"
