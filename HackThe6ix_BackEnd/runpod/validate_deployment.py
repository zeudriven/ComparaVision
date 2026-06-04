#!/usr/bin/env python3
"""
Final Deployment Validation for Vision Benchmark System
Run this to validate everything is ready for production
"""

import os
import sys
import json
import subprocess
import importlib.util
from pathlib import Path

class DeploymentValidator:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.issues = []
        self.passed = []
        
    def log_pass(self, message):
        self.passed.append(f"✅ {message}")
        print(f"✅ {message}")
        
    def log_issue(self, message):
        self.issues.append(f"❌ {message}")
        print(f"❌ {message}")
        
    def log_info(self, message):
        print(f"ℹ️  {message}")

    def check_file_exists(self, filepath, description):
        """Check if a required file exists"""
        if (self.project_root / filepath).exists():
            self.log_pass(f"{description} exists: {filepath}")
            return True
        else:
            self.log_issue(f"{description} missing: {filepath}")
            return False

    def check_docker_setup(self):
        """Validate Docker configuration"""
        self.log_info("Checking Docker setup...")
        
        # Check Dockerfile
        if self.check_file_exists("Dockerfile", "Docker configuration"):
            dockerfile_path = self.project_root / "Dockerfile"
            content = dockerfile_path.read_text()
            
            # Check for essential components
            if "nvidia/cuda" in content:
                self.log_pass("Using NVIDIA CUDA base image")
            else:
                self.log_issue("Docker file should use NVIDIA CUDA base image")
                
            if "vision_benchmark_worker.py" in content:
                self.log_pass("Worker script configured in Dockerfile")
            else:
                self.log_issue("Worker script not properly configured")
        
        # Check .dockerignore
        self.check_file_exists(".dockerignore", "Docker ignore file")
        
        # Check docker-compose
        self.check_file_exists("docker-compose.yml", "Docker Compose configuration")

    def check_core_files(self):
        """Check all core application files exist"""
        self.log_info("Checking core application files...")
        
        required_files = [
            ("vision_benchmark_worker.py", "Main worker script"),
            ("runpod_integration.js", "RunPod integration"),
            ("test_worker.py", "Testing suite"),
            ("requirements.txt", "Python dependencies"),
            ("backend_api_integration.js", "Backend API integration"),
            ("frontend_integration_example.js", "Frontend example")
        ]
        
        for filepath, description in required_files:
            self.check_file_exists(filepath, description)

    def check_environment_config(self):
        """Check environment configuration"""
        self.log_info("Checking environment configuration...")
        
        # Check .env.example
        if self.check_file_exists(".env.example", "Environment template"):
            env_example_path = self.project_root / ".env.example"
            content = env_example_path.read_text()
            
            required_vars = [
                "RUNPOD_API_KEY",
                "RUNPOD_ENDPOINT_ID", 
                "SUPABASE_URL",
                "SUPABASE_ANON_KEY"
            ]
            
            for var in required_vars:
                if var in content:
                    self.log_pass(f"Environment variable template: {var}")
                else:
                    self.log_issue(f"Missing environment variable: {var}")

    def check_deployment_scripts(self):
        """Check deployment scripts exist"""
        self.log_info("Checking deployment scripts...")
        
        self.check_file_exists("deploy.sh", "Linux deployment script")
        self.check_file_exists("deploy.bat", "Windows deployment script")

    def validate_python_imports(self):
        """Test if critical imports would work in production"""
        self.log_info("Validating Python dependencies...")
        
        critical_imports = [
            "runpod",
            "torch", 
            "ultralytics",
            "cv2",
            "PIL",
            "numpy",
            "codecarbon"
        ]
        
        # Note: We can't actually import these without the dependencies installed
        # But we can check if they're in requirements.txt
        requirements_path = self.project_root / "requirements.txt"
        if requirements_path.exists():
            requirements_content = requirements_path.read_text()
            
            for import_name in critical_imports:
                # Map import names to package names
                package_mapping = {
                    "cv2": "opencv-python",
                    "PIL": "pillow"
                }
                
                package_name = package_mapping.get(import_name, import_name)
                
                if package_name in requirements_content or import_name in requirements_content:
                    self.log_pass(f"Dependency listed: {import_name}")
                else:
                    self.log_issue(f"Missing dependency: {import_name}")

    def check_api_configuration(self):
        """Check API integration files"""
        self.log_info("Checking API configuration...")
        
        # Check runpod_integration.js
        runpod_js_path = self.project_root / "runpod_integration.js"
        if runpod_js_path.exists():
            try:
                content = runpod_js_path.read_text(encoding='utf-8')
                
                if "${this.endpointId}/run" in content or "/${id}/run" in content:
                    self.log_pass("RunPod API endpoint URL format is correct")
                else:
                    self.log_issue("RunPod API endpoint URL format needs fixing")
                    
                if "RunPodVisionBenchmark" in content:
                    self.log_pass("RunPod integration class defined")
                else:
                    self.log_issue("RunPod integration class missing")
            except UnicodeDecodeError:
                self.log_issue("RunPod integration file has encoding issues")

    def check_model_configuration(self):
        """Check model configuration in worker"""
        self.log_info("Checking model configuration...")
        
        worker_path = self.project_root / "vision_benchmark_worker.py"
        if worker_path.exists():
            content = worker_path.read_text()
            
            expected_models = [
                "Trained_yolov5",
                "Trained_yolov8", 
                "efficientnet_b0",
                "detectron2"
            ]
            
            for model in expected_models:
                if model in content:
                    self.log_pass(f"Model supported: {model}")
                else:
                    self.log_issue(f"Model configuration missing: {model}")

    def generate_summary_report(self):
        """Generate final summary report"""
        print("\n" + "="*80)
        print("DEPLOYMENT VALIDATION SUMMARY")
        print("="*80)
        
        print(f"\n✅ PASSED CHECKS ({len(self.passed)}):")
        for item in self.passed:
            print(f"  {item}")
            
        if self.issues:
            print(f"\n❌ ISSUES FOUND ({len(self.issues)}):")
            for item in self.issues:
                print(f"  {item}")
        else:
            print(f"\n🎉 NO ISSUES FOUND! System is ready for deployment.")
            
        print(f"\n📊 OVERALL STATUS:")
        total_checks = len(self.passed) + len(self.issues)
        success_rate = (len(self.passed) / total_checks * 100) if total_checks > 0 else 0
        print(f"  Success Rate: {success_rate:.1f}% ({len(self.passed)}/{total_checks})")
        
        if len(self.issues) == 0:
            print(f"  🚀 READY FOR DEPLOYMENT")
            self.print_deployment_instructions()
        else:
            print(f"  ⚠️  NEEDS ATTENTION - Please fix issues above")
            
    def print_deployment_instructions(self):
        """Print final deployment instructions"""
        print(f"\n🚀 DEPLOYMENT INSTRUCTIONS:")
        print(f"1. Build Docker image:")
        print(f"   docker build -t vision-benchmark:latest .")
        print(f"")
        print(f"2. Test locally:")
        print(f"   docker run --rm --gpus all vision-benchmark:latest")
        print(f"")
        print(f"3. Deploy to RunPod:")
        print(f"   - Use the RunPodVisionBenchmark class")
        print(f"   - Create serverless endpoint with your image")
        print(f"   - Set environment variables from .env.example")
        print(f"")
        print(f"4. Update backend:")
        print(f"   - Use backend_api_integration.js in your Node.js backend")
        print(f"   - Set RUNPOD_ENDPOINT_ID after creating endpoint")
        print(f"")
        print(f"5. Update frontend:")
        print(f"   - Use frontend_integration_example.js as reference")
        print(f"   - Connect to your backend API endpoints")

    def run_validation(self):
        """Run complete validation suite"""
        print("🔍 Starting deployment validation...")
        print(f"📁 Project root: {self.project_root}")
        
        self.check_core_files()
        self.check_docker_setup()
        self.check_environment_config()
        self.check_deployment_scripts()
        self.validate_python_imports()
        self.check_api_configuration()
        self.check_model_configuration()
        
        self.generate_summary_report()
        
        return len(self.issues) == 0

if __name__ == "__main__":
    validator = DeploymentValidator()
    is_ready = validator.run_validation()
    
    sys.exit(0 if is_ready else 1)
