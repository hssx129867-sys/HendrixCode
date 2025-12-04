"""
Common Algorithm Implementations
================================
A collection of fundamental algorithms for learning and reference.
"""

# ==================== SORTING ALGORITHMS ====================

def bubble_sort(arr):
    """
    Bubble Sort - Simple comparison-based sorting algorithm
    
    Time Complexity: O(n²)
    Space Complexity: O(1)
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list in ascending order
    
    Example:
        >>> bubble_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
    """
    arr = arr.copy()  # Don't modify original
    n = len(arr)
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # Optimization: If no swaps occurred, array is sorted
        if not swapped:
            break
    
    return arr


def quick_sort(arr):
    """
    Quick Sort - Efficient divide-and-conquer sorting algorithm
    
    Time Complexity: O(n log n) average, O(n²) worst
    Space Complexity: O(log n) for recursion stack
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list in ascending order
    
    Example:
        >>> quick_sort([10, 7, 8, 9, 1, 5])
        [1, 5, 7, 8, 9, 10]
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)


def merge_sort(arr):
    """
    Merge Sort - Stable divide-and-conquer sorting algorithm
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list in ascending order
    
    Example:
        >>> merge_sort([38, 27, 43, 3, 9, 82, 10])
        [3, 9, 10, 27, 38, 43, 82]
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)


def merge(left, right):
    """Helper function for merge_sort"""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result


# ==================== SEARCHING ALGORITHMS ====================

def binary_search(arr, target):
    """
    Binary Search - Efficient search in sorted array
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    
    Args:
        arr: Sorted list of comparable elements
        target: Element to search for
    
    Returns:
        Index of target if found, -1 otherwise
    
    Example:
        >>> binary_search([1, 3, 5, 7, 9, 11], 7)
        3
        >>> binary_search([1, 3, 5, 7, 9, 11], 6)
        -1
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1


def linear_search(arr, target):
    """
    Linear Search - Simple sequential search
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Args:
        arr: List of elements
        target: Element to search for
    
    Returns:
        Index of target if found, -1 otherwise
    
    Example:
        >>> linear_search([4, 2, 7, 1, 9, 3], 7)
        2
    """
    for i, element in enumerate(arr):
        if element == target:
            return i
    return -1


# ==================== GRAPH ALGORITHMS ====================

def breadth_first_search(graph, start):
    """
    BFS - Explore graph level by level
    
    Time Complexity: O(V + E) where V is vertices, E is edges
    Space Complexity: O(V)
    
    Args:
        graph: Dictionary representing adjacency list
        start: Starting node
    
    Returns:
        List of nodes in BFS order
    
    Example:
        >>> graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': [], 'F': []}
        >>> breadth_first_search(graph, 'A')
        ['A', 'B', 'C', 'D', 'E', 'F']
    """
    visited = []
    queue = [start]
    
    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            queue.extend([n for n in graph.get(node, []) if n not in visited])
    
    return visited


def depth_first_search(graph, start, visited=None):
    """
    DFS - Explore graph depth-first using recursion
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    
    Args:
        graph: Dictionary representing adjacency list
        start: Starting node
        visited: Set of visited nodes (used in recursion)
    
    Returns:
        List of nodes in DFS order
    
    Example:
        >>> graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'], 'D': [], 'E': [], 'F': []}
        >>> depth_first_search(graph, 'A')
        ['A', 'B', 'D', 'E', 'C', 'F']
    """
    if visited is None:
        visited = []
    
    if start not in visited:
        visited.append(start)
        for neighbor in graph.get(start, []):
            depth_first_search(graph, neighbor, visited)
    
    return visited


# ==================== DYNAMIC PROGRAMMING ====================

def fibonacci(n):
    """
    Fibonacci Sequence using Dynamic Programming
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Args:
        n: Position in Fibonacci sequence (0-indexed)
    
    Returns:
        Fibonacci number at position n
    
    Example:
        >>> fibonacci(10)
        55
    """
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]


def longest_common_subsequence(text1, text2):
    """
    Find the longest common subsequence between two strings
    
    Time Complexity: O(m * n)
    Space Complexity: O(m * n)
    
    Args:
        text1: First string
        text2: Second string
    
    Returns:
        Length of longest common subsequence
    
    Example:
        >>> longest_common_subsequence("abcde", "ace")
        3
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]


# ==================== UTILITY FUNCTIONS ====================

def is_palindrome(s):
    """
    Check if a string is a palindrome
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Example:
        >>> is_palindrome("racecar")
        True
        >>> is_palindrome("hello")
        False
    """
    s = s.lower().replace(" ", "")
    return s == s[::-1]


def reverse_string(s):
    """
    Reverse a string
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    
    Example:
        >>> reverse_string("hello")
        "olleh"
    """
    return s[::-1]


if __name__ == "__main__":
    # Example usage
    print("=== Sorting Examples ===")
    arr = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {arr}")
    print(f"Bubble Sort: {bubble_sort(arr)}")
    print(f"Quick Sort: {quick_sort(arr)}")
    print(f"Merge Sort: {merge_sort(arr)}")
    
    print("\n=== Search Examples ===")
    sorted_arr = [1, 3, 5, 7, 9, 11, 13, 15]
    print(f"Array: {sorted_arr}")
    print(f"Binary Search for 7: index {binary_search(sorted_arr, 7)}")
    print(f"Linear Search for 11: index {linear_search(sorted_arr, 11)}")
    
    print("\n=== Dynamic Programming ===")
    print(f"Fibonacci(10): {fibonacci(10)}")
    print(f"LCS('abcde', 'ace'): {longest_common_subsequence('abcde', 'ace')}")
