BASE_SITE=acme-explorer.do1920.com

#development
export MONGODBHOSTNAME=mongo
export NODE_ENV=development
export PORT=8001
export DBPORT=27018
export VIRTUAL_HOST=${NODE_ENV}.${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} up -d

#production
export MONGODBHOSTNAME=mongo
export NODE_ENV=production
export PORT=8080
export DBPORT=27017
export VIRTUAL_HOST=${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} up -d
#docker-compose -p ${VIRTUAL_HOST} up -d