# Data Structures and Algorithms Guide

## Why Learn DSA?

Data Structures and Algorithms (DSA) are fundamental concepts in computer science that help you:
- Write efficient code
- Solve complex problems
- Ace technical interviews
- Think like a computer scientist

## Core Data Structures

### 1. Arrays and Lists

**Definition**: Ordered collection of elements stored in contiguous memory.

**Use Cases**:
- Storing ordered data
- Quick access by index
- Iterating through collections

**Time Complexity**:
- Access: O(1)
- Search: O(n)
- Insert/Delete: O(n)

**Example**:
```python
# Python List
numbers = [1, 2, 3, 4, 5]
numbers.append(6)        # Add to end
numbers.insert(0, 0)     # Insert at position
numbers.pop()            # Remove last element
```

### 2. Linked Lists

**Definition**: Elements (nodes) connected by pointers, not stored contiguously.

**Types**:
- Singly Linked List
- Doubly Linked List
- Circular Linked List

**Advantages**:
- Dynamic size
- Efficient insertion/deletion at beginning
- No wasted memory

**Time Complexity**:
- Access: O(n)
- Search: O(n)
- Insert/Delete (at head): O(1)

### 3. Stacks

**Definition**: Last-In-First-Out (LIFO) data structure.

**Operations**:
- `push()`: Add element to top
- `pop()`: Remove element from top
- `peek()`: View top element

**Use Cases**:
- Function call stack
- Undo/Redo functionality
- Expression evaluation
- Browser history

**Example**:
```python
stack = []
stack.append(1)    # Push
stack.append(2)
stack.append(3)
top = stack.pop()  # Pop (returns 3)
```

### 4. Queues

**Definition**: First-In-First-Out (FIFO) data structure.

**Operations**:
- `enqueue()`: Add element to rear
- `dequeue()`: Remove element from front
- `front()`: View front element

**Use Cases**:
- Task scheduling
- Breadth-First Search
- Print job management
- Message queuing

**Example**:
```python
from collections import deque

queue = deque()
queue.append(1)      # Enqueue
queue.append(2)
front = queue.popleft()  # Dequeue (returns 1)
```

### 5. Hash Tables

**Definition**: Key-value pairs with fast lookup using hash functions.

**Advantages**:
- O(1) average time for insert, delete, search
- Flexible key types

**Use Cases**:
- Caching
- Counting frequencies
- Fast lookups
- Removing duplicates

**Example**:
```python
# Python Dictionary
user_ages = {}
user_ages["Alice"] = 25
user_ages["Bob"] = 30

age = user_ages.get("Alice")  # O(1) lookup
```

### 6. Trees

**Definition**: Hierarchical structure with nodes connected by edges.

**Types**:
- Binary Tree
- Binary Search Tree (BST)
- AVL Tree
- Heap
- Trie

**Use Cases**:
- File systems
- DOM structure
- Database indexing
- Decision making

**Binary Search Tree Properties**:
- Left child < parent
- Right child > parent
- Enables fast search

### 7. Graphs

**Definition**: Collection of nodes (vertices) connected by edges.

**Types**:
- Directed vs Undirected
- Weighted vs Unweighted
- Cyclic vs Acyclic

**Representations**:
- Adjacency Matrix
- Adjacency List

**Use Cases**:
- Social networks
- Maps and navigation
- Network routing
- Dependency resolution

## Essential Algorithms

### Sorting Algorithms

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space |
|-----------|-------------|----------------|--------------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

### Searching Algorithms

**Linear Search**: O(n)
- Search through each element sequentially
- Works on unsorted data

**Binary Search**: O(log n)
- Requires sorted data
- Divides search space in half each iteration

### Graph Traversal

**Depth-First Search (DFS)**:
- Explores as far as possible before backtracking
- Uses stack (or recursion)
- Use cases: Topological sorting, cycle detection

**Breadth-First Search (BFS)**:
- Explores neighbors before going deeper
- Uses queue
- Use cases: Shortest path, level-order traversal

### Dynamic Programming

**Concept**: Break problem into subproblems, store results to avoid recomputation.

**Approach**:
1. Identify overlapping subproblems
2. Define recursive relation
3. Build solution bottom-up or with memoization

**Classic Problems**:
- Fibonacci sequence
- Longest Common Subsequence
- Knapsack problem
- Edit distance

## Problem-Solving Strategies

### 1. Understand the Problem
- Read carefully
- Identify inputs and outputs
- Consider edge cases

### 2. Plan Your Approach
- Brainstorm solutions
- Consider time/space complexity
- Choose appropriate data structure

### 3. Implement
- Write clean, readable code
- Use meaningful variable names
- Add comments for complex logic

### 4. Test
- Test with sample inputs
- Check edge cases
- Verify time complexity

## Big O Notation

Understanding algorithm efficiency:

- **O(1)**: Constant - best possible
- **O(log n)**: Logarithmic - very good (binary search)
- **O(n)**: Linear - good (single pass)
- **O(n log n)**: Linearithmic - acceptable (merge sort)
- **O(n²)**: Quadratic - okay for small inputs
- **O(2ⁿ)**: Exponential - avoid if possible
- **O(n!)**: Factorial - very slow

## Practice Resources

- **LeetCode**: Algorithm practice with real interview questions
- **HackerRank**: Challenges and competitions
- **CodeSignal**: Interactive coding practice
- **Project Euler**: Mathematical programming challenges
- **Visualgo**: Algorithm visualizations

## Tips for Learning

1. **Start Simple**: Master basic data structures first
2. **Visualize**: Draw diagrams to understand algorithms
3. **Practice Daily**: Consistency is key
4. **Implement from Scratch**: Don't just read, code!
5. **Analyze Complexity**: Always consider time and space
6. **Learn Patterns**: Recognize common problem types

---

**Keep practicing and happy coding! 🎯**
