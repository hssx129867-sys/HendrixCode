# React Component Template

## Functional Component with TypeScript

```typescript
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  // Define your props here
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onClick,
  children
}) => {
  // State
  const [count, setCount] = useState<number>(0);
  
  // Effects
  useEffect(() => {
    // Component did mount / update logic
    console.log('Component mounted or updated');
    
    // Cleanup function (component will unmount)
    return () => {
      console.log('Cleanup');
    };
  }, [/* dependencies */]);
  
  // Event handlers
  const handleClick = () => {
    setCount(count + 1);
    onClick?.();
  };
  
  // Render
  return (
    <div className="component-name">
      <h2 className="component-name__title">{title}</h2>
      <button onClick={handleClick}>
        Count: {count}
      </button>
      {children}
    </div>
  );
};
```

## CSS Module Template

```css
/* ComponentName.css */

.component-name {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.component-name__title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.component-name button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.component-name button:hover {
  background-color: #0056b3;
}

.component-name button:active {
  transform: scale(0.98);
}
```

## Custom Hook Template

```typescript
// useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Your effect logic here
  }, [value]);
  
  const updateValue = (newValue: string) => {
    setValue(newValue);
  };
  
  return {
    value,
    updateValue,
    isLoading,
    error
  };
};

// Usage:
// const { value, updateValue } = useCustomHook('initial');
```

## Context Template

```typescript
// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## Form Component Template

```typescript
import React, { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Best Practices

1. **Use TypeScript**: Type safety prevents bugs
2. **Functional Components**: Modern React uses hooks
3. **Props Interface**: Always define prop types
4. **CSS Naming**: Use BEM or consistent naming convention
5. **Separate Concerns**: Keep logic, styling, and markup organized
6. **Accessibility**: Add ARIA labels and semantic HTML
7. **Error Handling**: Always handle errors gracefully
8. **Performance**: Use React.memo, useCallback, useMemo when needed

---

**Happy component building! ⚛️**
