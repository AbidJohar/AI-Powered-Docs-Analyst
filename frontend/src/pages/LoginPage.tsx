import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLogin as useGoogleLoginMutation } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
    const { mutate: googleLogin, isPending } = useGoogleLoginMutation();

    const login = useGoogleLogin({
        onSuccess: (response) => {
            console.log("Response:", response);
            googleLogin(response.code)
        },
        flow: "auth-code",
    });

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#08060d]">
            <div className="flex flex-col items-center gap-8 p-10 r  bg-[#08060d] w-full max-w-sm">

                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-blue-500 font-bold text-xl tracking-tighter">
                        DocAnalyst.ai
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Sign in to continue
                    </p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={() => login()}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-7 h-7"
                        />
                    )}
                    {isPending ? "Signing in…" : "Continue with Google"}
                </button>

                <p className="text-slate-600 text-xs text-center">
                    By signing in you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

export default LoginPage;