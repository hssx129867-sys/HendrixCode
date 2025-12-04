"""
Array and List Utility Functions
=================================
Common operations on arrays and lists.
"""

def chunk_array(arr, size):
    """
    Split array into chunks of specified size
    
    Args:
        arr: Input list
        size: Size of each chunk
    
    Returns:
        List of chunks
    
    Example:
        >>> chunk_array([1, 2, 3, 4, 5, 6, 7], 3)
        [[1, 2, 3], [4, 5, 6], [7]]
    """
    return [arr[i:i + size] for i in range(0, len(arr), size)]


def flatten(nested_list):
    """
    Flatten a nested list structure
    
    Args:
        nested_list: List that may contain nested lists
    
    Returns:
        Flattened list
    
    Example:
        >>> flatten([1, [2, 3], [4, [5, 6]], 7])
        [1, 2, 3, 4, 5, 6, 7]
    """
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result


def unique(arr):
    """
    Get unique elements while preserving order
    
    Args:
        arr: Input list
    
    Returns:
        List with duplicates removed
    
    Example:
        >>> unique([1, 2, 2, 3, 4, 3, 5])
        [1, 2, 3, 4, 5]
    """
    seen = set()
    result = []
    for item in arr:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def intersection(arr1, arr2):
    """
    Find common elements in two lists
    
    Args:
        arr1: First list
        arr2: Second list
    
    Returns:
        List of common elements
    
    Example:
        >>> intersection([1, 2, 3, 4], [3, 4, 5, 6])
        [3, 4]
    """
    return list(set(arr1) & set(arr2))


def difference(arr1, arr2):
    """
    Find elements in arr1 that are not in arr2
    
    Args:
        arr1: First list
        arr2: Second list
    
    Returns:
        List of elements in arr1 but not in arr2
    
    Example:
        >>> difference([1, 2, 3, 4], [3, 4, 5, 6])
        [1, 2]
    """
    return list(set(arr1) - set(arr2))


def rotate(arr, steps):
    """
    Rotate array by given number of steps
    
    Args:
        arr: Input list
        steps: Number of positions to rotate (positive = right, negative = left)
    
    Returns:
        Rotated list
    
    Example:
        >>> rotate([1, 2, 3, 4, 5], 2)
        [4, 5, 1, 2, 3]
        >>> rotate([1, 2, 3, 4, 5], -2)
        [3, 4, 5, 1, 2]
    """
    if not arr:
        return arr
    steps = steps % len(arr)
    return arr[-steps:] + arr[:-steps] if steps else arr


def partition(arr, predicate):
    """
    Partition array into two groups based on predicate
    
    Args:
        arr: Input list
        predicate: Function that returns True/False for each element
    
    Returns:
        Tuple of (elements where predicate is True, elements where predicate is False)
    
    Example:
        >>> partition([1, 2, 3, 4, 5, 6], lambda x: x % 2 == 0)
        ([2, 4, 6], [1, 3, 5])
    """
    true_list = [x for x in arr if predicate(x)]
    false_list = [x for x in arr if not predicate(x)]
    return true_list, false_list


def group_by(arr, key_func):
    """
    Group array elements by a key function
    
    Args:
        arr: Input list
        key_func: Function to extract grouping key from each element
    
    Returns:
        Dictionary mapping keys to lists of elements
    
    Example:
        >>> group_by(['one', 'two', 'three', 'four'], len)
        {3: ['one', 'two'], 5: ['three'], 4: ['four']}
    """
    result = {}
    for item in arr:
        key = key_func(item)
        if key not in result:
            result[key] = []
        result[key].append(item)
    return result


if __name__ == "__main__":
    # Example usage
    print("=== Array Utils Examples ===")
    print(f"Chunk: {chunk_array([1, 2, 3, 4, 5, 6, 7], 3)}")
    print(f"Flatten: {flatten([1, [2, 3], [4, [5, 6]], 7])}")
    print(f"Unique: {unique([1, 2, 2, 3, 4, 3, 5])}")
    print(f"Intersection: {intersection([1, 2, 3, 4], [3, 4, 5, 6])}")
    print(f"Difference: {difference([1, 2, 3, 4], [3, 4, 5, 6])}")
    print(f"Rotate right: {rotate([1, 2, 3, 4, 5], 2)}")
    print(f"Partition: {partition([1, 2, 3, 4, 5, 6], lambda x: x % 2 == 0)}")
    print(f"Group by length: {group_by(['one', 'two', 'three', 'four'], len)}")
