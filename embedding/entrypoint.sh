#!/bin/sh

ollama serve &
until ollama list > /dev/null 2>&1; do sleep 1; done
if ! ollama list | grep -q "nomic-embed-text"; then
    ollama pull nomic-embed-text
fi
wait