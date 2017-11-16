#! /usr/bin/env sh

PROJECTNAME="react-redux-feathers"

docker run -it \
  --expose=8080 \
  -p 8080:8080 -p 3030:3030 \
  $PROJECTNAME \
  npm start
