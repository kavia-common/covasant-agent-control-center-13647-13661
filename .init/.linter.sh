#!/bin/bash
cd /home/kavia/workspace/code-generation/covasant-agent-control-center-13647-13661/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

