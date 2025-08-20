import pygame
import math
import time
import random
import numpy as np
from typing import Dict, Tuple
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

class RoboFace:
    def __init__(self):
        pygame.init()
        pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
        
        # Screen setup
        self.width = 800
        self.height = 600
        self.screen = pygame.display.set_mode((self.width + 300, self.height + 200))
        pygame.display.set_caption("RoboFace")
        
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
        
        # Expression definitions
        self.expressions = {
            'neutral': {'eye_height': 60, 'brightness': 1.0, 'eye_offset': 0},
            'happy': {'eye_height': 45, 'brightness': 1.2, 'eye_offset': -8},
            'sad': {'eye_height': 70, 'brightness': 0.7, 'eye_offset': 12},
            'angry': {'eye_height': 40, 'brightness': 1.5, 'eye_offset': -5},
            'surprised': {'eye_height': 80, 'brightness': 1.3, 'eye_offset': 0},
            'sleepy': {'eye_height': 20, 'brightness': 0.5, 'eye_offset': 8}
        }
        
        # Color presets
        self.color_presets = [
            (0, 255, 255),    # cyan
            (0, 255, 0),      # green
            (255, 0, 128),    # pink
            (255, 255, 0),    # yellow
            (255, 64, 0),     # orange
            (128, 0, 255)     # purple
        ]
        
        # UI setup
        self.font = pygame.font.Font(None, 24)
        self.small_font = pygame.font.Font(None, 18)
        
        # Control areas
        self.canvas_rect = pygame.Rect(50, 50, self.width, self.height)
        self.setup_ui_elements()

    def setup_ui_elements(self):
        """Setup UI button and slider rectangles"""
        start_y = self.height + 80
        
        # Mode controls
        self.auto_mode_rect = pygame.Rect(50, start_y, 20, 20)
        self.sound_rect = pygame.Rect(50, start_y + 30, 20, 20)
        self.blink_button_rect = pygame.Rect(50, start_y + 60, 80, 30)
        
        # Expression buttons
        self.expression_buttons = {}
        for i, exp in enumerate(self.expressions.keys()):
            x = 200 + (i % 3) * 80
            y = start_y + (i // 3) * 35
            self.expression_buttons[exp] = pygame.Rect(x, y, 75, 30)
        
        # Sliders
        self.eye_distance_slider = pygame.Rect(450, start_y, 150, 20)
        self.eye_width_slider = pygame.Rect(450, start_y + 30, 150, 20)
        self.corner_radius_slider = pygame.Rect(450, start_y + 60, 150, 20)
        
        # Color buttons
        self.color_buttons = []
        for i, color in enumerate(self.color_presets):
            x = 650 + (i % 3) * 35
            y = start_y + (i // 3) * 35
            self.color_buttons.append((pygame.Rect(x, y, 30, 30), color))

    def play_sound(self, frequency: float, duration: float, wave_type: str = 'sine'):
        """Generate and play a sound"""
        if not self.sound_enabled:
            return
            
        try:
            sample_rate = 22050
            frames = int(duration * sample_rate)
            
            if wave_type == 'sine':
                wave_array = np.sin(2 * np.pi * frequency * np.linspace(0, duration, frames))
            elif wave_type == 'square':
                wave_array = np.sign(np.sin(2 * np.pi * frequency * np.linspace(0, duration, frames)))
            elif wave_type == 'triangle':
                t = np.linspace(0, duration, frames)
                wave_array = 2 * np.abs(2 * (t * frequency - np.floor(t * frequency + 0.5))) - 1
            else:
                wave_array = np.sin(2 * np.pi * frequency * np.linspace(0, duration, frames))
            
            # Apply fade out to prevent clicking
            fade_frames = int(frames * 0.1)
            if fade_frames > 0:
                wave_array[-fade_frames:] *= np.linspace(1, 0, fade_frames)
            
            # Convert to 16-bit integers
            wave_array = (wave_array * 32767 * 0.1).astype(np.int16)
            
            # Create stereo sound
            stereo_array = np.zeros((frames, 2), dtype=np.int16)
            stereo_array[:, 0] = wave_array
            stereo_array[:, 1] = wave_array
            
            sound = pygame.sndarray.make_sound(stereo_array)
            sound.play()
        except Exception as e:
            print(f"Sound error: {e}")

    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def draw_rounded_rect(self, surface, color, rect, radius):
        """Draw a rounded rectangle"""
        if radius <= 0:
            pygame.draw.rect(surface, color, rect)
            return
            
        # Clamp radius to half of the smallest dimension
        radius = min(radius, rect.width // 2, rect.height // 2)
        
        # Draw the main rectangle
        inner_rect = pygame.Rect(rect.x + radius, rect.y, rect.width - 2*radius, rect.height)
        pygame.draw.rect(surface, color, inner_rect)
        
        inner_rect = pygame.Rect(rect.x, rect.y + radius, rect.width, rect.height - 2*radius)
        pygame.draw.rect(surface, color, inner_rect)
        
        # Draw corners
        pygame.draw.circle(surface, color, (rect.x + radius, rect.y + radius), radius)
        pygame.draw.circle(surface, color, (rect.x + rect.width - radius, rect.y + radius), radius)
        pygame.draw.circle(surface, color, (rect.x + radius, rect.y + rect.height - radius), radius)
        pygame.draw.circle(surface, color, (rect.x + rect.width - radius, rect.y + rect.height - radius), radius)

    def draw_eye(self, surface, x: int, y: int, width: int, height: int, blink: float, brightness: float):
        """Draw a single eye"""
        actual_height = int(height * (1 - blink))
        
        if actual_height <= 5:
            return
        
        eye_rect = pygame.Rect(x - width//2, y - actual_height//2, width, actual_height)
        
        # Eye background (dark)
        self.draw_rounded_rect(surface, (10, 10, 10), eye_rect, self.face_params.corner_radius)
        
        # Main eye glow (multiple layers)
        glow_intensity = brightness * 0.8
        eye_color = self.face_params.eye_color
        
        for i in range(3, -1, -1):
            alpha = int((glow_intensity * (4 - i)) / 4 * 255)
            size = 1 + (i * 0.1)
            
            glow_width = int(width * size)
            glow_height = int(actual_height * size)
            glow_rect = pygame.Rect(x - glow_width//2, y - glow_height//2, glow_width, glow_height)
            
            # Create a surface for alpha blending
            glow_surface = pygame.Surface((glow_width, glow_height), pygame.SRCALPHA)
            glow_color = (*eye_color, max(10, min(255, alpha)))
            self.draw_rounded_rect(glow_surface, glow_color, pygame.Rect(0, 0, glow_width, glow_height), int(self.face_params.corner_radius * size))
            surface.blit(glow_surface, glow_rect.topleft)
        
        # Bright center
        self.draw_rounded_rect(surface, eye_color, eye_rect, self.face_params.corner_radius)
        
        # Inner highlight
        highlight_height = int(actual_height * 0.6)
        highlight_width = int(width * 0.8)
        highlight_rect = pygame.Rect(x - highlight_width//2, y - highlight_height//2 - int(actual_height * 0.1), highlight_width, highlight_height)
        
        highlight_surface = pygame.Surface((highlight_width, highlight_height), pygame.SRCALPHA)
        highlight_color = (255, 255, 255, 64)
        self.draw_rounded_rect(highlight_surface, highlight_color, pygame.Rect(0, 0, highlight_width, highlight_height), int(self.face_params.corner_radius * 0.7))
        surface.blit(highlight_surface, highlight_rect.topleft)
        
        # Outer border
        border_color = (*eye_color, 128)
        border_surface = pygame.Surface((width + 4, actual_height + 4), pygame.SRCALPHA)
        border_rect = pygame.Rect(2, 2, width, actual_height)
        pygame.draw.rect(border_surface, border_color, border_rect, 2, border_radius=self.face_params.corner_radius)
        surface.blit(border_surface, (x - width//2 - 2, y - actual_height//2 - 2))

    def update_animation(self):
        """Update animation state"""
        now = time.time() * 1000  # Convert to milliseconds
        
        # Get current expression parameters
        current_expression = self.expressions[self.expression]
        target_eye_height = current_expression['eye_height']
        target_brightness = current_expression['brightness']
        
        # Smooth transitions
        current_eye_height = self.face_params.eye_height + (target_eye_height - self.face_params.eye_height) * 0.1
        current_brightness = self.eye_state.brightness + (target_brightness - self.eye_state.brightness) * 0.05
        
        # Handle blinking with sound
        current_blink = 0
        if self.auto_mode:
            if now - self.last_blink > 2000 + random.random() * 3000:
                self.last_blink = now
                self.blink_duration = 120 + random.random() * 80
                # Play blink sound
                self.play_sound(800, 0.1, 'square')
            
            if now - self.last_blink < self.blink_duration:
                blink_progress = (now - self.last_blink) / self.blink_duration
                current_blink = math.sin(blink_progress * math.pi) * 0.95
        
        # Calculate eye movement
        target_x = 0
        target_y = 0
        
        if self.auto_mode:
            # More dynamic random movement
            target_x = math.sin(now / 1500) * 20 + math.cos(now / 2200) * 15
            target_y = math.cos(now / 1800) * 12 + math.sin(now / 2500) * 10
            
            # Add occasional quick movements
            if math.sin(now / 5000) > 0.95:
                target_x += random.random() * 40 - 20
                target_y += random.random() * 30 - 15
        else:
            # Follow mouse
            canvas_center_x = self.canvas_rect.centerx
            canvas_center_y = self.canvas_rect.centery
            max_move_x = self.face_params.eye_width * 0.4
            max_move_y = current_eye_height * 0.4
            
            target_x = max(-max_move_x, min(max_move_x, (self.mouse_pos[0] - canvas_center_x) * 0.15))
            target_y = max(-max_move_y, min(max_move_y, (self.mouse_pos[1] - canvas_center_y) * 0.15))
        
        # Smooth eye movement
        current_x = self.eye_state.x + (target_x - self.eye_state.x) * 0.12
        current_y = self.eye_state.y + (target_y - self.eye_state.y) * 0.12
        
        # Update state
        self.eye_state.x = current_x
        self.eye_state.y = current_y
        self.eye_state.blink_amount = current_blink
        self.eye_state.brightness = current_brightness
        self.face_params.eye_height = int(current_eye_height)

    def draw_face(self, surface):
        """Draw the robot face"""
        # Clear canvas area with black
        pygame.draw.rect(surface, (0, 0, 0), self.canvas_rect)
        
        # Calculate center positions
        center_x = self.canvas_rect.centerx
        center_y = self.canvas_rect.centery
        left_eye_x = center_x - self.face_params.eye_distance // 2
        right_eye_x = center_x + self.face_params.eye_distance // 2
        
        # Get current expression offset
        current_expression = self.expressions[self.expression]
        eye_y = center_y + current_expression['eye_offset']
        
        # Draw eyes
        self.draw_eye(surface, 
                     int(left_eye_x + self.eye_state.x), 
                     int(eye_y + self.eye_state.y),
                     self.face_params.eye_width, 
                     self.face_params.eye_height, 
                     self.eye_state.blink_amount, 
                     self.eye_state.brightness)
        
        self.draw_eye(surface, 
                     int(right_eye_x + self.eye_state.x), 
                     int(eye_y + self.eye_state.y),
                     self.face_params.eye_width, 
                     self.face_params.eye_height, 
                     self.eye_state.blink_amount, 
                     self.eye_state.brightness)
        
        # Draw subtle face outline
        outline_color = (*self.face_params.eye_color, 32)
        outline_surface = pygame.Surface((360, 240), pygame.SRCALPHA)
        outline_rect = pygame.Rect(0, 0, 360, 240)
        pygame.draw.rect(outline_surface, outline_color, outline_rect, 1, border_radius=15)
        surface.blit(outline_surface, (center_x - 180, center_y - 120))
        
        # Add ambient glow effect
        glow_surface = pygame.Surface((400, 400), pygame.SRCALPHA)
        for radius in range(200, 0, -10):
            alpha = int((self.face_params.eye_color[0] + self.face_params.eye_color[1] + self.face_params.eye_color[2]) / 3 * 0.02)
            color = (*self.face_params.eye_color, max(1, alpha))
            pygame.draw.circle(glow_surface, color, (200, 200), radius)
        surface.blit(glow_surface, (center_x - 200, center_y - 200))

    def draw_ui(self, surface):
        """Draw the user interface"""
        # Background for UI
        ui_rect = pygame.Rect(0, self.height + 60, self.width + 300, 200)
        pygame.draw.rect(surface, (40, 40, 40), ui_rect)
        
        start_y = self.height + 80
        
        # Mode controls
        text = self.font.render("Control Mode", True, (0, 255, 255))
        surface.blit(text, (50, start_y - 25))
        
        # Auto mode checkbox
        color = (0, 255, 0) if self.auto_mode else (100, 100, 100)
        pygame.draw.rect(surface, color, self.auto_mode_rect)
        text = self.small_font.render("Auto Mode", True, (255, 255, 255))
        surface.blit(text, (80, start_y + 2))
        
        # Sound checkbox
        color = (0, 255, 0) if self.sound_enabled else (100, 100, 100)
        pygame.draw.rect(surface, color, self.sound_rect)
        text = self.small_font.render("Sound Effects", True, (255, 255, 255))
        surface.blit(text, (80, start_y + 32))
        
        # Blink button
        pygame.draw.rect(surface, (0, 255, 255), self.blink_button_rect)
        text = self.small_font.render("Blink", True, (0, 0, 0))
        text_rect = text.get_rect(center=self.blink_button_rect.center)
        surface.blit(text, text_rect)
        
        # Expressions
        text = self.font.render("Expressions", True, (0, 255, 255))
        surface.blit(text, (200, start_y - 25))
        
        for exp, rect in self.expression_buttons.items():
            color = (0, 255, 255) if self.expression == exp else (100, 100, 100)
            pygame.draw.rect(surface, color, rect)
            text = self.small_font.render(exp.capitalize(), True, (0, 0, 0) if self.expression == exp else (255, 255, 255))
            text_rect = text.get_rect(center=rect.center)
            surface.blit(text, text_rect)
        
        # Eye settings
        text = self.font.render("Eye Settings", True, (0, 255, 255))
        surface.blit(text, (450, start_y - 25))
        
        # Sliders
        pygame.draw.rect(surface, (100, 100, 100), self.eye_distance_slider)
        distance_pos = (self.face_params.eye_distance - 80) / (180 - 80)
        slider_x = self.eye_distance_slider.x + int(distance_pos * self.eye_distance_slider.width)
        pygame.draw.circle(surface, (255, 255, 255), (slider_x, self.eye_distance_slider.centery), 8)
        text = self.small_font.render("Eye Distance", True, (255, 255, 255))
        surface.blit(text, (450, start_y - 15))
        
        pygame.draw.rect(surface, (100, 100, 100), self.eye_width_slider)
        width_pos = (self.face_params.eye_width - 60) / (120 - 60)
        slider_x = self.eye_width_slider.x + int(width_pos * self.eye_width_slider.width)
        pygame.draw.circle(surface, (255, 255, 255), (slider_x, self.eye_width_slider.centery), 8)
        text = self.small_font.render("Eye Width", True, (255, 255, 255))
        surface.blit(text, (450, start_y + 15))
        
        pygame.draw.rect(surface, (100, 100, 100), self.corner_radius_slider)
        radius_pos = self.face_params.corner_radius / 20
        slider_x = self.corner_radius_slider.x + int(radius_pos * self.corner_radius_slider.width)
        pygame.draw.circle(surface, (255, 255, 255), (slider_x, self.corner_radius_slider.centery), 8)
        text = self.small_font.render("Corner Radius", True, (255, 255, 255))
        surface.blit(text, (450, start_y + 45))
        
        # Eye colors
        text = self.font.render("Eye Color", True, (0, 255, 255))
        surface.blit(text, (650, start_y - 25))
        
        for rect, color in self.color_buttons:
            pygame.draw.rect(surface, color, rect)
            if self.face_params.eye_color == color:
                pygame.draw.rect(surface, (255, 255, 255), rect, 3)
        
        # Status info
        text = self.font.render("Status", True, (0, 255, 255))
        surface.blit(text, (750, start_y - 25))
        
        status_lines = [
            f"Mode: {'Automatic' if self.auto_mode else 'Mouse Follow'}",
            f"Expression: {self.expression}",
            f"Eye Position: ({int(self.eye_state.x)}, {int(self.eye_state.y)})",
            f"Blink: {int(self.eye_state.blink_amount * 100)}%",
            f"Brightness: {int(self.eye_state.brightness * 100)}%",
            f"Sound: {'Enabled' if self.sound_enabled else 'Disabled'}"
        ]
        
        for i, line in enumerate(status_lines):
            text = self.small_font.render(line, True, (200, 200, 200))
            surface.blit(text, (750, start_y + i * 18))

    def handle_slider_drag(self, mouse_pos, mouse_pressed):
        """Handle slider dragging"""
        if not mouse_pressed:
            return
            
        # Eye distance slider
        if self.eye_distance_slider.collidepoint(mouse_pos):
            relative_x = mouse_pos[0] - self.eye_distance_slider.x
            relative_x = max(0, min(relative_x, self.eye_distance_slider.width))
            progress = relative_x / self.eye_distance_slider.width
            self.face_params.eye_distance = int(80 + progress * (180 - 80))
        
        # Eye width slider
        elif self.eye_width_slider.collidepoint(mouse_pos):
            relative_x = mouse_pos[0] - self.eye_width_slider.x
            relative_x = max(0, min(relative_x, self.eye_width_slider.width))
            progress = relative_x / self.eye_width_slider.width
            self.face_params.eye_width = int(60 + progress * (120 - 60))
        
        # Corner radius slider
        elif self.corner_radius_slider.collidepoint(mouse_pos):
            relative_x = mouse_pos[0] - self.corner_radius_slider.x
            relative_x = max(0, min(relative_x, self.corner_radius_slider.width))
            progress = relative_x / self.corner_radius_slider.width
            self.face_params.corner_radius = int(progress * 20)

    def handle_click(self, pos):
        """Handle mouse clicks"""
        # Auto mode checkbox
        if self.auto_mode_rect.collidepoint(pos):
            self.auto_mode = not self.auto_mode
        
        # Sound checkbox
        elif self.sound_rect.collidepoint(pos):
            self.sound_enabled = not self.sound_enabled
        
        # Blink button
        elif self.blink_button_rect.collidepoint(pos):
            self.trigger_blink()
        
        # Expression buttons
        for exp, rect in self.expression_buttons.items():
            if rect.collidepoint(pos):
                self.change_expression(exp)
                break
        
        # Color buttons
        for rect, color in self.color_buttons:
            if rect.collidepoint(pos):
                self.face_params.eye_color = color
                break

    def trigger_blink(self):
        """Trigger a manual blink"""
        self.last_blink = time.time() * 1000
        self.blink_duration = 150
        self.play_sound(800, 0.1, 'square')

    def change_expression(self, new_expression):
        """Change facial expression"""
        self.expression = new_expression
        # Play expression change sound
        frequencies = {
            'happy': 1200,
            'sad': 400,
            'angry': 200,
            'surprised': 1500,
            'sleepy': 300,
            'neutral': 800
        }
        frequency = frequencies.get(new_expression, 800)
        self.play_sound(frequency, 0.2, 'triangle')

    def run(self):
        """Main game loop"""
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
                
                elif event.type == pygame.MOUSEMOTION:
                    self.mouse_pos = event.pos
                    self.handle_slider_drag(event.pos, mouse_pressed)
                
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.running = False
                    elif event.key == pygame.K_SPACE:
                        self.trigger_blink()
                    elif event.key == pygame.K_a:
                        self.auto_mode = not self.auto_mode
                    elif event.key == pygame.K_s:
                        self.sound_enabled = not self.sound_enabled
            
            # Update animation
            self.update_animation()
            
            # Draw everything
            self.screen.fill((20, 20, 20))
            
            # Draw canvas border
            pygame.draw.rect(self.screen, (0, 255, 255), self.canvas_rect, 2)
            
            # Draw face
            self.draw_face(self.screen)
            
            # Draw UI
            self.draw_ui(self.screen)
            
            pygame.display.flip()
            self.clock.tick(60)
        
        pygame.quit()

if __name__ == "__main__":
    robo_face = RoboFace()
    robo_face.run()