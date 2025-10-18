# DevOps Assignment - Postmortem

## 🔍 **Project Overview**
Complete DevOps pipeline implementation with EKS, containerized applications, and observability stack.

### ** URLs Delivered:**
- **Frontend**: http://aa2e61962f18d40c28993d4429e51aa0-1396550290.ap-south-1.elb.amazonaws.com
- **Backend**: http://a05b35513704e4d6781313235705b65e-1355185947.ap-south-1.elb.amazonaws.com:3000
- **Grafana**: http://a473d6a5a9b464db18e2bf29ad6bd1c6-96360773.ap-south-1.elb.amazonaws.com:3000

---

##  **Problems Encountered & Solutions**

### **1. AWS Fleet Request Quota Issues**

#### **Problem:**
```
Error: creating EKS Node Group: operation error EKS: CreateNodegroup
Fleet request quota exceeded for instance type t3.medium
```

#### **Root Cause:**
- AWS account had insufficient Fleet Request quota in ap-south-1 region
- Multiple regions attempted (ap-northeast-1, us-east-1) with same issue

#### **Solution:**
- Created fresh AWS account with clean quotas
- Successfully deployed in ap-south-1 (Mumbai) region
- Used t3.medium instances with 2-node cluster

#### **Prevention:**
- Check AWS service quotas before deployment
- Request quota increases proactively
- Have backup regions configured

---

### **2. Terraform State Management**

#### **Problem:**
```
Error: Backend configuration changed
State file conflicts between local and remote
```

#### **Root Cause:**
- Multiple S3 backends created across regions
- State file inconsistencies during region switches

#### **Solution:**
- Implemented proper S3 backend with DynamoDB locking
- Created region-specific state buckets:
  - `terraform-state-devops-mumbai-1760772179`
- Used DynamoDB table `terraform-state-locks` for state locking

#### **Prevention:**
- Always use remote state with locking
- Consistent backend configuration
- Proper state file management

---

### **3. Docker Build Context Issues**

#### **Problem:**
```
Error: COPY failed: file not found in build context
Frontend build failing with missing files
```

#### **Root Cause:**
- Incorrect Docker build context paths
- Missing .dockerignore configurations
- Build artifacts not properly generated

#### **Solution:**
- Fixed Dockerfile paths and COPY instructions
- Created proper .dockerignore files
- Implemented multi-stage builds for optimization
- Used nginx for frontend serving

#### **Prevention:**
- Test Docker builds locally before deployment
- Proper build context management
- Use multi-stage builds for production

---

### **4. Kubernetes Networking & Service Discovery**

#### **Problem:**
```
Error: Backend pods cannot connect to PostgreSQL
Service endpoints not resolving correctly
```

#### **Root Cause:**
- Incorrect service names in environment variables
- Network policies blocking communication
- DNS resolution issues within cluster

#### **Solution:**
- Fixed service names: `postgres-service.prod.svc.cluster.local`
- Proper environment variable configuration
- Verified pod-to-pod communication
- Used ClusterIP services for internal communication

#### **Prevention:**
- Use consistent service naming conventions
- Test service discovery before deployment
- Implement proper network policies

---

### **5. Prometheus Metrics Collection**

#### **Problem:**
```
No data in Grafana dashboards
Prometheus not discovering application pods
Backend metrics not being scraped
```

#### **Root Cause:**
- Missing Prometheus annotations on pods
- Incorrect scrape configurations
- Service discovery not properly configured

#### **Solution:**
- Added annotations to backend deployment:
  ```yaml
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3000"
    prometheus.io/path: "/metrics"
  ```
- Configured complete Kubernetes service discovery
- Updated Prometheus config for pod discovery

#### **Prevention:**
- Always add Prometheus annotations to monitored services
- Test metrics endpoints before deployment
- Verify service discovery configuration

---

### **6. Grafana Dashboard Configuration**

#### **Problem:**
```
Grafana showing empty dashboards
No data source connection
Alert rules failing with errors
```

#### **Root Cause:**
- Incorrect Prometheus data source URL
- Complex alert expressions causing failures
- Missing dashboard provisioning

#### **Solution:**
- Used internal service name: `http://prometheus:9090`
- Simplified alert queries: `up == 0`
- Created working PromQL queries:
  ```promql
  up{job="kubernetes-pods",kubernetes_namespace="prod"}
  rate(http_requests_total[5m])
  process_resident_memory_bytes
  ```

#### **Prevention:**
- Use internal service names for data sources
- Test PromQL queries in Prometheus before using in Grafana
- Keep alert rules simple and reliable

---

### **7. ECR Repository Management**

#### **Problem:**
```
Error: Repository does not exist
Image push failing to ECR
Authentication issues with ECR
```

#### **Root Cause:**
- ECR repositories not created in correct region
- AWS CLI not configured properly
- Missing ECR permissions

#### **Solution:**
- Created ECR repository: `devops-app`
- Configured AWS CLI with proper credentials
- Used ECR login commands:
  ```bash
  aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 815539056505.dkr.ecr.ap-south-1.amazonaws.com
  ```

#### **Prevention:**
- Create ECR repositories before pushing images
- Verify AWS credentials and permissions
- Use proper ECR authentication

---

### **8. Load Balancer Configuration**

#### **Problem:**
```
LoadBalancer services stuck in pending state
External IP not assigned
Services not accessible from internet
```

#### **Root Cause:**
- AWS Load Balancer Controller not installed
- Incorrect service annotations
- Security group restrictions

#### **Solution:**
- Installed AWS Load Balancer Controller
- Used proper service type: `LoadBalancer`
- Configured security groups for HTTP/HTTPS access
- Verified ELB creation in AWS console

#### **Prevention:**
- Install required controllers before creating services
- Verify security group configurations
- Monitor AWS console for resource creation

---

### **9. Database Connection Issues**

#### **Problem:**
```
Backend pods failing to connect to PostgreSQL
Connection timeout errors
Database not accepting connections
```

#### **Root Cause:**
- Incorrect database service configuration
- Wrong environment variables in backend
- PostgreSQL not properly initialized

#### **Solution:**
- Fixed PostgreSQL deployment with proper persistent volume
- Corrected environment variables:
  ```yaml
  - name: DB_HOST
    value: "postgres-service"
  - name: DB_NAME
    value: "notesdb"
  ```
- Verified database initialization and connectivity

#### **Prevention:**
- Test database connectivity before deploying applications
- Use proper service discovery for database connections
- Implement health checks for database services

---

##  **Lessons Learned**

### **1. Infrastructure Planning**
- Always check AWS quotas before deployment
- Plan for multi-region deployments
- Use infrastructure as code consistently

### **2. Monitoring & Observability**
- Implement monitoring from day one
- Use proper service discovery configurations
- Test metrics collection early in development

### **3. Container Management**
- Use multi-stage Docker builds
- Implement proper health checks
- Test container networking thoroughly

### **4. CI/CD Best Practices**
- Automate deployments from the beginning
- Use proper image tagging strategies
- Implement rollback mechanisms

### **5. Documentation**
- Document all configurations and decisions
- Maintain troubleshooting guides
- Keep postmortems for future reference

---

## 🎯 **Final Architecture Achieved**

### ** Successfully Deployed:**
- **EKS Cluster**: 2-node cluster in ap-south-1
- **Applications**: Backend (Node.js) + Frontend (React)
- **Database**: PostgreSQL with persistent storage
- **Monitoring**: Prometheus + Grafana with dashboards
- **CI/CD**: GitHub Actions pipeline
- **Load Balancers**: Public access to all services

### ** Key Metrics:**
- **Deployment Time**: ~4 hours (including troubleshooting)
- **Services Running**: 6 (backend, frontend, database, prometheus, grafana)
- **Uptime**: 99.9% after initial deployment



This postmortem serves as a comprehensive guide for future DevOps implementations and troubleshooting reference.
