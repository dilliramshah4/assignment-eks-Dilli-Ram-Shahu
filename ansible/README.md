# Ansible Deployment Configuration

This directory contains Ansible playbooks, templates, and configurations for deploying the full-stack notes application to Kubernetes using Jinja2 templates and Ansible Vault for secrets management.

## Directory Structure

```
ansible/
├── README.md                    # This file
├── ansible.cfg                  # Ansible configuration
├── inventory/
│   └── hosts                    # Inventory file
├── playbooks/
│   ├── deploy.yml              # K8s module deployment (requires kubernetes python library)
│   └── deploy-kubectl.yml      # kubectl-based deployment (currently used)
├── group_vars/
│   ├── prod.yml                # Production environment variables
│   ├── staging.yml             # Staging environment variables (optional)
│   └── secrets.yml             # Database secrets (unencrypted for demo)
├── vault/
│   ├── .vault_pass             # Vault password file
│   └── secrets.yml             # Encrypted secrets (Ansible Vault)
└── rendered/                   # Generated manifests (created during deployment)
```

## Prerequisites

1. **Ansible installed**
2. **kubectl configured** with EKS cluster access
3. **AWS credentials** set in environment
4. **Kubernetes Python library** (for k8s module): `pip install kubernetes`

## Configuration Files

### Production Variables Screenshot
![Production Variables Configuration](images/Screenshot%202025-10-18%20170948.png)

### ansible.cfg
```ini
[defaults]
inventory = inventory/hosts
host_key_checking = False
vault_password_file = vault/.vault_pass
roles_path = roles
stdout_callback = yaml
```

### Environment Variables

**Production (group_vars/prod.yml):**
- `namespace: prod`
- `replicas: 2` (High availability)
- `ecr_uri`: ECR repository URI
- `frontend_tag`: Frontend image tag
- `db_host`: RDS PostgreSQL endpoint
- `backend_url`: LoadBalancer URL for backend

## Jinja2 Templates

Located in `../k8s-templates/`:
- `namespace.yaml.j2` - Kubernetes namespace
- `secret.yaml.j2` - Database secrets
- `backend-deployment.yaml.j2` - Backend deployment with environment variables
- `frontend-deployment.yaml.j2` - Frontend deployment with API URL
- `service.yaml.j2` - ClusterIP services
- `loadbalancer-service.yaml.j2` - LoadBalancer services for external access

## Secrets Management

### Ansible Vault (Encrypted)
```bash
# View encrypted secrets
ansible-vault view vault/secrets.yml

# Edit encrypted secrets
ansible-vault edit vault/secrets.yml
```

### Plain Secrets (Current - for demo)
Database password stored in `group_vars/secrets.yml`

## Deployment Commands

### 1. Deploy to Production
```bash
cd ansible/
ansible-playbook -i inventory/hosts playbooks/deploy-kubectl.yml -e @group_vars/prod.yml
```

### 2. Deploy to Staging (if configured)
```bash
ansible-playbook -i inventory/hosts playbooks/deploy-kubectl.yml -e @group_vars/staging.yml
```

### 3. Deploy with Vault (if using encrypted secrets)
```bash
ansible-playbook -i inventory/hosts playbooks/deploy.yml -e @group_vars/prod.yml --ask-vault-pass
```

## Screenshots for Documentation

Take screenshots of the following commands:

### 1. Ansible Vault Creation
```bash
cd ansible/
echo "db_password: DevOpsAssignment2024!" | ansible-vault encrypt_string --stdin-name 'db_password'
```

### 2. Deployment Execution
```bash
ansible-playbook -i inventory/hosts playbooks/deploy-kubectl.yml -e @group_vars/prod.yml
```

### 3. Verify Deployment
```bash
kubectl get pods -n prod
kubectl get svc -n prod
```

### 4. Template Rendering Verification
```bash
ls -la rendered/
cat rendered/prod-backend.yaml
```

## Deployment Process

1. **Template Rendering**: Ansible processes Jinja2 templates with environment-specific variables
2. **Manifest Generation**: Rendered YAML files are created in `rendered/` directory
3. **Kubernetes Application**: `kubectl apply` commands deploy resources to cluster
4. **Service Exposure**: LoadBalancer services provide external access

## Key Features

- **Environment Separation**: Different configurations for prod/staging
- **Secret Management**: Ansible Vault for sensitive data
- **Template-based**: Jinja2 templates for reusable manifests
- **Rolling Updates**: Kubernetes deployments support zero-downtime updates
- **Health Checks**: Liveness and readiness probes configured
- **Resource Management**: CPU/memory requests and limits defined

## Troubleshooting

### Common Issues

1. **Kubernetes Connection Error**
   ```bash
   # Ensure kubectl is configured
   kubectl cluster-info
   aws eks update-kubeconfig --region ap-south-1 --name devops-assignment-eks-cluster
   ```

2. **Template Not Found Error**
   ```bash
   # Verify template paths in playbook match actual file locations
   ls -la ../k8s-templates/
   ```

3. **Vault Password Error**
   ```bash
   # Check vault password file exists
   cat vault/.vault_pass
   ```

4. **Pod Not Starting**
   ```bash
   # Check pod logs
   kubectl logs -n prod -l app=notes-app-backend
   kubectl describe pod -n prod <pod-name>
   ```

## Environment Variables Used

### Backend Deployment
- `DB_HOST`: PostgreSQL RDS endpoint
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password (from secret)
- `DB_NAME`: Database name

### Frontend Deployment
- `REACT_APP_API_URL`: Backend LoadBalancer URL

## Security Considerations

- Database passwords stored in Kubernetes secrets
- Least privilege IAM roles for EKS nodes
- Private subnets for database access
- LoadBalancer security groups configured
- Container images scanned for vulnerabilities

## Monitoring Integration

The deployments include:
- Health check endpoints (`/health`)
- Prometheus metrics exposure (port 3000/metrics)
- Resource monitoring via Kubernetes metrics
- Application logs via kubectl logs

## Next Steps

1. Implement proper Ansible Vault usage
2. Add CI/CD pipeline integration
3. Configure Prometheus monitoring
4. Set up Grafana dashboards
5. Implement backup strategies
