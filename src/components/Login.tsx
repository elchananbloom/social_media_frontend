// src/components/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

type LoginFormValues = {
    username: string;
    password: string;
};

export default function Login() {
    const { login } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik<LoginFormValues>({
        initialValues: { username: "", password: "" },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError(null);
            try {
                await login(values.username, values.password);
                // login navigates on success in AuthProvider
            } catch (err: any) {
                // backend may respond with 401 and a message like "INVALID_CREDENTIALS"
                if (err && typeof err === "object" && err.errorMessage) {
                    setServerError(err.errorMessage);
                } else if (typeof err === "string") {
                    setServerError(err);
                } else {
                    setServerError("Invalid credentials");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <h2>Login</h2>
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
                    Login
                </button>
            </form>

            {serverError && <div style={{ color: "red", marginTop: 12 }}>{serverError}</div>}

            <div style={{ marginTop: 16 }}>
                <span>Don't have an account? </span>
                <Link to="/signup" style={{ color: "blue", textDecoration: "underline" }}>
                    Register
                </Link>
            </div>
        </div>
    );
}
