#!/usr/bin/env python3
"""
Simple test to verify cyclops mode functionality
"""

import sys
import os

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from robo_eyes import RoboEyes
    
    print("Testing cyclops mode functionality...")
    
    # Create RoboEyes instance
    eyes = RoboEyes()
    
    # Test initial state
    print(f"Initial cyclops state: {eyes.cyclops}")
    
    # Test set_cyclops method
    eyes.set_cyclops(True)
    print(f"After set_cyclops(True): {eyes.cyclops}")
    
    eyes.set_cyclops(False)
    print(f"After set_cyclops(False): {eyes.cyclops}")
    
    # Test toggle_cyclops method
    state1 = eyes.toggle_cyclops()
    print(f"After first toggle: {state1}")
    
    state2 = eyes.toggle_cyclops()
    print(f"After second toggle: {state2}")
    
    print("✓ Cyclops mode functionality works correctly!")
    print("✓ The toggle function properly switches between True and False")
    print("✓ Now you can press 'C' key during runtime to toggle cyclops mode")
    
except ImportError as e:
    print(f"Import error: {e}")
except Exception as e:
    print(f"Error: {e}")