#!/usr/bin/env python3
"""
Enhanced Vision Benchmark Worker with Comprehensive Metrics
Advanced benchmarking system for computer vision models with database integration
Author: Ada - Computational Scientist & Systems Architect
"""

import os
import sys
import time
import json
import logging
import psutil
import numpy as np
import cv2
import asyncio
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, asdict
from PIL import Image
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor
import threading

# Core ML imports (with error handling)
try:
    import torch
    import torchvision.transforms as transforms
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# Model imports
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
try:
    from detectron2 import model_zoo
    from detectron2.engine import DefaultPredictor
    from detectron2.config import get_cfg
    from detectron2.utils.visualizer import Visualizer
    from detectron2.data import MetadataCatalog
    DETECTRON2_AVAILABLE = True
except ImportError:
    DETECTRON2_AVAILABLE = False

# Carbon tracking
try:
    from codecarbon import OfflineEmissionsTracker
    CARBON_TRACKING = True
except ImportError:
    CARBON_TRACKING = False

# Database integration
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DATABASE_AVAILABLE = True
except ImportError:
    DATABASE_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ComprehensiveBenchmarkMetrics:
    """Complete metrics structure matching database schema"""
    # Core performance metrics (as specified in requirements)
    accuracy: float = 0.0              # Detection accuracy (0-1 scale)
    speed_ms: float = 0.0              # Average inference time in milliseconds
    memory_mb: float = 0.0             # RAM usage in MB
    carbon_emissions: float = 0.0      # CO2 equivalent emissions
    green_score: float = 0.0           # Efficiency rating (0-100)
    f1_score: float = 0.0              # F1 score (0-1 scale)
    latency_ms: float = 0.0            # Input-to-output processing time
    throughput_fps: float = 0.0        # Frames processed per second
    
    # Extended performance metrics
    peak_memory_mb: float = 0.0        # Peak RAM usage during inference
    cpu_usage_percent: float = 0.0     # CPU utilization percentage
    gpu_memory_mb: float = 0.0         # GPU VRAM consumption
    energy_consumption: float = 0.0    # Power usage estimation in watts
    model_size_mb: float = 0.0         # Model file size in MB
    
    # Detection-specific metrics
    precision: float = 0.0             # Precision score (0-1 scale)
    recall: float = 0.0                # Recall score (0-1 scale)
    cars_detected: int = 0             # Number of cars detected
    
    # Metadata
    inference_count: int = 0           # Number of inferences performed
    test_duration_seconds: float = 0.0 # Total test time

class AdvancedSystemMonitor:
    """Enhanced system performance monitoring with GPU support"""
    
    def __init__(self):
        self.process = psutil.Process()
        self.initial_memory = self.process.memory_info().rss / 1024 / 1024
        self.peak_memory = self.initial_memory
        self.cpu_readings = []
        self.gpu_memory_readings = []
        self.monitoring = False
        self.monitor_thread = None
        
    def start_monitoring(self):
        """Start continuous system monitoring"""
        self.monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitor_loop)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()
        
    def stop_monitoring(self):
        """Stop system monitoring"""
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=1.0)
        
    def _monitor_loop(self):
        """Continuous monitoring loop"""
        while self.monitoring:
            try:
                # Memory monitoring
                current_memory = self.process.memory_info().rss / 1024 / 1024
                self.peak_memory = max(self.peak_memory, current_memory)
                
                # CPU monitoring
                cpu_percent = self.process.cpu_percent(interval=None)
                self.cpu_readings.append(cpu_percent)
                
                # GPU monitoring (NVIDIA)
                if torch.cuda.is_available():
                    try:
                        gpu_memory = torch.cuda.memory_allocated() / 1024 / 1024
                        self.gpu_memory_readings.append(gpu_memory)
                    except:
                        pass
                        
                time.sleep(0.1)  # Monitor every 100ms
            except:
                break
    
    def get_metrics(self) -> Dict[str, float]:
        """Get comprehensive monitoring metrics"""
        return {
            'peak_memory_mb': self.peak_memory,
            'avg_cpu_percent': np.mean(self.cpu_readings) if self.cpu_readings else 0.0,
            'max_cpu_percent': np.max(self.cpu_readings) if self.cpu_readings else 0.0,
            'avg_gpu_memory_mb': np.mean(self.gpu_memory_readings) if self.gpu_memory_readings else 0.0,
            'max_gpu_memory_mb': np.max(self.gpu_memory_readings) if self.gpu_memory_readings else 0.0
        }

class EnhancedVisionModelLoader:
    """Enhanced model loader with complete architecture support"""
    
    SUPPORTED_MODELS = {
        'Trained_yolov5': {'type': 'yolo', 'version': 'v5', 'task': 'detection'},
        'Trained_yolov8': {'type': 'yolo', 'version': 'v8', 'task': 'detection'},
        'efficientnet_b0': {'type': 'efficientnet', 'version': 'b0', 'task': 'classification'},
        'detectron2': {'type': 'detectron2', 'version': 'rcnn', 'task': 'detection'},
        'llama2_70b': {'type': 'llama', 'version': '70b', 'task': 'text'},
        'opus_mt': {'type': 'transformer', 'version': 'mt', 'task': 'translation'},
        'roberta_base': {'type': 'transformer', 'version': 'base', 'task': 'text'},
        'wav2vec2': {'type': 'transformer', 'version': 'v2', 'task': 'audio'}
    }
    
    def __init__(self):
        self.model_cache = {}
        
    def load_model(self, model_name: str) -> Any:
        """Load and cache models efficiently"""
        if model_name in self.model_cache:
            return self.model_cache[model_name]
            
        model_info = self.SUPPORTED_MODELS.get(model_name)
        if not model_info:
            raise ValueError(f"Unsupported model: {model_name}")
        
        logger.info(f"Loading model: {model_name}")
        
        try:
            if model_info['type'] == 'yolo':
                if model_info['version'] == 'v5':
                    model = YOLO('yolov5s.pt')
                elif model_info['version'] == 'v8':
                    model = YOLO('yolov8s.pt')
                else:
                    model = YOLO('yolov8s.pt')
                    
            elif model_info['type'] == 'efficientnet':
                import timm
                model = timm.create_model('efficientnet_b0', pretrained=True)
                model.eval()
                
            elif model_info['type'] == 'detectron2' and DETECTRON2_AVAILABLE:
                cfg = get_cfg()
                cfg.merge_from_file(model_zoo.get_config_file("COCO-Detection/faster_rcnn_R_50_FPN_3x.yaml"))
                cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5
                cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-Detection/faster_rcnn_R_50_FPN_3x.yaml")
                model = DefaultPredictor(cfg)
                
            else:
                # For non-vision models, create a mock model for testing
                model = type('MockModel', (), {'predict': lambda x: []})()
                
            self.model_cache[model_name] = model
            return model
            
        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {str(e)}")
            raise

class ComprehensiveCarDetectionBenchmark:
    """Enhanced benchmarking system with full metrics calculation"""
    
    def __init__(self):
        self.model_loader = EnhancedVisionModelLoader()
        self.monitor = AdvancedSystemMonitor()
        
    def preprocess_image(self, image_path: str, model_type: str) -> np.ndarray:
        """Enhanced image preprocessing for different model types"""
        try:
            if isinstance(image_path, (bytes, BytesIO)):
                image = Image.open(BytesIO(image_path))
            else:
                image = Image.open(image_path)
                
            image = image.convert('RGB')
            image_np = np.array(image)
            
            if 'efficientnet' in model_type.lower():
                # EfficientNet preprocessing
                image_np = cv2.resize(image_np, (224, 224))
                image_np = image_np.astype(np.float32) / 255.0
                image_np = (image_np - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
            elif 'detectron2' in model_type.lower():
                # Detectron2 preprocessing
                image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
                
            return image_np
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise
    
    def detect_cars(self, model: Any, image: np.ndarray, model_type: str) -> List[Dict]:
        """Enhanced car detection with confidence scoring"""
        detections = []
        
        try:
            if 'yolo' in model_type.lower():
                # YOLO detection
                results = model(image, verbose=False)
                for result in results:
                    if hasattr(result, 'boxes') and result.boxes is not None:
                        boxes = result.boxes
                        for i in range(len(boxes)):
                            cls = int(boxes.cls[i])
                            conf = float(boxes.conf[i])
                            # Class 2 is 'car' in COCO dataset
                            if cls == 2 and conf > 0.5:
                                detections.append({
                                    'class': 'car',
                                    'confidence': conf,
                                    'bbox': boxes.xyxy[i].cpu().numpy().tolist()
                                })
                                
            elif 'detectron2' in model_type.lower() and DETECTRON2_AVAILABLE:
                # Detectron2 detection
                outputs = model(image)
                instances = outputs["instances"]
                pred_classes = instances.pred_classes.cpu().numpy()
                scores = instances.scores.cpu().numpy()
                pred_boxes = instances.pred_boxes.tensor.cpu().numpy()
                
                for i, (cls, score, box) in enumerate(zip(pred_classes, scores, pred_boxes)):
                    if cls == 2 and score > 0.5:  # Class 2 is 'car'
                        detections.append({
                            'class': 'car',
                            'confidence': float(score),
                            'bbox': box.tolist()
                        })
                        
            elif 'efficientnet' in model_type.lower():
                # EfficientNet classification (simulate detection)
                import torch
                with torch.no_grad():
                    image_tensor = torch.FloatTensor(image).unsqueeze(0)
                    if len(image_tensor.shape) == 4 and image_tensor.shape[-1] == 3:
                        image_tensor = image_tensor.permute(0, 3, 1, 2)
                    
                    outputs = model(image_tensor)
                    probs = torch.softmax(outputs, dim=1)
                    
                    # Simulate car detection based on classification confidence
                    car_confidence = float(probs[0, 817])  # ImageNet car class
                    if car_confidence > 0.3:
                        detections.append({
                            'class': 'car',
                            'confidence': car_confidence,
                            'bbox': [50, 50, 200, 200]  # Mock bbox
                        })
                        
        except Exception as e:
            logger.error(f"Detection failed for {model_type}: {str(e)}")
            
        return detections
    
    def calculate_detection_metrics(self, detections: List[Dict], ground_truth: int) -> Dict[str, float]:
        """Calculate precision, recall, F1 score, and accuracy"""
        detected_count = len(detections)
        
        # Simple metrics calculation (can be enhanced with bbox overlap)
        if ground_truth == 0:
            accuracy = 1.0 if detected_count == 0 else 0.0
            precision = 1.0 if detected_count == 0 else 0.0
            recall = 1.0
        else:
            # Accuracy: how close detected count is to ground truth
            accuracy = max(0.0, 1.0 - abs(detected_count - ground_truth) / ground_truth)
            
            # Precision: ratio of correct detections
            precision = min(1.0, ground_truth / detected_count) if detected_count > 0 else 0.0
            
            # Recall: ratio of ground truth detected
            recall = min(1.0, detected_count / ground_truth)
        
        # F1 Score: harmonic mean of precision and recall
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'cars_detected': detected_count
        }
    
    def calculate_green_score(self, carbon_emissions: float, accuracy: float, speed_ms: float, memory_mb: float) -> float:
        """Enhanced green score calculation"""
        if carbon_emissions <= 0:
            carbon_emissions = 0.001
        if speed_ms <= 0:
            speed_ms = 1.0
        if memory_mb <= 0:
            memory_mb = 100.0
            
        # Green score factors: accuracy (40%), speed (30%), memory efficiency (20%), carbon (10%)
        accuracy_score = accuracy * 40
        speed_score = min(30, 30 * (1000 / speed_ms))  # Better score for faster inference
        memory_score = min(20, 20 * (1000 / memory_mb))  # Better score for less memory
        carbon_score = min(10, 10 * (0.1 / carbon_emissions))  # Better score for less emissions
        
        green_score = accuracy_score + speed_score + memory_score + carbon_score
        return min(100.0, max(0.0, green_score))
    
    def calculate_energy_consumption(self, duration_seconds: float, cpu_percent: float) -> float:
        """Estimate energy consumption in watts"""
        # Rough estimation based on CPU usage and duration
        # Typical CPU power consumption: 15-150W, GPU: 75-300W
        base_power = 50.0  # Base system power in watts
        cpu_power = (cpu_percent / 100.0) * 100.0  # CPU power based on usage
        gpu_power = 150.0 if torch.cuda.is_available() else 0.0  # GPU power if available
        
        total_power = base_power + cpu_power + gpu_power
        energy_consumption = total_power * (duration_seconds / 3600.0)  # Wh
        return energy_consumption
    
    def get_model_size(self, model: Any, model_type: str) -> float:
        """Enhanced model size calculation"""
        try:
            if hasattr(model, 'model') and hasattr(model.model, 'parameters'):
                # PyTorch model with nested structure (YOLO)
                param_size = sum(p.numel() * p.element_size() for p in model.model.parameters())
                buffer_size = sum(b.numel() * b.element_size() for b in model.model.buffers())
                return (param_size + buffer_size) / 1024 / 1024
            elif hasattr(model, 'parameters'):
                # Direct PyTorch model
                param_size = sum(p.numel() * p.element_size() for p in model.parameters())
                return param_size / 1024 / 1024
            else:
                # Fallback to known model sizes
                model_sizes = {
                    'yolov5': 14.4,
                    'yolov8': 22.5,
                    'efficientnet_b0': 21.4,
                    'detectron2': 165.3,
                    'llama2_70b': 140000.0,  # 140GB
                    'roberta_base': 498.0,
                    'wav2vec2': 315.0,
                    'opus_mt': 892.0
                }
                for key, size in model_sizes.items():
                    if key in model_type.lower():
                        return size
                return 50.0
        except Exception as e:
            logger.warning(f"Model size calculation failed: {str(e)}")
            return 50.0
    
    async def benchmark_model(self, model_name: str, images_data: List[Dict]) -> ComprehensiveBenchmarkMetrics:
        """Comprehensive model benchmarking with all metrics"""
        logger.info(f"🔬 Starting comprehensive benchmark for model: {model_name}")
        
        metrics = ComprehensiveBenchmarkMetrics()
        start_time = time.time()
        
        # Start system monitoring
        self.monitor.start_monitoring()
        
        # Initialize carbon tracking
        emissions_tracker = None
        if CARBON_TRACKING:
            try:
                emissions_tracker = OfflineEmissionsTracker(country_iso_code="USA")
                emissions_tracker.start()
            except Exception as e:
                logger.warning(f"Carbon tracking initialization failed: {str(e)}")
        
        try:
            # Load model
            model = self.model_loader.load_model(model_name)
            metrics.model_size_mb = self.get_model_size(model, model_name)
            
            # Process images and collect metrics
            all_detections = []
            inference_times = []
            total_ground_truth = 0
            
            for image_data in images_data:
                image_start_time = time.time()
                
                # Preprocess image
                image = self.preprocess_image(image_data['image'], model_name)
                
                # Perform detection
                detections = self.detect_cars(model, image, model_name)
                all_detections.extend(detections)
                
                # Record timing
                inference_time = (time.time() - image_start_time) * 1000  # ms
                inference_times.append(inference_time)
                
                # Accumulate ground truth
                total_ground_truth += image_data.get('ground_truth_cars', 1)
                metrics.inference_count += 1
            
            # Calculate core performance metrics
            metrics.speed_ms = np.mean(inference_times) if inference_times else 0.0
            metrics.latency_ms = metrics.speed_ms  # For single image inference
            metrics.throughput_fps = 1000.0 / metrics.speed_ms if metrics.speed_ms > 0 else 0.0
            
            # Calculate detection metrics
            detection_metrics = self.calculate_detection_metrics(all_detections, total_ground_truth)
            metrics.accuracy = detection_metrics['accuracy']
            metrics.precision = detection_metrics['precision']
            metrics.recall = detection_metrics['recall']
            metrics.f1_score = detection_metrics['f1_score']
            metrics.cars_detected = detection_metrics['cars_detected']
            
            # Get system metrics
            system_metrics = self.monitor.get_metrics()
            metrics.peak_memory_mb = system_metrics['peak_memory_mb']
            metrics.memory_mb = system_metrics['peak_memory_mb']  # Use peak as current
            metrics.cpu_usage_percent = system_metrics['avg_cpu_percent']
            metrics.gpu_memory_mb = system_metrics['max_gpu_memory_mb']
            
            # Calculate test duration
            test_duration = time.time() - start_time
            metrics.test_duration_seconds = test_duration
            
            # Calculate energy consumption
            metrics.energy_consumption = self.calculate_energy_consumption(
                test_duration, metrics.cpu_usage_percent
            )
            
            # Get carbon emissions
            if emissions_tracker:
                try:
                    emissions_tracker.stop()
                    emissions_data = emissions_tracker.final_emissions_data
                    metrics.carbon_emissions = emissions_data.emissions * 1000  # Convert to grams
                except Exception as e:
                    logger.warning(f"Carbon tracking failed: {str(e)}")
                    metrics.carbon_emissions = 0.01  # Minimal fallback
            else:
                # Estimate carbon emissions based on energy consumption
                metrics.carbon_emissions = metrics.energy_consumption * 0.4  # kg CO2 per kWh
            
            # Calculate green score
            metrics.green_score = self.calculate_green_score(
                metrics.carbon_emissions, metrics.accuracy, metrics.speed_ms, metrics.memory_mb
            )
            
            logger.info(f"✅ Benchmark completed for {model_name}")
            logger.info(f"   Accuracy: {metrics.accuracy:.3f}")
            logger.info(f"   Speed: {metrics.speed_ms:.2f}ms")
            logger.info(f"   Green Score: {metrics.green_score:.1f}")
            logger.info(f"   F1 Score: {metrics.f1_score:.3f}")
            
        except Exception as e:
            logger.error(f"Benchmark failed for {model_name}: {str(e)}")
            raise
        finally:
            # Stop monitoring
            self.monitor.stop_monitoring()
            if emissions_tracker:
                try:
                    emissions_tracker.stop()
                except:
                    pass
        
        return metrics

class DatabaseIntegration:
    """Database integration for storing benchmark results"""
    
    def __init__(self, connection_string: str = None):
        self.connection_string = connection_string or os.getenv('DATABASE_URL')
        self.connection = None
        
    def connect(self):
        """Connect to the database"""
        if not DATABASE_AVAILABLE:
            logger.warning("❌ Database libraries (psycopg2) not available")
            return False
            
        if not self.connection_string:
            logger.warning("❌ DATABASE_URL environment variable not set")
            logger.info("💡 Set DATABASE_URL=postgresql://user:password@host:port/database")
            return False
            
        try:
            logger.info(f"🔌 Attempting database connection...")
            logger.info(f"📍 Database host: {self.connection_string.split('@')[1].split('/')[0] if '@' in self.connection_string else 'unknown'}")
            
            self.connection = psycopg2.connect(self.connection_string, cursor_factory=RealDictCursor)
            logger.info("✅ Database connected successfully!")
            return True
        except Exception as e:
            logger.error(f"❌ Database connection failed: {str(e)}")
            logger.error("💡 Check your DATABASE_URL format: postgresql://user:password@host:port/database")
            return False
    
    def save_benchmark_results(self, model_a: str, model_b: str, 
                             metrics_a: ComprehensiveBenchmarkMetrics,
                             metrics_b: ComprehensiveBenchmarkMetrics,
                             test_config: Dict) -> bool:
        """Save comprehensive benchmark results to database"""
        if not self.connection:
            return False
            
        try:
            cursor = self.connection.cursor()
            
            # Determine winner
            winner = 'tie'
            if metrics_a.accuracy > metrics_b.accuracy:
                winner = 'model_a'
            elif metrics_b.accuracy > metrics_a.accuracy:
                winner = 'model_b'
            
            # Calculate win margin
            win_margin = abs(metrics_a.accuracy - metrics_b.accuracy) * 100
            
            # Insert benchmark results
            query = """
            INSERT INTO vision_benchmark_results (
                test_name, benchmark_type, model_a_name, model_a_type, model_b_name, model_b_type,
                accuracy_a, speed_ms_a, memory_mb_a, carbon_emissions_a, green_score_a, 
                f1_score_a, latency_ms_a, throughput_fps_a, peak_memory_mb_a, cpu_usage_percent_a, 
                gpu_memory_mb_a, energy_consumption_a, model_size_mb_a, precision_a, recall_a, 
                cars_detected_a,
                accuracy_b, speed_ms_b, memory_mb_b, carbon_emissions_b, green_score_b, 
                f1_score_b, latency_ms_b, throughput_fps_b, peak_memory_mb_b, cpu_usage_percent_b, 
                gpu_memory_mb_b, energy_consumption_b, model_size_mb_b, precision_b, recall_b, 
                cars_detected_b,
                winner, win_margin, test_images_count, test_duration_seconds,
                gpu_type, runpod_endpoint_id, raw_results_json
            ) VALUES (
                %(test_name)s, %(benchmark_type)s, %(model_a_name)s, %(model_a_type)s, 
                %(model_b_name)s, %(model_b_type)s,
                %(accuracy_a)s, %(speed_ms_a)s, %(memory_mb_a)s, %(carbon_emissions_a)s, 
                %(green_score_a)s, %(f1_score_a)s, %(latency_ms_a)s, %(throughput_fps_a)s, 
                %(peak_memory_mb_a)s, %(cpu_usage_percent_a)s, %(gpu_memory_mb_a)s, 
                %(energy_consumption_a)s, %(model_size_mb_a)s, %(precision_a)s, %(recall_a)s, 
                %(cars_detected_a)s,
                %(accuracy_b)s, %(speed_ms_b)s, %(memory_mb_b)s, %(carbon_emissions_b)s, 
                %(green_score_b)s, %(f1_score_b)s, %(latency_ms_b)s, %(throughput_fps_b)s, 
                %(peak_memory_mb_b)s, %(cpu_usage_percent_b)s, %(gpu_memory_mb_b)s, 
                %(energy_consumption_b)s, %(model_size_mb_b)s, %(precision_b)s, %(recall_b)s, 
                %(cars_detected_b)s,
                %(winner)s, %(win_margin)s, %(test_images_count)s, %(test_duration_seconds)s,
                %(gpu_type)s, %(runpod_endpoint_id)s, %(raw_results_json)s
            )
            """
            
            params = {
                'test_name': test_config.get('test_name', 'Vision Model Comparison'),
                'benchmark_type': 'car_detection',
                'model_a_name': model_a,
                'model_a_type': model_a,
                'model_b_name': model_b,
                'model_b_type': model_b,
                
                # Model A metrics
                'accuracy_a': metrics_a.accuracy,
                'speed_ms_a': metrics_a.speed_ms,
                'memory_mb_a': metrics_a.memory_mb,
                'carbon_emissions_a': metrics_a.carbon_emissions,
                'green_score_a': metrics_a.green_score,
                'f1_score_a': metrics_a.f1_score,
                'latency_ms_a': metrics_a.latency_ms,
                'throughput_fps_a': metrics_a.throughput_fps,
                'peak_memory_mb_a': metrics_a.peak_memory_mb,
                'cpu_usage_percent_a': metrics_a.cpu_usage_percent,
                'gpu_memory_mb_a': metrics_a.gpu_memory_mb,
                'energy_consumption_a': metrics_a.energy_consumption,
                'model_size_mb_a': metrics_a.model_size_mb,
                'precision_a': metrics_a.precision,
                'recall_a': metrics_a.recall,
                'cars_detected_a': metrics_a.cars_detected,
                
                # Model B metrics
                'accuracy_b': metrics_b.accuracy,
                'speed_ms_b': metrics_b.speed_ms,
                'memory_mb_b': metrics_b.memory_mb,
                'carbon_emissions_b': metrics_b.carbon_emissions,
                'green_score_b': metrics_b.green_score,
                'f1_score_b': metrics_b.f1_score,
                'latency_ms_b': metrics_b.latency_ms,
                'throughput_fps_b': metrics_b.throughput_fps,
                'peak_memory_mb_b': metrics_b.peak_memory_mb,
                'cpu_usage_percent_b': metrics_b.cpu_usage_percent,
                'gpu_memory_mb_b': metrics_b.gpu_memory_mb,
                'energy_consumption_b': metrics_b.energy_consumption,
                'model_size_mb_b': metrics_b.model_size_mb,
                'precision_b': metrics_b.precision,
                'recall_b': metrics_b.recall,
                'cars_detected_b': metrics_b.cars_detected,
                
                # Comparison results
                'winner': winner,
                'win_margin': win_margin,
                'test_images_count': test_config.get('image_count', 0),
                'test_duration_seconds': max(metrics_a.test_duration_seconds, metrics_b.test_duration_seconds),
                'gpu_type': test_config.get('gpu_type', 'NVIDIA RTX A4000'),
                'runpod_endpoint_id': test_config.get('endpoint_id'),
                'raw_results_json': json.dumps({
                    'model_a_metrics': asdict(metrics_a),
                    'model_b_metrics': asdict(metrics_b),
                    'test_config': test_config
                })
            }
            
            cursor.execute(query, params)
            self.connection.commit()
            cursor.close()
            
            logger.info(f"✅ Benchmark results saved to database successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save benchmark results: {str(e)}")
            if self.connection:
                self.connection.rollback()
            return False

# Global benchmark instance
benchmark = ComprehensiveCarDetectionBenchmark()
database = DatabaseIntegration()

def handler(job):
    """Enhanced RunPod handler with complete metrics and database integration"""
    logger.info("🚀 Vision Benchmark Worker - Enhanced Handler Starting")
    
    try:
        # Parse job input
        job_input = job.get('input', {})
        model_a = job_input.get('model_a', 'Trained_yolov5')
        model_b = job_input.get('model_b', 'efficientnet_b0') 
        images_data = job_input.get('images_data', [])
        test_config = job_input.get('test_config', {})
        
        logger.info(f"Comparing models: {model_a} vs {model_b}")
        logger.info(f"Processing {len(images_data)} images")
        
        # Validate inputs
        if not images_data:
            return {
                "error": "No images provided for benchmarking",
                "status": "failed"
            }
        
        # Connect to database
        database_connected = database.connect()
        
        # Run benchmarks for both models
        start_time = time.time()
        
        logger.info(f"🔬 Benchmarking Model A: {model_a}")
        metrics_a = asyncio.run(benchmark.benchmark_model(model_a, images_data))
        
        logger.info(f"🔬 Benchmarking Model B: {model_b}")
        metrics_b = asyncio.run(benchmark.benchmark_model(model_b, images_data))
        
        total_time = time.time() - start_time
        
        # Determine winner based on comprehensive scoring
        score_a = (metrics_a.accuracy * 0.4 + 
                  (1000 / max(metrics_a.speed_ms, 1)) * 0.3 + 
                  metrics_a.green_score / 100 * 0.3)
        score_b = (metrics_b.accuracy * 0.4 + 
                  (1000 / max(metrics_b.speed_ms, 1)) * 0.3 + 
                  metrics_b.green_score / 100 * 0.3)
        
        if score_a > score_b:
            winner = model_a
            winner_details = "Better overall performance"
        elif score_b > score_a:
            winner = model_b
            winner_details = "Better overall performance"
        else:
            winner = "Tie"
            winner_details = "Equal performance"
        
        # Prepare results
        results = {
            "status": "completed",
            "comparison": {
                "winner": winner,
                "winner_details": winner_details,
                "modelA": {
                    "name": model_a,
                    "metrics": asdict(metrics_a)
                },
                "modelB": {
                    "name": model_b,
                    "metrics": asdict(metrics_b)
                }
            },
            "test_summary": {
                "total_images": len(images_data),
                "total_duration_seconds": total_time,
                "timestamp": time.time(),
                "gpu_available": torch.cuda.is_available(),
                "carbon_tracking": CARBON_TRACKING
            }
        }
        
        # Save to database if connected
        if database_connected:
            logger.info("💾 Saving benchmark results to Supabase database...")
            test_config.update({
                'test_name': f"{model_a} vs {model_b} Comparison",
                'image_count': len(images_data),
                'endpoint_id': os.getenv('RUNPOD_ENDPOINT_ID')
            })
            
            save_success = database.save_benchmark_results(model_a, model_b, metrics_a, metrics_b, test_config)
            if save_success:
                logger.info("✅ Results saved to database successfully!")
            else:
                logger.error("❌ Failed to save results to database")
        else:
            logger.warning("⚠️  Database not connected - results not saved")
            logger.info("💡 Set DATABASE_URL environment variable to enable database storage")
        
        logger.info(f"🎯 BENCHMARK COMPLETE! Winner: {winner}")
        logger.info(f"Model A ({model_a}): Accuracy={metrics_a.accuracy:.3f}, Speed={metrics_a.speed_ms:.2f}ms")
        logger.info(f"Model B ({model_b}): Accuracy={metrics_b.accuracy:.3f}, Speed={metrics_b.speed_ms:.2f}ms")
        
        return results
        
    except Exception as e:
        logger.error(f"❌ Benchmark handler failed: {str(e)}")
        return {
            "error": str(e),
            "status": "failed",
            "timestamp": time.time()
        }

if __name__ == "__main__":
    # Test the enhanced worker locally
    print("🔬 Enhanced Vision Benchmark Worker - Testing Mode")
    
    # Test data
    test_images = [
        {"image": "test_image_1.jpg", "ground_truth_cars": 2},
        {"image": "test_image_2.jpg", "ground_truth_cars": 1},
        {"image": "test_image_3.jpg", "ground_truth_cars": 3}
    ]
    
    test_job = {
        "input": {
            "model_a": "Trained_yolov5",
            "model_b": "efficientnet_b0",
            "images_data": test_images,
            "test_config": {"test_name": "Local Test"}
        }
    }
    
    result = handler(test_job)
    print("📊 Test Results:", json.dumps(result, indent=2))
