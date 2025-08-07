import { Form } from "@remix-run/react";
import { LoginActionData } from "../routes/login";

type LoginProps = {
  sessionError?: string;
  actionData?: LoginActionData;
};

export default function LoginForm({ sessionError, actionData }: LoginProps) {
  return (
    <>
      {sessionError ? <div className="text-red-500">{sessionError}</div> : null}
      <div className="grow w-sm content-evenly">
        <h1 className="mb-8 justify-self-center">Welcome back!</h1>
        <Form method="POST" noValidate>
          {actionData?.formErrors?.length ? (
            <div className="mb-4 p-2 bg-red-100 text-red-500 rounded">
              {actionData.formErrors.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          ) : null}
          <p className="my-4">
            <label className="flex flex-col">
              Email:
              <input
                className="bg-antiquewhite rounded-sm p-2"
                type="email"
                name="email"
                required
                defaultValue={actionData?.values?.email as string}
              />
            </label>
            {actionData?.errors?.email ? (
              <em className="text-red-500">{actionData?.errors.email[0]}</em>
            ) : null}
          </p>
          <p className="my-4">
            <label className="flex flex-col">
              Password:
              <input
                className="bg-antiquewhite rounded-sm p-2"
                type="password"
                name="password"
                required
              />
            </label>
            {actionData?.errors?.password ? (
              <em className="text-red-500">{actionData?.errors.password[0]}</em>
            ) : null}
          </p>
          <button
            className="my-4 px-4 py-2 rounded-sm bg-antiquewhite"
            type="submit"
          >
            Login
          </button>
        </Form>
      </div>
    </>
  );
}
