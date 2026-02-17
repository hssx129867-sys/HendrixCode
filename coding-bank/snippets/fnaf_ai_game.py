"""
Five Nights at Freddy's AI Game
================================
An interactive AI-powered game inspired by Five Nights at Freddy's.
Uses OpenAI API to generate spooky responses from animatronic characters.

Requirements:
    pip install openai

Security Note:
    NEVER hardcode API keys in your code. Use environment variables or secure key management.
    Get your API key from: https://platform.openai.com/api-keys
"""

import random
import time
import os

# Try to import openai - if not available, will use demo mode
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAI module not installed. Install it with: pip install openai")

# ==================== CONFIGURATION ====================

# API Key Configuration
# IMPORTANT: Set your OpenAI API key as an environment variable
# On Linux/Mac: export OPENAI_API_KEY="your-key-here"
# On Windows: set OPENAI_API_KEY=your-key-here
# Or create a .env file and use python-dotenv
if OPENAI_AVAILABLE:
    openai.api_key = os.environ.get("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")

# Animatronics
animatronics = ["Freddy", "Bonnie", "Chica"]

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
        prompt = f"You are {animatronic} from Five Nights at Freddy's. Respond in a spooky way to the player: '{player_input}'"
        
        # Using the newer ChatCompletion API (recommended)
        # Note: text-davinci-003 is deprecated. Use gpt-3.5-turbo or gpt-4 instead
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
    
    except openai.error.AuthenticationError:
        return f"[ERROR: Invalid API key. Please set your OPENAI_API_KEY environment variable]"
    except openai.error.RateLimitError:
        return f"[ERROR: Rate limit exceeded. Please try again later]"
    except Exception as e:
        return f"[ERROR: {str(e)}]"


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
    """
    # Check if running in demo mode
    if os.environ.get("FNAF_DEMO_MODE") == "1":
        demo_mode()
    else:
        play_game()


if __name__ == "__main__":
    main()
