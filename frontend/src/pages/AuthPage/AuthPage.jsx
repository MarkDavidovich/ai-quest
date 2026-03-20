import { useState } from "react";
import {
  Anchor,
  Badge,
  Box,
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

const AUTH_COPY = {
  login: {
    badge: "Welcome back",
    title: "Log in to continue your quest",
    description:
      "Pick up where you left off, track your progress, and jump right back into the game.",
    submitLabel: "Log in",
    switchPrompt: "Need an account?",
    switchLabel: "Register",
  },
  register: {
    badge: "New here",
    title: "Create your account",
    description:
      "Start a new profile, save your runs, and unlock a personalized game experience.",
    submitLabel: "Create account",
    switchPrompt: "Already have an account?",
    switchLabel: "Log in",
  },
};

// implement mantine form for login and register
const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const copy = AUTH_COPY[mode];
  const isRegisterMode = mode === "register";
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validate: {
      name: (value) =>
        isRegisterMode && value.trim().length < 2
          ? "Display name must include at least 2 characters"
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Enter a valid email address",
      password: (value) =>
        value.length < 6 ? "Password must include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        isRegisterMode && value !== values.password
          ? "Passwords do not match"
          : null,
      terms: (value) =>
        isRegisterMode && !value ? "You need to accept the terms" : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const payload = isRegisterMode
      ? {
          name: values.name,
          email: values.email,
          password: values.password,
          terms: values.terms,
        }
      : {
          email: values.email,
          password: values.password,
        };

    console.log(`${mode} payload`, payload);
  });

  return (
    <section className={style.page}>
      <div className={style.layout}>
        <Stack gap="lg" className={style.heroPanel}>
          <Badge className={style.heroBadge} variant="light" radius="xl">
            AI Quest Access
          </Badge>
          <Title order={1} className={style.heroTitle}>
            One screen, two flows, zero friction.
          </Title>
          <Text className={style.heroText}>
            Switch between login and registration instantly without leaving the
            page. The layout stays stable while the form adapts to what the user
            needs next.
          </Text>
          <Stack gap="sm" className={style.featureList}>
            <Box className={style.featureItem}>
              <Text fw={600}>Modular form blocks</Text>
              <Text size="sm">
                Shared fields stay reusable while mode-specific inputs appear
                only when they are needed.
              </Text>
            </Box>
            <Box className={style.featureItem}>
              <Text fw={600}>Fast UI switching</Text>
              <Text size="sm">
                Login and register buttons flip the screen state immediately
                with no route change required.
              </Text>
            </Box>
            <Box className={style.featureItem}>
              <Text fw={600}>Ready for backend wiring</Text>
              <Text size="sm">
                Each mode submits its own validated payload, so it is easy to
                connect to separate API endpoints later.
              </Text>
            </Box>
          </Stack>
        </Stack>

        <Paper className={style.formPanel} radius="24px" shadow="xl" withBorder>
          <Stack gap="xl">
            <Group grow className={style.modeSwitch}>
              <Button
                variant={mode === "login" ? "filled" : "default"}
                radius="xl"
                onClick={() => setMode("login")}
              >
                Log in
              </Button>
              <Button
                variant={mode === "register" ? "filled" : "default"}
                radius="xl"
                onClick={() => setMode("register")}
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
                {isRegisterMode && (
                  <>
                    <TextInput
                      label="Display name"
                      placeholder="Choose a display name"
                      size="md"
                      radius="md"
                      {...form.getInputProps("name")}
                    />
                  </>
                )}

                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  size="md"
                  radius="md"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  size="md"
                  radius="md"
                  {...form.getInputProps("password")}
                />

                {isRegisterMode && (
                  <>
                    <PasswordInput
                      label="Confirm password"
                      placeholder="Repeat your password"
                      size="md"
                      radius="md"
                      {...form.getInputProps("confirmPassword")}
                    />
                    <Checkbox
                      label="I agree to the terms and privacy policy"
                      {...form.getInputProps("terms", { type: "checkbox" })}
                    />
                  </>
                )}

                {!isRegisterMode && (
                  <Group justify="space-between" align="center">
                    <Checkbox label="Remember me" />
                    <Anchor href="#" size="sm">
                      Forgot password?
                    </Anchor>
                  </Group>
                )}

                <Button type="submit" size="md" radius="xl" fullWidth>
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
                onClick={() => setMode(isRegisterMode ? "login" : "register")}
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
