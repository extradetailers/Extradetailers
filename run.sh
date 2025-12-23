#!/usr/bash

sudo docker compose up --build -d
sudo docker ps -a
sudo docker compose logs
sudo docker logs <container_id_or_name>
sudo docker compose down -v
