import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Register.css";

type RegisterFormValues = {
    username: string;
    email: string;
    password: string;
};

export default function Register() {
    const { signup } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required").min(3, "Minimum 3 characters"),
        email: Yup.string().required("Email is required").email("Invalid email"),
        password: Yup.string().required("Password is required").min(3, "Minimum 3 characters"),
    });

    const formik = useFormik<RegisterFormValues>({
        initialValues: { username: "", email: "", password: "" },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError(null);
            setSuggestions([]);
            try {
                await signup(values.username, values.email, values.password);
                // signup navigates on success via AuthProvider
            } catch (err: any) {
                // expected backend payload: { errorMessage: string, suggestionNames: string[] }
                if (err && typeof err === "object") {
                    setServerError(err.errorMessage || "Registration failed");
                    if (Array.isArray(err.suggestionNames) && err.suggestionNames.length) {
                        setSuggestions(err.suggestionNames);
                    }
                } else {
                    setServerError(String(err || "Registration failed"));
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="register-container">
            <h2 className="register-title">Sign up for Twitter</h2>
            <form onSubmit={formik.handleSubmit} noValidate className="register-form">
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-input"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div className="error-message">{formik.errors.username}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-input"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="error-message">{formik.errors.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-input"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="error-message">{formik.errors.password}</div>
                    )}
                </div>

                <button type="submit" disabled={formik.isSubmitting} className="submit-button">
                    Register
                </button>
            </form>

            {serverError && <div className="server-error">{serverError}</div>}

            {suggestions.length > 0 && (
                <div className="suggestions-container">
                    <div className="suggestions-title">Suggestions:</div>
                    <ul className="suggestions-list">
                        {suggestions.map((s) => (
                            <li key={s} className="suggestion-item">
                                <button
                                    className="suggestion-button"
                                    onClick={() => {
                                        formik.setFieldValue("username", s);
                                        setSuggestions([]);
                                        setServerError(null);
                                    }}
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
