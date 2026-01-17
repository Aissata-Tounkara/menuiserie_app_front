
import { Save } from 'lucide-react';

const Form = ({ 
  fields, 
  formData, 
  onChange, 
  onCancel, 
  onSubmit, 
  submitLabel = "Créer",
  cancelLabel = "Annuler" 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div 
            key={field.name} 
            className={field.fullWidth ? "md:col-span-2" : ""}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && '*'}
            </label>

            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default Form;