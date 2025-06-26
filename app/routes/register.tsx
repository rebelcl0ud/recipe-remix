import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createUser } from "../lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  console.log("FORM DATA", email, password);

  type Errors = {
    username: string;
    email: string;
    password: string;
  };

  // basic form validations
  const errors = {} as Errors;

  if (username.length < 2) {
    errors.password = "Username < 2 characters";
  }

  if (!email.includes("@")) {
    errors.email = "Invaild email";
  }

  if (password.length < 12) {
    errors.password = "Password < 12 characters";
  }

  if (Object.keys(errors).length > 0) {
    console.log("hitting errors block", { errors });
    return { errors };
  }

  if (!email || !password) {
    console.log("hitting the no email/no pw");
    return new Response("Missing fields.", { status: 400 });
  }

  // pw + create user
  const user = await createUser(email, password, username);

  console.log("USER CREATED", user);

  return redirect("/login");
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="grow w-sm">
      <h1 className="my-8 justify-self-center">Register here!</h1>
      <Form method="POST">
        <p className="my-4">
          <label className="flex flex-col ">
            Username: (optional)
            <input
              className="bg-[var(--color-antiquewhite)] rounded-sm p-2"
              type="username"
              name="username"
            />
          </label>
        </p>
        <p className="my-4">
          <label className="flex flex-col ">
            Email:
            <input
              className="bg-[var(--color-antiquewhite)] rounded-sm p-2"
              type="email"
              name="email"
              required
            />
          </label>
          {actionData?.errors?.email ? (
            <em className="text-red-500">{actionData?.errors.email}</em>
          ) : null}
        </p>
        <p className="my-4">
          <label className="flex flex-col ">
            Password:
            <input
              className="bg-[var(--color-antiquewhite)] rounded-sm p-2"
              type="password"
              name="password"
              required
            />
          </label>
          {actionData?.errors?.password ? (
            <em className="text-red-500">{actionData?.errors.password}</em>
          ) : null}
        </p>
        <button
          className="my-4 px-4 py-2 rounded-sm bg-[var(--color-antiquewhite)]"
          type="submit"
        >
          Register
        </button>
      </Form>
      Already registered?{" "}
      <Link className="text-blue-500" to="/login">
        Login here.
      </Link>
    </div>
  );
}
