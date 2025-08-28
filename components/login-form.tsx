'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react";
import Image from "next/image"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-zinc-500 text-balance dark:text-zinc-400">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="after:border-zinc-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-zinc-800">
                <span className="bg-white text-zinc-500 relative z-10 px-2 dark:bg-zinc-950 dark:text-zinc-400">
                  Or continue with
                </span>
              </div>
              <div className="">
                <Button className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" variant="outline" type="button"  onClick={()=> signIn("google", { callbackUrl: '/dashboard/market' })}>
                    I<Image alt="" src="https://www.svgrepo.com/show/475656/google-color.svg" width={24} height={24}></Image>
                    <span>Login with Google</span>
                </Button>
                
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{""}
                <Link href={"/register"} className="underline underline-offset-4">
                Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-zinc-100 relative hidden md:block dark:bg-zinc-800">
            <Image src={"/placeholder.svg"} alt="Image"  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" width={80} height={80}></Image>
          </div>
        </CardContent>
      </Card>
      <div className="text-zinc-500 *:[a]:hover:text-zinc-900 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 dark:text-zinc-400 dark:*:[a]:hover:text-zinc-50">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{""}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
