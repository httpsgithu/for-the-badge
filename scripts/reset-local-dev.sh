#!/bin/bash

# Script to reset local development data
# This clears the database, KV store, and cache to start fresh

echo "⚠️  This will delete all local development data (database, KV, cache)"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Stop the dev server if it's running
echo "🛑 Stopping dev server (if running)..."
pkill -f "yarn dev" || true
sleep 2

# Remove local data
echo "🗑️  Removing local development data..."
rm -rf .data/hub/database/*
rm -rf .data/hub/kv/*
rm -rf .data/hub/cache/*
rm -rf .data/hub/d1/*

echo "✅ Local development data cleared!"
echo ""
echo "📝 Note: You should also clear your browser cookies for localhost:3000"
echo "   to remove any stale sessions."
echo ""
echo "🚀 You can now run 'yarn dev' to start fresh."
