#!/bin/bash

sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/F-39-x86_64/pgdg-fedora-repo-latest.noarch.rpm
sudo dnf install -y postgresql16-server
# Must need to initialize
sudo postgresql-setup --initdb
sudo systemctl status postgresql
sudo dnf install postgresql16-devel


# Connect to postgresql
sudo -u postgres psql
      # \dn # Show All Users/Roles
      # postgres=# CREATE USER shayon with PASSWORD 'Test1234';
      # postgres=# CREATE DATABASE extradetailers_db;
      # postgres=# GRANT ALL PRIVILEGES ON DATABASE extradetailers_db TO shayon;
      # \q

      # \l # List All Databases
      # \c extradetailers_db # Switch to a Specific Database
      # \dt *.* # Show All Tables in the Current Database
      # \d accounts_user # Describe Table Structure (Columns, Data Types, etc.)

      # SELECT * FROM accounts_user;




sudo find / -name "pg_hba.conf"
sudo nano /var/lib/pgsql/data/pg_hba.conf


python manage.py makemigrations
python manage.py makemigrations accounts
python manage.py migrate
python manage.py migrate accounts


ngrok http 8000
python seed_data.py







