import pygame
import math
import time
import random
import numpy as np
from typing import Dict, Tuple, List
from dataclasses import dataclass

@dataclass
class EyeState:
    x: float = 0.0
    y: float = 0.0
    blink_amount: float = 0.0
    brightness: float = 1.0

@dataclass
class FaceParams:
    eye_width: int = 80
    eye_height: int = 60
    eye_distance: int = 120
    eye_color: Tuple[int, int, int] = (0, 255, 255)  # cyan
    corner_radius: int = 8
    mouth_width: int = 100
    mouth_height: int = 20
    nose_size: int = 15
    
    # New individual controls
    left_eye_width: int = 80
    right_eye_width: int = 80
    left_eye_height: int = 60
    right_eye_height: int = 60
    mouth_curve: float = 0.0
    mouth_openness: float = 0.0
    eye_squint: float = 0.0
    eyebrow_angle: float = 0.0
    show_teeth: bool = False
    show_tongue: bool = False
    tear_intensity: float = 0.0
    sparkle_intensity: float = 0.0
    glow_intensity: float = 1.0
    animation_speed: float = 1.0
    expression_intensity: float = 1.0

@dataclass
class Tear:
    x: float
    y: float
    speed: float
    size: float
    alpha: float = 255
    wobble: float = 0.0

@dataclass
class Sparkle:
    x: float
    y: float
    size: float
    rotation: float
    life: float
    max_life: float
    is_heart: bool = False
    velocity_x: float = 0.0
    velocity_y: float = 0.0
    color: Tuple[int, int, int] = (255, 255, 255)

class RoboFace:
    def __init__(self):
        pygame.init()
        pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
        
        # Screen setup - larger for more controls
        self.width = 800
        self.height = 600
        self.screen = pygame.display.set_mode((self.width + 400, self.height + 300))
        pygame.display.set_caption("RoboFace - Ultra Enhanced Edition")
        
        # State
        self.eye_state = EyeState()
        self.face_params = FaceParams()
        self.expression = 'neutral'
        self.auto_mode = True
        self.sound_enabled = True
        
        # Animation state
        self.last_blink = 0
        self.blink_duration = 0
        self.mouse_pos = (0, 0)
        self.running = True
        self.clock = pygame.time.Clock()
        
        # Dramatic effects
        self.tears: List[Tear] = []
        self.sparkles: List[Sparkle] = []
        self.last_tear = 0
        self.last_sparkle = 0
        self.eyebrow_anger = 0.0
        
        # Slider dragging state
        self.dragging_slider = None
        
        # Enhanced expression definitions with dramatic improvements
        self.expressions = {
            'neutral': {
                'eye_height': 60, 'brightness': 1.0, 'eye_offset': 0, 'eye_curve': 0,
                'has_tears': False, 'has_sparkles': False, 'has_eyebrows': False,
                'eyebrow_angle': 0, 'mouth_curve': 0, 'mouth_width_mult': 1.0,
                'mouth_height_mult': 1.0, 'mouth_open': 0.0, 'nose_glow': 0.5,
                'eye_squint': 0.0, 'show_teeth': False, 'show_tongue': False
            },
            'happy': {
                'eye_height': 35, 'brightness': 2.5, 'eye_offset': -15, 'eye_curve': 1.2,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': False,
                'eyebrow_angle': 0, 'mouth_curve': 1.8, 'mouth_width_mult': 1.8,
                'mouth_height_mult': 1.2, 'mouth_open': 0.6, 'nose_glow': 2.0,
                'eye_squint': 0.7, 'show_teeth': True, 'show_tongue': False,
                'has_heart_sparkles': True, 'eye_rainbow': True
            },
            'ecstatic': {
                'eye_height': 25, 'brightness': 3.0, 'eye_offset': -20, 'eye_curve': 1.5,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': False,
                'eyebrow_angle': 0, 'mouth_curve': 2.2, 'mouth_width_mult': 2.2,
                'mouth_height_mult': 1.5, 'mouth_open': 0.9, 'nose_glow': 2.5,
                'eye_squint': 0.9, 'show_teeth': True, 'show_tongue': True,
                'has_heart_sparkles': True, 'eye_rainbow': True
            },
            'sad': {
                'eye_height': 70, 'brightness': 0.4, 'eye_offset': 20, 'eye_curve': -0.6,
                'has_tears': True, 'has_sparkles': False, 'has_eyebrows': True,
                'eyebrow_angle': 0.4, 'mouth_curve': -1.2, 'mouth_width_mult': 0.6,
                'mouth_height_mult': 0.4, 'mouth_open': 0.1, 'nose_glow': 0.2,
                'eye_squint': 0.0, 'show_teeth': False, 'show_tongue': False
            },
            'crying': {
                'eye_height': 80, 'brightness': 0.3, 'eye_offset': 25, 'eye_curve': -0.8,
                'has_tears': True, 'has_sparkles': False, 'has_eyebrows': True,
                'eyebrow_angle': 0.6, 'mouth_curve': -1.5, 'mouth_width_mult': 0.5,
                'mouth_height_mult': 0.3, 'mouth_open': 0.3, 'nose_glow': 0.1,
                'eye_squint': 0.0, 'show_teeth': False, 'show_tongue': False
            },
            'angry': {
                'eye_height': 30, 'brightness': 2.2, 'eye_offset': -12, 'eye_curve': 0,
                'has_tears': False, 'has_sparkles': False, 'has_eyebrows': True,
                'eyebrow_angle': -1.2, 'mouth_curve': -0.8, 'mouth_width_mult': 0.8,
                'mouth_height_mult': 1.8, 'mouth_open': 0.7, 'nose_glow': 2.2,
                'eye_squint': 0.3, 'show_teeth': True, 'show_tongue': False
            },
            'furious': {
                'eye_height': 25, 'brightness': 2.8, 'eye_offset': -15, 'eye_curve': -0.2,
                'has_tears': False, 'has_sparkles': False, 'has_eyebrows': True,
                'eyebrow_angle': -1.5, 'mouth_curve': -1.2, 'mouth_width_mult': 0.7,
                'mouth_height_mult': 2.2, 'mouth_open': 0.9, 'nose_glow': 2.8,
                'eye_squint': 0.5, 'show_teeth': True, 'show_tongue': True
            },
            'surprised': {
                'eye_height': 110, 'brightness': 1.8, 'eye_offset': -8, 'eye_curve': 0,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': True,
                'eyebrow_angle': 0.8, 'mouth_curve': 0, 'mouth_width_mult': 0.4,
                'mouth_height_mult': 2.0, 'mouth_open': 1.0, 'nose_glow': 1.2,
                'eye_squint': 0.0, 'show_teeth': False, 'show_tongue': False
            },
            'shocked': {
                'eye_height': 130, 'brightness': 2.2, 'eye_offset': -12, 'eye_curve': 0,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': True,
                'eyebrow_angle': 1.2, 'mouth_curve': 0, 'mouth_width_mult': 0.3,
                'mouth_height_mult': 2.5, 'mouth_open': 1.2, 'nose_glow': 1.8,
                'eye_squint': 0.0, 'show_teeth': False, 'show_tongue': False
            },
            'sleepy': {
                'eye_height': 8, 'brightness': 0.3, 'eye_offset': 15, 'eye_curve': 0.8,
                'has_tears': False, 'has_sparkles': False, 'has_eyebrows': True,
                'eyebrow_angle': 0.3, 'mouth_curve': 0.3, 'mouth_width_mult': 0.6,
                'mouth_height_mult': 0.6, 'mouth_open': 0.2, 'nose_glow': 0.1,
                'eye_squint': 0.9, 'show_teeth': False, 'show_tongue': False
            },
            'love': {
                'eye_height': 40, 'brightness': 2.0, 'eye_offset': -10, 'eye_curve': 0.8,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': False,
                'eyebrow_angle': 0, 'mouth_curve': 1.5, 'mouth_width_mult': 1.4,
                'mouth_height_mult': 1.0, 'mouth_open': 0.3, 'nose_glow': 1.5,
                'eye_squint': 0.6, 'show_teeth': False, 'show_tongue': False,
                'has_heart_sparkles': True
            },
            'mischievous': {
                'eye_height': 45, 'brightness': 1.6, 'eye_offset': -5, 'eye_curve': 0.4,
                'has_tears': False, 'has_sparkles': True, 'has_eyebrows': True,
                'eyebrow_angle': -0.3, 'mouth_curve': 0.8, 'mouth_width_mult': 1.2,
                'mouth_height_mult': 0.8, 'mouth_open': 0.4, 'nose_glow': 1.0,
                'eye_squint': 0.3, 'show_teeth': False, 'show_tongue': False
            }
        }
        
        # Color presets
        self.color_presets = [
            (0, 255, 255),    # cyan
            (0, 255, 0),      # green
            (255, 0, 128),    # pink
            (255, 255, 0),    # yellow
            (255, 64, 0),     # orange
            (128, 0, 255),    # purple
            (255, 255, 255),  # white
            (255, 0, 0),      # red
            (0, 0, 255),      # blue
        ]
        
        # UI setup
        self.title_font = pygame.font.Font(None, 28)
        self.font = pygame.font.Font(None, 20)
        self.small_font = pygame.font.Font(None, 16)
        
        # Control areas
        self.canvas_rect = pygame.Rect(50, 50, self.width, self.height)
        self.setup_ui_elements()

    def setup_ui_elements(self):
        """Setup comprehensive UI elements with individual controls"""
        card_y = self.height + 60
        card_height = 220
        
        # Basic Control panel
        self.control_card = pygame.Rect(15, card_y, 180, card_height)
        self.auto_mode_rect = pygame.Rect(30, card_y + 30, 20, 20)
        self.sound_rect = pygame.Rect(30, card_y + 55, 20, 20)
        self.blink_button_rect = pygame.Rect(30, card_y + 85, 140, 25)
        self.reset_button_rect = pygame.Rect(30, card_y + 115, 140, 25)
        
        # Expression panel
        self.expression_card = pygame.Rect(215, card_y, 320, card_height)
        self.expression_buttons = {}
        expressions = list(self.expressions.keys())
        for i, exp in enumerate(expressions):
            x = 230 + (i % 4) * 75
            y = card_y + 30 + (i // 4) * 30
            self.expression_buttons[exp] = pygame.Rect(x, y, 70, 25)
        
        # Individual Eye Controls
        self.eye_controls_card = pygame.Rect(555, card_y, 200, card_height)
        slider_x = 570
        slider_width = 160
        self.left_eye_width_slider = pygame.Rect(slider_x, card_y + 25, slider_width, 15)
        self.right_eye_width_slider = pygame.Rect(slider_x, card_y + 45, slider_width, 15)
        self.left_eye_height_slider = pygame.Rect(slider_x, card_y + 65, slider_width, 15)
        self.right_eye_height_slider = pygame.Rect(slider_x, card_y + 85, slider_width, 15)
        self.eye_distance_slider = pygame.Rect(slider_x, card_y + 105, slider_width, 15)
        self.eye_squint_slider = pygame.Rect(slider_x, card_y + 125, slider_width, 15)
        self.eyebrow_angle_slider = pygame.Rect(slider_x, card_y + 145, slider_width, 15)
        self.brightness_slider = pygame.Rect(slider_x, card_y + 165, slider_width, 15)
        
        # Mouth Controls
        self.mouth_controls_card = pygame.Rect(775, card_y, 200, card_height)
        mouth_slider_x = 790
        self.mouth_width_slider = pygame.Rect(mouth_slider_x, card_y + 25, slider_width, 15)
        self.mouth_height_slider = pygame.Rect(mouth_slider_x, card_y + 45, slider_width, 15)
        self.mouth_curve_slider = pygame.Rect(mouth_slider_x, card_y + 65, slider_width, 15)
        self.mouth_openness_slider = pygame.Rect(mouth_slider_x, card_y + 85, slider_width, 15)
        self.show_teeth_rect = pygame.Rect(mouth_slider_x, card_y + 105, 15, 15)
        self.show_tongue_rect = pygame.Rect(mouth_slider_x, card_y + 125, 15, 15)
        
        # Effects Controls
        self.effects_card = pygame.Rect(995, card_y, 200, card_height)
        effects_slider_x = 1010
        self.tear_intensity_slider = pygame.Rect(effects_slider_x, card_y + 25, slider_width, 15)
        self.sparkle_intensity_slider = pygame.Rect(effects_slider_x, card_y + 45, slider_width, 15)
        self.glow_intensity_slider = pygame.Rect(effects_slider_x, card_y + 65, slider_width, 15)
        self.animation_speed_slider = pygame.Rect(effects_slider_x, card_y + 85, slider_width, 15)
        self.corner_radius_slider = pygame.Rect(effects_slider_x, card_y + 105, slider_width, 15)
        self.nose_size_slider = pygame.Rect(effects_slider_x, card_y + 125, slider_width, 15)
        
        # Color panel - updated for more colors
        self.color_card = pygame.Rect(15, card_y + card_height + 20, 1180, 60)
        self.color_buttons = []
        for i, color in enumerate(self.color_presets):
            x = 30 + i * 125
            y = card_y + card_height + 35
            self.color_buttons.append((pygame.Rect(x, y, 120, 30), color))

    def draw_dramatic_mouth(self, surface, center_x: int, center_y: int):
        """Draw dramatically improved mouth with teeth, tongue, and complex curves"""
        current_expression = self.expressions[self.expression]
        
        mouth_width = int(self.face_params.mouth_width * current_expression['mouth_width_mult'])
        mouth_height = int(self.face_params.mouth_height * current_expression['mouth_height_mult'])
        mouth_curve = current_expression['mouth_curve'] + self.face_params.mouth_curve
        mouth_open = current_expression['mouth_open'] + self.face_params.mouth_openness
        
        if mouth_width <= 0 or mouth_height <= 0:
            return
        
        mouth_y = center_y + 100
        mouth_color = self.face_params.eye_color
        
        # Create mouth surface for complex rendering
        mouth_surface_size = max(mouth_width + 60, mouth_height + 60, 120)
        mouth_surface = pygame.Surface((mouth_surface_size, mouth_surface_size), pygame.SRCALPHA)
        surface_center_x = mouth_surface_size // 2
        surface_center_y = mouth_surface_size // 2
        
        if mouth_open > 0.1:  # Open mouth
            mouth_rect = pygame.Rect(
                surface_center_x - mouth_width // 2,
                surface_center_y - int(mouth_height * mouth_open) // 2,
                mouth_width,
                int(mouth_height * mouth_open)
            )
            
            # Dark interior with depth
            interior_colors = [(20, 20, 20), (40, 20, 20), (60, 30, 30)]
            for i, color in enumerate(interior_colors):
                offset_rect = pygame.Rect(
                    mouth_rect.x + i,
                    mouth_rect.y + i,
                    mouth_rect.width - 2*i,
                    mouth_rect.height - 2*i
                )
                if offset_rect.width > 0 and offset_rect.height > 0:
                    self.draw_rounded_rect(mouth_surface, color, offset_rect, self.face_params.corner_radius)
            
            # Draw teeth if enabled
            if current_expression.get('show_teeth', False) or self.face_params.show_teeth:
                self.draw_teeth(mouth_surface, mouth_rect, mouth_open)
            
            # Draw tongue if enabled
            if current_expression.get('show_tongue', False) or self.face_params.show_tongue:
                self.draw_tongue(mouth_surface, mouth_rect, mouth_open)
            
            # Glowing outline with multiple layers
            for i in range(5):
                outline_rect = pygame.Rect(
                    mouth_rect.x - i,
                    mouth_rect.y - i,
                    mouth_rect.width + 2*i,
                    mouth_rect.height + 2*i
                )
                alpha = max(20, 120 - i * 20)
                outline_color = (*mouth_color, alpha)
                
                outline_surface = pygame.Surface((outline_rect.width, outline_rect.height), pygame.SRCALPHA)
                self.draw_rounded_rect(outline_surface, outline_color, 
                                     pygame.Rect(0, 0, outline_rect.width, outline_rect.height), 
                                     self.face_params.corner_radius + i)
                mouth_surface.blit(outline_surface, outline_rect.topleft)
        
        else:  # Closed mouth with dramatic curves
            # Create complex curved mouth line
            mouth_points = []
            num_points = 30
            
            for i in range(num_points + 1):
                t = i / num_points
                x = surface_center_x + (t - 0.5) * mouth_width
                
                # Complex curve calculation with multiple harmonics
                base_curve = mouth_curve * mouth_height * math.sin(t * math.pi)
                harmonic1 = mouth_curve * mouth_height * 0.3 * math.sin(t * math.pi * 2)
                harmonic2 = mouth_curve * mouth_height * 0.15 * math.sin(t * math.pi * 3)
                
                y = surface_center_y + base_curve + harmonic1 + harmonic2
                mouth_points.append((int(x), int(y)))
            
            # Draw mouth line with dramatic thickness and glow
            if len(mouth_points) >= 2:
                mouth_thickness = max(3, mouth_height // 2)
                
                # Multiple glow layers
                for thickness in range(mouth_thickness + 8, 0, -1):
                    alpha = max(15, min(255, 180 - thickness * 15))
                    glow_color = (*mouth_color, alpha)
                    
                    # Draw thick line segments
                    for i in range(len(mouth_points) - 1):
                        start_pos = mouth_points[i]
                        end_pos = mouth_points[i + 1]
                        
                        # Create line surface for alpha blending
                        line_surface = pygame.Surface((mouth_surface_size, mouth_surface_size), pygame.SRCALPHA)
                        pygame.draw.line(line_surface, glow_color, start_pos, end_pos, thickness)
                        mouth_surface.blit(line_surface, (0, 0))
        
        # Apply expression-specific mouth effects
        if self.expression == 'happy' or self.expression == 'ecstatic':
            # Add smile sparkles
            for _ in range(3):
                spark_x = random.randint(surface_center_x - mouth_width//2, surface_center_x + mouth_width//2)
                spark_y = random.randint(surface_center_y - 10, surface_center_y + 10)
                spark_size = random.randint(2, 5)
                pygame.draw.circle(mouth_surface, (255, 255, 255, 150), (spark_x, spark_y), spark_size)
        
        # Blit mouth to main surface
        surface.blit(mouth_surface, (center_x - mouth_surface_size // 2, mouth_y - mouth_surface_size // 2))

    def draw_teeth(self, surface, mouth_rect, openness):
        """Draw realistic teeth"""
        num_teeth = 8
        tooth_width = mouth_rect.width // (num_teeth + 1)
        tooth_height = min(20, int(mouth_rect.height * openness * 0.4))
        
        # Top teeth
        for i in range(num_teeth):
            tooth_x = mouth_rect.x + (i + 1) * (mouth_rect.width / (num_teeth + 1)) - tooth_width // 2
            tooth_y = mouth_rect.y + 3
            
            # Tooth shape with rounded top
            tooth_rect = pygame.Rect(tooth_x, tooth_y, tooth_width - 1, tooth_height)
            
            # Tooth gradient
            for j in range(tooth_height):
                brightness = int(255 - j * 2)
                tooth_color = (brightness, brightness, brightness)
                pygame.draw.line(surface, tooth_color, 
                               (tooth_rect.x, tooth_rect.y + j), 
                               (tooth_rect.right, tooth_rect.y + j))
            
            # Tooth highlight
            pygame.draw.line(surface, (255, 255, 255), 
                           (tooth_rect.x + 1, tooth_rect.y + 1), 
                           (tooth_rect.x + 1, tooth_rect.y + tooth_height // 2))
        
        # Bottom teeth (if mouth is open enough)
        if openness > 0.6:
            for i in range(num_teeth):
                tooth_x = mouth_rect.x + (i + 1) * (mouth_rect.width / (num_teeth + 1)) - tooth_width // 2
                tooth_y = mouth_rect.bottom - tooth_height - 3
                
                tooth_rect = pygame.Rect(tooth_x, tooth_y, tooth_width - 1, tooth_height)
                
                # Bottom teeth gradient (slightly darker)
                for j in range(tooth_height):
                    brightness = int(240 - j * 2)
                    tooth_color = (brightness, brightness, brightness)
                    pygame.draw.line(surface, tooth_color, 
                                   (tooth_rect.x, tooth_rect.y + j), 
                                   (tooth_rect.right, tooth_rect.y + j))

    def draw_tongue(self, surface, mouth_rect, openness):
        """Draw realistic tongue"""
        tongue_width = int(mouth_rect.width * 0.7)
        tongue_height = int(mouth_rect.height * openness * 0.5)
        
        if tongue_height <= 0:
            return
        
        tongue_x = mouth_rect.centerx - tongue_width // 2
        tongue_y = mouth_rect.bottom - tongue_height - 5
        
        # Tongue base shape
        tongue_surface = pygame.Surface((tongue_width, tongue_height), pygame.SRCALPHA)
        
        # Tongue gradient from pink to darker pink
        for y in range(tongue_height):
            progress = y / tongue_height
            red = int(255 - progress * 50)
            green = int(100 + progress * 20)
            blue = int(120 + progress * 30)
            
            color = (red, green, blue, 200)
            pygame.draw.line(tongue_surface, color, (5, y), (tongue_width - 5, y))
        
        # Tongue highlight
        highlight_height = tongue_height // 3
        for y in range(highlight_height):
            alpha = int(100 - y * 2)
            highlight_color = (255, 200, 220, alpha)
            pygame.draw.line(tongue_surface, highlight_color, 
                           (tongue_width // 4, y), 
                           (tongue_width * 3 // 4, y))
        
        # Tongue texture (small lines)
        for i in range(3):
            line_y = tongue_height // 4 + i * (tongue_height // 6)
            pygame.draw.line(tongue_surface, (200, 80, 100, 100), 
                           (tongue_width // 3, line_y), 
                           (tongue_width * 2 // 3, line_y), 1)
        
        surface.blit(tongue_surface, (tongue_x, tongue_y))

    def draw_rainbow_eye(self, surface, x: int, y: int, width: int, height: int, blink: float, brightness: float):
        """Draw rainbow eye effect for happy expressions"""
        actual_height = max(1, int(height * (1 - blink)))
        
        if actual_height <= 2:
            return
        
        eye_rect = pygame.Rect(x - width//2, y - actual_height//2, width, actual_height)
        
        # Rainbow gradient
        hue_shift = time.time() * 200 + x + y
        for i in range(width):
            hue = (hue_shift + i * 2) % 360
            # Simple HSV to RGB conversion
            h = hue / 60
            c = brightness
            x_val = c * (1 - abs((h % 2) - 1))
            
            if h < 1:
                r, g, b = c, x_val, 0
            elif h < 2:
                r, g, b = x_val, c, 0
            elif h < 3:
                r, g, b = 0, c, x_val
            elif h < 4:
                r, g, b = 0, x_val, c
            elif h < 5:
                r, g, b = x_val, 0, c
            else:
                r, g, b = c, 0, x_val
            
            rainbow_color = (int(r * 255), int(g * 255), int(b * 255))
            
            line_rect = pygame.Rect(eye_rect.x + i, eye_rect.y, 1, actual_height)
            pygame.draw.rect(surface, rainbow_color, line_rect)
        
        # Add sparkle overlay
        for _ in range(5):
            spark_x = random.randint(eye_rect.x, eye_rect.right)
            spark_y = random.randint(eye_rect.y, eye_rect.bottom)
            spark_size = random.randint(1, 3)
            pygame.draw.circle(surface, (255, 255, 255), (spark_x, spark_y), spark_size)

    def update_tears(self):
        """Enhanced tear system"""
        current_expression = self.expressions[self.expression]
        tear_active = current_expression['has_tears'] or self.face_params.tear_intensity > 0
        
        if tear_active:
            now = time.time() * 1000
            
            # Create new tears
            if now - self.last_tear > max(200, 1000 - self.face_params.tear_intensity * 800):
                self.last_tear = now
                
                center_x = self.canvas_rect.centerx
                center_y = self.canvas_rect.centery
                left_eye_x = center_x - self.face_params.eye_distance // 2
                right_eye_x = center_x + self.face_params.eye_distance // 2
                eye_y = center_y + current_expression['eye_offset']
                
                # Add tears with more variety
                for eye_x in [left_eye_x, right_eye_x]:
                    if random.random() > 0.4:
                        tear = Tear(
                            x=eye_x + random.randint(-20, 20),
                            y=eye_y + self.face_params.eye_height // 2,
                            speed=1 + random.random() * 3,
                            size=2 + random.random() * 6,
                            wobble=random.random() * 0.1
                        )
                        self.tears.append(tear)
        
        # Update existing tears with wobble
        for tear in self.tears[:]:
            tear.y += tear.speed
            tear.x += math.sin(tear.y * 0.1) * tear.wobble * 2
            tear.speed += 0.15  # Gravity
            tear.alpha = max(0, tear.alpha - 1.5)
            
            if tear.y > self.canvas_rect.bottom + 50 or tear.alpha <= 0:
                self.tears.remove(tear)

    def update_sparkles(self):
        """Enhanced sparkle system with heart shapes and rainbow colors"""
        current_expression = self.expressions[self.expression]
        sparkle_active = current_expression['has_sparkles'] or self.face_params.sparkle_intensity > 0
        
        if sparkle_active:
            now = time.time() * 1000
            
            if now - self.last_sparkle > max(50, 300 - self.face_params.sparkle_intensity * 200):
                self.last_sparkle = now
                
                center_x = self.canvas_rect.centerx
                center_y = self.canvas_rect.centery
                
                # Regular sparkles
                for _ in range(random.randint(2, 6)):
                    sparkle = Sparkle(
                        x=center_x + random.randint(-250, 250),
                        y=center_y + random.randint(-150, 150),
                        size=random.randint(4, 15),
                        rotation=random.random() * math.pi * 2,
                        life=1000 + random.random() * 2000,
                        max_life=1000 + random.random() * 2000,
                        velocity_x=random.random() * 2 - 1,
                        velocity_y=random.random() * 2 - 1,
                        color=(
                            random.randint(100, 255),
                            random.randint(100, 255),
                            random.randint(100, 255)
                        )
                    )
                    self.sparkles.append(sparkle)
                
                # Heart sparkles for love/happy expressions
                if current_expression.get('has_heart_sparkles', False):
                    for _ in range(random.randint(1, 3)):
                        sparkle = Sparkle(
                            x=center_x + random.randint(-150, 150),
                            y=center_y + random.randint(-80, 80),
                            size=random.randint(8, 15),
                            rotation=0,
                            life=2000 + random.random() * 1500,
                            max_life=2000 + random.random() * 1500,
                            is_heart=True,
                            velocity_x=random.random() * 1 - 0.5,
                            velocity_y=-random.random() * 2 - 1,
                            color=(255, 100, 150)
                        )
                        self.sparkles.append(sparkle)
        
        # Update sparkles with physics
        for sparkle in self.sparkles[:]:
            sparkle.life -= 16
            sparkle.x += sparkle.velocity_x
            sparkle.y += sparkle.velocity_y
            sparkle.velocity_y += 0.1  # Gravity
            
            if not sparkle.is_heart:
                sparkle.rotation += 0.2
            
            if sparkle.life <= 0:
                self.sparkles.remove(sparkle)

    def draw_heart_sparkle(self, surface, x, y, size, alpha):
        """Draw heart-shaped sparkle"""
        if size <= 0:
            return
            
        heart_surface = pygame.Surface((size * 2, size * 2), pygame.SRCALPHA)
        center = size
        
        # Heart color with alpha
        heart_color = (255, 100, 150, alpha)
        
        # Draw heart using circles and triangle
        radius = size // 3
        if radius > 0:
            pygame.draw.circle(heart_surface, heart_color, 
                             (center - radius//2, center - radius//2), radius)
            pygame.draw.circle(heart_surface, heart_color, 
                             (center + radius//2, center - radius//2), radius)
            
            # Triangle bottom
            points = [
                (center - size//2, center),
                (center + size//2, center),
                (center, center + size//2)
            ]
            if len(points) >= 3:
                pygame.draw.polygon(heart_surface, heart_color, points)
        
        surface.blit(heart_surface, (x - size, y - size))

    def draw_comprehensive_sliders(self, surface):
        """Draw all individual control sliders"""
        # Eye Controls
        pygame.draw.rect(surface, (100, 150, 255, 50), self.eye_controls_card, 2, border_radius=8)
        title = self.font.render("EYE CONTROLS", True, (100, 150, 255))
        surface.blit(title, (self.eye_controls_card.x + 10, self.eye_controls_card.y + 5))
        
        self.draw_improved_slider(surface, self.left_eye_width_slider, self.face_params.left_eye_width, 40, 140, "L Eye W", (100, 150, 255))
        self.draw_improved_slider(surface, self.right_eye_width_slider, self.face_params.right_eye_width, 40, 140, "R Eye W", (100, 150, 255))
        self.draw_improved_slider(surface, self.left_eye_height_slider, self.face_params.left_eye_height, 20, 120, "L Eye H", (100, 150, 255))
        self.draw_improved_slider(surface, self.right_eye_height_slider, self.face_params.right_eye_height, 20, 120, "R Eye H", (100, 150, 255))
        self.draw_improved_slider(surface, self.eye_distance_slider, self.face_params.eye_distance, 80, 200, "Distance", (100, 150, 255))
        self.draw_improved_slider(surface, self.eye_squint_slider, self.face_params.eye_squint, 0, 1, "Squint", (100, 150, 255))
        self.draw_improved_slider(surface, self.eyebrow_angle_slider, self.face_params.eyebrow_angle, -1.5, 1.5, "Eyebrow", (100, 150, 255))
        self.draw_improved_slider(surface, self.brightness_slider, self.eye_state.brightness, 0.1, 3.0, "Bright", (100, 150, 255))
        
        # Mouth Controls
        pygame.draw.rect(surface, (255, 150, 100, 50), self.mouth_controls_card, 2, border_radius=8)
        title = self.font.render("MOUTH CONTROLS", True, (255, 150, 100))
        surface.blit(title, (self.mouth_controls_card.x + 10, self.mouth_controls_card.y + 5))
        
        self.draw_improved_slider(surface, self.mouth_width_slider, self.face_params.mouth_width, 40, 200, "Width", (255, 150, 100))
        self.draw_improved_slider(surface, self.mouth_height_slider, self.face_params.mouth_height, 10, 60, "Height", (255, 150, 100))
        self.draw_improved_slider(surface, self.mouth_curve_slider, self.face_params.mouth_curve, -2, 2, "Curve", (255, 150, 100))
        self.draw_improved_slider(surface, self.mouth_openness_slider, self.face_params.mouth_openness, 0, 1.5, "Open", (255, 150, 100))
        
        # Teeth and tongue checkboxes
        teeth_color = (0, 255, 0) if self.face_params.show_teeth else (80, 80, 80)
        pygame.draw.rect(surface, teeth_color, self.show_teeth_rect, 2, border_radius=3)
        if self.face_params.show_teeth:
            pygame.draw.circle(surface, (0, 255, 0), self.show_teeth_rect.center, 5)
        text = self.small_font.render("Teeth", True, (200, 200, 200))
        surface.blit(text, (self.show_teeth_rect.right + 5, self.show_teeth_rect.y))
        
        tongue_color = (0, 255, 0) if self.face_params.show_tongue else (80, 80, 80)
        pygame.draw.rect(surface, tongue_color, self.show_tongue_rect, 2, border_radius=3)
        if self.face_params.show_tongue:
            pygame.draw.circle(surface, (0, 255, 0), self.show_tongue_rect.center, 5)
        text = self.small_font.render("Tongue", True, (200, 200, 200))
        surface.blit(text, (self.show_tongue_rect.right + 5, self.show_tongue_rect.y))
        
        # Effects Controls
        pygame.draw.rect(surface, (150, 255, 150, 50), self.effects_card, 2, border_radius=8)
        title = self.font.render("EFFECTS", True, (150, 255, 150))
        surface.blit(title, (self.effects_card.x + 10, self.effects_card.y + 5))
        
        self.draw_improved_slider(surface, self.tear_intensity_slider, self.face_params.tear_intensity, 0, 1, "Tears", (150, 255, 150))
        self.draw_improved_slider(surface, self.sparkle_intensity_slider, self.face_params.sparkle_intensity, 0, 1, "Sparkle", (150, 255, 150))
        self.draw_improved_slider(surface, self.glow_intensity_slider, self.face_params.glow_intensity, 0.1, 3.0, "Glow", (150, 255, 150))
        self.draw_improved_slider(surface, self.animation_speed_slider, self.face_params.animation_speed, 0.1, 3.0, "Anim Speed", (150, 255, 150))
        self.draw_improved_slider(surface, self.corner_radius_slider, self.face_params.corner_radius, 0, 30, "Radius", (150, 255, 150))
        self.draw_improved_slider(surface, self.nose_size_slider, self.face_params.nose_size, 5, 40, "Nose", (150, 255, 150))

    def draw_improved_slider(self, surface, rect, value, min_val, max_val, label, color=(0, 255, 255)):
        """Draw an improved slider with better visual feedback"""
        # Slider track background
        track_color = (40, 60, 80)
        track_rect = pygame.Rect(rect.x, rect.y + rect.height//4, rect.width, rect.height//2)
        pygame.draw.rect(surface, track_color, track_rect, border_radius=track_rect.height//2)
        
        # Progress calculation
        progress = max(0, min(1, (value - min_val) / (max_val - min_val)))
        
        # Active portion of track
        active_width = int(rect.width * progress)
        if active_width > 2:
            active_rect = pygame.Rect(rect.x, rect.y + rect.height//4, active_width, rect.height//2)
            pygame.draw.rect(surface, color, active_rect, border_radius=track_rect.height//2)
        
        # Slider handle
        handle_x = rect.x + int(progress * rect.width)
        handle_y = rect.centery
        handle_radius = max(6, rect.height // 2)
        
        # Handle glow
        for i in range(handle_radius + 3, 0, -1):
            alpha = max(10, 80 - i * 8)
            glow_color = (*color, alpha) if len(color) == 3 else color
            try:
                glow_surface = pygame.Surface((i * 2, i * 2), pygame.SRCALPHA)
                pygame.draw.circle(glow_surface, glow_color, (i, i), i)
                surface.blit(glow_surface, (handle_x - i, handle_y - i))
            except:
                pass
        
        # Handle
        pygame.draw.circle(surface, (255, 255, 255), (handle_x, handle_y), handle_radius + 1, 2)
        pygame.draw.circle(surface, color, (handle_x, handle_y), handle_radius)
        
        # Label with value
        if isinstance(value, float):
            label_text = f"{label}: {value:.2f}"
        else:
            label_text = f"{label}: {int(value)}"
        
        label_surface = self.small_font.render(label_text, True, color)
        surface.blit(label_surface, (rect.x, rect.y - 16))

    def handle_comprehensive_slider_drag(self, mouse_pos, mouse_pressed):
        """Handle all slider interactions"""
        if not mouse_pressed:
            self.dragging_slider = None
            return
        
        # Check which slider is being dragged
        if self.dragging_slider is None:
            sliders = {
                'left_eye_width': (self.left_eye_width_slider, 40, 140),
                'right_eye_width': (self.right_eye_width_slider, 40, 140),
                'left_eye_height': (self.left_eye_height_slider, 20, 120),
                'right_eye_height': (self.right_eye_height_slider, 20, 120),
                'eye_distance': (self.eye_distance_slider, 80, 200),
                'eye_squint': (self.eye_squint_slider, 0, 1),
                'eyebrow_angle': (self.eyebrow_angle_slider, -1.5, 1.5),
                'brightness': (self.brightness_slider, 0.1, 3.0),
                'mouth_width': (self.mouth_width_slider, 40, 200),
                'mouth_height': (self.mouth_height_slider, 10, 60),
                'mouth_curve': (self.mouth_curve_slider, -2, 2),
                'mouth_openness': (self.mouth_openness_slider, 0, 1.5),
                'tear_intensity': (self.tear_intensity_slider, 0, 1),
                'sparkle_intensity': (self.sparkle_intensity_slider, 0, 1),
                'glow_intensity': (self.glow_intensity_slider, 0.1, 3.0),
                'animation_speed': (self.animation_speed_slider, 0.1, 3.0),
                'corner_radius': (self.corner_radius_slider, 0, 30),
                'nose_size': (self.nose_size_slider, 5, 40),
            }
            
            for name, (rect, min_val, max_val) in sliders.items():
                if rect.collidepoint(mouse_pos):
                    self.dragging_slider = name
                    break
        
        # Handle dragging
        if self.dragging_slider:
            slider_info = {
                'left_eye_width': (self.left_eye_width_slider, 40, 140),
                'right_eye_width': (self.right_eye_width_slider, 40, 140),
                'left_eye_height': (self.left_eye_height_slider, 20, 120),
                'right_eye_height': (self.right_eye_height_slider, 20, 120),
                'eye_distance': (self.eye_distance_slider, 80, 200),
                'eye_squint': (self.eye_squint_slider, 0, 1),
                'eyebrow_angle': (self.eyebrow_angle_slider, -1.5, 1.5),
                'brightness': (self.brightness_slider, 0.1, 3.0),
                'mouth_width': (self.mouth_width_slider, 40, 200),
                'mouth_height': (self.mouth_height_slider, 10, 60),
                'mouth_curve': (self.mouth_curve_slider, -2, 2),
                'mouth_openness': (self.mouth_openness_slider, 0, 1.5),
                'tear_intensity': (self.tear_intensity_slider, 0, 1),
                'sparkle_intensity': (self.sparkle_intensity_slider, 0, 1),
                'glow_intensity': (self.glow_intensity_slider, 0.1, 3.0),
                'animation_speed': (self.animation_speed_slider, 0.1, 3.0),
                'corner_radius': (self.corner_radius_slider, 0, 30),
                'nose_size': (self.nose_size_slider, 5, 40),
            }
            
            if self.dragging_slider in slider_info:
                rect, min_val, max_val = slider_info[self.dragging_slider]
                relative_x = max(0, min(mouse_pos[0] - rect.x, rect.width))
                progress = relative_x / rect.width
                value = min_val + progress * (max_val - min_val)
                
                # Update the corresponding parameter
                if self.dragging_slider == 'left_eye_width':
                    self.face_params.left_eye_width = int(value)
                elif self.dragging_slider == 'right_eye_width':
                    self.face_params.right_eye_width = int(value)
                elif self.dragging_slider == 'left_eye_height':
                    self.face_params.left_eye_height = int(value)
                elif self.dragging_slider == 'right_eye_height':
                    self.face_params.right_eye_height = int(value)
                elif self.dragging_slider == 'eye_distance':
                    self.face_params.eye_distance = int(value)
                elif self.dragging_slider == 'eye_squint':
                    self.face_params.eye_squint = value
                elif self.dragging_slider == 'eyebrow_angle':
                    self.face_params.eyebrow_angle = value
                elif self.dragging_slider == 'brightness':
                    self.eye_state.brightness = value
                elif self.dragging_slider == 'mouth_width':
                    self.face_params.mouth_width = int(value)
                elif self.dragging_slider == 'mouth_height':
                    self.face_params.mouth_height = int(value)
                elif self.dragging_slider == 'mouth_curve':
                    self.face_params.mouth_curve = value
                elif self.dragging_slider == 'mouth_openness':
                    self.face_params.mouth_openness = value
                elif self.dragging_slider == 'tear_intensity':
                    self.face_params.tear_intensity = value
                elif self.dragging_slider == 'sparkle_intensity':
                    self.face_params.sparkle_intensity = value
                elif self.dragging_slider == 'glow_intensity':
                    self.face_params.glow_intensity = value
                elif self.dragging_slider == 'animation_speed':
                    self.face_params.animation_speed = value
                elif self.dragging_slider == 'corner_radius':
                    self.face_params.corner_radius = int(value)
                elif self.dragging_slider == 'nose_size':
                    self.face_params.nose_size = int(value)

    def handle_click(self, pos):
        """Handle mouse clicks with comprehensive controls"""
        # Auto mode checkbox
        if self.auto_mode_rect.collidepoint(pos):
            self.auto_mode = not self.auto_mode
            self.play_sound(600 if self.auto_mode else 400, 0.1, 'square')
        
        # Sound checkbox
        elif self.sound_rect.collidepoint(pos):
            self.sound_enabled = not self.sound_enabled
            if self.sound_enabled:
                self.play_sound(1000, 0.1, 'sine')
        
        # Blink button
        elif self.blink_button_rect.collidepoint(pos):
            self.trigger_blink()
        
        # Reset button
        elif self.reset_button_rect.collidepoint(pos):
            self.reset_to_defaults()
        
        # Teeth checkbox
        elif self.show_teeth_rect.collidepoint(pos):
            self.face_params.show_teeth = not self.face_params.show_teeth
            self.play_sound(800, 0.1, 'square')
        
        # Tongue checkbox
        elif self.show_tongue_rect.collidepoint(pos):
            self.face_params.show_tongue = not self.face_params.show_tongue
            self.play_sound(900, 0.1, 'square')
        
        # Expression buttons
        for exp, rect in self.expression_buttons.items():
            if rect.collidepoint(pos):
                self.change_expression(exp)
                break
        
        # Color buttons
        for rect, color in self.color_buttons:
            if rect.collidepoint(pos):
                self.face_params.eye_color = color
                self.play_sound(1200, 0.1, 'triangle')
                break

    def reset_to_defaults(self):
        """Reset all parameters to defaults"""
        self.face_params = FaceParams()
        self.eye_state = EyeState()
        self.expression = 'neutral'
        self.tears.clear()
        self.sparkles.clear()
        self.play_sound(800, 0.2)

    def draw_face(self, surface):
        """Draw the enhanced robot face"""
        # Clear canvas area
        pygame.draw.rect(surface, (0, 0, 0), self.canvas_rect)
        
        # Calculate positions
        center_x = self.canvas_rect.centerx
        center_y = self.canvas_rect.centery
        left_eye_x = center_x - self.face_params.eye_distance // 2
        right_eye_x = center_x + self.face_params.eye_distance // 2
        
        current_expression = self.expressions[self.expression]
        eye_y = center_y + current_expression['eye_offset']
        
        # Draw eyebrows if needed
        if current_expression['has_eyebrows'] or self.face_params.eyebrow_angle != 0:
            eyebrow_angle = current_expression['eyebrow_angle'] + self.face_params.eyebrow_angle
            self.draw_eyebrows(surface, left_eye_x, right_eye_x, eye_y, eyebrow_angle)
        
        # Draw eyes with individual sizing
        if current_expression.get('eye_rainbow', False) and self.expression in ['happy', 'ecstatic']:
            self.draw_rainbow_eye(surface, 
                               int(left_eye_x + self.eye_state.x), 
                               int(eye_y + self.eye_state.y),
                               self.face_params.left_eye_width, 
                               int(self.face_params.left_eye_height * (1 - self.face_params.eye_squint)), 
                               self.eye_state.blink_amount, 
                               self.eye_state.brightness)
            
            self.draw_rainbow_eye(surface, 
                               int(right_eye_x + self.eye_state.x), 
                               int(eye_y + self.eye_state.y),
                               self.face_params.right_eye_width, 
                               int(self.face_params.right_eye_height * (1 - self.face_params.eye_squint)), 
                               self.eye_state.blink_amount, 
                               self.eye_state.brightness)
        else:
            eye_curve = current_expression['eye_curve']
            if abs(eye_curve) > 0.1:
                self.draw_curved_eye(surface, 
                                   int(left_eye_x + self.eye_state.x), 
                                   int(eye_y + self.eye_state.y),
                                   self.face_params.left_eye_width, 
                                   int(self.face_params.left_eye_height * (1 - self.face_params.eye_squint)), 
                                   self.eye_state.blink_amount, 
                                   self.eye_state.brightness,
                                   eye_curve)
                
                self.draw_curved_eye(surface, 
                                   int(right_eye_x + self.eye_state.x), 
                                   int(eye_y + self.eye_state.y),
                                   self.face_params.right_eye_width, 
                                   int(self.face_params.right_eye_height * (1 - self.face_params.eye_squint)), 
                                   self.eye_state.blink_amount, 
                                   self.eye_state.brightness,
                                   eye_curve)
            else:
                self.draw_eye(surface, 
                             int(left_eye_x + self.eye_state.x), 
                             int(eye_y + self.eye_state.y),
                             self.face_params.left_eye_width, 
                             int(self.face_params.left_eye_height * (1 - self.face_params.eye_squint)), 
                             self.eye_state.blink_amount, 
                             self.eye_state.brightness)
                
                self.draw_eye(surface, 
                             int(right_eye_x + self.eye_state.x), 
                             int(eye_y + self.eye_state.y),
                             self.face_params.right_eye_width, 
                             int(self.face_params.right_eye_height * (1 - self.face_params.eye_squint)), 
                             self.eye_state.blink_amount, 
                             self.eye_state.brightness)
        
        # Draw nose with enhanced glow
        nose_glow = current_expression['nose_glow'] * self.face_params.glow_intensity
        if nose_glow > 0:
            self.draw_enhanced_nose(surface, center_x, center_y, nose_glow)
        
        # Draw dramatically improved mouth
        self.draw_dramatic_mouth(surface, center_x, center_y)
        
        # Draw enhanced effects
        self.draw_tears(surface)
        self.draw_enhanced_sparkles(surface)
        
        # Enhanced ambient glow effect
        self.draw_enhanced_glow(surface, center_x, center_y)

    def draw_enhanced_nose(self, surface, center_x: int, center_y: int, glow_intensity: float):
        """Draw enhanced nose with better glow effects"""
        nose_y = center_y + 30
        nose_size = max(3, int(self.face_params.nose_size * glow_intensity))
        
        nose_surface_size = nose_size * 6
        nose_surface = pygame.Surface((nose_surface_size, nose_surface_size), pygame.SRCALPHA)
        nose_center = nose_surface_size // 2
        
        nose_color = self.face_params.eye_color
        
        # Multiple glow layers with enhanced effects
        for i in range(nose_size + 5, 0, -1):
            alpha = int(80 * glow_intensity * (nose_size - i + 6) / nose_size)
            alpha = max(10, min(255, alpha))
            
            # Color variation for more dynamic glow
            color_variation = int(20 * math.sin(time.time() * 3 + i))
            varied_color = (
                max(0, min(255, nose_color[0] + color_variation)),
                max(0, min(255, nose_color[1] + color_variation)),
                max(0, min(255, nose_color[2] + color_variation)),
                alpha
            )
            
            if i > 0:
                pygame.draw.circle(nose_surface, varied_color, (nose_center, nose_center), i)
        
        surface.blit(nose_surface, (center_x - nose_surface_size // 2, nose_y - nose_surface_size // 2))

    def draw_enhanced_sparkles(self, surface):
        """Draw enhanced sparkles with better effects"""
        for sparkle in self.sparkles:
            life_ratio = max(0, sparkle.life / sparkle.max_life)
            if life_ratio <= 0:
                continue
                
            alpha = max(0, min(255, int(255 * life_ratio)))
            sparkle_size = max(2, int(sparkle.size * (0.5 + life_ratio * 0.5)))
            
            if sparkle.is_heart:
                self.draw_heart_sparkle(surface, int(sparkle.x), int(sparkle.y), sparkle_size, alpha)
            else:
                # Enhanced star sparkles
                star_surface_size = sparkle_size * 4
                star_surface = pygame.Surface((star_surface_size, star_surface_size), pygame.SRCALPHA)
                center = star_surface_size // 2
                
                # Draw star with glow
                points = []
                for i in range(8):
                    angle = i * math.pi / 4 + sparkle.rotation
                    radius = sparkle_size if i % 2 == 0 else sparkle_size * 0.4
                    x = center + radius * math.cos(angle)
                    y = center + radius * math.sin(angle)
                    points.append((int(x), int(y)))
                
                # Glow layers
                for layer in range(3, 0, -1):
                    layer_alpha = max(20, alpha // layer)
                    layer_color = (*sparkle.color, layer_alpha)
                    
                    # Expand points for glow
                    expanded_points = []
                    center_x = sum(p[0] for p in points) / len(points)
                    center_y = sum(p[1] for p in points) / len(points)
                    
                    for p in points:
                        dx = p[0] - center_x
                        dy = p[1] - center_y
                        scale = 1 + layer * 0.2
                        expanded_points.append((center_x + dx * scale, center_y + dy * scale))
                    
                    if len(expanded_points) >= 3:
                        pygame.draw.polygon(star_surface, layer_color, expanded_points)
                
                # Main star
                if len(points) >= 3:
                    main_color = (*sparkle.color, alpha)
                    pygame.draw.polygon(star_surface, main_color, points)
                    
                    # Bright center
                    pygame.draw.circle(star_surface, (255, 255, 255, alpha), (center, center), max(1, sparkle_size // 3))
                
                surface.blit(star_surface, (sparkle.x - star_surface_size // 2, sparkle.y - star_surface_size // 2))

    def draw_enhanced_glow(self, surface, center_x: int, center_y: int):
        """Draw enhanced ambient glow around the face"""
        glow_intensity = self.face_params.glow_intensity
        
        # Expression-based glow multiplier
        expression_multipliers = {
            'happy': 1.8,
            'ecstatic': 2.2,
            'angry': 1.5,
            'furious': 2.0,
            'love': 1.6,
            'surprised': 1.3,
            'shocked': 1.5
        }
        
        multiplier = expression_multipliers.get(self.expression, 1.0)
        final_intensity = glow_intensity * multiplier
        
        glow_surface = pygame.Surface((600, 600), pygame.SRCALPHA)
        
        for radius in range(300, 0, -10):
            alpha = max(1, int((sum(self.face_params.eye_color) / 3) * 0.01 * final_intensity))
            alpha = min(50, alpha)  # Cap alpha to prevent overwhelming effect
            
            # Pulsing effect
            pulse = 1 + 0.3 * math.sin(time.time() * 2)
            pulsed_alpha = int(alpha * pulse)
            
            color = (*self.face_params.eye_color, pulsed_alpha)
            pygame.draw.circle(glow_surface, color, (300, 300), radius)
        
        surface.blit(glow_surface, (center_x - 300, center_y - 300))

    def draw_ui(self, surface):
        """Draw the comprehensive user interface"""
        # UI background with animated grid
        ui_rect = pygame.Rect(0, self.height + 50, self.width + 400, 300)
        
        # Animated background
        for y in range(ui_rect.height):
            alpha = int(150 * (1 - y / ui_rect.height))
            color = (10, 15, 25, alpha)
            pygame.draw.line(surface, color, (0, ui_rect.y + y), (ui_rect.width, ui_rect.y + y))
        
        # Animated scan lines
        scan_y1 = int((time.time() * 60) % ui_rect.height)
        scan_y2 = int((time.time() * 40 + 100) % ui_rect.height)
        
        pygame.draw.line(surface, (0, 255, 255, 40), (0, ui_rect.y + scan_y1), (ui_rect.width, ui_rect.y + scan_y1), 2)
        pygame.draw.line(surface, (255, 100, 255, 30), (0, ui_rect.y + scan_y2), (ui_rect.width, ui_rect.y + scan_y2), 1)
        
        # Draw all control panels
        self.draw_basic_controls(surface)
        self.draw_expression_controls(surface)
        self.draw_comprehensive_sliders(surface)
        self.draw_enhanced_color_panel(surface)
        self.draw_status_panel(surface)

    def draw_basic_controls(self, surface):
        """Draw basic control panel"""
        pygame.draw.rect(surface, (0, 255, 255, 50), self.control_card, 2, border_radius=8)
        title = self.font.render("BASIC CONTROLS", True, (0, 255, 255))
        surface.blit(title, (self.control_card.x + 10, self.control_card.y + 5))
        
        # Enhanced checkboxes
        auto_color = (0, 255, 0) if self.auto_mode else (80, 80, 80)
        pygame.draw.rect(surface, auto_color, self.auto_mode_rect, 2, border_radius=3)
        if self.auto_mode:
            pygame.draw.circle(surface, (0, 255, 0), self.auto_mode_rect.center, 6)
            # Animated checkmark
            offset = int(2 * math.sin(time.time() * 3))
            pygame.draw.lines(surface, (255, 255, 255), False, [
                (self.auto_mode_rect.centerx - 4, self.auto_mode_rect.centery + offset),
                (self.auto_mode_rect.centerx - 1, self.auto_mode_rect.centery + 3 + offset),
                (self.auto_mode_rect.centerx + 4, self.auto_mode_rect.centery - 2 + offset)
            ], 2)
        
        text = self.small_font.render("AUTO PILOT", True, (200, 200, 200))
        surface.blit(text, (self.auto_mode_rect.right + 10, self.auto_mode_rect.y + 2))
        
        # Sound control with audio visualization
        sound_color = (0, 255, 0) if self.sound_enabled else (80, 80, 80)
        pygame.draw.rect(surface, sound_color, self.sound_rect, 2, border_radius=3)
        if self.sound_enabled:
            pygame.draw.circle(surface, (0, 255, 0), self.sound_rect.center, 6)
            # Animated sound waves
            for i in range(3):
                radius = 4 + i * 3 + int(2 * math.sin(time.time() * 4 + i))
                pygame.draw.circle(surface, (255, 255, 255, 100 - i * 30), self.sound_rect.center, radius, 1)
        
        text = self.small_font.render("AUDIO MATRIX", True, (200, 200, 200))
        surface.blit(text, (self.sound_rect.right + 10, self.sound_rect.y + 2))
        
        # Enhanced buttons
        self.draw_improved_button(surface, self.blink_button_rect, "INITIATE BLINK", False, (0, 255, 255))
        self.draw_improved_button(surface, self.reset_button_rect, "SYSTEM RESET", False, (255, 100, 100))

    def draw_expression_controls(self, surface):
        """Draw expression control panel"""
        pygame.draw.rect(surface, (255, 100, 255, 50), self.expression_card, 2, border_radius=8)
        title = self.font.render("EMOTION MATRIX", True, (255, 100, 255))
        surface.blit(title, (self.expression_card.x + 10, self.expression_card.y + 5))
        
        for exp, rect in self.expression_buttons.items():
            is_active = (self.expression == exp)
            
            # Enhanced button appearance based on expression type
            button_colors = {
                'happy': (255, 255, 0),
                'ecstatic': (255, 200, 0),
                'sad': (100, 150, 255),
                'crying': (150, 200, 255),
                'angry': (255, 100, 100),
                'furious': (255, 50, 50),
                'surprised': (200, 255, 200),
                'shocked': (255, 255, 200),
                'love': (255, 150, 200),
                'mischievous': (200, 100, 255),
                'sleepy': (150, 150, 200),
                'neutral': (180, 180, 180)
            }
            
            button_color = button_colors.get(exp, (255, 100, 255))
            self.draw_improved_button(surface, rect, exp.upper()[:8], is_active, button_color)

    def draw_enhanced_color_panel(self, surface):
        """Draw enhanced color selection panel"""
        pygame.draw.rect(surface, (255, 200, 100, 50), self.color_card, 2, border_radius=8)
        title = self.font.render("COLOR SPECTRUM MATRIX", True, (255, 200, 100))
        surface.blit(title, (self.color_card.x + 10, self.color_card.y + 5))
        
        for rect, color in self.color_buttons:
            # Enhanced color button with animation
            if self.face_params.eye_color == color:
                # Pulsing glow for selected color
                pulse = 1 + 0.5 * math.sin(time.time() * 4)
                glow_size = int(5 * pulse)
                
                glow_surface = pygame.Surface((rect.width + glow_size * 2, rect.height + glow_size * 2), pygame.SRCALPHA)
                for i in range(glow_size, 0, -1):
                    alpha = max(20, 100 - i * 15)
                    glow_color = (*color, alpha)
                    pygame.draw.rect(glow_surface, glow_color, 
                                   pygame.Rect(glow_size - i, glow_size - i, 
                                             rect.width + i * 2, rect.height + i * 2), 
                                   border_radius=8)
                surface.blit(glow_surface, (rect.x - glow_size, rect.y - glow_size))
                
                # White border for selected
                pygame.draw.rect(surface, (255, 255, 255), rect, 3, border_radius=6)
            
            # Main color with gradient
            color_surface = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
            
            # Create gradient effect
            for y in range(rect.height):
                brightness = 1 - (y / rect.height) * 0.3
                gradient_color = tuple(int(c * brightness) for c in color)
                pygame.draw.line(color_surface, gradient_color, (0, y), (rect.width, y))
            
            surface.blit(color_surface, rect.topleft)
            
            # Color name label
            color_names = {
                (0, 255, 255): "CYAN",
                (0, 255, 0): "GREEN",
                (255, 0, 128): "PINK",
                (255, 255, 0): "YELLOW",
                (255, 64, 0): "ORANGE",
                (128, 0, 255): "PURPLE",
                (255, 255, 255): "WHITE",
                (255, 0, 0): "RED",
                (0, 0, 255): "BLUE"
            }
            
            color_name = color_names.get(color, "CUSTOM")
            name_surface = self.small_font.render(color_name, True, (255, 255, 255))
            name_rect = name_surface.get_rect(center=(rect.centerx, rect.centery))
            
            # Text with shadow
            shadow_surface = self.small_font.render(color_name, True, (0, 0, 0))
            surface.blit(shadow_surface, (name_rect.x + 1, name_rect.y + 1))
            surface.blit(name_surface, name_rect)

    def draw_status_panel(self, surface):
        """Draw comprehensive status panel"""
        status_rect = pygame.Rect(15, self.height + 350, 1180, 80)
        pygame.draw.rect(surface, (0, 255, 150, 30), status_rect, 2, border_radius=8)
        
        title = self.font.render("SYSTEM DIAGNOSTICS & REAL-TIME STATUS", True, (0, 255, 150))
        surface.blit(title, (status_rect.x + 10, status_rect.y + 5))
        
        # Comprehensive status information
        status_info = [
            [
                f"MODE: {'AUTO-PILOT ENGAGED' if self.auto_mode else 'MANUAL CONTROL'}",
                f"EMOTION STATE: {self.expression.upper()}",
                f"AUDIO: {'ENABLED' if self.sound_enabled else 'DISABLED'}",
                f"EYE POSITION: ({int(self.eye_state.x)}, {int(self.eye_state.y)})",
            ],
            [
                f"BRIGHTNESS: {int(self.eye_state.brightness * 100)}%",
                f"BLINK LEVEL: {int(self.eye_state.blink_amount * 100)}%",
                f"MOUTH CURVE: {self.face_params.mouth_curve:.2f}",
                f"GLOW INTENSITY: {int(self.face_params.glow_intensity * 100)}%",
            ],
            [
                f"ACTIVE TEARS: {len(self.tears)}",
                f"ACTIVE SPARKLES: {len(self.sparkles)}",
                f"ANIMATION SPEED: {self.face_params.animation_speed:.1f}x",
                f"SYSTEM FPS: {int(self.clock.get_fps())}",
            ]
        ]
        
        for row, info_list in enumerate(status_info):
            for col, info in enumerate(info_list):
                # Animated text color based on content
                if "ENGAGED" in info or "ENABLED" in info or "ACTIVE" in info:
                    color_intensity = int(150 + 50 * math.sin(time.time() * 3 + col))
                    text_color = (0, color_intensity, 100)
                elif "DISABLED" in info or "MANUAL" in info:
                    text_color = (150, 150, 50)
                else:
                    text_color = (100, 200, 255)
                
                text = self.small_font.render(info, True, text_color)
                x = status_rect.x + 15 + col * 290
                y = status_rect.y + 30 + row * 16
                surface.blit(text, (x, y))

    def run(self):
        """Enhanced main game loop"""
        mouse_pressed = False
        
        while self.running:
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 1:  # Left click
                        mouse_pressed = True
                        self.handle_click(event.pos)
                
                elif event.type == pygame.MOUSEBUTTONUP:
                    if event.button == 1:
                        mouse_pressed = False
                        self.dragging_slider = None
                
                elif event.type == pygame.MOUSEMOTION:
                    self.mouse_pos = event.pos
                    self.handle_comprehensive_slider_drag(event.pos, mouse_pressed)
                
                elif event.type == pygame.KEYDOWN:
                    self.handle_keydown(event)
            
            # Update animation with enhanced speed control
            self.update_animation()
            
            # Draw everything
            self.screen.fill((15, 20, 30))
            
            # Enhanced canvas border with dynamic glow
            border_intensity = 1 + 0.3 * math.sin(time.time() * 2)
            # Clamp color channels to valid 0–255 range to avoid pygame ValueError
            border_color = tuple(
                max(0, min(255, int(c * border_intensity))) for c in self.face_params.eye_color
            )
            
            # Multiple border layers for glow effect
            for i in range(3, 0, -1):
                alpha = 60 - i * 15
                glow_color = (*border_color, alpha)
                glow_rect = pygame.Rect(self.canvas_rect.x - i, self.canvas_rect.y - i, 
                                      self.canvas_rect.width + 2*i, self.canvas_rect.height + 2*i)
                glow_surface = pygame.Surface((glow_rect.width, glow_rect.height), pygame.SRCALPHA)
                pygame.draw.rect(glow_surface, glow_color, 
                               pygame.Rect(0, 0, glow_rect.width, glow_rect.height), 
                               border_radius=15)
                self.screen.blit(glow_surface, glow_rect.topleft)
            
            pygame.draw.rect(self.screen, border_color, self.canvas_rect, 3, border_radius=10)
            
            # Draw face
            self.draw_face(self.screen)
            
            # Draw comprehensive UI
            self.draw_ui(self.screen)
            
            # Performance info
            fps = int(self.clock.get_fps())
            fps_color = (0, 255, 0) if fps > 50 else (255, 255, 0) if fps > 30 else (255, 0, 0)
            fps_text = self.small_font.render(f"FPS: {fps}", True, fps_color)
            self.screen.blit(fps_text, (10, 10))
            
            # Version info
            version_text = self.small_font.render("RoboFace Ultra Enhanced v2.0", True, (100, 100, 100))
            self.screen.blit(version_text, (10, 30))
            
            pygame.display.flip()
            self.clock.tick(60)
        
        pygame.quit()

    def handle_keydown(self, event):
        """Handle enhanced keyboard shortcuts"""
        if event.key == pygame.K_ESCAPE:
            self.running = False
        elif event.key == pygame.K_SPACE:
            self.trigger_blink()
        elif event.key == pygame.K_a:
            self.auto_mode = not self.auto_mode
        elif event.key == pygame.K_s:
            self.sound_enabled = not self.sound_enabled
        elif event.key == pygame.K_r:
            self.reset_to_defaults()
        elif event.key == pygame.K_t:
            self.face_params.show_teeth = not self.face_params.show_teeth
        elif event.key == pygame.K_g:
            self.face_params.show_tongue = not self.face_params.show_tongue
        # Expression hotkeys
        elif event.key == pygame.K_1:
            self.change_expression('neutral')
        elif event.key == pygame.K_2:
            self.change_expression('happy')
        elif event.key == pygame.K_3:
            self.change_expression('ecstatic')
        elif event.key == pygame.K_4:
            self.change_expression('sad')
        elif event.key == pygame.K_5:
            self.change_expression('crying')
        elif event.key == pygame.K_6:
            self.change_expression('angry')
        elif event.key == pygame.K_7:
            self.change_expression('furious')
        elif event.key == pygame.K_8:
            self.change_expression('surprised')
        elif event.key == pygame.K_9:
            self.change_expression('shocked')
        elif event.key == pygame.K_0:
            self.change_expression('love')
        elif event.key == pygame.K_MINUS:
            self.change_expression('mischievous')
        elif event.key == pygame.K_EQUALS:
            self.change_expression('sleepy')
        # Feature adjustment hotkeys
        elif event.key == pygame.K_UP:
            self.face_params.mouth_curve = min(2.0, self.face_params.mouth_curve + 0.1)
        elif event.key == pygame.K_DOWN:
            self.face_params.mouth_curve = max(-2.0, self.face_params.mouth_curve - 0.1)
        elif event.key == pygame.K_LEFT:
            self.face_params.eye_distance = max(80, self.face_params.eye_distance - 5)
        elif event.key == pygame.K_RIGHT:
            self.face_params.eye_distance = min(200, self.face_params.eye_distance + 5)
        elif event.key == pygame.K_PLUS or event.key == pygame.K_KP_PLUS:
            self.eye_state.brightness = min(3.0, self.eye_state.brightness + 0.1)
        elif event.key == pygame.K_MINUS or event.key == pygame.K_KP_MINUS:
            self.eye_state.brightness = max(0.1, self.eye_state.brightness - 0.1)

    # Include all the existing methods from the original code
    def play_sound(self, frequency: float, duration: float, wave_type: str = 'sine'):
        """Generate and play a sound with better error handling"""
        if not self.sound_enabled:
            return
            
        try:
            sample_rate = 22050
            frames = int(duration * sample_rate)
            
            if frames <= 0:
                return
            
            t = np.linspace(0, duration, frames)
            
            if wave_type == 'sine':
                wave_array = np.sin(2 * np.pi * frequency * t)
            elif wave_type == 'square':
                wave_array = np.sign(np.sin(2 * np.pi * frequency * t))
            elif wave_type == 'triangle':
                wave_array = 2 * np.abs(2 * (t * frequency - np.floor(t * frequency + 0.5))) - 1
            else:
                wave_array = np.sin(2 * np.pi * frequency * t)
            
            # Apply fade out to prevent clicking
            fade_frames = min(frames // 10, 1000)
            if fade_frames > 0:
                wave_array[-fade_frames:] *= np.linspace(1, 0, fade_frames)
            
            # Convert to 16-bit integers with volume control
            wave_array = (wave_array * 16383 * 0.3).astype(np.int16)
            
            # Create stereo sound
            stereo_array = np.zeros((frames, 2), dtype=np.int16)
            stereo_array[:, 0] = wave_array
            stereo_array[:, 1] = wave_array
            
            sound = pygame.sndarray.make_sound(stereo_array)
            sound.play()
        except Exception as e:
            print(f"Sound error: {e}")

    def draw_rounded_rect(self, surface, color, rect, radius):
        """Draw a rounded rectangle with better error handling"""
        try:
            if radius <= 0 or rect.width <= 0 or rect.height <= 0:
                pygame.draw.rect(surface, color, rect)
                return
                
            # Clamp radius
            radius = min(radius, rect.width // 2, rect.height // 2)
            
            if radius <= 1:
                pygame.draw.rect(surface, color, rect)
                return
            
            # Draw the main rectangle parts
            inner_rect = pygame.Rect(rect.x + radius, rect.y, rect.width - 2*radius, rect.height)
            if inner_rect.width > 0:
                pygame.draw.rect(surface, color, inner_rect)
            
            inner_rect = pygame.Rect(rect.x, rect.y + radius, rect.width, rect.height - 2*radius)
            if inner_rect.height > 0:
                pygame.draw.rect(surface, color, inner_rect)
            
            # Draw corners
            if radius > 0:
                pygame.draw.circle(surface, color, (rect.x + radius, rect.y + radius), radius)
                pygame.draw.circle(surface, color, (rect.x + rect.width - radius, rect.y + radius), radius)
                pygame.draw.circle(surface, color, (rect.x + radius, rect.y + rect.height - radius), radius)
                pygame.draw.circle(surface, color, (rect.x + rect.width - radius, rect.y + rect.height - radius), radius)
        except Exception as e:
            # Fallback to regular rectangle
            pygame.draw.rect(surface, color, rect)

    def draw_eye(self, surface, x: int, y: int, width: int, height: int, blink: float, brightness: float):
        """Draw a single eye with improved rendering"""
        actual_height = max(1, int(height * (1 - blink)))
        
        if actual_height <= 2:
            return
        
        eye_rect = pygame.Rect(x - width//2, y - actual_height//2, width, actual_height)
        
        # Eye background (dark)
        self.draw_rounded_rect(surface, (10, 10, 10), eye_rect, self.face_params.corner_radius)
        
        # Main eye glow (multiple layers)
        glow_intensity = max(0.1, brightness * 0.8 * self.face_params.glow_intensity)
        eye_color = self.face_params.eye_color
        
        for i in range(4, -1, -1):
            alpha = int((glow_intensity * (5 - i)) / 5 * 255)
            alpha = max(10, min(255, alpha))
            size = 1 + (i * 0.15)
            
            glow_width = max(1, int(width * size))
            glow_height = max(1, int(actual_height * size))
            glow_rect = pygame.Rect(x - glow_width//2, y - glow_height//2, glow_width, glow_height)
            
            # Create a surface for alpha blending
            if glow_width > 0 and glow_height > 0:
                glow_surface = pygame.Surface((glow_width, glow_height), pygame.SRCALPHA)
                glow_color = (*eye_color, alpha)
                self.draw_rounded_rect(glow_surface, glow_color, 
                                     pygame.Rect(0, 0, glow_width, glow_height), 
                                     max(1, int(self.face_params.corner_radius * size)))
                surface.blit(glow_surface, glow_rect.topleft)
        
        # Bright center
        self.draw_rounded_rect(surface, eye_color, eye_rect, self.face_params.corner_radius)
        
        # Inner highlight
        highlight_height = max(1, int(actual_height * 0.6))
        highlight_width = max(1, int(width * 0.8))
        highlight_rect = pygame.Rect(x - highlight_width//2, 
                                   y - highlight_height//2 - int(actual_height * 0.1), 
                                   highlight_width, highlight_height)
        
        if highlight_width > 0 and highlight_height > 0:
            highlight_surface = pygame.Surface((highlight_width, highlight_height), pygame.SRCALPHA)
            highlight_color = (255, 255, 255, 80)
            self.draw_rounded_rect(highlight_surface, highlight_color, 
                                 pygame.Rect(0, 0, highlight_width, highlight_height), 
                                 max(1, int(self.face_params.corner_radius * 0.7)))
            surface.blit(highlight_surface, highlight_rect.topleft)

    def draw_curved_eye(self, surface, x: int, y: int, width: int, height: int, blink: float, brightness: float, curve: float):
        """Draw a curved eye for dramatic expressions"""
        if abs(curve) < 0.1:
            self.draw_eye(surface, x, y, width, height, blink, brightness)
            return
        
        actual_height = max(1, int(height * (1 - blink)))
        
        if actual_height <= 2:
            return
        
        # Create curved eye surface
        surface_size = max(width + 40, actual_height + 40)
        eye_surface = pygame.Surface((surface_size, surface_size), pygame.SRCALPHA)
        surface_center_x = surface_size // 2
        surface_center_y = surface_size // 2
        
        if curve > 0:  # Happy/squinted curve
            # Draw multiple arcs to create a curved effect
            for i in range(5):
                arc_height = max(1, actual_height - (i * 2))
                if arc_height <= 0:
                    break
                arc_y = surface_center_y - arc_height // 2 + i
                
                # Create gradient effect
                alpha = max(50, int(255 * (1 - i * 0.2)))
                color = (*self.face_params.eye_color, alpha)
                
                arc_width = max(1, width - i)
                if arc_width > 0 and arc_height > 0:
                    arc_surface = pygame.Surface((arc_width, arc_height), pygame.SRCALPHA)
                    self.draw_rounded_rect(arc_surface, color, 
                                         pygame.Rect(0, 0, arc_width, arc_height), 
                                         self.face_params.corner_radius)
                    eye_surface.blit(arc_surface, (surface_center_x - arc_width // 2, arc_y))
        
        else:  # Sad/droopy curve
            # Draw droopy eye shape
            for i in range(3):
                droop_offset = int(i * 3 * abs(curve))
                droop_height = max(1, actual_height - droop_offset)
                if droop_height <= 0:
                    break
                
                alpha = max(50, int(255 * (1 - i * 0.3)))
                color = (*self.face_params.eye_color, alpha)
                
                if width > 0 and droop_height > 0:
                    arc_surface = pygame.Surface((width, droop_height), pygame.SRCALPHA)
                    self.draw_rounded_rect(arc_surface, color, 
                                         pygame.Rect(0, 0, width, droop_height), 
                                         self.face_params.corner_radius)
                    eye_surface.blit(arc_surface, (surface_center_x - width // 2, 
                                                 surface_center_y - droop_height // 2 + droop_offset))
        
        surface.blit(eye_surface, (x - surface_size // 2, y - surface_size // 2))

    def draw_eyebrows(self, surface, left_eye_x: int, right_eye_x: int, eye_y: int, angle: float):
        """Draw dramatic eyebrows for expressions with better error handling"""
        eyebrow_length = max(20, self.face_params.eye_width + 20)
        eyebrow_height = max(4, 8)
        eyebrow_offset_y = -max(20, self.face_params.eye_height // 2 + 15)
        
        # Animate eyebrow intensity for angry expression
        if 'angry' in self.expression or 'furious' in self.expression:
            self.eyebrow_anger = min(1.0, self.eyebrow_anger + 0.05)
            intensity = self.eyebrow_anger
        else:
            self.eyebrow_anger = max(0.0, self.eyebrow_anger - 0.02)
            intensity = 1.0
        
        # Calculate eyebrow colors
        base_color = self.face_params.eye_color
        eyebrow_color = (
            min(255, int(base_color[0] * 1.2 * intensity)),
            min(255, int(base_color[1] * 1.2 * intensity)),
            min(255, int(base_color[2] * 1.2 * intensity))
        )
        
        # Calculate eyebrow positions
        angle_rad = angle * intensity
        
        for eye_x, is_left in [(left_eye_x, True), (right_eye_x, False)]:
            center_y = eye_y + eyebrow_offset_y
            
            # Calculate points based on angle
            if is_left:
                inner_x = eye_x + eyebrow_length // 3
                outer_x = eye_x - eyebrow_length // 3
                inner_y = center_y - int(eyebrow_length * angle_rad * 0.3)
                outer_y = center_y + int(eyebrow_length * angle_rad * 0.3)
            else:
                inner_x = eye_x - eyebrow_length // 3
                outer_x = eye_x + eyebrow_length // 3
                inner_y = center_y - int(eyebrow_length * angle_rad * 0.3)
                outer_y = center_y + int(eyebrow_length * angle_rad * 0.3)
            
            points = [
                (inner_x, inner_y),
                (outer_x, outer_y),
                (outer_x, outer_y + eyebrow_height),
                (inner_x, inner_y + eyebrow_height)
            ]
            
            # Validate points
            valid_points = []
            for point in points:
                if isinstance(point, (tuple, list)) and len(point) == 2:
                    x, y = point
                    if isinstance(x, (int, float)) and isinstance(y, (int, float)):
                        valid_points.append((int(x), int(y)))
            
            if len(valid_points) >= 3:
                try:
                    # Draw glow effect
                    min_x = min(pt[0] for pt in valid_points)
                    min_y = min(pt[1] for pt in valid_points)
                    max_x = max(pt[0] for pt in valid_points)
                    max_y = max(pt[1] for pt in valid_points)
                    
                    glow_width = max(40, int(max_x - min_x + 40))
                    glow_height = max(40, int(max_y - min_y + 40))
                    
                    if glow_width > 0 and glow_height > 0:
                        glow_surface = pygame.Surface((glow_width, glow_height), pygame.SRCALPHA)
                        glow_points = [(p[0] - min_x + 20, p[1] - min_y + 20) for p in valid_points]
                        
                        for i in range(5):
                            alpha = max(0, min(255, 80 - i * 15))
                            glow_color = (*eyebrow_color, alpha)
                            
                            # Expand points for glow
                            center_x = sum(p[0] for p in glow_points) / len(glow_points)
                            center_y = sum(p[1] for p in glow_points) / len(glow_points)
                            
                            expanded_points = []
                            for p in glow_points:
                                dx = p[0] - center_x
                                dy = p[1] - center_y
                                scale = 1 + i * 0.2
                                expanded_points.append((center_x + dx * scale, center_y + dy * scale))
                            
                            if len(expanded_points) >= 3:
                                pygame.draw.polygon(glow_surface, glow_color, expanded_points)
                        
                        surface.blit(glow_surface, (min_x - 20, min_y - 20))
                    
                    # Main eyebrow
                    pygame.draw.polygon(surface, eyebrow_color, valid_points)
                except Exception as e:
                    print(f"Eyebrow drawing error: {e}")

    def draw_tears(self, surface):
        """Draw falling tears with better error handling"""
        for tear in self.tears:
            if tear.size <= 0 or tear.alpha <= 0:
                continue
                
            # Enhanced teardrop with shimmer
            tear_color = (100, 150, 255, max(0, min(255, int(tear.alpha))))
            
            tear_width = max(4, int(tear.size * 2))
            tear_height = max(6, int(tear.size * 3))
            
            if tear_width <= 0 or tear_height <= 0:
                continue
                
            tear_surface = pygame.Surface((tear_width + 4, tear_height + 4), pygame.SRCALPHA)
            
            try:
                # Glow effect
                for i in range(3):
                    glow_alpha = max(20, tear.alpha // (i + 1))
                    glow_color = (150, 200, 255, glow_alpha)
                    
                    # Draw circle part
                    circle_radius = max(1, int((tear.size + i) * 0.7))
                    circle_x = (tear_width + 4) // 2
                    circle_y = int((tear_height + 4) * 0.7)
                    
                    if circle_x >= 0 and circle_y >= 0:
                        pygame.draw.circle(tear_surface, glow_color, (circle_x, circle_y), circle_radius)
                    
                    # Draw triangle part
                    points = [
                        ((tear_width + 4) // 2, 2),  # Top point
                        ((tear_width + 4) // 2 - circle_radius, circle_y),
                        ((tear_width + 4) // 2 + circle_radius, circle_y)
                    ]
                    
                    if len(points) >= 3:
                        pygame.draw.polygon(tear_surface, glow_color, points)
                
                # Main tear
                circle_radius = max(1, int(tear.size * 0.7))
                circle_x = (tear_width + 4) // 2
                circle_y = int((tear_height + 4) * 0.7)
                
                pygame.draw.circle(tear_surface, tear_color, (circle_x, circle_y), circle_radius)
                
                points = [
                    ((tear_width + 4) // 2, 2),
                    ((tear_width + 4) // 2 - circle_radius, circle_y),
                    ((tear_width + 4) // 2 + circle_radius, circle_y)
                ]
                pygame.draw.polygon(tear_surface, tear_color, points)
                
                surface.blit(tear_surface, (tear.x - tear.size - 2, tear.y - tear.size - 2))
                
                # Shimmer highlight
                highlight_size = max(1, int(tear.size * 0.4))
                highlight_color = (255, 255, 255, max(0, min(255, int(tear.alpha * 0.8))))
                
                highlight_surface = pygame.Surface((highlight_size * 2, highlight_size * 2), pygame.SRCALPHA)
                pygame.draw.circle(highlight_surface, highlight_color, 
                                 (highlight_size, highlight_size), highlight_size)
                surface.blit(highlight_surface, (tear.x - highlight_size, tear.y - tear.size * 0.3))
                
            except Exception as e:
                print(f"Tear drawing error: {e}")

    def update_animation(self):
        """Update animation state with enhanced controls"""
        now = time.time() * 1000
        
        # Handle blinking with enhanced control
        current_blink = 0
        if self.auto_mode:
            if now - self.last_blink > 2000 + random.random() * 3000:
                self.last_blink = now
                self.blink_duration = 120 + random.random() * 80
                self.play_sound(800, 0.1, 'square')
            
            if now - self.last_blink < self.blink_duration:
                blink_progress = (now - self.last_blink) / self.blink_duration
                current_blink = math.sin(blink_progress * math.pi) * 0.95
        
        # Calculate eye movement with enhanced animation speed
        target_x = 0
        target_y = 0
        
        if self.auto_mode:
            # Enhanced dynamic movement
            speed_mult = self.face_params.animation_speed
            target_x = math.sin(now / (1500 / speed_mult)) * 25 + math.cos(now / (2200 / speed_mult)) * 18
            target_y = math.cos(now / (1800 / speed_mult)) * 15 + math.sin(now / (2500 / speed_mult)) * 12
            
            # Occasional dramatic movements
            if math.sin(now / (5000 / speed_mult)) > 0.95:
                target_x += random.random() * 60 - 30
                target_y += random.random() * 40 - 20
        else:
            # Enhanced mouse following
            canvas_center_x = self.canvas_rect.centerx
            canvas_center_y = self.canvas_rect.centery
            max_move_x = max(self.face_params.left_eye_width, self.face_params.right_eye_width) * 0.5
            max_move_y = max(5, max(self.face_params.left_eye_height, self.face_params.right_eye_height) * 0.5)
            
            target_x = max(-max_move_x, min(max_move_x, (self.mouse_pos[0] - canvas_center_x) * 0.15))
            target_y = max(-max_move_y, min(max_move_y, (self.mouse_pos[1] - canvas_center_y) * 0.15))
        
        # Smooth movement with animation speed control
        movement_speed = 0.12 * self.face_params.animation_speed
        self.eye_state.x += (target_x - self.eye_state.x) * movement_speed
        self.eye_state.y += (target_y - self.eye_state.y) * movement_speed
        self.eye_state.blink_amount = current_blink
        
        # Update enhanced effects
        self.update_tears()
        self.update_sparkles()

    def trigger_blink(self):
        """Trigger a manual blink with enhanced feedback"""
        self.last_blink = time.time() * 1000
        self.blink_duration = 150
        self.play_sound(800 + random.randint(-100, 100), 0.1, 'square')

    def change_expression(self, new_expression):
        """Change facial expression with enhanced transitions"""
        if self.expression == new_expression:
            return
            
        self.expression = new_expression
        
        # Enhanced expression-based parameter updates
        current_expr = self.expressions[new_expression]
        
        # Update face parameters based on expression
        if current_expr.get('show_teeth', False):
            self.face_params.show_teeth = True
        if current_expr.get('show_tongue', False):
            self.face_params.show_tongue = True
        
        # Clear effects when changing expressions
        if not current_expr['has_tears']:
            self.tears.clear()
        if not current_expr['has_sparkles']:
            self.sparkles.clear()
        
        # Enhanced sound effects
        frequencies = {
            'neutral': 800,
            'happy': 1500,
            'ecstatic': 1800,
            'sad': 300,
            'crying': 250,
            'angry': 150,
            'furious': 100,
            'surprised': 1800,
            'shocked': 2000,
            'sleepy': 250,
            'love': 1200,
            'mischievous': 1000
        }
        
        frequency = frequencies.get(new_expression, 800)
        wave_types = {
            'happy': 'triangle',
            'ecstatic': 'triangle',
            'love': 'triangle',
            'angry': 'square',
            'furious': 'square',
        }
        wave_type = wave_types.get(new_expression, 'sine')
        
        self.play_sound(frequency, 0.25, wave_type)

    def draw_improved_button(self, surface, rect, text, is_active=False, color=(0, 255, 255)):
        """Draw an improved button with enhanced visual feedback"""
        # Enhanced button background
        if is_active:
            # Pulsing effect for active buttons
            pulse = 1 + 0.2 * math.sin(time.time() * 4)
            bg_alpha = int(120 * pulse)
            bg_color = (*color, bg_alpha)
            border_color = color
            text_color = (255, 255, 255)
        else:
            bg_color = (30, 40, 50, 120)
            border_color = (100, 120, 140)
            text_color = (200, 200, 200)
        
        # Background with enhanced rounded corners
        button_surface = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
        self.draw_rounded_rect(button_surface, bg_color, 
                             pygame.Rect(0, 0, rect.width, rect.height), 8)
        surface.blit(button_surface, rect.topleft)
        
        # Enhanced border and glow effects
        if is_active:
            # Multi-layer glow effect
            for i in range(6, 0, -1):
                alpha = max(15, 60 - i * 8)
                glow_color = (*color, alpha)
                glow_surface = pygame.Surface((rect.width + i*2, rect.height + i*2), pygame.SRCALPHA)
                self.draw_rounded_rect(glow_surface, glow_color,
                                     pygame.Rect(0, 0, rect.width + i*2, rect.height + i*2), 8+i)
                surface.blit(glow_surface, (rect.x - i, rect.y - i))
        
        # Main border
        pygame.draw.rect(surface, border_color, rect, 2, border_radius=8)
        
        # Enhanced text with effects
        if is_active:
            # Text glow for active buttons
            for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
                glow_text = self.small_font.render(text, True, (*color, 100))
                text_rect = glow_text.get_rect(center=rect.center)
                surface.blit(glow_text, (text_rect.x + dx, text_rect.y + dy))
        
        # Main text
        text_surface = self.small_font.render(text, True, text_color)
        text_rect = text_surface.get_rect(center=rect.center)
        surface.blit(text_surface, text_rect)

if __name__ == "__main__":
    try:
        robo_face = RoboFace()
        robo_face.run()
    except Exception as e:
        print(f"Error running Enhanced RoboFace: {e}")
        import traceback
        traceback.print_exc()