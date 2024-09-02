y | docker system prune

# Stop all containers and running images
docker stop $(docker ps -a -q)

# Remove all images
docker rmi $(docker images -a -q) --force

# Remove all containers
docker rm $(docker ps -a -q) --force


# Build and run the app
docker build -t kapeburgis-service .
docker run -d --restart unless-stopped -p 5001:5001 --name kapeburgis-app kapeburgis-service