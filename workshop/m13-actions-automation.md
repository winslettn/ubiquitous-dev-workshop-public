# Actions and Automation

**Audience:** Developers and platform contributors building automation pipelines

## Overview

This module covers practical automation design with GitHub Actions and Copilot support. You will author workflow syntax, choose event triggers, compose reusable automation building blocks, and apply secure configuration patterns so your continuous integration and continuous delivery (CI/CD) workflows stay maintainable as delivery scales.

### Key Concepts

1. GitHub Actions workflow syntax and job structure.
2. Trigger and event design for push, pull request, and manual execution.
3. Reusable workflows and composite actions for shared automation logic.
4. Secrets and variables management for secure pipeline execution.
5. CI/CD automation with Copilot-assisted authoring and troubleshooting.
6. Provisioning and deployment pathways to Azure from GitHub Actions.
7. Agentic workflows for autonomous repository analysis and reporting.

## Exercises

### Exercise 1: Hands-on workflow authoring, execution, and trigger design

**Objective:** Build a repository workflow that validates code changes, executes a real build run, and supports controlled execution paths.

**Hands-on:**
1. Create `.github/workflows/ci.yml` for `dev-workshops` with jobs that run checks for `src/frontend` and one API track using [understanding GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions).
2. Configure workflow triggers for pull requests and `main` pushes, and add one manual `workflow_dispatch` path.
3. Ensure the workflow executes the relevant build commands and automated tests for the selected paths.
4. Trigger the workflow from `workflow_dispatch` or a pull request, then review the run. Confirm the build steps actually executed, unit test results are visible in the logs, and any failure or warning is triaged.

**Knowledge Check:**
1. Why did you choose your specific trigger set and branch scope?
2. Which workflow parts were most improved by Copilot suggestions?
3. What evidence from the Actions run showed the build and unit test steps executed correctly?
4. What is your rule for deciding between variables and secrets?
5. How does your workflow design reduce noisy or unnecessary runs?

### Exercise 2: Hands-on reusable workflow design and deployment guardrails

**Objective:** Factor shared CI logic into a reusable workflow and define the controls needed before deployment stages are added.

**Hands-on:**
1. Extract one repeated validation sequence into a reusable workflow, using [reusing workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows). Prefer a reusable workflow over a composite action here so you can standardize job-level behavior such as permissions, runner selection, caching, artifacts, and required secrets.
2. Include the common steps that should be consistent across callers: checkout, Node setup, dependency installation, working-directory or target inputs, build execution, test execution, and clear failure reporting. Keep only the path-specific values as inputs so the workflow stays opinionated but reusable.
3. Add a second workflow that calls the reusable workflow for a different target folder, and compare whether the interface is still simple enough for another team to adopt without copying YAML.
4. Define one deployment stage and required environment protections using [using environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/using-environments-for-deployment).

**Knowledge Check:**
1. When is a reusable workflow a better choice than a composite action?
2. Which steps did you decide must stay inside the reusable workflow, and why?
3. How did you keep the workflow flexible without making the inputs too generic?
4. What governance controls are required before enabling automated deployment stages?

## Optional Topics

> **When to use:** Complete these exercises if time allows. Exercises 3 and 4 assume an Azure subscription is available and that the Bicep templates in `infra/` are present before you begin.

### Optional Exercise 3: Provision Azure resources with Bicep and GitHub Actions

**Objective:** Authenticate GitHub Actions to Azure using federated identity and provision infrastructure from Bicep templates.

**Hands-on:**
1. Configure OpenID Connect (OIDC) federated credentials in Azure Entra ID to allow GitHub Actions to authenticate without storing long-lived secrets, following [Configuring OpenID Connect in Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure).
2. Add `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID` as repository secrets and verify they are scoped to a named environment.
3. Create `.github/workflows/provision.yml` that uses the `azure/login` action with OIDC and then runs `az deployment group create` to deploy the Bicep templates in `infra/`, referencing [Deploy Bicep files by using GitHub Actions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-github-actions).
4. Add a required review gate on the target environment and confirm the workflow halts for approval before executing the deployment step.

**Knowledge Check:**
1. Why is OIDC federated identity preferred over storing a service principal secret?
2. Which part of the workflow enforces the approval gate and what happens if it is skipped?
3. How would you scope Bicep parameters differently for staging versus production?
4. What is the rollback plan if the provisioning step partially succeeds?

### Optional Exercise 4: Deploy the application to Azure

**Objective:** Extend the CI/CD pipeline to build and deploy the application after infrastructure is ready.

**Hands-on:**
1. Add a `deploy` job to an existing workflow (or create `.github/workflows/deploy.yml`) that depends on a successful build job and targets the provisioned Azure resources, using [Using environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/using-environments-for-deployment).
2. Use Copilot Chat to generate the deployment steps for the applicable target (Azure App Service, Container Apps, or Static Web Apps), then review the suggested commands against the provisioned resource type from `infra/`.
3. Add a smoke test step that validates the deployed endpoint is reachable before the workflow exits successfully.
4. Verify that a failed deployment stops further workflow steps and triggers an appropriate notification or issue, referencing [Monitoring and troubleshooting workflows](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows).

**Knowledge Check:**
1. What is the dependency chain from code change to live deployment in your workflow?
2. How does the smoke test protect against silent deployment failures?
3. Which workflow design decisions would you change if you had three deployment environments?
4. How did Copilot assistance improve or complicate the deployment step authoring?

### Optional Exercise 5: Agentic workflow pattern and review loop

**Objective:** Design one agentic workflow that produces useful output without bypassing human review.

**Hands-on:**
1. Draft an agentic workflow concept for weekly repository health reporting based on [events that trigger workflows](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows), including trigger, output artifact, and review owner.
2. Define what the workflow is allowed to do automatically and what must remain human-approved before action is taken.
3. Add one review checkpoint that prevents low-confidence or noisy output from being acted on without verification.
4. Explain how you would measure whether the workflow is saving time or just creating more review work.

**Knowledge Check:**
1. What makes this a good candidate for an agentic workflow instead of a standard CI job?
2. Which outputs should be artifacts, comments, issues, or pull requests?
3. What review gate protects the team from low-confidence automation?
4. How would you decide whether to expand or retire this workflow after a trial period?

## Completion Criteria

1. You can author a workflow with clear syntax, triggers, job sequencing, and build/test validation steps.
2. You can execute and review a workflow run to confirm builds and unit tests actually ran.
3. You can secure workflows with correct variable and secret usage.
4. You can factor repeated logic into reusable workflows or composite actions.
5. You can outline how Azure deployment fits into a controlled automation pipeline.
6. *(Optional)* You can configure OIDC federated identity and deploy Bicep templates from a GitHub Actions workflow.
7. *(Optional)* You can build and deploy the application to Azure with environment protections and a post-deploy smoke test.
8. *(Optional)* You can describe an agentic workflow design with ownership and review gates.
