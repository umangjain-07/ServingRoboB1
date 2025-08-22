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
ACCENT_COLOR = (100, 180, 255)        # For highlights / accents

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

    # -------- Drawing Primitives --------
    def draw_glow_circle(self, x, y, radius, color, glow_size=8):
        """Soft glow circle; used sparingly for highlights."""
        for i in range(glow_size, 0, -1):
            alpha = max(8, 28 - (i * 2))
            glow_surf = pygame.Surface((radius * 2 + i * 4, radius * 2 + i * 4), pygame.SRCALPHA)
            glow_color = (color[0], color[1], color[2], alpha)
            pygame.draw.circle(glow_surf, glow_color, (radius + i * 2, radius + i * 2), radius + i)
            self.screen.blit(glow_surf, (x - radius - i * 2, y - radius - i * 2))
        pygame.draw.circle(self.screen, color, (int(x), int(y)), radius)

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
        w = size * 1.2
        h = size * 1.2 * h_scale

        for cx in (left_x, right_x):
            # Eye base
            pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(cx, y, w, h), width=3)
            # Pupil
            pupil_w = w * 0.35
            pupil_h = h * 0.55
            # Small horizontal wander
            offset = math.sin(self.animation_offset * 0.07 + cx) * (w * 0.08)
            pygame.draw.ellipse(self.screen, EYE_COLOR,
                                ellipse_rect_from_center(cx + offset, y, pupil_w, pupil_h))
            # Highlight
            self.draw_glow_circle(cx - w * 0.15 + offset * 0.5, y - h * 0.15, int(size * 0.18), ACCENT_COLOR, 4)

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
        scale = size * 1.2 * self.blink_scale()
        
        for cx in (left_x, right_x):
            pts = poly_heart(cx, y, scale)
            if len(pts) > 2:  # Make sure we have enough points
                # Fill the heart
                pygame.draw.polygon(self.screen, EYE_COLOR, pts)
                # Add a subtle glow effect
                self.draw_glow_circle(cx, y - scale * 0.1, int(scale * 0.3), ACCENT_COLOR, 3)

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
        # squinted eyes
        h_scale = clamp(self.blink_scale() * 0.7, 0.15, 0.8)
        w = size * 1.2
        h = size * 0.9 * h_scale
        for cx in (left_x, right_x):
            pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(cx, y, w, h), width=3)
            pupil_w = w * 0.35
            pupil_h = h * 0.55
            pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(cx, y, pupil_w, pupil_h))
        # eyebrows (slanted inwards)
        brow_y = y - size * 1.0
        pygame.draw.line(self.screen, EYE_COLOR, (left_x - size * 0.9, brow_y + size * 0.2),
                         (left_x + size * 0.2, brow_y + size * 0.6), 5)
        pygame.draw.line(self.screen, EYE_COLOR, (right_x + size * 0.9, brow_y + size * 0.2),
                         (right_x - size * 0.2, brow_y + size * 0.6), 5)

    def draw_spiral_eyes(self, left_x, right_x, y, size):
        # draw simple spiral with multiple arcs
        def spiral(cx):
            steps = 5
            for i in range(steps):
                w = size * (1.2 - i * 0.18)
                h = size * (1.2 - i * 0.18) * self.blink_scale()
                rect = ellipse_rect_from_center(cx, y, w, h)
                start = self.animation_offset * 0.15 + i * 0.6
                pygame.draw.arc(self.screen, EYE_COLOR, rect, start, start + 2.0, 2)
        spiral(left_x)
        spiral(right_x)

    def draw_star_eyes(self, left_x, right_x, y, size):
        for cx in (left_x, right_x):
            pts = poly_star(cx, y, size * 0.7 * self.blink_scale(), size * 0.35 * self.blink_scale(),
                            points=5, phase=-math.pi/2)
            pygame.draw.polygon(self.screen, EYE_COLOR, pts)
            pygame.draw.polygon(self.screen, SCREEN_COLOR, pts, width=2)  # crisp edge

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
        # left closed (arc), right open circle
        w = size * 1.4
        rect = ellipse_rect_from_center(left_x, y, w, size * 0.55)
        pygame.draw.arc(self.screen, EYE_COLOR, rect, math.radians(200), math.radians(340), 3)
        
        # Right eye open
        w2 = size * 1.2
        h2 = size * 1.2 * self.blink_scale()
        pygame.draw.ellipse(self.screen, EYE_COLOR, ellipse_rect_from_center(right_x, y, w2, h2), width=3)
        pygame.draw.ellipse(self.screen, EYE_COLOR,
                            ellipse_rect_from_center(right_x, y, w2*0.35, h2*0.55))

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
    def mouth_smile(self, x, y, w, h, thickness=4):
        rect = ellipse_rect_from_center(x, y, w, h)
        pygame.draw.arc(self.screen, MOUTH_COLOR, rect, math.radians(200), math.radians(340), thickness)

    def mouth_sad(self, x, y, w, h, thickness=4):
        rect = ellipse_rect_from_center(x, y, w, h)
        pygame.draw.arc(self.screen, MOUTH_COLOR, rect, math.radians(20), math.radians(160), thickness)

    def mouth_neutral(self, x, y, w, thickness=4):
        pygame.draw.line(self.screen, MOUTH_COLOR, (x - w/2, y), (x + w/2, y), thickness)

    def mouth_o(self, x, y, r, thickness=4):
        pygame.draw.circle(self.screen, MOUTH_COLOR, (int(x), int(y)), int(r), width=thickness)

    def mouth_wiggle(self, x, y, w, h, t, thickness=4):
        # subtle sine wave mouth
        pts = []
        steps = 24
        for i in range(steps + 1):
            u = i / steps
            px = x - w/2 + u * w
            py = y + math.sin(u * 4 * math.pi + t) * (h/2)
            pts.append((px, py))
        pygame.draw.lines(self.screen, MOUTH_COLOR, False, pts, thickness)

    def draw_mouth(self, expression):
        x = self.face_x
        y = self.face_y + 80  # Adjusted for full screen
        base_w = 140  # Adjusted for full screen
        base_h = 80   # Adjusted for full screen

        if expression in ('happy', 'love', 'excited', 'cool'):
            self.mouth_smile(x, y, base_w, base_h * 0.8, thickness=5)
        elif expression == 'sleepy':
            self.mouth_neutral(x, y + 4, base_w * 0.5, thickness=3)
        elif expression == 'surprised':
            self.mouth_o(x, y, base_h * 0.28, thickness=5)
        elif expression == 'sad':
            self.mouth_sad(x, y + 4, base_w * 0.75, base_h * 0.6, thickness=5)
        elif expression == 'angry':
            self.mouth_neutral(x, y, base_w * 0.55, thickness=5)
        elif expression == 'confused':
            self.mouth_wiggle(x, y, base_w * 0.6, base_h * 0.25, self.animation_offset * 0.2, thickness=4)
        elif expression == 'thinking':
            self.mouth_neutral(x - 15, y, base_w * 0.35, thickness=4)
            # thought bubbles
            bx = self.face_x + 100
            by = self.face_y - 50
            pygame.draw.circle(self.screen, MOUTH_COLOR, (int(bx), int(by)), 8)
            pygame.draw.circle(self.screen, MOUTH_COLOR, (int(bx + 18), int(by - 14)), 5)
            pygame.draw.circle(self.screen, MOUTH_COLOR, (int(bx + 30), int(by - 24)), 3)
        elif expression == 'wink':
            self.mouth_smile(x, y, base_w * 0.65, base_h * 0.7, thickness=5)
        else:  # 'neutral' fallback
            self.mouth_neutral(x, y, base_w * 0.6, thickness=4)

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
        self.animation_offset += 0.15
        self.pulse_offset += 0.10
        # random blink trigger
        if random.randint(1, 120) == 1 and self.blink_timer == 0:
            self.blink_timer = 6
        elif self.blink_timer > 0:
            self.blink_timer -= 1

    def draw(self):
        # Fill with pure black for AMOLED displays
        self.screen.fill(SCREEN_COLOR)
        
        expression = self.expressions[self.current_expression]

        self.draw_eyes(expression)
        self.draw_mouth(expression)

        # UI labels with better positioning for full screen
        font = pygame.font.Font(None, 48)
        text = font.render(expression.upper(), True, EYE_COLOR)
        text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, 50))
        # Add subtle glow effect to text for AMOLED
        shadow = font.render(expression.upper(), True, (0, 100, 120))
        self.screen.blit(shadow, (text_rect.x + 1, text_rect.y + 1))
        self.screen.blit(text, text_rect)

        font_small = pygame.font.Font(None, 28)
        instruction = font_small.render("Press SPACE to change expression", True, ACCENT_COLOR)
        instruction_rect = instruction.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 30))
        self.screen.blit(instruction, instruction_rect)

        pygame.display.flip()

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