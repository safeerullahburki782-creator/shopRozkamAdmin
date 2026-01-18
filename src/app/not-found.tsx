"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className="min-h-full px-4 py-16 sm:px-6 sm:py-52 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="bg-gradient-to-br from-green-500 to-green-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-green-600 sm:text-5xl">
                Coming Soon
              </h1>
              <p className="mt-6 text-base">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-6 flex md:justify-center space-x-3 sm:pl-6">
              <Button
                size="lg"
                variant="outline"
                className="text-md flex text-white hover:text-white items-center justify-center bg-gradient-to-br from-green-400 to-green-600 
                shadow-sm hover:bg-gradient-to-br hover:from-green-600 hover:to-green-400"
                onClick={() => router.back()}
              >
                <Icon name="MoveLeft" size={25} className="mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Custom404;
