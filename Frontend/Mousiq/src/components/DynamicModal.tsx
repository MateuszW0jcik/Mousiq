import React, {useState, useEffect} from 'react';
import {X} from 'lucide-react';
import {parseApiError, isValidationError, getErrorMessage} from '../services/api.service';

export interface FieldOption {
    id?: string;
    name?: string;
    [key: string]: unknown;
}

export interface Field {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'file' | 'checkbox';
    placeholder?: string;
    required?: boolean;
    step?: string;
    min?: string | number;
    max?: string | number;
    options?: FieldOption[];
    getOptionValue?: (option: FieldOption) => string;
    getOptionLabel?: (option: FieldOption) => string;
}

interface DynamicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: Field[];
    initialData?: Record<string, unknown>;
    onSave: (data: Record<string, unknown>) => Promise<void>;
    onDelete?: () => Promise<void>;
    showDelete?: boolean;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       title,
                                                       fields,
                                                       initialData = {},
                                                       onSave,
                                                       onDelete,
                                                       showDelete = false
                                                   }) => {
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialFormData: Record<string, unknown> = {};
            fields.forEach(field => {
                initialFormData[field.name] = initialData[field.name] ?? '';
            });
            setFormData(initialFormData);
            setErrorMessage('');
            setValidationErrors({});
        }
    }, [isOpen, fields, initialData]);

    const handleInputChange = (name: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setValidationErrors({});

        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to save');

            if (isValidationError(apiError)) {
                setValidationErrors(apiError.errors);
            } else {
                setErrorMessage(getErrorMessage(apiError));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        if (!onDelete) return;

        setIsLoading(true);
        setErrorMessage('');
        setValidationErrors({});

        try {
            await onDelete();
            onClose();
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete');
            setErrorMessage(getErrorMessage(apiError));
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setClickedOnOverlay(true);
        } else {
            setClickedOnOverlay(false);
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (clickedOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-gray-500 cursor-pointer"/>
                    </button>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col overflow-y-auto max-h-[60vh] space-y-4 mb-6 p-1 pr-2">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-600">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    value={String(formData[field.name] ?? '')}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    required={field.required}
                                    className={`w-full p-2 border cursor-pointer ${
                                        validationErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                >
                                    <option value="">Select {field.label}</option>
                                    {field.options?.map((option) => (
                                        <option
                                            key={field.getOptionValue?.(option) || option.id || ''}
                                            value={field.getOptionValue?.(option) || option.id || ''}
                                        >
                                            {field.getOptionLabel?.(option) || option.name || ''}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    value={String(formData[field.name] || '')}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className={`w-full px-3 py-2 resize-none border ${
                                        validationErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    rows={4}
                                />
                            ) : field.type === 'file' ? (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange(field.name, e.target.files?.[0] || null)}
                                    required={field.required}
                                    className={`w-full px-3 py-2 border cursor-pointer ${
                                        validationErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(formData[field.name])}
                                        onChange={(e) => handleInputChange(field.name, e.target.checked)}
                                        required={field.required}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600">{field.placeholder}</span>
                                </div>
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    value={String(formData[field.name] ?? '')}
                                    onChange={(e) =>
                                        handleInputChange(
                                            field.name,
                                            field.type === 'number'
                                                ? e.target.value === ''
                                                    ? ''
                                                    : parseFloat(e.target.value)
                                                : e.target.value
                                        )
                                    }
                                    step={field.step}
                                    min={field.min}
                                    max={field.max}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className={`w-full px-3 py-2 border ${
                                        validationErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                            )}

                            {validationErrors[field.name] && (
                                <p className="text-xs text-red-500">{validationErrors[field.name]}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Global error message */}
                {errorMessage && (
                    <div className="mb-4 text-sm border border-red-300 text-red-700 bg-red-100 p-2 rounded">
                        {errorMessage}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    {showDelete && onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DynamicModal;