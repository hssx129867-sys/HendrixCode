# Getting Started with Python Programming

## Introduction

Python is a versatile, beginner-friendly programming language used for web development, data science, automation, and more.

## Installation

### Windows
1. Download Python from [python.org](https://python.org)
2. Run the installer
3. Check "Add Python to PATH"
4. Click "Install Now"

### macOS
```bash
# Using Homebrew
brew install python3
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip
```

## Your First Python Program

Create a file called `hello.py`:

```python
# hello.py
print("Hello, World!")
```

Run it:
```bash
python hello.py
```

## Basic Concepts

### Variables and Data Types

```python
# Numbers
age = 25
price = 19.99

# Strings
name = "Alice"
message = 'Hello, World!'

# Booleans
is_active = True
has_permission = False

# Lists (arrays)
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

# Dictionaries (objects)
person = {
    "name": "Bob",
    "age": 30,
    "city": "New York"
}
```

### Control Flow

```python
# If statements
age = 18
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")

# For loops
for i in range(5):
    print(f"Count: {i}")

for fruit in ["apple", "banana", "orange"]:
    print(f"I like {fruit}")

# While loops
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1
```

### Functions

```python
# Define a function
def greet(name):
    return f"Hello, {name}!"

# Call the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!

# Function with default parameters
def power(base, exponent=2):
    return base ** exponent

print(power(3))      # Output: 9 (3^2)
print(power(2, 3))   # Output: 8 (2^3)
```

### Lists and List Comprehensions

```python
# List operations
numbers = [1, 2, 3, 4, 5]

# Add elements
numbers.append(6)
numbers.extend([7, 8])

# Access elements
first = numbers[0]
last = numbers[-1]

# Slicing
first_three = numbers[:3]
last_two = numbers[-2:]

# List comprehension
squares = [x**2 for x in range(10)]
# Output: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

even_numbers = [x for x in range(20) if x % 2 == 0]
# Output: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

### Working with Dictionaries

```python
# Create a dictionary
person = {
    "name": "Alice",
    "age": 25,
    "city": "Boston"
}

# Access values
name = person["name"]
age = person.get("age")

# Add/update entries
person["email"] = "alice@example.com"
person["age"] = 26

# Iterate over dictionary
for key, value in person.items():
    print(f"{key}: {value}")
```

## Practice Exercises

### Exercise 1: Temperature Converter
Write a function to convert Celsius to Fahrenheit:

```python
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

# Test it
print(celsius_to_fahrenheit(0))   # 32.0
print(celsius_to_fahrenheit(100)) # 212.0
```

### Exercise 2: Count Words
Write a function to count words in a sentence:

```python
def count_words(text):
    words = text.split()
    return len(words)

# Test it
sentence = "Python is an amazing programming language"
print(count_words(sentence))  # 6
```

### Exercise 3: Find Maximum
Write a function to find the maximum number in a list:

```python
def find_max(numbers):
    if not numbers:
        return None
    
    max_num = numbers[0]
    for num in numbers:
        if num > max_num:
            max_num = num
    return max_num

# Test it
print(find_max([3, 7, 2, 9, 1]))  # 9
```

## Next Steps

1. Practice writing small programs
2. Learn about classes and object-oriented programming
3. Explore Python libraries like `requests`, `pandas`, `numpy`
4. Build projects that interest you
5. Read other people's code on GitHub

## Resources

- [Python Official Documentation](https://docs.python.org)
- [Python Tutorial](https://docs.python.org/3/tutorial/)
- [Real Python](https://realpython.com)
- [Python Package Index (PyPI)](https://pypi.org)

---

**Happy coding! 🚀**
