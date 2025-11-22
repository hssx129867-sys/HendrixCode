# 🎯 Practice Exercises - Learn by Doing!

Hey Hendrix! These are fun exercises you can do to practice coding. Start with Level 1 and work your way up! Each exercise teaches you something new! 🌟

---

## 🟢 Level 1: Super Easy (Start Here!)

### Exercise 1: About Me Program
**Goal**: Make a program that tells people about you!

**File**: Create `about_me.py`

**Your Code**:
```python
# All about Hendrix!
print("👋 Hi! My name is Hendrix!")
print("🎂 I am 7 years old")
print("🎮 I love Roblox!")
print("💻 I'm learning to code!")
print("🌟 I'm going to make awesome games!")
```

**Try This**:
- Change the text to be about YOU
- Add more lines about your hobbies
- Add more emojis!

---

### Exercise 2: Calculator
**Goal**: Make a program that does math!

**File**: Create `calculator.py`

**Your Code**:
```python
# My Calculator
print("🔢 Hendrix's Calculator")
print("")

# Addition
result = 5 + 3
print("5 + 3 =", result)

# Subtraction
result = 10 - 4
print("10 - 4 =", result)

# Multiplication
result = 6 * 7
print("6 × 7 =", result)

# Division
result = 20 / 4
print("20 ÷ 4 =", result)
```

**Try This**:
- Change the numbers to different ones
- Add more math problems
- Can you make it multiply 12 × 12?

---

### Exercise 3: Story Time
**Goal**: Create a story using variables!

**File**: Create `story.py`

**Your Code**:
```python
# My Adventure Story
hero = "Hendrix"
villain = "The Bug Monster"
weapon = "Code Sword"
place = "GitHub Island"

print("🏝️ The Adventure of", hero)
print("")
print("Once upon a time,", hero, "went to", place)
print("There he met", villain + "!")
print("But", hero, "had a powerful", weapon)
print(hero, "defeated", villain, "and saved the day!")
print("🎉 The End!")
```

**Try This**:
- Change the hero name to your name
- Make up different characters
- Add more parts to the story
- What happens next?

---

### Exercise 4: Emoji Art
**Goal**: Make pictures with text!

**File**: Create `emoji_art.py`

**Your Code**:
```python
# Emoji Art Gallery
print("🎨 Hendrix's Emoji Art 🎨")
print("")

print("A House:")
print("    🏠")
print("   🏡")
print("  🏠🏡")
print("")

print("A Face:")
print("  😀")
print(" /|\\")
print(" / \\")
print("")

print("Your turn!")
print("Make your own emoji art below:")
# Add your art here!
```

**Try This**:
- Make different patterns
- Create your initials with emojis
- Make a rocket ship: 🚀
- Make a game controller: 🎮

---

## 🟡 Level 2: Getting Cooler!

### Exercise 5: Greeting Machine
**Goal**: Ask for someone's name and greet them!

**File**: Create `greeter.py`

**Your Code**:
```python
# The Friendly Greeter
print("👋 Welcome to the Greeting Machine!")
print("")

name = input("What's your name? ")
print("")
print("Hello,", name + "! 🎉")
print("Nice to meet you,", name + "!")
print("Have an awesome day! ✨")
```

**Try This**:
- Ask for their age too
- Ask for their favorite color
- Use their answers in the greeting
- Make it more friendly!

---

### Exercise 6: Decision Maker
**Goal**: Make the computer decide things!

**File**: Create `decision_maker.py`

**Your Code**:
```python
# The Decision Maker
print("🎯 Decision Maker 3000")
print("")

age = 7

if age >= 7:
    print("✅ You can start learning Roblox!")
    print("✅ You can learn Python!")
    print("✅ You can use GitHub!")
else:
    print("Keep growing! Almost there!")

print("")
score = 85

if score >= 90:
    print("🌟 Amazing score!")
elif score >= 70:
    print("⭐ Good job!")
else:
    print("💪 Keep practicing!")
```

**Try This**:
- Change the age variable
- Try different score numbers
- Add more if statements
- What happens if age is 5? Or 10?

---

### Exercise 7: Counter Loop
**Goal**: Make the computer count and repeat things!

**File**: Create `counter.py`

**Your Code**:
```python
# The Amazing Counter
print("🔢 Let's Count!")
print("")

# Count from 1 to 5
for number in range(1, 6):
    print("Count:", number)

print("")
print("🎉 Let's celebrate!")

# Say hooray 3 times
for i in range(3):
    print("🎊 Hooray!")

print("")
print("⭐ Count by 2s:")

# Count by 2s
for number in range(2, 11, 2):
    print(number)
```

**Try This**:
- Make it count to 10
- Make it say "Awesome!" 5 times
- Count backwards from 10 to 1
- Count by 5s

---

### Exercise 8: List Maker
**Goal**: Keep lists of your favorite things!

**File**: Create `favorites.py`

**Your Code**:
```python
# My Favorite Things
print("❤️ Hendrix's Favorites ❤️")
print("")

# Favorite games
games = ["Roblox", "Minecraft", "Mario", "Pokemon"]

print("🎮 My Favorite Games:")
for game in games:
    print("  -", game)

print("")

# Favorite colors
colors = ["Blue", "Red", "Green"]

print("🎨 My Favorite Colors:")
for color in colors:
    print("  -", color)

print("")

# Add to the list
games.append("Sonic")
print("I also like:", games[-1])
```

**Try This**:
- Add your real favorite games
- Make a list of favorite foods
- Make a list of friends
- Can you add more colors?

---

## 🔴 Level 3: Real Projects!

### Exercise 9: Number Guessing Game
**Goal**: Make a game where you guess a secret number!

**File**: Create `guessing_game.py`

**Your Code**:
```python
import random

# Number Guessing Game
print("🎲 Number Guessing Game 🎲")
print("")
print("I'm thinking of a number between 1 and 10!")
print("")

# Computer picks a random number
secret_number = random.randint(1, 10)

# Get player's guess
guess = int(input("What's your guess? "))

# Check if they got it
if guess == secret_number:
    print("🎉 WOW! You got it!")
    print("The number was", secret_number)
elif guess < secret_number:
    print("📈 Too low! The number was", secret_number)
else:
    print("📉 Too high! The number was", secret_number)

print("")
print("Thanks for playing! 🌟")
```

**Try This**:
- Change the range to 1-20
- Give them 3 guesses instead of 1
- Keep score
- Add more hints!

---

### Exercise 10: Simple Webpage
**Goal**: Make your first webpage!

**File**: Create `my_page.html`

**Your Code**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hendrix's Awesome Page</title>
    <style>
        body {
            background-color: lightblue;
            font-family: Arial;
            text-align: center;
            padding: 50px;
        }
        h1 {
            color: darkblue;
        }
        button {
            background-color: green;
            color: white;
            padding: 10px 20px;
            font-size: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>🎮 Welcome to Hendrix's Page! 🎮</h1>
    <p>I'm learning to code and it's awesome!</p>
    <p>I'm going to make cool games and websites!</p>
    <button onclick="alert('You clicked me! 🎉')">Click Me!</button>
</body>
</html>
```

**Try This**:
- Change the colors
- Add more text
- Add more buttons
- Change what happens when you click

---

### Exercise 11: Roblox First Script
**Goal**: Your first Roblox game code!

**Where**: In Roblox Studio, add a Script to a Part

**Your Code**:
```lua
-- My First Roblox Script
print("🎮 Hello from my Roblox game!")

-- Get the part this script is in
local part = script.Parent

-- Change the part's color
part.BrickColor = BrickColor.new("Bright red")

-- Wait 2 seconds
wait(2)

-- Change it again!
part.BrickColor = BrickColor.new("Bright blue")

print("✨ Color changed!")
```

**Try This**:
- Try different colors
- Change the wait time
- Make it change 3 times
- Add more parts!

---

### Exercise 12: Rock, Paper, Scissors
**Goal**: Make a game you can play against the computer!

**File**: Create `rock_paper_scissors.py`

**Your Code**:
```python
import random

# Rock, Paper, Scissors Game
print("✊ Rock, Paper, Scissors! ✋")
print("")

# Get player choice
print("Choose:")
print("1 = Rock 🪨")
print("2 = Paper 📄")
print("3 = Scissors ✂️")
print("")

player = int(input("Your choice (1, 2, or 3): "))

# Computer chooses randomly
computer = random.randint(1, 3)

print("")
print("You chose:", player)
print("Computer chose:", computer)
print("")

# Determine winner
if player == computer:
    print("🤝 It's a tie!")
elif (player == 1 and computer == 3) or \
     (player == 2 and computer == 1) or \
     (player == 3 and computer == 2):
    print("🎉 You win!")
else:
    print("🤖 Computer wins!")
```

**Try This**:
- Add best of 3 rounds
- Keep score
- Show Rock/Paper/Scissors words instead of numbers
- Add a "Play Again?" option

---

## 🎯 Challenge Projects

Ready for something bigger? Try these!

### Challenge 1: Mad Libs
Make a program that asks for words and creates a funny story!

### Challenge 2: To-Do List
Create a program where you can:
- Add tasks
- Mark tasks as done
- See all your tasks

### Challenge 3: Simple Quiz
Make a quiz game with 5 questions about things you like!

### Challenge 4: Password Generator
Create random passwords to keep things secure!

### Challenge 5: Roblox Coin Collector
In Roblox, make coins that disappear when touched and give points!

---

## 📝 Track Your Progress

Check off exercises as you complete them:

### Level 1:
- [ ] About Me Program
- [ ] Calculator
- [ ] Story Time
- [ ] Emoji Art

### Level 2:
- [ ] Greeting Machine
- [ ] Decision Maker
- [ ] Counter Loop
- [ ] List Maker

### Level 3:
- [ ] Number Guessing Game
- [ ] Simple Webpage
- [ ] Roblox First Script
- [ ] Rock, Paper, Scissors

### Challenges:
- [ ] Mad Libs
- [ ] To-Do List
- [ ] Simple Quiz
- [ ] Password Generator
- [ ] Roblox Coin Collector

---

## 💡 Tips for Doing Exercises

1. **Type the code yourself** - Don't just copy/paste!
2. **Try to understand each line** - Ask Copilot if confused
3. **Make changes and experiment** - What happens if you change something?
4. **Run your code often** - Test it as you go!
5. **Have fun with it** - Add your own ideas!

### When Something Doesn't Work:
1. Read the error message
2. Check for spelling mistakes
3. Make sure you have all the quotation marks " "
4. Ask Copilot for help
5. Take a break and try again!

---

## 🌟 What's Next?

After you finish these exercises:

1. **Make your own exercises** - Create new challenges!
2. **Combine ideas** - Mix different exercises together!
3. **Share your code** - Show others what you made!
4. **Start a real project** - Build something you really want!

---

**Remember: Every expert coder started exactly where you are right now!** 🚀

**The difference? They kept practicing and having fun!** 🎉

**Now go code something AWESOME!** ✨

---

*Made with ❤️ for Hendrix*
*Happy Coding! Keep experimenting! Keep creating!* 🌟
