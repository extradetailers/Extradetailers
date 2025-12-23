# Google Cloud Run

 - [Official docs for deploying node.js app](https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)
 - [Official docs for running container](https://docs.cloud.google.com/run/docs/quickstarts/deploy-container)
 - [Tutorial](https://youtu.be/sqUuofLBfFw)
 - We must run on port 8080 
 - Create `Dockerfile` and run it successfully on local machine
 - Enable google `cloud run` api and `cloud build` API
 - Install [google CLI (Optional)](https://docs.cloud.google.com/sdk/docs/install-sdk)
 - Create repository from artifiact
 - Set permissions from `IAM`. Add role `Storage Object Viewer`
 - Go to google cloud run and select the image from artifiacts
 - [Very informative video](https://youtu.be/v4c6yFk-Pto)
 
### With github actions
 - [Tutorial](https://youtu.be/v4c6yFk-Pto?t=2103), [Tutorial 2](https://www.youtube.com/watch?v=qhXoyD-XHKc), [Tutorial 3](https://youtu.be/4FRjoc9ycNs)
 - From github repo, go to codebase, change code.
 - Make changes and create a fork
 - From github actions, search for build and deploy to cloud run




### Google Cloud SQL
 - [Tutorial](https://www.youtube.com/watch?v=q79BT6Lo5Hg&t=1s)


### Architecture Overview

GitHub Push (master)
   ↓
GitHub Actions
   ↓ (OIDC auth, no keys)
Build Docker Image
   ↓
Push to Artifact Registry
   ↓
Deploy to Cloud Run
   ↓
Cloud Run → Cloud SQL (via Cloud SQL Connector)
