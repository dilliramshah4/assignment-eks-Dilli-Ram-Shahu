# EKS DevOps Assignment - Full Stack Notes Application

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 GitHub Repository                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │    Frontend     │  │     Backend     │  │  Infrastructure │                 │
│  │   (React.js)    │  │   (Node.js)     │  │   (Terraform)   │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            GitHub Actions CI/CD                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   Build Images  │  │  Push to ECR    │  │ Deploy to EKS   │                 │
│  │   Docker Build  │  │   Container     │  │   via Ansible   │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                AWS Cloud                                        │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                              VPC                                        │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐                    ┌─────────────────┐             │   │
│  │  │  Public Subnet  │                    │ Private Subnet  │             │   │
│  │  │                 │                    │                 │             │   │
│  │  │ ┌─────────────┐ │                    │ ┌─────────────┐ │             │   │
│  │  │ │     NAT     │ │                    │ │     EKS     │ │             │   │
│  │  │ │   Gateway   │ │                    │ │   Cluster   │ │             │   │
│  │  │ └─────────────┘ │                    │ └─────────────┘ │             │   │
│  │  │                 │                    │                 │             │   │
│  │  │ ┌─────────────┐ │                    │ ┌─────────────┐ │             │   │
│  │  │ │   Internet  │ │                    │ │  Worker     │ │             │   │
│  │  │ │   Gateway   │ │                    │ │  Nodes      │ │             │   │
│  │  │ └─────────────┘ │                    │ └─────────────┘ │             │   │
│  │  └─────────────────┘                    └─────────────────┘             │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    EKS Cluster                                  │   │   │
│  │  │                                                                 │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │   │
│  │  │  │  Frontend   │  │   Backend   │  │ Load        │             │   │   │
│  │  │  │   Pods      │  │    Pods     │  │ Balancer    │             │   │   │
│  │  │  │ (React.js)  │  │ (Node.js)   │  │ Service     │             │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘             │   │   │
│  │  │                                                                 │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐                              │   │   │
│  │  │  │ Prometheus  │  │   Grafana   │                              │   │   │
│  │  │  │ Monitoring  │  │ Dashboard   │                              │   │   │
│  │  │  └─────────────┘  └─────────────┘                              │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                      RDS Database                               │   │   │
│  │  │  ┌─────────────┐                                                │   │   │
│  │  │  │ PostgreSQL  │                                                │   │   │
│  │  │  │  Database   │                                                │   │   │
│  │  │  └─────────────┘                                                │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        ECR Repository                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐                                      │   │
│  │  │  Frontend   │  │   Backend   │                                      │   │
│  │  │   Images    │  │   Images    │                                      │   │
│  │  └─────────────┘  └─────────────┘                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### ** URLs Delivered:**
- **Frontend**: http://aa2e61962f18d40c28993d4429e51aa0-1396550290.ap-south-1.elb.amazonaws.com
- **Backend**: http://a05b35513704e4d6781313235705b65e-1355185947.ap-south-1.elb.amazonaws.com:3000
- **Grafana**: http://a473d6a5a9b464db18e2bf29ad6bd1c6-96360773.ap-south-1.elb.amazonaws.com:3000

## Project Structure

```
assignment-eks-Dilli-Ram-Shahu/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml          # GitHub Actions CI/CD pipeline
│       └── README.md          # CI/CD documentation
├── terraform/                 # Infrastructure as Code
│   ├── modules/
│   │   ├── vpc/              # VPC module
│   │   ├── eks/              # EKS cluster module
│   │   └── rds/              # RDS database module
│   ├── main.tf               # Main Terraform configuration
│   ├── variables.tf          # Variable definitions
│   └── outputs.tf            # Output definitions
├── ansible/                   # Configuration Management
│   ├── playbooks/
│   │   ├── deploy.yml        # Application deployment
│   │   └── deploy-kubectl.yml # Kubectl deployment
│   ├── group_vars/           # Environment variables
│   ├── inventory/            # Ansible inventory
│   └── rendered/             # Rendered Kubernetes manifests
├── k8s-templates/            # Kubernetes templates
│   ├── backend-deployment.yaml.j2
│   ├── frontend-deployment.yaml.j2
│   ├── service.yaml.j2
│   └── loadbalancer-service.yaml.j2
├── backend/                  # Node.js API
│   ├── server.js            # Express server with Prometheus metrics
│   ├── Dockerfile           # Backend container image
│   └── package.json         # Node.js dependencies
├── frontend/                 # React.js Application
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── index.js         # Entry point
│   ├── Dockerfile           # Frontend container image
│   └── package.json         # React dependencies
├── observability/            # Monitoring Stack
│   ├── prometheus-complete.yaml  # Prometheus configuration
│   ├── grafana-updated.yaml     # Grafana configuration
│   └── README.md               # Monitoring documentation
└── POSTMORTEM.md            # Project postmortem analysis
```

## Technology Stack

### Infrastructure
- **AWS EKS**: Managed Kubernetes service
- **AWS RDS**: PostgreSQL database
- **AWS VPC**: Network isolation
- **AWS ECR**: Container registry
- **Terraform**: Infrastructure as Code

### Application
- **Frontend**: React.js with responsive UI
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker

### DevOps & Monitoring
- **CI/CD**: GitHub Actions
- **Configuration Management**: Ansible
- **Monitoring**: Prometheus + Grafana
- **Container Orchestration**: Kubernetes

## Features

### Application Features
-  Full-stack notes application
-  CRUD operations for notes
-  Responsive React.js frontend
-  RESTful API backend
-  PostgreSQL database integration
-  Health check endpoints

### DevOps Features
-  Automated CI/CD pipeline
-  Infrastructure as Code with Terraform
-  Multi-environment support (staging/production)
-  Container-based deployment
-  Kubernetes orchestration
-  Configuration management with Ansible

### Monitoring & Observability
-  Prometheus metrics collection
-  Grafana dashboards
-  Application performance monitoring
-  Infrastructure monitoring
-  Custom alerts and notifications

## Deployment Flow

1. **Code Push**: Developer pushes code to GitHub
2. **CI/CD Trigger**: GitHub Actions workflow triggers automatically
3. **Build Phase**: 
   - Build Docker images for frontend and backend
   - Run tests and security scans
4. **Push Phase**: 
   - Push images to AWS ECR
   - Tag images with commit SHA
5. **Deploy Phase**: 
   - Use Ansible to render Kubernetes manifests
   - Deploy to EKS cluster
   - Update services and ingress



