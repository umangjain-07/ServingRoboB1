"""
Moods utilities for RoboEyes
Handles all mood-related functionality including different eye expressions 
and appearance changes based on mood.
"""

import pygame

# Define mood constants
DEFAULT = 0
TIRED = 1
SAD = 2
EXCITED = 3
ANGRY = 4

class MoodsHandler:
    def __init__(self, parent):
        """Initialize moods with reference to parent RoboEyes object"""
        self.parent = parent
        self.current_mood = DEFAULT
        
        # Eyelid properties for mood expressions
        self.eyelids_tired_height = 0
        self.eyelids_tired_height_next = 0
        
        # Mouth properties for mood expressions
        self.mouth_width = 40
        self.mouth_height = 8
        self.mouth_curve = 0.0
        self.mouth_y_offset = 0
    
    def set_mood(self, mood):
        """Set the mood expression"""
        self.current_mood = mood
        
        # Reset all mood-related properties
        self.eyelids_tired_height_next = 0
        
        # Set the appropriate mood properties and eye shapes
        if mood == TIRED:
            self.eyelids_tired_height_next = int(self.parent.eye_l_height * 0.3)
            self.parent.shapes.set_eye_shape("square")
        elif mood == SAD:
            # Sad shape for SAD mood
            self.parent.shapes.set_eye_shape("angry")
            # Make eyes smaller and narrower for sad look
            self.parent.shapes.set_width(
                int(self.parent.eye_l_width_default * 0.8), 
                int(self.parent.eye_r_width_default * 0.8)
            )
            self.parent.shapes.set_height(
                int(self.parent.eye_l_height_default * 0.85), 
                int(self.parent.eye_r_height_default * 0.85)
            )
        elif mood == EXCITED:
            self.parent.shapes.set_eye_shape("pill")
            # Make eyes wider for excited look
            self.parent.shapes.set_width(
                int(self.parent.eye_l_width_default * 1.3), 
                int(self.parent.eye_r_width_default * 1.3)
            )
            self.parent.shapes.set_height(
                int(self.parent.eye_l_height_default * 0.8), 
                int(self.parent.eye_r_height_default * 0.8)
            )
            # Add asymmetry for more character
            self.parent.eye_r_width = int(self.parent.eye_r_width * 0.9)  # Right eye slightly narrower
        elif mood == ANGRY:
            # Angry shape for ANGRY mood
            self.parent.shapes.set_eye_shape("angry")
            # Make eyes narrower and more intense
            self.parent.shapes.set_width(
                int(self.parent.eye_l_width_default * 0.8), 
                int(self.parent.eye_r_width_default * 0.8)
            )
            self.parent.shapes.set_height(
                int(self.parent.eye_l_height_default * 0.9), 
                int(self.parent.eye_r_height_default * 0.9)
            )
        else:  # DEFAULT
            # Reset to default eye shape and size with slight asymmetry
            self.parent.shapes.set_eye_shape("square")
            self.parent.shapes.set_width(
                self.parent.eye_l_width_default, 
                int(self.parent.eye_r_width_default * 0.95)
            )
            self.parent.shapes.set_height(
                self.parent.eye_l_height_default, 
                int(self.parent.eye_r_height_default * 1.05)
            )
        
        return True

    def draw_tears(self, screen, eye_l_x_current, eye_l_y_current, eye_r_x_current, eye_r_y_current, 
                   eye_l_width_current, eye_l_height_current, eye_r_width_current, eye_r_height_current):
        """Draw tears for SAD mood"""
        if self.current_mood == SAD:
            # Draw tear drops below each eye
            tear_color = (0, 255, 255)  # Cyan color to match the eyes
            
            # Left eye tear
            tear_l_x = eye_l_x_current + eye_l_width_current // 2
            tear_l_y = eye_l_y_current + eye_l_height_current + 5
            
            # Draw tear drop (teardrop shape using circle and triangle)
            pygame.draw.circle(
                screen,
                tear_color,
                (tear_l_x, tear_l_y),
                3,  # Tear radius
                0
            )
            
            # Right eye tear
            tear_r_x = eye_r_x_current + eye_r_width_current // 2
            tear_r_y = eye_r_y_current + eye_r_height_current + 5
            
            pygame.draw.circle(
                screen,
                tear_color,
                (tear_r_x, tear_r_y),
                3,  # Tear radius
                0
            )
            
            # Add subtle glow effect to tears
            glow_surface = pygame.Surface((8, 8))
            glow_surface.set_alpha(40)
            glow_surface.fill(tear_color)
            
            # Left tear glow
            screen.blit(glow_surface, (tear_l_x - 4, tear_l_y - 4))
            # Right tear glow
            screen.blit(glow_surface, (tear_r_x - 4, tear_r_y - 4))

    def get_current_mood(self):
        """Get the current mood value"""
        return self.current_mood
    
    def get_mouth_properties(self):
        """Get mouth properties for the current mood"""
        if self.current_mood == TIRED:
            return {
                'width': 42,
                'height': 8,
                'curve': -0.4,
                'y_offset': 5
            }
        elif self.current_mood == SAD:
            return {
                'width': 38,
                'height': 7,
                'curve': -0.8,
                'y_offset': 8
            }
        elif self.current_mood == EXCITED:
            return {
                'width': 58,
                'height': 14,
                'curve': 0.6,
                'y_offset': 2
            }
        elif self.current_mood == ANGRY:
            return {
                'width': 46,
                'height': 9,
                'curve': -1.0,
                'y_offset': 10
            }
        else:  # DEFAULT
            return {
                'width': 50,
                'height': 10,
                'curve': 0.2,
                'y_offset': 3
            }
    
    def draw_mood_elements(self, screen, eye_l_x_current, eye_l_y_current, eye_r_x_current, eye_r_y_current, 
                          eye_l_width_current, eye_l_height_current, eye_r_width_current, eye_r_height_current):
        """Draw mood-specific elements"""
        # Convert all position and size values to integers to avoid float errors
        eye_l_x = int(eye_l_x_current)
        eye_l_y = int(eye_l_y_current)
        eye_r_x = int(eye_r_x_current)
        eye_r_y = int(eye_r_y_current)
        eye_l_width = int(eye_l_width_current)
        eye_l_height = int(eye_l_height_current)
        eye_r_width = int(eye_r_width_current)
        eye_r_height = int(eye_r_height_current)
        
        # Smooth transitions for eyelids
        eyelids_tired_height = int((self.eyelids_tired_height + self.eyelids_tired_height_next) / 2)
        
        # Draw tired eyelids if in TIRED mood
        if self.current_mood == TIRED and eyelids_tired_height > 0:
            # Left eye
            pygame.draw.rect(
                screen,
                (0, 0, 0),  # BLACK
                (
                    eye_l_x,
                    eye_l_y,
                    eye_l_width,
                    eyelids_tired_height
                ),
                0
            )
            
            # Right eye
            pygame.draw.rect(
                screen,
                (0, 0, 0),  # BLACK
                (
                    eye_r_x,
                    eye_r_y,
                    eye_r_width,
                    eyelids_tired_height
                ),
                0
            )
