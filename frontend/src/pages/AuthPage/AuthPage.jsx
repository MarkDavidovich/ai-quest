import { useState } from "react";
import {
  Anchor,
  Badge,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import style from "./AuthPage.module.css";
import { useAuth } from "../../context/AuthContext";

const AUTH_COPY = {
  login: {
    badge: "Welcome back",
    title: "Log in to continue your quest",
    description: "",
    submitLabel: "Log in",
    switchPrompt: "Need an account?",
    switchLabel: "Register",
  },
  register: {
    badge: "New here",
    title: "Create your account",
    description: "",
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
      terms: false,
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Enter a valid email address",
      password: (value) =>
        value.length < 6 ? "Password must include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        isRegisterMode && value !== values.password
          ? "Passwords do not match"
          : null,
      firstName: (value) =>
        isRegisterMode && value.trim().length === 0 ? "First name is required" : null,
      lastName: (value) =>
        isRegisterMode && value.trim().length === 0 ? "Last name is required" : null,
      // terms: (value) =>
      //   isRegisterMode && !value ? "You need to accept the terms" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        const result = await register(
          values.email,
          values.password,
          values.firstName,
          values.lastName
        );
        console.log("Registration successful:", result);
        // Switch to login mode after successful registration
        setMode("login");
        form.reset();
        alert("Registration successful! Please log in.");
      } else {
        const result = await login(values.email, values.password);
        console.log("Login successful:", result);
        // No need for window.location.reload() since context state change will trigger re-render
      }
    } catch (err) {
      console.error(`${mode} error:`, err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className={style.page}>
      <div className={style.layout}>
        <Paper className={style.formPanel} radius="24px" shadow="xl">
          <Stack gap="xl">
            <Group grow className={style.modeSwitch}>
              <Button
                variant={mode === "login" ? "filled" : "default"}
                radius="xl"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Log in
              </Button>
              <Button
                variant={mode === "register" ? "filled" : "default"}
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
              <Badge variant="light" color="violet" radius="xl" w="fit-content">
                {copy.badge}
              </Badge>
              <Title order={2} className={style.formTitle}>
                {copy.title}
              </Title>
              <Text className={style.formDescription}>{copy.description}</Text>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Text color="red" size="sm" ta="center">
                    {error}
                  </Text>
                )}

                {isRegisterMode && (
                  <Group grow>
                    <TextInput
                      label="First Name"
                      placeholder="John"
                      size="md"
                      radius="md"
                      required
                      {...form.getInputProps("firstName")}
                    />
                    <TextInput
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
                  label="Email"
                  placeholder="you@example.com"
                  size="md"
                  radius="md"
                  required
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  size="md"
                  radius="md"
                  required
                  {...form.getInputProps("password")}
                />

                {isRegisterMode && (
                  <>
                    <PasswordInput
                      label="Confirm password"
                      placeholder="Repeat your password"
                      size="md"
                      radius="md"
                      required
                      {...form.getInputProps("confirmPassword")}
                    />
                  </>
                )}

                <Button 
                  type="submit" 
                  size="md" 
                  radius="xl" 
                  fullWidth 
                  loading={loading}
                >
                  {copy.submitLabel}
                </Button>
              </Stack>
            </form>

            <Divider label="or" labelPosition="center" />

            <Text ta="center" size="sm" className={style.switchText}>
              {copy.switchPrompt}{" "}
              <Anchor
                component="button"
                type="button"
                onClick={() => {
                  const newMode = isRegisterMode ? "login" : "register";
                  setMode(newMode);
                  setError(null);
                }}
              >
                {copy.switchLabel}
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </div>
    </section>
  );
};

export default AuthPage;
