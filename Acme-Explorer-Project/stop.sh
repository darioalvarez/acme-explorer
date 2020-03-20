BASE_SITE=acme-explorer.do1920.com
export MONGODBHOSTNAME=mongo

#development
export NODE_ENV=development
export PORT=8001
export DBPORT=27018
export VIRTUAL_HOST=${NODE_ENV}.${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} down

#production
export NODE_ENV=production
export PORT=8080
export DBPORT=27017
export VIRTUAL_HOST=${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} down