<!-- Copilot Metadata
- **Module:** m13
- **Module Group:** Development Platform (10+)
- **Audience:** Dev
- **Title:** Actions and Automation
- **Est. Duration:** 30 min. instruction / 75 min. hands-on
- **Type:** Optional
- **Topics:**
  - CI/CD overview and how Actions supports and extends (e.g., IssueOps)
  - GitHub Actions workflow syntax
  - Trigger and event design
  - Customizing Actions: reusable workflows, composite actions, GitHub Script, and custom JavaScript actions
  - Deployment: secrets and variables management, environments, workflow artifacts, GitHub Packages, and Azure deployment
  - Additional topics: CI/CD automation with Copilot assistance (optional), Actions Importer, enterprise Actions management, and agentic workflows (optional)
- **Docs:**
  - https://docs.github.com/en/actions
  - https://docs.github.com/en/actions/writing-workflows
  - https://docs.github.com/en/actions/sharing-automations/reusing-workflows
  - https://docs.github.com/en/actions/security-for-github-actions
  - https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows
  - https://github.github.com/gh-aw/introduction/overview/
- **Demos:**
  - [OctoCat Supply: GitHub Actions & CI/CD](https://github.com/octodemo-framework/demo_octocat_supply/blob/main/demo/walkthroughs/actions.md)
  - [Bookstore Platform](https://github.com/octodemo-framework/demo_bookstore/blob/main/README.md)
- **Source workshops:**
  - [10] Automate Simple Tasks - Technical Workshop — [GitHub PAF](https://miniature-adventure-vmnkp9n.pages.github.io/resources?type=guided-engagement&search=workshop)
  - [26] Agentic Workflows Repo Analyzer — [Copilot Academy](https://copilot-academy.github.io/labs/agentic-workflows)
  - [60] MS Learn Module: Build continuous integration (CI) workflows by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-actions-ci/)
  - [61] MS Learn Module: Build and deploy applications to Azure by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-actions-cd/)
  - [62] MS Learn Module: Automate development tasks by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-actions-automate-tasks/)
  - [63] MS Learn Module: Introduction to GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/introduction-to-github-actions/)
  - [64] MS Learn Module: Automate GitHub by using GitHub Script — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/automate-github-using-github-script/)
  - [65] MS Learn Module: Leverage GitHub Actions to publish to GitHub Packages — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/github-actions-packages/)
  - [66] MS Learn Module: Learn continuous integration with GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/learn-continuous-integration-github-actions/)
  - [67] MS Learn Module: Manage GitHub Actions in the enterprise — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-github-actions-enterprise/)
  - [68] MS Learn Module: Create and publish custom GitHub actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/create-custom-github-actions/)
  - [69] MS Learn Module: Trigger GitHub Actions with feature-based development — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/trigger-github-actions-trunk-based-development/)
  - [70] MS Learn Module: Deploy a cloud-native .NET microservice automatically with GitHub Actions and Azure Pipelines — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/microservices-devops-aspnet-core/)
  - [71] MS Learn Module: Deploy serverless APIs with Azure Functions, Logic Apps, and Azure SQL Database — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/deploy-backend-apis/)
  - [72] MS Learn Module: Architect full-stack applications and automate deployments with GitHub — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/automate-deployments-github-actions-azure/)
  - [73] MS Learn Module: Trigger Azure machine learning jobs with GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/trigger-azure-machine-learn-jobs-github-actions/)
  - [74] MS Learn Module: Work with environments in GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/work-environments-github-actions/)
  - [75] MS Learn Module: Publish reusable Bicep code by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/publish-reusable-bicep-code-using-github-actions/)
  - [76] MS Learn Module: Build your first Bicep deployment workflow by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/build-first-bicep-deployment-pipeline-using-github-actions/)
  - [77] MS Learn Module: Deploy and maintain cloud-native apps with GitHub actions and Azure Pipelines — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/cna-deploy-maintain/)
  - [78] MS Learn Module: Work with linting and unit testing in GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/work-linting-unit-test-github-actions/)
  - [79] MS Learn Module: Azure Kubernetes Service deployment pipeline with GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/aks-deployment-pipeline-github-actions/)
  - [80] MS Learn Module: Deploy a model with GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/deploy-model-github-actions/)
  - [81] MS Learn Module: Test your Bicep code by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/test-bicep-code-using-github-actions/)
  - [82] MS Learn Module: Manage multiple environments by using Bicep and GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-multiple-environments-using-bicep-github-actions/)
  - [84] MS Learn Module: Migrate your CI/CD pipelines to GitHub with GitHub Actions Importer — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/migrate-cicd-pipelines-to-github-with-github-actions-importer/)
  - [85] MS Learn Module: Manage end-to-end deployment scenarios by using Bicep and GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/training/modules/manage-end-end-deployment-scenarios-using-bicep-github-actions/)
  - [110] GitHub Skills Project-based exercise: Hello GitHub Actions — [GitHub Learn](https://github.com/skills/hello-github-actions)
  - [112] GitHub Skills Project-based exercise: AI in Actions — [GitHub Learn](https://github.com/skills/ai-in-actions)
  - [113] GitHub Skills Project-based exercise: Create AI Powered Actions — [GitHub Learn](https://github.com/skills/create-ai-powered-actions)
  - [114] GitHub Skills Project-based exercise: Publish Docker Images — [GitHub Learn](https://github.com/skills/publish-docker-images)
  - [115] GitHub Skills Project-based exercise: Create and use reusable workflows — [GitHub Learn](https://github.com/skills/reusable-workflows)
  - [116] GitHub Skills Project-based exercise: Work with Workflow Artifacts — [GitHub Learn](https://github.com/skills/workflow-artifacts)
  - [117] GitHub Skills Project-based exercise: Write JavaScript Actions — [GitHub Learn](https://github.com/skills/write-javascript-actions)
  - [123] MS Learn Project-based exercise: Automate Azure Load Testing by using GitHub Actions — [GitHub Learn](https://learn.microsoft.com/en-us/credentials/applied-skills/automate-azure-load-testing-by-using-github-actions/)
  - [Agentic Workflows Repo Analyzer — Copilot Academy](https://copilot-academy.github.io/labs/agentic-workflows)
- **Source slides:** None
-->

# M13 Actions and Automation - Instructor Materials

Use this module as the instructor facilitation guide.

## Preparation

### Delivery priorities

1. Present the module topics in the exact sequence defined in metadata.
2. Keep explanations aligned to participant outcomes and practical application.
3. Reserve enough time for all lab exercises from the related workshop module.

### Demo preparation

- Review the related workshop module: `m13-actions-automation.md`.
- Confirm links, environments, and permissions needed for demonstrations.
- Prepare one concise transition from presentation topics to hands-on work.

### Success signal

Participants can explain the core module topics and complete the mapped lab exercises with minimal prompting.

---

## Presentation

Duration: 30 min. instruction

- CI/CD fundamentals and how Actions supports and extends (e.g., IssueOps)
- GitHub Actions workflow syntax
- Trigger and event design
- Customizing Actions: reusable workflows, composite actions, GitHub Script, and custom JavaScript actions
- Deployment: secrets and variables management, environments, workflow artifacts, GitHub Packages, and Azure deployment
- Additional topics: CI/CD automation with Copilot assistance (optional), Actions Importer, enterprise Actions management, and agentic workflows (optional)

---

## Lab Exercises

Duration: 75 min. hands-on

1. Exercise 1: Hands-on workflow authoring, execution, and trigger design
2. Exercise 2: Hands-on reusable workflow design and deployment guardrails

---

## Wrap-up

Summarize key decisions, outcomes, and follow-up actions before moving to the next module.
