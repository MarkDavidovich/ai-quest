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
  const copy = AUTH_COPY[mode];
  const isRegisterMode = mode === "register";
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
      terms: (value) =>
        isRegisterMode && !value ? "You need to accept the terms" : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const payload = isRegisterMode
      ? {
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
        <Paper className={style.formPanel} radius="24px" shadow="xl">
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
                    {/* <Checkbox
                      label="I agree to the terms and privacy policy"
                      {...form.getInputProps("terms", { type: "checkbox" })}
                    /> */}
                  </>
                )}

                {/* {!isRegisterMode && (
                  <Group justify="space-between" align="center">
                    <Checkbox label="Remember me" />
                    <Anchor href="#" size="sm">
                      Forgot password?
                    </Anchor>
                  </Group>
                )} */}

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
