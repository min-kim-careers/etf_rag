#!/bin/sh

embedding_model=nomic-embed-text

ollama serve &
until ollama list > /dev/null 2>&1; do sleep 1; done

if ! ollama list | grep -q "$embedding_model"; then
    ollama pull $embedding_model
fi

wait