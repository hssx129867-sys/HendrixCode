"""
Five Nights at Freddy's AI Game
================================
An interactive AI-powered game inspired by Five Nights at Freddy's.
Uses OpenAI API to generate spooky responses from animatronic characters.
Uses pygame for the game window, camera view, and sound mixing.
Uses playsound for simple one-shot audio playback.

Requirements:
    pip install openai
    pip install playsound
    pip install pygame

Security Note:
    NEVER hardcode API keys in your code. Use environment variables or secure key management.
    Get your API key from: https://platform.openai.com/api-keys
"""

import random
import time
import os
import threading

# Try to import openai - if not available, will use demo mode
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAI module not installed. Install it with: pip install openai")

# Try to import pygame for the game window and sound mixing
try:
    import pygame
    PYGAME_AVAILABLE = True
except ImportError:
    PYGAME_AVAILABLE = False
    print("⚠️  pygame not installed. Install it with: pip install pygame")

# Try to import playsound for simple one-shot audio playback
try:
    from playsound import playsound
    PLAYSOUND_AVAILABLE = True
except ImportError:
    PLAYSOUND_AVAILABLE = False
    print("⚠️  playsound not installed. Install it with: pip install playsound")

# ==================== CONFIGURATION ====================

# API Key Configuration
# IMPORTANT: Set your OpenAI API key as an environment variable
# On Linux/Mac: export OPENAI_API_KEY="your-key-here"
# On Windows: set OPENAI_API_KEY=your-key-here
# Or create a .env file and use python-dotenv

# Initialize OpenAI client (for openai >= 1.0.0)
# For older versions, this will fall back to the legacy API pattern
openai_client = None
if OPENAI_AVAILABLE:
    api_key = os.environ.get("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")
    try:
        # Try new client-based API (openai >= 1.0.0)
        openai_client = openai.OpenAI(api_key=api_key)
    except (AttributeError, TypeError):
        # Fall back to legacy API for older versions
        openai.api_key = api_key

# Animatronics
animatronics = ["Freddy", "Bonnie", "Chica"]

# ==================== SOUND UTILITIES ====================

# Pygame mixer initialisation (called once if pygame is available)
_mixer_initialized = False


def _init_mixer():
    """Initialise pygame mixer if not already done."""
    global _mixer_initialized
    if PYGAME_AVAILABLE and not _mixer_initialized:
        pygame.mixer.pre_init(frequency=44100, size=-16, channels=2, buffer=512)
        pygame.mixer.init()
        _mixer_initialized = True


def play_sound_pygame(frequency=440, duration_ms=300, volume=0.5):
    """
    Generate and play a simple beep tone via pygame.mixer.

    Args:
        frequency (int): Tone frequency in Hz (default 440 Hz = A4).
        duration_ms (int): Duration in milliseconds.
        volume (float): Playback volume between 0.0 and 1.0.
    """
    if not PYGAME_AVAILABLE:
        return
    try:
        import numpy as np  # optional - gracefully skip if unavailable
        _init_mixer()
        sample_rate = 44100
        n_samples = int(sample_rate * duration_ms / 1000)
        t = np.linspace(0, duration_ms / 1000, n_samples, endpoint=False)
        wave = (np.sin(2 * np.pi * frequency * t) * 32767 * volume).astype(np.int16)
        # pygame requires stereo array (shape: n_samples × 2)
        stereo = np.column_stack([wave, wave])
        sound = pygame.sndarray.make_sound(stereo)
        sound.play()
    except Exception:
        # numpy unavailable or other error – silently skip
        pass


def play_sound_file(filepath, block=False):
    """
    Play an audio file using playsound (preferred) or pygame.mixer as fallback.

    Args:
        filepath (str): Absolute or relative path to the audio file.
        block (bool): If True, block until playback finishes.
    """
    if not os.path.isfile(filepath):
        return  # File not found – skip silently

    if PLAYSOUND_AVAILABLE:
        if block:
            playsound(filepath)
        else:
            threading.Thread(target=playsound, args=(filepath,), daemon=True).start()
    elif PYGAME_AVAILABLE:
        try:
            _init_mixer()
            sound = pygame.mixer.Sound(filepath)
            sound.play()
            if block:
                while pygame.mixer.get_busy():
                    pygame.time.wait(50)
        except Exception:
            pass


# ==================== PYGAME GAME WINDOW ====================

# Colour constants
_BLACK  = (0,   0,   0)
_WHITE  = (255, 255, 255)
_RED    = (180, 0,   0)
_GREEN  = (0,   200, 0)
_YELLOW = (220, 200, 0)
_GREY   = (40,  40,  40)
_DARK   = (15,  15,  15)


def _draw_power_bar(surface, power, font):
    """Render the power bar in the bottom-left corner."""
    bar_x, bar_y = 20, surface.get_height() - 40
    bar_w, bar_h = 200, 20
    # Background
    pygame.draw.rect(surface, _GREY, (bar_x, bar_y, bar_w, bar_h))
    # Filled portion
    fill_colour = _GREEN if power > 50 else (_YELLOW if power > 25 else _RED)
    pygame.draw.rect(surface, fill_colour, (bar_x, bar_y, int(bar_w * power / 100), bar_h))
    pygame.draw.rect(surface, _WHITE, (bar_x, bar_y, bar_w, bar_h), 2)
    label = font.render(f"Power: {power}%", True, _WHITE)
    surface.blit(label, (bar_x, bar_y - 22))


def _draw_camera_view(surface, camera, animatronic_locations, font):
    """Render the currently selected camera view."""
    cam_rect = pygame.Rect(50, 80, surface.get_width() - 100, surface.get_height() - 180)
    pygame.draw.rect(surface, _GREY, cam_rect)
    pygame.draw.rect(surface, _GREEN, cam_rect, 2)

    cam_label = font.render(f"CAM {camera}", True, _GREEN)
    surface.blit(cam_label, (cam_rect.x + 10, cam_rect.y + 10))

    # Show animatronics present in this camera
    present = [name for name, loc in animatronic_locations.items() if loc == camera]
    if present:
        for i, name in enumerate(present):
            txt = font.render(f"👁  {name}", True, _RED)
            surface.blit(txt, (cam_rect.x + 10, cam_rect.y + 40 + i * 28))
    else:
        empty = font.render("[ empty ]", True, _GREY)
        surface.blit(empty, (cam_rect.x + 10, cam_rect.y + 40))


def _draw_message_log(surface, messages, font):
    """Display the last few AI messages in the bottom panel."""
    x, y = 50, surface.get_height() - 100
    for line in messages[-3:]:
        rendered = font.render(line[:80], True, _WHITE)
        surface.blit(rendered, (x, y))
        y += 22


def _draw_camera_buttons(surface, cameras, current_cam, small_font):
    """Draw camera selection buttons along the top."""
    btn_w, btn_h = 90, 30
    start_x = 50
    y = 40
    rects = {}
    for i, cam in enumerate(cameras):
        rect = pygame.Rect(start_x + i * (btn_w + 10), y, btn_w, btn_h)
        colour = _GREEN if cam == current_cam else _GREY
        pygame.draw.rect(surface, colour, rect)
        pygame.draw.rect(surface, _WHITE, rect, 1)
        label = small_font.render(cam, True, _BLACK if cam == current_cam else _WHITE)
        surface.blit(label, (rect.x + 5, rect.y + 7))
        rects[cam] = rect
    return rects


def run_pygame_game():
    """
    Run the FNAF AI game with a pygame graphical interface.

    Controls:
        Click a camera button  – switch to that camera view
        Type in the text box   – send a message to the active animatronic
        Enter                  – submit message
        ESC / close window     – quit
    """
    if not PYGAME_AVAILABLE:
        print("❌ pygame is not installed. Run: pip install pygame")
        return

    pygame.init()
    _init_mixer()

    width, height = 800, 600
    screen = pygame.display.set_mode((width, height))
    pygame.display.set_caption("🎮 FNAF AI Night")
    clock = pygame.time.Clock()

    font       = pygame.font.SysFont("monospace", 18)
    small_font = pygame.font.SysFont("monospace", 15)
    big_font   = pygame.font.SysFont("monospace", 28, bold=True)

    cameras = ["CAM 1", "CAM 2", "CAM 3", "CAM 4", "CAM 5"]
    current_cam = "CAM 1"

    # Starting positions for each animatronic
    animatronic_locations = {
        "Freddy": "CAM 1",
        "Bonnie": "CAM 2",
        "Chica":  "CAM 3",
    }

    messages = ["[System] FNAF AI Night started. Type to interact!"]
    text_input = ""
    power = 100
    night = 1
    move_timer = 0
    power_timer = 0
    running = True
    # Cache camera button rects so mouse hit-testing doesn't trigger extra draws
    cam_rects = {}

    validate_api_key()

    while running:
        dt = clock.tick(30)  # 30 FPS; dt in ms
        move_timer  += dt
        power_timer += dt

        # --- Events ---
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                elif event.key == pygame.K_RETURN:
                    if text_input.strip():
                        user_msg = text_input.strip()
                        text_input = ""
                        # Find animatronics in current camera
                        present = [n for n, loc in animatronic_locations.items()
                                   if loc == current_cam]
                        animatronic = present[0] if present else random.choice(animatronics)
                        play_sound_pygame(frequency=300, duration_ms=200)
                        resp = ai_response(animatronic, user_msg)
                        messages.append(f"You: {user_msg}")
                        messages.append(f"{animatronic}: {resp}")
                elif event.key == pygame.K_BACKSPACE:
                    text_input = text_input[:-1]
                else:
                    if len(text_input) < 60:
                        text_input += event.unicode

            elif event.type == pygame.MOUSEBUTTONDOWN:
                for cam, rect in cam_rects.items():
                    if rect.collidepoint(event.pos):
                        current_cam = cam
                        play_sound_pygame(frequency=500, duration_ms=100)

        # --- Logic: animatronic movement every 8 seconds ---
        if move_timer >= 8000:
            move_timer = 0
            mover = random.choice(animatronics)
            new_cam = random.choice(cameras)
            animatronic_locations[mover] = new_cam
            messages.append(f"[!] {mover} moved to {new_cam}!")
            play_sound_pygame(frequency=200, duration_ms=400)

        # --- Logic: power drain every second ---
        if power_timer >= 1000:
            power_timer = 0
            power = max(0, power - 1)

        if power == 0:
            messages.append("[BLACKOUT] Power is out! Game over!")
            running = False

        # --- Drawing ---
        screen.fill(_DARK)

        # Title bar
        title = big_font.render(f"FNAF AI Night  |  Night {night}  |  🔋 Power: {power}%", True, _WHITE)
        screen.blit(title, (20, 8))

        cam_rects = _draw_camera_buttons(screen, cameras, current_cam, small_font)
        _draw_camera_view(screen, current_cam, animatronic_locations, font)
        _draw_power_bar(screen, power, font)
        _draw_message_log(screen, messages, small_font)

        # Text input box
        input_rect = pygame.Rect(50, height - 40, width - 100, 30)
        pygame.draw.rect(screen, _GREY, input_rect)
        pygame.draw.rect(screen, _WHITE, input_rect, 1)
        input_text = small_font.render(f"> {text_input}_", True, _GREEN)
        screen.blit(input_text, (input_rect.x + 5, input_rect.y + 7))

        pygame.display.flip()

    pygame.quit()


# ==================== GAME FUNCTIONS ====================

def ai_response(animatronic, player_input):
    """
    Generate an AI response from an animatronic character.
    
    Args:
        animatronic (str): Name of the animatronic character
        player_input (str): Player's input text
    
    Returns:
        str: AI-generated spooky response
    
    Raises:
        Exception: If API call fails
    """
    if not OPENAI_AVAILABLE:
        return f"[DEMO] I'm {animatronic}... watching you... 🐻👁️"
    
    try:
        # Using the newer ChatCompletion API (recommended)
        # Note: text-davinci-003 is deprecated. Use gpt-3.5-turbo or gpt-4 instead
        
        if openai_client:
            # New client-based API (openai >= 1.0.0)
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"You are {animatronic} from Five Nights at Freddy's. Be spooky and menacing but family-friendly."},
                    {"role": "user", "content": player_input}
                ],
                max_tokens=50,
                temperature=0.8
            )
            return response.choices[0].message.content.strip()
        else:
            # Legacy API (openai < 1.0.0)
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"You are {animatronic} from Five Nights at Freddy's. Be spooky and menacing but family-friendly."},
                    {"role": "user", "content": player_input}
                ],
                max_tokens=50,
                temperature=0.8
            )
            return response.choices[0].message.content.strip()
    
    except Exception as e:
        # Handle both old and new API error types
        error_msg = str(e)
        if "authentication" in error_msg.lower() or "api key" in error_msg.lower():
            return f"[ERROR: Invalid API key. Please set your OPENAI_API_KEY environment variable]"
        elif "rate limit" in error_msg.lower():
            return f"[ERROR: Rate limit exceeded. Please try again later]"
        else:
            return f"[ERROR: {error_msg}]"


def validate_api_key():
    """
    Validate that API key is configured.
    
    Returns:
        bool: True if API key appears to be set, False otherwise
    """
    if not OPENAI_AVAILABLE:
        print("⚠️  WARNING: OpenAI module not installed!")
        print("Install it with: pip install openai")
        print("Running in demo mode...\n")
        return True  # Allow demo mode to continue
    
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key or api_key == "YOUR_OPENAI_API_KEY":
        print("⚠️  WARNING: OpenAI API key not configured!")
        print("Please set your OPENAI_API_KEY environment variable:")
        print("  export OPENAI_API_KEY='your-key-here'")
        print("Running in demo mode...\n")
        return True  # Allow demo mode to continue
    return True


def play_game():
    """
    Main game loop for FNAF AI Night.
    """
    print("=" * 50)
    print("🎮 Welcome to FNAF AI Night! 🎮")
    print("=" * 50)
    print("\nYou're trapped with AI-powered animatronics!")
    print("They'll respond to everything you say...")
    print("Type 'exit' or 'quit' to escape.\n")
    
    # Validate API key before starting
    validate_api_key()
    
    # Game loop - 3 nights
    for night in range(1, 4):
        print(f"\n{'='*50}")
        print(f"🌙 --- Night {night} --- 🌙")
        print(f"{'='*50}\n")
        
        # Inner loop for player interactions
        while True:
            try:
                player_input = input("You: ").strip()
                
                # Check for exit commands
                if player_input.lower() in ["exit", "quit"]:
                    print("\n🚪 Exiting game... You survived!")
                    return
                
                # Skip empty input
                if not player_input:
                    continue
                
                # Select random animatronic
                animatronic = random.choice(animatronics)
                
                # Add suspense
                print(f"\n{animatronic} is approaching...", end="", flush=True)
                time.sleep(1)
                print(" 👻")
                
                # Get and display AI response
                response = ai_response(animatronic, player_input)
                print(f"{animatronic}: {response}\n")
                
            except KeyboardInterrupt:
                print("\n\n🚪 Game interrupted. Exiting...")
                return
            except EOFError:
                print("\n\n🚪 Input ended. Exiting...")
                return


# ==================== DEMO MODE ====================

def demo_mode():
    """
    Run a demo without requiring API key (for testing structure).
    """
    print("=" * 50)
    print("🎮 FNAF AI Night - DEMO MODE 🎮")
    print("=" * 50)
    print("\nRunning in demo mode (no AI responses)")
    print("Type 'exit' or 'quit' to escape.\n")
    
    for night in range(1, 4):
        print(f"\n{'='*50}")
        print(f"🌙 --- Night {night} --- 🌙")
        print(f"{'='*50}\n")
        
        while True:
            try:
                player_input = input("You: ").strip()
                
                if player_input.lower() in ["exit", "quit"]:
                    print("\n🚪 Exiting demo...")
                    return
                
                if not player_input:
                    continue
                
                animatronic = random.choice(animatronics)
                print(f"\n{animatronic} is approaching... 👻")
                print(f"{animatronic}: [DEMO] I'm {animatronic}... watching you... 🐻👁️\n")
                
            except (KeyboardInterrupt, EOFError):
                print("\n\n🚪 Demo interrupted. Exiting...")
                return


# ==================== MAIN ====================

def main():
    """
    Entry point for the game.

    Environment variables:
        FNAF_DEMO_MODE=1    – run the text-only demo mode
        FNAF_PYGAME_MODE=1  – run the pygame graphical mode (default when pygame is available)
    """
    if os.environ.get("FNAF_DEMO_MODE") == "1":
        demo_mode()
    elif os.environ.get("FNAF_PYGAME_MODE") == "1" or PYGAME_AVAILABLE:
        run_pygame_game()
    else:
        play_game()


if __name__ == "__main__":
    main()
