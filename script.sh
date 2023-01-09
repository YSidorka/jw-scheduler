#docker container kill $(docker ps -aq)
#docker system prune --force
#docker build -t ysidorko/_template -f ./Dockerfile ./

#docker run -d -p 80:80 ysidorko/_template
#docker run -it -v ${pwd}/data:/usr/app/data -p 80:80 ysidorko/_template  # for debugging (PowerShell)

docker-compose stop
docker-compose up --build
