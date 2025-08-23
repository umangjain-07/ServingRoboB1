## Features

- Customizable eye shapes (width, height, border radius, spacing)
- Multiple mood expressions (default, tired, angry, happy)
- Various animations (blinking, laughing, confused)
- Automatic behaviors (auto-blinker, idle mode)
- Smooth transitions between states
- Cyclops mode (single eye)
- Curiosity effect

### Controls

- **ESC**: Exit the application
- **1-4**: Change mood (1=Default, 2=Tired, 3=Angry, 4=Happy)
- **C**: Toggle cyclops mode
- **B**: Trigger blink animation
- **L**: Trigger laugh animation
- **F**: Trigger confused animation
- **SPACE**: Reset to default settings

## Creating Your Own Animations

You can create your own animations by using the RoboEyes class in your code:

```python
from robo_eyes import RoboEyes

# Create and initialize RoboEyes
eyes = RoboEyes()
eyes.begin(640, 320, 60)  # width, height, fps

# Configure eye properties
eyes.set_width(80, 80)
eyes.set_height(80, 80)
eyes.set_border_radius(20, 20)
eyes.set_space_between(40)

# Set mood
eyes.set_mood(HAPPY)

# Main loop
while eyes.is_running():
    eyes.update()
```

## Future Integration with LLMs

This project is designed to connect with Large Language Models to create more interactive and responsive eye animations based on conversation or other inputs. The goal is to have the eyes express emotions and reactions that align with the context of interactions, similar to how Pixar characters and Cosmo robots convey personality through their eye movements and expressions.
