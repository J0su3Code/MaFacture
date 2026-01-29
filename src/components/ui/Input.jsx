import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  helper,
  icon,
  type = 'text',
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          type={type}
          className={`input-field ${icon ? 'has-icon' : ''}`}
          {...props}
        />
      </div>
      
      {error && <span className="input-error">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  error,
  helper,
  required = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className="input-field textarea"
        {...props}
      />
      
      {error && <span className="input-error">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  required = false,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <select ref={ref} className="input-field select" {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <span className="input-error">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;