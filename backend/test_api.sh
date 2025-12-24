#!/bin/bash

# Test script for the deployed FastAPI backend
# Usage: ./test_api.sh <your-backend-url>
# Example: ./test_api.sh https://api.hackthebias.dev

if [ -z "$1" ]; then
    echo "Usage: ./test_api.sh <your-backend-url>"
    echo "Example: ./test_api.sh https://api.hackthebias.dev"
    exit 1
fi

BASE_URL="$1"

echo "========================================="
echo "Testing Backend API: $BASE_URL"
echo "========================================="
echo ""

# Test 1: Root endpoint
echo "1. Testing root endpoint (/api/)..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')
echo "   Status: $http_code"
echo "   Response: $body"
if [ "$http_code" = "200" ]; then
    echo "   ✅ PASSED"
else
    echo "   ❌ FAILED"
fi
echo ""

# Test 2: Health check
echo "2. Testing health check (/api/health)..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/health")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')
echo "   Status: $http_code"
echo "   Response: $body"
if [ "$http_code" = "200" ]; then
    echo "   ✅ PASSED"
else
    echo "   ❌ FAILED"
fi
echo ""

# Test 3: Database health check
echo "3. Testing database health check (/api/health/db)..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BASE_URL/api/health/db")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')
echo "   Status: $http_code"
echo "   Response: $body"
if [ "$http_code" = "200" ]; then
    echo "   ✅ PASSED"
else
    echo "   ❌ FAILED"
fi
echo ""

# Test 4: Pre-register endpoint (should fail without proper data, but should return 422, not 500)
echo "4. Testing pre-register endpoint (/api/preregister)..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/preregister" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","captchaToken":"test-token"}')
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')
echo "   Status: $http_code"
echo "   Response: $body"
if [ "$http_code" = "200" ] || [ "$http_code" = "400" ] || [ "$http_code" = "422" ]; then
    echo "   ✅ PASSED (endpoint is responding)"
else
    echo "   ❌ FAILED"
fi
echo ""

echo "========================================="
echo "Testing complete!"
echo "========================================="










