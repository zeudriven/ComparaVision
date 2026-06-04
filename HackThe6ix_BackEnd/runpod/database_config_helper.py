#!/usr/bin/env python3
"""
Database Connection Configuration for RunPod Deployment
Author: Ada - Computational Scientist & Systems Architect
"""

import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_database_requirements():
    """Check if all database requirements are met"""
    logger.info("🔍 Checking database configuration requirements...")
    
    issues = []
    
    # Check if psycopg2 is available
    try:
        import psycopg2
        logger.info("✅ psycopg2 library available")
    except ImportError:
        issues.append("❌ psycopg2-binary not installed")
        logger.error("❌ psycopg2-binary not installed. Install with: pip install psycopg2-binary")
    
    # Check DATABASE_URL environment variable
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        logger.info("✅ DATABASE_URL environment variable is set")
        
        # Validate URL format
        if database_url.startswith('postgresql://'):
            logger.info("✅ DATABASE_URL format appears correct")
        else:
            issues.append("❌ DATABASE_URL should start with 'postgresql://'")
            logger.error("❌ DATABASE_URL format invalid. Should be: postgresql://user:password@host:port/database")
    else:
        issues.append("❌ DATABASE_URL environment variable not set")
        logger.error("❌ DATABASE_URL not set")
    
    return len(issues) == 0, issues

def generate_supabase_connection_string():
    """Generate example Supabase connection string"""
    logger.info("📝 Generating Supabase connection string template...")
    
    supabase_url = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
    
    if 'xoodnuckjmlmejeyyneg' in supabase_url:
        project_ref = 'xoodnuckjmlmejeyyneg'
        connection_template = f"""
# For Supabase project: {project_ref}
# Replace [your_db_password] with your actual database password from Supabase settings

DATABASE_URL=postgresql://postgres.{project_ref}:[your_db_password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Alternative direct connection (non-pooled):
# DATABASE_URL=postgresql://postgres:[your_db_password]@db.{project_ref}.supabase.com:5432/postgres
"""
    else:
        connection_template = """
# Replace [project_ref] with your Supabase project reference
# Replace [your_db_password] with your actual database password

DATABASE_URL=postgresql://postgres.[project_ref]:[your_db_password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Alternative direct connection (non-pooled):
# DATABASE_URL=postgresql://postgres:[your_db_password]@db.[project_ref].supabase.com:5432/postgres
"""
    
    logger.info(connection_template)
    return connection_template

def test_database_connection():
    """Test the database connection"""
    logger.info("🧪 Testing database connection...")
    
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            logger.error("❌ DATABASE_URL not set, cannot test connection")
            return False
        
        logger.info(f"🔌 Connecting to database...")
        connection = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
        
        # Test query
        cursor = connection.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        logger.info(f"✅ Database connection successful!")
        logger.info(f"📊 PostgreSQL version: {version['version']}")
        
        # Check if vision_benchmark_results table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'vision_benchmark_results'
            );
        """)
        table_exists = cursor.fetchone()['exists']
        
        if table_exists:
            logger.info("✅ vision_benchmark_results table exists")
        else:
            logger.warning("⚠️  vision_benchmark_results table does not exist")
            logger.info("💡 Run the enhanced-vision-benchmark-schema.sql script to create tables")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {str(e)}")
        logger.info("💡 Common issues:")
        logger.info("   - Incorrect password in DATABASE_URL")
        logger.info("   - Network connectivity issues")
        logger.info("   - Supabase project not accessible")
        logger.info("   - Database pooler connection limit reached")
        return False

def create_deployment_checklist():
    """Create a deployment checklist"""
    logger.info("📋 Creating deployment checklist...")
    
    checklist = """
🚀 DEPLOYMENT CHECKLIST FOR DATABASE WRITING

□ 1. Install psycopg2-binary in requirements.txt
     pip install psycopg2-binary

□ 2. Set DATABASE_URL environment variable
     Format: postgresql://postgres.[project_ref]:[password]@host:port/postgres
     
□ 3. Get Supabase database password
     - Go to Supabase Dashboard > Settings > Database
     - Copy the connection string or password

□ 4. Configure RunPod environment variables:
     - DATABASE_URL (with actual password)
     - RUNPOD_API_KEY
     - RUNPOD_ENDPOINT_ID

□ 5. Deploy enhanced database schema:
     - Run enhanced-vision-benchmark-schema.sql in Supabase SQL editor

□ 6. Test database connection:
     - python database_config_helper.py

□ 7. Deploy Docker image with environment variables:
     - Ensure DATABASE_URL is passed to container
     - Check logs for database connection status

□ 8. Verify writes in Supabase dashboard:
     - Check vision_benchmark_results table for new entries
     - Monitor logs for "Results saved to database successfully!"

✅ QUICK TEST COMMAND:
python -c "import os; print('DATABASE_URL:', os.getenv('DATABASE_URL', 'NOT SET'))"
"""
    
    logger.info(checklist)
    
    # Save checklist to file
    checklist_file = Path(__file__).parent / "DEPLOYMENT_DATABASE_CHECKLIST.md"
    with open(checklist_file, 'w') as f:
        f.write(checklist)
    
    logger.info(f"📄 Checklist saved to: {checklist_file}")

def main():
    """Main function"""
    logger.info("🔧 Database Configuration Helper")
    logger.info("=" * 50)
    
    # Check requirements
    all_good, issues = check_database_requirements()
    
    if not all_good:
        logger.error("\n⚠️  Issues found:")
        for issue in issues:
            logger.error(f"   {issue}")
    
    # Generate connection string template
    generate_supabase_connection_string()
    
    # Test connection if possible
    if all_good:
        test_database_connection()
    
    # Create deployment checklist
    create_deployment_checklist()
    
    logger.info("\n🎯 Summary:")
    if all_good:
        logger.info("✅ Database configuration looks good!")
    else:
        logger.info("❌ Issues need to be resolved before database will work")
    
    logger.info("📖 See DEPLOYMENT_DATABASE_CHECKLIST.md for detailed steps")

if __name__ == "__main__":
    main()
