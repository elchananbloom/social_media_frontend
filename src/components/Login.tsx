import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";

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
        <div className="login-container">
            <h2 className="login-title">Sign in to Twitter</h2>
            <form onSubmit={formik.handleSubmit} noValidate className="login-form">
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
                    Login
                </button>
            </form>

            {serverError && <div className="server-error">{serverError}</div>}

            <div className="register-link">
                <span>Don't have an account? </span>
                <Link to="/signup">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
