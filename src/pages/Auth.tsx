import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sign-in";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {mode === "sign-up" ? "Sign Up" : "Sign In"}
        </h1>
        <p className="text-muted-foreground">Authentication page - Coming soon</p>
      </div>
    </div>
  );
};

export default Auth;
