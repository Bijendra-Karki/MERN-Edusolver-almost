import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../components/utils/authHelper";

// Assuming you have a way to get the token (as used in the previous category component)
// You might need to adjust the import path if this is not available globally.
// Placeholder for demonstration:


// ✅ Reusable form field component (No changes needed here)
const FormField = ({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    children,
    required = false,
    description,
    isFile = false,
}) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === "textarea" ? (
            <textarea
                id={id}
                rows="3"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                    }`}
            />
        ) : type === "select" ? (
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                    }`}
            >
                {children}
            </select>
        ) : isFile ? (
            <input
                id={id}
                type="file"
                onChange={onChange}
                accept={id === "subjectFile" ? ".pdf" : "image/*"}
                className={`w-full border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                    }`}
            />
        ) : (
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                    }`}
            />
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
);

export default function SubjectForm({ initialData = null, onSuccess }) {
    // ... (defaultForm remains the same)
    const defaultForm = {
        title: "",
        instructor: "",
        instructorAvatar: null,
        duration: "",
        rating: 0,
        level: "Beginner",
        category: "", // This will hold the Category ID (_id)
        image: null,
        description: "",
        price: "Free",
        subjectFile: null,
        skills: "",
        certificates: false,
        language: "English",
        estimatedHours: 0,
    };


    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [preview, setPreview] = useState({ image: "", subjectFile: "" });

    // 👇 NEW STATE FOR CATEGORIES
    const [categories, setCategories] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    // 👆 END NEW STATE

    // --- API Setup for Categories ---
    const token = getToken();



    // 👇 NEW FUNCTION TO FETCH CATEGORIES
    const fetchCategories = useCallback(async () => {
        setCategoryLoading(true);
        try {
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } }
            const res = await axios.get("/api/categories/categoryList", axiosConfig);
            // Assuming the API returns an array directly or an object with a 'categories' array
            const categoryList = Array.isArray(res.data) ? res.data : res.data?.categories || [];

            // Map the categories to ensure they have an _id field which we need as the value
            setCategories(categoryList.filter(c => c._id));
        } catch (err) {
            console.error("Error fetching categories:", err);
            // Optionally set an error state here
        } finally {
            setCategoryLoading(false);
        }
    }, [token]);

    // 1️⃣ Initial fetch on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);


    // ✅ Preload edit data if provided (minor adjustment to dependency)
    useEffect(() => {
        if (initialData) {
            const transformed = {
                ...defaultForm,
                ...initialData,
                skills: Array.isArray(initialData.skills)
                    ? initialData.skills.join(", ")
                    : initialData.skills || "",
            };
            // Note: initialData.category should contain the category ID, which is correctly stored in formData.category
            setFormData(transformed);

            // Previews for edit mode
            setPreview({
                image: initialData.image ? `http://localhost:8000/${initialData.image}` : "",
                subjectFile: initialData.subjectFile
                    ? `http://localhost:8000/${initialData.subjectFile}`
                    : "",
            });
        }
    }, [initialData]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleFileChange = (field, e) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, [field]: file }));

        if (file && field === "image") {
            setPreview((p) => ({ ...p, image: URL.createObjectURL(file) }));
        }
        if (file && field === "subjectFile") {
            setPreview((p) => ({ ...p, subjectFile: file.name }));
        }

        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Course Title is required";
        if (!formData.instructor.trim())
            newErrors.instructor = "Instructor name is required";
        if (!formData.duration.trim())
            newErrors.duration = "Duration is required (e.g., '12 weeks')";
        // 👇 Category validation now checks the selected ID
        if (!formData.category.trim())
            newErrors.category = "A Category must be selected";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (!formData.price.trim())
            newErrors.price = "Price is required (e.g., 'Free' or '$100')";
        if (!initialData && !formData.image)
            newErrors.image = "Course Thumbnail image is required";
        if (formData.estimatedHours < 0)
            newErrors.estimatedHours = "Estimated hours cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const dataToSubmit = new FormData();

            // Append all non-file, non-array fields first
            Object.entries(formData).forEach(([key, value]) => {
                if (["skills", "image", "instructorAvatar", "subjectFile"].includes(key)) return;
                dataToSubmit.append(key, value);
            });

            // Skills array
            formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .forEach((skill) => dataToSubmit.append("skills", skill));

            // File uploads
            if (formData.image) dataToSubmit.append("image", formData.image);
            if (formData.instructorAvatar) dataToSubmit.append("instructorAvatar", formData.instructorAvatar);
            if (formData.subjectFile) dataToSubmit.append("subjectFile", formData.subjectFile);

            const url = initialData
                ? `http://localhost:8000/api/subjects/update/${initialData._id}`
                : "http://localhost:8000/api/subjects/createSubjects";

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };


            // Use correct method
            const res = initialData
                ? await axios.put(url, dataToSubmit, config)
                : await axios.post(url, dataToSubmit, config);

            setSuccess(`Subject "${res.data.title || formData.title}" saved successfully!`);

            if (!initialData) {
                setFormData(defaultForm);
                setPreview({ image: "", subjectFile: "" });
            }

            if (onSuccess) onSuccess(res.data);

        } catch (err) {
            console.error(err);
            setError("Failed to save subject. Please check your inputs or server.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                {/* ... (Header remains the same) */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg
                                className="h-8 w-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.414 9.684 5 8.354 5c-4.4 0-8 3.582-8 8s3.582 8 8 8c1.33 0 2.478-.415 3.646-1.127m0-13C13.168 5.414 14.316 5 15.646 5c4.4 0 8 3.582 8 8s-3.582 8-8 8c-1.33 0-2.478-.415-3.646-1.127M12 6.253v13"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {initialData ? "Edit Subject / Course" : "Create New Subject / Course"}
                    </h1>
                    <p className="text-gray-600">
                        {initialData
                            ? "Update existing course information below."
                            : "Upload media assets and enter new course details below."}
                    </p>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            General Course Information
                        </h2>

                        <FormField
                            id="title"
                            label="Course Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="e.g., Full-Stack Web Development"
                            error={errors.title}
                            required
                        />

                        <FormField
                            id="description"
                            label="Description"
                            type="textarea"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="A detailed summary of the course content..."
                            error={errors.description}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                id="duration"
                                label="Duration"
                                value={formData.duration}
                                onChange={(e) => handleInputChange("duration", e.target.value)}
                                placeholder="e.g., 12 weeks"
                                error={errors.duration}
                                required
                            />
                            <FormField
                                id="estimatedHours"
                                label="Estimated Study Hours"
                                type="number"
                                value={formData.estimatedHours}
                                onChange={(e) =>
                                    handleInputChange("estimatedHours", parseInt(e.target.value) || 0)
                                }
                                placeholder="0"
                                error={errors.estimatedHours}
                            />
                        </div>
                    </div>

                    {/* Instructor & Media */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Instructor & Media
                        </h2>

                        <FormField
                            id="instructor"
                            label="Instructor Name"
                            value={formData.instructor}
                            onChange={(e) => handleInputChange("instructor", e.target.value)}
                            error={errors.instructor}
                            required
                        />

                        <FormField
                            id="instructorAvatar"
                            label="Instructor Avatar (Image Upload)"
                            type="file"
                            onChange={(e) => handleFileChange("instructorAvatar", e)}
                            isFile
                        />

                        <FormField
                            id="image"
                            label="Course Thumbnail Image"
                            type="file"
                            onChange={(e) => handleFileChange("image", e)}
                            error={errors.image}
                            required={!initialData}
                            isFile
                        />
                        {preview.image && (
                            <img
                                src={preview.image}
                                alt="Thumbnail Preview"
                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                id="price"
                                label="Price"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                error={errors.price}
                                required
                            />
                            <FormField
                                id="language"
                                label="Language"
                                value={formData.language}
                                onChange={(e) => handleInputChange("language", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categorization - */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Categorization & Supplemental Files
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 🚀 This is the new combined Category Select field 🚀 */}
                            <div className="space-y-1">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Course Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category} // The value is the selected category's _id
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                    disabled={categoryLoading || isLoading}
                                    required
                                    className={`w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? "border-red-500" : "border-gray-300"}`}
                                >
                                    <option value="" disabled={categoryLoading}>
                                        {categoryLoading ? "Loading Categories..." : "Select a category"}
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {/* The redundant Category ID input is REMOVED */}

                            <FormField
                                id="level"
                                label="Difficulty Level"
                                type="select"
                                value={formData.level}
                                onChange={(e) => handleInputChange("level", e.target.value)}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </FormField>
                        </div>

                        <FormField
                            id="subjectFile"
                            label="Optional Subject File (PDF Upload)"
                            type="file"
                            onChange={(e) => handleFileChange("subjectFile", e)}
                            isFile
                        />
                        {preview.subjectFile && (
                            <p className="text-sm text-blue-700">
                                Current File: {preview.subjectFile}
                            </p>
                        )}

                        <FormField
                            id="skills"
                            label="Key Skills Taught (Comma Separated)"
                            value={formData.skills}
                            onChange={(e) => handleInputChange("skills", e.target.value)}
                            placeholder="e.g., React, Node.js, Tailwind"
                        />

                        <div className="flex items-center pt-2">
                            <input
                                id="certificates"
                                type="checkbox"
                                checked={formData.certificates}
                                onChange={(e) => handleInputChange("certificates", e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="certificates" className="ml-2 text-sm text-gray-700">
                                Offer Certificate of Completion
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full md:w-auto px-8 py-3 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                                }`}
                        >
                            {isLoading
                                ? initialData
                                    ? "Updating..."
                                    : "Creating..."
                                : initialData
                                    ? "Update Subject"
                                    : "Create Subject"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}