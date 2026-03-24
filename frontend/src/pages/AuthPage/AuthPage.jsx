import { useState } from "react";
import { Anchor, Badge, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import style from "./AuthPage.module.css";
import { useAuth } from "../../context/AuthContext";

const AUTH_COPY = {
  login: {
    badge: "Welcome back",
    title: "Log in to continue your quest",
    submitLabel: "Log in",
    switchPrompt: "Need an account?",
    switchLabel: "Register",
  },
  register: {
    badge: "New here",
    title: "Create your account",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchLabel: "Log in",
  },
};

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, register } = useAuth();

  const copy = AUTH_COPY[mode];
  const isRegisterMode = mode === "register";

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Enter a valid email address"),
      password: (value) => (value.length < 6 ? "Password must include at least 6 characters" : null),
      confirmPassword: (value, values) => (isRegisterMode && value !== values.password ? "Passwords do not match" : null),
      firstName: (value) => (isRegisterMode && value.trim().length === 0 ? "First name is required" : null),
      lastName: (value) => (isRegisterMode && value.trim().length === 0 ? "Last name is required" : null),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        await register(values.email, values.password, values.firstName, values.lastName);
        setMode("login");
        form.reset();
        alert("Registration successful! Please log in.");
      } else {
        await login(values.email, values.password);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className={style.page}>
      <div className={style.layout}>
        <Paper className={style.formPanel} radius="28px" shadow="xl">
          <Stack gap="xl">
            <Group grow className={style.modeSwitch}>
              <Button
                className={style.modeButton}
                variant={mode === "login" ? "filled" : "subtle"}
                radius="xl"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Log in
              </Button>
              <Button
                className={style.modeButton}
                variant={mode === "register" ? "filled" : "subtle"}
                radius="xl"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
              >
                Register
              </Button>
            </Group>

            <Stack gap="xs">
              <Title order={2} className={style.formTitle}>
                {copy.title}
              </Title>
            </Stack>

            <form onSubmit={handleSubmit}>
              <div className={style.formContainer}>
                <Stack gap="md">
                  {error && (
                    <Text className={style.errorText} ta="center">
                      {error}
                    </Text>
                  )}

                  {isRegisterMode && (
                    <Group grow className={style.nameRow}>
                      <TextInput
                        className={style.field}
                        label="First Name"
                        placeholder="John"
                        size="md"
                        radius="md"
                        required
                        {...form.getInputProps("firstName")}
                      />
                      <TextInput
                        className={style.field}
                        label="Last Name"
                        placeholder="Doe"
                        size="md"
                        radius="md"
                        required
                        {...form.getInputProps("lastName")}
                      />
                    </Group>
                  )}

                  <TextInput
                    className={style.field}
                    label="Email"
                    placeholder="you@example.com"
                    size="md"
                    radius="md"
                    required
                    {...form.getInputProps("email")}
                  />
                  <PasswordInput
                    className={style.field}
                    label="Password"
                    placeholder="Enter your password"
                    size="md"
                    radius="md"
                    required
                    {...form.getInputProps("password")}
                  />

                  {isRegisterMode && (
                    <PasswordInput
                      className={style.field}
                      label="Confirm password"
                      placeholder="Repeat your password"
                      size="md"
                      radius="md"
                      required
                      {...form.getInputProps("confirmPassword")}
                    />
                  )}

                  <Button className={style.submitButton} type="submit" size="md" radius="xl" fullWidth loading={loading}>
                    {copy.submitLabel}
                  </Button>
                </Stack>
              </div>
            </form>
          </Stack>
        </Paper>
      </div>
    </section>
  );
};

export default AuthPage;
