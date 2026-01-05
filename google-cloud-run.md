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


# Django on Google Cloud Run with GitHub Actions (Production Guide)

This document explains **how to deploy a Django backend to Google Cloud Run with continuous deployment using GitHub Actions**, backed by **Artifact Registry**, **Cloud SQL**, and **Workload Identity Federation (WIF)** — **without service account keys**.

This guide matches your exact project structure, Dockerfile, and workflow and is intended as a **repeatable reference**.

---

## 1. High-level Architecture

```
GitHub (Actions)
   │
   │  (OIDC / Workload Identity Federation)
   ▼
Google IAM (Service Account)
   │
   ├── Build & Push Docker Image → Artifact Registry
   │
   └── Deploy Image → Cloud Run Service
                         │
                         └── Connects to Cloud SQL (PostgreSQL)
```

Key principles:

* ❌ No service account keys in GitHub
* ❌ No `.env` files baked into Docker images
* ✅ Environment variables managed by Cloud Run
* ✅ Immutable Docker images

---

## 2. Project Structure (Why This Works)

```
extradetailers/
├── client/                # Frontend (separate deployment)
├── server/                # Django backend (Cloud Run service)
│   ├── Dockerfile         # Cloud Run image definition
│   ├── entrypoint.sh      # Starts Gunicorn
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/              # Django project
│   ├── apps...
│   └── staticfiles/
├── .github/workflows/     # CI/CD pipelines
└── docker-compose.yml     # Local dev only
```

**Important rules**:

* Cloud Run deploys **only `server/`**
* `.env` files are **local only**
* `docker-compose.yml` is **never used in production**

---

## 3. Artifact Registry (Docker Image Storage)

### What it does

Artifact Registry stores **versioned Docker images** built by GitHub Actions.

### Configuration (Console)

1. Go to **Artifact Registry → Repositories**
2. Create repository:

   * Format: **Docker**
   * Location: `us-central1`
   * Name: `extradetailers-backend-repo`

### IAM

Grant your **deployment service account**:

* `Artifact Registry Writer`

This allows pushing images.

---

## 4. Cloud SQL (PostgreSQL)

### What it does

Managed PostgreSQL instance used by Django.

### Configuration

* Engine: PostgreSQL
* Region: `us-central1`
* Public IP: ❌ (recommended off)
* Private IP or Unix socket: ✅

### Cloud Run connection

Cloud Run connects via:

* **Cloud SQL Auth Proxy (managed by GCP)**

In Cloud Run service settings:

* Add Cloud SQL connection
* Select your instance

Django connects using:

```python
HOST = "/cloudsql/PROJECT:REGION:INSTANCE"
```

---

## 5. Cloud Run (Django Hosting)

### What Cloud Run does

* Runs your Django container
* Scales automatically
* Injects `$PORT`

### Container contract (CRITICAL)

Your container **must**:

* Listen on `0.0.0.0:$PORT`
* Start within timeout

Your `entrypoint.sh` correctly does:

```bash
exec gunicorn core.wsgi:application \
  --bind 0.0.0.0:${PORT}
```

### Cloud Run service settings (Console)

* Port: **8080 (default)**
* Authentication: Allow unauthenticated (for public API)
* CPU: 1
* Memory: 512Mi–1Gi

---

## 6. Environment Variables (BEST PRACTICE)

### DO NOT use `.env` in production

Instead:

* Cloud Run → Service → **Variables & Secrets**

Add variables:

* `SECRET_KEY`
* `DEBUG=False`
* `ALLOWED_HOSTS=django-backend-xxxxx.run.app`
* `DB_HOST=/cloudsql/...`

Django reads them via:

```python
os.getenv("SECRET_KEY")
```

---

## 7. Workload Identity Federation (GitHub → GCP)

### Why this matters

* No JSON keys
* Short-lived credentials
* Secure & auditable

### Setup (Console)

1. IAM → Workload Identity Pools
2. Create pool: `github-identity-pool`
3. Provider type: **OIDC**
4. Issuer: `https://token.actions.githubusercontent.com`
5. Attribute mapping:

   * `google.subject = assertion.sub`

### Service Account

Create:

* `extradetailers-service-account`

Grant roles:

* Cloud Run Admin
* Artifact Registry Writer
* Cloud SQL Client
* Service Account User

Bind GitHub repo:

```
principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-identity-pool/attribute.repository/OWNER/REPO
```

---

## 8. GitHub Actions (CI/CD Pipeline)

### What happens on every push to `master`

1. GitHub authenticates to GCP via OIDC
2. Docker image is built
3. Image pushed to Artifact Registry
4. Cloud Run service updated

### Final Working Workflow

```yaml
name: Deploy Django to Cloud Run

on:
  push:
    branches: [master]

permissions:
  contents: read
  id-token: write

jobs:
  deploy_backend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v3
        with:
          workload_identity_provider: projects/570378881850/locations/global/workloadIdentityPools/github-identity-pool/providers/extradetailers-github-provider
          service_account: extradetailers-service-account@extra-detailers-project.iam.gserviceaccount.com

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker auth
        run: gcloud auth configure-docker us-central1-docker.pkg.dev --quiet

      - name: Build & Push Image
        uses: docker/build-push-action@v5
        with:
          context: ./server
          push: true
          tags: |
            us-central1-docker.pkg.dev/extra-detailers-project/extradetailers-backend-repo/django-backend:latest
            us-central1-docker.pkg.dev/extra-detailers-project/extradetailers-backend-repo/django-backend:${{ github.sha }}

      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v3
        with:
          service: django-backend
          region: us-central1
          image: us-central1-docker.pkg.dev/extra-detailers-project/extradetailers-backend-repo/django-backend:${{ github.sha }}
```

---

## 9. Common Errors You Already Avoided

| Error                     | Cause                 | Fix                            |
| ------------------------- | --------------------- | ------------------------------ |
| Unauthenticated push      | Docker not auth’d     | `gcloud auth configure-docker` |
| Container failed to start | Wrong port            | Bind to `$PORT`                |
| DisallowedHost            | Missing ALLOWED_HOSTS | Add Cloud Run domain           |
| SECRET_KEY error          | `.env` not loaded     | Use Cloud Run env vars         |

---

## 10. Final Best Practices

* One Cloud Run service = one Django backend
* No mutable containers
* No secrets in GitHub
* No `.env` in Docker images
* Separate frontend deployment

---

## 11. Result

You now have:

* 🔐 Secure CI/CD
* 🚀 Auto-scaling Django backend
* 🐘 Managed PostgreSQL
* 🔁 Zero-downtime deploys

This setup is **production-grade and repeatable**.

