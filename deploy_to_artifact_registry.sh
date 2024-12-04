#!/bin/bash

# Set variables
PROJECT_ID="ics-analysis-dev"
REGION="australia-southeast1"
REPOSITORY_NAME="mindmap-evaluation-interface"
IMAGE_NAME="mindmap-evaluation-interface"
TAG="latest"

# Step 1: Set the default project
gcloud config set project ${PROJECT_ID}

# Step 2: Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Step 3: Create an Artifact Registry Docker repository
gcloud artifacts repositories create ${REPOSITORY_NAME} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository"

# Step 4: Configure Docker to authenticate to the Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Step 5: Build the Docker image
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${TAG} .

# Step 6: Push the Docker image to Artifact Registry
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${TAG}

# Step 7: Verify the image is in Artifact Registry
gcloud artifacts docker images list ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}
