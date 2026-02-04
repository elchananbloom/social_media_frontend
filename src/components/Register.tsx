// src/components/Register.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

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
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <h2>Sign up</h2>
            <form onSubmit={formik.handleSubmit} noValidate>
                <div style={{ marginBottom: 8 }}>
                    <label>Username</label>
                    <input
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: "100%" }}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: "red" }}>{formik.errors.username}</div>
                    )}
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: "100%" }}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{ color: "red" }}>{formik.errors.email}</div>
                    )}
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: "100%" }}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: "red" }}>{formik.errors.password}</div>
                    )}
                </div>

                <button type="submit" disabled={formik.isSubmitting}>
                    Register
                </button>
            </form>

            {serverError && <div style={{ color: "red", marginTop: 12 }}>{serverError}</div>}

            {suggestions.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <div>Suggestions:</div>
                    <ul>
                        {suggestions.map((s) => (
                            <li key={s}>
                                <button
                                    style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
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
