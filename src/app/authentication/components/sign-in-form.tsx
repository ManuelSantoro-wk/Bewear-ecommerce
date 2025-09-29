"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email("E-mail inválido!"),
  password: z.string("Senha inválida!").min(8, "Senha inválida!"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  // Preencher e-mail e senha se estiverem guardados
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      form.setValue("email", rememberedEmail);
      form.setValue("password", atob(rememberedPassword));
      form.setValue("remember", true);
    }
  }, [form]);

  async function onSubmit(values: FormValues) {
    try {
      setLoadingEmail(true);

      // Guardar ou remover e-mail e senha do localStorage
      if (values.remember) {
        localStorage.setItem("rememberedEmail", values.email);
        localStorage.setItem("rememberedPassword", btoa(values.password));
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => router.push("/"),
          onError: (ctx) => {
            if (ctx.error.code === "USER_NOT_FOUND") {
              toast.error("E-mail não encontrado.");
              return form.setError("email", {
                message: "E-mail não encontrado.",
              });
            }
            if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              toast.error("E-mail ou senha inválidos.");
              form.setError("password", {
                message: "E-mail ou senha inválidos.",
              });
              return form.setError("email", {
                message: "E-mail ou senha inválidos.",
              });
            }
            toast.error(ctx.error.message);
          },
        },
      });
    } finally {
      setLoadingEmail(false);
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      await authClient.signIn.social({ provider: "google" });
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Faça login para continuar.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid gap-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const [showPassword, setShowPassword] = useState(false);

                return (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Remember me */}
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={field.value ?? false} // <- garantir que nunca seja undefined
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel htmlFor="remember" className="mb-0">
                    Lembrar-me
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full"
              disabled={loadingEmail}
            >
              {loadingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full cursor-pointer rounded-full"
              onClick={handleSignInWithGoogle}
              type="button"
              disabled={loadingGoogle}
            >
              {loadingGoogle ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 533.5 544.3" className="mr-2 h-4 w-4">
                    <path
                      fill="#4285F4"
                      d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95h147.1c-6.4 34-25.7 62.7-54.6 82l88.3 68c51.5-47.5 81.7-117.6 81.7-194.8z"
                    />
                    <path
                      fill="#34A853"
                      d="M272 544.3c73.4 0 134.9-24.3 179.8-66l-88.3-68c-24.5 16.5-55.8 26-91.5 26-70.3 0-129.8-47.4-151-111.2l-89.3 69.1c44.5 88.3 136.4 150.1 240.3 150.1z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M121 323.2c-10.6-31.5-10.6-65.7 0-97.2l-89.3-69.1C3.6 221 0 247.5 0 278.4s3.6 57.5 31.7 121.5l89.3-69.1z"
                    />
                    <path
                      fill="#EA4335"
                      d="M272 109.7c37.7-.6 73.7 13.5 101.2 38.8l76-76.2C403 25.6 344.6 0 272 0 168.1 0 76.2 61.8 31.7 150.1l89.3 69.1c21.2-63.8 80.7-111.2 151-111.5z"
                    />
                  </svg>
                  Entrar com Google
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignInForm;
