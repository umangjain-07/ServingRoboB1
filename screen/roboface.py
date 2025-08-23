import pygame
import math
import random

# -------- Init --------
pygame.init()

# -------- Constants --------
SCREEN_WIDTH = 500
SCREEN_HEIGHT = 600
FACE_WIDTH = SCREEN_WIDTH  # Full screen width
FACE_HEIGHT = SCREEN_HEIGHT  # Full screen height

SCREEN_COLOR = (0, 0, 0)              # True AMOLED black
EYE_COLOR = (0, 220, 255)             # Bright cyan
MOUTH_COLOR = (0, 220, 255)           # Bright cyan
ACCENT_COLOR = (100, 180, 255)        # Lighter cyan for accents
GLOW_COLOR = (0, 255, 255)            # Pure cyan glow
DIM_CYAN = (0, 150, 200)              # Dimmer cyan for subtle effects
BRIGHT_CYAN = (150, 255, 255)         # Brighter cyan for highlights

# -------- Helpers --------
def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def ellipse_rect_from_center(cx, cy, w, h):
    return pygame.Rect(int(cx - w/2), int(cy - h/2), int(w), int(h))

def rounded_rect(surface, rect, color, radius):
    pygame.draw.rect(surface, color, rect, border_radius=radius)

def poly_star(cx, cy, r_outer, r_inner, points=5, phase=0.0):
    pts = []
    for i in range(points * 2):
        ang = phase + (i * math.pi / points)
        r = r_outer if i % 2 == 0 else r_inner
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return pts

def poly_heart(cx, cy, size, phase=0.0):
    """Proper heart shape using mathematical heart equation."""
    pts = []
    scale = size * 0.8
    
    # Generate heart shape using parametric equations
    for t in range(0, 360, 12):
        angle = math.radians(t)
        # Heart equation: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
        x = 16 * (math.sin(angle) ** 3)
        y = -(13 * math.cos(angle) - 5 * math.cos(2 * angle) - 2 * math.cos(3 * angle) - math.cos(4 * angle))
        
        # Scale and position
        px = cx + (x * scale / 16)
        py = cy + (y * scale / 16)
        pts.append((px, py))
    
    return pts

class ModernRoboFace:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("AMOLED Robot Face - Press SPACE to change expression")
        self.clock = pygame.time.Clock()
        self.running = True

        # Face center
        self.face_x = SCREEN_WIDTH // 2
        self.face_y = SCREEN_HEIGHT // 2

        # Expressions
        self.expressions = [
            'neutral', 'happy', 'love', 'sleepy', 'surprised', 'sad',
            'angry', 'confused', 'excited', 'thinking', 'wink', 'cool'
        ]
        self.current_expression = 0

        # Animation state
        self.blink_timer = 0       # counts down when blinking
        self.animation_offset = 0  # general ticker
        self.pulse_offset = 0
        self.energy_pulse = 0      # for energy effects
        self.particle_timer = 0    # for particle effects
        self.scan_line = 0         # for scanning effects
        self.expression_transition = 0  # smooth transitions

    # -------- Drawing Primitives --------
    def draw_glow_circle(self, x, y, radius, color, glow_size=12, intensity=1.0):
        """Enhanced glow circle with variable intensity."""
        for i in range(glow_size, 0, -1):
            alpha = max(5, int((40 - (i * 3)) * intensity))
            glow_surf = pygame.Surface((radius * 2 + i * 6, radius * 2 + i * 6), pygame.SRCALPHA)
            glow_color = (color[0], color[1], color[2], alpha)
            pygame.draw.circle(glow_surf, glow_color, (radius + i * 3, radius + i * 3), radius + i)
            self.screen.blit(glow_surf, (x - radius - i * 3, y - radius - i * 3))
        pygame.draw.circle(self.screen, color, (int(x), int(y)), radius)
    
    def draw_energy_burst(self, x, y, size, color, phase=0):
        """Draw animated energy burst effect."""
        for i in range(8):
            angle = (i * math.pi / 4) + phase
            length = size * (0.5 + 0.5 * math.sin(self.energy_pulse + i))
            end_x = x + length * math.cos(angle)
            end_y = y + length * math.sin(angle)
            thickness = max(1, int(3 * (1 + math.sin(self.energy_pulse + i * 0.5))))
            pygame.draw.line(self.screen, color, (x, y), (end_x, end_y), thickness)
    
    def draw_scan_line(self, rect, color, progress):
        """Draw scanning line effect."""
        if 0 <= progress <= 1:
            y_pos = rect.top + (rect.height * progress)
            # Main scan line
            pygame.draw.line(self.screen, color, (rect.left, y_pos), (rect.right, y_pos), 3)
            # Fading trail
            for i in range(1, 8):
                trail_y = y_pos - i * 3
                if trail_y >= rect.top:
                    alpha = max(20, 120 - i * 15)
                    trail_surf = pygame.Surface((rect.width, 1), pygame.SRCALPHA)
                    trail_color = (color[0], color[1], color[2], alpha)
                    pygame.draw.line(trail_surf, trail_color, (0, 0), (rect.width, 0), 1)
                    self.screen.blit(trail_surf, (rect.left, trail_y))

    def blink_scale(self):
        """Returns vertical scale 0.15..1.0 for blink."""
        if self.blink_timer <= 0:
            return 1.0
        # smooth cosine in-out: timer in [1..6]
        t = clamp(self.blink_timer / 6.0, 0.0, 1.0)
        # cos(pi * t): 1 at t=0, -1 at t=1; abs -> 1..1 hump; map to 0.15..1.0
        s = 0.15 + 0.85 * abs(math.cos(math.pi * t))
        return clamp(s, 0.15, 1.0)

    def eye_positions(self, eye_separation=120, eye_y_offset=-50):
        left_eye_x = self.face_x - eye_separation // 2
        right_eye_x = self.face_x + eye_separation // 2
        eye_y = self.face_y + eye_y_offset
        return left_eye_x, right_eye_x, eye_y

    # -------- Eye Renderers --------
    def draw_circular_eyes(self, left_x, right_x, y, size):
        h_scale = self.blink_scale()
        w = size * 1.4
        h = size * 1.4 * h_scale
        
        # Pulsing intensity
        pulse = 0.8 + 0.3 * math.sin(self.energy_pulse * 1.5)

        for i, cx in enumerate((left_x, right_x)):
            # Outer glow ring
            self.draw_glow_circle(cx, y, int(w * 0.8), EYE_COLOR, 15, pulse)
            
            # Eye base with thicker outline
            pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(cx, y, w, h), width=4)
            
            # Inner ring for depth
            inner_w, inner_h = w * 0.7, h * 0.7
            pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(cx, y, inner_w, inner_h), width=2)
            
            # Dynamic pupil with tracking
            pupil_w = w * 0.3
            pupil_h = h * 0.5
            offset_x = math.sin(self.animation_offset * 0.05 + i * math.pi) * (w * 0.1)
            offset_y = math.cos(self.animation_offset * 0.03 + i * 0.5) * (h * 0.05)
            
            pupil_rect = ellipse_rect_from_center(cx + offset_x, y + offset_y, pupil_w, pupil_h)
            pygame.draw.ellipse(self.screen, EYE_COLOR, pupil_rect)
            
            # Multiple highlights for depth
            highlight_x = cx - w * 0.12 + offset_x * 0.5
            highlight_y = y - h * 0.12 + offset_y * 0.5
            self.draw_glow_circle(highlight_x, highlight_y, int(size * 0.15), GLOW_COLOR, 6, 1.2)
            self.draw_glow_circle(highlight_x + 5, highlight_y + 3, int(size * 0.08), (255, 255, 255), 3, 0.8)
            
            # Scanning effect
            if self.scan_line > 0:
                scan_progress = (self.scan_line % 120) / 120.0
                eye_rect = ellipse_rect_from_center(cx, y, w, h)
                self.draw_scan_line(eye_rect, GLOW_COLOR, scan_progress)

    def draw_crescent_eyes(self, left_x, right_x, y, size, direction='up'):
        """Happy (up) or sad-style (down) curve-only eyes."""
        arc_w = size * 1.4
        arc_h = size * clamp(self.blink_scale(), 0.3, 1.0) * 0.9
        rectL = ellipse_rect_from_center(left_x, y, arc_w, arc_h)
        rectR = ellipse_rect_from_center(right_x, y, arc_w, arc_h)

        if direction == 'up':  # smiley eyes
            start, end = math.radians(200), math.radians(340)
        else:  # downturned eyes
            start, end = math.radians(20), math.radians(160)

        pygame.draw.arc(self.screen, EYE_COLOR, rectL, start, end, 3)
        pygame.draw.arc(self.screen, EYE_COLOR, rectR, start, end, 3)

    def draw_heart_eyes(self, left_x, right_x, y, size):
        scale = size * 1.3 * self.blink_scale()
        pulse = 0.9 + 0.3 * math.sin(self.energy_pulse * 2)
        
        for cx in (left_x, right_x):
            # Animated heart with pulsing in cyan
            heart_scale = scale * pulse
            pts = poly_heart(cx, y, heart_scale)
            if len(pts) > 2:
                # Multiple colored layers for depth - all cyan variants
                pygame.draw.polygon(self.screen, EYE_COLOR, pts)
                
                # Inner heart for depth
                inner_pts = poly_heart(cx, y, heart_scale * 0.7)
                if len(inner_pts) > 2:
                    pygame.draw.polygon(self.screen, BRIGHT_CYAN, inner_pts)
                
                # Sparkle effects around hearts in cyan
                for i in range(6):
                    angle = (i * math.pi / 3) + self.animation_offset * 0.1
                    spark_x = cx + heart_scale * 1.2 * math.cos(angle)
                    spark_y = y + heart_scale * 1.2 * math.sin(angle)
                    spark_size = 2 + int(3 * math.sin(self.animation_offset * 0.2 + i))
                    if spark_size > 0:
                        self.draw_glow_circle(spark_x, spark_y, spark_size, GLOW_COLOR, 4, 0.8)
                
                # Central glow in cyan
                self.draw_glow_circle(cx, y, int(heart_scale * 0.4), EYE_COLOR, 12, pulse)

    def draw_sleepy_eyes(self, left_x, right_x, y, size):
        # thin lines, slightly downward
        w = size * 1.4
        h = size * 0.35 * self.blink_scale()
        for cx in (left_x, right_x):
            rect = ellipse_rect_from_center(cx, y + 4, w, h)
            pygame.draw.arc(self.screen, EYE_COLOR, rect, math.radians(20), math.radians(160), 3)

    def draw_teardrop_eyes(self, left_x, right_x, y, size):
        self.draw_circular_eyes(left_x, right_x, y, size * 0.95)
        # small tear on right eye
        tear_x = right_x + size * 0.45
        tear_y = y + size * 0.6
        tear = [
            (tear_x, tear_y - size * 0.15),
            (tear_x - size * 0.08, tear_y),
            (tear_x, tear_y + size * 0.2),
            (tear_x + size * 0.08, tear_y)
        ]
        pygame.draw.polygon(self.screen, EYE_COLOR, tear)

    def draw_angry_eyes(self, left_x, right_x, y, size):
        # Intense angry eyes with bright cyan glow
        h_scale = clamp(self.blink_scale() * 0.6, 0.15, 0.7)
        w = size * 1.3
        h = size * 0.8 * h_scale
        
        # Angry pulsing effect
        angry_pulse = 0.7 + 0.4 * math.sin(self.energy_pulse * 3)
        
        for cx in (left_x, right_x):
            # Intense cyan glow for anger
            self.draw_glow_circle(cx, y, int(w * 0.8), EYE_COLOR, 20, angry_pulse)
            
            # Squinted eye shape
            eye_rect = ellipse_rect_from_center(cx, y, w, h)
            pygame.draw.ellipse(self.screen, EYE_COLOR, eye_rect, width=5)
            
            # Intense pupil
            pupil_w = w * 0.4
            pupil_h = h * 0.6
            pupil_rect = ellipse_rect_from_center(cx, y, pupil_w, pupil_h)
            pygame.draw.ellipse(self.screen, EYE_COLOR, pupil_rect)
            
            # Inner glow in bright cyan
            self.draw_glow_circle(cx, y, int(pupil_w * 0.3), GLOW_COLOR, 8, angry_pulse)
        
        # Dramatic angled eyebrows with glow in cyan
        brow_y = y - size * 1.1
        brow_thickness = 8
        
        # Left eyebrow
        left_brow_start = (left_x - size * 0.8, brow_y)
        left_brow_end = (left_x + size * 0.3, brow_y + size * 0.7)
        pygame.draw.line(self.screen, EYE_COLOR, left_brow_start, left_brow_end, brow_thickness)
        
        # Right eyebrow  
        right_brow_start = (right_x + size * 0.8, brow_y)
        right_brow_end = (right_x - size * 0.3, brow_y + size * 0.7)
        pygame.draw.line(self.screen, EYE_COLOR, right_brow_start, right_brow_end, brow_thickness)
        
        # Energy bursts from eyebrows when very angry - in cyan
        if angry_pulse > 0.9:
            self.draw_energy_burst(left_x - size * 0.5, brow_y + size * 0.3, size * 0.3, GLOW_COLOR, self.animation_offset * 0.3)
            self.draw_energy_burst(right_x + size * 0.5, brow_y + size * 0.3, size * 0.3, GLOW_COLOR, self.animation_offset * 0.3 + math.pi)

    def draw_spiral_eyes(self, left_x, right_x, y, size):
        # Hypnotic spiral eyes for confusion in cyan
        def enhanced_spiral(cx, direction=1):
            steps = 8
            for i in range(steps):
                w = size * (1.4 - i * 0.15)
                h = size * (1.4 - i * 0.15) * self.blink_scale()
                rect = ellipse_rect_from_center(cx, y, w, h)
                
                # Different cyan shades for depth
                colors = [ACCENT_COLOR, EYE_COLOR, GLOW_COLOR]
                color = colors[i % 3]
                
                # Rotating spiral
                start = self.animation_offset * 0.2 * direction + i * 0.8
                end = start + 3.5
                
                # Varying thickness for dramatic effect
                thickness = max(2, 5 - i // 2)
                pygame.draw.arc(self.screen, color, rect, start, end, thickness)
                
                # Add glow to outer rings
                if i < 3:
                    glow_intensity = 0.8 - (i * 0.2)
                    self.draw_glow_circle(cx, y, int(w * 0.5), color, 8, glow_intensity)
            
            # Central hypnotic point in bright cyan
            self.draw_glow_circle(cx, y, int(size * 0.1), BRIGHT_CYAN, 6, 1.5)
        
        enhanced_spiral(left_x, 1)
        enhanced_spiral(right_x, -1)  # Counter-rotating

    def draw_star_eyes(self, left_x, right_x, y, size):
        # Excited star eyes with cyan energy
        for i, cx in enumerate((left_x, right_x)):
            # Rotating stars with energy glow
            rotation = self.animation_offset * 0.15 + i * math.pi * 0.3
            scale = self.blink_scale()
            star_size = size * 0.8 * scale
            
            # Energy glow around star in cyan
            self.draw_glow_circle(cx, y, int(star_size * 1.2), GLOW_COLOR, 15, 1.3)
            
            # Main star in cyan
            pts = poly_star(cx, y, star_size, star_size * 0.4, points=5, phase=rotation)
            pygame.draw.polygon(self.screen, EYE_COLOR, pts)
            
            # Inner star for depth in bright cyan
            inner_pts = poly_star(cx, y, star_size * 0.6, star_size * 0.25, points=5, phase=rotation)
            pygame.draw.polygon(self.screen, BRIGHT_CYAN, inner_pts)
            
            # Sparkle trail effect in cyan variants
            for j in range(8):
                trail_angle = rotation + (j * math.pi / 4)
                trail_dist = star_size * 1.5
                trail_x = cx + trail_dist * math.cos(trail_angle)
                trail_y = y + trail_dist * math.sin(trail_angle)
                trail_size = max(1, 4 - j // 2)
                if trail_size > 0:
                    alpha_factor = 1.0 - (j / 8.0)
                    trail_color = GLOW_COLOR if j % 2 == 0 else ACCENT_COLOR
                    self.draw_glow_circle(trail_x, trail_y, trail_size, trail_color, 4, alpha_factor)
            
            # Center highlight in white
            self.draw_glow_circle(cx, y, int(star_size * 0.15), (255, 255, 255), 6, 1.5)

    def draw_loading_eyes(self, left_x, right_x, y, size):
        # outer ring + rotating dot
        r = size * 0.7
        for i, cx in enumerate((left_x, right_x)):
            pygame.draw.circle(self.screen, EYE_COLOR, (cx, y), int(r), width=3)
            ang = self.animation_offset * 0.18 + i * math.pi
            dot_x = cx + r * 0.85 * math.cos(ang)
            dot_y = y + r * 0.85 * math.sin(ang) * self.blink_scale()
            pygame.draw.circle(self.screen, EYE_COLOR, (int(dot_x), int(dot_y)), int(size * 0.18))

    def draw_wink_eyes(self, left_x, right_x, y, size):
        # Left eye closed (winking) - simple horizontal line
        line_w = size * 1.2
        pygame.draw.line(self.screen, EYE_COLOR, 
                        (left_x - line_w/2, y), (left_x + line_w/2, y), 4)
        
        # Right eye open and normal
        h_scale = self.blink_scale() if self.blink_timer > 0 else 1.0  # Don't blink the open eye during wink
        w = size * 1.4
        h = size * 1.4 * h_scale
        
        # Right eye - normal open eye
        pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(right_x, y, w, h), width=4)
        
        # Right eye pupil
        pupil_w = w * 0.3
        pupil_h = h * 0.5
        offset_x = math.sin(self.animation_offset * 0.05) * (w * 0.1)
        offset_y = math.cos(self.animation_offset * 0.03) * (h * 0.05)
        
        pupil_rect = ellipse_rect_from_center(right_x + offset_x, y + offset_y, pupil_w, pupil_h)
        pygame.draw.ellipse(self.screen, EYE_COLOR, pupil_rect)
        
        # Right eye highlight
        highlight_x = right_x - w * 0.12 + offset_x * 0.5
        highlight_y = y - h * 0.12 + offset_y * 0.5
        self.draw_glow_circle(highlight_x, highlight_y, int(size * 0.15), GLOW_COLOR, 6, 1.2)

    def draw_cool_eyes(self, left_x, right_x, y, size):
        # Sunglasses across both eyes
        span_w = (right_x - left_x) + size * 2.0
        span_h = size * 0.9 * self.blink_scale()
        rect = ellipse_rect_from_center((left_x + right_x) / 2, y, span_w, span_h)
        rounded_rect(self.screen, rect, EYE_COLOR, radius=int(size * 0.35))
        # bridge
        pygame.draw.rect(self.screen, EYE_COLOR,
                         pygame.Rect(rect.centerx - size * 0.2, rect.centery - span_h * 0.2, size * 0.4, span_h * 0.4))

    # -------- Mouths --------
    def mouth_smile(self, x, y, w, h, thickness=5, color=None):
        if color is None:
            color = MOUTH_COLOR
        rect = ellipse_rect_from_center(x, y, w, h)
        
        # Simple clean smile - just a nice arc
        pygame.draw.arc(self.screen, color, rect, math.radians(200), math.radians(340), thickness)
        
        # Optional subtle glow for depth
        glow_rect = ellipse_rect_from_center(x, y + h * 0.2, w * 0.8, h * 0.6)
        pygame.draw.arc(self.screen, color, glow_rect, math.radians(210), math.radians(330), 2)

    def mouth_sad(self, x, y, w, h, thickness=5, color=None):
        if color is None:
            color = MOUTH_COLOR
        rect = ellipse_rect_from_center(x, y, w, h)
        pygame.draw.arc(self.screen, color, rect, math.radians(20), math.radians(160), thickness)

    def mouth_neutral(self, x, y, w, thickness=4, color=None):
        if color is None:
            color = MOUTH_COLOR
        # Add slight glow
        glow_surf = pygame.Surface((w + 10, thickness + 6), pygame.SRCALPHA)
        pygame.draw.line(glow_surf, (*color, 60), (5, 3), (w + 5, 3), thickness + 2)
        self.screen.blit(glow_surf, (x - w/2 - 5, y - 3))
        pygame.draw.line(self.screen, color, (x - w/2, y), (x + w/2, y), thickness)

    def mouth_o(self, x, y, w, h, thickness=5, color=None):
        """Draw a simple surprised mouth - small oval opening."""
        if color is None:
            color = MOUTH_COLOR
        
        # Simple small oval for surprised expression
        mouth_rect = ellipse_rect_from_center(x, y, w, h)
        pygame.draw.ellipse(self.screen, color, mouth_rect, width=thickness)
        
        # Very subtle inner shadow - just a thin line
        if w > 6 and h > 6:
            inner_rect = ellipse_rect_from_center(x, y, w - 4, h - 4)
            pygame.draw.ellipse(self.screen, (20, 20, 20), inner_rect, width=1)

    def mouth_rect(self, x, y, w, h, thickness=4, color=None, rounded=True):
        """Draw a rectangular mouth with optional rounded corners."""
        if color is None:
            color = MOUTH_COLOR
            
        # Slight animation
        pulse = 1 + 0.08 * math.sin(self.energy_pulse * 1.2)
        actual_w = int(w * pulse)
        actual_h = int(h * pulse)
        
        # Create rectangle
        rect = pygame.Rect(x - actual_w//2, y - actual_h//2, actual_w, actual_h)
        
        if rounded and actual_h > 8:
            # Rounded rectangle for softer look
            radius = min(8, actual_h // 3)
            rounded_rect(self.screen, rect, color, radius)
            # Inner shadow
            if actual_w > 8 and actual_h > 8:
                inner_rect = pygame.Rect(x - (actual_w-6)//2, y - (actual_h-6)//2, actual_w-6, actual_h-6)
                rounded_rect(self.screen, inner_rect, (15, 15, 15), radius-2)
        else:
            # Regular rectangle
            pygame.draw.rect(self.screen, color, rect, width=thickness)
            # Inner shadow
            if actual_w > 8 and actual_h > 8:
                inner_rect = pygame.Rect(x - (actual_w-6)//2, y - (actual_h-6)//2, actual_w-6, actual_h-6)
                pygame.draw.rect(self.screen, (15, 15, 15), inner_rect)
                
        # Add subtle glow
        self.draw_glow_circle(x, y, max(actual_w, actual_h) // 2 + 3, color, 6, 0.4)

    def mouth_wiggle(self, x, y, w, h, t, thickness=4, color=None):
        if color is None:
            color = MOUTH_COLOR
        # Smoother wiggle animation
        pts = []
        steps = 24
        for i in range(steps + 1):
            u = i / steps
            px = x - w/2 + u * w
            py = y + math.sin(u * 3 * math.pi + t) * (h/3)  # Reduced intensity
            pts.append((px, py))
        
        # Draw the wiggle line with glow
        if len(pts) > 1:
            pygame.draw.lines(self.screen, color, False, pts, thickness)
            # Add subtle glow points
            for i in range(0, len(pts), 4):
                px, py = pts[i]
                self.draw_glow_circle(px, py, 2, color, 3, 0.6)

    def draw_mouth(self, expression):
        x = self.face_x
        y = self.face_y + 80  # Adjusted for full screen
        base_w = 160  # Increased for more dramatic effect
        base_h = 90   # Increased for more dramatic effect

        if expression == 'happy':
            # Simple happy smile
            self.mouth_smile(x, y, base_w, base_h * 0.8, thickness=6, color=MOUTH_COLOR)
        
        elif expression == 'love':
            # Simple love smile
            self.mouth_smile(x, y, base_w * 0.9, base_h * 0.7, thickness=6, color=MOUTH_COLOR)
        
        elif expression == 'excited':
            # Excited big smile
            self.mouth_smile(x, y, base_w * 1.1, base_h * 0.9, thickness=7, color=GLOW_COLOR)
        
        elif expression == 'sleepy':
            self.mouth_neutral(x, y + 8, base_w * 0.4, thickness=3, color=DIM_CYAN)
            # Add sleep "Z"s in cyan
            font = pygame.font.Font(None, 24)
            for i, letter in enumerate(['z', 'z', 'Z']):
                z_x = x + 60 + i * 20
                z_y = y - 40 - i * 15 + 5 * math.sin(self.animation_offset * 0.1 + i)
                z_surf = font.render(letter, True, DIM_CYAN)
                alpha = 200 - i * 50
                z_surf.set_alpha(alpha)
                self.screen.blit(z_surf, (z_x, z_y))
        
        elif expression == 'surprised':
            # Simple small surprised mouth - just a small oval
            mouth_w = base_w * 0.25
            mouth_h = base_h * 0.4
            self.mouth_o(x, y, mouth_w, mouth_h, thickness=4, color=GLOW_COLOR)
        
        elif expression == 'sad':
            self.mouth_sad(x, y + 6, base_w * 0.8, base_h * 0.6, thickness=6, color=DIM_CYAN)
            # Tear drop in cyan
            tear_x = x + base_w * 0.3
            tear_y = y + base_h * 0.4
            tear_pts = [
                (tear_x, tear_y - 10),
                (tear_x - 6, tear_y + 5),
                (tear_x, tear_y + 15),
                (tear_x + 6, tear_y + 5)
            ]
            pygame.draw.polygon(self.screen, DIM_CYAN, tear_pts)
        
        elif expression == 'angry':
            # Simple angry rectangular mouth
            self.mouth_rect(x, y, base_w * 0.5, base_h * 0.15, thickness=5, color=EYE_COLOR, rounded=False)
        
        elif expression == 'confused':
            # Simpler confused mouth with subtle wiggle
            self.mouth_wiggle(x, y, base_w * 0.5, base_h * 0.2, self.animation_offset * 0.2, thickness=4, color=ACCENT_COLOR)
            # Question mark in cyan
            font = pygame.font.Font(None, 42)
            q_surf = font.render('?', True, ACCENT_COLOR)
            q_x = x + 60 + 8 * math.sin(self.animation_offset * 0.08)
            q_y = y - 45 + 3 * math.cos(self.animation_offset * 0.1)
            # Add subtle glow to question mark
            glow_surf = font.render('?', True, DIM_CYAN)
            self.screen.blit(glow_surf, (q_x + 1, q_y + 1))
            self.screen.blit(q_surf, (q_x, q_y))
        
        elif expression == 'thinking':
            self.mouth_neutral(x - 15, y, base_w * 0.35, thickness=4, color=GLOW_COLOR)
            # Enhanced thought bubbles with animation in cyan
            bubble_positions = [(100, -50), (125, -70), (145, -85)]
            for i, (bx_offset, by_offset) in enumerate(bubble_positions):
                bx = self.face_x + bx_offset + 5 * math.sin(self.animation_offset * 0.1 + i)
                by = self.face_y + by_offset + 3 * math.cos(self.animation_offset * 0.08 + i)
                bubble_size = 12 - i * 3
                self.draw_glow_circle(bx, by, bubble_size, GLOW_COLOR, 6, 0.8 - i * 0.2)
        
        elif expression == 'wink':
            self.mouth_smile(x, y, base_w * 0.7, base_h * 0.7, thickness=6, color=MOUTH_COLOR)
        
        elif expression == 'cool':
            # Simple cool smile
            self.mouth_smile(x, y, base_w * 0.6, base_h * 0.6, thickness=5, color=GLOW_COLOR)
        
        else:  # 'neutral' fallback
            self.mouth_neutral(x, y, base_w * 0.6, thickness=4, color=MOUTH_COLOR)

    # -------- Expression Dispatcher --------
    def draw_eyes(self, expression):
        base_eye_size = 50  # Increased for full screen
        left_eye_x, right_eye_x, eye_y = self.eye_positions(eye_separation=120, eye_y_offset=-50)

        if expression == 'neutral':
            self.draw_circular_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'happy':
            self.draw_crescent_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size, 'up')
        elif expression == 'love':
            self.draw_heart_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'sleepy':
            self.draw_sleepy_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'surprised':
            self.draw_circular_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size + 15)
        elif expression == 'sad':
            self.draw_teardrop_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'angry':
            self.draw_angry_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'confused':
            self.draw_spiral_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'excited':
            self.draw_star_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'thinking':
            self.draw_loading_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'wink':
            self.draw_wink_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        elif expression == 'cool':
            self.draw_cool_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)
        else:
            self.draw_circular_eyes(left_eye_x, right_eye_x, eye_y, base_eye_size)

    # -------- Main Loop Bits --------
    def update(self):
        self.animation_offset += 0.18
        self.pulse_offset += 0.12
        self.energy_pulse += 0.25
        self.particle_timer += 1
        self.scan_line += 2
        
        # Expression-specific effects
        expression = self.expressions[self.current_expression]
        if expression in ['excited', 'angry', 'surprised']:
            self.energy_pulse += 0.1  # Faster for high-energy expressions
        
        # Random scanning effect
        if random.randint(1, 200) == 1:
            self.scan_line = 0
        
        # Enhanced blinking with expression-dependent frequency
        blink_chance = 180
        if expression == 'sleepy':
            blink_chance = 60  # Blink more often when sleepy
        elif expression == 'surprised':
            blink_chance = 300  # Blink less when surprised
        elif expression == 'wink':
            blink_chance = 1000  # Rarely blink when winking
            
        if random.randint(1, blink_chance) == 1 and self.blink_timer == 0:
            self.blink_timer = 8 if expression == 'sleepy' else 6
        elif self.blink_timer > 0:
            self.blink_timer -= 1

    def draw(self):
        # Fill with pure black for AMOLED displays
        self.screen.fill(SCREEN_COLOR)
        
        expression = self.expressions[self.current_expression]
        
        # Add subtle ambient background effects for certain expressions in cyan
        if expression == 'excited':
            # Energy particles in background
            for i in range(8):
                particle_x = random.randint(50, SCREEN_WIDTH - 50)
                particle_y = random.randint(50, SCREEN_HEIGHT - 50)
                particle_phase = self.particle_timer * 0.1 + i
                if math.sin(particle_phase) > 0.7:
                    self.draw_glow_circle(particle_x, particle_y, 2, GLOW_COLOR, 4, 0.5)
        
        elif expression == 'angry':
            # Intense cyan ambient glow
            if self.energy_pulse % 60 < 30:  # Pulsing effect
                glow_surf = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
                pygame.draw.rect(glow_surf, (*EYE_COLOR, 15), (0, 0, SCREEN_WIDTH, SCREEN_HEIGHT))
                self.screen.blit(glow_surf, (0, 0))
        
        elif expression == 'love':
            # Soft cyan ambient glow
            glow_surf = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
            pygame.draw.rect(glow_surf, (*ACCENT_COLOR, 8), (0, 0, SCREEN_WIDTH, SCREEN_HEIGHT))
            self.screen.blit(glow_surf, (0, 0))

        # Draw main facial features
        self.draw_eyes(expression)
        self.draw_mouth(expression)
        
        # Add robotic elements
        self.draw_robotic_elements(expression)

        # Enhanced UI with better positioning and effects
        font = pygame.font.Font(None, 52)
        text_color = self.get_expression_color(expression)
        text = font.render(expression.upper(), True, text_color)
        text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, 40))
        
        # Multi-layered text glow for dramatic effect
        for offset in [(2, 2), (1, 1), (0, 0)]:
            color = text_color if offset == (0, 0) else (20, 50, 60)
            shadow = font.render(expression.upper(), True, color)
            self.screen.blit(shadow, (text_rect.x + offset[0], text_rect.y + offset[1]))

        # Animated instruction text
        font_small = pygame.font.Font(None, 30)
        alpha = int(150 + 50 * math.sin(self.animation_offset * 0.1))
        instruction_color = ACCENT_COLOR
        instruction_surf = pygame.Surface((SCREEN_WIDTH, 30), pygame.SRCALPHA)
        instruction_text = font_small.render("Press SPACE to change expression", True, instruction_color)
        instruction_rect = instruction_text.get_rect(center=(SCREEN_WIDTH // 2, 15))
        instruction_surf.blit(instruction_text, instruction_rect)
        instruction_surf.set_alpha(alpha)
        self.screen.blit(instruction_surf, (0, SCREEN_HEIGHT - 40))

        pygame.display.flip()
    
    def get_expression_color(self, expression):
        """Get the appropriate cyan variant color for each expression."""
        color_map = {
            'neutral': EYE_COLOR,
            'happy': MOUTH_COLOR,
            'love': EYE_COLOR,
            'excited': GLOW_COLOR,
            'angry': EYE_COLOR,
            'sad': DIM_CYAN,
            'surprised': GLOW_COLOR,
            'confused': ACCENT_COLOR,
            'thinking': GLOW_COLOR,
            'sleepy': DIM_CYAN,
            'wink': MOUTH_COLOR,
            'cool': GLOW_COLOR
        }
        return color_map.get(expression, EYE_COLOR)
    
    def draw_robotic_elements(self, expression):
        """Add subtle robotic interface elements in cyan theme."""
        # Corner status indicators
        corner_size = 8
        corners = [(30, 30), (SCREEN_WIDTH - 30, 30), (30, SCREEN_HEIGHT - 30), (SCREEN_WIDTH - 30, SCREEN_HEIGHT - 30)]
        
        for i, (x, y) in enumerate(corners):
            pulse_phase = self.energy_pulse * 0.1 + i * math.pi / 2
            if math.sin(pulse_phase) > 0.3:
                color = self.get_expression_color(expression)
                self.draw_glow_circle(x, y, corner_size, color, 4, 0.7)
        
        # Expression intensity bar (left side) in cyan variants
        bar_x = 15
        bar_y = SCREEN_HEIGHT // 2 - 60
        bar_height = 120
        
        # Background bar
        pygame.draw.rect(self.screen, (10, 30, 40), (bar_x - 2, bar_y - 2, 8, bar_height + 4))
        
        # Intensity based on expression
        intensity_map = {
            'neutral': 0.2, 'happy': 0.7, 'love': 0.8, 'excited': 1.0,
            'angry': 0.9, 'sad': 0.4, 'surprised': 0.8, 'confused': 0.6,
            'thinking': 0.5, 'sleepy': 0.3, 'wink': 0.6, 'cool': 0.7
        }
        
        intensity = intensity_map.get(expression, 0.5)
        filled_height = int(bar_height * intensity)
        
        # Animated fill in cyan variants
        fill_color = self.get_expression_color(expression)
        for i in range(0, filled_height, 3):
            alpha = 150 + int(50 * math.sin(self.energy_pulse * 0.1 + i * 0.1))
            segment_surf = pygame.Surface((4, 2), pygame.SRCALPHA)
            segment_color = (*fill_color, alpha)
            pygame.draw.rect(segment_surf, segment_color, (0, 0, 4, 2))
            self.screen.blit(segment_surf, (bar_x, bar_y + bar_height - i - 2))

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.current_expression = (self.current_expression + 1) % len(self.expressions)
                elif event.key == pygame.K_ESCAPE:
                    self.running = False

    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(60)
        pygame.quit()

# ---- Entry point ----
if __name__ == "__main__":
    robot_face = ModernRoboFace()
    robot_face.run()