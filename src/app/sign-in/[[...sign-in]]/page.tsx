import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12">
      <SignIn path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
