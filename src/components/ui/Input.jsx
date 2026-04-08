const Input = ({
  label, name, type = 'text', value, onChange, error,
  placeholder, icon: Icon, rightElement, className = '',
  disabled = false, min, max, step, onKeyDown, onPaste, inputMode,
}) => {

  const getMin = () => {
    if (type !== 'number') return min;
    return min !== undefined ? parseFloat(min) : 0;
  };

  const handleKeyDown = (e) => {
    if (type === 'number') {
      if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowDown') {
        const current = parseFloat(e.target.value) || 0;
        const minimum = getMin();
        if (current <= minimum) e.preventDefault();
      }
    }
    onKeyDown?.(e);
  };

  const handlePaste = (e) => {
    if (type === 'number' && /[+\-]/.test(e.clipboardData.getData('text')))
      e.preventDefault();
    onPaste?.(e);
  };

  const handleChange = (e) => {
    if (type === 'number') {
      const raw = e.target.value;
      const minimum = getMin();
      if (raw !== '' && parseFloat(raw) < minimum) {
        e.target.value = String(minimum);
        const fixed = { ...e, target: { ...e.target, value: String(minimum), name: e.target.name } };
        onChange?.(fixed);
        return;
      }
    }
    onChange?.(e);
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={placeholder}
          min={getMin()}
          max={max}
          step={step}
          inputMode={inputMode}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default Input;