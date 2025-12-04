"""
String Utility Functions
========================
Common string manipulation and validation utilities.
"""

def capitalize_words(text):
    """
    Capitalize the first letter of each word
    
    Args:
        text: Input string
    
    Returns:
        String with each word capitalized
    
    Example:
        >>> capitalize_words("hello world from python")
        "Hello World From Python"
    """
    return ' '.join(word.capitalize() for word in text.split())


def count_vowels(text):
    """
    Count the number of vowels in a string
    
    Args:
        text: Input string
    
    Returns:
        Number of vowels (a, e, i, o, u)
    
    Example:
        >>> count_vowels("Hello World")
        3
    """
    vowels = "aeiouAEIOU"
    return sum(1 for char in text if char in vowels)


def remove_duplicates(text):
    """
    Remove duplicate characters while preserving order
    
    Args:
        text: Input string
    
    Returns:
        String with duplicates removed
    
    Example:
        >>> remove_duplicates("hello")
        "helo"
    """
    seen = set()
    result = []
    for char in text:
        if char not in seen:
            seen.add(char)
            result.append(char)
    return ''.join(result)


def is_anagram(str1, str2):
    """
    Check if two strings are anagrams
    
    Args:
        str1: First string
        str2: Second string
    
    Returns:
        True if strings are anagrams, False otherwise
    
    Example:
        >>> is_anagram("listen", "silent")
        True
        >>> is_anagram("hello", "world")
        False
    """
    return sorted(str1.lower()) == sorted(str2.lower())


def truncate(text, max_length, suffix="..."):
    """
    Truncate text to a maximum length with suffix
    
    Args:
        text: Input string
        max_length: Maximum length including suffix
        suffix: String to append when truncated (default "...")
    
    Returns:
        Truncated string
    
    Example:
        >>> truncate("This is a long sentence", 10)
        "This is..."
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix


def snake_to_camel(text):
    """
    Convert snake_case to camelCase
    
    Args:
        text: Snake case string
    
    Returns:
        Camel case string
    
    Example:
        >>> snake_to_camel("hello_world_example")
        "helloWorldExample"
    """
    components = text.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def camel_to_snake(text):
    """
    Convert camelCase to snake_case
    
    Args:
        text: Camel case string
    
    Returns:
        Snake case string
    
    Example:
        >>> camel_to_snake("helloWorldExample")
        "hello_world_example"
    """
    import re
    return re.sub(r'(?<!^)(?=[A-Z])', '_', text).lower()


if __name__ == "__main__":
    # Example usage
    print("=== String Utils Examples ===")
    print(f"Capitalize: {capitalize_words('hello world from python')}")
    print(f"Count vowels in 'Hello World': {count_vowels('Hello World')}")
    print(f"Remove duplicates from 'hello': {remove_duplicates('hello')}")
    print(f"Is 'listen' an anagram of 'silent'? {is_anagram('listen', 'silent')}")
    print(f"Truncate: {truncate('This is a long sentence', 10)}")
    print(f"Snake to Camel: {snake_to_camel('hello_world_example')}")
    print(f"Camel to Snake: {camel_to_snake('helloWorldExample')}")
