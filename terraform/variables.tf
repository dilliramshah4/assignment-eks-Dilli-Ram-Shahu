variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for Terraform state"
  type        = string
  default     = "terraform-state-devops-1760725203"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for state locking"
  type        = string
  default     = "terraform-state-locks"
}

variable "backend_key" {
  description = "S3 key for Terraform state file"
  type        = string
  default     = "terraform.tfstate"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "devops-assignment-eks-cluster"
}

variable "cluster_version" {
  description = "EKS cluster version"
  type        = string
  default     = "1.28"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "node_groups" {
  description = "EKS node groups configuration"
  type = map(object({
    instance_types = list(string)
    min_size      = number
    max_size      = number
    desired_size  = number
  }))
  default = {
    main = {
      instance_types = ["t3.medium"]
      min_size      = 1
      max_size      = 3
      desired_size  = 2
    }
  }
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "notesdb"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default = {
    Project     = "notes-app"
    Environment = "dev"
  }
}
